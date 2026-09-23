const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const noop=()=>{},canvas=new Proxy({},{get:()=>noop}),nodes=new Map();
const node=()=>({style:{},classList:{add:noop,remove:noop,toggle:noop},setAttribute:noop,addEventListener:noop,getContext:()=>canvas,setPointerCapture:noop});
const context={console,Math,Set,Image:class{},innerWidth:390,innerHeight:844,devicePixelRatio:1,addEventListener:noop,requestAnimationFrame:noop,performance:{now:()=>0},document:{querySelector:s=>{if(!nodes.has(s))nodes.set(s,node());return nodes.get(s)},addEventListener:noop},window:{}};
let code=fs.readFileSync(path.join(__dirname,'../game.js'),'utf8');
code=code.replace('reset();function loop(t)','globalThis.test={depth,updateBoss,bossAuraProgress,ULTIMATE,fireUltimate,reset,beginRun,step,hurt,hit,accelerate,fire,score,end,highScore,drawPoseHero,playerY,playerHeight,waterState,groundZ,groundPhase,sceneryDepth,yy,get state(){return S}};reset();function loop(t)');
vm.runInNewContext(code,context);const g=context.test;
function setup(){g.reset();const s=g.state;s.run=1;s.en=[{t:'slime',hp:2,max:2,l:1,z:100,dead:0,cd:100,mv:100,tell:0,fl:0}];return s}
function tick(n){for(let i=0;i<n;i++)g.step(.01)}
let s=setup();tick(50);assert(Math.abs(s.z+s.pd-4.5)<1e-8);const base=s.z+s.pd;
s=setup();g.accelerate();tick(50);assert(s.z+s.pd>base);assert(Math.abs(s.z+s.pd-base+s.boost-Math.PI/1.35)<1e-8);tick(60);assert.equal(s.boost,0);
for(const sk of [0,1])for(const delay of [.49,.5,.501]){
 s=setup();g.hit(s.en[0],2,sk);assert.equal(s.fin,sk);s.t=delay;g.accelerate();assert.equal(!!s.dash,delay<=.5);
 if(s.dash){s.dash=null;g.accelerate();assert.equal(s.dash,null)}
}
s=setup();g.hit(s.en[0],2,1);s.skill={k:1,t:.4,d:.68,done:1};g.accelerate();assert(s.dash);
s=setup();s.dashUntil=.5;s.pause=1;tick(100);assert.equal(s.t,0);g.accelerate();assert.equal(s.dash,null);s.pause=0;g.accelerate();assert(s.dash);
s=setup();s.en[0].z=.8;s.en[0].hp=1;g.step(.01);assert(s.normalAttack);assert.equal(s.en[0].hp,1);tick(22);assert.equal(s.en[0].hp,1);tick(2);assert.equal(s.en[0].dead,1);assert.equal(s.fin,0);assert.equal(s.phase,'bossIntro');assert.equal(s.dashUntil,-1);
s=setup();s.en[0].z=.8;g.step(.01);g.fire(1);assert.equal(s.normalAttack,null);assert(s.skill);
s=setup();s.en[0].z=2;s.dashUntil=.5;g.accelerate();tick(10);assert(s.z+s.pd<=s.en[0].z-.7+1e-8);assert.equal(s.dash,null);
s=setup();s.en[0].z=100;s.en[0].hp=999;s.dashUntil=.5;g.accelerate();tick(24);assert(s.dash);assert(Math.abs(s.z+s.pd-42*.24)<1e-8);tick(220);assert.equal(s.dash,null);assert(Math.abs(s.z+s.pd-(32+9*(2.44-32/42)))<1e-8);assert(s.en[0].z-s.z-s.pd>20);assert(Math.abs(s.speed-9)<1e-8);
s=setup();s.t=60;const fast=g.score(1).total;s.t=120;assert(g.score(1).total<fast);s.fin=1;assert.equal(g.score(0).total,6557);assert.equal(g.score(1).skill,6557);
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
g.fire(1);s.guard=1;tick(70);assert(s.en.filter(e=>!e.boss).every(e=>e.dead));assert.equal(s.fin,3);
console.log('PASS: water wave hits all three lanes once, preserves damage and skill-finish credit');

