// Public client key. Database RLS permits only public reads and new submissions.
(()=>{
  const API='https://vowuqobawshmobylzxas.supabase.co/rest/v1/rankings';
  const KEY='sb_publishable_ToJdN1C3qeyYphxZj0ESMA_owNBV9kg';
  const $=s=>document.querySelector(s),esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const number=n=>Number(n).toLocaleString('ja-JP');
  let result=null,loadId=0;
  async function request(query,body){
    const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),15000);
    try{
      const response=await fetch(API+query,{method:body?'POST':'GET',headers:{apikey:KEY,...(body?{'Content-Type':'application/json',Prefer:'return=representation'}:{})},body:body?JSON.stringify(body):undefined,signal:controller.signal});
      if(!response.ok){
        // Old database schemas reject this field before inserting anything.
        if(response.status===400&&body&&Object.prototype.hasOwnProperty.call(body,'road_time')){
          const info=await response.json().catch(()=>({}));
          if(info.code==='PGRST204'&&String(info.message).includes('road_time')){const {road_time,...legacy}=body;return request(query,legacy);}
        }
        const error=new Error('HTTP '+response.status);error.rejected=response.status>=400&&response.status<500;throw error;}
      return await response.json();
    }finally{clearTimeout(timer);}
  }
  function setResult(ok,data){
    result=ok?{data:{...data},state:'ready',message:''}:null;
    $('#registerScore').hidden=!ok;
    $('#registerScore').textContent='名前を入力してランキング登録';
    $('#registerScore').disabled=false;
    $('#scoreEntry').classList.add('hide');
  }
  function renderEntry(){
    if(!result)return;
    $('#entryTotal').textContent=number(result.data.time_score+result.data.skill_score+result.data.damage_taken_score+result.data.damage_dealt_score);
    $('#entryStatus').textContent=result.message;
    $('#submitScore').disabled=result.state!=='ready';
    $('#playerName').disabled=result.state!=='ready';
    $('#submitScore').textContent=result.state==='pending'?'登録中…':result.state==='saved'?'登録済み':'登録';
  }
  function openEntry(){if(!result)return;$('#scoreEntry').classList.remove('hide');renderEntry();$('#playerName').focus();}
  function closeEntry(){$('#scoreEntry').classList.add('hide');$('#registerScore').focus();}
  async function submit(event){
    event.preventDefault();const current=result;if(!current||current.state!=='ready')return;
    const name=$('#playerName').value.trim();
    if(!name||Array.from(name).length>20){current.message='名前は1〜20文字で入力してください。';renderEntry();return;}
    current.state='pending';current.message='登録しています…';renderEntry();
    try{
      const rows=await request('',{name,...current.data});
      if(!Array.isArray(rows)||(rows.length>0&&!rows[0]?.id))throw new Error('Missing receipt');
      current.state='saved';current.message=rows.length===0?'受付が完了しました。同じ名前の記録は、トータルスコアが高い場合だけ更新されます。':'送信が完了しました。上位100位以内の記録がランキングに残ります。';
      if(result===current){$('#registerScore').textContent='ランキング送信済み';$('#registerScore').disabled=true;}
    }catch(error){
      current.state=error.rejected?'ready':'unknown';
      current.message=error.rejected?'登録できませんでした。時間をおいて再度お試しください。':'登録結果を確認できませんでした。二重登録を避けるため、タイトルのランキングをご確認ください。';
    }
    if(result===current)renderEntry();
  }
  function detail(r){
    const rows=[['クリアタイム',Number(r.clear_time).toFixed(2)+'秒',r.time_score],['スキルフィニッシュ',number(r.skill_finishes)+'回',r.skill_score],['被ダメージ',number(r.damage_taken),r.damage_taken_score],['与ダメージ',number(r.damage_dealt),r.damage_dealt_score]];
    return '<table class="rank-breakdown"><thead><tr><th>項目</th><th>記録</th><th>スコア</th></tr></thead><tbody>'+rows.map(([label,value,points])=>'<tr><th>'+label+'</th><td>'+value+'</td><td>'+number(points)+'</td></tr>').join('')+'</tbody></table><p>道中クリアタイム：'+(r.road_time!=null&&Number.isFinite(Number(r.road_time))?Number(r.road_time).toFixed(2)+'秒':'未記録')+'</p><p>オーバーキル分：'+number(r.overkill)+'（与ダメージに含む）</p><p>トータルスコア：'+number(r.total_score)+'</p>';
  }
  const HONORS=[['gold','覇者'],['silver','英雄'],['bronze','達人']];
  function cup(metal){return '<span class="rank-cup cup-'+metal+'" aria-hidden="true"></span>';}
  function rankingHTML(rows){
    return (rows.length?'<ol class="shared-ranking">'+rows.map((r,i)=>{
      const honor=HONORS[i],title=honor?honor[1]:i<10?'十傑':i<30?'英傑':'';
      const icon=honor?cup(honor[0]):i<10?'<span class="rank-medal" aria-hidden="true">🎖️</span>':i<30?'<span class="rank-medal" aria-hidden="true">🚩</span>':'';
      return '<li class="rank-card '+(honor?honor[0]:'standard')+'"><div class="rank-card-header">'+icon+'<span class="rank-position">'+(i+1)+'位</span><span class="rank-name" style="--name-length:'+Math.max(1,Array.from(String(r.name)).length)+'">'+esc(r.name)+'</span></div><details><summary aria-label="'+esc(r.name)+' のスコア詳細"><span class="rank-score-label">'+(title?(i<10?'<span class="rank-honor">'+title+'</span> ':title+' '):'')+'トータルスコア</span><strong class="rank-total">'+number(r.total_score).replace(/,/g,'.')+'</strong><span class="rank-detail-button">詳細</span></summary><div class="rank-detail-body">'+detail(r)+'</div></details></li>';
    }).join('')+'</ol>':'<p class="rank-empty">まだ登録された記録はありません。<br>クリアして最初の記録を登録しよう！</p>')+'<button type="button" class="btn rank-refresh">更新</button>';
  }
  async function open(body){
    const id=++loadId;body.innerHTML='<p role="status">ランキングを読み込み中…</p>';
    try{
      const rows=await request('?select=*&order=total_score.desc,created_at.asc,id.asc&limit=100');
      if(!Array.isArray(rows))throw new Error('Invalid ranking');
      if(id!==loadId)return;body.innerHTML=rankingHTML(rows);
    }catch(_){if(id!==loadId)return;body.innerHTML='<p role="alert">ランキングを読み込めませんでした。通信状態を確認して再度お試しください。</p><button type="button" class="btn rank-refresh">再読み込み</button>';}
    body.querySelector('.rank-refresh').onclick=()=>open(body);
  }
  $('#registerScore').onclick=openEntry;$('#scoreEntryClose').onclick=closeEntry;$('#scoreEntryForm').onsubmit=submit;
  $('#scoreEntry').addEventListener('keydown',e=>{
    if(e.key==='Escape'){e.preventDefault();closeEntry();}
    if(e.key==='Tab'){const nodes=Array.from($('#scoreEntry').querySelectorAll('input:not(:disabled),button:not(:disabled)'));const i=nodes.indexOf(document.activeElement);e.preventDefault();nodes[(i+(e.shiftKey?-1:1)+nodes.length)%nodes.length].focus();}
  });
  window.GameRanking={setResult,open};
})();
