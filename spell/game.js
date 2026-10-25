(()=>{const $=s=>document.querySelector(s),cv=$('#game'),c=cv.getContext('2d');let W,H,last=0,S,combatSeed=17319;function random(){combatSeed=(Math.imul(combatSeed,1664525)+1013904223)>>>0;return combatSeed/4294967296}const C=(v,a,b)=>Math.max(a,Math.min(b,v)),R=(a,b)=>a+random()*(b-a),RI=(a,b)=>Math.floor(R(a,b+1)),E=t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;const D={slime:{hp:2,d:1,r:0,h:205},skeleton:{hp:2,d:2,r:0,h:220},mage:{hp:3,d:2,r:1,h:228},bonobo:{hp:5,d:3,r:0,h:245},dragon:{hp:4,d:4,r:1,h:215},boss:{hp:50,d:4,r:0,h:300}},im={};const src={"ultimateDiamondDust":"assets/ultimateDiamondDust.jpeg","ultimateImpactIce":"assets/ultimateImpactIce.jpeg","bossParalyzed":"assets/bossParalyzed.jpeg","statusParalysis":"assets/statusParalysis.png","redrawnFire":"assets/redrawnFire.png","redrawnIce":"assets/redrawnIce.png","ultimateDarkFire":"assets/ultimateDarkFire.png","reflectionDome":"assets/reflectionPurple.png","flightFire":"assets/flightFire.jpeg","flightIce":"assets/flightIce.jpeg","bossEntrance":"assets/bossEntrance.jpeg","blastIceUp":"assets/blastIceUp.png","blastIceSide":"assets/blastIceSide.png","blastFireUp":"assets/blastFireUp.png","blastFireSide":"assets/blastFireSide.png","heroRun": "assets/heroRun.png", "heroFall": "assets/heroFall.png", "heroBase": "assets/heroBaseCorrect.png", "portrait": "assets/portrait.png", "icon1": "assets/icon1SpeedFireV2.png", "icon2": "assets/icon2.png", "iconUlt": "assets/iconUltimateBlueHand.png", "iconGuard": "assets/iconReflectPurple.png", "bossMove": "assets/bossMove.png", "boss1": "assets/boss1.png", "boss2": "assets/boss2.png", "boss3": "assets/boss3.png", "boss4": "assets/boss4.png", "bossFire": "assets/bossFire.png", "bossIce": "assets/bossIce.png", "bossBlack": "assets/bossBlack.png", "bossYellow": "assets/bossYellow.png", "slime": "assets/slime.png", "skeleton": "assets/skeleton.png", "mage": "assets/mage.png", "dragon": "assets/dragon.png", "shot1": "assets/shot1.png", "shot2": "assets/shot2.png", "shot3": "assets/shot3.png", "shot4": "assets/shot4.png", "vfxFire": "assets/vfxFire.png", "vfxIce": "assets/vfxIce.png", "sky": "assets/sky.png", "ground": "assets/ground.png", "rocks": "assets/rocks.png"};for(const k in src){im[k]=new Image;im[k].src=src[k]}
function size(){const v=window.visualViewport;W=v?v.width:innerWidth;H=v?v.height:innerHeight;const frame=$('#gameViewport');frame.style.width=W+'px';frame.style.height=H+'px';frame.style.top=(v?v.offsetTop:0)+'px';frame.style.left=(v?v.offsetLeft:0)+'px';let d=Math.min(devicePixelRatio||1,2);cv.width=W*d;cv.height=H*d;c.setTransform(d,0,0,d,0,0)}addEventListener('resize',size);if(window.visualViewport){window.visualViewport.addEventListener('resize',size);window.visualViewport.addEventListener('scroll',size)}size();function sh(a){for(let i=a.length-1;i;i--){let j=RI(0,i);[a[i],a[j]]=[a[j],a[i]]}return a}function mk(t,z){return{t,z,l:RI(0,2),hp:D[t].hp,max:D[t].hp,dead:0,cd:R(1.8,3.8),tell:0,mv:R(.7,2),fl:0}}function roster(){const types=[null,'slime','skeleton','mage','dragon','bonobo'];const waves=[[1,1,2,2,1,2],[2,2,2,1,1,1],[1,2,1,1,4,4],[3,2,2,3,2,1],[3,2,2,3,2,2],[2,4,2,2,5,2],[3,5,2,3,4,2],[5,2,2,5,2,2],[4,3,2,4,3,2],[5,4,2,5,4,2]];return waves.flatMap((pack,group)=>pack.map((number,i)=>{const row=Math.floor(i/3),e=mk(types[number],18+group*ENEMY_GROUP_GAP+row*ENEMY_ROW_GAP);e.l=i%3;e.group=group;return e}))}function reset(){$('#gameViewport').classList.remove('cinematic');combatSeed=17319;S={run:0,pause:0,t:0,phase:'road',defeat:null,cinematic:null,roadTime:null,bossStartedAt:null,hp:30,dmg:0,dealtDamage:0,ultimateCharge:90,ultimate:null,overkill:0,z:0,l:1,guard:0,guardPose:0,guardImpact:0,introRun:0,ch:[4,4],fr:[0,0],skill:null,fin:0,dashUntil:-1,dash:null,boost:0,normalAttack:null,norm:0,en:roster(),shots:[],ptr:null,hit:0,pd:0,pt:0,notice:null,ll:1,fx:[],waves:[],waterFx:[],earthFx:[],combo:0,comboTime:0,shake:0,speed:0,runPhase:0,retreat:0};hideNotice();ui()}function ui(){updateUltimateUI();const hpRatio=C(S.hp/30,0,1),hpColor='hsl('+(120*hpRatio)+',100%,50%)';$('#hp').textContent=Math.ceil(C(S.hp,0,30))+'/30';$('#hpf').style.width=(hpRatio*100)+'%';$('#hpf').style.background=hpColor;$('#hpbar').style.background=hpRatio===0?'#ff0000':'#17212b';$('#hpbar').style.borderColor=hpColor;$('#time').textContent=S.t.toFixed(1);$('#fin').textContent=S.fin;const boss=S.en.find(e=>e.boss);$('#bossHud').classList.toggle('hide',S.phase!=='boss'||!!S.cinematic);$('#bossHp').textContent=boss?Math.max(0,boss.hp)+' / '+boss.max:'';for(let i=0;i<2;i++){
  // The original five charges remain unchanged; show partial recharge too.
  const fill=C((S.ch[i]+(S.ch[i]<4?S.fr[i]:0))/4,0,1);
  $('#g'+(i+1)).style.strokeDashoffset=String(100*(1-fill));
  const button=$('#s'+(i+1));
  if(button._charges!==S.ch[i]){
    button._charges=S.ch[i];
    button.setAttribute('aria-label',(i===0?'五月雨':'回転閃')+'：残り'+S.ch[i]+'回');
    button.setAttribute('aria-disabled',String(S.ch[i]<1));
  }
}}// pd/pt are player depth in the same world units as enemy.z and stage S.z.
const HORIZON=.26,GROUND_SPAN=.49,RUN_SPEED=9;
const ENEMY_ROW_GAP=3,ENEMY_GROUP_GAP=32;
// One dash covers one pack interval, then returns to ordinary running.
const SUPERDASH_DISTANCE=ENEMY_GROUP_GAP*2,SUPERDASH_SPEED=42;
// One footfall is half the existing run cycle. Each swipe adds that much travel.
const RUN_PHASE_PER_UNIT=1.35,SWIPE_STEP_DISTANCE=Math.PI/RUN_PHASE_PER_UNIT,SWIPE_DECAY=.12;
const MAX_DEPTH=(GROUND_SPAN/(.46-HORIZON)-1)/.115, FRONT_GAP=.7,BOSS_DEPTH=15,BOSS_SLASH_DEPTH=MAX_DEPTH/4;
// Reference framing: horizon 26%, running feet 58%, body above center.
const RUN_DEPTH=(GROUND_SPAN/(.58-HORIZON)-1)/.115,DASH_DEPTH=(GROUND_SPAN/(.53-HORIZON)-1)/.115;
function distance(e){return e.z-S.z-S.pd}
function front(){let z=Infinity;for(const e of S.en)if(!e.dead)z=Math.min(z,e.z);return z}
function depthLimit(){return C(front()-S.z-FRONT_GAP,0,MAX_DEPTH)}
function updateDepth(dt){
  // In boss combat, patrol proximity must not move an idle player.
  if(S.phase==='boss'&&S.retreat<=0)return;
  const limit=depthLimit();
  if(S.retreat>0){
    S.retreat=Math.max(0,S.retreat-dt);
    S.pt=Math.min(S.pt,limit);
    S.pd+=(S.pt-S.pd)*(1-Math.exp(-11*dt));
  }
  S.pd=C(S.pd,0,limit);
}
function adv(n){
  if(S.phase==='boss'){
    // Player input never shifts the arena camera or the boss patrol.
    if(S.retreat>0&&!S.dash)return 0;
    const target=S.dash||S.boost>0?depthLimit():Math.max(S.pd,Math.min(depthLimit(),RUN_DEPTH));
    const move=Math.min(Math.max(0,target-S.pd),n*(S.dash?1:.65));
    S.pd+=move;S.pt=S.pd;return move;
  }
  const moved=Math.min(n,Math.max(0,front()-S.z-S.pd-FRONT_GAP));
  const target=S.retreat>0?S.pd:(S.dash||S.boost>0?DASH_DEPTH:RUN_DEPTH);
  // Split world travel between the character and the following camera.
  // Their sum remains exactly the travelled distance, including at contact.
  const depthMove=target>S.pd?Math.min(target-S.pd,moved*.65):Math.max(target-S.pd,-n*.65);
  S.pd+=depthMove;S.z+=moved-depthMove;
  if(!S.retreat)S.pt=target;
  return moved;
}
function sound(kind,type){if(window.GameSFX)window.GameSFX.play(kind,type)}function hurt(n){if(S.defeat)return;if(S.guard){S.guardImpact=.38;sound('guardBlock');return;}S.combo=0;S.shake=.18;burst(S.l,S.z+S.pd,'#ff7563',12);sound('hurt');S.hp-=n;S.dmg+=n;S.hit=.15;if(S.hp<=0)beginDefeat()}function hit(e,n,sk,source=sk?'skill':'normal'){if(e.dead)return;const dealt=Math.min(Math.max(0,e.hp),Math.max(0,n));S.dealtDamage+=dealt;if(source==='normal'||source==='skill')S.ultimateCharge=C(S.ultimateCharge+dealt,0,ULTIMATE.capacity);S.overkill+=Math.max(0,n-Math.max(0,e.hp));sound('hit',e.t);if(sk)S.fx.push({kind:'spearImpact',l:e.l,z:e.z,t:0,life:.32,gold:source==='ultimate'});e.hp-=n;e.fl=.12;S.combo++;S.comboTime=2;S.fx.push({kind:'number',l:e.l,z:e.z,n:n,t:0,life:.8,color:sk?'#fff079':'#ffffff'});burst(e.l,e.z,sk?'#b5f7ff':'#ffffff',9);S.shake=sk?.08:.035;if(e.tell>0&&!e.boss){e.tell=0;e.cd=R(1.8,3.8)}if(e.hp<=0){e.dead=1;e.fade=.4;burst(e.l,e.z,'#ffdfa0',18);sound('down',e.t);S.dashUntil=S.t+.5;if(sk)S.fin++}}function hideNotice(){const n=$('#actionName');n.style.opacity='0';n.classList.remove('moveArrow');if(S)S.notice=null}
// Compact skill label, styled to match the forest HUD.
function notice(text,seconds,arrow=false){
  const plate=text==='五月雨'||text==='回転閃';
  S.notice={text,left:seconds,total:seconds,arrow,plate};const n=$('#actionName');
  const ultimatePlate=text==='渾身の急所突き';n.classList.toggle('ultimate-nameplate',ultimatePlate);
  n.classList.toggle('nameplate',plate);n.classList.toggle('moveArrow',arrow);
  n.style.width='';n.style.height='';
  if(ultimatePlate){n.innerHTML='<span class="ultimate-title">渾身の急所突き</span>';}else if(plate){
    n.innerHTML='<span class="plaque-name">'+text+'</span>';
  }else n.textContent=text;
  n.style.opacity='1';placeNotice();
}
function noticePosition(){return {x:playerX(),y:Math.max(88,playerY()-playerHeight()*1.36-36)}}
function placeNotice(){
  if(!S.notice)return;const state=S.notice,n=$('#actionName'),pos=noticePosition(),age=state.total-state.left;
  if(state.text==='渾身の急所突き'){n.style.left=W/2+'px';n.style.top=Math.max(105,Math.min(145,H*.18))+'px';n.style.transform='translate(-50%,-50%)';n.style.opacity=String(Math.min(1,age/.05,state.left/.18));return;}
  n.style.left=pos.x+'px';n.style.top=pos.y+'px';
  const entrance=C(age/.12,0,1),scale=state.plate?.97+.03*E(entrance):1;
  const lift=state.plate?(1-E(entrance))*3:0;
  n.style.transform='translate(-50%,calc(-100% + '+lift+'px)) scale('+scale+')';n.style.transformOrigin='50% 100%';
  n.style.opacity=String(Math.min(1,age/.07,state.left/.13));
}
function flash(button){button.classList.remove('flash');void button.offsetWidth;button.classList.add('flash')}
const ULTIMATE={capacity:90,duration:1.8,cutin:.72,windup:1.02,travel:.45};
function updateUltimateUI(){
  const value=C(S.ultimateCharge,0,ULTIMATE.capacity),button=$('#ultimate');
  $('#ultimateFill').style.strokeDashoffset=String(100*(1-value/ULTIMATE.capacity));
  button.setAttribute('aria-label','奥義・渾身の急所突き：ゲージ'+Math.floor(value)+'/'+ULTIMATE.capacity);
  button.setAttribute('aria-disabled',String(value<ULTIMATE.capacity));
}
function cancelAttackMotion(){
  if(S.skill&&!S.skill.done&&S.skill.waterVisual)S.waterFx=S.waterFx.filter(f=>f!==S.skill.waterVisual);
  S.skill=null;S.ultimate=null;S.normalAttack=null;S.normalFlash=0;
}
function fireUltimate(){
  if(!S.run||S.pause||S.cinematic||S.ultimateCharge<ULTIMATE.capacity)return false;
  cancelAttackMotion();
  S.ultimateCharge=0;S.guard=0;S.normalAttack=null;S.normalFlash=0;
  S.ptr=null;S.dash=null;S.boost=0;S.ultimate={t:0,origin:S.z+S.pd,far:S.z+S.pd+45,l:S.l,seen:new Set()};hideNotice();sound('ultimateCutin',0);updateUltimateUI();return true;
}
function updateUltimate(dt){
  const a=S.ultimate;if(!a)return;a.t+=dt;
  const progress=C((a.t-ULTIMATE.windup)/ULTIMATE.travel,0,1);
  if(progress>0){
    if(!a.fired){a.fired=true;notice('渾身の急所突き',1.15);sound('ultimateFlight');}
    const front=a.origin+(a.far-a.origin)*progress;
    for(const e of S.en){
      if(e.dead||e.l!==a.l||a.seen.has(e)||e.z<a.origin||e.z>a.far||e.z>front)continue;
      a.seen.add(e);hit(e,bDamage('ultimate',e.z-a.origin),1,'ultimate');
    }
  }
  if(a.t>=ULTIMATE.duration)S.ultimate=null;
}
function ultimateCutinActive(){return !!S.ultimate&&S.ultimate.t<ULTIMATE.cutin;}
function drawUltimateCutin(t){
  // Reference: cyan slash enters, a narrow diagonal eye cut, then cyan exit slash.
  const enter=E(C((t-.06)/.12,0,1)),exit=E(C((t-.56)/.16,0,1));
  c.save();c.fillStyle='rgba(2,5,14,'+(.77*Math.min(1,t/.08)*(1-exit))+')';c.fillRect(0,0,W,H);
  const cy=H*.49,bandH=H*.135,tilt=H*.115,slide=(1-enter)*W-exit*W*.45;
  c.save();c.translate(slide,0);c.beginPath();c.moveTo(-W*.12,cy-bandH*.12);c.lineTo(W*1.12,cy-bandH*.12-tilt);c.lineTo(W*1.12,cy+bandH*.78-tilt*.20);c.lineTo(-W*.12,cy+bandH*.78);c.closePath();c.clip();
  c.fillStyle='#0a111c';c.fillRect(-W,0,W*3,H);
  const img=im.ultimateFace;
  if(img.complete&&img.naturalWidth){
    const width=W*2.12*(1+.035*t/.72),height=width*img.naturalHeight/img.naturalWidth;
    c.drawImage(img,W*.50-width*.51,cy-height*.43,width,height);
  }
  c.restore();
  // Sweeping forked ribbons reproduce the recorded cyan entry/exit motion.
  function slash(progress,reverse){
    if(progress<=0||progress>=1)return;
    c.save();c.globalAlpha=Math.sin(Math.PI*progress);c.translate((progress*2-1)*W*(reverse?-1:1),0);
    c.fillStyle='#c4ffff';c.shadowColor='#75eaff';c.shadowBlur=18;
    for(let i=0;i<3;i++){
      const y=H*(.31+i*.22);c.beginPath();c.moveTo(-W*.65,y+H*.12);
      c.bezierCurveTo(W*.06,y-H*.05,W*.68,y-H*.12,W*1.45,y-H*.10);
      c.bezierCurveTo(W*.92,y-H*.13,W*.38,y+H*.03,-W*.65,y+H*.12);
      c.closePath();c.fill();
      c.beginPath();c.moveTo(W*.15,y+H*.025);c.lineTo(W*.52,y-H*.055);c.lineTo(W*.34,y+H*.006);c.closePath();c.fill();
    }c.restore();
  }
  slash(t/.20,false);slash((t-.54)/.18,true);c.restore();
}
function drawUltimate(){
 const a=S.ultimate;if(!a)return;if(a.t<ULTIMATE.cutin){drawUltimateCutin(a.t);return;}
 const age=a.t-ULTIMATE.windup,h=playerHeight(),x=playerX(),y=playerY();
 if(age<0){const q=C((a.t-ULTIMATE.cutin)/(ULTIMATE.windup-ULTIMATE.cutin),0,1);paintVfx(im.vfxUltimate,q<.35?0:1,x,y-h*.62,h*1.6,h*2.13,Math.min(1,q*6));return;}
 // Purple/white ribbons use the original shape and motion, then white arcs fade.
 // Avoid frames 2-3: generation retained the reference weapon in those two cells.
 const frame=4+3*C(age/(ULTIMATE.duration-ULTIMATE.windup),0,1),alpha=1-C((age-.56)/.22,0,1);
 const farZ=a.far-S.z,top=yy(farZ)-55*perspective(farZ),bottom=H+24,height=bottom-top;
 paintVfx(im.vfxUltimate,frame,lx(a.l,S.pd),(top+bottom)/2,height*.75,height,alpha);
}
function fire(k){
  if(!S.run||S.pause||S.cinematic)return;
  // A skill button press ends an active superdash immediately, before cast checks.
  if(S.dash){S.dash=null;S.boost=0;S.speed=0;S.dashUntil=-1;}
  if(S.ch[k-1]<1)return;
  // The newest available skill tap cancels and replaces the current motion.
  cancelAttackMotion();
  S.guard=0;S.normalAttack=null;S.normalFlash=0;S.ch[k-1]--;S.skill={k,l:S.l,t:0,d:k===1?.98:.8,done:0,emitted:0,hitCounts:new Map()};
  sound(k===1?'waterStart':'continentStart');
  notice(k===1?'五月雨':'回転閃',k===1?.98:.8);
}
function lane(d){
  if(S.cinematic||ultimateCutinActive())return;
  const next=C(S.l+d,0,2);if(next===S.l)return;
  S.dash=null;S.l=next;notice(d<0?'←':'→',.3,true);
}
// One kill opens one inclusive 0.5-second window on the active game clock.
function accelerate(){
  if(!S.run||S.pause||S.cinematic||ultimateCutinActive())return;
  S.retreat=0;
  if(!S.dash&&S.dashUntil>=0&&S.t<=S.dashUntil+1e-9){
    S.dash={n:SUPERDASH_DISTANCE};sound('superdash');S.dashUntil=-1;S.boost=0;
  }else S.boost+=SWIPE_STEP_DISTANCE;
}
function runForward(dt){
  // Integrate the short speed impulse exactly, so repeated swipes add full steps
  // at any frame rate. A blocked step expires instead of teleporting past an enemy.
  const extra=S.boost<.001?S.boost:S.boost*-Math.expm1(-dt/SWIPE_DECAY);
  adv((S.phase==='boss'?0:RUN_SPEED*dt)+extra);S.boost=Math.max(0,S.boost-extra);
}
function depth(d){if(S.cinematic||ultimateCutinActive())return;S.retreat=1;S.pt=C(S.pd+d,0,depthLimit())}

// Boss definition stays provisional until the user's boss specification arrives.
const BOSS_PRESENTATION={name:'BOSS',image:'boss'};
function lockCinematic(kind){
  S.cinematic={kind,t:0};S.ptr=null;S.guard=0;S.guardPose=0;S.guardImpact=0;
  S.skill=null;S.ultimate=null;S.normalAttack=null;S.norm=0;S.dash=null;S.dashUntil=-1;S.boost=0;
  S.shots=[];S.waves=[];S.waterFx=[];S.earthFx=[];S.fx=[];S.hit=0;S.shake=0;
  hideNotice();$('#gameViewport').classList.add('cinematic');
}
function startBoss(){
  if(S.phase!=='road'||S.cinematic)return;
  S.roadTime=S.t;S.en=[];S.phase='bossIntro';lockCinematic('entry');
}
function revealBoss(){
  const boss=mk(BOSS_PRESENTATION.image,S.z+BOSS_DEPTH);
  Object.assign(boss,{boss:true,hp:50,max:50,l:1,displayLane:1,cd:1.4,mv:2,action:null,attackCount:0});S.en.push(boss);
}
function startVictory(){
  if(S.cinematic||ultimateCutinActive())return;S.phase='victory';lockCinematic('victory');
}
function stepCinematic(dt){
  const scene=S.cinematic;scene.t+=dt;
  if(scene.kind==='entry'){
    // Run through the same scenery, then introduce the boss before combat resumes.
    if(scene.t<2.6){const moved=adv(6*dt);S.runPhase+=moved*RUN_PHASE_PER_UNIT;S.speed=6;}
    else S.speed=0;
    if(scene.t>=3.6&&!S.en.some(e=>e.boss))revealBoss();
    if(scene.t>=6.2){S.phase='boss';S.bossStartedAt=S.t;S.boost=0;S.dash=null;S.retreat=0;S.pt=S.pd;S.speed=0;S.cinematic=null;$('#gameViewport').classList.remove('cinematic');}
  }else if(scene.t>=4.4){S.cinematic=null;$('#gameViewport').classList.remove('cinematic');end(1);}
}
function cinematicRibbon(title,subtitle,y,alpha=1){
  c.save();c.globalAlpha=alpha;const w=Math.min(W*.9,480),x=(W-w)/2;
  c.fillStyle='rgba(12,32,36,.92)';c.fillRect(x,y-30,w,76);
  c.strokeStyle='#d9bb71';c.lineWidth=1;c.strokeRect(x,y-30,w,76);
  c.textAlign='center';c.fillStyle='#fff3c8';c.font='bold '+Math.min(28,W*.07)+'px serif';c.fillText(title,W/2,y);
  c.font='13px sans-serif';c.fillStyle='#e5dcc5';c.fillText(subtitle,W/2,y+26);c.restore();
}
function drawCinematic(){
  if(!S.cinematic)return;const {kind,t}=S.cinematic;c.save();
  if(kind==='entry'){
    if(t<1.5)cinematicRibbon('道中クリア','BOSSへ',H*.29,Math.min(1,t/.2,(1.5-t)/.25));
    else if(t<3.6){
      const a=Math.min(1,(t-1.5)/.35);c.fillStyle='rgba(30,5,8,'+(.32*a)+')';c.fillRect(0,0,W,H);
      c.fillStyle='#361319';c.fillRect(0,0,W,H*.10*a);c.fillRect(0,H*(1-.10*a),W,H*.10*a);
      cinematicRibbon('BOSS APPROACHING','強敵の気配',H*.38,a);
    }else{
      const q=C((t-3.6)/2,0,1),img=im[BOSS_PRESENTATION.image];
      c.fillStyle='rgba(8,16,22,.75)';c.fillRect(0,0,W,H);
      if(img.complete&&img.naturalWidth){const rect=crop(img),h=H*(.53-.10*E(q)),w=h*rect[2]/rect[3];c.drawImage(img,...rect,W/2-w/2,H*.62-h,w,h);}
      cinematicRibbon(BOSS_PRESENTATION.name,'',H*.74,Math.min(1,(t-3.6)/.3));
      if(t>5.65){c.fillStyle='rgba(249,241,216,'+(C((t-5.65)/.55,0,1)*.88)+')';c.fillRect(0,0,W,H);}
    }
  }else{
    if(t>=1.6)cinematicRibbon('QUEST CLEAR','クエストクリア',H*.40,Math.min(1,(t-1.6)/.4));
    if(t>3.6){c.fillStyle='rgba(247,236,210,'+C((t-3.6)/.8,0,1)+')';c.fillRect(0,0,W,H);}
  }
  c.restore();
}
// Boss attack timelines share one clock with their visual frames and collision.
// Boss decisions use fresh browser entropy, independent of the reproducible road roster.
function bossRandom(){if(globalThis.crypto?.getRandomValues){const v=new Uint32Array(1);globalThis.crypto.getRandomValues(v);return v[0]/4294967296;}return Math.random();}
function bossRange(a,b){return a+(b-a)*bossRandom();}
function bossMove(e){
 const lane=e.displayLane??e.l??1,depth=e.z-S.z;
 const first=!e.openingRetreatAssigned;e.openingRetreatAssigned=true;
 // Always retreat straight into the screen first; subsequent patrols start
 // at the actual current depth so the return from 18 never teleports to 15.
 const target=first?[lane,18]:[bossRange(0,2),bossRange(9,15)];
 return {t:0,fromLane:lane,fromDepth:depth,target,duration:bossRange(1.4,3.8),stride:bossRange(.52,.86)};
}
function resetBossSkillTimers(e){e.wideCd=bossRange(1.1,4.0);e.dragonCd=bossRange(1.1,4.0);}
function updateBoss(e,dt){
  // A stable center-stage position (feet ~50% of screen height).
  if(e.recover){e.recover.age+=dt;if(e.recover.age>=(e.recover.kind==='dragon'?.11:.22))e.recover=null;}
  const beforeMove=e.z,centerZ=S.z+BOSS_DEPTH;
  if(!e.patrol)e.patrol=bossMove(e);
  const p=e.patrol,target=p.target,duration=p.duration;
  // Slide in a fixed directional pose, without footstep pauses or bobbing.
  p.t=Math.min(duration,p.t+(e.action?0:dt));
  const q=p.t/duration,oldLane=e.displayLane??p.fromLane;
  e.displayLane=p.fromLane+(target[0]-p.fromLane)*q;e.l=Math.round(e.displayLane);
  e.z=centerZ+(p.fromDepth-BOSS_DEPTH)+(target[1]-p.fromDepth)*q;
  const movement=e.z-beforeMove,lateral=e.displayLane-oldLane;
  e.moveActive=Math.abs(movement)+Math.abs(lateral)>1e-6;
  e.movePose=!e.moveActive?1:Math.abs(target[0]-p.fromLane)*3>Math.abs(target[1]-p.fromDepth)?(lateral<0?4:5):(movement<0?2:3);
  if(p.t>=duration)e.patrol=bossMove(e);
  if(e.wideCd===undefined)e.wideCd=bossRange(1.1,4.0);
  if(e.dragonCd===undefined)e.dragonCd=bossRange(1.1,4.0);
  e.wideCd-=dt;e.dragonCd-=dt;
  if(e.action){
    const a=e.action;if(a.kind==='wide'&&a.targetZ===undefined)a.targetZ=e.z-13/2;a.age+=dt;e.tell=a.kind==='normal'?0:Math.max(0,a.impact-a.age);
    if(!a.done&&a.age>=a.impact){
      a.done=true;
      if(a.kind==='dragon'){
        const z=e.z-FRONT_GAP,l=a.l;
        S.fx.push({kind:'bossGround',l,z,t:0,life:.325});
        S.shots.push({kind:'bossEarth',l,z,originZ:z,d:10,t:'boss',age:0,trail:0});
        S.shake=.16;sound('continentSwing');
      }
      else if(a.kind==='wide'){
        sound('continentSwing');for(let lane=0;lane<3;lane++)burst(lane,a.targetZ,'#ffae43',8);
        resolveBossWideHit(a);
      }else if(a.kind==='sword'){sound('continentSwing');if(S.l===a.l&&distance(e)>=0&&distance(e)<=BOSS_SLASH_DEPTH)hurt(3);}
    }
    if(a.kind==='wide'&&a.done&&a.age<=a.impact+.38)resolveBossWideHit(a);
    if(a.age>=a.duration){e.recover={kind:a.kind,age:0};e.action=null;e.tell=0;e.cd=.48;}
    return;
  }
  if(e.wideCd<=0&&(e.dragonCd>0||e.wideCd<e.dragonCd)){
    resetBossSkillTimers(e);e.action={kind:'wide',l:1,targetZ:e.z-13/2,age:0,impact:.38,duration:.76,done:false};e.tell=.38;e.attackCount++;return;
  }
  if(e.dragonCd<=0){
    resetBossSkillTimers(e);e.action={kind:'dragon',l:S.l,age:0,impact:.19,duration:.38,done:false};e.tell=.19;e.attackCount++;return;
  }
  // Contact alone never hurts the player; only skill impacts deal damage.
  e.tell=0;
}
// Full supplied poses: fixed movement sprites and contact-synchronised attacks.
function bossPose(e){
 const a=e.action;
 if(a)return a.kind==='dragon'?(a.age<a.impact?6:7):(a.age<a.impact?4:8);
 return e.moveActive?(e.movePose||1):1;
}
function drawBossSprite(e,h){
 const pose=bossPose(e),img=pose===1?im.boss:im['bossB'+pose];
 if(!img?.complete||!img.naturalWidth)return;
 // Register feet and torso, rather than scaling the raised axe as body height.
 const anchors=[[.60,.96,1],[.60,.96,1],[.60,.96,1],[.59,.89,1.06],[.60,.91,1],[.49,.96,1.28],[.59,.87,1],[.44,.96,1]];
 const [ax,ay,scale]=anchors[pose-1],w=h*scale;
 c.drawImage(img,-w*ax,-w*ay,w,w);
}
function heroHitRect(){const h=playerHeight();return {x:playerX()-h*.18,y:playerY()-h*.80,w:h*.36,h:h*.72};}
function overlaps(a,b){return a.x<=b.x+b.w&&a.x+a.w>=b.x&&a.y<=b.y+b.h&&a.y+a.h>=b.y;}
function bossWideRect(a){
 const z=a.targetZ-S.z,p=perspective(z),y=yy(z)-Math.min(H*.34,290)*p*.45,w=(lx(2.5,z)-lx(-.5,z))*1.08,h=w*292/1536;
 return {x:W/2-w/2,y:y-h/2,w,h};
}
function resolveBossWideHit(a){
 if(a.hitPlayer)return;
 if(Math.abs(S.z+S.pd-a.targetZ)<=13/2){a.hitPlayer=true;hurt(3);}
}
function drawBossWideSlash(){
 const e=S.en.find(e=>e.boss&&!e.dead),a=e?.action;
 if(!a||a.kind!=='wide'||!a.done||S.cinematic)return;
 const age=a.age-a.impact;if(age<0||age>.38)return;
 const img=im.bossSweep;if(!img?.complete||!img.naturalWidth)return;
 const r=bossWideRect(a),rect=crop(img);
 c.save();c.globalAlpha=C((.38-age)/.12,0,1);
 c.drawImage(img,...rect,r.x,r.y,r.w,r.h);c.restore();
}
function earthPattern(age){return Math.min(3,Math.floor(Math.max(0,age)/.18))+1;}
function drawBossGround(f){
 const img=im.bossImpact;if(!img?.complete||!img.naturalWidth)return;
 const z=f.z-S.z,w=Math.min(W,520)*.42*perspective(z),h=w;
 c.save();c.globalAlpha*=C((f.life-f.t)/.11,0,1);
 c.drawImage(img,lx(f.l,z)-w*.5,yy(z)-h*.64,w,h);c.restore();
}
function bossEarthRect(shot){
 const z=shot.z-S.z,h=bossHeight(z),w=h*.88;
 // Extend the foreground projection past its near-depth clamp so the whole
 // sprite slides below the viewport, instead of vanishing at the player.
 const exitOffset=Math.max(0,-1-z)*H*.3;
 return {x:lx(shot.l,z)-w*.5,y:yy(z)-h+exitOffset,w,h};
}
function drawBossEarth(shot){
 const img=im['bossEarth'+earthPattern(shot.age)];if(!img?.complete||!img.naturalWidth)return;
 const r=bossEarthRect(shot);c.drawImage(img,r.x,r.y,r.w,r.h);
}
function updateBossEarth(p,dt){
 const before=distance(p);p.z-=20*dt;p.age+=dt;
 p.trail+=20*dt;
 while(p.trail>=1.2){p.trail-=1.2;const z=p.z+p.trail;if(z-S.z>=-1)S.fx.push({kind:'bossGround',l:p.l,z,t:0,life:.25});}
 // Resolve damage once, independently of visual lifetime.
 if(!p.passedPlayer&&before>=-.35&&distance(p)<=.35){p.passedPlayer=true;if(p.l===S.l)hurt(p.d);}
 if(distance(p)<-.35)p.passedPlayer=true;
 // Keep all three supplied frames cycling at full opacity until fully offscreen.
 if(bossEarthRect(p).y>H)p.dead=1;
}
function beginDefeat(){
  if(S.defeat)return;
  S.hp=0;S.run=0;S.defeat={t:0,landed:false,finished:false};S.ptr=null;S.guard=0;S.guardPose=0;S.skill=null;S.normalAttack=null;S.ultimate=null;S.dash=null;S.boost=0;S.speed=0;S.cinematic=null;S.waterFx=[];S.earthFx=[];S.waves=[];S.shots=[];hideNotice();$('#gameViewport').classList.remove('cinematic');ui();
}
function step(dt){
  if(S.pause)return;
  if(S.defeat&&!S.defeat.finished){
    S.defeat.t+=dt;S.hit=Math.max(0,S.hit-dt);S.shake=Math.max(0,S.shake-dt);
    if(!S.defeat.landed&&S.defeat.t>=.78){S.defeat.landed=true;sound('heroFall');S.shake=.10;}
    if(S.defeat.t>=2.8){S.defeat.finished=true;end(0);}return;
  }
  if(!S.run)return;
  if(S.cinematic){stepCinematic(dt);ui();return;}
  if(ultimateCutinActive()){const frozen=Math.min(dt,ULTIMATE.cutin-S.ultimate.t);S.ultimate.t+=frozen;dt-=frozen;if(dt<=1e-9){ui();return;}}
  S.guardImpact=Math.max(0,S.guardImpact-dt);
  S.guardPose=C(S.guardPose+(S.guard?dt/.20:-dt/.16),0,1);
  const previousZ=S.z+S.pd;S.t+=dt;if(S.introRun&&S.t>=2){S.en=roster();const offset=S.z+S.pd+24;for(const e of S.en)e.z+=offset;S.introRun=0;}S.ll+=(S.l-S.ll)*(1-Math.exp(-18*dt));
  S.normalFlash=Math.max(0,(S.normalFlash||0)-dt);S.shake=Math.max(0,S.shake-dt);S.comboTime=Math.max(0,S.comboTime-dt);if(!S.comboTime)S.combo=0;
  for(const f of S.fx)f.t+=dt;S.fx=S.fx.filter(f=>f.t<f.life);
  for(const e of S.en)if(e.dead)e.fade=Math.max(0,(e.fade||0)-dt);
  for(const f of S.waterFx)f.age+=dt;S.waterFx=S.waterFx.filter(f=>f.age<.60);
  for(const f of S.earthFx)f.age+=dt;S.earthFx=S.earthFx.filter(f=>f.age<.95);
  const skillPriorityThisFrame=!!(S.skill||S.ultimate||S.waves.length);
  updateUltimate(dt);updateWaves(dt);S.hit=Math.max(0,S.hit-dt);
  if(S.notice){S.notice.left-=dt;if(S.notice.left<=0)hideNotice()}
  for(let i=0;i<2;i++)if(S.ch[i]<4){S.fr[i]+=dt/5;if(S.fr[i]>=1){S.fr[i]--;S.ch[i]++}}
  if(!S.guard&&!S.ultimate){
    let runningTime=dt;
    if(S.dash){
      const dash=S.dash,requested=Math.min(SUPERDASH_SPEED*dt,dash.n),v=adv(requested);
      dash.n=Math.max(0,dash.n-v);
      if(v>.0001&&!dash.rewarded){dash.rewarded=true;for(let i=0;i<2;i++){S.ch[i]=Math.min(4,S.ch[i]+1);if(S.ch[i]===4)S.fr[i]=0}}
      if(dash.n<=1e-9||v+1e-9<requested||!Number.isFinite(front())||front()-S.z-S.pd<=FRONT_GAP+.025){
        S.dash=null;runningTime=Math.max(0,dt-requested/SUPERDASH_SPEED);
      }else runningTime=0;
    }
    if(runningTime>0)runForward(runningTime);
  }else{
    S.boost*=Math.exp(-dt/SWIPE_DECAY);if(S.boost<.001)S.boost=0;
  }
  const travelled=S.z+S.pd-previousZ;S.speed=dt>0?travelled/dt:0;S.runPhase+=Math.max(0,travelled)*RUN_PHASE_PER_UNIT;
  // Update the moving front before resolving any attacks against player depth.
  for(const e of S.en){
    if(e.dead)continue;e.fl=Math.max(0,e.fl-dt);
    if(e.boss){updateBoss(e,dt);if(!S.run){ui();return;}continue;}
    const stageDistance=e.z-S.z;if(stageDistance>42||stageDistance<-2)continue;
    e.mv-=dt;
    if(e.mv<=0&&e.tell<=0){
      if((e.group===undefined||distance(e)<7)&&random()<.6)e.l=C(e.l+(random()<.5?-1:1),0,2);
      e.dz=(e.dz||0)+R(-.3,.12);e.mv=R(.7,2);
    }
    const shift=C(e.dz||0,-2*dt,2*dt);e.dz=(e.dz||0)-shift;
    e.z=Math.max(S.z+FRONT_GAP,e.z+shift-.1*dt);
  }
  updateDepth(dt);
  if(S.skill){
    const a=S.skill;a.t+=dt;
    // Spin resolves when the 16-pose animation enters its final pose.
    const times=a.k===1?[.18,.38,.58,.78]:[a.d*15/16];
    while(a.emitted<times.length&&a.t>=times[a.emitted]){
      const index=a.emitted++,direction=a.k===2?'front':['front','right','left','front'][index];
      const range=a.k===2?30:direction==='front'?13:9;
      sound(a.k===1?'waterSwing':'continentSwing');
      if(a.k===2){
        const origin=S.z+S.pd;
        for(const e of S.en){
          const d=e.z-origin;
          if(!e.dead&&e.l===S.l&&d>=0&&d<=range)hit(e,bDamage('spin',d),1);
        }
      }else S.waves.push({k:a.k,l:a.l,direction,range,z:S.z+S.pd,origin:S.z+S.pd,travel:0,seen:new Set(),hitCounts:a.hitCounts});
    }
    a.done=a.emitted===times.length;
    if(a.t>=a.d)S.skill=null;
  }
  const atFront=S.en.some(e=>!e.dead&&distance(e)<=(e.boss?5:1.05)&&distance(e)>=-.1);
  S.norm=Math.max(0,S.norm-dt);
  const normalBlocked=skillPriorityThisFrame||!!S.skill||!!S.ultimate||S.waves.length>0||!!S.guard;
  if(normalBlocked){S.normalAttack=null;S.normalFlash=0;}
  if(atFront&&!normalBlocked&&!S.normalAttack&&S.norm<=1e-9){
    S.normalAttack={k:2,t:0,d:.5,done:0};S.norm=1;
  }
  if(S.normalAttack){
    const a=S.normalAttack;a.t+=dt;
    if(!a.done&&a.t>=a.d*.48){
      a.done=1;const e=S.en.find(e=>!e.dead&&e.l===S.l&&distance(e)>=-.1&&distance(e)<=(e.boss?5:1.05));
      if(e){S.normalFlash=.18;hit(e,1,0)}
    }
    if(a.t>=a.d)S.normalAttack=null;
  }
  for(const e of S.en){
    if(e.dead||e.boss)continue;
    const stageDistance=e.z-S.z;if(stageDistance>42||stageDistance<-2)continue;
    if(e.tell>0){
      e.tell-=dt;
      if(e.tell<=0){
        if(D[e.t].r){S.shots.push({l:e.l,z:e.z,d:D[e.t].d,t:e.t});sound('shot',e.t)}
        else if(distance(e)<=1.25&&distance(e)>=0&&e.l===S.l)hurt(D[e.t].d);
        e.cd=R(1.8,3.8);if(!S.run){ui();return}
      }
    }else{e.cd-=dt;if(e.cd<=0)e.tell=e.t==='bonobo'?1.15:e.t==='dragon'?1.1:e.t==='mage'?1:.85}
  }
  for(const p of S.shots){
    if(p.kind==='bossEarth'){updateBossEarth(p,dt);if(!S.run){ui();return}continue;}
    const before=distance(p);p.z-=(p.kind==='fireDragon'?10:18)*dt;p.age=(p.age||0)+dt;
    if(distance(p)<=.35){if(before>=-.35&&p.l===S.l)hurt(p.d);p.dead=1;}
    if(!S.run){ui();return}
  }
  S.shots=S.shots.filter(p=>!p.dead);
  if(!S.ultimate&&!S.introRun&&!S.en.some(e=>!e.dead)){if(S.phase==='road')startBoss();else startVictory();}
  ui();
}

// Shared projective ground coordinates: hero, enemies, projectiles and effects.
function perspective(z){return 1/(1+Math.max(-1,z)*.115)}
function lx(l,z){return W/2+(l-1)*Math.min(W,520)*.27*perspective(z)}
function yy(z){return H*HORIZON+H*GROUND_SPAN*perspective(z)}
function playerY(){return yy(S.pd)}
function playerX(){return lx(S.ll,S.pd)}
function playerHeight(){return Math.min(H*.34,290)*perspective(S.pd)}
function bossHeight(z){return D.boss.h*perspective(z)*Math.min(1,H/844)*.77*1.85;}
function burst(l,z,color,count){for(let i=0;i<count;i++)S.fx.push({kind:'spark',l,z,color,t:0,life:.35+Math.random()*.25,vx:(Math.random()-.5)*180,vy:-30-Math.random()*140})}
function bDamage(kind,d){return kind==='ultimate'?(d>=15?15:d>=13?10:d>=9?8:5):(d>=15?5:d>=9?3:1)}
function bLaneMatches(direction,l,target){return direction==='right'?target>l:direction==='left'?target<l:target===l}
function updateWaves(dt){
  for(const w of S.waves){
    const previous=w.z;w.travel=Math.min(w.range,w.travel+(w.k===1?50:36)*dt);w.z=w.origin+w.travel;
    for(const e of S.en){
      const d=e.z-w.origin;
      if(e.dead||w.seen.has(e)||d<0||d>w.range||e.z<previous||e.z>w.z||!bLaneMatches(w.direction,w.l,e.l))continue;
      if(w.k===1&&(w.hitCounts.get(e)||0)>=2)continue;
      w.seen.add(e);w.hitCounts.set(e,(w.hitCounts.get(e)||0)+1);
      hit(e,w.k===1?2:bDamage('spin',d),1);
    }
  }
  S.waves=S.waves.filter(w=>w.travel<w.range);
}
// Reference 7.05–7.65 s: left ignition, horizontal wrapping water ribbon,
// rear water sheet, then broken residual droplets. One effect, two depth passes.
function waterState(t){
  return {spread:C(t/.06,0,1),alpha:t<.10?C(t/.025,0,1):C((.53-t)/.30,0,1),
    lift:C((t-.04)/.10,0,1)*C((.48-t)/.22,0,1),
    residue:C((t-.27)/.09,0,1)*C((.60-t)/.20,0,1)};
}
function drawWaterEffect(frontPass){}

function drawDashTrail(){
  const img=im.dashTrail;if(!S.dash||S.guard||!img.complete||!img.naturalWidth)return;
  const i=Math.floor(S.t*18)%4,cw=img.naturalWidth/2,ch=img.naturalHeight/2,h=playerHeight(),w=h*1.35,dh=h*1.3;
  c.save();c.globalAlpha=.7;c.drawImage(img,i%2*cw,Math.floor(i/2)*ch,cw,ch,playerX()-w/2,playerY()-h*.38,w,dh);c.restore();
}
function drawGuardImpact(){
  const img=im.guardImpact;if((!S.guard&&S.guardImpact<=0)||!img.complete||!img.naturalWidth)return;
  const h=playerHeight(),height=h*.78,w=height*img.naturalWidth/img.naturalHeight;
  c.save();c.globalAlpha=S.guard?.72+.20*Math.min(1,S.guardImpact/.12):.92*Math.min(1,S.guardImpact/.12);
  c.drawImage(img,lx(S.l,S.pd)-w/2,playerY()-h*1.34,w,height);c.restore();
}
// Reference earth slash: downward curved blade -> ground eruption -> rocks -> fading core.
function earthState(t){
  return {blast:C((t-.07)/.10,0,1)*C((.55-t)/.27,0,1),
    core:C((t-.07)/.06,0,1)*C((.79-t)/.34,0,1),
    debris:C((t-.12)/.06,0,1)*C((.95-t)/.28,0,1)};
}
const EARTH_ANCHORS=[[214,475],[195,475],[187,475],[193,475],[193,451],[202,451],[193,451],[194,451]];
function earthSheetReady(){return im.earthSheet.complete&&im.earthSheet.naturalWidth===1536}
function earthSprite(frame,h,alpha=1){
  const i=C(frame,0,7),a=EARTH_ANCHORS[i],scale=h/475;
  c.save();c.globalAlpha*=alpha;
  c.drawImage(im.earthSheet,(i%4)*384,Math.floor(i/4)*512,384,512,-a[0]*scale,-a[1]*scale,384*scale,512*scale);c.restore();
}
function earthFrame(t){
  const beats=[0,.08,.20,.34,.52,.70];
  let i=0;for(let n=1;n<beats.length;n++)if(t>=beats[n])i=n;
  const next=beats[i+1]??.95;
  return{frame:i+2,blend:C((t-(next-.055))/.055,0,1)};
}
function drawEarthEffect(){
  for(const f of S.earthFx){
    const t=f.age,q=earthState(t),z=f.z+t*12-S.z,p=perspective(z);
    const h=Math.min(H*.34,290)*p,x=lx(f.l,z),y=yy(z);
    c.save();c.translate(x,y);
    if(earthSheetReady()){
      const anim=earthFrame(t),fade=C((.95-t)/.18,0,1);
      earthSprite(anim.frame,h*1.95,fade*(1-anim.blend));
      if(anim.frame<7)earthSprite(anim.frame+1,h*1.95,fade*anim.blend);
      c.restore();continue;
    }
    if(q.blast>0){
      // A fan of uneven white-blue shards erupts from one ground contact.
      const fill=c.createLinearGradient(0,0,0,-h*1.5);
      fill.addColorStop(0,'#f6ffff');fill.addColorStop(.30,'#b2ffff');
      fill.addColorStop(.73,'#62c9ffbb');fill.addColorStop(1,'#54baff00');
      c.fillStyle=fill;c.globalAlpha=q.blast;c.shadowColor='#68dfff';c.shadowBlur=13;
      for(let i=0;i<15;i++){
        const side=i%2?1:-1,n=(i+1)/15;
        const tipX=side*h*(.12+n*.66)*(.7+q.blast*.3);
        const tipY=-h*(.52+((i*7)%13)/13*.95)*(.5+q.blast*.5);
        const rootX=side*h*.07;
        c.beginPath();c.moveTo(rootX,0);
        c.lineTo(tipX*.55-h*.035,tipY*.53);c.lineTo(tipX,tipY);
        c.lineTo(tipX*.60+h*.025,tipY*.40);c.lineTo(rootX+h*.06,0);c.fill();
        c.save();c.fillStyle='#e9ffff';c.beginPath();c.moveTo(rootX,0);c.lineTo(tipX*.94,tipY*.94);c.lineTo(rootX+h*.025,-h*.10);c.closePath();c.fill();c.restore();
      }
      c.shadowBlur=0;
      c.strokeStyle='#b1faff';c.lineWidth=2*p;
      for(let i=0;i<5;i++){const side=i%2?1:-1;c.beginPath();c.moveTo(0,0);c.lineTo(side*h*(.16+i*.045),h*.03);c.lineTo(side*h*(.24+i*.06),h*.07);c.stroke()}
    }
    if(q.core>0){
      c.globalAlpha=q.core;c.shadowColor='#85eaff';c.shadowBlur=14;
      const width=h*(.012+.085*q.blast);
      const glow=c.createLinearGradient(-width*2,0,width*2,0);
      glow.addColorStop(0,'#6dcfff00');glow.addColorStop(.45,'#e7ffff');glow.addColorStop(.5,'#ffffff');glow.addColorStop(.55,'#e7ffff');glow.addColorStop(1,'#6dcfff00');
      c.fillStyle=glow;c.beginPath();c.moveTo(-width,0);c.lineTo(-width*.4,-h*1.7);c.lineTo(width*.4,-h*1.7);c.lineTo(width,0);c.fill();
      c.shadowBlur=0;
    }
    if(q.debris>0){
      // Deterministic ballistic rock motion, independent of the combat RNG.
      const u=Math.max(0,t-.12);c.globalAlpha=q.debris;
      for(let i=0;i<7;i++){
        const side=i%2?1:-1,rx=side*h*(.10+u*(.45+(i%3)*.28));
        const ry=h*(-u*(2.2+(i%3)*.55)+u*u*2.6)-h*.04;
        const r=h*(.045+(i%3)*.018);
        c.save();c.translate(rx,ry);c.rotate(side*u*(1.5+i*.23));
        c.fillStyle=['#3a3a35','#4c4b41','#282d2d'][i%3];c.strokeStyle='#7a7b6e';c.lineWidth=1;
        c.beginPath();c.moveTo(-r,-r*.45);c.lineTo(-r*.25,-r);c.lineTo(r*.75,-r*.66);c.lineTo(r,r*.24);c.lineTo(r*.24,r);c.lineTo(-r*.75,r*.61);c.closePath();c.fill();c.stroke();
        c.fillStyle='#777668';c.beginPath();c.moveTo(-r,-r*.45);c.lineTo(-r*.25,-r);c.lineTo(r*.75,-r*.66);c.lineTo(0,-r*.18);c.closePath();c.fill();c.restore();
      }
    }
    c.restore();
  }
}
// GPT Image atlases: 4 x 2, frame size 384 x 512. Fractional frames crossfade.
// Cache the ultimate's purple rendering palette once; preserve the original
// sprite geometry, per-pixel luminosity, alpha, and animation frame layout.
let ultimatePurplePalette=null;
function purpleUltimateSheet(sheet){
 if(ultimatePurplePalette)return ultimatePurplePalette;
 const palette=document.createElement('canvas');palette.width=sheet.naturalWidth;palette.height=sheet.naturalHeight;
 const ctx=palette.getContext('2d');ctx.drawImage(sheet,0,0);
 ctx.globalCompositeOperation='hue';ctx.fillStyle='#a040ff';ctx.fillRect(0,0,palette.width,palette.height);
 ctx.globalCompositeOperation='destination-in';ctx.drawImage(sheet,0,0);
 ultimatePurplePalette=palette;return palette;
}
function paintVfx(sheet,frame,x,y,w,h,alpha=1,angle=0){
 if(!sheet?.complete||!sheet.naturalWidth||alpha<=0)return;
 if(sheet===im.vfxUltimate)sheet=purpleUltimateSheet(sheet);
 const f=C(frame,0,7),i=Math.floor(f),mix=f-i;
 // Light atlases contain opaque black separators; screen makes black neutral.
 c.save();c.translate(x,y);c.rotate(angle);c.globalCompositeOperation='screen';
 for(const [n,a] of [[i,1-mix],[Math.min(7,i+1),mix]]){if(!a)continue;c.globalAlpha=alpha*a;c.drawImage(sheet,(n%4)*384,Math.floor(n/4)*512,384,512,-w/2,-h/2,w,h);}c.restore();
}
function referenceFrame(t,keys){
 for(let i=0;i<keys.length-1;i++)if(t<keys[i+1][0]){const a=keys[i],b=keys[i+1];return a[1]+(b[1]-a[1])*C((t-a[0])/(b[0]-a[0]),0,1);}return keys.at(-1)[1];
}
function drawSkillVfx(front){
 if(!front)return;const a=S.skill;if(!a)return;const h=playerHeight(),x=playerX(),y=playerY();
 if(a.k===2){
  const frame=referenceFrame(a.t,[[0,0],[.1,1],[.3,2],[.4,3],[.5,4],[.64,5],[.82,6],[1.05,7]]);
  paintVfx(im.vfxSpin,frame,x,y-h*.55,h*2.1,h*2.8,Math.min(1,a.t/.035)*(1-C((a.t-.95)/.1,0,1)));return;
 }
 if(a.t<.18){paintVfx(im.vfxThrust,C(a.t/.18,0,1),x,y-h*.58,h*1.75,h*2.33,Math.min(1,a.t/.025)*(1-C((a.t-.13)/.05,0,1)));}
 const times=[.18,.38,.58,.78];for(let i=0;i<4;i++){
  const age=a.t-times[i];if(age<0||age>.17)continue;
  const side=i===1?1:i===2?-1:0;
  paintVfx(im.vfxThrust,i+2,x+side*h*.23,y-h*.8,h*1.1,h*1.47,1-age/.17);
 }
}
function drawWaves(){
 for(const w of S.waves){const z=w.z-S.z,p=perspective(z),q=C(w.travel/w.range,0,1);
  const lanes=[0,1,2].filter(l=>bLaneMatches(w.direction,w.l,l));
  if(w.k===1){const frame=w.direction==='right'?3:w.direction==='left'?4:2;
   for(const l of lanes)paintVfx(im.vfxThrust,frame,lx(l,z),yy(z)-65*p,80*p,180*p,(1-q)*.8);
  }
  // Spin's source shows a stationary strike and spreading white residual trail.
  else paintVfx(im.vfxSpin,6+q,lx(w.l,z),yy(z)-65*p,200*p,235*p,(1-q)*.6);
 }
}
function drawBattleBanner(){
  const elapsed=S.phase==='boss'?S.t-S.bossStartedAt:S.t;
  if(!S.run||S.cinematic||S.phase==='boss'||elapsed>=1.6)return;
  const t=elapsed,enter=C(t/.22,0,1),leave=C((t-1.15)/.45,0,1),x=W*(1-enter)-W*leave;
  c.save();c.globalAlpha=Math.min(1,enter*2)*(1-leave);c.translate(x,H*.32);
  const g=c.createLinearGradient(0,0,W,0);g.addColorStop(0,'#122b2900');g.addColorStop(.2,'#122b29ee');g.addColorStop(.8,'#122b29ee');g.addColorStop(1,'#122b2900');c.fillStyle=g;c.fillRect(0,-32,W,64);
  c.fillStyle='#d9c795';c.fillRect(W*.12,-32,W*.76,1);c.fillRect(W*.12,31,W*.76,1);
  c.textAlign='center';c.textBaseline='middle';c.font='bold 28px serif';c.fillStyle='#fff5d9';c.fillText(S.phase==='boss'?'ボス出現':'戦闘開始',W/2,0);c.restore();
}
function drawEffects(){for(const f of S.fx){if(f.kind==='bossGround')continue;
  const p=perspective(f.z-S.z),x=lx(f.l,f.z-S.z),y=yy(f.z-S.z),q=f.t/f.life;
  c.save();c.globalAlpha=1-q;c.fillStyle=f.color;
  if(f.kind==='spearImpact'){if(!f.gold)paintVfx(im.vfxThrust,2,x,y-70*p,90*p,120*p,1-q);}
  else if(f.kind==='impact'){c.strokeStyle=f.color;c.lineWidth=3*(1-q);c.beginPath();c.ellipse(x,y,(12+72*q)*p,(3+16*q)*p,0,0,Math.PI*2);c.stroke();for(let i=0;i<7;i++){let a=i*Math.PI*2/7;c.beginPath();c.moveTo(x+Math.cos(a)*12*p,y+Math.sin(a)*4*p);c.lineTo(x+Math.cos(a)*65*q*p,y+Math.sin(a)*18*q*p-25*Math.sin(q*Math.PI)*p);c.stroke()}}
  else if(f.kind==='number'){c.font='italic 900 '+Math.round(22+8*p)+'px sans-serif';c.textAlign='center';c.lineWidth=3;c.strokeStyle='#242116';c.strokeText(f.n,x,y-120*p-45*q);c.fillText(f.n,x,y-120*p-45*q)}
  else{c.translate(x+f.vx*f.t*p,y-65*p+f.vy*f.t*p+90*f.t*f.t);c.rotate(q*5);c.fillRect(-2,-2,4*p+1,4*p+1)}c.restore();
}
if(S.combo>1){c.save();c.textAlign='right';c.font='italic 900 23px sans-serif';c.fillStyle='#ffe39a';c.shadowColor='#000';c.shadowBlur=5;c.fillText(S.combo+' HIT',W-16,H*.25);c.restore()}}
const bounds=new WeakMap();
function crop(image){
  if(bounds.has(image))return bounds.get(image);
  const a=document.createElement('canvas');a.width=image.naturalWidth;a.height=image.naturalHeight;const x=a.getContext('2d');x.drawImage(image,0,0);const data=x.getImageData(0,0,a.width,a.height).data;
  let l=a.width,t=a.height,r=0,b=0;for(let y=0;y<a.height;y++)for(let k=0;k<a.width;k++)if(data[(y*a.width+k)*4+3]>20){l=Math.min(l,k);r=Math.max(r,k);t=Math.min(t,y);b=Math.max(b,y)}
  const rect=r>=l?[l,t,r-l+1,b-t+1]:[0,0,a.width,a.height];bounds.set(image,rect);return rect;
}

// One vanishing point, shared with the enemy ground horizon. Cache the painted
// scenery at device resolution so foliage does not add work to each game frame.
function groundZ(y){return (GROUND_SPAN/(y-HORIZON)-1)/.115}
function groundPhase(y,z){const u=((groundZ(y)+z)/8%2+2)%2;return u<=1?u:2-u}
function drawGround(image){
  // Sample the painting's dirt area in mirrored world-space strips. Mirroring
  // makes every repeat continuous; near strips cross the screen faster.
  const iw=image.naturalWidth,ih=image.naturalHeight;
  c.save();
  for(let y=Math.ceil(H*.34);y<H;y+=3){
    const ratio=y/H,p=(ratio-HORIZON)/GROUND_SPAN;
    const roadWidth=W*1.55*p;
    const u=groundPhase(ratio,S.z);
    const sy=ih*(.76+.22*u);
    c.globalAlpha=C((ratio-.34)/.18,0,1);
    c.drawImage(image,iw*.20,sy,iw*.60,Math.max(1,ih*.002),W/2-roadWidth/2,y,roadWidth,3.5);
  }
  c.restore();
}
function sceneryDepth(worldZ){return worldZ-S.z}
function drawMovingForest(){
  const ground=im.forestGround,trees=im.forestTrees;
  const sky=c.createLinearGradient(0,0,0,H*.45);sky.addColorStop(0,'#3d465d');sky.addColorStop(.6,'#b5b4a8');sky.addColorStop(1,'#747165');c.fillStyle=sky;c.fillRect(0,0,W,H);
  for(let y=Math.ceil(H*HORIZON)+1;y<H;y+=1){
    const p=(y/H-HORIZON)/GROUND_SPAN,z=groundZ(y/H)+S.z;
    const phase=((z/18)%2+2)%2,u=phase<=1?phase:2-phase;
    const sh=Math.min(ground.naturalHeight,Math.max(1,Math.abs(groundZ((y+1)/H)-groundZ(y/H))/18*ground.naturalHeight));
    const sy=Math.min(ground.naturalHeight-sh,u*(ground.naturalHeight-sh)),width=W*3.5*p,left=(W-width)/2;
    c.drawImage(ground,0,sy,ground.naturalWidth,sh,left,y,width,1.1);
    if(left>0){c.drawImage(ground,0,sy,ground.naturalWidth*.15,sh,0,y,left+1,1.1);c.drawImage(ground,ground.naturalWidth*.85,sy,ground.naturalWidth*.15,sh,W-left-1,y,left+1,1.1)}
  }
  const cw=trees.naturalWidth/4,ch=trees.naturalHeight,items=[];
  const first=Math.floor((S.z-2)/8);
  for(let row=first;row<first+16;row++)for(const side of [-1,1])for(let band=0;band<2;band++){
    const seed=((row*13+band*7+(side+1)*3)%17+17)%17;
    const z=sceneryDepth(row*8+band*3+(side===1?2:0));if(z< -1||z>112)continue;
    items.push({z,side,band,seed});
  }
  items.sort((a,b)=>b.z-a.z);
  for(const o of items){
    const p=perspective(o.z),height=H*(1.35+o.seed*.018)*p,width=height*cw/ch;
    const x=W/2+o.side*W*(.96+o.band*.72+(o.seed%3)*.045)*p,y=yy(o.z);
    c.save();c.globalAlpha=C((112-o.z)/24,0,1);
    c.drawImage(trees,(o.seed%4)*cw,0,cw,ch,x-width/2,y-height*.95,width,height);c.restore();
  }
}
function bg(){
  if(im.forestTrees.complete&&im.forestTrees.naturalWidth&&im.forestGround.complete&&im.forestGround.naturalWidth){drawMovingForest();const fog=c.createRadialGradient(W/2,H*HORIZON,0,W/2,H*HORIZON,W*.25);fog.addColorStop(0,"#c4c0b2ee");fog.addColorStop(.3,"#c4c0b288");fog.addColorStop(1,"#c4c0b200");c.fillStyle=fog;c.fillRect(0,0,W,H);return;}
  c.fillStyle='#0b1020';c.fillRect(0,0,W,H);

}

function frontline(){let fl=front();if(!Number.isFinite(fl)||fl-S.z>42)return;let r=fl-S.z,y=yy(r),p=perspective(r),half=Math.min(W,520)*.44*p;c.save();c.strokeStyle='rgba(255,225,125,.95)';c.shadowColor='rgba(255,170,50,.9)';c.shadowBlur=4;c.lineWidth=1.5;c.beginPath();c.moveTo(W/2-half,y);c.lineTo(W/2+half,y);c.stroke();c.restore()}
function poseFrame(k,p){
  const beats=k===1?[0,.13,.27,.39,.48,.59,.73,.88]:[0,.13,.28,.43,.54,.64,.77,.90];
  let frame=0;for(let i=1;i<beats.length;i++)if(p>=beats[i])frame=i;
  return (k===2?8:0)+frame;
}
// GPT Image sheets preserve the supplied knight's costume and rear view.
const ARMORED_ANCHORS=[[157, 310], [163, 310], [172, 310], [156, 311], [151, 309], [146, 310], [154, 311], [158, 310], [158, 310], [152, 311], [164, 310], [152, 311], [154, 304], [182, 305], [152, 305], [158, 310]];
// Hilt and tip registration in each 313.5px skill frame. Occluded blades stay occluded.
const HERO_BLADE_POSES=[[200,94,249,20],[229,99,266,25],null,[183,63,78,12],[119,101,29,60],[94,108,0,89],[237,160,297,196],[204,86,251,23],[202,91,252,20],[204,76,162,20],null,[145,43,96,120],[204,186,262,237],[233,205,289,271],[214,83,266,28],[211,84,255,18]];
function drawHeldBlade(p,scale,anchor){
 const img=im.heroBlade;if(!p||!img.complete||!img.naturalWidth)return;
 const [bx,by,tx,ty]=p,dx=tx-bx,dy=ty-by,len=Math.hypot(dx,dy)*1.12*scale,width=Math.max(8,Math.hypot(dx,dy)*.095)*1.3*scale;
 c.save();c.translate((bx-anchor[0])*scale,(by-anchor[1])*scale);c.rotate(Math.atan2(dy,dx)+Math.PI/2);
 c.beginPath();c.moveTo(0,-len);c.lineTo(width*.43,-len*.83);c.lineTo(width/2,0);c.lineTo(-width/2,0);c.lineTo(-width*.43,-len*.83);c.closePath();c.clip();
 c.drawImage(img,460,22,104,1487,-width/2,-len,width,len);c.restore();
}

function armoredReady(){return ['heroSkills','heroRun','bSpin','bUltimate'].every(k=>im[k].complete&&im[k].naturalWidth>0)}
// Each painted pose is selected intact; rear-view ready stance comes from May rain.
const B_ROWS=[0,342,638,930,1254],B_SPIN_ROWS=[0,330,650,936,1254];
function bFrame(sheet,index,h,kind){
 const cw=420,ch=520,scale=h/(kind==='run'?425:kind==='ultimate'?400:290);
 c.drawImage(sheet,(index%4)*cw,Math.floor(index/4)*ch,cw,ch,-210*scale,-500*scale,cw*scale,ch*scale);
}
function bPose(sheet,frame,h,kind){
 const i=Math.floor(frame),mix=C((frame-i-.65)/.35,0,1);c.save();c.globalAlpha=1-mix;bFrame(sheet,i,h,kind);if(mix){c.globalAlpha=mix;bFrame(sheet,Math.min(kind==='ultimate'?7:15,i+1),h,kind);}c.restore();
}
function drawArmoredHero(h){
 if(S.ultimate){
   const p=C((S.ultimate.t-ULTIMATE.cutin)/(ULTIMATE.duration-ULTIMATE.cutin),0,.999);
   const age=S.ultimate.t-ULTIMATE.windup;
   if(age>=-.07&&age<.46){const q=C((age+.07)/.15,0,1);c.save();c.translate(0,-Math.sin(Math.PI*C(age/.46,0,1))*h*.04);bPose(im.heroSkills,12+3*q,h,'samidare');c.restore();}
   else bPose(im.bUltimate,Math.min(7,p*8),h,'ultimate');return;
 }
 if(S.guard||S.guardPose>0){
   c.save();c.rotate(-.035);bFrame(im.heroSkills,0,h,'samidare');c.restore();return;
 }
 if(S.skill){
   const a=S.skill,p=C(a.t/a.d,0,.999);
   let frame=Math.min(15,p*16);
   if(a.k===1){const t=a.t;frame=t<.28?Math.min(3,t/.07):t<.48?4+Math.min(3,(t-.28)/.05):t<.68?8+Math.min(3,(t-.48)/.05):12+Math.min(3,(t-.68)/.05);}
   c.save();const lift=a.k===2?Math.sin(Math.PI*C((a.t-.1*(a.d/1.05))/(.72*(a.d/1.05)),0,1))*h*.09:0;c.translate(0,-lift);bPose(a.k===1?im.heroSkills:im.bSpin,frame,h,a.k===1?'samidare':'spin');c.restore();return;
 }
 if(S.normalAttack){
   const p=C(S.normalAttack.t/S.normalAttack.d,0,.999);
   bFrame(im.heroSkills,[0,1,2,3][Math.floor(p*4)],h,'samidare');return;
 }
 if(S.speed>.05){bFrame(im.heroRun,Math.floor(((S.runPhase/(Math.PI*2))%1+1)%1*8),h,'run');return;}
 bFrame(im.heroSkills,0,h,'samidare');
}
function drawNormalSlash(){}
function drawDefeatedHero(h){c.save();c.rotate(-C(S.defeat.t/.9,0,1)*1.45);bFrame(im.heroSkills,0,h,'samidare');c.restore();}

function draw(){
  placeNotice();c.clearRect(0,0,W,H);bg();c.save();
  if(S.shake)c.translate(Math.sin(S.t*110)*S.shake*22,Math.cos(S.t*93)*S.shake*12);
  // Motion flecks on the path use the same perspective as the combatants.
  c.fillStyle='#eadfb72b';for(let i=0;i<24;i++){let z=((i*2.7-S.z)%64.8+64.8)%64.8-3,p=1/(1+z*.115);c.fillRect(W/2+((i%3)-1)*W*.23*p,H*HORIZON+H*GROUND_SPAN*p,2*p,5*p)}
  frontline();
  for(const f of S.fx)if(f.kind==='bossGround')drawBossGround(f);
  for(const e of S.en.filter(e=>(!S.cinematic||!e.boss||(S.cinematic.kind==='victory'&&S.cinematic.t<1.6))&&(!e.dead||e.fade>0)&&e.z-S.z>-2&&e.z-S.z<45).sort((a,b)=>b.z-a.z)){
    const z=e.z-S.z,p=perspective(z),img=im[e.t],x=lx(e.boss?e.displayLane:e.l,z),y=yy(z),h=e.boss?bossHeight(z):D[e.t].h*p*Math.min(1,H/844)*.77;
    if(!img.complete||!img.naturalWidth)continue;const rect=crop(img),w=h*rect[2]/rect[3];
    c.save();c.translate(x,y);c.globalAlpha=e.boss&&S.cinematic?.kind==='victory'?1-E(C(S.cinematic.t/1.6,0,1)):e.dead?e.fade/.4:1;
    c.fillStyle='#07171966';c.beginPath();c.ellipse(0,0,w*.33,8*p,0,0,7);c.fill();
    if(e.tell>0&&!e.dead&&!e.boss){c.strokeStyle='#ff785c';c.lineWidth=2;c.beginPath();c.ellipse(0,0,40*p,12*p,0,0,7);c.stroke();c.fillStyle='#ffd48e';c.font='bold 22px sans-serif';c.textAlign='center';c.fillText('!',0,-h-18)}
    if(e.fl&&!(e.boss&&S.cinematic?.kind==='victory'))c.globalAlpha*=.6;if(e.boss)drawBossSprite(e,h);else c.drawImage(img,...rect,-w/2,-h,w,h);c.restore();
    if(!e.dead){c.fillStyle='#10202c';c.fillRect(x-25*p,y-h-10,50*p,5);c.fillStyle='#f6c977';c.fillRect(x-25*p,y-h-10,50*p*e.hp/e.max,5)}
  }
  drawWaves();
  for(const shot of S.shots){if(shot.kind==='bossEarth'){drawBossEarth(shot);continue;}const z=shot.z-S.z,p=perspective(z),x=lx(shot.l,z),y=yy(z)-45*p;c.save();c.fillStyle=shot.t==='mage'?'#8eeaff':'#ff873d';c.shadowColor=c.fillStyle;c.shadowBlur=18;c.beginPath();c.arc(x,y,9*p+2,0,7);c.fill();c.restore()}
  drawWaterEffect(false);drawGuardImpact();drawDashTrail();drawSkillVfx(false);
  const x=playerX(),y=playerY(),h=playerHeight(),img=im.hero;c.save();c.translate(x,y);
  c.fillStyle='#06111b66';c.beginPath();c.ellipse(0,0,h*.25,h*.04,0,0,7);c.fill();
  if(S.defeat)drawDefeatedHero(h);else if(armoredReady())drawArmoredHero(h);else if(img.complete&&img.naturalWidth){const rect=crop(img),w=h*rect[2]/rect[3];c.drawImage(img,...rect,-w/2,-h,w,h)}c.restore();drawSkillVfx(true);drawNormalSlash();drawWaterEffect(true);drawEffects();c.restore();drawUltimate();drawBossWideSlash();drawBattleBanner();
  if(S.hit){c.fillStyle='rgba(255,80,60,.12)';c.fillRect(0,0,W,H)}
  drawCinematic();
}
const SCORE_KEY='eta.preview-b.score.v1';
function totalDealtDamage(){return S.dealtDamage+S.overkill;}
function score(ok){
  // Reference-inspired scale: time is dominant; retain the existing four categories.
  const seconds=Math.max(0,S.t);
  const time=ok?Math.round(seconds<=300?3600000-8000*seconds:1200000*Math.exp(-(seconds-300)/150)):0;
  const damage=ok?Math.round(250000*C(1-S.dmg/20,0,1)):0;
  const skill=Math.round(400000*C(S.fin/61,0,1));
  const dealt=Math.round(100000*Math.max(0,totalDealtDamage())/214),overkill=0;
  return{skill,time,damage,dealt,overkill,total:skill+time+damage+dealt};
}
function highScore(){try{const n=Number(localStorage.getItem(SCORE_KEY));return Number.isFinite(n)&&n>=0?n:0}catch{return 0}}
function saveHighScore(n){try{localStorage.setItem(SCORE_KEY,String(n))}catch{}}
let titleMenuFocus=null;
let guidePage=0,guideOpen=false;
const GUIDE_PAGES=[
 {src:'/Eta/sword/assets/guide-page-1.webp',alt:'ゲーム概要。敵に接近してスキルや奥義を発動しよう！'},
 {src:'/Eta/sword/assets/guide-page-2-v2.webp',alt:'スーパーダッシュ。敵を撃破し上へスワイプ‼︎ スーパーダッシュを決めよう。スキルが回復、タイム短縮。'},
 {src:'/Eta/sword/assets/guide-page-3.webp',alt:'ハイスコアを狙おう。クリアタイムは速いほど高得点。スキルフィニッシュで得点アップ。被ダメージを少なくし、敵に与えたダメージを増やそう。4項目の合計が総合スコア。'},
 {src:'/Eta/sword/assets/guide-page-4.webp',alt:'ランキングに登録しよう。クリア後に名前を入力し、登録を押すと全プレイヤー共通のランキングに参加できます。上位100件の記録を保存し、詳細からスコアの内訳を確認できます。'}
];
function showGuidePage(n){guidePage=C(n,0,GUIDE_PAGES.length-1);const page=GUIDE_PAGES[guidePage];$('#guideImage').src=page.src;$('#guideImage').alt=page.alt;$('#guidePrev').hidden=guidePage===0;$('#guideNext').hidden=guidePage===GUIDE_PAGES.length-1;$('#guideExit').textContent='閉じる';$('#guideStatus').textContent=(guidePage+1)+' / '+GUIDE_PAGES.length;$('#guideCount').textContent=$('#guideStatus').textContent;if(guideOpen)(guidePage===GUIDE_PAGES.length-1?$('#guideExit'):$('#guideNext')).focus?.();}
function closeGuide(){guideOpen=false;$('#guidePanel').classList.add('hide');$('#gameHelp').focus?.();titleMenuFocus=null;}
$('#guidePrev').onclick=()=>showGuidePage(guidePage-1);$('#guideNext').onclick=()=>showGuidePage(guidePage+1);$('#guideExit').onclick=closeGuide;
function openTitlePanel(kind){
 if(S.run)return;titleMenuFocus=kind==='help'?$('#gameHelp'):$('#ranking');
 if(kind==='help'){guideOpen=true;$('#guidePanel').classList.remove('hide');showGuidePage(0);return;}
 $('#titlePanelHeading').textContent='ランキング';if(window.GameRanking)window.GameRanking.open($('#titlePanelBody'));else $('#titlePanelBody').textContent='ランキングを読み込めませんでした。画面を再読み込みしてください。';
 $('#titlePanel').classList.remove('hide');$('#titlePanelClose').focus?.();
}
function closeTitlePanel(){$('#titlePanel').classList.add('hide');titleMenuFocus?.focus?.();titleMenuFocus=null;}
$('#gameHelp').onclick=()=>{titleMenuFocus=$('#gameHelp');$('#titlePanelHeading').textContent='ステージB・試作';$('#titlePanelBody').innerHTML='<p>左右スワイプ：レーン移動<br>上スワイプ：加速<br>撃破後0.5秒以内の上スワイプ：スーパーダッシュ<br>下スワイプ：後退</p><p>五月雨・回転閃・奥義は下のボタンで発動。防御は押している間有効です。</p><p>道中は指定の10ウェーブ、ボスは黒鎧のゴリラです。技の射程とダメージはBの指定仕様です。記録はランキングに送信されません。</p>';$('#titlePanel').classList.remove('hide');};$('#ranking').onclick=()=>openTitlePanel('ranking');$('#titlePanelClose').onclick=closeTitlePanel;
addEventListener('keydown',e=>{if(!titleMenuFocus)return;
 if(e.key==='Escape'){e.preventDefault();if(guideOpen)closeGuide();else closeTitlePanel();}
 if(guideOpen&&(e.key==='ArrowRight'||e.key==='ArrowLeft')){e.preventDefault();showGuidePage(guidePage+(e.key==='ArrowRight'?1:-1));}
 if(e.key==='Tab'){e.preventDefault();if(guideOpen){const buttons=[$('#guidePrev'),$('#guideNext'),$('#guideExit')].filter(b=>!b.hidden),i=buttons.indexOf(document.activeElement);buttons[(i+(e.shiftKey?-1:1)+buttons.length)%buttons.length].focus?.();}else {const buttons=Array.from($('#titlePanel').querySelectorAll('button:not(:disabled),summary'));const i=buttons.indexOf(document.activeElement);buttons[(i+(e.shiftKey?-1:1)+buttons.length)%buttons.length].focus();}}
});

function fitResult(){
  const panel=$('#result'),card=$('.quest-results');
  if(!panel||!card)return;
  card.style.width=Math.min(420,Math.max(280,W-24))+'px';
  const height=card.offsetHeight;
  if(!height)return;
  const availableHeight=Math.max(1,(panel.clientHeight||H)-28);
  const scale=Math.min(1,availableHeight/height,(W-24)/card.offsetWidth);
  card.style.transform='translate(-50%,-50%) scale('+scale+')';
}
addEventListener('resize',fitResult);
if(window.visualViewport)window.visualViewport.addEventListener('resize',fitResult);
if(document.fonts)document.fonts.ready.then(fitResult);
function resultRow(title,label,value,points,extra=''){
  return '<section class="score-section"><h3>'+title+'</h3><div class="score-columns"><div><label>'+label+'</label><strong>'+value+'</strong></div><div><label>スコア</label><strong class="score-value">'+points.toLocaleString('ja-JP')+'</strong></div></div>'+extra+'</section>';
}
function end(ok){
  if(window.GameSFX)window.GameSFX.finish();S.run=0;S.ptr=null;S.guard=0;S.cinematic=null;$('#gameViewport').classList.remove('cinematic');hideNotice();
  const points=score(ok),previous=highScore();
  if(ok&&points.total>previous)saveHighScore(points.total);
  if(window.GameRanking)window.GameRanking.setResult(ok,{clear_time:S.t,road_time:S.roadTime,skill_finishes:S.fin,damage_taken:S.dmg,damage_dealt:totalDealtDamage(),overkill:S.overkill,time_score:points.time,skill_score:points.skill,damage_taken_score:points.damage,damage_dealt_score:points.dealt});
  $('#resultTitle').textContent=ok?'クエスト結果':'クエスト失敗';
  $('#resultText').innerHTML=
    resultRow('クリアタイムスコア','クリアタイム（秒）',ok?S.t.toFixed(2):'—',points.time)+
    resultRow('スキルフィニッシュスコア','スキルフィニッシュ回数',S.fin,points.skill)+
    resultRow('被ダメージスコア','被ダメージ',S.dmg.toLocaleString('ja-JP'),points.damage)+
    resultRow('与ダメージスコア','与ダメージ',totalDealtDamage().toLocaleString('ja-JP'),points.dealt);
  $('#totalScore').textContent=points.total.toLocaleString('ja-JP');
  $('#overkillValue').textContent=S.overkill.toLocaleString('ja-JP');
  $('#roadTime').textContent=(S.roadTime===null?S.t:S.roadTime).toFixed(2);
  $('#result').classList.remove('hide');$('#result').scrollTop=0;fitResult();
  // BGM continues through results and the next run.
}
function beginRun(){reset();S.en=[];S.introRun=1;S.run=1;sound('battleStart');}
function waitForForest(){return Promise.all([im.forestTrees,im.forestGround,im.heroSkills,im.heroRun,im.bSpin,im.bUltimate,im.ultimateFace,im.vfxThrust,im.vfxSpin,im.vfxUltimate].map(img=>{
  if(img.complete&&img.naturalWidth)return Promise.resolve();
  return new Promise((resolve,reject)=>{img.onload=resolve;img.onerror=()=>reject(new Error('背景を読み込めません'));if(img.complete)img.src=img.src;});
}));}
function forestReady(){return [im.forestTrees,im.forestGround,im.heroSkills,im.heroRun,im.bSpin,im.bUltimate,im.ultimateFace,im.vfxThrust,im.vfxSpin,im.vfxUltimate].every(img=>img.complete&&img.naturalWidth);}
function prepareStart(){const button=$('#start');button.disabled=true;button.setAttribute('aria-label','素材を読み込み中');button.textContent='読み込み中…';
waitForForest().then(()=>{purpleUltimateSheet(im.vfxUltimate);button.disabled=false;button.setAttribute('aria-label','ゲームを開始');button.textContent='START';},()=>{button.disabled=false;button.setAttribute('aria-label','素材を再読み込み');button.textContent='再読み込み';});}
function start(){if(!forestReady()){prepareStart();return;}if(window.GameSFX)window.GameSFX.start();beginRun();last=performance.now();$('#intro').classList.add('hide');if(window.GameBGM)window.GameBGM.start()}$('#start').onclick=start;$('#retry').onclick=()=>{if(window.GameSFX)window.GameSFX.pause();reset();$('#result').classList.add('hide');$('#intro').classList.remove('hide');$('#start').focus?.()};// Own each gesture by pointerId; button fingers cannot finish a canvas swipe.
for(const id of ['#guard','#s1','#s2','#ultimate']){
  const button=$(id);
  button.addEventListener('contextmenu',e=>e.preventDefault());
  button.addEventListener('dragstart',e=>e.preventDefault());
  button.addEventListener('animationend',()=>button.classList.remove('flash'));
  button.onpointerdown=e=>{
    e.preventDefault();e.stopPropagation();flash(button);
    if(S.run&&!S.pause&&window.GameSFX)window.GameSFX.wake();
    if(id==='#guard'){
      if(S.run&&!S.pause&&!S.cinematic&&S.barriers>0){S.guard=1;S.barrierHeld=true;S.dash=null;S.boost=0;S.pt=S.pd;sound('guardRaise');button.setPointerCapture(e.pointerId);notice('防御',.5)}
    }else if(id==='#ultimate')fireUltimate();else fire(id==='#s1'?1:2);
  };
}
['pointerup','pointercancel','lostpointercapture'].forEach(v=>$('#guard').addEventListener(v,()=>{S.guard=0;S.barrierHeld=false;}));
$('#stop').onclick=()=>{
  if(!S.run&&(!S.defeat||S.defeat.finished))return;if(window.GameSFX)window.GameSFX.pause();S.pause=1;S.guard=0;S.barrierHeld=false;S.ptr=null;hideNotice();
  $('#pause').classList.remove('hide');if(window.GameBGM)window.GameBGM.pause();
};
$('#resume').onclick=()=>{if(window.GameSFX)window.GameSFX.start();S.pause=0;last=performance.now();$('#pause').classList.add('hide');if(window.GameBGM)window.GameBGM.resume()};
cv.onpointerdown=e=>{
  if(!S.run||S.pause||S.cinematic||ultimateCutinActive()||S.ptr)return;
  e.preventDefault();if(window.GameSFX)window.GameSFX.wake();cv.setPointerCapture(e.pointerId);
  S.ptr={id:e.pointerId,x:e.clientX,y:e.clientY};
};
cv.onpointerup=e=>{
  if(!S.ptr||S.ptr.id!==e.pointerId)return;
  e.preventDefault();const ptr=S.ptr;S.ptr=null;
  if(!S.run||S.pause||S.cinematic||ultimateCutinActive())return;
  const dx=e.clientX-ptr.x,dy=e.clientY-ptr.y;
  if(Math.abs(dx)>30&&Math.abs(dx)>Math.abs(dy))lane(dx<0?-1:1);
  else if(Math.abs(dy)>30&&Math.abs(dy)>Math.abs(dx)){
    if(dy<0)accelerate();else depth(-MAX_DEPTH/4);
  }
};
['pointercancel','lostpointercapture'].forEach(v=>cv.addEventListener(v,e=>{if(S.ptr&&S.ptr.id===e.pointerId)S.ptr=null}));
// iOS rubber-band scrolling needs a non-passive touchmove cancellation.
// Do not cancel touchstart/end: START, STOP and skill taps must stay native.
document.addEventListener('touchmove',e=>{if(e.target.closest&&e.target.closest('#result,#titlePanel,#scoreEntry'))return;if(e.cancelable)e.preventDefault()},{passive:false});
cv.addEventListener('contextmenu',e=>e.preventDefault());
cv.addEventListener('dragstart',e=>e.preventDefault());
document.addEventListener('visibilitychange',()=>{if(document.hidden&&(S.run||(S.defeat&&!S.defeat.finished))&&!S.pause)$('#stop').click()});
addEventListener('keydown',e=>{if(!S.run||S.pause||S.cinematic||(ultimateCutinActive()&&!['1','2','3'].includes(e.key)))return;if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','1','2','3',' '].includes(e.key))e.preventDefault();if(e.repeat)return;if(e.key==='ArrowLeft')lane(-1);if(e.key==='ArrowRight')lane(1);if(e.key==='ArrowUp')accelerate();if(e.key==='ArrowDown')depth(-MAX_DEPTH/4);if(e.key==='1')fire(1);if(e.key==='2')fire(2);if(e.key==='3')fireUltimate();if(e.key===' '&&S.barriers>0){S.guard=1;S.barrierHeld=true;S.dash=null;S.boost=0;S.pt=S.pd;sound('guardRaise')}});addEventListener('keyup',e=>{if(e.key===' '){S.guard=0;S.barrierHeld=false;}});

// Stage 3 only. Reference: Eta 067ba442/spear/game.js. No public DB or ranking writes.
const SPELL={playerHP:20,initialGauge:90,barriers:3,bossHP:40,bossWait:[1,3],enemyWait:[2,6],
 skill:[{range:45,speed:150,damage:2,release:.20,duration:.55,impactDepth:9},{range:20,speed:50,damage:2,release:.18,duration:.55,impactDepth:13}],
 normal:{range:45,speed:80,damage:1},
 ultimate:{range:45,speed:80,damage:2,count:4,impactDepth:13,paralysisChance:.8,paralysisDuration:3},
 provisional:{boss1Charge:.38,boss3Sweep:.6,enemySpeed:60,reflectSpeed:120,reflectRange:45},boss3Range:9};
const processed={},frames={},pending=[];
const whiteKeys=new Set(['ultimateDiamondDust','ultimateImpactIce','bossParalyzed','flightFire','flightIce','bossEntrance','heroRun','heroFall','heroBase','bossMove','boss1','boss2','boss3','boss4']);
const sheets={heroRun:[4,2],heroFall:[4,2],bossMove:[2,2],boss1:[4,2],boss2:[4,2],boss3:[4,2],boss4:[4,2]};
function prepareImage(key,img){
 if(!whiteKeys.has(key)){processed[key]=img;return;}
 const cn=document.createElement('canvas');const ratio=Math.min(1,1024/img.naturalWidth);cn.width=Math.round(img.naturalWidth*ratio);cn.height=Math.round(img.naturalHeight*ratio);const ctx=cn.getContext('2d',{willReadFrequently:true});ctx.drawImage(img,0,0,cn.width,cn.height);
 if(whiteKeys.has(key)){
  const id=ctx.getImageData(0,0,cn.width,cn.height),d=id.data;
  for(let i=0;i<d.length;i+=4){const mn=Math.min(d[i],d[i+1],d[i+2]),mx=Math.max(d[i],d[i+1],d[i+2]);if(key==='ultimateDiamondDust'){d[i+3]*=C((255-mn-3)/100,0,1);continue;}if(key==='reflectionDome'){d[i+3]*=Math.min(1,(255-d[i])/100);continue;}if(mn>240)d[i+3]=0;else if(mn>205&&mx-mn<24)d[i+3]*=(240-mn)/35;}
  ctx.putImageData(id,0,0);
 }
 if(key==='ultimateImpactIce'){
  // The four silhouettes have uneven row heights and slightly overlapping tips.
  // Clip along the white gaps rather than cutting into equal-height cells.
  const polygons=[[[0,0],[1024,0],[1024,438],[420,438],[390,410],[0,410]],[[0,410],[390,410],[420,438],[1024,438],[1024,770],[425,770],[305,725],[0,725]],[[0,725],[305,725],[425,770],[1024,770],[1024,1105],[0,1105]],[[0,1105],[1024,1105],[1024,1536],[0,1536]]];
  const boxes=[[270,0,510,438],[265,410,540,360],[255,725,510,380],[265,1105,560,425]];
  frames[key]=boxes.map(([x,y,w,h],i)=>{const out=document.createElement('canvas');out.width=w;out.height=h;const g=out.getContext('2d');g.beginPath();polygons[i].forEach(([px,py],n)=>n?g.lineTo(px-x,py-y):g.moveTo(px-x,py-y));g.closePath();g.clip();g.drawImage(cn,-x,-y);return out;});
 }
 processed[key]=cn;
 if(sheets[key]){splitSheet(key,cn,...sheets[key]);delete processed[key];cn.width=cn.height=1;}
}
function splitSheet(key,cn,cols,rows){
 // Connected silhouettes, not fixed-cell slicing: long claws can cross row boundaries.
 const w=cn.width,h=cn.height,ctx=cn.getContext('2d'),d=ctx.getImageData(0,0,w,h).data,seen=new Uint8Array(w*h),queue=new Int32Array(w*h),parts=[];
 for(let seed=0;seed<w*h;seed++){
  if(seen[seed]||d[seed*4+3]<90)continue;let head=0,tail=1;queue[0]=seed;seen[seed]=1;let l=w,r=0,t=h,b=0,sx=0,sy=0;
  while(head<tail){const p=queue[head++],x=p%w,y=(p/w)|0;l=Math.min(l,x);r=Math.max(r,x);t=Math.min(t,y);b=Math.max(b,y);sx+=x;sy+=y;
   for(const n of [x>0?p-1:-1,x<w-1?p+1:-1,y>0?p-w:-1,y<h-1?p+w:-1])if(n>=0&&!seen[n]&&d[n*4+3]>=90){seen[n]=1;queue[tail++]=n;}
  }
  if(tail>1800)parts.push({l,r,t,b,n:tail,cx:sx/tail,cy:sy/tail});
 }
 const cells=Array.from({length:cols*rows},()=>null);
 for(const p of parts){let col=Math.min(cols-1,Math.floor(p.cx/(w/cols))),row=Math.min(rows-1,Math.floor(p.cy/(h/rows))),i=row*cols+col;if(!cells[i]||p.n>cells[i].n)cells[i]=p;}
 frames[key]=cells.map((p,i)=>{if(!p)p={l:i%cols*w/cols,r:(i%cols+1)*w/cols-1,t:Math.floor(i/cols)*h/rows,b:(Math.floor(i/cols)+1)*h/rows-1};
  const pad=4,l=Math.max(0,p.l-pad),t=Math.max(0,p.t-pad),r=Math.min(w,p.r+pad+1),b=Math.min(h,p.b+pad+1);const out=document.createElement('canvas');out.width=r-l;out.height=b-t;out.getContext('2d').drawImage(cn,l,t,out.width,out.height,0,0,out.width,out.height);
  // Anatomical anchors measured on the 1536x1024 run atlas. Hair/tail
  // bounds change dramatically; they must never reposition the horse's head.
  const head=key==='heroRun'?[[169,40],[583,37],[1024,42],[1400,40],[170,540],[548,540],[914,540],[1354,540]][i]:null;
  let body=null,mane=null;
  if(head){
   body=document.createElement('canvas');mane=document.createElement('canvas');
   body.width=mane.width=out.width;body.height=mane.height=out.height;
   const bc=body.getContext('2d'),mc=mane.getContext('2d');bc.drawImage(out,0,0);mc.drawImage(out,0,0);
   const bd=bc.getImageData(0,0,out.width,out.height),md=mc.getImageData(0,0,out.width,out.height);
   const hx=head[0]*w/1536-l,hy=head[1]*h/1024-t,scale=h/1024;
   for(let yy=0;yy<out.height;yy++)for(let xx=0;xx<out.width;xx++){
    const n=(yy*out.width+xx)*4,relativeY=(yy-hy)/scale;
    const warm=bd.data[n]>bd.data[n+2]*1.2&&bd.data[n]>bd.data[n+1]*.95;
    // Retain the small orange tail-root tuft in the lower body. Long flame
    // tips belong to the independently animated mane, even below the neck.
    const isMane=relativeY<102||(relativeY<170&&warm&&Math.abs(xx-hx)>50*scale);
    if(isMane)bd.data[n+3]=0;else md.data[n+3]=0;
    if(relativeY>=102&&relativeY<170&&Math.abs(xx-hx)>50*scale&&bd.data[n+2]<=bd.data[n]*1.04)bd.data[n+3]=0;
   }
   bc.putImageData(bd,0,0);mc.putImageData(md,0,0);
  }
  return {image:out,body,mane,scaleHeight:h/rows*.96,
   anchorX:head?head[0]*w/1536-l:out.width/2,
   anchorY:head?(head[1]+430)*h/1024-t:out.height};
 });
}
function imageReady(){return Object.keys(src).every(k=>processed[k]||frames[k]?.length);}
function forestReady(){return imageReady();}
function waitForForest(){return Promise.all(pending);}
function prepareStart(){const b=$('#start');b.disabled=true;b.textContent='読み込み中…';Promise.all(pending).then(()=>{b.disabled=false;b.textContent='START';drawDetailPreview();},()=>{b.textContent='素材の読み込み失敗：再読込してください';});}
function mk(t,z){return{t,z,l:RI(0,2),hp:D[t].hp,max:D[t].hp,dead:0,cd:R(2,6),tell:0,mv:R(.7,2),fl:0,shield:t==='mage'};}
function roster(){const types=[null,'slime','skeleton','mage','dragon'],waves=[[1,1,2,2,2,2],[2,2,2,1,1,1],[1,2,1,1,4,4],[3,2,2,3,2,1],[3,2,2,3,2,2],[2,4,2,2,3,2],[3,3,2,3,4,2],[3,2,2,3,2,2],[4,3,2,4,3,2],[3,4,2,3,4,2]];return waves.flatMap((p,g)=>p.map((n,i)=>Object.assign(mk(types[n],18+g*ENEMY_GROUP_GAP*1.5+Math.floor(i/3)*ENEMY_ROW_GAP),{l:i%3,group:g})));}
Object.assign(D,{slime:{hp:2,d:1,r:1,h:205},skeleton:{hp:3,d:1,r:1,h:220},mage:{hp:3,d:1,r:1,h:228},dragon:{hp:5,d:3,r:1,h:215},boss:{hp:SPELL.bossHP,d:3,r:1,h:300}});
Object.assign(ULTIMATE,{capacity:90,duration:1.5,cutin:.72,windup:.8,travel:.56});
function reset(){$('#gameViewport').classList.remove('cinematic');combatSeed=17319;S={run:0,pause:0,t:0,phase:'road',defeat:null,cinematic:null,roadTime:null,bossStartedAt:null,hp:20,barriers:3,dmg:0,dealtDamage:0,ultimateCharge:90,ultimate:null,overkill:0,z:0,l:1,guard:0,guardPose:0,guardImpact:0,introRun:0,ch:[4,4],fr:[0,0],skill:null,fin:0,dashUntil:-1,dash:null,boost:0,normalAttack:null,norm:0,en:roster(),shots:[],bolts:[],impacts:[],ptr:null,hit:0,pd:0,pt:0,notice:null,ll:1,fx:[],waves:[],waterFx:[],earthFx:[],combo:0,comboTime:0,shake:0,speed:0,runPhase:0,retreat:0};hideNotice();ui();}
function ui(){updateUltimateUI();const ratio=C(S.hp/20,0,1);$('#hp').textContent=Math.ceil(C(S.hp,0,20))+'/20';$('#hpf').style.width=ratio*100+'%';$('#hpf').style.background='hsl('+ratio*120+',100%,50%)';$('#time').textContent=S.t.toFixed(1);$('#fin').textContent=S.fin;const boss=S.en.find(e=>e.boss);$('#bossHud').classList.toggle('hide',S.phase!=='boss'||!!S.cinematic);$('#bossHp').textContent=boss?Math.max(0,boss.hp)+' / '+boss.max:'';
 for(let i=0;i<2;i++){const fill=C((S.ch[i]+(S.ch[i]<4?S.fr[i]:0))/4,0,1);$('#g'+(i+1)).style.strokeDashoffset=String(100*(1-fill));$('#s'+(i+1)).setAttribute('aria-disabled',String(S.ch[i]<1));}
 if($('#barrierCount'))$('#barrierCount').textContent=S.barriers;$('#guard').style.filter=S.barriers?'':'grayscale(1)';
}
function updateUltimateUI(){if(!S)return;const value=C(S.ultimateCharge,0,90);$('#ultimateFill').style.strokeDashoffset=String(100*(1-value/90));$('#ultimate').setAttribute('aria-disabled',String(value<90));$('#ultimate').setAttribute('aria-label','四肢炎弾：'+Math.floor(value)+'/90');}
function sound(){} // Supplied stage effects are synchronized to their visual owners below.
function syncSpellAudio(){
 const audio=window.SpellSFX;if(!audio||!S)return;const entries=[];
 for(const b of S.bolts)if(b.k===4&&b.age<.22)entries.push({id:b,name:'cast',age:b.age,duration:.22});
 if(S.skill)entries.push({id:S.skill,name:'cast',age:S.skill.t,duration:S.skill.d});
 if(S.ultimate)entries.push({id:S.ultimate,name:'ultimate',age:S.ultimate.t,duration:ULTIMATE.duration});
 for(const f of S.impacts)if(f.k===1||f.k===2)entries.push({id:f,name:f.k===1?'fire':'ice',age:f.t,duration:f.life});
 if(S.reflectionAudio&&S.guardImpact>0)entries.push({id:S.reflectionAudio,name:'reflect',age:.35-S.guardImpact,duration:.35});
 audio.sync(entries,!!(S.pause||!S.run||S.defeat||S.cinematic));
}
function hurt(n){if(S.defeat)return;S.combo=0;S.shake=.18;S.hp-=n;S.dmg+=n;S.hit=.15;burst(S.l,S.z+S.pd,'#ff7563',12);if(S.hp<=0){S.bolts=[];S.impacts=[];beginDefeat();}}
function hit(e,n,sk,source='skill'){
 if(e.dead)return false;if(e.shield){e.shield=false;e.shieldFlash=.3;burst(e.l,e.z,'#b7f8ff',10);return false;}
 const dealt=Math.min(Math.max(0,e.hp),n);S.dealtDamage+=dealt;S.overkill+=Math.max(0,n-Math.max(0,e.hp));if(source!=='ultimate')S.ultimateCharge=C(S.ultimateCharge+dealt,0,90);e.hp-=n;e.fl=.12;S.combo++;S.comboTime=2;S.fx.push({kind:'number',l:e.l,z:e.z,n,t:0,life:.8,color:'#fff079'});
 if(source==='ultimate'&&e.hp>0&&random()<SPELL.ultimate.paralysisChance)e.paralysis=SPELL.ultimate.paralysisDuration;
 if(e.hp<=0){e.dead=1;e.fade=.4;S.dashUntil=S.t+.5;if(sk)S.fin++;}return true;
}
function cancelAttackMotion(){S.skill=null;S.ultimate=null;S.normalAttack=null;S.bolts=[];S.waves=[];}
function fire(k){if(!S.run||S.pause||S.cinematic||S.ch[k-1]<1)return false;cancelAttackMotion();S.ch[k-1]--;S.guard=0;S.barrierHeld=false;S.dash=null;S.boost=0;S.skill={k,l:S.l,t:0,d:SPELL.skill[k-1].duration,done:false};notice(k===1?'速炎球':'氷塊球',.6);return true;}
function fireUltimate(){if(!S.run||S.pause||S.cinematic||S.ultimateCharge<90)return false;cancelAttackMotion();S.ultimateCharge=0;S.guard=0;S.barrierHeld=false;S.dash=null;S.boost=0;S.ultimate={t:0,l:S.l,fired:false};hideNotice();return true;}
function makeBolt(k,l,source='skill',offset=0){const cfg=k===4?SPELL.normal:k===3?SPELL.ultimate:SPELL.skill[k-1],origin=S.z+S.pd-(k===3?1.5:0);return{k,l,targetLane:l,z:origin,origin,travel:0,range:cfg.range,speed:cfg.speed,damage:cfg.damage,source,offset,age:0};}
function updateUltimate(dt){const a=S.ultimate;if(!a)return;a.t+=dt;if(!a.fired&&a.t>=ULTIMATE.windup){a.fired=true;for(let i=0;i<4;i++)S.bolts.push(makeBolt(3,a.l,'ultimate',i));notice('四肢炎弾',.8);}if(a.t>=ULTIMATE.duration)S.ultimate=null;}
// Four projected Bezier arcs follow the supplied red/yellow trajectory sketch.
// Broad side loops and an upper/lower pair meet only at maximum range.
function ultimatePoint(b){
 const t=C(b.travel/b.range,0,1),u=1-t,startZ=b.origin-S.z,endZ=b.origin+b.range-S.z;
 const sx=lx(b.targetLane,startZ),sy=yy(startZ)+12*perspective(startZ);
 const ex=lx(b.targetLane,endZ),ey=yy(endZ)-75*perspective(endZ),span=Math.min(W*.48,210);
 const controls=[
  [sx-span,sy+H*.02,ex-span,ey+H*.07],
  [sx+span,sy+H*.02,ex+span,ey+H*.07],
  [sx-span*.75,sy-H*.12,ex-span*.45,ey-H*.42],
  [sx+span*.75,sy+H*.19,ex+span*.45,ey+H*.20]
 ];
 const [ax,ay,bx,by]=controls[b.offset];
 return {x:u*u*u*sx+3*u*u*t*ax+3*u*t*t*bx+t*t*t*ex,y:u*u*u*sy+3*u*u*t*ay+3*u*t*t*by+t*t*t*ey};
}
function boltLane(b){if(b.k!==3)return b.l;const z=b.z-S.z;return 1+(ultimatePoint(b).x-W/2)/(Math.min(W,520)*.27*perspective(z));}
// Explosion depth is the full reference reach, centered on the actual impact.
// One projectile damages each enemy at most once; four ultimate balls remain independent.
function explodeBolt(b,target){
 if(b.dead)return;
 if(b.k===4){if(target.hp!==undefined&&!target.dead)hit(target,b.damage,0,'normal');b.dead=true;return;}
 const cfg=b.k===3?SPELL.ultimate:SPELL.skill[b.k-1];
 const impactLane=target.l,impactZ=target.z,halfDepth=cfg.impactDepth/2;
 for(const e of S.en){
  const enemyLane=e.boss?Math.round(e.displayLane??e.l):e.l;
  if(!e.dead&&Math.abs(enemyLane-impactLane)<=1&&Math.abs(e.z-impactZ)<=halfDepth+1e-9)hit(e,b.damage,1,b.source);
 }
 S.impacts.push({k:b.k,l:impactLane,z:impactZ,slot:b.offset||0,bossTarget:b.k===3&&target.boss?target:null,scatter:Math.random()*.32-.16,t:0,life:(b.k===1?.48:b.k===2?1.05:.8*2/3)});
 b.dead=true;
}
// Curved fireballs collide where they are actually drawn, after the outward arc.
function ultimateContact(b,e){
 if(b.travel/b.range<.5||e.z<b.origin||e.z>b.origin+b.range)return false;
 const z=e.z-S.z,p=perspective(z),h=e.boss?bossHeight(z):D[e.t].h*p*Math.min(1,H/844)*.77;
 const x=lx(e.boss?e.displayLane:e.l,z),y=yy(z),r=Math.max(16,52*perspective(b.z-S.z));
 const a=b.previousPoint||ultimatePoint(b),v=ultimatePoint(b),left=x-h*.25-r,right=x+h*.25+r,top=y-h-r,bottom=y+r;
 let lo=0,hi=1;
 for(const [start,delta,min,max] of [[a.x,v.x-a.x,left,right],[a.y,v.y-a.y,top,bottom]]){
  if(Math.abs(delta)<1e-9){if(start<min||start>max)return false;continue;}
  let t0=(min-start)/delta,t1=(max-start)/delta;if(t0>t1)[t0,t1]=[t1,t0];lo=Math.max(lo,t0);hi=Math.min(hi,t1);if(lo>hi)return false;
 }
 return true;
}
function updateBolts(dt){for(const b of S.bolts){const before=b.z;if(b.k===3)b.previousPoint=ultimatePoint(b);b.age+=dt;if(b.k===3){const t=C(b.age/(b.range/b.speed),0,1);b.travel=b.range*(t<.8?.5*Math.pow(t/.8,2):.5+2.5*(t-.8));if(t===1)b.travel=b.range;}else b.travel+=b.speed*dt;b.z=Math.min(b.origin+b.travel,b.origin+b.range);const lane=boltLane(b);
 const e=S.en.filter(e=>!e.dead&&(b.k===3?ultimateContact(b,e):(Math.abs((e.boss?e.displayLane:e.l)-lane)<.48&&e.z>=before-.25&&e.z<=b.z+.25&&e.z<=b.origin+b.range))).sort((a,b)=>a.z-b.z)[0];
 if(e)explodeBolt(b,e);
 if(!b.dead&&b.travel>=b.range)explodeBolt(b,{l:Math.round(lane),z:b.origin+b.range});
 }S.bolts=S.bolts.filter(b=>!b.dead);}
function enemyShot(e,k,l=e.l,damage=3,range=45,attribute='spell'){S.shots.push({k,l,z:e.z,origin:e.z,travel:0,age:0,d:damage,speed:e.boss?120:SPELL.provisional.enemySpeed,range,attribute,reflected:false,bossAttack:!!e.boss});}
function updateShots(dt){for(const p of S.shots){const before=p.z;p.age+=dt;p.travel+=p.speed*dt;p.z+=(p.reflected?1:-1)*p.speed*dt;
 if(p.reflected){const e=S.en.filter(e=>!e.dead&&Math.abs((e.boss?e.displayLane:e.l)-p.l)<.48&&e.z>=before-.25&&e.z<=p.z+.25).sort((a,b)=>a.z-b.z)[0];if(e){hit(e,p.d,1,'reflect');p.dead=true;}}
 else {const heroZ=S.z+S.pd;if(!p.passed&&before>=heroZ-.4&&p.z<=heroZ+.4){p.passed=true;if(Math.abs(S.ll-p.l)<.48){if(S.guard&&S.barriers>0&&p.attribute==='spell'){S.barriers--;S.guard=0;S.guardImpact=.35;S.reflectionAudio={};S.dash=null;S.boost=0;S.pt=S.pd;p.reflected=true;p.z=heroZ+.5;p.travel=0;p.range=SPELL.provisional.reflectRange;p.speed=SPELL.provisional.reflectSpeed;}else{hurt(p.d);p.dead=true;}}}}
 if(p.travel>=p.range||(!p.reflected&&p.z<S.z-8))p.dead=true;if(!S.run)break;
 }S.shots=S.shots.filter(p=>!p.dead);}
function bossMove(e){return{t:0,fromLane:e.displayLane??e.l,fromDepth:e.z-S.z,target:[bossRange(0,2),bossRange(9,15)],duration:bossRange(1.4,3.8)};}
function revealBoss(){S.en.push(Object.assign(mk('boss',S.z+15),{boss:true,l:1,displayLane:1,hp:SPELL.bossHP,max:SPELL.bossHP,cd:bossRange(1,3),action:null}));}
function updateBoss(e,dt){
 if(e.paralysis>0||e.paralyzedThisFrame)return;
 // Count the next 1-3s start interval during the current animation too.
 e.cd=Math.max(0,e.cd-dt);
 if(e.recover){e.recover.t+=dt;if(e.recover.t>.2)e.recover=null;}
 if(e.action){const a=e.action;a.age+=dt;
  for(const event of a.events)if(!event.done&&a.age>=event.at){event.done=true;enemyShot(e,event.k,event.l,event.d,event.range,event.attr);}
  if(a.age>=a.end+.2){e.recover={k:a.k,t:0};e.action=null;}return;
 }
 if(!e.patrol)e.patrol=bossMove(e);const p=e.patrol;p.t=Math.min(p.duration,p.t+dt);const q=p.t/p.duration;e.displayLane=p.fromLane+(p.target[0]-p.fromLane)*q;e.l=Math.round(e.displayLane);e.z=S.z+p.fromDepth+(p.target[1]-p.fromDepth)*q;e.movePose=Math.abs(p.target[0]-p.fromLane)*3>Math.abs(p.target[1]-p.fromDepth)?(p.target[0]<p.fromLane?2:3):(p.target[1]<p.fromDepth?0:1);if(p.t>=p.duration)e.patrol=bossMove(e);
 if(e.cd>0)return;const k=1+Math.floor(bossRandom()*4),l=e.l;let end,events=[];
 const ev=(at,key,lane,d=3,range=45,attr='spell')=>({at,k:key,l:lane,d,range,attr});
 if(k===1){const t=.2+SPELL.provisional.boss1Charge;events=[ev(t,'bossFire',l),ev(t+.5,'bossIce',l)];end=t+.7;}
 if(k===2){const order=sh([0,1,2]);events=order.map((lane,i)=>ev(1+i*.5,'bossBlack',lane));end=2.2;}
 if(k===3){events=[0,1,2].map((lane,i)=>ev(.6+i*.2,'bossYellow',lane,3,9));end=1.1;}
 if(k===4){events=[ev(.8,'claw',l,5,13,'physical')];end=.95;}
 e.cd=bossRange(...SPELL.bossWait);e.action={k,l,age:0,end,events};
}
function step(dt){
 if(S.pause)return;if(S.defeat&&!S.defeat.finished){S.defeat.t+=dt;if(S.defeat.t>=2.8){S.defeat.finished=true;end(0);}return;}if(!S.run)return;
 for(const f of S.impacts)f.t+=dt;S.impacts=S.impacts.filter(f=>f.t<f.life);
 if(S.cinematic){stepCinematic(dt);ui();return;}if(ultimateCutinActive()){const frozen=Math.min(dt,ULTIMATE.cutin-S.ultimate.t);S.ultimate.t+=frozen;dt-=frozen;if(dt<=1e-9){ui();return;}}
 for(const e of S.en){e.paralyzedThisFrame=!e.dead&&e.paralysis>0;e.paralysis=Math.max(0,(e.paralysis||0)-dt);}
 const before=S.z+S.pd;S.t+=dt;S.ll+=(S.l-S.ll)*(1-Math.exp(-18*dt));S.guardImpact=Math.max(0,S.guardImpact-dt);S.shake=Math.max(0,S.shake-dt);S.hit=Math.max(0,S.hit-dt);S.comboTime=Math.max(0,S.comboTime-dt);if(!S.comboTime)S.combo=0;
 if(S.introRun&&S.t>=2){S.en=roster();const off=S.z+S.pd+24;S.en.forEach(e=>e.z+=off);S.introRun=0;}
 for(const f of S.fx)f.t+=dt;S.fx=S.fx.filter(f=>f.t<f.life);
 if(S.notice){S.notice.left-=dt;if(S.notice.left<=0)hideNotice();}
 for(let i=0;i<2;i++)if(S.ch[i]<4){S.fr[i]+=dt/5;if(S.fr[i]>=1){S.fr[i]--;S.ch[i]++;}}
 const skillPriorityThisFrame=!!(S.skill||S.ultimate||S.bolts.some(b=>b.source!=='normal'));
 updateUltimate(dt);
  if(!S.guard&&!S.barrierHeld&&!S.guardImpact&&!S.ultimate){
    let runningTime=dt;
    if(S.dash){
      const dash=S.dash,requested=Math.min(SUPERDASH_SPEED*dt,dash.n),v=adv(requested);
      dash.n=Math.max(0,dash.n-v);
      if(v>.0001&&!dash.rewarded){dash.rewarded=true;for(let i=0;i<2;i++){S.ch[i]=Math.min(4,S.ch[i]+1);if(S.ch[i]===4)S.fr[i]=0}}
      if(dash.n<=1e-9||v+1e-9<requested||!Number.isFinite(front())||front()-S.z-S.pd<=FRONT_GAP+.025){
        S.dash=null;runningTime=Math.max(0,dt-requested/SUPERDASH_SPEED);
      }else runningTime=0;
    }
    if(runningTime>0)runForward(runningTime);
  }else{
    S.boost*=Math.exp(-dt/SWIPE_DECAY);if(S.boost<.001)S.boost=0;
  }

 S.speed=(S.z+S.pd-before)/Math.max(dt,1e-6);S.runPhase+=Math.max(0,S.z+S.pd-before)*RUN_PHASE_PER_UNIT;
  // Update the moving front before resolving any attacks against player depth.
  for(const e of S.en){
    if(e.dead||e.paralyzedThisFrame)continue;e.fl=Math.max(0,e.fl-dt);
    if(e.boss){updateBoss(e,dt);if(!S.run){ui();return;}continue;}
    const stageDistance=e.z-S.z;if(stageDistance>42||stageDistance<-2)continue;
    if(e.t==='mage')continue; // User-specified stationary one-use shield monster.
    e.mv-=dt;
    if(e.mv<=0&&e.tell<=0){
      if((e.group===undefined||distance(e)<7)&&random()<.6)e.l=C(e.l+(random()<.5?-1:1),0,2);
      e.dz=(e.dz||0)+R(-.3,.12);e.mv=R(.7,2);
    }
    const shift=C(e.dz||0,-2*dt,2*dt);e.dz=(e.dz||0)-shift;
    e.z=Math.max(S.z+FRONT_GAP,e.z+shift-.1*dt);
  }
 if(!S.guard&&!S.barrierHeld&&!S.guardImpact)updateDepth(dt);
 if(S.skill){const a=S.skill;a.t+=dt;if(!a.done&&a.t>=SPELL.skill[a.k-1].release){a.done=true;S.bolts.push(makeBolt(a.k,a.l));}if(a.t>=a.d)S.skill=null;}
 updateBolts(dt);
  const atFront=S.en.some(e=>!e.dead&&Math.abs((e.boss?e.displayLane:e.l)-S.l)<.48&&distance(e)<=SPELL.normal.range&&distance(e)>=0);
  S.norm=Math.max(0,S.norm-dt);
  const normalBlocked=skillPriorityThisFrame||!!S.skill||!!S.ultimate||S.bolts.some(b=>b.source!=='normal')||!!S.guard||!!S.barrierHeld||!!S.guardImpact;
  if(normalBlocked){S.normalAttack=null;S.normalFlash=0;}
  if(atFront&&!normalBlocked&&!S.normalAttack&&S.norm<=1e-9){
    S.normalAttack={k:4,l:S.l,t:0,d:.5,done:0};S.norm=1;
  }
  if(S.normalAttack){
    const a=S.normalAttack;a.t+=dt;
    if(!a.done&&a.t>=a.d*.48){
      a.done=1;S.bolts.push(makeBolt(4,a.l,'normal'));
    }
    if(a.t>=a.d)S.normalAttack=null;
  }

 for(const e of S.en){if(e.dead){e.fade=Math.max(0,e.fade-dt);continue;}e.fl=Math.max(0,e.fl-dt);e.shieldFlash=Math.max(0,(e.shieldFlash||0)-dt);if(e.boss||e.paralysis>0||e.paralyzedThisFrame)continue;if(distance(e)>45||distance(e)<-2)continue;e.cd-=dt;if(e.cd<=0){const n={slime:1,skeleton:2,mage:3,dragon:4}[e.t];enemyShot(e,'shot'+n,e.l,D[e.t].d,Math.max(45,e.z-S.z+8));e.cd=R(2,6);}}
 updateShots(dt);if(!S.run){ui();return;}
 if(!S.ultimate&&!S.introRun&&!S.en.some(e=>!e.dead)){S.bolts=[];if(S.phase==='road')startBoss();else startVictory();}ui();
}
function spriteFrame(key,index,x,y,h,alpha=1){const f=frames[key]?.[Math.max(0,Math.min(frames[key].length-1,index|0))];if(!f)return;
 // Separate upper mane motion from lower tail/leg motion. Half a cycle apart
 // keeps the supplied art, while anatomical head anchors keep the join stable.
 if(key==='heroRun'){
  // Use the two original near-centre poses instead of compressing any pixels.
  // Mane and tail use opposite neutral poses without stretching the silhouette.
  const neutral=(index|0)<4?0:4,body=frames[key][neutral],upper=frames[key][neutral===0?4:0];
  const sc=h/body.scaleHeight,us=h/upper.scaleHeight,legScale=h/f.scaleHeight;
  c.save();c.globalAlpha*=alpha;
  c.drawImage(body.body,x-body.anchorX*sc,y-body.anchorY*sc,body.image.width*sc,body.image.height*sc);
  c.drawImage(upper.mane,x-upper.anchorX*us,y-upper.anchorY*us,upper.image.width*us,upper.image.height*us);c.restore();return;
 }

 const sc=h/f.scaleHeight;c.save();c.globalAlpha*=alpha;c.drawImage(f.image,x-f.anchorX*sc,y-f.anchorY*sc,f.image.width*sc,f.image.height*sc);c.restore();}
function fullSprite(key,x,y,h,alpha=1){const img=processed[key];if(!img)return;const rect=crop(img),w=h*rect[2]/rect[3];c.save();c.globalAlpha*=alpha;c.drawImage(img,...rect,x-w/2,y-h,w,h);c.restore();}
function crop(image){if(bounds.has(image))return bounds.get(image);const cn=document.createElement('canvas');cn.width=image.width;cn.height=image.height;const ctx=cn.getContext('2d');ctx.drawImage(image,0,0);const d=ctx.getImageData(0,0,cn.width,cn.height).data;let l=cn.width,t=cn.height,r=0,b=0;for(let y=0;y<cn.height;y++)for(let x=0;x<cn.width;x++)if(d[(y*cn.width+x)*4+3]>40){l=Math.min(l,x);r=Math.max(r,x);t=Math.min(t,y);b=Math.max(b,y);}const rect=[l,t,Math.max(1,r-l+1),Math.max(1,b-t+1)];cn.width=cn.height=1;bounds.set(image,rect);return rect;}
function bg(){c.fillStyle='#071526';c.fillRect(0,0,W,H);const sky=processed.sky,ground=processed.ground;if(!sky||!ground)return;
 // Keep both distant towers inside the portrait viewport.
 c.drawImage(sky,0,0,sky.width,sky.height,0,0,W,H*.37);
 // Use the same world-space ground sampling and perspective width as spear.
 for(let y=Math.ceil(H*HORIZON)+1;y<H;y+=1){
  const p=(y/H-HORIZON)/GROUND_SPAN,z=groundZ(y/H)+S.z;
  const phase=((z/18)%2+2)%2,u=phase<=1?phase:2-phase;
  const sh=Math.min(ground.naturalHeight,Math.max(1,Math.abs(groundZ((y+1)/H)-groundZ(y/H))/18*ground.naturalHeight));
  const sy=Math.min(ground.naturalHeight-sh,u*(ground.naturalHeight-sh)),width=W*3.5*p,left=(W-width)/2;
  c.drawImage(ground,0,sy,ground.naturalWidth,sh,left,y,width,1.1);
  if(left>0){c.drawImage(ground,0,sy,ground.naturalWidth*.15,sh,0,y,left+1,1.1);c.drawImage(ground,ground.naturalWidth*.85,sy,ground.naturalWidth*.15,sh,W-left-1,y,left+1,1.1)}
 }
 const fog=c.createLinearGradient(0,H*.29,0,H*.44);fog.addColorStop(0,'#163747');fog.addColorStop(1,'#16374700');c.fillStyle=fog;c.fillRect(0,H*.29,W,H*.15);
 const rock=processed.rocks;if(rock){for(let n=18;n>=0;n--){const z=((n*8-S.z%8)+120)%152-8;if(z< -1)continue;const p=perspective(z),h=H*.8*p,w=h*.45;for(const side of [-1,1]){const col=(n+(side===1?1:0))%4;c.drawImage(rock,col*rock.width/4,0,rock.width/4,rock.height,W/2+side*W*.9*p-w/2,yy(z)-h,w,h);}}}

}
// Warnings share attack events and live projectiles, never a separate lane table.
function bossWarningAreas(){
 const areas=[];
 const add=(lane,origin,tip,range)=>{
  const near=Math.max(-1,origin-S.z-range),far=tip-S.z;
  if(far>near)areas.push({lane,near,far});
 };
 for(const e of S.en){const a=e.action;if(!e.boss||e.dead||!a)continue;
  for(const ev of a.events)if(!ev.done&&a.age>=ev.at-.2-1e-9&&a.age<ev.at)
   add(ev.l,e.z,e.z,ev.range);
 }
 // Keep the warning only on the remaining incoming path. Remove it as soon
 // as the actual effect disappears, hits the player, or is reflected.
 for(const p of S.shots)if(p.bossAttack&&!p.dead&&!p.reflected)
  add(p.l,p.origin,p.z,p.range);
 return areas;
}
function redGround(){for(const {lane,near,far} of bossWarningAreas()){
 c.beginPath();c.moveTo(lx(lane-.48,near),yy(near));c.lineTo(lx(lane+.48,near),yy(near));c.lineTo(lx(lane+.48,far),yy(far));c.lineTo(lx(lane-.48,far),yy(far));c.closePath();c.fillStyle='#ff2b3950';c.fill();c.strokeStyle='#ff8b9188';c.lineWidth=1;c.stroke();
}}

function bossFrame(e){const a=e.action;if(!a)return null;const t=Math.max(0,a.age-.2);if(a.k===1)return Math.min(7,Math.floor(t/(a.end-.2)*8));if(a.k===2)return Math.min(7,Math.floor(t/.1));if(a.k===3)return Math.min(7,Math.floor(t/.12));return Math.min(7,Math.floor(t/.09));}
function drawBossSprite(e,h){if(e.paralysis>0){c.save();c.translate(Math.sin(S.t*91)*Math.min(1,h*.004),Math.sin(S.t*113)*Math.min(.5,h*.002));fullSprite('bossParalyzed',0,0,h);c.restore();return;}const a=e.action;if(a){const recovery=C((a.age-a.end+.1)/.3,0,1);spriteFrame('boss'+a.k,bossFrame(e),0,0,h,1-recovery);if(recovery)spriteFrame('boss1',0,0,0,h,recovery);}else spriteFrame('bossMove',e.movePose??0,0,0,h);}
function shield(x,y,h,alpha){
 const img=processed.reflectionDome;if(!img)return;
 const r=crop(img),height=h*1.18,width=Math.min(W*.94,height*r[2]/r[3]);
 c.save();c.globalAlpha*=alpha*.65;
 c.drawImage(img,...r,x-width/2,y-height+h*.10,width,height);
 c.restore();
}

function enemyGuardShield(x,y,h,flash){
 const height=Math.max(52,h*1.15),width=height*.76;
 c.save();c.translate(x,y-h*.48);c.globalAlpha=flash?1:.82;
 c.fillStyle='rgba(175,110,245,0.14)';c.strokeStyle='#e4c1ff';c.lineWidth=flash?3:2;
 c.shadowColor='#a45cff';c.shadowBlur=flash?16:7;
 c.beginPath();c.moveTo(0,-height*.52);c.lineTo(width*.5,-height*.37);c.lineTo(width*.44,height*.10);
 c.quadraticCurveTo(width*.30,height*.38,0,height*.52);c.quadraticCurveTo(-width*.30,height*.38,-width*.44,height*.10);
 c.lineTo(-width*.5,-height*.37);c.closePath();c.fill();c.stroke();
 c.shadowBlur=0;c.globalAlpha*=.65;c.lineWidth=1.5;
 c.beginPath();c.moveTo(0,-height*.35);c.lineTo(0,height*.30);c.moveTo(-width*.27,-height*.10);c.lineTo(width*.27,-height*.10);c.stroke();c.restore();
}
function drawProjectile(key,l,z,age,reflected=false){const dep=z-S.z,p=perspective(dep),x=lx(l,dep),y=yy(dep)-65*p,h=(key.startsWith('boss')||key==='claw')?Math.max(44*Math.min(1,H/844),Math.min(H*.26,215)*p):Math.min(H*.18,145)*p;
 if(key==='claw'){const unit=h/145;c.save();c.translate(x,y);c.strokeStyle='#bb84eb';c.shadowColor='#190625';c.shadowBlur=10;c.lineWidth=Math.max(2.5,6*unit);for(let i=0;i<4;i++){c.beginPath();c.moveTo((i-1.5)*22*unit,h*.3);c.quadraticCurveTo((i-2)*28*unit,-h*.1,(i-.6)*22*unit,-h*.6);c.stroke();}c.restore();return;}
 if(key==='bossYellow'){const img=processed.bossYellow;if(!img)return;c.save();c.globalCompositeOperation='screen';for(let i=0;i<5;i++){const q=i/4-.5;c.globalAlpha=.65;c.drawImage(img,x+q*h*1.8-h*.35,y+q*q*h*.5-h*.25,h*.7,h*.5);}c.restore();return;}
 const img=processed[key];if(!img)return;const rect=crop(img);c.save();c.translate(x,y);if(key==='bossBlack')c.rotate(age*7);
 if(key==='shot4'){
  // Animate bands around a vertical axis; never rotate the whole cone in the screen plane.
  const cw=rect[2],ch=rect[3],bands=18;
  for(let i=0;i<bands;i++){const q=i/bands,dy=-h*.6+q*h,shift=Math.sin(age*32-q*12)*h*.035;c.drawImage(img,rect[0],rect[1]+ch*q,cw,ch/bands,shift-h*.45,dy,h*.9,h/bands+1);}
 }else{if(reflected)c.scale(1,-1);c.drawImage(img,...rect,-h*.5,-h*.5,h,h);}
 c.restore();
}
function paintEffect(key,index,x,y,w,h,alpha=1){const img=processed[key];if(!img)return;const cw=img.width/4,ch=img.height/2,i=C(index|0,0,7);c.save();c.globalCompositeOperation='screen';c.globalAlpha*=alpha*PLAYER_EFFECT_OPACITY;c.drawImage(img,i%4*cw+8,Math.floor(i/4)*ch+8,cw-16,ch-16,x-w/2,y-h/2,w,h);c.restore();}
// Reconstructed 4x2 sheets based on the extracted video graphics.
// Original PNG alpha is retained. Frames are blended to avoid hard pose changes.
const effectMixCanvas=document.createElement('canvas');effectMixCanvas.width=384;effectMixCanvas.height=512;
const effectMixContext=effectMixCanvas.getContext('2d');
function drawRedrawnEffect(ice,frame,x,ground,width,height,alpha,groundBand=0){
 const img=processed[ice?'redrawnIce':'redrawnFire'];if(!img)return;
 const f=C(frame,0,7),i=Math.floor(f),mix=f-i,ctx=effectMixContext;
 ctx.clearRect(0,0,384,512);ctx.globalCompositeOperation='lighter';
 // Blend premultiplied pixels on a transparent surface so opacity does not dip
 // halfway between frames (source-over on the scene makes the core too faint).
 const draw=(n,a)=>{if(a<=0)return;ctx.globalAlpha=a;ctx.drawImage(img,(n%4)*384,Math.floor(n/4)*512,384,512,0,0,384,512);};
 draw(i,1-mix);if(i<7)draw(i+1,mix);ctx.globalAlpha=1;
 c.save();c.globalAlpha*=alpha;
 if(groundBand){
  // Stretch only the rising column; ground rings retain their flattened perspective.
  const seam=ground-groundBand*100/192;
  c.drawImage(effectMixCanvas,0,0,384,320,x-width/2,seam-height,width,height);
  c.drawImage(effectMixCanvas,0,320,384,192,x-width/2,seam,width,groundBand);
 }else c.drawImage(effectMixCanvas,x-width/2,ground-height*.82,width,height);
 c.restore();
}
// Player effects retain 45% opacity so enemies remain visible.
const PLAYER_EFFECT_OPACITY=.45;
function spellGlow(x,y,r,ice,alpha=1){
 c.save();c.globalCompositeOperation='screen';c.globalAlpha*=alpha*PLAYER_EFFECT_OPACITY;
 const g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,ice?'#efffff':'#fffbd9');g.addColorStop(.19,ice?'#a9f4ff':'#ffe578');g.addColorStop(.48,ice?'#249fffbb':'#ff7200bb');g.addColorStop(1,ice?'#126aff00':'#ff300000');
 c.fillStyle=g;c.fillRect(x-r,y-r,r*2,r*2);c.restore();
}
function drawSpellProjectile(b){
 const z=b.z-S.z,p=perspective(z),x=lx(boltLane(b),z),y=yy(z);
 if(b.k===1||b.k===2){
  const ice=b.k===2,size=Math.max(58,(ice?190:225)*p);
  drawRedrawnEffect(ice,1+2*C(b.travel/b.range,0,1),x,y-12*p,size,size*1.33,.98);return;
 }
 const point=b.k===3?ultimatePoint(b):{x,y:y-75*p},size=Math.max(16,52*p)*(b.k===3?2:1),cy=point.y;
 const img=processed.bossIce;if(!img)return;
 // Source-over preserves the ice crystal details and the dark blue core.
 c.save();c.globalAlpha*=.9;c.translate(point.x,cy);c.rotate(b.age*1.6+(b.offset%2?-.18:.18));
 c.drawImage(img,-size/2,-size/2,size,size);c.restore();
}
function drawTemplateExplosion(f){
 const dep=f.z-S.z,p=perspective(dep),x=lx(f.l,dep),y=yy(dep),ice=f.k===2;
 const u=C(f.t/f.life,0,1),fade=1-C((u-(ice?.78:.65))/(ice?.22:.35),0,1);
 const frame=ice?(u<.22?4+2*u/.22:u<.68?6:6+C((u-.68)/.32,0,1)):(u<.25?4+2*u/.25:u<.48?6:6+C((u-.48)/.52,0,1));
 const radius=Math.max(42,Math.min(W,520)*.40*p);
 // Ground anchor stays fixed as the reconstructed impact grows and fades.
 const height=ice?radius*3.4:y+H*.18,width=ice?radius*3.4:radius*3.0;
 drawRedrawnEffect(ice,frame,x,y+radius*.05,width,height,fade,ice?0:radius*1.6);
}
function drawUltimateIceImpact(f){
 const img=frames.ultimateImpactIce?.[f.slot||0];if(!img)return;
 const boss=f.bossTarget,dep=(boss?boss.z:f.z)-S.z,p=perspective(dep);
 const h=boss?bossHeight(dep):Math.max(95,210*p),slot=f.slot||0;
 const x=lx(boss?(boss.displayLane??boss.l):f.l,dep)+(boss?f.scatter*h:(slot-1.5)*h*.18);
 const y=yy(dep)-(boss?h*(.86-slot*.23):h*(.25+(slot%2)*.16));
 const u=C(f.t/f.life,0,1),grow=.28+.72*(1-Math.pow(1-C(u/.22,0,1),3));
 const fade=1-C((u-.62)/.38,0,1),w=h*(boss?.48:.48)*grow,ih=w*img.height/img.width;
 c.save();c.globalAlpha*=.9*fade;c.drawImage(img,x-w/2,y-ih/2,w,ih);c.restore();
}
function drawSpellExplosion(f){
 if(f.k===3){drawUltimateIceImpact(f);return;}
 if(f.k===1||f.k===2){drawTemplateExplosion(f);return;}
 const dep=f.z-S.z,p=perspective(dep),x=lx(f.l,dep),y=yy(dep),ice=f.k===2||f.k===3,t=f.t,u=C(t/f.life,0,1),rise=C(t/.13,0,1),fade=1-C((u-.55)/.45,0,1);
 const radius=Math.max(42,Math.min(W,520)*.40*p),blast=radius*(.35+.85*C(t/.24,0,1));
 spellGlow(x,y-radius*.24,blast*1.3,ice,fade);
 c.save();c.globalCompositeOperation='screen';c.globalAlpha=PLAYER_EFFECT_OPACITY*fade;
 // Ground shockwave across the impact lanes.
 c.lineWidth=Math.max(2,7*p)*(1-u*.6);c.strokeStyle=ice?'#baffff':'#ffda75';c.beginPath();c.ellipse(x,y,blast*1.35,blast*.32,0,0,Math.PI*2);c.stroke();
 c.lineWidth=Math.max(1,3*p);c.strokeStyle=ice?'#53bfff':'#ff6a17';c.beginPath();c.ellipse(x,y,blast*1.62,blast*.39,0,0,Math.PI*2);c.stroke();
 if(f.k===1){
  // Straight upward pillar: height is screen-based so even the range-45 explosion exits the top.
  const top=y-(y+H*.20)*rise,height=y-top,half=radius*.60;
  // Ragged rising flame edges around a fixed vertical axis, rather than a solid beam.
  for(const [scale,color,opacity] of [[1.5,'#ff3700',.38],[1.05,'#ff7909',.8],[.65,'#ffd553',.9],[.24,'#fff6ce',.95]]){
   c.globalAlpha=PLAYER_EFFECT_OPACITY*fade*opacity;c.fillStyle=color;c.beginPath();
   for(let side=-1;side<=1;side+=2){for(let n=0;n<=36;n++){
    const q=side===-1?n/36:1-n/36,noise=.72+.22*Math.sin(q*47-t*27)+.14*Math.sin(q*103-t*43),edge=half*scale*noise;
    const xx=x+side*edge,yy0=y-height*q;if(side===-1&&n===0)c.moveTo(xx,yy0);else c.lineTo(xx,yy0);
   }}c.closePath();c.fill();
  }
  c.globalAlpha=PLAYER_EFFECT_OPACITY*fade*.8;c.fillStyle='#ffb633';
  for(let i=0;i<22;i++){const q=((i/22+t*.65)%1),side=i%2?1:-1,xx=x+side*half*(.8+.35*Math.sin(i*7.1)),yy0=y-height*q,r=half*(.10+.05*Math.sin(i));c.beginPath();c.moveTo(xx-r,yy0+r*2);c.quadraticCurveTo(xx-r*1.8,yy0,xx+side*r,yy0-r*7);c.quadraticCurveTo(xx+r,yy0,xx+r,yy0+r*2);c.closePath();c.fill();}
  spellGlow(x,y-radius*.15,radius*1.6,false,fade);
 }else if(ice){
  const height=Math.max(110,300*p)*rise;
  for(let i=0;i<13;i++){
   const q=(i-6)/6,xx=x+q*radius*1.1,tipY=y-height*(.5+.5*(1-Math.abs(q)))-Math.sin(i*4.7)*height*.12,spread=radius*.12;
   const g=c.createLinearGradient(xx,y,xx,tipY);g.addColorStop(0,'#0875e4aa');g.addColorStop(.6,'#55d9ff');g.addColorStop(1,'#f1ffff');c.fillStyle=g;
   c.beginPath();c.moveTo(xx-spread,y);c.lineTo(xx+q*radius*.2,tipY);c.lineTo(xx+spread,y-radius*.05);c.closePath();c.fill();
  }
  paintEffect('vfxIce',5+Math.min(2,Math.floor(u*3)),x,y-height*.4,radius*2.4,height*1.35,fade);
 }else paintEffect('vfxFire',4+Math.min(3,Math.floor(u*4)),x,y-radius*.9,radius*2.5,radius*2.6,fade);
 // Deterministic particles do not consume the combat random sequence.
 for(let i=0;i<24;i++){
  const a=i*2.39996,speed=.5+(i%7)/8,xx=x+Math.cos(a)*radius*speed*rise*(1+u),yy0=y-radius*.3-Math.abs(Math.sin(a))*radius*2.4*rise+u*u*radius*.3;
  c.globalAlpha=PLAYER_EFFECT_OPACITY*fade*(1-u*.65);c.fillStyle=ice?'#d1ffff':i%3?'#ffdc73':'#fffbdc';c.beginPath();c.arc(xx,yy0,Math.max(1.4,3.5*p)*(1-u*.5),0,Math.PI*2);c.fill();
 }
 c.restore();
}
function drawBolts(includeWorld=true){
 if(includeWorld){for(const b of S.bolts)drawSpellProjectile(b);for(const f of S.impacts)drawSpellExplosion(f);}
 if(S.skill){
  const a=S.skill,release=SPELL.skill[a.k-1].release;
  if(a.t<release){const h=playerHeight();drawRedrawnEffect(a.k===2,C(a.t/release,0,1),playerX(),playerY()-h*.42,h*.6,h*.8,.95);}
 }
}
function drawParalysisMark(x,y,p){
 const img=processed.statusParalysis;if(!img)return;
 const size=Math.max(16,24*p),left=x-25*p;
 c.save();c.globalAlpha=1;c.drawImage(img,...crop(img),left,y-size,size,size);c.restore();
}
function drawUltimateDiamondDust(x,y,h){
 const img=processed.ultimateDiamondDust;if(!S.ultimate||!img)return;
 const t=S.ultimate.t,fade=C(Math.min(t/.1,(ULTIMATE.duration-t)/.15),0,1);
 // Two slowly drifting crystal layers wrap the horse without hiding its silhouette.
 for(let i=0;i<2;i++){
  const drift=Math.sin(t*3.5+i*Math.PI)*h*.025,pulse=1+.025*Math.sin(t*5+i*2);
  c.save();c.translate(x+drift,y-h*.52-Math.sin(t*2+i)*h*.025);
  c.rotate(-.58+Math.sin(t*2+i)*.025);c.scale(i?-1:1,1);
  c.globalCompositeOperation='screen';c.globalAlpha=fade*(i?.36:.8);
  const size=h*(i?1.0:1.23)*pulse;c.drawImage(img,-size/2,-size/2,size,size);c.restore();
 }
}

function draw(){syncSpellAudio();c.setTransform(cv.width/W,0,0,cv.height/H,0,0);c.globalAlpha=1;c.globalCompositeOperation='source-over';placeNotice();c.clearRect(0,0,W,H);bg();if(!S)return;c.save();if(S.shake)c.translate(Math.sin(S.t*110)*S.shake*15,Math.cos(S.t*93)*S.shake*10);redGround();frontline();
 const entities=[...S.en.filter(e=>(!e.dead||e.fade>0)&&e.z-S.z>-2&&e.z-S.z<100).map(e=>({kind:'enemy',z:e.z,value:e})),...S.bolts.map(e=>({kind:'bolt',z:e.z,value:e})),...S.impacts.map(e=>({kind:'impact',z:e.z,value:e})),...S.shots.map(e=>({kind:'shot',z:e.z,value:e}))].sort((a,b)=>b.z-a.z);
 for(const item of entities){const e=item.value;if(item.kind==='bolt'){drawSpellProjectile(e);continue;}if(item.kind==='impact'){drawSpellExplosion(e);continue;}if(item.kind==='shot'){drawProjectile(e.k,e.l,e.z,e.age,e.reflected);continue;}const z=e.z-S.z,p=perspective(z),h=e.boss?bossHeight(z):D[e.t].h*p*Math.min(1,H/844)*.77,x=lx(e.boss?e.displayLane:e.l,z),y=yy(z);c.save();const bossDefeatFade=e.boss&&e.dead&&S.cinematic?.kind==='victory'?1-E(C(S.cinematic.t/.9,0,1)):null;c.globalAlpha=bossDefeatFade??(e.dead?e.fade/.4:e.fl?.6:1);if(e.boss){c.translate(x,y);drawBossSprite(e,h);}else fullSprite(e.t,x,y,h);c.restore();if(e.shield||e.shieldFlash)enemyGuardShield(x,y,h,e.shieldFlash);if(!e.dead){c.fillStyle='#10202c';c.fillRect(x-25*p,y-h-10,50*p,4);c.fillStyle='#f6c977';c.fillRect(x-25*p,y-h-10,50*p*e.hp/e.max,4);if(e.paralysis>0)drawParalysisMark(x,y-h-16,p);}
 const a=e.action;if(e.boss&&a?.k===2&&a.age>=.2){for(const ev of a.events){if(ev.done)continue;const q=C((a.age-.2)/.3,0,1),lane=e.displayLane+(ev.l-e.displayLane)*q;const iz=e.z-S.z,xx=lx(lane,iz),yy0=yy(iz)-h*(.7+.4*q),sz=Math.max(42*Math.min(1,H/844),h*.42);c.save();c.translate(xx,yy0);c.rotate(a.age*7);c.drawImage(processed.bossBlack,...crop(processed.bossBlack),-sz/2,-sz/2,sz,sz);c.restore();}}
 }
 drawBolts(false);const h=playerHeight(),x=playerX(),y=playerY();
 if(S.defeat)spriteFrame('heroFall',Math.min(7,Math.floor(S.defeat.t/.12)),x,y,h);else spriteFrame('heroRun',S.speed>.05?Math.floor(((S.runPhase/(Math.PI*2))%1+1)%1*8):0,x,y,h);
 drawUltimateDiamondDust(x,y,h);
 if(S.guard||S.guardImpact)shield(x,y,h,S.guardImpact?1:.8);drawEffects();c.restore();if(S.hit){c.fillStyle='#ff50331c';c.fillRect(0,0,W,H);}if(S.ultimate&&S.ultimate.t<ULTIMATE.cutin)drawUltimateCutin(S.ultimate.t);drawCinematic();
}
function drawUltimateCutin(t){
  // Stage 1 frame: cyan slash enters, a narrow diagonal character cut follows,
  // then the matching cyan exit slash closes the cut-in.
  const enter=E(C((t-.06)/.12,0,1)),exit=E(C((t-.56)/.16,0,1));
  c.save();c.fillStyle='rgba(2,5,14,'+(.77*Math.min(1,t/.08)*(1-exit))+')';c.fillRect(0,0,W,H);
  const cy=H*.49,bandH=H*.135,tilt=H*.115,slide=(1-enter)*W-exit*W*.45;
  c.save();c.translate(slide,0);c.beginPath();c.moveTo(-W*.12,cy-bandH*.12);c.lineTo(W*1.12,cy-bandH*.12-tilt);c.lineTo(W*1.12,cy+bandH*.78-tilt*.20);c.lineTo(-W*.12,cy+bandH*.78);c.closePath();c.clip();
  c.fillStyle='#0a111c';c.fillRect(-W,0,W*3,H);
  const img=processed.heroBase;
  if(img){const width=W*1.18*(1+.035*t/.72),height=width*400/490;c.drawImage(img,110,150,490,420,W*.50-width*.51,cy-height*.34,width,height);}
  c.restore();
  function slash(progress,reverse){
    if(progress<=0||progress>=1)return;
    c.save();c.globalAlpha=Math.sin(Math.PI*progress);c.translate((progress*2-1)*W*(reverse?-1:1),0);c.fillStyle='#c4ffff';c.shadowColor='#75eaff';c.shadowBlur=18;
    for(let i=0;i<3;i++){const y=H*(.31+i*.22);c.beginPath();c.moveTo(-W*.65,y+H*.12);c.bezierCurveTo(W*.06,y-H*.05,W*.68,y-H*.12,W*1.45,y-H*.10);c.bezierCurveTo(W*.92,y-H*.13,W*.38,y+H*.03,-W*.65,y+H*.12);c.closePath();c.fill();c.beginPath();c.moveTo(W*.15,y+H*.025);c.lineTo(W*.52,y-H*.055);c.lineTo(W*.34,y+H*.006);c.closePath();c.fill();}
    c.restore();
  }
  slash(t/.20,false);slash((t-.54)/.18,true);c.restore();
}
function drawCinematic(){
  if(!S.cinematic)return;const {kind,t}=S.cinematic;c.save();
  if(kind==='entry'){
    if(t<1.5)cinematicRibbon('道中クリア','BOSSへ',H*.29,Math.min(1,t/.2,(1.5-t)/.25));
    else if(t<3.6){
      const a=Math.min(1,(t-1.5)/.35);c.fillStyle='rgba(30,5,8,'+(.32*a)+')';c.fillRect(0,0,W,H);
      c.fillStyle='#361319';c.fillRect(0,0,W,H*.10*a);c.fillRect(0,H*(1-.10*a),W,H*.10*a);
      cinematicRibbon('BOSS APPROACHING','強敵の気配',H*.38,a);
    }else{
      const q=C((t-3.6)/2,0,1),img=processed.bossEntrance;
      c.fillStyle='rgba(8,16,22,.75)';c.fillRect(0,0,W,H);
      if(img&&img.width){const rect=crop(img),h=H*(.53-.10*E(q)),w=h*rect[2]/rect[3];c.drawImage(img,...rect,W/2-w/2,H*.62-h,w,h);}
      cinematicRibbon(BOSS_PRESENTATION.name,'',H*.74,Math.min(1,(t-3.6)/.3));
      if(t>5.65){c.fillStyle='rgba(249,241,216,'+(C((t-5.65)/.55,0,1)*.88)+')';c.fillRect(0,0,W,H);}
    }
  }else{
    if(t>=1.6)cinematicRibbon('QUEST CLEAR','クエストクリア',H*.40,Math.min(1,(t-1.6)/.4));
    if(t>3.6){c.fillStyle='rgba(247,236,210,'+C((t-3.6)/.8,0,1)+')';c.fillRect(0,0,W,H);}
  }
  c.restore();
}
function highScore(){try{return Number(localStorage.getItem('eta.spell.trial.score'))||0;}catch{return 0;}}
function saveHighScore(n){try{localStorage.setItem('eta.spell.trial.score',String(n));}catch{}}
function drawDetailPreview(){const target=$('#detailArt');if(!target||!processed.heroBase)return;target.width=1024;target.height=1536;target.getContext('2d').drawImage(processed.heroBase,0,0,1024,1536);}
function openSpellDetails(){$('#titlePanelHeading').textContent='呪文ステージ';$('#titlePanelBody').innerHTML='<div class="hero-detail"><canvas id="detailArt"></canvas><div class="detail-text"><p>炎と氷の呪文で戦うステージ。</p><table><tr><th>種類</th><th>技名</th><th>与ダメージ・効果</th></tr><tr><td>スキル</td><td>速炎球</td><td>2</td></tr><tr><td>スキル</td><td>氷塊球</td><td>2</td></tr><tr><td>奥義</td><td>四肢炎弾</td><td>2×4発・マヒ80%（3秒）</td></tr><tr><td>バリア</td><td>呪文反射</td><td>反射3回・回復なし</td></tr></table></div></div>';$('#titlePanel').classList.remove('hide');drawDetailPreview();}
$('#gameHelp').onclick=()=>{$('#titlePanelHeading').textContent='操作';$('#titlePanelBody').innerHTML='<p>左右スワイプ：レーン移動<br>上スワイプ：前進<br>撃破後0.5秒以内の上スワイプ：スーパーダッシュ<br>下スワイプ：後退</p><p>反射アイコンは押している間だけ有効。反射時に1回消費します。物理攻撃には無効です。</p><p>スキル・奥義は新しく押した攻撃を優先し、直前のモーションと飛行中の弾を消します。</p>';$('#titlePanel').classList.remove('hide');};
$('#ranking').onclick=()=>{$('#titlePanelHeading').textContent='試作版の設定';$('#titlePanelBody').innerHTML='<p>既存公開版と独立したテスト版です。ランキングへの送信はありません。BGM：氷炎の彼方へ。スキル発動・着弾・呪文反射・奥義発動に専用効果音を使用。</p><p>仮設定：ボス技1の溜め0.38秒、技3の横薙ぎ0.6秒、道中の弾速60、反射弾速120・射程45。技3の射程は確認済みの9です。</p><p>速炎球は射程45・弾速150、氷塊球は射程20・弾速50。動画を参考に透過・発光・形成と消失を調整しています。完全なフレーム一致と実機上の見え方は未検証です。</p><button class="btn big" id="bossTest">ボス戦からテスト</button>';$('#titlePanel').classList.remove('hide');$('#bossTest').onclick=()=>{if(!forestReady())return;reset();S.en=[];S.phase='boss';S.run=1;S.roadTime=0;revealBoss();$('#titlePanel').classList.add('hide');$('#intro').classList.add('hide');};};
$('.b-title img').src='assets/portrait.png';$('.b-title img').onclick=openSpellDetails;$('.b-title img').alt='呪文ステージの説明を表示';$('.b-title img').setAttribute('role','button');$('.b-title img').tabIndex=0;$('.b-title img').onkeydown=e=>{if(e.key==='Enter'||e.key===' ')openSpellDetails();};$('.b-title span').textContent='道中60体・ボス戦あり\nキャラクターアイコンをタップすると説明が見れます';
$('#guard').insertAdjacentHTML('beforeend','<span id="barrierCount">3</span>');
// Decode pixels before drawing into offscreen canvases; metadata alone is insufficient.
for(const key of Object.keys(src))pending.push((async()=>{
 const img=im[key];
 if(typeof img.decode==='function')await img.decode();
 else await new Promise((resolve,reject)=>{if(img.complete&&img.naturalWidth)resolve();else{img.onload=resolve;img.onerror=()=>reject(new Error(key));}});
 if(!img.naturalWidth)throw new Error('Empty image: '+key);
 prepareImage(key,img);
})());
prepareStart();
// Read-only state/testing hooks only when explicitly requested by the test harness.
if(new URLSearchParams(location.search).has('qa'))window.SpellQA={get state(){return S;},config:SPELL,reset,fire,fireUltimate,step,hit,roster,updateShots,updateBoss,revealBoss,makeBolt,updateBolts,explodeBolt,draw,accelerate,depth,lane,beginRun,runForward,updateDepth,adv,bossWarningAreas,syncSpellAudio,ready:Promise.all(pending)};

reset();function loop(t){let dt=last?Math.min(.033,(t-last)/1000):0;last=t;step(dt);draw();requestAnimationFrame(loop)}requestAnimationFrame(loop)})();