s=setup();tick(200);assert(g.playerHeight()/844>.21&&g.playerHeight()/844<.24);console.log('PASS: running hero occupies 21–24% of viewport height');
const viewportEvents={},vv={width:375,height:570,offsetTop:0,offsetLeft:0,addEventListener:(n,f)=>{const previous=viewportEvents[n];viewportEvents[n]=()=>{if(previous)previous();f()}}};
vm.runInNewContext(code,{...context,window:{visualViewport:vv}});
assert.equal(nodes.get('#gameViewport').style.height,'570px');
vv.height=650;viewportEvents.resize();assert.equal(nodes.get('#gameViewport').style.height,'650px');
vv.offsetTop=8;viewportEvents.scroll();assert.equal(nodes.get('#gameViewport').style.top,'8px');
console.log('PASS: visible viewport resize and offset updates');

s=setup();g.fire(1);tick(18);assert.equal(s.waterFx.length,0);tick(2);assert.equal(s.waterFx.length,1);
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
const score=g.score(1);assert.equal(score.dealt,1402);assert.equal(score.overkill,0);
assert.equal(score.total,score.time+score.skill+score.damage+score.dealt+score.overkill);
s.dmg=4;const healthy=g.score(1).damage;s.dmg=10;assert(g.score(1).damage<healthy);
const saved=new Map();context.localStorage={getItem:k=>saved.get(k),setItem:(k,v)=>saved.set(k,v)};
g.end(1);assert.equal(g.highScore(),g.score(1).total);
for(const heading of ['クリアタイムスコア','スキルフィニッシュスコア','被ダメージスコア','与ダメージスコア'])assert(nodes.get('#resultText').innerHTML.includes('<h3>'+heading+'</h3>'));
assert(!nodes.get('#resultText').innerHTML.includes('オーバーキル'));
assert.equal((nodes.get('#resultText').innerHTML.match(/class="score-section"/g)||[]).length,4);
assert(nodes.get('#resultText').innerHTML.includes('<strong>3</strong>'));
assert(nodes.get('#resultText').innerHTML.includes('>1,402</strong>'));
assert(!nodes.get('#resultText').innerHTML.includes('弱点'));
const best=g.highScore();s=setup();s.t=600;g.end(1);assert.equal(g.highScore(),best);
s=setup();s.fin=999;g.end(0);assert.equal(g.highScore(),best);
g.reset();assert.equal(g.state.dealtDamage,0);assert.equal(g.state.overkill,0);
console.log('PASS: effective damage, overkill, no repeated credit, five-component total, high score, failure, reset');
assert(!nodes.get('#resultText').innerHTML.includes('まもの'));
assert(nodes.get('#resultText').innerHTML.includes('与ダメージ'));
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

s=setup();g.fire(2);tick(44);assert.equal(s.earthFx.length,0);tick(2);assert.equal(s.earthFx.length,1);
const earthAge=s.earthFx[0].age;s.pause=1;tick(20);assert.equal(s.earthFx[0].age,earthAge);s.pause=0;
tick(97);assert.equal(s.earthFx.length,0);
s=setup();s.en=[0,1,2].map(l=>({t:'skeleton',hp:3,max:3,l,z:5,dead:0,cd:100,mv:100,tell:0,fl:0}));
g.fire(2);s.guard=1;tick(90);assert.equal(s.en[1].dead,1);assert.equal(s.en[0].hp,3);assert.equal(s.en[2].hp,3);assert.equal(s.fin,1);
g.reset();assert.equal(g.state.earthFx.length,0);
console.log('PASS: earth impact synchronization, single emission, pause, cleanup, original lane/damage/score');
s=setup();s.guard=1;tick(25);assert.equal(s.guardPose,1);
s.pause=1;s.guard=0;tick(20);assert.equal(s.guardPose,1);
s.pause=0;tick(20);assert.equal(s.guardPose,0);
s.guard=1;tick(5);assert(s.guardPose>0&&s.guardPose<1);
g.reset();assert.equal(g.state.guardPose,0);
console.log('PASS: guard raises, holds, pauses, releases and resets');

s=setup();g.hurt(2);assert.equal(s.guardImpact,0);s.guard=1;g.hurt(2);assert.equal(s.guardImpact,.38);assert.equal(s.hp,18);s.pause=1;tick(40);assert.equal(s.guardImpact,.38);s.pause=0;tick(40);assert.equal(s.guardImpact,0);

g.beginRun();s=g.state;tick(199);assert.equal(s.en.length,0);assert.equal(s.run,1);assert(s.z+s.pd>15);tick(2);assert.equal(s.en.length,60);assert(s.en.every(e=>e.z>s.z+s.pd+35));

