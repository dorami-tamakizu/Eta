const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const noop=()=>{},canvas=new Proxy({},{get:()=>noop}),nodes=new Map();
const node=()=>({style:{},classList:{add:noop,remove:noop,toggle:noop},setAttribute:noop,addEventListener:noop,getContext:()=>canvas,setPointerCapture:noop});
const context={console,Math,Set,Image:class{},innerWidth:390,innerHeight:844,devicePixelRatio:1,addEventListener:noop,requestAnimationFrame:noop,performance:{now:()=>0},document:{querySelector:s=>{if(!nodes.has(s))nodes.set(s,node());return nodes.get(s)},addEventListener:noop},window:{}};
let code=fs.readFileSync(path.join(__dirname,'../game.js'),'utf8');
code=code.replace('reset();function loop(t)','globalThis.test={bossHeight,bossVisual,depth,updateBoss,bossAuraProgress,ULTIMATE,fireUltimate,reset,beginRun,step,hurt,hit,accelerate,fire,score,end,highScore,drawPoseHero,playerY,playerHeight,waterState,groundZ,groundPhase,sceneryDepth,yy,get state(){return S}};reset();function loop(t)');
vm.runInNewContext(code,context);const g=context.test;

for(const kind of ['dragon','wide']){
 const base=kind==='dragon'?0:4,e={action:{kind,age:0,impact:.5}};
 const beats=kind==='dragon'?[[0,0],[.30,1],[.5,2],[.67,3],[.99,3]]:[[0,0],[.20,1],[.36,2],[.49,2],[.5,3],[.99,3]];
 for(const [age,f] of beats){e.action.age=age;assert.equal(g.bossVisual(e).frame,base+f);}
 for(let age=0;age<1;age+=.001){e.action.age=age;const v=g.bossVisual(e);assert(v.frame>=base&&v.frame<=base+3);assert(v.next===null||(v.next>=base&&v.next<=base+3));}
}
g.reset();const s=g.state;s.run=1;s.z=0;s.pd=0;s.l=0;
const e={boss:true,z:9,l:1,displayLane:1,cd:10,wideCd:10,dragonCd:10,attackCount:0,action:{kind:'wide',l:1,targetZ:6,age:.95,impact:.5,duration:1,done:true}};
g.updateBoss(e,.06);assert.equal(e.action,null);assert.equal(e.recover.kind,'wide');assert.equal(e.stepClock,0);g.updateBoss(e,.23);assert.equal(e.recover,null);
for(const kind of ['dragon','wide']){
 g.reset();const state=g.state;state.run=1;state.hp=20;state.pd=7;state.pt=7;
 const boss={boss:true,z:9,l:1,displayLane:1,cd:100,wideCd:100,dragonCd:100,attackCount:0,action:{kind,l:1,targetZ:7,age:0,impact:.5,duration:1,done:false}};
 g.updateBoss(boss,.49);assert.equal(state.hp,20);assert.equal(state.shots.length,0);assert.equal(boss.action.done,false);
 g.updateBoss(boss,.01);assert.equal(boss.action.done,true);assert.equal(g.bossVisual(boss).frame,kind==='dragon'?2:7);
 if(kind==='dragon'){assert.equal(state.shots.length,1);assert.equal(state.shots[0].originLane,1);assert.equal(state.shots[0].z,boss.z);}else assert.equal(state.hp,16);
 g.updateBoss(boss,.2);assert.equal(state.shots.length,kind==='dragon'?1:0);assert.equal(state.hp,kind==='dragon'?20:16);
}
console.log('PASS: separate rows, ground-contact dragon and completed horizontal sweep at impact, single attack, planted feet, recovery');
g.reset();const fixed=g.state;fixed.run=1;fixed.phase='boss';fixed.pd=8;fixed.pt=8;fixed.l=0;
const stationary={t:'boss',boss:true,z:9,l:1,displayLane:1,hp:999,max:999,cd:100,wideCd:100,dragonCd:100};fixed.en=[stationary];
const expectedHeight=g.bossHeight(9),nearHeroHeight=g.playerHeight();
for(let swipe=0;swipe<3;swipe++){
 g.depth(-3.2);for(let i=0;i<30;i++)g.step(.01);
 assert.equal(stationary.z,9);assert.equal(stationary.l,1);assert.equal(stationary.displayLane,1);assert.equal(fixed.z,0);assert.equal(g.bossHeight(stationary.z-fixed.z),expectedHeight);
}
assert(g.playerHeight()>nearHeroHeight,'retreat changes player perspective without scaling the boss');
for(let swipe=0;swipe<12;swipe++){g.accelerate();for(let i=0;i<10;i++)g.step(.01);assert.equal(fixed.z,0);assert.equal(stationary.z,9);assert.equal(g.bossHeight(9),expectedHeight);}
fixed.dashUntil=fixed.t+.5;g.accelerate();for(let i=0;i<100;i++)g.step(.01);assert.equal(fixed.dash,null);assert.equal(fixed.z,0);assert.equal(stationary.z,9);assert.equal(stationary.stepClock,0);
console.log('PASS: retreat, repeated advance, and superdash never move the boss/camera or enlarge its sprite');
