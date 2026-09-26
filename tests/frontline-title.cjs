const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const noop=()=>{},canvas=new Proxy({},{get:()=>noop}),nodes=new Map();
const node=()=>({style:{},classList:{add:noop,remove:noop,toggle:noop},setAttribute:noop,addEventListener:noop,getContext:()=>canvas,setPointerCapture:noop});
const context={console,Math,Set,Image:class{},innerWidth:390,innerHeight:844,devicePixelRatio:1,addEventListener:noop,requestAnimationFrame:noop,performance:{now:()=>0},document:{querySelector:s=>{if(!nodes.has(s))nodes.set(s,node());return nodes.get(s)},addEventListener:noop},window:{}};
let code=fs.readFileSync(path.join(__dirname,'../game.js'),'utf8');
code=code.replace('reset();function loop(t)','globalThis.test={heroHitRect,bossWideRect,fireDragonRect,overlaps,bossHeight,bossVisual,depth,updateBoss,bossAuraProgress,ULTIMATE,fireUltimate,reset,beginRun,step,hurt,hit,accelerate,fire,score,end,highScore,playerY,playerHeight,waterState,groundZ,groundPhase,sceneryDepth,yy,get state(){return S}};reset();function loop(t)');
vm.runInNewContext(code,context);const g=context.test;


// An empty lane still swings once a second, without damaging another lane.
for(const dt of [1/30,1/60,1/120]){
 g.reset();const s=g.state;s.run=1;s.en=[{t:'slime',l:0,z:.7,hp:999,max:999,cd:100,mv:100,dead:0}];const times=[];let previous=null;
 for(let frame=0;frame<Math.round(3/dt);frame++){g.step(dt);if(s.normalAttack&&s.normalAttack!==previous)times.push(s.t);previous=s.normalAttack;}
 assert.equal(times.length,3);assert.equal(s.en[0].hp,999);assert.equal(s.dealtDamage,0);
 for(let i=1;i<times.length;i++)assert(Math.abs(times[i]-times[i-1]-1)<dt+1e-8);
}
// Re-evaluate the target at impact, including enemies entering an empty lane.
g.reset();let s=g.state;s.run=1;s.en=[{t:'slime',l:0,z:.7,hp:99,max:99,cd:100,mv:100,dead:0}];g.step(.01);assert(s.normalAttack);s.en[0].l=1;for(let i=0;i<25;i++)g.step(.01);assert.equal(s.en[0].hp,98);
// Travel without a nearby front does not trigger sword swings.
g.reset();s=g.state;s.run=1;s.en=[];g.step(.01);assert.equal(s.normalAttack,null);
g.reset();s=g.state;s.run=1;s.en=[{t:'slime',l:0,z:50,hp:99,max:99,cd:100,mv:100,dead:0}];g.step(.01);assert.equal(s.normalAttack,null);
// Result OK resets to an idle title, never beginning a new run.
const classes=new Map();for(const id of ['#intro','#result'])context.document.querySelector(id).classList={add:x=>classes.set(id,x),remove:x=>classes.delete(id),toggle:noop};
g.end(false);nodes.get('#retry').onclick();assert.equal(g.state.run,0);assert.equal(g.state.t,0);assert.equal(g.state.introRun,0);assert.equal(classes.get('#result'),'hide');assert.equal(classes.has('#intro'),false);
console.log('PASS: empty-lane swing cadence, impact targeting, no travel swings, result OK returns to idle title');
