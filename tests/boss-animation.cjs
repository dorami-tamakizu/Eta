const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const noop=()=>{},canvas=new Proxy({},{get:()=>noop}),nodes=new Map();
const node=()=>({style:{},classList:{add:noop,remove:noop,toggle:noop},setAttribute:noop,addEventListener:noop,getContext:()=>canvas,setPointerCapture:noop});
const context={console,Math,Set,Image:class{},innerWidth:390,innerHeight:844,devicePixelRatio:1,addEventListener:noop,requestAnimationFrame:noop,performance:{now:()=>0},document:{querySelector:s=>{if(!nodes.has(s))nodes.set(s,node());return nodes.get(s)},addEventListener:noop},window:{}};
let code=fs.readFileSync(path.join(__dirname,'../game.js'),'utf8');
code=code.replace('reset();function loop(t)','globalThis.test={bossVisual,depth,updateBoss,bossAuraProgress,ULTIMATE,fireUltimate,reset,beginRun,step,hurt,hit,accelerate,fire,score,end,highScore,drawPoseHero,playerY,playerHeight,waterState,groundZ,groundPhase,sceneryDepth,yy,get state(){return S}};reset();function loop(t)');
vm.runInNewContext(code,context);const g=context.test;

for(const kind of ['dragon','wide']){
 const base=kind==='dragon'?0:4,e={action:{kind,age:0,impact:.5}};
 for(const [age,f] of [[0,0],[.30,1],[.5,2],[.67,3],[.99,3]]){e.action.age=age;assert.equal(g.bossVisual(e).frame,base+f);}
 for(let age=0;age<1;age+=.001){e.action.age=age;const v=g.bossVisual(e);assert(v.frame>=base&&v.frame<=base+3);assert(v.next===null||(v.next>=base&&v.next<=base+3));}
}
g.reset();const s=g.state;s.run=1;s.z=0;s.pd=0;s.l=0;
const e={boss:true,z:9,l:1,displayLane:1,cd:10,wideCd:10,dragonCd:10,attackCount:0,action:{kind:'wide',l:1,targetZ:6,age:.95,impact:.5,duration:1,done:true}};
g.updateBoss(e,.06);assert.equal(e.action,null);assert.equal(e.recover.kind,'wide');assert.equal(e.stepClock,0);g.updateBoss(e,.23);assert.equal(e.recover,null);
console.log('PASS: separate 1-4/5-8 timelines, contact at impact, attack plants feet, recovery clears');
