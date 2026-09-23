const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const nodes=new Map(),node=()=>({hidden:false,disabled:false,value:'',textContent:'',innerHTML:'',classList:{add(){},remove(){}},focus(){},addEventListener(){},querySelector(){return node();}}),$=s=>{if(!nodes.has(s))nodes.set(s,node());return nodes.get(s);};
let calls=[],resolvePost,mode='ok';
const record={id:'record-one',name:'<img src=x onerror=alert(1)>',clear_time:50,road_time:23.77,skill_finishes:60,damage_taken:12,damage_dealt:308,overkill:94,time_score:3200000,skill_score:393443,damage_taken_score:100000,damage_dealt_score:143925,total_score:3837368};
const context={window:{},document:{querySelector:$},AbortController,setTimeout,clearTimeout,fetch:async(url,opts)=>{calls.push({url,opts});if(opts.method==='POST')return new Promise(r=>resolvePost=r);if(mode==='error')throw Error('offline');return{ok:true,json:async()=>[record]};}};
vm.runInNewContext(fs.readFileSync(__dirname+'/../ranking.js','utf8'),context);const g=context.window.GameRanking;
(async()=>{
 const data={...record};delete data.name;delete data.id;delete data.total_score;
 g.setResult(false,data);assert.equal($('#registerScore').hidden,true);
 g.setResult(true,data);assert.equal($('#registerScore').hidden,false);$('#registerScore').onclick();assert.equal($('#entryTotal').textContent,'3,837,368');
 $('#playerName').value=' ';await $('#scoreEntryForm').onsubmit({preventDefault(){}});assert.equal(calls.length,0);
 $('#playerName').value=' A ';const pending=$('#scoreEntryForm').onsubmit({preventDefault(){}});await $('#scoreEntryForm').onsubmit({preventDefault(){}});assert.equal(calls.length,1);assert.equal(JSON.parse(calls[0].opts.body).name,'A');assert.equal(JSON.parse(calls[0].opts.body).overkill,94);assert.equal(JSON.parse(calls[0].opts.body).road_time,23.77);assert.equal(JSON.parse(calls[0].opts.body).total_score,undefined);
 resolvePost({ok:true,json:async()=>[{id:'one'}]});await pending;assert.equal($('#registerScore').disabled,true);await $('#scoreEntryForm').onsubmit({preventDefault(){}});assert.equal(calls.length,1);
 const body=node();await g.open(body);assert(body.innerHTML.includes('&lt;img'));assert(!body.innerHTML.includes('<img'));assert(body.innerHTML.includes('<details>'));assert(body.innerHTML.includes('3,837,368'));assert(body.innerHTML.includes('143,925'));assert(body.innerHTML.includes('94'));assert(calls[1].url.includes('order=total_score.desc'));
 assert(body.innerHTML.includes('道中クリアタイム：23.77秒'));record.road_time=null;await g.open(body);assert(body.innerHTML.includes('道中クリアタイム：未記録'));
 mode='error';await g.open(body);assert(body.innerHTML.includes('再読み込み'));
 g.setResult(true,data);$('#playerName').value='B';const failure=$('#scoreEntryForm').onsubmit({preventDefault(){}});resolvePost({ok:false,status:400,json:async()=>({})});await failure;assert.equal($('#submitScore').disabled,false);
 const uncertain=$('#scoreEntryForm').onsubmit({preventDefault(){}});resolvePost({ok:true,json:async()=>{throw Error('lost response')}});await uncertain;assert.equal($('#submitScore').disabled,true);assert($('#entryStatus').textContent.includes('二重登録'));
 // A response from the previous result cannot change a new run's submission UI.
 g.setResult(true,data);const old=$('#scoreEntryForm').onsubmit({preventDefault(){}});g.setResult(true,data);resolvePost({ok:true,json:async()=>[{id:'old'}]});await old;assert.equal($('#registerScore').disabled,false);
 g.setResult(true,data);const merged=$('#scoreEntryForm').onsubmit({preventDefault(){}});resolvePost({ok:true,json:async()=>[]});await merged;assert.equal($('#registerScore').disabled,true);assert($('#entryStatus').textContent.includes('高い場合だけ'));
 g.setResult(true,data);const fallback=$('#scoreEntryForm').onsubmit({preventDefault(){}});resolvePost({ok:false,status:400,json:async()=>({code:'PGRST204',message:'road_time missing'})});await new Promise(r=>setImmediate(r));assert.equal(JSON.parse(calls.at(-1).opts.body).road_time,undefined);resolvePost({ok:true,json:async()=>[{id:'legacy'}]});await fallback;assert.equal($('#registerScore').disabled,true);
 console.log('PASS: public leaderboard/details, escaped names, exact breakdown, optional submission, duplicate guard, errors, stale responses');
})().catch(e=>{console.error(e);process.exitCode=1});
