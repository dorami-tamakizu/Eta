const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const noop=()=>{},canvas=new Proxy({},{get:()=>noop}),nodes=new Map();
const node=()=>({style:{},classList:{add:noop,remove:noop,toggle:noop},setAttribute:noop,addEventListener:noop,getContext:()=>canvas,setPointerCapture:noop});
const context={console,Math,Set,Image:class{},innerWidth:390,innerHeight:844,devicePixelRatio:1,addEventListener:noop,requestAnimationFrame:noop,performance:{now:()=>0},document:{querySelector:s=>{if(!nodes.has(s))nodes.set(s,node());return nodes.get(s)},addEventListener:noop},window:{}};
let code=fs.readFileSync(path.join(__dirname,'../game.js'),'utf8');
code=code.replace('reset();function loop(t)','globalThis.test={reset,step,hit,accelerate,fire,score,drawPoseHero,playerY,playerHeight,get state(){return S}};reset();function loop(t)');
vm.runInNewContext(code,context);const g=context.test;
function setup(){g.reset();const s=g.state;s.run=1;s.en=[{t:'slime',hp:2,max:2,l:1,z:100,dead:0,cd:100,mv:100,tell:0,fl:0}];return s}
function tick(n){for(let i=0;i<n;i++)g.step(.01)}
let s=setup();tick(50);assert(Math.abs(s.z+s.pd-5/3)<1e-8);const base=s.z+s.pd;
s=setup();g.accelerate();tick(50);assert(Math.abs(s.z+s.pd-2*base)<1e-8);tick(60);assert.equal(s.boost,0);
for(const sk of [0,1])for(const delay of [.49,.5,.501]){
 s=setup();g.hit(s.en[0],2,sk);assert.equal(s.fin,sk);s.t=delay;g.accelerate();assert.equal(!!s.dash,delay<=.5);
 if(s.dash){s.dash=null;g.accelerate();assert.equal(s.dash,null)}
}
s=setup();g.hit(s.en[0],2,1);s.skill={k:1,t:.4,d:.68,done:1};g.accelerate();assert(s.dash);
s=setup();s.dashUntil=.5;s.pause=1;tick(100);assert.equal(s.t,0);g.accelerate();assert.equal(s.dash,null);s.pause=0;g.accelerate();assert(s.dash);
s=setup();s.en[0].z=.8;s.en[0].hp=1;g.step(.01);assert(s.normalAttack);assert.equal(s.en[0].hp,1);tick(22);assert.equal(s.en[0].hp,1);tick(2);assert.equal(s.en[0].dead,1);assert.equal(s.fin,0);assert(s.dashUntil>s.t);
s=setup();s.en[0].z=.8;g.step(.01);g.fire(1);assert.equal(s.normalAttack,null);assert(s.skill);
s=setup();s.en[0].z=2;s.dashUntil=.5;g.accelerate();tick(10);assert(s.z+s.pd<=s.en[0].z-.7+1e-8);assert.equal(s.dash,null);
s=setup();s.en[0].z=100;s.dashUntil=.5;g.accelerate();tick(24);assert(s.z+s.pd<=10+1e-8);assert.equal(s.dash,null);
s=setup();s.t=60;const fast=g.score(1).total;s.t=120;assert(g.score(1).total<fast);s.fin=1;assert.equal(g.score(0).total,1000);assert.equal(g.score(1).skill,1000);
g.reset();assert.equal(g.state.dashUntil,-1);assert.equal(g.state.boost,0);assert.equal(g.state.normalAttack,null);assert.equal(g.state.fin,0);
console.log('PASS: running, boost, both kill types, 0.5s boundary, single-use window, skill dash, pause, normal attack timing, skill interruption, front limit, dash distance, scoring, retry');

s=setup();const startY=g.playerY();tick(400);
assert(g.playerY()<startY);assert(Math.abs(g.playerY()/844-.52)<.001);
assert(g.playerY()/844-g.playerHeight()/844/2>.42);
const camera=s.z;tick(100);assert(s.z>camera);assert(Math.abs(g.playerY()/844-.52)<.001);
g.accelerate();tick(50);assert(g.playerY()/844<.52);assert(g.playerY()/844>=.48-.001);
tick(250);assert(Math.abs(g.playerY()/844-.52)<.001);
s=setup();s.en[0].z=2;tick(100);assert(s.z+s.pd<=s.en[0].z-.7+1e-8);
console.log('PASS: hero advances toward center, camera follows, boost moves hero farther, camera settles, near-enemy constraint');
