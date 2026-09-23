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
// Player depth never affects boss size; autonomous movement remains enabled.
g.reset();const s2=g.state;s2.run=1;s2.phase='boss';s2.l=0;
const expected=g.bossHeight(9);for(const pd of [0,3,8]){s2.pd=pd;assert.equal(g.bossHeight(9),expected);}
const mover={t:'boss',boss:true,z:9,l:1,displayLane:1,hp:999,cd:1000,wideCd:1000,dragonCd:1000};s2.en=[mover];
let left=false,right=false,forward=false,back=false;
for(let i=0;i<4500;i++){const z=mover.z,l=mover.displayLane;g.updateBoss(mover,.01);left ||= mover.displayLane<l;right ||= mover.displayLane>l;forward ||= mover.z<z;back ||= mover.z>z;assert.equal(s2.z,0);}
assert(left&&right&&forward&&back,'restored patrol moves in all four directions');
for(const kind of ['wide','dragon']){mover.action=null;mover.wideCd=kind==='wide'?0:100;mover.dragonCd=kind==='dragon'?0:100;g.updateBoss(mover,.01);assert.equal(mover.action.impact,.38);assert.equal(mover.action.duration,.76);g.updateBoss(mover,.38);assert.equal(g.bossVisual(mover).frame,kind==='dragon'?2:7);}
console.log('PASS: four-direction patrol, fixed camera, independent scale, faster skill impact and synchronized frames');

// Remain in contact through multiple old melee cooldowns without a skill.
g.reset();const contact=g.state;contact.run=1;contact.phase='boss';contact.en=[];
const touch={boss:true,z:9,l:1,displayLane:1,cd:0,wideCd:100,dragonCd:100,attackCount:0};
for(let i=0;i<1000;i++){contact.pd=touch.z-.7;contact.l=touch.l;g.updateBoss(touch,.01);}
assert.equal(contact.hp,20);assert.equal(contact.dmg,0);assert.equal(touch.attackCount,0);
console.log('PASS: ten seconds of boss contact cause no damage or invisible attacks');
