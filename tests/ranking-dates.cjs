const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
let now=Date.parse('2026-09-29T11:12:00Z'),timer;
class Clock extends Date{static now(){return now;}}
const context={window:{},document:{querySelector:()=>({addEventListener(){}})},Date:Clock,Intl,setTimeout:(fn,delay)=>{timer={fn,delay};return 1;},clearTimeout:()=>{timer=null;}};
const source=fs.readFileSync(__dirname+'/../ranking.js','utf8');
vm.runInNewContext(source.replace('window.GameRanking={setResult,open};','window.GameRanking={recordedLabel,newBadge,rankingHTML,expireNewBadges};'),context);
const g=context.window.GameRanking;
assert.equal(g.recordedLabel({created_at:'2026-09-29T11:12:00Z'}),'2026/09/29 20:12');
assert.equal(g.recordedLabel({created_at:'2026-09-28T15:00:00Z'}),'2026/09/29 00:00');
for(const created_at of [null,undefined,'invalid']){assert.equal(g.recordedLabel({created_at}),'未記録');assert.equal(g.newBadge({created_at}),'');}
assert(g.newBadge({created_at:new Date(now).toISOString()}).includes('New!'));
assert(g.newBadge({created_at:new Date(now-86400000+1).toISOString()}).includes('New!'));
assert.equal(g.newBadge({created_at:new Date(now-86400000).toISOString()}),'');
assert.equal(g.newBadge({created_at:new Date(now+1).toISOString()}),'');
let removed=false;const badge={dataset:{expires:now+1000},remove(){removed=true;}};
g.expireNewBadges({querySelectorAll:()=>removed?[]:[badge]});assert.equal(timer.delay,1000);now+=1000;timer.fn();assert(removed);assert.equal(timer,null);
const row={name:'sample',created_at:'2026-09-29T11:12:00Z',total_score:1,clear_time:1};
const html=g.rankingHTML([row]);assert(html.indexOf('New!</span>')<html.indexOf('rank-score-row'));
assert(html.indexOf('スコア更新日時：')>html.indexOf('class="rank-detail-body" hidden'));
assert(!html.includes('日本時間'));assert(html.includes('2026/09/29 20:12'));
console.log('PASS: JST formatting, midnight, missing history, 24-hour boundary, live expiry and detail-only timestamp');
