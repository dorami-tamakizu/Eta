const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const code=fs.readFileSync(__dirname+'/../menu.js','utf8');
const stagesMatch=code.match(/const totalStages=(\[[^;]+\]);/);
assert(stagesMatch,'totalStages is missing');
const totalStages=vm.runInNewContext(stagesMatch[1]);
assert.deepEqual(Array.from(totalStages,entry=>Array.from(entry)),[
  ['sword','rankings'],
  ['spear','rankings_spear'],
  ['spell','rankings_spell'],
  ['ex','rankings_sword_ex']
]);
assert.equal(new Set(totalStages.map(([,table])=>table)).size,4,'stage rankings must use four independent tables');
const functionMatch=code.match(/function combineStageRecords\(groups\)\{[\s\S]*?\n \}\n async function readTotalStage/);
assert(functionMatch,'combineStageRecords is missing');
const context={totalStages,Map,Number,Error};
vm.runInNewContext(functionMatch[0].replace(/\n async function readTotalStage$/,'')+';globalThis.combineStageRecords=combineStageRecords;',context);
const row=(name,total_score)=>({id:name+total_score,name,total_score,road_time:10,created_at:'2026-10-25T00:00:00Z'});
const result=context.combineStageRecords([
  [row('四魂',10),row('四魂',8)],
  [row('四魂',20)],
  [row('四魂',30)],
  [row('四魂',40)]
]);
assert.equal(result.length,1);
assert.equal(result[0].total,100,'total ranking must add the best score from all four stages');
assert.deepEqual(Object.keys(result[0].stages),['sword','spear','spell','ex']);
console.log('PASS: four independent stage rankings and four-stage total aggregation');
