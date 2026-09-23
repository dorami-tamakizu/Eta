const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const noop=()=>{},canvas=new Proxy({},{get:()=>noop}),nodes=new Map(),keys=new Map();
const node=()=>({style:{},classList:{add:noop,remove:noop,toggle:noop},setAttribute:noop,addEventListener:noop,getContext:()=>canvas,setPointerCapture:noop});
const context={console,Math,Set,Image:class{},innerWidth:390,innerHeight:844,devicePixelRatio:1,addEventListener:(name,fn)=>keys.set(name,fn),requestAnimationFrame:noop,performance:{now:()=>0},document:{querySelector:s=>{if(!nodes.has(s))nodes.set(s,node());return nodes.get(s)},addEventListener:noop},window:{}};
const code=fs.readFileSync(path.join(__dirname,'../game.js'),'utf8').replace('reset();function loop(t)','globalThis.test={reset,step,hit,fireUltimate,depth,accelerate,get state(){return S}};reset();function loop(t)');
vm.runInNewContext(code,context);const g=context.test,oneStep=Math.PI/1.35;
const groupStart=n=>g.state.en.find(e=>e.group===n).z;
const packInterval=groupStart(1)-groupStart(0),dashDistance=32;assert.equal(dashDistance,packInterval);
function setup(){g.reset();const s=g.state;s.run=1;s.en=[{t:'slime',hp:999,max:999,l:1,z:10000,dead:0,cd:100,mv:100,tell:0,fl:0}];return s;}
function tick(seconds,dt=.01){let left=seconds;while(left>1e-10){const slice=Math.min(dt,left);g.step(slice);left-=slice;}}
function position(){return g.state.z+g.state.pd;}
function swipe(from=[195,600],to=[195,400],id=1){const cv=nodes.get('#game');cv.onpointerdown({pointerId:id,clientX:from[0],clientY:from[1],preventDefault:noop});cv.onpointerup({pointerId:id,clientX:to[0],clientY:to[1],preventDefault:noop});}

let s=setup();tick(2);assert(Math.abs(position()-18)<1e-8);
s=setup();swipe();tick(2);assert(Math.abs(position()-18-oneStep)<1e-8);assert.equal(s.boost,0);assert(Math.abs(s.speed-9)<1e-8);
for(const dt of [.01,1/30,1/60,1/120]){
 s=setup();swipe();swipe();swipe();tick(2,dt);
 assert(Math.abs(position()-18-3*oneStep)<1e-8,'each rapid swipe contributes one full step at every frame rate');
 assert.equal(s.boost,0);
}
s=setup();swipe();tick(.08);const firstSpeed=s.speed;swipe();tick(.01);assert(s.speed>firstSpeed,'a second swipe immediately stacks speed, not just duration');
tick(.07);swipe();tick(1.84);assert(Math.abs(position()-18-3*oneStep)<1e-8);
function timeTo(target,swipes){setup();let next=0;while(position()<target){if(next<swipes&&g.state.t>=next*.15){swipe();next++;}g.step(.01);}return g.state.t;}
const normalTime=timeTo(30,0),singleTime=timeTo(30,1),repeatedTime=timeTo(30,8);
assert(repeatedTime<singleTime&&singleTime<normalTime,'repeated upward swipes shorten actual travel time');
console.log('PASS: real pointer gestures add one step, stack speed and distance, preserve base speed, and shorten travel time', {normalTime,singleTime,repeatedTime});

