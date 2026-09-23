const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const noop=()=>{},canvas=new Proxy({},{get:()=>noop}),nodes=new Map();
const node=()=>({style:{},classList:{add:noop,remove:noop,toggle:noop},setAttribute:noop,addEventListener:noop,getContext:()=>canvas,setPointerCapture:noop});
const context={console,Math,Set,Image:class{},innerWidth:390,innerHeight:844,devicePixelRatio:1,addEventListener:noop,requestAnimationFrame:noop,performance:{now:()=>0},document:{querySelector:s=>{if(!nodes.has(s))nodes.set(s,node());return nodes.get(s)},addEventListener:noop},window:{}};
let code=fs.readFileSync(path.join(__dirname,'../game.js'),'utf8');
code=code.replace('reset();function loop(t)','globalThis.test={heroHitRect,bossWideRect,fireDragonRect,overlaps,bossHeight,bossVisual,depth,updateBoss,bossAuraProgress,ULTIMATE,fireUltimate,reset,beginRun,step,hurt,hit,accelerate,fire,score,end,highScore,drawPoseHero,playerY,playerHeight,waterState,groundZ,groundPhase,sceneryDepth,yy,get state(){return S}};reset();function loop(t)');
vm.runInNewContext(code,context);const g=context.test;


// Repeated attacks each hit once, including entering a lingering slash after impact.
for(const lane of [0,1,2]){
 g.reset();const s=g.state;s.run=1;s.phase='boss';s.l=lane;s.ll=lane;s.pd=0;s.pt=0;
 const boss={boss:true,z:12,l:1,displayLane:1,cd:100,wideCd:100,dragonCd:100,action:{kind:'wide',targetZ:9,age:.38,impact:.38,duration:.76,done:true}};
 g.updateBoss(boss,.01);assert.equal(s.hp,20);s.pd=7;s.pt=7;assert(g.overlaps(g.heroHitRect(),g.bossWideRect(boss.action)));g.updateBoss(boss,.01);assert.equal(s.hp,16);g.updateBoss(boss,.01);assert.equal(s.hp,16);
 boss.action={kind:'wide',targetZ:9,age:.38,impact:.38,duration:.76,done:true};g.updateBoss(boss,.01);assert.equal(s.hp,12,'each new slash can damage again');
}
// A dragon that visually touches the torso hits before its ground point reaches the player.
g.reset();let s=g.state;s.run=1;s.phase='boss';s.pd=3;s.pt=3;s.retreat=1;s.en=[{t:'boss',boss:true,z:15,l:1,displayLane:1,hp:999,cd:100,wideCd:100,dragonCd:100}];
s.shots=[{kind:'fireDragon',l:1,originLane:1,originZ:12,z:8,age:.5,d:4}];assert(g.overlaps(g.heroHitRect(),g.fireDragonRect(s.shots[0])));g.step(.01);assert.equal(s.hp,16);assert.equal(s.shots.length,0);g.step(.01);assert.equal(s.hp,16);
// Each uninterrupted melee hit deals one point and repeats at two-second intervals.
for(const dt of [1/30,1/60,1/120]){
 g.reset();s=g.state;s.run=1;s.en=[{t:'slime',l:1,z:.7,hp:999,max:999,cd:100,mv:100,dead:0}];const times=[];let hp=999;
 for(let t=0;t<6;t+=dt){g.step(dt);if(s.en[0].hp<hp){assert.equal(hp-s.en[0].hp,1);times.push(s.t);hp=s.en[0].hp;}}
 assert.equal(times.length,3);for(let i=1;i<times.length;i++)assert(Math.abs(times[i]-times[i-1]-2)<dt+1e-8);
}
console.log('PASS: lingering and repeated wide skills, visible dragon collision, one-hit limit, and 2-second 1-damage cadence');
