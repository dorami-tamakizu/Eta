const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const noop=()=>{},canvas=new Proxy({},{get:()=>noop}),nodes=new Map();
const node=()=>({style:{},classList:{add:noop,remove:noop,toggle:noop},setAttribute:noop,addEventListener:noop,getContext:()=>canvas,setPointerCapture:noop});
const context={console,Math,Set,Image:class{},innerWidth:390,innerHeight:844,devicePixelRatio:1,addEventListener:noop,requestAnimationFrame:noop,performance:{now:()=>0},document:{querySelector:s=>{if(!nodes.has(s))nodes.set(s,node());return nodes.get(s)},addEventListener:noop},window:{}};
let code=fs.readFileSync(path.join(__dirname,'../game.js'),'utf8');
code=code.replace('reset();function loop(t)','globalThis.test={reset,step,hit,accelerate,fire,score,end,highScore,drawPoseHero,playerY,playerHeight,waterState,groundZ,groundPhase,get state(){return S}};reset();function loop(t)');
vm.runInNewContext(code,context);const g=context.test;
function setup(){g.reset();const s=g.state;s.run=1;s.en=[{t:'slime',hp:2,max:2,l:1,z:100,dead:0,cd:100,mv:100,tell:0,fl:0}];return s}
function tick(n){for(let i=0;i<n;i++)g.step(.01)}
let s=setup();tick(50);assert(Math.abs(s.z+s.pd-4.5)<1e-8);const base=s.z+s.pd;
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
assert(g.playerY()<startY);assert(Math.abs(g.playerY()/844-.58)<.001);
assert(g.playerY()/844-g.playerHeight()/844/2>.42);
const camera=s.z;tick(100);assert(s.z>camera);assert(Math.abs(g.playerY()/844-.58)<.001);
g.accelerate();tick(50);assert(g.playerY()/844<.58);assert(g.playerY()/844>=.53-.001);
tick(250);assert(Math.abs(g.playerY()/844-.58)<.001);
s=setup();s.en[0].z=2;tick(100);assert(s.z+s.pd<=s.en[0].z-.7+1e-8);
console.log('PASS: hero advances toward center, camera follows, boost moves hero farther, camera settles, near-enemy constraint');

const y=.64,z=g.groundZ(y),project=d=>.26+.49/(1+d*.115);
const flow=(project(z-.09)-y)/.01;
assert(flow>.29&&flow<.32,'near-ground optical speed matches reference order');
assert(Math.abs(g.groundPhase(y,8)-g.groundPhase(y,8+16))<1e-12);
s=setup();tick(100);const before=g.groundPhase(.65,s.z);s.pause=1;tick(100);assert.equal(g.groundPhase(.65,s.z),before);
console.log('PASS: reference-scale optical flow, continuous ground period, paused scenery');
s=setup();s.en=[0,1,2].map(l=>({t:'skeleton',hp:3,max:3,l,z:5,dead:0,cd:100,mv:100,tell:0,fl:0}));
g.fire(1);s.guard=1;tick(70);assert(s.en.every(e=>e.hp===1));assert.equal(s.fin,0);
g.fire(1);s.guard=1;tick(70);assert(s.en.every(e=>e.dead));assert.equal(s.fin,3);
console.log('PASS: water wave hits all three lanes once, preserves damage and skill-finish credit');

s=setup();tick(200);assert(g.playerHeight()/844>.21&&g.playerHeight()/844<.24);console.log('PASS: running hero occupies 21–24% of viewport height');
const viewportEvents={},vv={width:375,height:570,offsetTop:0,offsetLeft:0,addEventListener:(n,f)=>{const previous=viewportEvents[n];viewportEvents[n]=()=>{if(previous)previous();f()}}};
vm.runInNewContext(code,{...context,window:{visualViewport:vv}});
assert.equal(nodes.get('#gameViewport').style.height,'570px');
vv.height=650;viewportEvents.resize();assert.equal(nodes.get('#gameViewport').style.height,'650px');
vv.offsetTop=8;viewportEvents.scroll();assert.equal(nodes.get('#gameViewport').style.top,'8px');
console.log('PASS: visible viewport resize and offset updates');