s=setup();const worldTree=35;const treeBefore=g.sceneryDepth(worldTree);tick(50);assert(Math.abs(treeBefore-g.sceneryDepth(worldTree)-s.z)<1e-8);const projected=g.yy(g.sceneryDepth(worldTree));s.pause=1;tick(30);assert.equal(g.yy(g.sceneryDepth(worldTree)),projected);s.pause=0;g.accelerate();tick(30);assert(g.yy(g.sceneryDepth(worldTree))>projected);
console.log("PASS: trees share stage coordinates, advance with acceleration and freeze on pause");
g.reset();s=g.state;assert.equal(s.en.length,60);for(let group=0;group<10;group++){const pack=s.en.filter(e=>e.group===group);assert.equal(pack.length,6);assert.equal(new Set(pack.map(e=>e.l)).size,3);assert.equal(Math.max(...pack.map(e=>e.z))-Math.min(...pack.map(e=>e.z)),3);if(group<9)assert.equal(s.en[(group+1)*6].z-pack[5].z,29)}
s.run=1;s.z=19;s.pd=1;for(const e of s.en.filter(e=>e.group===0))g.hit(e,20,1);g.accelerate();assert.equal(s.dash.n,32);const limit=s.en[6].z-1.2;tick(100);assert.equal(s.dash,null);assert(s.z+s.pd<=limit+.6);assert(s.en[6].z-s.z-s.pd>=.7-1e-8);console.log('PASS: dash reaches the next live pack and stops at contact');
s=setup();s.ch=[2,4];s.fr=[.3,.8];s.dashUntil=s.t+.5;g.accelerate();assert.deepEqual(Array.from(s.ch),[2,4]);tick(1);assert.deepEqual(Array.from(s.ch),[3,4]);assert.equal(s.fr[1],0);tick(10);assert.deepEqual(Array.from(s.ch),[3,4]);g.accelerate();tick(2);assert.deepEqual(Array.from(s.ch),[3,4]);
s=setup();s.ch=[1,1];s.guard=1;s.dashUntil=s.t+.5;g.accelerate();tick(10);assert.deepEqual(Array.from(s.ch),[1,1]);
console.log('PASS: successful moving dash restores each skill once, capped at four; blocked dash gives no charge');

// Reference-video sequence: road clear -> approach -> boss portrait -> combat -> victory -> result.
g.beginRun();s=g.state;tick(201);s.hp=13;s.ch=[2,3];s.fr=[0,0];
for(const e of s.en)g.hit(e,e.hp,1);
const roadFinish=s.t;g.step(.01);
assert.equal(s.phase,'bossIntro');assert.equal(s.run,1);assert.equal(s.roadTime,roadFinish+.01);
assert.equal(s.hp,13);assert.deepEqual(Array.from(s.ch),[2,3]);assert.equal(s.fin,60);
const split=s.roadTime,position=s.z+s.pd,charges=Array.from(s.ch);
g.fire(1);g.accelerate();assert.deepEqual(Array.from(s.ch),charges);assert.equal(s.boost,0);
s.pause=1;tick(100);assert.equal(s.cinematic.t,0);s.pause=0;tick(100);
assert.equal(s.t,split);assert(s.z+s.pd>position);assert.equal(s.en.filter(e=>e.boss).length,0);
tick(270);assert.equal(s.en.filter(e=>e.boss).length,1);assert.equal(s.en.find(e=>e.boss).hp,40);
tick(255);assert.equal(s.phase,'boss');assert.equal(s.cinematic,null);assert.equal(s.roadTime,split);
assert.equal(s.en.filter(e=>e.boss).length,1);assert.equal(s.hp,13);assert.deepEqual(Array.from(s.ch),charges);
tick(20);assert(s.t>split);g.hit(s.en.find(e=>e.boss),40,1);g.step(.01);
assert.equal(s.phase,'victory');assert.equal(s.run,1);const finishTime=s.t;
s.pause=1;tick(100);assert.equal(s.cinematic.t,0);s.pause=0;tick(430);assert.equal(s.run,1);assert.equal(s.t,finishTime);
tick(11);assert.equal(s.run,0);assert.equal(nodes.get('#roadTime').textContent,split.toFixed(2));
assert(nodes.get('#resultText').innerHTML.includes(finishTime.toFixed(2)));assert.equal(s.fin,61);
g.beginRun();s=g.state;assert.equal(s.phase,'road');assert.equal(s.roadTime,null);assert.equal(s.cinematic,null);
s.introRun=0;s.en=[];g.step(.01);tick(621);const boss=s.en.find(e=>e.boss);boss.l=s.l;boss.z=s.z+s.pd+8;boss.action={kind:'dragon',l:s.l,age:1.49,impact:1.5,duration:2.1,done:false};
g.step(.02);assert(s.shots.some(p=>p.kind==='fireDragon'),'boss emits dragon-shaped projectile');
s.guard=0;g.hurt(100);assert.equal(s.run,0);assert(s.defeat);tick(281);assert.equal(nodes.get('#resultTitle').textContent,'クエスト失敗');
console.log('PASS: cinematic sequence, input lock, frozen clock, pause, continuity, boss spawn once, delayed result, retry');

