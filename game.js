(()=>{const $=s=>document.querySelector(s),cv=$('#game'),c=cv.getContext('2d');let W,H,last=0,S,combatSeed=17319;function random(){combatSeed=(Math.imul(combatSeed,1664525)+1013904223)>>>0;return combatSeed/4294967296}const C=(v,a,b)=>Math.max(a,Math.min(b,v)),R=(a,b)=>a+random()*(b-a),RI=(a,b)=>Math.floor(R(a,b+1)),E=t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;const D={slime:{hp:2,d:1,r:0,h:205},skeleton:{hp:3,d:2,r:0,h:220},mage:{hp:3,d:2,r:1,h:228},bonobo:{hp:4,d:4,r:0,h:245},dragon:{hp:4,d:3,r:1,h:215},boss:{hp:40,d:3,r:0,h:300}},im={};const src={heroBlade:'assets/hero-blade-v2.webp',normalSlash:'assets/hero-normal-slash-v1.webp',bossFlame:'assets/boss-horizontal-flame-v2.webp',bossOverhead:'assets/boss-slide-v3.webp',bossSkills:'assets/boss-skills-contact-v6.webp',heroDefeat:'assets/hero-defeat-v2.webp',ultimateFace:'assets/hero-ultimate-cutin-v1.png',boss:'assets/boss-warlord.png',fireDragon:'assets/boss-fire-dragon-v2.webp',hero:'assets/hero.webp',slime:'assets/suraimu.png',skeleton:'assets/がいこつ.png',mage:'assets/mahoutukai.png',bonobo:'assets/bonobo.png',dragon:'assets/minidoragonn.png',body:'hero_body.png.png',upper:'hero_arm1.png',fore:'hero_arm2.png',hand:'hero_hand.png',shoulder:'hero_shoulder.png',sword:'assets/hero_sword_motion.png',forestTrees:'assets/forest-trees-gpt-v1.9d6d5503daf1.webp',forestGround:'assets/forest-ground-gpt-v1.095875d20497.webp',poses:'assets/hero-motion-sheet.png',waterSheet:'assets/water-slash-gpt-v3.webp',earthSheet:'assets/earth-slash-gpt-v1.webp',heroSkills:'assets/hero-skills-gpt-v1.webp',heroRun:'assets/hero-run-female-v2.png',heroGuard:'assets/hero-guard-gpt-v1.webp',guardImpact:'assets/guard-impact-gpt-v1.webp',dashTrail:'assets/superdash-gpt-v1.webp'};for(const k in src){im[k]=new Image;im[k].src=src[k]}
function size(){const v=window.visualViewport;W=v?v.width:innerWidth;H=v?v.height:innerHeight;const frame=$('#gameViewport');frame.style.width=W+'px';frame.style.height=H+'px';frame.style.top=(v?v.offsetTop:0)+'px';frame.style.left=(v?v.offsetLeft:0)+'px';let d=Math.min(devicePixelRatio||1,2);cv.width=W*d;cv.height=H*d;c.setTransform(d,0,0,d,0,0)}addEventListener('resize',size);if(window.visualViewport){window.visualViewport.addEventListener('resize',size);window.visualViewport.addEventListener('scroll',size)}size();function sh(a){for(let i=a.length-1;i;i--){let j=RI(0,i);[a[i],a[j]]=[a[j],a[i]]}return a}function mk(t,z){return{t,z,l:RI(0,2),hp:D[t].hp,max:D[t].hp,dead:0,cd:R(1.8,3.8),tell:0,mv:R(.7,2),fl:0}}function roster(){let a=[],e=sh([...Array(3).fill('slime'),...Array(3).fill('skeleton')]),r=sh([...Array(6).fill('slime'),...Array(6).fill('skeleton'),...Array(6).fill('mage'),...Array(3).fill('bonobo'),...Array(3).fill('dragon')]);[...e,...r,...sh([...Array(9).fill('slime'),...Array(9).fill('skeleton'),...Array(6).fill('mage'),...Array(3).fill('bonobo'),...Array(3).fill('dragon')])].forEach((t,i)=>{const group=Math.floor(i/6),row=Math.floor(i%6/3);const enemy=mk(t,18+group*ENEMY_GROUP_GAP+row*ENEMY_ROW_GAP);enemy.l=i%3;enemy.group=group;a.push(enemy)});return a}function reset(){$('#gameViewport').classList.remove('cinematic');combatSeed=17319;S={run:0,pause:0,t:0,phase:'road',defeat:null,cinematic:null,roadTime:null,bossStartedAt:null,hp:20,dmg:0,dealtDamage:0,ultimateCharge:90,ultimate:null,overkill:0,z:0,l:1,guard:0,guardPose:0,guardImpact:0,introRun:0,ch:[4,4],fr:[0,0],skill:null,fin:0,dashUntil:-1,dash:null,boost:0,normalAttack:null,norm:0,en:roster(),shots:[],ptr:null,hit:0,pd:0,pt:0,notice:null,ll:1,fx:[],waves:[],waterFx:[],earthFx:[],combo:0,comboTime:0,shake:0,speed:0,runPhase:0,retreat:0};hideNotice();ui()}function ui(){updateUltimateUI();const hpRatio=C(S.hp/20,0,1),hpColor='hsl('+(120*hpRatio)+',100%,50%)';$('#hp').textContent=Math.ceil(C(S.hp,0,20))+'/20';$('#hpf').style.width=(hpRatio*100)+'%';$('#hpf').style.background=hpColor;$('#hpbar').style.background=hpRatio===0?'#ff0000':'#17212b';$('#hpbar').style.borderColor=hpColor;$('#time').textContent=S.t.toFixed(1);$('#fin').textContent=S.fin;const boss=S.en.find(e=>e.boss);$('#bossHud').classList.toggle('hide',S.phase!=='boss'||!!S.cinematic);$('#bossHp').textContent=boss?Math.max(0,boss.hp)+' / '+boss.max:'';for(let i=0;i<2;i++){
  // The original five charges remain unchanged; show partial recharge too.
  const fill=C((S.ch[i]+(S.ch[i]<4?S.fr[i]:0))/4,0,1);
  $('#g'+(i+1)).style.strokeDashoffset=String(100*(1-fill));
  const button=$('#s'+(i+1));
  if(button._charges!==S.ch[i]){
    button._charges=S.ch[i];
    button.setAttribute('aria-label',(i===0?'水波斬':'大陸斬')+'：残り'+S.ch[i]+'回');
    button.setAttribute('aria-disabled',String(S.ch[i]<1));
  }
}}// pd/pt are player depth in the same world units as enemy.z and stage S.z.
const HORIZON=.26,GROUND_SPAN=.49,RUN_SPEED=9;
const ENEMY_ROW_GAP=3,ENEMY_GROUP_GAP=32;
// One dash covers one pack interval, then returns to ordinary running.
const SUPERDASH_DISTANCE=ENEMY_GROUP_GAP,SUPERDASH_SPEED=42;
// One footfall is half the existing run cycle. Each swipe adds that much travel.
const RUN_PHASE_PER_UNIT=1.35,SWIPE_STEP_DISTANCE=Math.PI/RUN_PHASE_PER_UNIT,SWIPE_DECAY=.12;
const MAX_DEPTH=(GROUND_SPAN/(.46-HORIZON)-1)/.115, FRONT_GAP=.7,BOSS_DEPTH=9,BOSS_SLASH_DEPTH=MAX_DEPTH/4;
// Reference framing: horizon 26%, running feet 58%, body above center.
const RUN_DEPTH=(GROUND_SPAN/(.58-HORIZON)-1)/.115,DASH_DEPTH=(GROUND_SPAN/(.53-HORIZON)-1)/.115;
function distance(e){return e.z-S.z-S.pd}
function front(){let z=Infinity;for(const e of S.en)if(!e.dead)z=Math.min(z,e.z);return z}
function depthLimit(){return C(front()-S.z-FRONT_GAP,0,MAX_DEPTH)}
function updateDepth(dt){
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
function sound(kind,type){if(window.GameSFX)window.GameSFX.play(kind,type)}function hurt(n){if(S.defeat)return;if(S.guard){S.guardImpact=.38;sound('guardBlock');return;}S.combo=0;S.shake=.18;burst(S.l,S.z+S.pd,'#ff7563',12);sound('hurt');S.hp-=n;S.dmg+=n;S.hit=.15;if(S.hp<=0)beginDefeat()}function hit(e,n,sk,source=sk?'skill':'normal'){if(e.dead)return;const dealt=Math.min(Math.max(0,e.hp),Math.max(0,n));S.dealtDamage+=dealt;if(source==='normal'||source==='skill')S.ultimateCharge=C(S.ultimateCharge+dealt,0,ULTIMATE.capacity);S.overkill+=Math.max(0,n-Math.max(0,e.hp));sound('hit',e.t);e.hp-=n;e.fl=.12;S.combo++;S.comboTime=2;S.fx.push({kind:'number',l:e.l,z:e.z,n:n,t:0,life:.8,color:sk?'#fff079':'#ffffff'});burst(e.l,e.z,sk?'#b5f7ff':'#ffffff',9);S.shake=sk?.08:.035;if(e.tell>0&&!e.boss){e.tell=0;e.cd=R(1.8,3.8)}if(e.hp<=0){e.dead=1;e.fade=.4;burst(e.l,e.z,'#ffdfa0',18);sound('down',e.t);S.dashUntil=S.t+.5;if(sk)S.fin++}}function hideNotice(){const n=$('#actionName');n.style.opacity='0';n.classList.remove('moveArrow');if(S)S.notice=null}
// Compact skill label, styled to match the forest HUD.
function notice(text,seconds,arrow=false){
  const plate=text==='水波斬'||text==='大陸斬';
  S.notice={text,left:seconds,total:seconds,arrow,plate};const n=$('#actionName');
  const ultimatePlate=text==='渾身のストラッシュ';n.classList.toggle('ultimate-nameplate',ultimatePlate);
  n.classList.toggle('nameplate',plate);n.classList.toggle('moveArrow',arrow);
  n.style.width='';n.style.height='';
  if(ultimatePlate){n.innerHTML='<span class="ultimate-title">渾身のストラッシュ</span>';}else if(plate){
    n.innerHTML='<span class="plaque-name">'+text+'</span>';
  }else n.textContent=text;
  n.style.opacity='1';placeNotice();
}
function noticePosition(){return {x:playerX(),y:Math.max(88,playerY()-playerHeight()*1.36-36)}}
function placeNotice(){
  if(!S.notice)return;const state=S.notice,n=$('#actionName'),pos=noticePosition(),age=state.total-state.left;
  if(state.text==='渾身のストラッシュ'){n.style.left=W/2+'px';n.style.top=Math.max(105,Math.min(145,H*.18))+'px';n.style.transform='translate(-50%,-50%)';n.style.opacity=String(Math.min(1,age/.05,state.left/.18));return;}
  n.style.left=pos.x+'px';n.style.top=pos.y+'px';
  const entrance=C(age/.12,0,1),scale=state.plate?.97+.03*E(entrance):1;
  const lift=state.plate?(1-E(entrance))*3:0;
  n.style.transform='translate(-50%,calc(-100% + '+lift+'px)) scale('+scale+')';n.style.transformOrigin='50% 100%';
  n.style.opacity=String(Math.min(1,age/.07,state.left/.13));
}
function flash(button){button.classList.remove('flash');void button.offsetWidth;button.classList.add('flash')}
const ULTIMATE={capacity:90,damage:10,duration:1.4866666667,cutin:.72,windup:.84,travel:.2133333333};
function updateUltimateUI(){
  const value=C(S.ultimateCharge,0,ULTIMATE.capacity),button=$('#ultimate');
  $('#ultimateFill').style.strokeDashoffset=String(100*(1-value/ULTIMATE.capacity));
  button.setAttribute('aria-label','奥義・渾身のストラッシュ：ゲージ'+Math.floor(value)+'/'+ULTIMATE.capacity);
  button.setAttribute('aria-disabled',String(value<ULTIMATE.capacity));
}
function fireUltimate(){
  if(!S.run||S.pause||S.cinematic||S.skill||S.ultimateCharge<ULTIMATE.capacity||S.ultimate)return false;
  S.ultimateCharge=0;S.guard=0;S.normalAttack=null;
  S.ptr=null;S.dash=null;S.boost=0;S.ultimate={t:0,origin:S.z+S.pd,far:S.z+45,seen:new Set()};hideNotice();sound('ultimateCutin',0);updateUltimateUI();return true;
}
function updateUltimate(dt){
  const a=S.ultimate;if(!a)return;a.t+=dt;
  const progress=C((a.t-ULTIMATE.windup)/ULTIMATE.travel,0,1);
  if(progress>0){
    if(!a.fired){a.fired=true;notice('渾身のストラッシュ',1.15);sound('ultimateFlight');}
    const front=a.origin+(a.far-a.origin)*progress;
    for(const e of S.en){
      if(e.dead||a.seen.has(e)||e.z<a.origin-.1||e.z>a.far||e.z>front)continue;
      a.seen.add(e);hit(e,ULTIMATE.damage,1,'ultimate');
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
  const a=S.ultimate;if(!a)return;
  if(a.t<ULTIMATE.cutin){drawUltimateCutin(a.t);return;}
  const age=a.t-ULTIMATE.windup;if(age<0)return;
  const p=C(age/ULTIMATE.travel,0,1),fade=1-C((age-ULTIMATE.travel)/.10,0,1);
  if(fade<=0)return;
  const x=W*.5,y=H*1.04+(H*(HORIZON+.008)-H*1.04)*p;
  const width=W*(.58-.51*p),rise=H*(.065-.053*p),thickness=H*(.016-.012*p);
  c.save();c.translate(x,y);c.globalCompositeOperation='lighter';
  function edge(offset,alpha){
    c.save();c.translate(0,offset);c.globalCompositeOperation='source-over';c.globalAlpha=alpha*fade;
    c.beginPath();c.moveTo(-width,rise*.35);c.quadraticCurveTo(0,-rise*1.6,width,-rise*.35);
    c.quadraticCurveTo(0,-rise*.48+thickness,-width,rise*.35);c.closePath();
    const g=c.createLinearGradient(0,-rise,0,thickness);g.addColorStop(0,'#f9edff');g.addColorStop(.35,'#efbdff');g.addColorStop(1,'#922bff');
    c.fillStyle=g;c.shadowColor='#ad45ff';c.shadowBlur=12*(1-p)+3;c.fill();
    c.strokeStyle='#fff6ff';c.lineWidth=Math.max(1,3*(1-p));c.beginPath();c.moveTo(-width,rise*.35);c.quadraticCurveTo(0,-rise*1.6,width,-rise*.35);c.stroke();c.restore();
  }
  // Short trailing edges travel with the blade, never tethered to the screen rear.
  edge(thickness*1.3,.15);edge(thickness*.6,.28);edge(0,1);
  c.globalAlpha=fade*.9;c.strokeStyle='#ffe28a';c.lineWidth=Math.max(1,2*(1-p));
  for(let i=0;i<4;i++){const dx=width*(-.72+i*.48);c.beginPath();c.moveTo(dx,-rise*.15);c.lineTo(dx+width*.08,-rise*.5);c.lineTo(dx+width*.045,-rise*.08);c.stroke();}
  c.restore();
}
function fire(k){
  if(!S.run||S.pause||S.cinematic||S.ultimate||S.ch[k-1]<1)return;
  if(S.skill&&S.skill.t<S.skill.d*.5-1e-9)return;
  if(S.skill&&!S.skill.done&&S.skill.waterVisual)S.waterFx=S.waterFx.filter(f=>f!==S.skill.waterVisual);
  S.guard=0;S.normalAttack=null;S.ch[k-1]--;S.skill={k,l:S.l,t:0,d:k===1?.68:.82,done:0};
  sound(k===1?'waterStart':'continentStart');
  notice(k===1?'水波斬':'大陸斬',k===1?.68:.82);
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
  adv(RUN_SPEED*dt+extra);S.boost=Math.max(0,S.boost-extra);
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
  S.roadTime=S.t;S.phase='bossIntro';lockCinematic('entry');
}
function revealBoss(){
  const boss=mk(BOSS_PRESENTATION.image,S.z+BOSS_DEPTH);
  Object.assign(boss,{boss:true,hp:40,max:40,l:1,displayLane:1,cd:1.4,mv:2,action:null,attackCount:0});S.en.push(boss);
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
    if(scene.t>=6.2){S.phase='boss';S.bossStartedAt=S.t;S.cinematic=null;$('#gameViewport').classList.remove('cinematic');}
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
function bossMove(e){const lane=e.displayLane??e.l??1,depth=C(e.z-S.z,9,15);
 return {t:0,fromLane:lane,fromDepth:depth,target:[bossRange(0,2),bossRange(9,15)],duration:bossRange(1.4,3.8),stride:bossRange(.52,.86)};
}
function resetBossSkillTimers(e){e.wideCd=bossRange(1.1,4.0);e.dragonCd=bossRange(1.1,4.0);}
function updateBoss(e,dt){
  // A stable center-stage position (feet ~50% of screen height).
  if(e.recover){e.recover.age+=dt;if(e.recover.age>=.22)e.recover=null;}
  const beforeMove=e.z,centerZ=S.z+BOSS_DEPTH;
  if(!e.patrol)e.patrol=bossMove(e);
  const p=e.patrol,target=p.target,duration=p.duration;
  // Each deliberate footstep has a planted pause and a short weight-transfer phase.
  const oldStep=e.stepClock||0,newStep=oldStep+(e.action?0:dt/p.stride);
  const progress=t=>Math.floor(t)+C(((t%1)-.22)/.40,0,1);
  p.t=Math.min(duration,p.t+(progress(newStep)-progress(oldStep))*p.stride);e.stepClock=newStep;
  const foot=newStep%1;e.stepFrame=(Math.floor(newStep)%2)*3+(foot<.22?0:foot<.62?1:2);
  const q=p.t/duration,oldLane=e.displayLane??p.fromLane;
  e.displayLane=p.fromLane+(target[0]-p.fromLane)*q;e.l=Math.round(e.displayLane);
  e.z=centerZ+(p.fromDepth-BOSS_DEPTH)+(target[1]-p.fromDepth)*q;
  const movement=e.z-beforeMove,lateral=e.displayLane-oldLane;e.moveActive=Math.abs(movement)+Math.abs(lateral)>1e-6;e.backstepActive=movement>1e-6;
  e.backstepPhase=e.stepFrame/6;
  if(p.t>=duration)e.patrol=bossMove(e);
  if(e.wideCd===undefined)e.wideCd=bossRange(1.1,4.0);
  if(e.dragonCd===undefined)e.dragonCd=bossRange(1.1,4.0);
  e.wideCd-=dt;e.dragonCd-=dt;
  if(e.action){
    const a=e.action;if(a.kind==='wide'&&a.targetZ===undefined)a.targetZ=e.z-FRONT_GAP-BOSS_SLASH_DEPTH/2;a.age+=dt;e.tell=a.kind==='normal'?0:Math.max(0,a.impact-a.age);
    if(!a.done&&a.age>=a.impact){
      a.done=true;
      if(a.kind==='dragon'){S.shots.push({kind:'fireDragon',l:a.l,z:e.z,originLane:e.displayLane??e.l,originZ:e.z,d:4,t:'boss',age:0});sound('shot','dragon');}
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
    resetBossSkillTimers(e);e.action={kind:'wide',l:1,targetZ:e.z-FRONT_GAP-BOSS_SLASH_DEPTH/2,age:0,impact:.38,duration:.76,done:false};e.tell=.38;e.attackCount++;return;
  }
  if(e.dragonCd<=0){
    resetBossSkillTimers(e);e.action={kind:'dragon',l:S.l,age:0,impact:.38,duration:.76,done:false};e.tell=.38;e.attackCount++;return;
  }
  // Contact alone never hurts the player; only skill impacts deal damage.
  e.tell=0;
}
// Blend only short neighboring poses; cover large recovery transitions with local flames.
function bossVisual(e){
  const a=e.action;
  if(!a)return {sheet:im.bossOverhead,frame:((e.stepClock||0)*4)%8,next:null,mix:0};
  // Upper row: blade meets the ground in frame 3. Lower row: follow-through in frame 8.
  const base=a.kind==='dragon'?0:4;
  const pace=a.impact/.5;
  const times=a.kind==='dragon'?[0,a.impact-.20*pace,a.impact,a.impact+.16*pace]:[0,a.impact-.30*pace,a.impact-.14*pace,a.impact];
  let i=0;while(i<3&&a.age>=times[i+1])i++;
  const mix=i<3?C((a.age-(times[i+1]-.045))/.045,0,1):0;
  return {sheet:im.bossSkills,frame:base+i,next:i<3?base+i+1:null,mix};
}
function drawBossFrame(sheet,frame,h,alpha=1){
  if(!sheet?.complete||!sheet.naturalWidth||alpha<=0)return;
  if(sheet===im.bossSkills){
    // Crop the supplied contact sheet without repainting the warrior. Extra space
    // below the third pose preserves the blade's ground-contact flame.
    const poses=[
      [0,0,400,512,192,503],[400,0,368,512,176,505],
      [768,128,400,416,192,380],[1168,144,368,384,176,365],
      [0,512,400,512,192,497],[400,528,368,496,176,468],
      [768,576,400,448,192,412],[1168,576,368,448,176,416]
    ];
    const [sx,sy,sw,sh,ax,ay]=poses[frame],scale=h/512;
    c.save();c.globalAlpha*=alpha;c.drawImage(sheet,sx,sy,sw,sh,-ax*scale,-ay*scale,sw*scale,sh*scale);c.restore();return;
  }
  const cw=sheet.naturalWidth/4,ch=sheet.naturalHeight/2,w=h*cw/ch;
  const sx=frame%4*cw,sy=Math.floor(frame/4)*ch;
  c.save();c.globalAlpha*=alpha;
  c.drawImage(sheet,sx,sy,cw,ch,-w/2,-h,w,h);
  c.restore();
}

function drawBossVeil(h,strength,t){
  const img=im.bossFlame;if(strength<=0||!img.complete||!img.naturalWidth)return;
  // A low, translucent flame afterimage bridges recovery without covering the face or blade.
  const sy=t<1?560:804,sh=t<1?244:220,w=h*1.12,fh=w*sh/img.naturalWidth;
  c.save();c.globalAlpha*=C(strength,0,1)*.65;
  c.drawImage(img,0,sy,img.naturalWidth,sh,-w/2,-fh*.90,w,fh);c.restore();
}
function drawBossSprite(e,h){
  drawBossAura(e,h);
  const v=bossVisual(e),a=e.action,r=e.recover;
  const frame=Math.floor(v.frame),mix=a?v.mix:C((v.frame-frame-.72)/.28,0,1);
  const next=a?v.next:(frame+1)%8;
  const recovery=r?C(r.age/.22,0,1):1;
  if(r)drawBossFrame(im.bossSkills,r.kind==='dragon'?3:7,h,1-recovery);
  drawBossFrame(v.sheet,frame,h,(1-mix)*recovery);
  if(mix&&next!==null)drawBossFrame(v.sheet,next,h,mix*recovery);
  if(a){
    const impact=Math.max(0,1-Math.abs(a.age-a.impact)/.13);
    const exit=C((a.age-(a.duration-.16))/.16,0,1);
    drawBossVeil(h,Math.max(impact*.82,exit*.96),a.age);
  }else if(r)drawBossVeil(h,(1-recovery)*.96,r.age+1);
}
function bossAuraProgress(e){
  const a=e.action;if(!a||a.kind==='normal'||a.done||e.dead)return -1;
  const age=a.age-(a.impact-.5);return age>=-1e-9&&age<.5?C(age/.5,0,1):-1;
}
function drawBossAura(e,h){
  const q=bossAuraProgress(e),img=im.bossFlame;if(q<0||S.cinematic||!img.complete||!img.naturalWidth)return;
  const sy=q<.6?0:292,sh=q<.6?292:268,w=h*(.85+.25*q),fh=h*(.16+.13*q);
  c.save();c.globalAlpha*=.30+.42*q;
  c.drawImage(img,0,sy,img.naturalWidth,sh,-w/2,-fh*.88,w,fh);c.restore();
}
function heroHitRect(){const h=playerHeight();return {x:playerX()-h*.18,y:playerY()-h*.80,w:h*.36,h:h*.72};}
function overlaps(a,b){return a.x<=b.x+b.w&&a.x+a.w>=b.x&&a.y<=b.y+b.h&&a.y+a.h>=b.y;}
function bossWideRect(a){
 const z=a.targetZ-S.z,p=perspective(z),y=yy(z)-Math.min(H*.34,290)*p*.45,w=(lx(2.5,z)-lx(-.5,z))*1.08,h=w*292/1536;
 return {x:W/2-w/2,y:y-h/2,w,h};
}
function resolveBossWideHit(a){
 if(a.hitPlayer)return;
 if(Math.abs(S.z+S.pd-a.targetZ)<=BOSS_SLASH_DEPTH/2||overlaps(heroHitRect(),bossWideRect(a))){a.hitPlayer=true;hurt(4);}
}
function fireDragonRect(shot){
 const z=shot.z-S.z,p=perspective(z),launch=C((shot.age||0)/.18,0,1),h=300*p*Math.min(1,H/844)*(.45+.55*launch),w=h*2/3;
 const originLane=shot.originLane??shot.l,l=originLane+(shot.l-originLane)*E(launch),bossH=bossHeight((shot.originZ??shot.z)-S.z);
 const x=lx(l,z)+(1-launch)*bossH*.20,y=yy(z);
 return {x:x-w/2,y:y-h*.90,w,h};
}
function drawBossWideSlash(){
  const e=S.en.find(e=>e.boss&&!e.dead),a=e&&e.action;if(!a||a.kind!=='wide'||!a.done||S.cinematic)return;
  const q=(a.age-a.impact)/.48;if(q<0||q>=1)return;
  const img=im.bossFlame;if(!img.complete||!img.naturalWidth)return;
  const z=a.targetZ-S.z,p=perspective(z),y=yy(z)-Math.min(H*.34,290)*p*.45,left=lx(-.5,z),right=lx(2.5,z);
  const frame=Math.min(3,Math.floor(q*4)),rows=[0,292,560,804,1024];
  const sw=img.naturalWidth,sy=rows[frame],sh=rows[frame+1]-sy,w=(right-left)*1.08,h=w*sh/sw;
  c.save();c.globalAlpha=q>.78?(1-q)/.22:1;
  c.drawImage(img,0,sy,sw,sh,W/2-w/2,y-h/2,w,h);c.restore();
}
function drawFireDragon(shot){
  const img=im.fireDragon;if(!img.complete||!img.naturalWidth)return;
  const r=fireDragonRect(shot);c.save();c.globalAlpha=.92;
  c.drawImage(img,0,0,img.naturalWidth,img.naturalHeight,r.x,r.y,r.w,r.h);c.restore();
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
    S.skill.t+=dt;let p=S.skill.t/S.skill.d;
    if(S.skill.k===1&&!S.skill.visual&&p>.27){S.skill.visual=1;S.skill.waterVisual={age:0,l:S.l};S.waterFx.push(S.skill.waterVisual)}
    if(!S.skill.done&&p>(S.skill.k===1?.48:.54)){
      S.skill.done=1;sound(S.skill.k===1?'waterSwing':'continentSwing');
      S.waves.push({k:S.skill.k,l:S.l,z:S.z+S.pd,origin:S.z+S.pd,travel:0,seen:new Set()});
      if(S.skill.k===2)S.earthFx.push({age:0,l:S.l,z:S.z+S.pd+1.2});
    }
    if(S.skill.t>=S.skill.d)S.skill=null;
  }
  let con=S.en.find(e=>!e.dead&&e.l===S.l&&distance(e)<=(e.boss?5:1.05)&&distance(e)>=-.1);
  S.norm=Math.max(0,S.norm-dt);
  if(S.skill||S.ultimate||S.guard)S.normalAttack=null;
  if(con&&!S.skill&&!S.ultimate&&!S.guard&&!S.normalAttack&&S.norm<=1e-9){
    S.normalAttack={k:2,t:0,d:.5,done:0,target:con};S.norm=1;
  }
  if(S.normalAttack){
    const a=S.normalAttack;a.t+=dt;
    if(!a.done&&a.t>=a.d*.48){
      a.done=1;const e=a.target;
      if(!e.dead&&e.l===S.l&&distance(e)>=-.1&&distance(e)<=(e.boss?5:1.05)){S.normalFlash=.18;hit(e,1,0)}
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
    const before=distance(p);p.z-=(p.kind==='fireDragon'?10:18)*dt;p.age=(p.age||0)+dt;
    if(p.kind==='fireDragon'&&before>=-.35&&overlaps(heroHitRect(),fireDragonRect(p))){hurt(p.d);p.dead=1;}
    else if(distance(p)<=.35){if(before>=-.35&&p.l===S.l)hurt(p.d);p.dead=1;}
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
function updateWaves(dt){
  for(const w of S.waves){
    const previous=w.z,move=24*dt;w.z+=move;w.travel+=move;
    for(const e of S.en){
      if(e.dead||w.seen.has(e)||e.z<previous-.5||e.z>w.z+.5)continue;
      if(w.k===1?Math.abs(e.l-w.l)<=1:e.l===w.l){w.seen.add(e);hit(e,w.k===1?2:3,1)}
    }
  }
  S.waves=S.waves.filter(w=>w.travel<(w.k===1?9:13));
}
// Reference 7.05–7.65 s: left ignition, horizontal wrapping water ribbon,
// rear water sheet, then broken residual droplets. One effect, two depth passes.
function waterState(t){
  return {spread:C(t/.06,0,1),alpha:t<.10?C(t/.025,0,1):C((.53-t)/.30,0,1),
    lift:C((t-.04)/.10,0,1)*C((.48-t)/.22,0,1),
    residue:C((t-.27)/.09,0,1)*C((.60-t)/.20,0,1)};
}
function drawWaterEffect(frontPass){
  if(frontPass)return;
  const sheet=im.waterSheet;if(!sheet.complete||!sheet.naturalWidth)return;
  const cw=sheet.naturalWidth/4,ch=sheet.naturalHeight/2;
  for(const f of S.waterFx){
    const frame=Math.min(7,Math.floor(f.age/.045)),h=playerHeight(),w=h*1.85,dh=w*.65;
    c.save();c.globalAlpha=C((.48-f.age)/.16,0,1);
    c.drawImage(sheet,frame%4*cw,Math.floor(frame/4)*ch,cw,ch,lx(f.l,S.pd)-w/2,playerY()-h*.85-dh*.5,w,dh);c.restore();
  }
}
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
function drawWaves(){drawEarthEffect()}
function drawBattleBanner(){
  const elapsed=S.phase==='boss'?S.t-S.bossStartedAt:S.t;
  if(!S.run||S.cinematic||S.phase==='boss'||elapsed>=1.6)return;
  const t=elapsed,enter=C(t/.22,0,1),leave=C((t-1.15)/.45,0,1),x=W*(1-enter)-W*leave;
  c.save();c.globalAlpha=Math.min(1,enter*2)*(1-leave);c.translate(x,H*.32);
  const g=c.createLinearGradient(0,0,W,0);g.addColorStop(0,'#122b2900');g.addColorStop(.2,'#122b29ee');g.addColorStop(.8,'#122b29ee');g.addColorStop(1,'#122b2900');c.fillStyle=g;c.fillRect(0,-32,W,64);
  c.fillStyle='#d9c795';c.fillRect(W*.12,-32,W*.76,1);c.fillRect(W*.12,31,W*.76,1);
  c.textAlign='center';c.textBaseline='middle';c.font='bold 28px serif';c.fillStyle='#fff5d9';c.fillText(S.phase==='boss'?'ボス出現':'戦闘開始',W/2,0);c.restore();
}
function drawEffects(){for(const f of S.fx){
  const p=perspective(f.z-S.z),x=lx(f.l,f.z-S.z),y=yy(f.z-S.z),q=f.t/f.life;
  c.save();c.globalAlpha=1-q;c.fillStyle=f.color;
  if(f.kind==='impact'){c.strokeStyle=f.color;c.lineWidth=3*(1-q);c.beginPath();c.ellipse(x,y,(12+72*q)*p,(3+16*q)*p,0,0,Math.PI*2);c.stroke();for(let i=0;i<7;i++){let a=i*Math.PI*2/7;c.beginPath();c.moveTo(x+Math.cos(a)*12*p,y+Math.sin(a)*4*p);c.lineTo(x+Math.cos(a)*65*q*p,y+Math.sin(a)*18*q*p-25*Math.sin(q*Math.PI)*p);c.stroke()}}
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
  const sky=c.createLinearGradient(0,0,0,H*.45);sky.addColorStop(0,'#426d69');sky.addColorStop(.6,'#c2d0a2');sky.addColorStop(1,'#687349');c.fillStyle=sky;c.fillRect(0,0,W,H);
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
    const p=perspective(o.z),height=H*(1.65+o.seed*.018)*p,width=height*cw/ch;
    const x=W/2+o.side*W*(.96+o.band*.72+(o.seed%3)*.045)*p,y=yy(o.z);
    c.save();c.globalAlpha=C((112-o.z)/24,0,1);
    c.drawImage(trees,(o.seed%4)*cw,0,cw,ch,x-width/2,y-height*.95,width,height);c.restore();
  }
}
function bg(){
  if(im.forestTrees.complete&&im.forestTrees.naturalWidth&&im.forestGround.complete&&im.forestGround.naturalWidth){drawMovingForest();const fog=c.createRadialGradient(W/2,H*HORIZON,0,W/2,H*HORIZON,W*.25);fog.addColorStop(0,"#c7d3b4ee");fog.addColorStop(.3,"#c7d3b488");fog.addColorStop(1,"#c7d3b400");c.fillStyle=fog;c.fillRect(0,0,W,H);return;}
  c.fillStyle='#0b1020';c.fillRect(0,0,W,H);

}

function frontline(){let fl=front();if(!Number.isFinite(fl)||fl-S.z>42)return;let r=fl-S.z,y=yy(r),p=perspective(r),half=Math.min(W,520)*.44*p;c.save();c.strokeStyle='rgba(255,225,125,.95)';c.shadowColor='rgba(255,170,50,.9)';c.shadowBlur=4;c.lineWidth=1.5;c.beginPath();c.moveTo(W/2-half,y);c.lineTo(W/2+half,y);c.stroke();c.restore()}
// Source coordinates are measured on the uploaded sheets, not image centres.
// Keep original files intact; the cached body layer masks only the old arms.
let bodyLayer=null;
function polygon(ctx,points){ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));ctx.closePath()}
function rigReady(){return ['body','upper','fore','hand','shoulder','sword'].every(k=>im[k].complete&&im[k].naturalWidth>0)}
function makeBodyLayer(){
  if(bodyLayer)return bodyLayer;
  const layer=document.createElement('canvas');layer.width=1600;layer.height=1600;
  const ctx=layer.getContext('2d');ctx.drawImage(im.body,0,0);
  ctx.globalCompositeOperation='destination-out';
  for(const points of [
    [[606,451],[660,449],[683,499],[686,559],[670,605],[646,657],[620,710],[602,766],[608,800],[592,832],[555,835],[534,796],[551,735],[575,655],[592,576]],
    [[853,449],[887,451],[910,494],[916,555],[920,604],[921,684],[947,737],[966,787],[966,818],[936,836],[910,822],[897,784],[889,733],[879,663],[853,588],[844,520]]
  ]){polygon(ctx,points);ctx.fill()}
  ctx.globalCompositeOperation='source-over';
  // Restore the scarf where it passes in front of the right arm.
  ctx.save();polygon(ctx,[[699,423],[843,423],[857,507],[905,591],[968,626],[1100,677],[1180,754],[1180,800],[1100,766],[1122,829],[1180,908],[1157,965],[1070,1005],[970,1050],[980,994],[1029,918],[1029,851],[958,766],[886,701],[837,653],[777,595],[737,509]]);ctx.clip();ctx.drawImage(im.body,0,0);ctx.restore();
  bodyLayer=layer;return layer;
}
const REST={upper:-.14,fore:-.12,wrist:Math.PI,flat:1,left:.16};
function rigPose(progress){
  if(!S.skill){const q=(S.normalFlash||0)/.18;return {...REST,upper:REST.upper+Math.sin(q*Math.PI)*.55,fore:REST.fore-Math.sin(q*Math.PI)*.3,behind:false}}
  const p=progress===undefined?C(S.skill.t/S.skill.d,0,1):progress,water=S.skill.k===1;
  // Fold the elbow with the sword on the camera-facing/back side first.
  // Then lift it clear of the torso at the right shoulder before cutting forward.
  const wind=water?{upper:-.85,fore:2.2,wrist:Math.PI,flat:.75,left:.5}:{upper:-2.2,fore:2.6,wrist:Math.PI,flat:1,left:.05};
  const ready=water?{upper:-1.8,fore:.25,wrist:Math.PI,flat:.48,left:.5}:{upper:-2.5,fore:-.55,wrist:Math.PI,flat:1,left:.05};
  const follow=water?{upper:1.3,fore:.2,wrist:Math.PI,flat:.48,left:-.15}:{upper:-.1,fore:.1,wrist:Math.PI,flat:1,left:.3};
  const windEnd=water?.22:.24,frontStart=water?.34:.38,cutEnd=water?.56:.60,holdEnd=water?.67:.70;
  let from,to,q;
  if(p<windEnd){from=REST;to=wind;q=E(p/windEnd)}
  else if(p<frontStart){from=wind;to=ready;q=E((p-windEnd)/(frontStart-windEnd))}
  else if(p<cutEnd){from=ready;to=follow;q=E((p-frontStart)/(cutEnd-frontStart))}
  else if(p<holdEnd){from=follow;to=follow;q=0}
  else{from=follow;to=REST;q=E((p-holdEnd)/(1-holdEnd))}
  const pose={behind:p<frontStart};
  for(const key in REST)pose[key]=from[key]+(to[key]-from[key])*q;
  return pose;
}
function segment(img,rect,pivot,end,length){
  const dx=end[0]-pivot[0],dy=end[1]-pivot[1],s=length/Math.hypot(dx,dy);
  c.save();c.rotate(Math.atan2(dx,dy));
  c.drawImage(img,...rect,(rect[0]-pivot[0])*s,(rect[1]-pivot[1])*s,rect[2]*s,rect[3]*s);c.restore();
}
function arm(right,pose){
  const upper=right?pose.upper:pose.left,fore=right?pose.fore:.12;
  c.save();c.translate(right?866:650,478);if(right)c.scale(1,pose.flat);
  c.rotate(upper);
  segment(im.upper,right?[925,438,350,683]:[329,438,350,683],right?[1060,500]:[539,500],right?[1134,1063]:[465,1063],118);
  c.translate(0,118);c.rotate(fore);
  segment(im.fore,right?[879,321,355,930]:[368,321,354,930],right?[1022,449]:[578,449],right?[1140,1201]:[460,1201],146);
  c.translate(0,146);
  if(right){
    // Wrist/grip is local to the forearm. Select one sword view from its sheet.
    c.save();c.translate(4,40);c.rotate(pose.wrist);
    const side=S.skill&&S.skill.k===2,rect=side?[620,27,94,1444]:[194,27,338,1444],grip=side?667:363,scale=.39;
    c.drawImage(im.sword,...rect,(rect[0]-grip)*scale,(rect[1]-1240)*scale,rect[2]*scale,rect[3]*scale);c.restore();
  }
  segment(im.hand,right?[974,509,277,596]:[347,509,277,596],right?[1082,565]:[518,565],right?[1160,1061]:[440,1061],68);
  c.restore();
}
function shoulder(right,pose){
  const upper=right?pose.upper:pose.left;
  // Shoulder caps stay attached on the camera-facing side of the torso.
  c.save();c.translate(right?866:650,478);c.rotate(upper*.3);
  const rect=right?[929,521,398,560]:[275,521,398,560],px=right?1040:560,s=.20;
  c.drawImage(im.shoulder,...rect,(rect[0]-px)*s,(rect[1]-620)*s,rect[2]*s,rect[3]*s);c.restore();
}
// The supplied PNG is preserved intact. Rectangles select its 16 poses at runtime.
// Anchor is the midpoint of the planted feet, independent of sword bounds.
const POSES=[
  {r:[46,39,244,273],a:[122,309]},
  {r:[314,47,192,265],a:[395,309]},
  {r:[547,20,194,292],a:[649,309]},
  {r:[774,59,235,253],a:[936,309]},
  {r:[26,382,266,253],a:[138,632]},
  {r:[288,377,245,257],a:[401,631]},
  {r:[555,380,204,259],a:[643,636]},
  {r:[782,374,238,268],a:[873,639]},
  {r:[39,952,242,264],a:[125,1213]},
  {r:[297,880,187,334],a:[395,1213]},
  {r:[523,901,215,313],a:[651,1213]},
  {r:[806,868,190,348],a:[913,1213]},
  {r:[46,1269,179,238],a:[141,1505]},
  {r:[294,1296,204,208],a:[397,1503]},
  {r:[521,1244,248,264],a:[619,1505]},
  {r:[782,1248,221,260],a:[866,1505]}
];
function poseFrame(k,p){
  const beats=k===1?[0,.13,.27,.39,.48,.59,.73,.88]:[0,.13,.28,.43,.54,.64,.77,.90];
  let frame=0;for(let i=1;i<beats.length;i++)if(p>=beats[i])frame=i;
  return (k===2?8:0)+frame;
}
function posesReady(){return im.poses.complete&&im.poses.naturalWidth>0}
function drawPoseFrame(index,h){
  const pose=POSES[index],r=pose.r,a=pose.a,scale=h/268;
  c.drawImage(im.poses,...r,(r[0]-a[0])*scale,(r[1]-a[1])*scale,r[2]*scale,r[3]*scale);
}
function drawRunningHero(h){
  const phase=S.runPhase,bob=Math.sin(phase*2)*2.5;
  c.save();c.scale(h/268,h/268);c.translate(-122,-309+bob);
  // Two-joint leg animation, using the existing transparent body sheet.
  // Draw legs first; the pelvis covers their shoulder-like cut boundaries.
  for(const right of [false,true]){
    const wave=Math.sin(phase+(right?Math.PI:0));
    c.save();c.translate(right?139:104,174);c.rotate((right?-.06:.06)+wave*.025);
    segment(im.poses,right?[124,171,39,66]:[67,171,59,65],right?[138,175]:[104,175],right?[149,231]:[85,231],59*(1-.12*Math.abs(wave)));
    c.translate(0,59*(1-.12*Math.abs(wave)));c.scale(1,1-.55*Math.max(0,wave));
    segment(im.poses,right?[143,230,52,80]:[49,226,48,62],right?[150,237]:[83,231],right?[177,298]:[63,275],65);
    c.restore();
  }
  c.drawImage(im.poses,46,39,244,144,46,39,244,144);
  c.restore();
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
function armoredReady(){return im.heroSkills.complete&&im.heroSkills.naturalWidth>0&&im.heroRun.complete&&im.heroRun.naturalWidth>0}
function armoredFrame(sheet,index,h,running=false,alpha=1){
  const cols=4,rows=running?2:4,cw=sheet.naturalWidth/cols,ch=sheet.naturalHeight/rows;
  const a=running?[[187,478],[187,478],[187,478],[187,478],[187,464],[187,464],[187,464],[187,464]][index]:ARMORED_ANCHORS[index];
  const scale=h/(running?480:260);
  c.save();c.globalAlpha*=alpha;
  const inset=running?18:0;
  c.drawImage(sheet,(index%4)*cw+inset,Math.floor(index/4)*ch,cw-2*inset,ch,(-a[0]+inset)*scale,-a[1]*scale,(cw-2*inset)*scale,ch*scale);
  if(!running)drawHeldBlade(HERO_BLADE_POSES[index],scale,a);
  c.restore();
}
// Whole painted poses: rigid armor and foreshortened knees stay intact.
function drawRunCycle(h){
  const sheet=im.heroRun,cw=sheet.naturalWidth/4,ch=sheet.naturalHeight/2;
  const frame=Math.floor(((S.runPhase/(Math.PI*2))%1+1)%1*8);
  const scale=h/480;
  // Fixed pelvis alignment and uniform scale; never stretch separate limbs.
  c.drawImage(sheet,(frame%4)*cw,Math.floor(frame/4)*ch,cw,ch,-192*scale,-496*scale,cw*scale,ch*scale);
  drawHeldBlade([330,frame<4?248:247,395,frame<4?334:328],scale,[192,496]);
}
function drawGuardHero(h){
  const sheet=im.heroGuard,cw=sheet.naturalWidth/4,ch=sheet.naturalHeight;
  const frame=Math.min(3,Math.floor(S.guardPose*4)),scale=h/(ch*.96);
  c.drawImage(sheet,frame*cw,0,cw,ch,-cw*.46*scale,-ch*.985*scale,cw*scale,ch*scale);
  const blades=[[429,354,559,555],[408,350,538,555],[391,370,532,567],[381,366,529,550]];drawHeldBlade(blades[frame],scale,[cw*.46,ch*.985]);
}
function drawArmoredHero(h){
  const action=S.ultimate?{k:1,t:Math.max(0,S.ultimate.t-ULTIMATE.cutin),d:ULTIMATE.duration-ULTIMATE.cutin}:S.skill||S.normalAttack;
  if((S.guard||S.guardPose>0)&&im.heroGuard.complete&&im.heroGuard.naturalWidth){drawGuardHero(h);
  }else if(action){
    const raw=C(action.t/action.d,0,1),p=action===S.normalAttack?(raw<=.48?raw*.54/.48:.54+(raw-.48)*.46/.52):raw,i=poseFrame(action.k,p),settle=C((p-.88)/.12,0,1);
    armoredFrame(im.heroSkills,i,h,false,1-settle);
    if(settle>0)armoredFrame(im.heroSkills,0,h,false,settle);
  }else if(!S.guard&&S.speed>.05){
    drawRunCycle(h);
  }else armoredFrame(im.heroSkills,0,h);
  // The generated descending arc ends exactly where the ground effect begins.
  if(S.skill&&S.skill.k===2&&earthSheetReady()){
    const q=(S.skill.t/S.skill.d-.30)/.24;
    if(q>=0&&q<1){c.save();c.translate(h*.07,-h*.02);earthSprite(q<.40?0:1,h*1.45,Math.min(1,q*4));c.restore()}
  }
}

function drawNormalSlash(){
 const a=S.normalAttack,img=im.normalSlash;if(!a||S.skill||!img.complete||!img.naturalWidth)return;
 const q=(a.t-.16)/.26;if(q<0||q>1)return;
 const h=playerHeight(),size=h*.95;c.save();c.globalAlpha=Math.min(1,q/.30,(1-q)/.45);
 c.drawImage(img,playerX()-size*.52,playerY()-h*1.04,size,size);c.restore();
}
function drawPoseHero(h){
  const skill=S.skill||S.normalAttack,p=skill?C(skill.t/skill.d,0,1):0;
  if(!skill&&!S.guard&&S.speed>.05)drawRunningHero(h);else drawPoseFrame(skill?poseFrame(skill.k,p):0,h);
  if(!skill||skill===S.normalAttack)return;
  if(skill.k===1)return; // The shared rear/front water passes own all water visuals.
  if(earthSheetReady()){
    const q=(p-.30)/.24;
    if(q>=0&&q<1){c.save();c.translate(h*.07,-h*.02);earthSprite(q<.40?0:1,h*1.45,Math.min(1,q*4));c.restore()}
    return;
  }
  const q=(p-.43)/.25;if(q<0||q>1)return;
  // A filled vertical crescent follows the overhead sword down to the ground.
  c.save();c.globalAlpha=Math.sin(q*Math.PI);c.shadowColor='#80f4ff';c.shadowBlur=12;
  const edge=h*(.14+.20*q);
  const fill=c.createLinearGradient(-edge,-h*1.35,edge,0);
  fill.addColorStop(0,'#5dd8ff00');fill.addColorStop(.5,'#c6ffffee');fill.addColorStop(1,'#ffffff');
  c.fillStyle=fill;c.beginPath();c.moveTo(h*.08,-h*1.40);
  c.bezierCurveTo(-h*.65,-h*1.03,-h*.52,-h*.18,h*.25,-h*.04);
  c.bezierCurveTo(-h*.19,-h*.28,-h*.22,-h*.90,h*.08,-h*1.40);
  c.fill();c.restore();
}
function drawRig(h){
  const pose=rigPose();
  skillEffect(h,h/Math.min(H*.285,238));
  c.save();c.scale(h/1104,h/1104);c.translate(-750,-1344);
  arm(false,pose);
  if(!pose.behind)arm(true,pose);
  c.drawImage(makeBodyLayer(),0,0);
  // During windup the right arm/blade is behind the character, facing us.
  // Switch to the enemy-facing layer only once the raised blade clears the body.
  if(pose.behind)arm(true,pose);
  shoulder(false,pose);shoulder(true,pose);c.restore();
}
function swordPoints(pose,h){
  const rot=(x,y,a)=>[x*Math.cos(a)-y*Math.sin(a),x*Math.sin(a)+y*Math.cos(a)];
  function point(x,y){
    let v=rot(x,y,pose.wrist);v=rot(v[0]+4,v[1]+186,pose.fore);v=rot(v[0],v[1]+118,pose.upper);
    return [(866+v[0]-750)*h/1104,(478+v[1]*pose.flat-1344)*h/1104];
  }
  return {grip:point(0,0),tip:point(0,-470.7)};
}
function skillEffect(h,sc){
  if(!S.skill||S.skill.k===1)return;
  const p=S.skill.t/S.skill.d,water=S.skill.k===1;
  const begin=water?.35:.39,end=water?.67:.70;if(p<begin||p>end)return;
  const q=(p-begin)/(end-begin),now=swordPoints(rigPose(p),h),before=swordPoints(rigPose(Math.max(begin,p-.09)),h);
  c.save();c.globalAlpha=Math.sin(q*Math.PI)*.6;
  c.strokeStyle=water?'#d7f8ff':'#fff5cf';c.fillStyle=water?'#b6edff':'#ffe8ae';
  c.shadowColor=water?'#69cfff':'#f6c77c';c.shadowBlur=9;c.lineWidth=3*sc;c.lineCap='round';
  c.beginPath();c.moveTo(...before.tip);c.lineTo(...now.tip);c.stroke();
  c.globalAlpha*=.28;c.beginPath();c.moveTo(...before.grip);c.lineTo(...before.tip);c.lineTo(...now.tip);c.lineTo(...now.grip);c.closePath();c.fill();
  if(!water&&p>.59){c.globalAlpha=(end-p)/(end-.59)*.5;c.lineWidth=2*sc;c.beginPath();c.ellipse(now.tip[0],Math.min(0,now.tip[1]),h*.2*(p-.59)/.11,h*.04,0,0,Math.PI*2);c.stroke()}
  c.restore();
}
function drawDefeatedHero(h){
  const sheet=im.heroDefeat,t=S.defeat.t;
  if(!sheet.complete||!sheet.naturalWidth){c.save();c.rotate(-C(t/.9,0,1)*1.45);if(armoredReady())drawArmoredHero(h);c.restore();return;}
  const times=[0,.15,.30,.45,.60,.78,.96,1.16];let frame=0;while(frame<7&&t>=times[frame+1])frame++;
  const sy=frame<4?0:560,sh=frame<4?560:464,anchor=[505,505,515,515,375,367,355,352][frame],scale=h/470;
  const blend=C(t/.12,0,1);if(blend<1&&armoredReady()){c.save();c.globalAlpha=1-blend;drawArmoredHero(h);c.restore();}
  c.save();c.globalAlpha=blend;const inset=frame===7?20:0;c.drawImage(sheet,(frame%4)*384+inset,sy,384-inset,sh,(-192+inset)*scale,-anchor*scale,(384-inset)*scale,sh*scale);c.restore();
  const dust=t-.78;if(dust>=0&&dust<.5){c.save();c.globalAlpha=(1-dust/.5)*.3;c.fillStyle='#ccb893';for(let i=0;i<7;i++){c.beginPath();c.ellipse((i-3)*h*(.05+dust*.10),-Math.sin(i+1)*h*.02-dust*h*.035,h*(.03+dust*.06),h*.025,0,0,Math.PI*2);c.fill();}c.restore();}
}
function draw(){
  placeNotice();c.clearRect(0,0,W,H);bg();c.save();
  if(S.shake)c.translate(Math.sin(S.t*110)*S.shake*22,Math.cos(S.t*93)*S.shake*12);
  // Motion flecks on the path use the same perspective as the combatants.
  c.fillStyle='#eadfb72b';for(let i=0;i<24;i++){let z=((i*2.7-S.z)%64.8+64.8)%64.8-3,p=1/(1+z*.115);c.fillRect(W/2+((i%3)-1)*W*.23*p,H*HORIZON+H*GROUND_SPAN*p,2*p,5*p)}
  frontline();
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
  for(const shot of S.shots){if(shot.kind==='fireDragon'){drawFireDragon(shot);continue;}const z=shot.z-S.z,p=perspective(z),x=lx(shot.l,z),y=yy(z)-45*p;c.save();c.fillStyle=shot.t==='mage'?'#bd79ff':'#ff873d';c.shadowColor=c.fillStyle;c.shadowBlur=18;c.beginPath();c.arc(x,y,9*p+2,0,7);c.fill();c.restore()}
  drawWaterEffect(false);drawGuardImpact();drawDashTrail();
  const x=playerX(),y=playerY(),h=playerHeight(),img=im.hero;c.save();c.translate(x,y);
  c.fillStyle='#06111b66';c.beginPath();c.ellipse(0,0,h*.25,h*.04,0,0,7);c.fill();
  if(S.defeat)drawDefeatedHero(h);else if(armoredReady())drawArmoredHero(h);else if(img.complete&&img.naturalWidth){const rect=crop(img),w=h*rect[2]/rect[3];c.drawImage(img,...rect,-w/2,-h,w,h)}c.restore();drawNormalSlash();drawWaterEffect(true);drawEffects();c.restore();drawUltimate();drawBossWideSlash();drawBattleBanner();
  if(S.hit){c.fillStyle='rgba(255,80,60,.12)';c.fillRect(0,0,W,H)}
  drawCinematic();
}
const SCORE_KEY='eta.score.v5.reference';
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
const RANK_KEY='eta.local-ranking.v1';
function readRanking(){try{const rows=JSON.parse(localStorage.getItem(RANK_KEY)||'[]');return Array.isArray(rows)?rows.filter(r=>r&&Number.isFinite(r.score)&&r.score>=0&&Number.isFinite(r.time)&&r.time>=0).sort((a,b)=>b.score-a.score||a.time-b.time).slice(0,10):[];}catch{return [];}}
function saveRanking(points){try{const rows=readRanking();rows.push({score:points,time:S.t});rows.sort((a,b)=>b.score-a.score||a.time-b.time);localStorage.setItem(RANK_KEY,JSON.stringify(rows.slice(0,10)));}catch{}}
let titleMenuFocus=null;
let guidePage=0,guideOpen=false;
const GUIDE_PAGES=[
 {src:'assets/guide-page-1.webp',alt:'ゲーム概要。敵に接近してスキルや奥義を発動しよう！'},
 {src:'assets/guide-page-2.webp',alt:'スーパーダッシュ。敵を撃破した直後に下から上へスワイプ。スキルが回復し、タイム短縮にもなります。'},
 {src:'assets/guide-page-3.webp',alt:'ハイスコアを狙おう。クリアタイムは速いほど高得点。スキルフィニッシュで得点アップ。被ダメージを少なくし、敵に与えたダメージを増やそう。4項目の合計が総合スコア。'}
];
function showGuidePage(n){guidePage=C(n,0,2);const page=GUIDE_PAGES[guidePage];$('#guideImage').src=page.src;$('#guideImage').alt=page.alt;$('#guidePrev').hidden=guidePage===0;$('#guideNext').hidden=guidePage===2;$('#guideExit').textContent='閉じる';$('#guideStatus').textContent=(guidePage+1)+' / 3';if(guideOpen)(guidePage===2?$('#guideExit'):$('#guideNext')).focus?.();}
function closeGuide(){guideOpen=false;$('#guidePanel').classList.add('hide');$('#gameHelp').focus?.();titleMenuFocus=null;}
$('#guidePrev').onclick=()=>showGuidePage(guidePage-1);$('#guideNext').onclick=()=>showGuidePage(guidePage+1);$('#guideExit').onclick=closeGuide;
function openTitlePanel(kind){
 if(S.run)return;titleMenuFocus=kind==='help'?$('#gameHelp'):$('#ranking');
 if(kind==='help'){guideOpen=true;$('#guidePanel').classList.remove('hide');showGuidePage(0);return;}
 $('#titlePanelHeading').textContent='ランキング';$('#titlePanelBody').innerHTML=rankingHTML();
 $('#titlePanel').classList.remove('hide');$('#titlePanelClose').focus?.();
}
function rankingHTML(){const rows=readRanking(),best=highScore();return '<p class="rank-note">この端末のランキング · クリア記録 上位10件</p><p>自己ベスト：'+best.toLocaleString('ja-JP')+'</p>'+(rows.length?'<table class="rank-table"><thead><tr><th>順位</th><th>スコア</th><th>タイム</th></tr></thead><tbody>'+rows.map((r,i)=>'<tr><td>'+(i+1)+'</td><td>'+r.score.toLocaleString('ja-JP')+'</td><td>'+r.time.toFixed(2)+'秒</td></tr>').join('')+'</tbody></table>':'<p>まだクリア記録がありません。クリアするとここに記録されます。</p>')+'<p class="rank-note">記録はこのブラウザに保存されます。全プレイヤー共通のランキングではありません。</p>';}
function closeTitlePanel(){$('#titlePanel').classList.add('hide');titleMenuFocus?.focus?.();titleMenuFocus=null;}
$('#gameHelp').onclick=()=>openTitlePanel('help');$('#ranking').onclick=()=>openTitlePanel('ranking');$('#titlePanelClose').onclick=closeTitlePanel;
addEventListener('keydown',e=>{if(!titleMenuFocus)return;
 if(e.key==='Escape'){e.preventDefault();if(guideOpen)closeGuide();else closeTitlePanel();}
 if(guideOpen&&(e.key==='ArrowRight'||e.key==='ArrowLeft')){e.preventDefault();showGuidePage(guidePage+(e.key==='ArrowRight'?1:-1));}
 if(e.key==='Tab'){e.preventDefault();if(guideOpen){const buttons=[$('#guidePrev'),$('#guideNext'),$('#guideExit')].filter(b=>!b.hidden),i=buttons.indexOf(document.activeElement);buttons[(i+(e.shiftKey?-1:1)+buttons.length)%buttons.length].focus?.();}else $('#titlePanelClose').focus?.();}
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
  if(ok&&!S.rankSaved){saveRanking(points.total);S.rankSaved=true;}
  if(ok&&points.total>previous)saveHighScore(points.total);
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
function waitForForest(){return Promise.all([im.forestTrees,im.forestGround].map(img=>{
  if(img.complete&&img.naturalWidth)return Promise.resolve();
  return new Promise((resolve,reject)=>{img.onload=resolve;img.onerror=()=>reject(new Error('背景を読み込めません'));if(img.complete)img.src=img.src;});
}));}
function forestReady(){return [im.forestTrees,im.forestGround].every(img=>img.complete&&img.naturalWidth);}
function prepareStart(){const button=$('#start');button.disabled=true;button.setAttribute('aria-label','背景を読み込み中');
waitForForest().then(()=>{button.disabled=false;button.setAttribute('aria-label','ゲームを開始');},()=>{button.disabled=false;button.setAttribute('aria-label','背景を再読み込み');});}
prepareStart();
function start(){if(!forestReady()){prepareStart();return;}if(window.GameSFX)window.GameSFX.start();beginRun();last=performance.now();$('#intro').classList.add('hide');if(window.GameBGM)window.GameBGM.start()}$('#start').onclick=start;$('#retry').onclick=()=>{if(window.GameSFX)window.GameSFX.start();beginRun();last=performance.now();$('#result').classList.add('hide');if(window.GameBGM)window.GameBGM.restart()};// Own each gesture by pointerId; button fingers cannot finish a canvas swipe.
for(const id of ['#guard','#s1','#s2','#ultimate']){
  const button=$(id);
  button.addEventListener('contextmenu',e=>e.preventDefault());
  button.addEventListener('dragstart',e=>e.preventDefault());
  button.addEventListener('animationend',()=>button.classList.remove('flash'));
  button.onpointerdown=e=>{
    e.preventDefault();e.stopPropagation();flash(button);
    if(S.run&&!S.pause&&window.GameSFX)window.GameSFX.wake();
    if(id==='#guard'){
      if(S.run&&!S.pause&&!S.cinematic&&!S.ultimate){S.guard=1;sound('guardRaise');button.setPointerCapture(e.pointerId);notice('防御',.5)}
    }else if(id==='#ultimate')fireUltimate();else fire(id==='#s1'?1:2);
  };
}
['pointerup','pointercancel','lostpointercapture'].forEach(v=>$('#guard').addEventListener(v,()=>S.guard=0));
$('#stop').onclick=()=>{
  if(!S.run&&(!S.defeat||S.defeat.finished))return;if(window.GameSFX)window.GameSFX.pause();S.pause=1;S.guard=0;S.ptr=null;hideNotice();
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
document.addEventListener('touchmove',e=>{if(e.target.closest&&e.target.closest('#result,#titlePanel'))return;if(e.cancelable)e.preventDefault()},{passive:false});
cv.addEventListener('contextmenu',e=>e.preventDefault());
cv.addEventListener('dragstart',e=>e.preventDefault());
document.addEventListener('visibilitychange',()=>{if(document.hidden&&(S.run||(S.defeat&&!S.defeat.finished))&&!S.pause)$('#stop').click()});
addEventListener('keydown',e=>{if(!S.run||S.pause||S.cinematic||ultimateCutinActive())return;if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','1','2','3',' '].includes(e.key))e.preventDefault();if(e.repeat)return;if(e.key==='ArrowLeft')lane(-1);if(e.key==='ArrowRight')lane(1);if(e.key==='ArrowUp')accelerate();if(e.key==='ArrowDown')depth(-MAX_DEPTH/4);if(e.key==='1')fire(1);if(e.key==='2')fire(2);if(e.key==='3')fireUltimate();if(e.key===' '&&!S.ultimate){S.guard=1;sound('guardRaise')}});addEventListener('keyup',e=>{if(e.key===' ')S.guard=0});
reset();function loop(t){let dt=last?Math.min(.033,(t-last)/1000):0;last=t;step(dt);draw();requestAnimationFrame(loop)}requestAnimationFrame(loop)})();
