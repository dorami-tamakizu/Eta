(()=>{
 function fitVisibleViewport(){const viewport=window.visualViewport;if(viewport&&viewport.scale!==1)return;const height=viewport?viewport.height:window.innerHeight,width=Math.min(document.documentElement.clientWidth,520),artHeight=Math.max(height,width*1.5);const style=document.documentElement.style;style.setProperty('--app-height',height+'px');style.setProperty('--art-height',artHeight+'px');style.setProperty('--art-top',((height-artHeight)/2)+'px');}
 fitVisibleViewport();addEventListener('resize',fitVisibleViewport);window.visualViewport?.addEventListener('resize',fitVisibleViewport);
 const $=s=>document.querySelector(s),frames={},ready={};let view='title',returnView='title',rankingWait;
 const portraits={spell:"/Eta/spell/assets/heroBaseCorrect.png",ex:"/Eta/ex/assets/boss-description.png","sword": "/Eta/ui/sword-8c37e5d1eda9.png", "spear": "/Eta/ui/spear-48ae05afb869.png"};
 const names={spell:'呪文ステージ',sword:'剣ステージ',spear:'槍ステージ',ex:'剣EXステージ'};
 const content={spell:{text:'呪文による遠距離攻撃で爽快に駆け抜けるステージ。素早い操作と呪文反射バリアが攻略のカギ。',skills:[['スキル','速炎球','2','前方・射程45'],['スキル','氷塊球','2','前方・射程20'],['奥義','四肢炎弾','2×4発','前方・射程45\n高確率マヒ'],['バリア','呪文反射','反射3回','呪文のみ'] ]},ex:{text:'強力なボスに挑む高難度ステージ。奥義「バースト」は「バースト状態」を付与し、攻撃力が2倍になる。「バースト」状態の間に再度奥義アイコンをタップする事でバースト三連撃が発動。また、スキルヒットでボスはノックバックする。',skills:[['スキル','大陸斬','3（バースト時：6）'],['スキル','水波斬','2（バースト時：4）'],['奥義','バースト','10秒間バーストモードになる'],['奥義','バースト三連撃','6×3連撃']]},sword:{text:'範囲攻撃と単体攻撃を使い分ける、バランスの取れた近接戦闘ステージ。',skills:[['スキル','水波斬','2','横一線'],['スキル','大陸斬','3','前方'],['奥義','渾身のストラッシュ','10','前方広範囲・遠距離']]},spear:{text:'射程の長さや連続性のあるスキルを使い分けるステージ。',skills:[['スキル','五月雨','2×4発','近接広範囲'],['スキル','回転閃','距離に応じて\n1/3/5','長距離'],['奥義','渾身の急所突き','距離に応じて\n5/8/10/15','遠距離']]}};
 async function prepareSpellPortrait(portrait){
  const canvas=document.createElement('canvas');canvas.width=portrait.naturalWidth;canvas.height=portrait.naturalHeight;const ctx=canvas.getContext('2d');ctx.drawImage(portrait,0,0);const pixels=ctx.getImageData(0,0,canvas.width,canvas.height),d=pixels.data;
  for(let i=0;i<d.length;i+=4){const mn=Math.min(d[i],d[i+1],d[i+2]),mx=Math.max(d[i],d[i+1],d[i+2]);if(mn>240)d[i+3]=0;else if(mn>205&&mx-mn<24)d[i+3]*=(240-mn)/35;}ctx.putImageData(pixels,0,0);
  const blob=await new Promise(resolve=>canvas.toBlob(resolve));canvas.width=canvas.height=1;if(!blob)return;const url=URL.createObjectURL(blob);portrait.src=url;await portrait.decode();URL.revokeObjectURL(url);if($('#characterArt')===portrait)portrait.hidden=false;
 }
 function show(next){clearInterval(rankingWait);rankingWait=null;view=next;for(const id of ['title','stages','panel'])$('#'+id).hidden=id!==next;window.scrollTo(0,0);}
 function preload(stages=['ex']){for(const stage of stages)if(!frames[stage]){const frame=document.createElement('iframe');frame.title=names[stage];frame.allow='autoplay';frame.src='/Eta/'+stage+'/index.html?v=spell-shell-v3';frames[stage]=frame;$('#games').append(frame);}}
 function select(){show('stages');preload();}
 $('#toStages').onclick=select;$('#toTitle').onclick=()=>show('title');$('#closeCharacter').onclick=()=>$('#character').hidden=true;
 function openCharacter(stage){const data=content[stage];$('#loadStatus').textContent='';$('#character').dataset.stage=stage;const portrait=new Image();portrait.id='characterArt';portrait.alt=names[stage]+'のキャラクター';portrait.hidden=true;$('#characterArt').replaceWith(portrait);portrait.src=portraits[stage];portrait.decode().then(()=>{if(stage==='spell')return prepareSpellPortrait(portrait);if($('#characterArt')===portrait)portrait.hidden=false;}).catch(()=>{if($('#characterArt')===portrait)$('#loadStatus').textContent='キャラクター画像を読み込めませんでした。アイコンをもう一度押してください。';});$('#characterTitle').textContent=names[stage];$('#characterText').textContent=data.text;$('#characterDamageHeading').textContent=stage==='ex'?'与ダメージ・効果':'与ダメージ';$('#characterRangeHeading').hidden=stage==='ex';$('#skillRows').replaceChildren(...data.skills.map(row=>{const tr=document.createElement('tr');for(const cell of row){const td=document.createElement('td');td.textContent=cell;tr.append(td)}return tr}));$('#characterTrait').textContent=stage==='ex'?'ステージ特性：ボスをノックバックさせるとスーパーダッシュを発動できる。':'';$('#characterTrait').hidden=stage!=='ex';$('#character').hidden=false;}
 document.querySelectorAll('[data-character]').forEach(button=>button.onclick=()=>openCharacter(button.dataset.character));
 document.querySelectorAll('[data-start]').forEach(button=>button.onclick=()=>{const stage=button.dataset.start;preload([stage]);const frame=frames[stage];if(!ready[stage]){button.disabled=true;button.textContent='読込中…';return;}frame.classList.add('active');document.body.classList.add('playing');frame.contentWindow.dispatchEvent(new Event('resize'));if(!frame.contentWindow.GameBridge.start()){frame.classList.remove('active');document.body.classList.remove('playing');$('#loadStatus').textContent='素材の読み込みを待って、もう一度スタートしてください。';}else frame.contentWindow.focus();});
 addEventListener('message',event=>{if(event.origin!==location.origin)return;const data=event.data,frame=frames[data?.stage];if(!frame||event.source!==frame.contentWindow)return;if(data.type==='game-ready'){ready[data.stage]=true;const b=$('[data-start="'+data.stage+'"]');b.disabled=false;b.textContent='スタート';}if(data.type==='game-return'){frame.classList.remove('active');document.body.classList.remove('playing');select();}});
 function panel(title){$('#panel').classList.remove('guide-fullscreen');returnView=view;$('#panelTitle').textContent=title;$('#panelBody').replaceChildren();$('#panelBody').className='';show('panel');}
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

 const totalStages=[['sword','rankings'],['spear','rankings_spear'],['spell','rankings_spell'],['ex','rankings_sword_ex']];
 function combineStageRecords(groups){
  const players=new Map();
  groups.forEach((records,index)=>{const stage=totalStages[index][0];for(const record of records){
   if(typeof record.name!=='string'||!Number.isFinite(Number(record.total_score)))throw Error('Invalid record');
   let player=players.get(record.name);if(!player){player={name:record.name,stages:{},total:0};players.set(record.name,player);}
   const prior=player.stages[stage];
   if(!prior||Number(record.total_score)>Number(prior.total_score))player.stages[stage]=record;
  }});
  for(const player of players.values())player.total=Object.values(player.stages).reduce((sum,r)=>sum+Number(r.total_score),0);
  return [...players.values()].sort((a,b)=>b.total-a.total||a.name.localeCompare(b.name,'ja')).slice(0,100);
 }
 async function readTotalStage(table,signal){
  const result=[];let offset=0;
  for(;;){
   const response=await fetch('https://vowuqobawshmobylzxas.supabase.co/rest/v1/'+table+'?select=name,total_score,road_time,id,created_at&order=created_at.asc,id.asc&limit=100&offset='+offset,{headers:{apikey:'sb_publishable_ToJdN1C3qeyYphxZj0ESMA_owNBV9kg'},signal});
   if(!response.ok)throw Error('Ranking read failed');const rows=await response.json();if(!Array.isArray(rows))throw Error('Invalid response');
   result.push(...rows);if(rows.length<100)return result;offset+=rows.length;
  }
 }
 function totalRankingHTML(players){
  const escape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const number=value=>Number(value).toLocaleString('ja-JP');
  return '<ol class="shared-ranking total-ranking">'+players.map((player,index)=>{
   const metal=['gold','silver','bronze'][index],id='total-detail-'+index;
   const detail=totalStages.map(([stage])=>{const record=player.stages[stage];const time=!record?'未登録':stage==='ex'?'道中なし':record.road_time!=null&&Number.isFinite(Number(record.road_time))?'道中'+Number(record.road_time).toFixed(2)+'秒':'道中未記録';return '<li><span class="total-stage-row"><span>'+names[stage]+'</span><span>：</span><span class="total-stage-score">'+number(record?record.total_score:0)+'点</span><span>（'+time+'）</span></span></li>';}).join('');
   return '<li class="rank-card '+(metal||'standard')+'"><div class="rank-card-header">'+(metal?'<span class="rank-cup cup-'+metal+'" aria-hidden="true"></span>':'')+'<span class="rank-position">'+(index+1)+'位</span><span class="rank-name" style="--name-length:'+Math.max(1,Array.from(player.name).length)+'">'+escape(player.name)+'</span></div><div class="rank-score-row"><span class="rank-score-label">合計スコア</span><strong class="rank-total">'+number(player.total)+'</strong><button type="button" class="rank-detail-button" aria-label="'+escape(player.name)+' の総合スコア詳細" aria-expanded="false" aria-controls="'+id+'">詳細</button></div><div id="'+id+'" class="rank-detail-body" hidden><ul class="total-stage-list">'+detail+'</ul></div></li>';
  }).join('')+'</ol>'+(!players.length?'<p>まだ登録された記録はありません。</p>':'')+'<button type="button" class="btn rank-refresh">更新</button>';
 }
 function openTotalRanking(){
  panel('総合ランキング');const body=document.createElement('div');$('#panelBody').append(body);let requestId=0,controller;
  async function refresh(){
   const id=++requestId;controller?.abort();controller=new AbortController();const active=controller;const timer=setTimeout(()=>active.abort(),20000);
   body.innerHTML='<p role="status">総合ランキングを読み込み中…</p>';
   try{const groups=await Promise.all(totalStages.map(([,table])=>readTotalStage(table,active.signal)));if(id!==requestId||!body.isConnected)return;body.innerHTML=totalRankingHTML(combineStageRecords(groups));}
   catch(error){active.abort();if(id!==requestId||!body.isConnected)return;body.innerHTML='<p role="alert">総合ランキングを読み込めませんでした。</p><button type="button" class="btn rank-refresh">再読み込み</button>';}
   finally{clearTimeout(timer);}
  }
  body.onclick=event=>{
   const button=event.target.closest('button');if(!button||!body.contains(button))return;
   if(button.classList.contains('rank-refresh')){refresh();return;}
   if(button.classList.contains('rank-detail-button')){const expanded=button.getAttribute('aria-expanded')==='true';button.setAttribute('aria-expanded',String(!expanded));button.closest('.rank-card').querySelector('.rank-detail-body').hidden=expanded;}
  };
  refresh();
 }
 $('#totalRanking').onclick=openTotalRanking;

 const guidePages=[['guide-page-1.webp','ゲーム概要'],['guide-page-2-v2.webp','スーパーダッシュ'],['guide-page-3.webp','ハイスコアを狙おう'],['guide-page-4.webp','ランキングに登録しよう']];
 let guidePage=0;
 function showGuidePage(index){
  guidePage=Math.max(0,Math.min(guidePages.length-1,index));
  const [file,label]=guidePages[guidePage],img=new Image();img.id='helpImage';img.alt=label;img.hidden=true;img.draggable=false;$('#helpImage').replaceWith(img);img.src='/Eta/sword/assets/'+file;
  img.decode().then(()=>{if($('#helpImage')===img)img.hidden=false;}).catch(()=>{if($('#helpImage')===img){img.hidden=false;img.alt='画像を読み込めませんでした。ゲーム説明を開き直してください。';}});
  $('#helpPrev').hidden=guidePage===0;$('#helpNext').hidden=guidePage===guidePages.length-1;$('#helpCount').textContent=(guidePage+1)+' / '+guidePages.length;
 }
 function openGuide(){
  panel('');$('#panel').classList.add('guide-fullscreen');$('#panelBody').className='help-images';
  $('#panelBody').innerHTML='<div class="help-art"><img id="helpImage" alt=""><button id="helpPrev" aria-label="前のページ"><span aria-hidden="true">‹</span></button><button id="helpNext" aria-label="次のページ"><span aria-hidden="true">›</span></button><output id="helpCount" aria-live="polite"></output></div>';
  $('#helpPrev').onclick=()=>showGuidePage(guidePage-1);$('#helpNext').onclick=()=>showGuidePage(guidePage+1);showGuidePage(0);
 }
 document.querySelectorAll('[data-panel]').forEach(button=>button.onclick=()=>{
  if(button.dataset.panel==='help')openGuide();
  else if(button.dataset.panel==='x-post'){panel('Xポスト');$('#panelBody').textContent='更新待ち';}
  else{panel('更新情報');$('#panelBody').innerHTML='<ul class="release-list"><li><span class="release-date">2026/09/23</span><span>初回リリース・剣ステージ実装</span></li><li><span class="release-date">2026/10/03</span><span>槍ステージ実装</span></li><li><span class="release-date">2026/10/11</span><span>剣EXステージ実装</span></li><li><span class="release-date">2026/10/13</span><span>総合ランキング実装</span></li></ul>';}
 });
 addEventListener('keydown',event=>{if(view!=='panel'||!$('#panelBody').classList.contains('help-images'))return;if(event.key==='ArrowRight'){event.preventDefault();showGuidePage(guidePage+1);}if(event.key==='ArrowLeft'){event.preventDefault();showGuidePage(guidePage-1);}});
 if(location.hash==='#stages')select();
})();