g.beginRun();s=g.state;s.introRun=0;s.en=[];g.step(.01);tick(621);
s.pd=7.8;s.pt=7.8;let enemy=s.en.find(e=>e.boss);enemy.z=s.z+s.pd+1.2;enemy.l=s.l;enemy.cd=100;
function sword(){enemy.action={kind:'sword',l:1,age:1.09,impact:1.1,duration:2,done:false};}
s.l=1;sword();const hp=s.hp;g.step(.02);assert.equal(s.hp,hp-3);tick(10);assert.equal(s.hp,hp-3,'sword hits once');
s.l=0;sword();g.step(.02);assert.equal(s.hp,hp-3,'lane dodge avoids sword');
s.l=1;s.guard=1;sword();g.step(.02);assert.equal(s.hp,hp-3,'guard blocks sword');
s.guard=0;enemy.action=null;enemy.cd=100;s.shots=[{kind:'fireDragon',l:0,z:s.z+s.pd+.4,d:4,t:'boss',age:0}];g.step(.02);assert.equal(s.hp,hp-3,'dragon can be dodged');
s.shots=[{kind:'fireDragon',l:1,z:s.z+s.pd+.4,d:4,t:'boss',age:0}];g.step(.02);assert.equal(s.hp,hp-7,'dragon collision deals four');
s.shots=[{kind:'fireDragon',l:1,z:s.z+s.pd+.4,d:4,t:'boss',age:0}];s.guard=1;g.step(.02);assert.equal(s.hp,hp-7,'dragon can be guarded');
console.log('PASS: sword impact timing/single hit, lane dodge, dragon collision, guard for both attacks');


// Ultimate damage, range, single-hit, recharge and pause.
s=setup();assert.equal(s.ultimateCharge,90);s.en=[0,1,2].map((l)=>({t:'boss',hp:40,max:40,l,z:35,dead:0,cd:100,mv:100,tell:0,fl:0}));
s.en.push({t:'boss',hp:40,max:40,l:1,z:100,dead:0,cd:100,mv:100,tell:0,fl:0});
assert.equal(g.fireUltimate(),true);assert.equal(s.ultimateCharge,0);assert.equal(g.fireUltimate(),false);
s.pause=1;tick(30);assert.equal(s.ultimate.t,0);s.pause=0;
tick(132);for(const e of s.en.slice(0,3))assert.equal(e.hp,30);assert.equal(s.en[3].hp,40);assert.equal(s.ultimateCharge,0,'ultimate damage never recharges itself');
assert.equal(g.fireUltimate(),false,'no recast during current effect');tick(60);assert.equal(s.ultimate,null);for(const e of s.en.slice(0,3))assert.equal(e.hp,30);
s=setup();s.ultimateCharge=0;s.en[0].hp=2;g.hit(s.en[0],10,1);assert.equal(s.ultimateCharge,2);g.hit(s.en[0],10,1);assert.equal(s.ultimateCharge,2);
s.ultimateCharge=89;assert.equal(g.fireUltimate(),false);g.reset();assert.equal(g.state.ultimateCharge,90);
console.log('PASS: ultimate 10 damage once across 3 lanes, far-screen reach, excludes offscreen reserve, damage recharge, pause, retry');