s=setup();swipe([195,600],[200,590]);assert.equal(s.boost,0,'tap/short motion is not a swipe');
swipe([195,600],[275,600]);assert.equal(s.boost,0,'side swipe only changes lane');
s=setup();swipe();tick(.03);s.pause=1;const saved={p:position(),boost:s.boost,t:s.t};swipe();tick(2);assert.equal(position(),saved.p);assert.equal(s.boost,saved.boost);assert.equal(s.t,saved.t);s.pause=0;tick(2);assert.equal(s.boost,0);
s=setup();keys.get('keydown')({key:'ArrowUp',repeat:false,preventDefault:noop});const keyboardBoost=s.boost;keys.get('keydown')({key:'ArrowUp',repeat:true,preventDefault:noop});assert.equal(s.boost,keyboardBoost);assert.equal(keyboardBoost,oneStep);
s=setup();s.cinematic={kind:'entry',t:0};swipe();assert.equal(s.boost,0);s.cinematic=null;s.run=0;swipe();assert.equal(s.boost,0);
s=setup();swipe();g.fireUltimate();assert.equal(s.boost,0);swipe();assert.equal(s.boost,0);g.reset();assert.equal(g.state.boost,0);
s=setup();s.en[0].z=1;for(let i=0;i<10;i++)swipe();tick(.02);assert(position()<=s.en[0].z-.7+1e-8,'stacked speed never tunnels through the front line');
console.log('PASS: swipe direction, pause, input locks, keyboard repeat, reset, and front-line collision');

for(const dt of [.01,1/30,1/60,1/120]){
 s=setup();s.dashUntil=.5;swipe();assert.equal(s.dash.n,dashDistance);tick(.1,dt);assert(Math.abs(position()-4.2)<1e-8);assert(s.dash);
 tick(1.9,dt);assert.equal(s.dash,null);assert(Math.abs(position()-(dashDistance+9*(2-dashDistance/42)))<1e-8,'cap switches to base speed for the remainder of the frame');assert(Math.abs(s.speed-9)<1e-8);
}
s=setup();s.dashUntil=.5;swipe();tick(.05);const remaining=s.dash.n;s.pause=1;tick(2);assert.equal(s.dash.n,remaining);s.pause=0;tick(2);assert.equal(s.dash,null);
s=setup();s.en[0].z=2;s.dashUntil=.5;swipe();tick(.04);assert.equal(s.dash,null);assert(position()<=s.en[0].z-.7+1e-8,'nearby contact still ends the dash early');
s=setup();s.ch=[1,1];s.dashUntil=.5;swipe();tick(.05);const beforeMore=s.dash.n;swipe();assert.equal(s.dash.n,beforeMore,'ordinary swipes during dash do not reset its distance budget');tick(2);assert.equal(s.dash,null);assert.deepEqual(Array.from(s.ch),[2,2]);
s=setup();s.phase='boss';s.l=0;s.en=[{t:'boss',boss:true,z:15,l:1,displayLane:1,hp:999,max:999,cd:100,wideCd:100,dragonCd:100}];s.dashUntil=.5;swipe();tick(dashDistance/42);assert.equal(s.dash,null);assert(position()>6&&position()<=dashDistance+1e-8,'boss dash extends beyond the old short limit and stops by contact or the full cap');assert(s.en[0].z-position()>=.7-1e-8,'fixed boss is never crossed');
g.reset();s=g.state;s.run=1;s.z=20;s.pd=0;s.pt=0;for(const e of s.en)if(e.group<3)e.dead=1;s.dashUntil=.5;swipe();tick(dashDistance/42);assert.equal(s.dash,null);assert(Math.abs(position()-20-dashDistance)<1e-8,'one activation covers the shorter distance when the path is clear');
g.reset();s=g.state;s.run=1;s.z=20;s.pd=0;s.pt=0;for(const e of s.en)if(e.group<2)e.dead=1;s.dashUntil=.5;swipe();tick(dashDistance/42);assert.equal(s.dash,null);const nextPack=s.en.find(e=>e.group===2);assert(nextPack.z-position()>8,'dash expires before reaching the next live pack');const beforeStride=position();swipe();tick(.2);assert(position()-beforeStride>9*.2,'manual upward swipe speeds up the remaining approach');
console.log('PASS: one-pack-interval dash cap, frame-rate independence, normal-speed fallback, early contact, pause, single reward, and boss distance cap');
