(()=>{
 function fitVisibleViewport(){const viewport=window.visualViewport;if(viewport&&viewport.scale!==1)return;const height=viewport?viewport.height:window.innerHeight,width=Math.min(document.documentElement.clientWidth,520),artHeight=Math.max(height,width*1.5);const style=document.documentElement.style;style.setProperty('--app-height',height+'px');style.setProperty('--art-height',artHeight+'px');style.setProperty('--art-top',((height-artHeight)/2)+'px');}
 fitVisibleViewport();addEventListener('resize',fitVisibleViewport);window.visualViewport?.addEventListener('resize',fitVisibleViewport);
 const $=s=>document.querySelector(s),frames={},ready={};let view='title',returnView='title',rankingWait;
 const portraits={ex:"/Eta/ex/assets/boss-description.png","sword": "/Eta/ui/sword-8c37e5d1eda9.png", "spear": "/Eta/ui/spear-48ae05afb869.png"};
 const names={sword:'剣ステージ',spear:'槍ステージ',ex:'剣EXステージ'};
 const content={ex:{text:'強力なボスに挑む高難度ステージ。奥義「バースト」は「バースト状態」を付与し、攻撃力が2倍になる。「バースト」状態の間に再度奥義アイコンをタップする事でバースト三連撃が発動。また、スキルヒットでボスはノックバックする。',skills:[['スキル','大陸斬','3（バースト時：6）'],['スキル','水波斬','2（バースト時：4）'],['奥義','バースト','10秒間バーストモードになる'],['奥義','バースト三連撃','6×3連撃']]},sword:{text:'範囲攻撃と単体攻撃を使い分ける、バランスの取れた近接戦闘ステージ。',skills:[['スキル','水波斬','2','横一線'],['スキル','大陸斬','3','前方'],['奥義','渾身のストラッシュ','10','前方広範囲・遠距離']]},spear:{text:'射程の長さや連続性のあるスキルを使い分けるステージ。',skills:[['スキル','五月雨','1発2 × 4連撃','近接広範囲'],['スキル','回転閃','近距離1／中距離3／遠距離5','長距離'],['奥義','渾身の急所突き','距離に応じて5／8／10／15','遠距離']]}};
 function show(next){clearInterval(rankingWait);rankingWait=null;view=next;for(const id of ['title','stages','panel'])$('#'+id).hidden=id!==next;window.scrollTo(0,0);}
 function preload(stages=['ex']){for(const stage of stages)if(!frames[stage]){const frame=document.createElement('iframe');frame.title=names[stage];frame.allow='autoplay';frame.src='/Eta/'+stage+'/Eta/index.html';frames[stage]=frame;$('#games').append(frame);}}
 function select(){show('stages');preload();}
 $('#toStages').onclick=select;$('#toTitle').onclick=()=>show('title');$('#closeCharacter').onclick=()=>$('#character').hidden=true;
 function openCharacter(stage){const data=content[stage];$('#loadStatus').textContent='';$('#character').dataset.stage=stage;const portrait=new Image();portrait.id='characterArt';portrait.alt=names[stage]+'のキャラクター';portrait.hidden=true;$('#characterArt').replaceWith(portrait);portrait.src=portraits[stage];portrait.decode().then(()=>{if($('#characterArt')===portrait)portrait.hidden=false;}).catch(()=>{if($('#characterArt')===portrait)$('#loadStatus').textContent='キャラクター画像を読み込めませんでした。アイコンをもう一度押してください。';});$('#characterTitle').textContent=names[stage];$('#characterText').textContent=data.text;$('#characterDamageHeading').textContent=stage==='ex'?'与ダメージ・効果':'与ダメージ';$('#characterRangeHeading').hidden=stage==='ex';$('#skillRows').replaceChildren(...data.skills.map(row=>{const tr=document.createElement('tr');for(const cell of row){const td=document.createElement('td');td.textContent=cell;tr.append(td)}return tr}));$('#character').hidden=false;}
 document.querySelectorAll('[data-character]').forEach(button=>button.onclick=()=>openCharacter(button.dataset.character));
 document.querySelectorAll('[data-start]').forEach(button=>button.onclick=()=>{const stage=button.dataset.start;preload([stage]);const frame=frames[stage];if(!ready[stage]){button.disabled=true;button.textContent='読込中…';return;}frame.classList.add('active');document.body.classList.add('playing');frame.contentWindow.dispatchEvent(new Event('resize'));if(!frame.contentWindow.GameBridge.start()){frame.classList.remove('active');document.body.classList.remove('playing');$('#loadStatus').textContent='素材の読み込みを待って、もう一度スタートしてください。';}else frame.contentWindow.focus();});
 addEventListener('message',event=>{if(event.origin!==location.origin)return;const data=event.data,frame=frames[data?.stage];if(!frame||event.source!==frame.contentWindow)return;if(data.type==='game-ready'){ready[data.stage]=true;const b=$('[data-start="'+data.stage+'"]');b.disabled=false;b.textContent='スタート';}if(data.type==='game-return'){frame.classList.remove('active');document.body.classList.remove('playing');select();}});
 function panel(title){returnView=view;$('#panelTitle').textContent=title;$('#panelBody').replaceChildren();$('#panelBody').className='';show('panel');}
 $('#closePanel').onclick=()=>show(returnView);
 function openRanking(stage){
  panel(names[stage]+' ランキング');preload([stage]);
  const body=document.createElement('div');body.textContent='ランキングを読み込み中…';body.setAttribute('role','status');$('#panelBody').append(body);
  function load(){
   if(view!=='panel'||!$('#panelBody').contains(body)){clearInterval(rankingWait);rankingWait=null;return;}
   const ranking=frames[stage]?.contentWindow.GameRanking;
   if(!ranking)return;
   clearInterval(rankingWait);rankingWait=null;body.removeAttribute('role');ranking.open(body);
  }
  rankingWait=setInterval(load,100);load();
 }
 document.querySelectorAll('[data-ranking]').forEach(button=>button.onclick=()=>openRanking(button.dataset.ranking));

 const guidePages=[['guide-page-1.webp','ゲーム概要'],['guide-page-2-v2.webp','スーパーダッシュ'],['guide-page-3.webp','ハイスコアを狙おう'],['guide-page-4.webp','ランキングに登録しよう']];
 let guidePage=0;
 function showGuidePage(index){
  guidePage=Math.max(0,Math.min(guidePages.length-1,index));
  const [file,label]=guidePages[guidePage],img=new Image();img.id='helpImage';img.alt=label;img.hidden=true;img.draggable=false;$('#helpImage').replaceWith(img);img.src='/Eta/sword/assets/'+file;
  img.decode().then(()=>{if($('#helpImage')===img)img.hidden=false;}).catch(()=>{if($('#helpImage')===img){img.hidden=false;img.alt='画像を読み込めませんでした。ゲーム説明を開き直してください。';}});
  $('#helpPrev').hidden=guidePage===0;$('#helpNext').hidden=guidePage===guidePages.length-1;$('#helpCount').textContent=(guidePage+1)+' / '+guidePages.length;
 }
 function openGuide(){
  panel('ゲーム説明');$('#panelBody').className='help-images';
  $('#panelBody').innerHTML='<div class="help-art"><img id="helpImage" alt=""><button id="helpPrev" aria-label="前のページ"><span aria-hidden="true">‹</span></button><button id="helpNext" aria-label="次のページ"><span aria-hidden="true">›</span></button><output id="helpCount" aria-live="polite"></output></div>';
  $('#helpPrev').onclick=()=>showGuidePage(guidePage-1);$('#helpNext').onclick=()=>showGuidePage(guidePage+1);showGuidePage(0);
 }
 document.querySelectorAll('[data-panel]').forEach(button=>button.onclick=()=>{
  if(button.dataset.panel==='help')openGuide();
  else if(button.dataset.panel==='x-post'){panel('Xポスト');$('#panelBody').textContent='更新待ち';}
  else{panel('更新情報');$('#panelBody').innerHTML='<ul class="release-list"><li><span class="release-date">2026/09/23</span><span>初回リリース・剣ステージ実装</span></li><li><span class="release-date">2026/10/03</span><span>槍ステージ実装</span></li><li><span class="release-date">2026/10/11</span><span>剣EXステージ実装</span></li></ul>';}
 });
 addEventListener('keydown',event=>{if(view!=='panel'||!$('#panelBody').classList.contains('help-images'))return;if(event.key==='ArrowRight'){event.preventDefault();showGuidePage(guidePage+1);}if(event.key==='ArrowLeft'){event.preventDefault();showGuidePage(guidePage-1);}});
 if(location.hash==='#stages')select();
})();