// Cut-in freezes gameplay and clock, and damage source controls recharge.
s=setup();s.en[0].hp=100;s.en[0].max=100;s.ultimateCharge=90;g.fireUltimate();
const cutinClock=s.t,cutinZ=s.z,cutinCd=s.en[0].cd;
tick(50);assert.equal(s.t,cutinClock);assert.equal(s.z,cutinZ);assert.equal(s.en[0].cd,cutinCd);assert.equal(s.en[0].hp,100);
s.pause=1;const cutinT=s.ultimate.t;tick(20);assert.equal(s.ultimate.t,cutinT);s.pause=0;
tick(25);assert(s.t>cutinClock);assert.equal(s.ultimateCharge,0);
g.hit(s.en[0],5,0);assert.equal(s.ultimateCharge,5,'normal damage recharges');
g.hit(s.en[0],8,1);assert.equal(s.ultimateCharge,13,'skill damage recharges');
g.hit(s.en[0],10,1,'ultimate');assert.equal(s.ultimateCharge,13,'ultimate does not recharge, even alongside another effect');
assert.equal(s.dealtDamage,23,'ultimate still contributes to damage score');
g.reset();assert.equal(g.state.ultimate,null);assert.equal(g.state.ultimateCharge,90);
console.log('PASS: cut-in freezes clock/world, pause/resume, normal/skill-only recharge, damage scoring, retry');

s=setup();s.ultimateCharge=0;s.en[0].hp=200;s.en[0].max=200;
g.hit(s.en[0],30,0);assert.equal(s.ultimateCharge,30);assert.equal(g.fireUltimate(),false);
g.hit(s.en[0],59,1);assert.equal(s.ultimateCharge,89);assert.equal(g.fireUltimate(),false);
g.hit(s.en[0],1,0);assert.equal(s.ultimateCharge,90);assert.equal(g.fireUltimate(),true);assert.equal(s.ultimateCharge,0);
console.log('PASS: ultimate requires exactly 90 effective normal/skill damage');

// Speed and safe play dominate waiting for extra skill finishes.
s=setup();s.t=180;s.fin=30;s.dealtDamage=214;const scoreFast=g.score(1);
s.t=185;s.fin=31;assert(g.score(1).total<scoreFast.total,'five-second recovery wait is not rewarded');
s.t=180;s.fin=30;s.dmg=1;assert(g.score(1).total<scoreFast.total,'damage reduces score');
s.dmg=0;s.overkill=99999;assert.equal(g.score(1).total,scoreFast.total,'overkill cannot farm score');
s.t=0;s.fin=61;s.dealtDamage=214;assert.equal(g.score(1).total,4350000);assert.equal(g.score(0).time,0);assert.equal(g.score(0).damage,0);
s.t=600;const scoreSlow=g.score(1).time;s.t=601;assert(g.score(1).time<scoreSlow,'time still matters on slow runs');
console.log('PASS: time-focused balance, safe play, score caps, no overkill farming');

// Backward motion drives alternating full-body frames; pause freezes the pose.
g.beginRun();s=g.state;s.introRun=0;s.en=[];g.step(.01);tick(621);
const steppingBoss=s.en.find(e=>e.boss);s.guard=1;steppingBoss.action=null;steppingBoss.attackCount=2;steppingBoss.cd=100;steppingBoss.z=s.z+s.pd+1.5;
g.step(.02);assert.equal(steppingBoss.backstepActive,true);const phaseA=steppingBoss.backstepPhase;tick(30);assert.notEqual(steppingBoss.backstepPhase,phaseA,'boss resumes stepping');
s.pause=1;const frozenStep=steppingBoss.backstepPhase;tick(20);assert.equal(steppingBoss.backstepPhase,frozenStep);s.pause=0;
steppingBoss.z=s.z+9;g.step(.3);assert(steppingBoss.z>=s.z+9);
console.log('PASS: boss steps and retreats; pause freezes movement');

s=setup();s.t=75.43;assert.equal(g.score(1).time,2996560);s.t=180;const baseTime=g.score(1).time;s.t=185;assert.equal(baseTime-g.score(1).time,40000);
s.t=299.99;const beforeJoin=g.score(1).time;s.t=300;const atJoin=g.score(1).time;s.t=300.01;const afterJoin=g.score(1).time;assert(beforeJoin>atJoin&&atJoin>afterJoin);assert.equal(atJoin,1200000);
console.log('PASS: reference scale, 8000 points per second, continuous long-run scoring');