s=setup();g.fire(1);tick(32);assert.equal(s.waterFx.length,0);tick(2);assert.equal(s.waterFx.length,1);
const age=s.waterFx[0].age;s.pause=1;tick(40);assert.equal(s.waterFx[0].age,age);s.pause=0;
tick(30);assert.equal(s.waterFx.length,1);tick(32);assert.equal(s.waterFx.length,0);
assert(g.waterState(.05).spread>.8);assert(g.waterState(.15).lift>g.waterState(.05).lift);
assert(g.waterState(.45).alpha<g.waterState(.15).alpha);assert.equal(g.waterState(.60).residue,0);
g.reset();assert.equal(g.state.waterFx.length,0);
console.log('PASS: single water emission at impact, layered phase sequence, pause, lifetime, retry cleanup');

s=setup();s.en[0].hp=2;g.hit(s.en[0],3,1);assert.equal(s.dealtDamage,2);assert.equal(s.overkill,1);
g.hit(s.en[0],3,1);assert.equal(s.dealtDamage,2);assert.equal(s.overkill,1);
s.en.push({t:'slime',hp:1,max:2,l:1,z:101,dead:0,tell:0});g.hit(s.en[1],1,0);
assert.equal(s.dealtDamage,3);assert.equal(s.overkill,1);assert.equal(s.fin,1);
const score=g.score(1);assert.equal(score.dealt,300);assert.equal(score.overkill,100);
assert.equal(score.total,score.time+score.skill+score.damage+score.dealt+score.overkill);
s.dmg=4;const healthy=g.score(1).damage;s.dmg=10;assert(g.score(1).damage<healthy);
const saved=new Map();context.localStorage={getItem:k=>saved.get(k),setItem:(k,v)=>saved.set(k,v)};
g.end(1);assert.equal(g.highScore(),g.score(1).total);
for(const heading of ['クリアタイム','スキルフィニッシュ','総被ダメージ','与ダメージ'])assert(nodes.get('#resultText').innerHTML.includes('<h3>'+heading+'</h3>'));
assert(!nodes.get('#resultText').innerHTML.includes('オーバーキル'));
assert.equal((nodes.get('#resultText').innerHTML.match(/class="score-section"/g)||[]).length,4);
assert(nodes.get('#resultText').innerHTML.includes('<strong>4</strong>'));
assert(nodes.get('#resultText').innerHTML.includes('>400</strong>'));
assert(!nodes.get('#resultText').innerHTML.includes('弱点'));
const best=g.highScore();s=setup();s.t=600;g.end(1);assert.equal(g.highScore(),best);
s=setup();s.fin=999;g.end(0);assert.equal(g.highScore(),best);
g.reset();assert.equal(g.state.dealtDamage,0);assert.equal(g.state.overkill,0);
console.log('PASS: effective damage, overkill, no repeated credit, five-component total, high score, failure, reset');
assert(!nodes.get('#resultText').innerHTML.includes('まもの'));
assert(nodes.get('#resultText').innerHTML.includes('総与ダメージ'));
const resultCard=nodes.get('.quest-results');
Object.defineProperty(resultCard,'offsetWidth',{get:()=>parseFloat(resultCard.style.width)||351});
Object.defineProperty(resultCard,'offsetHeight',{get:()=>510});
for(const height of [360,480,570,667,844]){
  vv.height=height;viewportEvents.resize();
  const scale=Number(resultCard.style.transform.match(/scale\(([^)]+)\)/)[1]);
  assert(510*scale<=height-28+1e-8);
  assert(resultCard.offsetWidth*scale<=vv.width-24+1e-8);
}
console.log('PASS: complete results card fits five visible heights, including OK');