// All-lane slash: half-second warning, one hit in every lane, guard and pause.
for(let lane=0;lane<3;lane++){
 s=setup();s.pd=7;s.pt=7;s.l=lane;s.hp=20;const e={t:'boss',boss:true,z:9,l:1,displayLane:1,hp:40,max:40,attackCount:0,cd:100,action:{kind:'wide',l:1,age:0,impact:.5,duration:1.25,done:false}};s.en=[e];
 assert.equal(g.bossAuraProgress(e),0);g.updateBoss(e,.49);assert.equal(s.hp,20);assert(g.bossAuraProgress(e)>.9);g.updateBoss(e,.02);assert.equal(s.hp,16);assert.equal(g.bossAuraProgress(e),-1);g.updateBoss(e,.1);assert.equal(s.hp,16);
 e.action={kind:'wide',l:1,age:.49,impact:.5,duration:1.25,done:false};s.guard=1;g.updateBoss(e,.02);assert.equal(s.hp,16);
}

s=setup();s.phase='boss';s.guard=1;const arenaBoss={t:'boss',boss:true,z:9,l:1,displayLane:1,hp:40,max:40,attackCount:0,cd:0,wideCd:1,dragonCd:99};s.en=[arenaBoss];
const fixedCamera=s.z;tick(400);assert.equal(s.z,fixedCamera);assert(arenaBoss.z>=s.z+9);assert(arenaBoss.wideCd<=4.4);
s=setup();s.pd=8;s.pt=8;s.en=[];const instant={t:'boss',boss:true,z:9,l:1,displayLane:1,hp:40,max:40,attackCount:0,cd:0,wideCd:3,dragonCd:99};
g.updateBoss(instant,.01);assert.equal(s.hp,18);assert.equal(instant.action,undefined);assert.equal(instant.tell,0);assert.equal(g.bossAuraProgress(instant),-1);
s.guard=1;instant.cd=0;g.updateBoss(instant,.01);assert.equal(s.hp,18);
instant.wideCd=0;g.updateBoss(instant,.01);assert.equal(instant.action.kind,'wide');assert.equal(instant.action.impact,.38);assert(instant.wideCd>=2.0&&instant.wideCd<=3.3);
console.log('PASS: centered boss, fixed arena camera, immediate normal attacks, independent randomized skill interval');

s=setup();s.phase='boss';s.pd=4.7;s.en=[{t:'boss',boss:true,z:9,l:1,displayLane:1,hp:40,max:40,attackCount:0,cd:100,wideCd:100,dragonCd:100,fl:0}];s.l=1;
tick(30);assert(s.en[0].hp<40,'hero can still hit centered boss');assert.equal(s.z,0);assert(s.en[0].z>=9);
console.log('PASS: centered boss stays reachable by player normal attack');

// Completing a dash must never pull the player backward automatically.
s=setup();s.phase='boss';s.pd=7.4;s.pt=7.4;s.en=[{t:'boss',boss:true,z:9,l:1,displayLane:1,hp:40,max:40,attackCount:0,cd:100,wideCd:100,dragonCd:100,fl:0}];
const closeDepth=s.pd;tick(70);assert(s.pd>=closeDepth,'never push player backward after dash');assert.equal(s.z,0);
g.depth(-2);tick(20);assert(s.pd<closeDepth-1,'intentional backward swipe remains functional');
console.log('PASS: no automatic boss pushback, voluntary retreat preserved');

// Sustained retreat stays beyond center and attacks during backward stepping.
s=setup();s.phase='boss';s.guard=1;s.l=0;const retreatBoss={t:'boss',boss:true,z:9,l:1,displayLane:1,hp:40,max:40,attackCount:0,cd:100,wideCd:.1,dragonCd:100};s.en=[retreatBoss];
let slashes=0;for(let i=0;i<2000;i++){g.step(.01);assert(retreatBoss.z-s.z>=9);assert.equal(s.z,0);if(retreatBoss.action?.kind==='wide'&&retreatBoss.action.done){slashes++;}}
assert(retreatBoss.z>=9&&retreatBoss.z<=15);assert(slashes>0);console.log('PASS: moving boss repeats its slashes');

// Both skills ignore early taps without spending charges, then permit cancellation.
for(const first of [1,2])for(const second of [1,2]){
 s=setup();g.fire(first);const active=s.skill,charges=Array.from(s.ch);active.t=active.d*.5-.0001;g.fire(second);assert.equal(s.skill,active);assert.deepEqual(Array.from(s.ch),charges);
 active.t=active.d*.5;g.fire(second);assert.notEqual(s.skill,active);assert.equal(s.skill.k,second);assert.equal(s.skill.t,0);assert.equal(s.ch[second-1],charges[second-1]-1);
}
s=setup();g.fire(2);s.skill.t=s.skill.d*.5;s.ch[0]=0;const active=s.skill;g.fire(1);assert.equal(s.skill,active);
s=setup();g.fire(1);tick(34);const emitted=s.waves[0];assert(emitted);g.fire(2);assert(s.waves.includes(emitted));console.log('PASS: skill input lock before 50%, cancel at 50%, charges and emitted attacks preserved');

s=setup();const cues=[];context.window.GameSFX={play:k=>cues.push(k)};g.fireUltimate();tick(83);assert.equal(cues.filter(k=>k==='ultimateFlight').length,0);tick(5);assert.equal(cues.filter(k=>k==='ultimateFlight').length,1);tick(60);assert.equal(cues.filter(k=>k==='ultimateFlight').length,1);console.log('PASS: flight audio fires once when blade launches');

s=setup();const falls=[];context.window.GameSFX={play:k=>falls.push(k),finish:()=>{}};s.hp=1;const deathClock=s.t;g.hurt(2);assert(s.defeat);assert.equal(s.hp,0);g.fire(1);assert.equal(s.skill,null);tick(77);assert(!falls.includes('heroFall'));s.pause=1;tick(30);assert(s.defeat.t<.78);s.pause=0;tick(2);assert.equal(falls.filter(k=>k==='heroFall').length,1);assert(!s.defeat.finished);tick(202);assert(s.defeat.finished);assert.equal(s.t,deathClock);assert.equal(falls.filter(k=>k==='heroFall').length,1);g.beginRun();assert.equal(g.state.defeat,null);console.log('PASS: defeat sequence locks input, freezes combat clock, single impact sound, pause and reset');

// Wide slash locks one depth row when the flame warning begins; backward dodge escapes it.
for(const lane of [0,1,2])for(const dodge of [false,true]){
 s=setup();s.phase='boss';s.pd=10;s.pt=10;s.l=lane;const e={t:'boss',boss:true,z:12,l:1,displayLane:1,hp:999,max:999,cd:100,wideCd:0,dragonCd:100,attackCount:0};s.en=[e];g.updateBoss(e,.01);const locked=e.action.targetZ;assert(locked>9&&locked<10);if(dodge)g.depth(-3.2);tick(51);assert.equal(s.hp,dodge?20:16);assert.equal(e.action.targetZ,locked);
}
console.log('PASS: all three lanes hit in one locked depth row; backward swipe avoids damage');

// No remote melee damage; missiles must actually cross the player.
for(const pd of [0,3,5]){s=setup();s.pd=pd;s.pt=pd;s.en=[];const e={t:'boss',boss:true,z:12,l:1,displayLane:1,hp:40,cd:0,wideCd:0,dragonCd:99,attackCount:0};g.updateBoss(e,.01);g.updateBoss(e,.51);e.action=null;e.cd=0;g.updateBoss(e,.01);assert.equal(s.hp,20,'far player is safe from melee and wide slash');}
s=setup();s.phase='boss';s.pd=7;s.pt=7;s.en=[{t:'boss',boss:true,z:12,l:1,displayLane:1,hp:999,cd:100,wideCd:100,dragonCd:100}];s.shots=[{kind:'fireDragon',l:1,z:5,d:4}];tick(1);assert.equal(s.hp,20,'already passed missile cannot hit');console.log('PASS: distant melee immunity and no projectile hits from behind');

// The boss and camera remain fixed while time, player input, and attacks advance.
s=setup();s.phase='boss';s.guard=1;const stationary={t:'boss',boss:true,z:9,l:1,displayLane:1,hp:999,cd:100,wideCd:100,dragonCd:100};s.en=[stationary];tick(2400);assert(stationary.z>=9&&stationary.z<=15);assert(stationary.stepClock>0);assert.equal(s.z,0);
s=setup();s.phase='boss';s.pd=0;s.pt=0;s.l=0;s.en=[{t:'boss',boss:true,z:9,l:1,displayLane:1,hp:999,cd:100,wideCd:100,dragonCd:100}];s.dashUntil=.5;g.accelerate();tick(40);assert.equal(s.dash,null);assert(s.en[0].z-s.z-s.pd<2);assert.equal(s.z,0);assert(s.en[0].z>=9);
console.log('PASS: moving boss, fixed arena camera, and dash stops at contact');
