(()=>{const $=s=>document.querySelector(s),cv=$('#game'),c=cv.getContext('2d');let W,H,last=0,S,combatSeed=17319;const EX=window.EX_CONFIG;function random(){combatSeed=(Math.imul(combatSeed,1664525)+1013904223)>>>0;return combatSeed/4294967296}const C=(v,a,b)=>Math.max(a,Math.min(b,v)),R=(a,b)=>a+random()*(b-a),RI=(a,b)=>Math.floor(R(a,b+1)),E=t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;const D={slime:{hp:2,d:1,r:0,h:205},skeleton:{hp:3,d:2,r:0,h:220},mage:{hp:3,d:2,r:1,h:228},bonobo:{hp:4,d:4,r:0,h:245},dragon:{hp:4,d:3,r:1,h:215},boss:{hp:40,d:3,r:0,h:300}},im={};const src={heroBurst:'/Eta/ex/assets/hero-burst-triple.png',heroBlade:'/Eta/sword/assets/hero-blade-v2.webp',normalSlash:'/Eta/sword/assets/hero-normal-slash-v1.webp',bossFlame:'/Eta/sword/assets/boss-horizontal-flame-v2.webp',bossOverhead:null,bossSkills:null,heroDefeat:'/Eta/ex/assets/hero-defeat-v10.jpg',exRock:EX.assets.rock,exRockBreak:EX.assets.rockBreak,exCollision:EX.assets.bossCollision,boss:'/Eta/ex/assets/front.webp',fireDragon:'/Eta/sword/assets/boss-fire-dragon-v2.webp',hero:'/Eta/sword/assets/hero.webp',slime:null,skeleton:null,mage:null,bonobo:null,dragon:null,forestTrees:'/Eta/ex/assets/ruins-objects.webp',forestGround:'/Eta/ex/assets/ruins-ground.webp',exSky:'/Eta/ex/assets/ruins-sky.webp',waterSheet:'/Eta/sword/assets/water-slash-gpt-v3.webp',earthSheet:'/Eta/sword/assets/earth-slash-gpt-v1.webp',heroSkills:'/Eta/sword/assets/hero-skills-gpt-v1.webp',heroRun:'/Eta/sword/assets/hero-run-female-v2.png',heroGuard:'/Eta/sword/assets/hero-guard-gpt-v1.webp',guardImpact:'/Eta/sword/assets/guard-impact-gpt-v1.webp',dashTrail:'/Eta/sword/assets/superdash-gpt-v1.webp'};for(const k in src){im[k]=new Image;if(src[k])im[k].src=src[k]}
function size(){const v=window.visualViewport;W=v?v.width:innerWidth;H=v?v.height:innerHeight;const frame=$('#gameViewport');frame.style.width=W+'px';frame.style.height=H+'px';frame.style.top=(v?v.offsetTop:0)+'px';frame.style.left=(v?v.offsetLeft:0)+'px';let d=Math.min(devicePixelRatio||1,2);cv.width=W*d;cv.height=H*d;c.setTransform(d,0,0,d,0,0)}addEventListener('resize',size);if(window.visualViewport){window.visualViewport.addEventListener('resize',size);window.visualViewport.addEventListener('scroll',size)}size();function sh(a){for(let i=a.length-1;i;i--){let j=RI(0,i);[a[i],a[j]]=[a[j],a[i]]}return a}function mk(t,z){return{t,z,l:RI(0,2),hp:D[t].hp,max:D[t].hp,dead:0,cd:R(1.8,3.8),tell:0,mv:R(.7,2),fl:0}}function roster(){let a=[],e=sh([...Array(3).fill('slime'),...Array(3).fill('skeleton')]),r=sh([...Array(6).fill('slime'),...Array(6).fill('skeleton'),...Array(6).fill('mage'),...Array(3).fill('bonobo'),...Array(3).fill('dragon')]);[...e,...r,...sh([...Array(9).fill('slime'),...Array(9).fill('skeleton'),...Array(6).fill('mage'),...Array(3).fill('bonobo'),...Array(3).fill('dragon')])].forEach((t,i)=>{const group=Math.floor(i/6),row=Math.floor(i%6/3);const enemy=mk(t,18+group*ENEMY_GROUP_GAP+row*ENEMY_ROW_GAP);enemy.l=i%3;enemy.group=group;a.push(enemy)});return a}function reset(){exStopEntryVideo();$('#gameViewport').classList.remove('cinematic');combatSeed=17319;S={run:0,pause:0,t:0,phase:'road',defeat:null,cinematic:null,roadTime:null,bossStartedAt:null,hp:20,dmg:0,dealtDamage:0,ultimateCharge:EX.initialGauge,ultimate:null,overkill:0,z:0,l:1,guard:0,guardPose:0,guardImpact:0,introRun:0,ch:[EX.stocks,EX.stocks],fr:[0,0],skill:null,fin:0,dashUntil:-1,dash:null,boost:0,normalAttack:null,norm:0,en:roster(),shots:[],exBolts:[],exTrails:[],ptr:null,hit:0,pd:0,pt:0,notice:null,ll:1,fx:[],waves:[],waterFx:[],earthFx:[],combo:0,comboTime:0,shake:0,speed:0,runPhase:0,retreat:0,burstUntil:0,burstInvulnerableUntil:0,chanceUntil:0,rocks:[],dashGate:null};hideNotice();ui()}function ui(){updateUltimateUI();exUI();const hpRatio=C(S.hp/20,0,1),hpColor='hsl('+(120*hpRatio)+',100%,50%)';$('#hp').textContent=Math.ceil(C(S.hp,0,20))+'/20';$('#hpf').style.width=(hpRatio*100)+'%';$('#hpf').style.background=hpColor;$('#hpbar').style.background=hpRatio===0?'#ff0000':'#17212b';$('#hpbar').style.borderColor=hpColor;$('#time').textContent=S.t.toFixed(1);$('#fin').textContent=S.fin;const boss=S.en.find(e=>e.boss);$('#bossHud').classList.toggle('hide',S.phase!=='boss'||!!S.cinematic);$('#bossHp').textContent=boss?Math.max(0,boss.hp)+' / '+boss.max:'';for(let i=0;i<2;i++){
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
function depthLimit(){return Math.max(0,front()-S.z-FRONT_GAP)}
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
    // Follow forward input beyond the original screen-depth boundary.
    if(S.retreat>0&&!S.dash)return 0;
    const target=S.dash||S.boost>0?depthLimit():Math.max(S.pd,Math.min(depthLimit(),RUN_DEPTH));
    const move=Math.min(Math.max(0,target-S.pd),n*(S.dash?1:.65));
    S.pd+=move;const follow=Math.max(0,S.pd-MAX_DEPTH);S.z+=follow;S.pd-=follow;S.pt=S.pd;return move;
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
function sound(kind,type){if(window.GameSFX)window.GameSFX.play(kind,type)}function hurt(n){if(S.defeat||S.t<S.burstInvulnerableUntil||S.ultimate)return;if(S.guard){S.guardImpact=.38;sound('guardBlock');return;}S.combo=0;S.shake=.18;burst(S.l,S.z+S.pd,'#ff7563',12);sound('hurt');S.hp-=n;S.dmg+=n;S.hit=.15;if(S.hp<=0)beginDefeat()}function hit(e,n,sk,source=sk?'skill':'normal'){if(e.dead)return;n=exDamage(n,source);const dealt=Math.min(Math.max(0,e.hp),Math.max(0,n));S.dealtDamage+=dealt;if(S.t>=S.burstUntil&&!S.ultimate&&(source==='normal'||source==='skill'))S.ultimateCharge=C(S.ultimateCharge+dealt,0,ULTIMATE.capacity);S.overkill+=Math.max(0,n-Math.max(0,e.hp));if(source!=='ultimate')sound('hit',e.t);e.hp-=n;e.fl=.12;S.combo++;S.comboTime=2;S.fx.push({kind:'number',l:e.l,z:e.z,n:n,t:0,life:.8,color:sk?'#fff079':'#ffffff'});burst(e.l,e.z,sk?'#b5f7ff':'#ffffff',9);S.shake=sk?.08:.035;if(e.tell>0&&!e.boss){e.tell=0;e.cd=R(1.8,3.8)}if(e.boss)exKnockback(e,dealt);if(e.hp<=0){e.dead=1;e.fade=.4;burst(e.l,e.z,'#ffdfa0',18);sound('down',e.t);if(!e.boss)S.dashUntil=S.t+.5;if(sk)S.fin++}}function hideNotice(){const n=$('#actionName');n.style.opacity='0';n.classList.remove('moveArrow');if(S)S.notice=null}
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
const ULTIMATE={capacity:90,damage:EX.ultimate.damage,duration:EX.ultimate.duration,cutin:0,windup:0,travel:.2133333333};
function updateUltimateUI(){
 window.GameSFX?.setBurstLoop?.(S.run&&!S.pause&&!S.cinematic&&!S.defeat&&S.t<S.burstUntil);
 const active=S.run&&S.t<S.burstUntil,left=active?Math.max(0,S.burstUntil-S.t):0;
 const value=C(S.ultimateCharge,0,ULTIMATE.capacity),button=$('#ultimate');
 $('#ultimateFill').style.strokeDashoffset=String(100*(1-(active?left/EX.burst.duration:value/ULTIMATE.capacity)));
 $('#ultimateFill').style.stroke=active?'#ffce65':'#e8c4ff';
 button.setAttribute('aria-label',active?'バースト三連撃：残り'+left.toFixed(1)+'秒':'バースト開始：ゲージ'+Math.floor(value)+'/'+ULTIMATE.capacity);
 button.setAttribute('aria-disabled',String(!S.run||!!S.pause||!!S.cinematic||!!S.ultimate||(!active&&value<ULTIMATE.capacity)));
 button.classList.toggle('burst-active',!!active);
 $('#burstCountdown').textContent=active?left.toFixed(1):'';
 $('#burstCountdown').hidden=!active;
}
function fireUltimate(){
 if(!S.run||S.pause||S.cinematic||S.ultimate)return false;
 if(S.t>=S.burstUntil&&S.ultimateCharge<ULTIMATE.capacity)return false;
 // A valid ultimate tap takes priority over an unfinished normal skill.
 if(S.skill&&!S.skill.done&&S.skill.waterVisual)S.waterFx=S.waterFx.filter(f=>f!==S.skill.waterVisual);
 S.skill=null;S.normalAttack=null;
 if(S.t>=S.burstUntil){
  if(S.ultimateCharge<ULTIMATE.capacity)return false;
  S.guard=0;S.retreat=0;S.pt=S.pd;
  S.ultimateCharge=0;S.burstUntil=S.t+EX.burst.duration;S.burstInvulnerableUntil=S.t+1;
  sound('ultimateCutin',0);notice('バースト',.7);updateUltimateUI();return true;
 }
 S.guard=0;S.normalAttack=null;S.ptr=null;S.dash=null;S.boost=0;
 S.ultimate={t:0,hits:0,damageMultiplier:EX.burst.damageMultiplier};S.burstUntil=S.t;S.ultimateCharge=0;S.burstInvulnerableUntil=0;hideNotice();notice('バースト三連撃',1.25);sound('burstTriple');updateUltimateUI();return true;
}
function ultimateCutinActive(){return !!S.ultimate&&S.ultimate.t<ULTIMATE.cutin;}
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
  S.dash=null;S.l=next;
}
// A boss hit opens one inclusive 0.5-second window; available forward space determines eligibility.
function exDashSpace(){return depthLimit()-S.pd>1e-4;}
function accelerate(){
  if(!S.run||S.pause||S.cinematic||ultimateCutinActive())return;
  if(S.dashGate&&S.t<=S.dashUntil+1e-9&&!exDashSpace())return;
  S.retreat=0;
  if(!S.dash&&S.dashUntil>=0&&S.t<=S.dashUntil+1e-9){
    S.dash={n:SUPERDASH_DISTANCE};sound('superdash');S.dashUntil=-1;S.dashGate=null;S.boost=0;
  }else S.boost+=SWIPE_STEP_DISTANCE;
}
function runForward(dt){
  // Integrate the short speed impulse exactly, so repeated swipes add full steps
  // at any frame rate. A blocked step expires instead of teleporting past an enemy.
  const extra=S.boost<.001?S.boost:S.boost*-Math.expm1(-dt/SWIPE_DECAY);
  adv(RUN_SPEED*dt+extra);S.boost=Math.max(0,S.boost-extra);
}
function depth(d){if(S.cinematic||ultimateCutinActive())return;S.retreat=1;S.pt=C(S.pd+d,0,depthLimit());if(S.dashGate&&S.t<=S.dashUntil&&d<0)S.dashGate.retreat=true}

// Boss definition stays provisional until the user's boss specification arrives.
const BOSS_PRESENTATION={name:'BOSS',image:'boss'};
function lockCinematic(kind){
  S.cinematic={kind,t:0};S.ptr=null;S.guard=0;S.guardPose=0;S.guardImpact=0;
  S.skill=null;S.ultimate=null;S.normalAttack=null;S.norm=0;S.dash=null;S.dashUntil=-1;S.dashGate=null;S.boost=0;
  S.shots=[];S.exBolts=[];S.exTrails=[];S.waves=[];S.waterFx=[];S.earthFx=[];S.fx=[];S.hit=0;S.shake=0;
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
  if(S.cinematic?.kind==='exEntry'){exDrawEntry();return;}if(!S.cinematic)return;const {kind,t}=S.cinematic;c.save();
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
function bossVisual(e){
  const a=e.action;
  if(!a)return {sheet:im.bossOverhead,frame:((e.stepClock||0)*4)%8,next:null,mix:0};
  // Upper row: blade meets the ground in frame 3. Lower row: follow-through in frame 8.
  const base=a.kind==='dragon'?0:4;
  if(a.impact===0){const progress=C(a.age/a.duration,0,1);return {sheet:im.bossSkills,frame:base+(progress<.45?2:3),next:null,mix:0};}
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
  exDrawBoss(e,h);
}
function bossAuraProgress(e){
  const a=e.action;if(!a||a.impact===0||a.kind==='normal'||a.done||e.dead)return -1;
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
function drawBossWideSlash(){exDrawAttackEffects();}

function drawFireDragon(shot){
  const img=im.fireDragon;if(!img.complete||!img.naturalWidth)return;
  const r=fireDragonRect(shot);c.save();c.globalAlpha=.92;
  c.drawImage(img,0,0,img.naturalWidth,img.naturalHeight,r.x,r.y,r.w,r.h);c.restore();
}
function beginDefeat(){
  if(S.defeat)return;
  S.hp=0;S.run=0;S.defeat={t:0,landed:false,finished:false};S.ptr=null;S.guard=0;S.guardPose=0;S.skill=null;S.normalAttack=null;S.ultimate=null;S.dash=null;S.boost=0;S.speed=0;S.cinematic=null;S.waterFx=[];S.earthFx=[];S.waves=[];S.shots=[];S.exBolts=[];S.exTrails=[];hideNotice();$('#gameViewport').classList.remove('cinematic');ui();
}
function step(dt){
  if(S.pause)return;
  if(S.defeat&&!S.defeat.finished){
    S.defeat.t+=dt;S.hit=Math.max(0,S.hit-dt);S.shake=Math.max(0,S.shake-dt);
    if(!S.defeat.landed&&S.defeat.t>=.78){S.defeat.landed=true;sound('heroFall');S.shake=.10;}
    if(S.defeat.t>=2.8){S.defeat.finished=true;end(0);}return;
  }
  if(!S.run)return;
  if(S.cinematic){if(S.cinematic.kind==='exEntry')exEntryStep(dt);else stepCinematic(dt);ui();return;}
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
  for(let i=0;i<2;i++)if(S.ch[i]<4){S.fr[i]+=dt/EX.skills.rechargeSeconds;if(S.fr[i]>=1){S.fr[i]--;S.ch[i]++}}
  if(!S.guard&&!S.ultimate){
    let runningTime=dt;
    if(S.dash){
      const dash=S.dash,requested=Math.min(SUPERDASH_SPEED*dt,dash.n),v=adv(requested);
      dash.n=Math.max(0,dash.n-v);
      if(v>.0001&&!dash.rewarded){dash.rewarded=true;S.dashFeedbackUntil=S.t+.6;for(let i=0;i<2;i++){S.ch[i]=Math.min(EX.stocks,S.ch[i]+1);if(S.ch[i]===4)S.fr[i]=0}}
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
  exUpdateBolts(dt);if(!S.run){ui();return;}
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
  const atFront=S.en.some(e=>!e.dead&&distance(e)<=(e.boss?5:1.05)&&distance(e)>=-.1);
  S.norm=Math.max(0,S.norm-dt);
  if(S.skill||S.ultimate||S.guard)S.normalAttack=null;
  if(atFront&&!S.skill&&!S.ultimate&&!S.guard&&!S.normalAttack&&S.norm<=1e-9){
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
    const before=distance(p);p.z-=(p.kind==='fireDragon'?EX.attacks.dragon.speed:18)*dt;p.age=(p.age||0)+dt;
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
    const previous=w.z,move=Math.min(24*dt,Math.max(0,(w.k===1?9:13)-w.travel));w.z+=move;w.travel+=move;
    for(const e of S.en){
      if(e.dead||w.seen.has(e)||e.z<previous-.5||e.z>w.z+.5)continue;
      if(w.k===1?Math.abs(e.l-w.l)<=1:e.l===w.l){w.seen.add(e);hit(e,EX.skills.normal[w.k-1],1)}
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
let exBackgroundCache=null;
function drawMovingForest(){
 const ratio=Math.min(devicePixelRatio||1,2),z=S.z;
 if(!exBackgroundCache)exBackgroundCache={canvas:document.createElement('canvas')};
 const cache=exBackgroundCache;
 if(cache.w!==W||cache.h!==H||cache.ratio!==ratio||cache.z!==z){
  cache.canvas.width=Math.ceil(W*ratio);cache.canvas.height=Math.ceil(H*ratio);
  const context=cache.canvas.getContext('2d');context.setTransform(ratio,0,0,ratio,0,0);
  paintRuinsBackground(context);cache.w=W;cache.h=H;cache.ratio=ratio;cache.z=z;
 }
 c.drawImage(cache.canvas,0,0,W,H);
}
function paintRuinsBackground(c){
  const ground=im.forestGround,trees=im.forestTrees;
  c.fillStyle='#21133d';c.fillRect(0,0,W,H);
  const sky=im.exSky,skyHeight=H*(HORIZON+.08),scale=Math.max(W/sky.naturalWidth,skyHeight/sky.naturalHeight);
  c.drawImage(sky,(W-sky.naturalWidth*scale)/2,skyHeight-sky.naturalHeight*scale,sky.naturalWidth*scale,sky.naturalHeight*scale);

  for(let y=Math.ceil(H*HORIZON)+1;y<H;y+=1){
    const p=(y/H-HORIZON)/GROUND_SPAN,z=groundZ(y/H)+S.z;
    const phase=((z/18)%2+2)%2,u=phase<=1?phase:2-phase;
    const sh=Math.min(ground.naturalHeight,Math.max(1,Math.abs(groundZ((y+1)/H)-groundZ(y/H))/18*ground.naturalHeight));
    const sy=Math.min(ground.naturalHeight-sh,u*(ground.naturalHeight-sh)),width=W*3.5*p,left=(W-width)/2;
    c.drawImage(ground,0,sy,ground.naturalWidth,sh,left,y,width,1.1);
    if(left>0){c.drawImage(ground,0,sy,ground.naturalWidth*.15,sh,0,y,left+1,1.1);c.drawImage(ground,ground.naturalWidth*.85,sy,ground.naturalWidth*.15,sh,W-left-1,y,left+1,1.1)}
  }
  const rects=[[0,0,445,1024],[445,0,350,1024],[795,0,347,1024],[1142,0,394,1024]],items=[];
  const first=Math.floor((S.z-2)/8);
  for(let row=first;row<first+16;row++)for(const side of [-1,1])for(let band=0;band<1;band++){
    const seed=((row*13+band*7+(side+1)*3)%17+17)%17;
    const z=sceneryDepth(row*8+band*3+(side===1?2:0));if(z< -1||z>112)continue;
    items.push({z,side,band,seed});
  }
  items.sort((a,b)=>b.z-a.z);
  for(const o of items){
    const rect=rects[o.seed%4],p=perspective(o.z),height=H*(.85+o.seed*.009)*p,width=height*rect[2]/rect[3];
    const x=W/2+o.side*W*(.77+(o.seed%3)*.025)*p,y=yy(o.z);
    c.save();c.globalAlpha=C((112-o.z)/24,0,1);
    c.drawImage(trees,...rect,x-width/2,y-height*.90,width,height);c.restore();
  }
}
function bg(){
  if(im.exSky.complete&&im.exSky.naturalWidth&&im.forestTrees.complete&&im.forestTrees.naturalWidth&&im.forestGround.complete&&im.forestGround.naturalWidth){drawMovingForest();const fog=c.createRadialGradient(W/2,H*HORIZON,0,W/2,H*HORIZON,W*.25);fog.addColorStop(0,"#6950a5aa");fog.addColorStop(.3,"#6950a544");fog.addColorStop(1,"#6950a500");c.fillStyle=fog;c.fillRect(0,0,W,H);return;}
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
// Remove only near-white background connected to sheet edges; preserve enclosed flame highlights.
function exKeyWhiteBackground(data,w,h){
 const seen=new Uint8Array(w*h),queue=new Uint32Array(w*h);let head=0,tail=0;
 function add(n){if(seen[n])return;seen[n]=1;const i=n*4,r=data[i],g=data[i+1],b=data[i+2];if(Math.min(r,g,b)>225&&Math.max(r,g,b)-Math.min(r,g,b)<20)queue[tail++]=n;}
 for(let x=0;x<w;x++){add(x);add((h-1)*w+x);}for(let y=0;y<h;y++){add(y*w);add(y*w+w-1);}
 while(head<tail){const n=queue[head++];data[n*4+3]=0;const x=n%w;if(x)add(n-1);if(x<w-1)add(n+1);if(n>=w)add(n-w);if(n<w*(h-1))add(n+w);}
 return data;
}
function exPrepareDefeat(){
 const img=im.heroDefeat;if(img.exPrepared)return img.exPrepared;if(!img.complete||!img.naturalWidth)return null;
 const canvas=document.createElement('canvas');canvas.width=img.naturalWidth;canvas.height=img.naturalHeight;
 const ctx=canvas.getContext('2d',{willReadFrequently:true});ctx.drawImage(img,0,0);const pixels=ctx.getImageData(0,0,canvas.width,canvas.height);
 exKeyWhiteBackground(pixels.data,canvas.width,canvas.height);ctx.putImageData(pixels,0,0);img.exPrepared=canvas;return canvas;
}
function exDefeatFrame(t){const times=[0,.15,.30,.45,.60,.78,.96,1.16];let frame=0;while(frame<7&&t>=times[frame+1])frame++;return frame;}
function drawDefeatedHero(h){
 const sheet=exPrepareDefeat(),t=S.defeat.t;if(!sheet)return;
 const frame=exDefeatFrame(t),sy=frame<4?0:550,sh=frame<4?530:474;
 const anchor=[512,512,515,515,398,402,407,408][frame],scale=h/420;
 c.drawImage(sheet,(frame%4)*384,sy,384,sh,-192*scale,-anchor*scale,384*scale,sh*scale);
}

function draw(){
  placeNotice();c.clearRect(0,0,W,H);bg();c.save();
  if(S.shake)c.translate(Math.sin(S.t*110)*S.shake*22,Math.cos(S.t*93)*S.shake*12);
  // Motion flecks on the path use the same perspective as the combatants.
  c.fillStyle='#eadfb72b';for(let i=0;i<24;i++){let z=((i*2.7-S.z)%64.8+64.8)%64.8-3,p=1/(1+z*.115);c.fillRect(W/2+((i%3)-1)*W*.23*p,H*HORIZON+H*GROUND_SPAN*p,2*p,5*p)}
  frontline();exDrawArena();
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
  exDrawBolts();
  for(const shot of S.shots){if(shot.kind==='fireDragon'){drawFireDragon(shot);continue;}const z=shot.z-S.z,p=perspective(z),x=lx(shot.l,z),y=yy(z)-45*p;c.save();c.fillStyle=shot.t==='mage'?'#bd79ff':'#ff873d';c.shadowColor=c.fillStyle;c.shadowBlur=18;c.beginPath();c.arc(x,y,9*p+2,0,7);c.fill();c.restore()}
  drawWaterEffect(false);drawGuardImpact();drawDashTrail();
  const x=playerX(),y=playerY(),h=playerHeight(),img=im.hero;c.save();c.translate(x,y);
  c.fillStyle='#06111b66';c.beginPath();c.ellipse(0,0,h*.25,h*.04,0,0,7);c.fill();
  if(!S.ultimate)exDrawBurstAura(h);
  if(S.defeat)drawDefeatedHero(h);else if(S.ultimate&&S.ultimate.t>=ULTIMATE.cutin)exDrawHero(h);else if(armoredReady())drawArmoredHero(h);else if(img.complete&&img.naturalWidth){const rect=crop(img),w=h*rect[2]/rect[3];c.drawImage(img,...rect,-w/2,-h,w,h)}c.restore();drawNormalSlash();drawWaterEffect(true);drawEffects();c.restore();drawUltimate();drawBossWideSlash();drawBattleBanner();
  if(S.hit){c.fillStyle='rgba(255,80,60,.12)';c.fillRect(0,0,W,H)}
  drawCinematic();
}
const SCORE_KEY='soul-bond.ex.sample.v1';
function totalDealtDamage(){return S.dealtDamage+S.overkill;}
function score(ok){
  // Reference-inspired scale: time is dominant; retain the existing four categories.
  const seconds=Math.max(0,S.t);
  const time=ok?Math.round(seconds<=300?3600000-8000*seconds:1200000*Math.exp(-(seconds-300)/150)):0;
  const damage=ok?Math.round(250000*C(1-S.dmg/20,0,1)):0;
  const skill=Math.round(400000*C(S.fin/1,0,1));
  const dealt=Math.round(100000*Math.max(0,totalDealtDamage())/100),overkill=0;
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
$('#gameHelp').onclick=()=>openTitlePanel('help');$('#ranking').onclick=()=>openTitlePanel('ranking');$('#titlePanelClose').onclick=closeTitlePanel;
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
function beginRun(){exBegin();}
function prepareEntryVideo(){
 const v=$('#bossIntroVideo');if(v.readyState>=2)return Promise.resolve();
 return new Promise(resolve=>{let timer;const done=()=>{clearTimeout(timer);v.removeEventListener('loadeddata',done);v.removeEventListener('error',done);resolve();};v.addEventListener('loadeddata',done,{once:true});v.addEventListener('error',done,{once:true});timer=setTimeout(done,8000);});
}
function waitForForest(){return Promise.all([prepareEntryVideo(),window.GameSFX?.prepare?.(), ...[im.exSky,im.forestTrees,im.forestGround,im.heroDefeat,im.heroBurst,...Object.keys(window.EX_SPRITES||{}).map(k=>exSprite(k).img)].map(img=>{
  if(img.complete&&img.naturalWidth)return Promise.resolve();
  return new Promise((resolve,reject)=>{img.onload=resolve;img.onerror=()=>reject(new Error('背景を読み込めません'));if(img.complete)img.src=img.src;});
})]);}
function forestReady(){return [im.exSky,im.forestTrees,im.forestGround,im.heroDefeat,im.heroBurst,...Object.keys(window.EX_SPRITES||{}).map(k=>exSprite(k).img)].every(img=>img.complete&&img.naturalWidth);}
function prepareStart(){const button=$('#start');button.disabled=true;button.setAttribute('aria-label','背景を読み込み中');
waitForForest().then(()=>{exPrepareDefeat();button.disabled=false;button.setAttribute('aria-label','ゲームを開始');},()=>{button.disabled=false;button.setAttribute('aria-label','背景を再読み込み');});}
prepareStart();
$('#bossIntro').addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();exFinishEntry();});
function start(){if(!forestReady()){prepareStart();return;}if(window.GameSFX)window.GameSFX.start();beginRun();last=performance.now();$('#intro').classList.add('hide');if(window.GameBGM)window.GameBGM.start()}$('#start').onclick=start;$('#retry').onclick=()=>{if(window.GameSFX)window.GameSFX.pause();reset();$('#result').classList.add('hide');$('#intro').classList.remove('hide');$('#start').focus?.()};// Own each gesture by pointerId; button fingers cannot finish a canvas swipe.
for(const id of ['#guard','#s1','#s2','#ultimate']){
  const button=$(id);
  button.addEventListener('contextmenu',e=>e.preventDefault());
  button.addEventListener('dragstart',e=>e.preventDefault());
  button.addEventListener('animationend',()=>button.classList.remove('flash'));
  let heldPointer=null,burstSwipe=null;
  if(id==='#ultimate')button.onpointermove=e=>{
    if(!burstSwipe||heldPointer!==e.pointerId||!S.run||S.pause||S.cinematic||S.ultimate)return;
    const dx=e.clientX-burstSwipe.x,dy=e.clientY-burstSwipe.y;
    if(Math.max(Math.abs(dx),Math.abs(dy))<=30)return;
    e.preventDefault();e.stopPropagation();burstSwipe=null;
    if(Math.abs(dx)>Math.abs(dy))lane(dx<0?-1:1);else if(dy<0)accelerate();else depth(-MAX_DEPTH/4);
  };
  if(id==='#ultimate')for(const event of ['pointerup','pointercancel','lostpointercapture'])button.addEventListener(event,e=>{if(heldPointer===e.pointerId){heldPointer=null;burstSwipe=null;}});
  button.onpointerdown=e=>{
    if(id==='#ultimate'){
      e.preventDefault();e.stopPropagation();
      if(heldPointer!==null)return;
      heldPointer=e.pointerId;button.setPointerCapture(e.pointerId);
    }
    e.preventDefault();e.stopPropagation();flash(button);
    if(S.run&&!S.pause&&window.GameSFX)window.GameSFX.wake();
    if(id==='#guard'){
      if(S.run&&!S.pause&&!S.cinematic&&!S.ultimate){S.guard=1;sound('guardRaise');button.setPointerCapture(e.pointerId)}
    }else if(id==='#ultimate'){const activating=S.t>=S.burstUntil;if(fireUltimate()&&activating)burstSwipe={x:e.clientX,y:e.clientY};}else fire(id==='#s1'?1:2);
  };
}
['pointerup','pointercancel','lostpointercapture'].forEach(v=>$('#guard').addEventListener(v,()=>S.guard=0));
$('#stop').onclick=()=>{
  if(!S.run&&(!S.defeat||S.defeat.finished))return;if(window.GameSFX)window.GameSFX.pause();S.pause=1;S.guard=0;S.ptr=null;hideNotice();
  if(S.cinematic?.kind==='exEntry')$('#bossIntroVideo').pause();$('#pause').classList.remove('hide');if(window.GameBGM)window.GameBGM.pause();
};
$('#resume').onclick=()=>{if(window.GameSFX)window.GameSFX.start();S.pause=0;if(S.cinematic?.kind==='exEntry')$('#bossIntroVideo').play().catch(()=>{});last=performance.now();$('#pause').classList.add('hide');if(window.GameBGM)window.GameBGM.resume()};
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
addEventListener('keydown',e=>{if(!S.run||S.pause||S.cinematic||ultimateCutinActive())return;if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','1','2','3',' '].includes(e.key))e.preventDefault();if(e.repeat)return;if(e.key==='ArrowLeft')lane(-1);if(e.key==='ArrowRight')lane(1);if(e.key==='ArrowUp')accelerate();if(e.key==='ArrowDown')depth(-MAX_DEPTH/4);if(e.key==='1')fire(1);if(e.key==='2')fire(2);if(e.key==='3')fireUltimate();if(e.key===' '&&!S.ultimate){S.guard=1;sound('guardRaise')}});addEventListener('keyup',e=>{if(e.key===' ')S.guard=0});
// EX-only behavior. Original sword and spear engines remain separate and unchanged.
function exBegin(){
  reset();S.en=[];S.run=1;S.hp=EX.playerHP;S.pd=RUN_DEPTH;S.pt=S.pd;
  S.phase='boss';S.roadTime=0;S.bossStartedAt=0;
  const boss=mk('boss',BOSS_DEPTH);
  Object.assign(boss,{boss:true,hp:EX.bossHP,max:EX.bossHP,l:1,displayLane:1,action:null,attackCount:0,exCd:bossRange(...EX.attacks.interval)});
  S.en=[boss];S.rocks=[];
  S.knockUnit=EX.knockback.unitsPerDamage;
  S.cinematic={kind:'exEntry',t:0};$('#gameViewport').classList.add('cinematic');exStartEntryVideo();ui();
}
function exStartEntryVideo(){
 const v=$('#bossIntroVideo');v.muted=true;v.currentTime=0;
 $('#bossIntro').hidden=false;exDrawEntry();v.play().catch(()=>{});
}
function exStopEntryVideo(){const v=$('#bossIntroVideo');if(v)v.pause();const layer=$('#bossIntro');if(layer)layer.hidden=true;}
function exFinishEntry(){if(S.cinematic?.kind!=='exEntry'||S.pause)return false;exStopEntryVideo();S.cinematic=null;S.ptr=null;$('#gameViewport').classList.remove('cinematic');ui();return true;}
function exEntryStep(dt){S.cinematic.t+=dt;if(S.cinematic.t>=EX.entry.duration)exFinishEntry();}

function exDamage(base,source){return base*(source==='ultimate'&&S.ultimate?S.ultimate.damageMultiplier:S.t<S.burstUntil?EX.burst.damageMultiplier:1);}
function exKnockback(e,damage){
  const before=e.z,amount=damage*S.knockUnit;
  e.z+=amount;
  // Move both patrol endpoints: interpolation must not erase the knockback next frame.
  if(e.patrol){e.patrol.fromDepth+=amount;e.patrol.target[1]+=amount;}
  // Open the window only after actual backward displacement.
  if(e.z>before){
    if(!S.dashGate||S.t>S.dashUntil)S.dashGate={depth:S.pd,retreat:false};
    S.dashUntil=S.t+EX.dash.window;
  }
}
function updateUltimate(dt){
  const a=S.ultimate;if(!a)return;a.t+=dt;
  const timings=EX.ultimate.hits;a.hits??=0;
  while(a.hits<timings.length&&a.t>=timings[a.hits]){
    const e=S.en.find(e=>e.boss&&!e.dead);a.hits++;
    if(e)hit(e,ULTIMATE.damage,1,'ultimate');
  }
  if(a.t>=ULTIMATE.duration)S.ultimate=null;
}
function drawUltimate(){}
function exDrawBurstAura(h){
 if(!S.run||S.defeat||S.t>=S.burstUntil)return false;
 const pulse=1+.045*Math.sin(S.t*7);
 c.save();c.globalCompositeOperation='lighter';c.scale(pulse,pulse);
 const glow=c.createRadialGradient(0,-h*.5,h*.08,0,-h*.5,h*.7);
 glow.addColorStop(0,'rgba(255,250,200,.10)');glow.addColorStop(.45,'rgba(255,224,110,.26)');glow.addColorStop(1,'rgba(255,217,90,0)');
 c.fillStyle=glow;c.beginPath();c.ellipse(0,-h*.5,h*.43,h*.66,0,0,Math.PI*2);c.fill();
 for(let i=0;i<9;i++){
  const phase=(S.t*.65+i/9)%1,x=Math.sin(i*2.4+S.t*.7)*h*(.22+.10*phase),y=-h*phase;
  c.globalAlpha=Math.sin(phase*Math.PI)*.8;c.fillStyle='#fff5bd';c.shadowColor='#ffd568';c.shadowBlur=10;
  c.beginPath();c.arc(x,y,h*.009,0,Math.PI*2);c.fill();
 }
 // Visual-only hashed randomness leaves combat RNG and attack selection unchanged.
 for(let i=0;i<14;i++){
  const clock=S.t*3.7+i*.731,cycle=Math.floor(clock),phase=clock-cycle;
  const random=n=>{const v=Math.sin((i+1)*127.1+cycle*311.7+n*74.7)*43758.5453;return v-Math.floor(v)};
  const x=(random(1)-.5)*h*.85,y=-h*(random(2)*.75+phase*.25),length=h*(.10+random(3)*.24);
  c.globalAlpha=Math.sin(phase*Math.PI)*.85;c.strokeStyle='#ffffff';c.lineWidth=1+random(4)*1.5;c.shadowColor='#ffffff';c.shadowBlur=6;
  c.beginPath();c.moveTo(x,y);c.lineTo(x,y-length);c.stroke();
 }
 c.restore();return true;
}
function exBurstFrame(t){const times=[0,.10,.22,.42,.66,.90,1.05,1.16];let i=0;while(i<7&&t+1e-9>=times[i+1])i++;return i;}
function exDrawHero(h){
 const a=S.ultimate,p=C(a.t/EX.ultimate.duration,0,1),e=S.en.find(e=>e.boss),img=im.heroBurst;
 if(!img.complete||!img.naturalWidth)return;
 const frame=exBurstFrame(a.t),sw=img.naturalWidth/4,sh=img.naturalHeight/2;
 const scale=h/430,travel=Math.sin(Math.PI*p);
 c.save();if(e)c.translate((lx(e.displayLane,e.z-S.z)-playerX())*travel,(yy(e.z-S.z)-playerY())*travel-h*.65*travel);
 exDrawBurstAura(h);
 // Supplied poses contain the forward somersault; no canvas rotation or redrawing.
 c.drawImage(img,(frame%4)*sw,Math.floor(frame/4)*sh,sw,sh,-sw*scale/2,-sh*scale,sw*scale,sh*scale);c.restore();
}
function exDrawEntry(){
 const t=S.cinematic.t,e=EX.entry,fade=C((t-e.fadeStart)/(e.duration-e.fadeStart),0,1);
 $('#bossIntro').style.opacity=String(1-E(fade));
 $('#bossIntroVideo').style.transform='scale('+(1.045-.045*E(C(t/e.duration,0,1)))+')';
 $('#bossIntroFlash').style.opacity=String(1-C(t/e.flash,0,1));
 $('#bossIntroBand').style.opacity=String(C((t-e.bandIn)/.3,0,1)*(1-fade));
}

function updateBoss(e,dt){
  const before=e.z,oldLane=e.displayLane;
  if(!e.action){
    if(!e.patrol){e.patrol={t:0,fromDepth:e.z,fromLane:e.displayLane,target:[bossRange(0,2),bossRange(9,15)],duration:bossRange(1.4,3.8)};}
    const p=e.patrol;p.t=Math.min(p.duration,p.t+dt);const q=E(p.t/p.duration);
    e.displayLane=p.fromLane+(p.target[0]-p.fromLane)*q;e.l=Math.round(e.displayLane);e.z=p.fromDepth+(p.target[1]-p.fromDepth)*q;e.stepClock=(e.stepClock||0)+dt*2;
    if(p.t>=p.duration)e.patrol=null;
  }
  if(!e.action){const dx=e.displayLane-oldLane,dz=e.z-before;if(Math.abs(dx)*3>Math.abs(dz))e.moveArt=dx<0?'left':'right';else if(Math.abs(dz)>.00001)e.moveArt=dz<0?'front':'back';}
e.exCd-=dt;
  if(!e.action){if(e.exCd<=0)exStartBossAttack(e);return;}
  exResolveBossAction(e,dt);
  if(e.action.age>=e.action.duration){e.action=null;e.tell=0;if(e.exCd<=0)exStartBossAttack(e);}
}

function exUI(){
  const el=$('#exStatus');if(el)el.textContent='';
}
function exDrawArena(){}
// BEGIN EX ART RUNTIME
// Supplied EX boss art and synchronized attacks. All world positions are absolute.
function exSprite(key){
 const spec=window.EX_SPRITES?.[key];if(!spec)return null;
 const id='exArt_'+key;if(!im[id]){im[id]=new Image;im[id].src='/Eta/ex/assets/'+key+'.webp';}
 return {spec,img:im[id]};
}
function exFrame(key,index,x,y,height,alpha=1){
 const item=exSprite(key);if(!item||!item.img.complete||!item.img.naturalWidth)return false;
 const {spec,img}=item,i=C(Math.floor(index),0,spec.frames.length-1),r=spec.frames[i];
 const [sx,sy,sw,sh]=r,ax=r[4]??sw/2,ay=r[5]??sh,scale=height/(r[6]??sh);
 c.save();c.globalAlpha*=alpha;c.translate(x-ax*scale,y-ay*scale);c.scale(scale,scale);
 const mask=spec.masks?.[i];if(mask){c.beginPath();mask.forEach(([px,py],j)=>j?c.lineTo(px,py):c.moveTo(px,py));c.closePath();c.clip();}
 c.drawImage(img,sx,sy,sw,sh,0,0,sw,sh);c.restore();return true;
}
function exPose(a){
 const q=C(a.age/a.duration,0,.99999);
 if(a.kind==='laser')return 0;
 const times={wide:[0,.08,.16,.24,.34,.44,.54,.64],dragon:[0,.07,.14,.22,.30,.38,.50,.64],fall:[0,.04,EX.attacks.fall.chargeStart,EX.attacks.fall.raiseTime,EX.attacks.fall.release,.72,.94,1.10],pillars:[0,.15,.30,.45,.80+EX.attacks.pillars.preFireHold,EX.attacks.pillars.release,EX.attacks.pillars.release+EX.attacks.pillars.interval,EX.attacks.pillars.release+EX.attacks.pillars.interval+.10]}[a.kind];
 const motionAge=a.age;
 let i=0;while(i<7&&motionAge+1e-9>=times[i+1])i++;return i;
}
function exBossPose(e){
 if(e.action)return {key:'motion'+({wide:1,dragon:2,fall:3,pillars:4,laser:5}[e.action.kind]),frame:exPose(e.action)};
 return {key:e.moveArt||'front',frame:0};
}
function exLaserPoseSample(a){return {i:0,next:0,mix:0};}

function exBossEyes(e){
 const h=bossHeight(e.z-S.z),a=e.action,sample=exLaserPoseSample(a),spec=window.EX_SPRITES.motion5;
 function point(i){const r=spec.frames[i],pt=spec.eyes[i],scale=h/r[6];return {x:(pt[0]-r[0]-r[4])*scale,y:(pt[1]-r[1]-r[5])*scale,gap:Math.max(2,10*scale)};}
 const p=point(sample.i),n=point(sample.next),q=sample.mix;
 return {x:lx(e.displayLane,e.z-S.z)+p.x+(n.x-p.x)*q,y:yy(e.z-S.z)+p.y+(n.y-p.y)*q,gap:p.gap};
}
function exDrawBoss(e,h){
 const pose=exBossPose(e);
 if(e.action?.kind==='laser'){const p=exLaserPoseSample(e.action);exFrame(pose.key,p.i,0,0,h,1-p.mix);if(p.mix)exFrame(pose.key,p.next,0,0,h,p.mix);}
 else exFrame(pose.key,pose.frame,0,0,h);
 const a=e.action;if(!a)return;
 const q=C(a.age/a.duration,0,1);
 if(a.kind==='fall'){
  const blade=exBlade(e,h),release=EX.attacks.fall.release,chargeStart=EX.attacks.fall.chargeStart,riseTime=EX.attacks.fall.riseTime;
  if(a.age>=chargeStart&&a.age<release){
   const p=C((a.age-chargeStart)/(release-chargeStart),0,1);exBladeFire(blade,'effect3',Math.min(3,Math.floor(p*4)),.5,p);
  }else if(a.age>=release&&a.age<release+riseTime){
   const p=(a.age-release)/riseTime;
   exFrame('effect3',Math.min(7,4+Math.floor(p*4)),blade.tip.x,blade.tip.y-h*1.8*p,h*.50,1-C((p-.75)/.25,0,1));
  }
 }
 if(a.kind==='pillars'){
  const blade=exBlade(e,h);
  if(a.age<.45){
   const p=E(a.age/.45);exFrame('effect4',Math.min(2,Math.floor(p*3)),blade.tip.x,blade.tip.y-h*.95*(1-p),h*(.55-.30*p));
  }else if(a.age<EX.attacks.pillars.release){
   // Extend the flame-on-sword hold by 0.3s before swinging and releasing.
   exBladeFire(blade,'effect4',a.age<.8+EX.attacks.pillars.preFireHold?3:4);
  }else{const p=(a.age-EX.attacks.pillars.release)/.4;if(p<1)exFrame('effect4',5+Math.min(2,Math.floor(p*3)),0,h*.04,h*.65,1-p*.6);}
 }
}
function exBlade(e,h){
 const pose=exBossPose(e),r=window.EX_SPRITES[pose.key].frames[pose.frame],scale=h/r[6];
 const points=e.action.kind==='fall'?
 [[30,115,230,150],[430,130,495,180],[781,20,780,159],[1104,20,1103,164],[150,613,150,748],[464,626,464,765],[670,730,831,780],[997,749,1160,778]]:
 [[30,75,231,146],[348,74,539,146],[658,75,852,148],[1108,30,1108,199],[163,680,163,839],[489,1210,489,1022],[802,1210,802,1022],[1104,636,1104,853]];
 const v=points[pose.frame];
 const point=(x,y)=>({x:(x-r[0]-r[4])*scale,y:(y-r[1]-r[5])*scale});
 return {tip:point(v[0],v[1]),base:point(v[2],v[3])};
}
function exBladeFire(blade,key,frame,widthRatio=.26,charge=null){
 const dx=blade.tip.x-blade.base.x,dy=blade.tip.y-blade.base.y,len=Math.hypot(dx,dy),width=len*widthRatio;
 c.save();c.translate(blade.base.x,blade.base.y);c.rotate(Math.atan2(dy,dx)+Math.PI/2);
 // Flame is confined to the blade; its base cannot spill below the hilt.
 c.beginPath();c.rect(-width/2,-len*1.05,width,len*1.05);c.clip();exFrame(key,frame,0,0,len*1.05);
 if(charge!==null){
  // Accumulating light follows the blade and remains above the hilt.
  c.globalCompositeOperation='lighter';c.globalAlpha=.25+.4*charge;
  const glow=c.createLinearGradient(0,0,0,-len);glow.addColorStop(0,'#ff450000');glow.addColorStop(.45,'#ff5a00aa');glow.addColorStop(1,'#ffe59eee');c.fillStyle=glow;c.fillRect(-width*.3,-len,width*.6,len);
 }
 c.restore();
}

function exFallPoint(l,z){
 // Fall telegraphs extend to the bottom edge; normal actor projection clamps at z=-1.
 const p=1/(1+z*.115);
 return {x:W/2+(l-1)*Math.min(W,520)*.27*p,y:H*HORIZON+H*GROUND_SPAN*p};
}
function exFallCells(reverse=false){
 const near=S.z+groundZ(1),far=front(),size=(far-near)/3;
 return [0,1,2].flatMap(row=>[0,1,2].filter(l=>(l+row)%2===(reverse?1:0)).map(l=>({l,z:near+(row+.5)*size,size})));
}
function exLaserLane(age){return 2.5-3*C((age-EX.attacks.laser.release)/EX.attacks.laser.active,0,1);}
function exCreateAttack(e,kind){
 const reverse=kind==='fallReverse';if(reverse)kind='fall';
 const cfg=EX.attacks[kind];
 const a={kind,l:S.l,targetZ:S.z+S.pd,age:0,impact:cfg.release,duration:cfg.duration,done:false,pillars:0,hitPlayer:false};
 if(kind==='dragon')a.l=Math.floor(bossRandom()*3);
 if(kind==='wide')a.targetZ=e.z-FRONT_GAP-BOSS_SLASH_DEPTH/2;
 if(kind==='fall'){a.reverse=reverse;a.cells=exFallCells(reverse);}
 return a;
}
function exResolveBossAction(e,dt){
 const a=e.action,cfg=EX.attacks[a.kind],before=a.age;a.age+=dt;e.tell=0;
 if(!a.soundStarted){a.soundStarted=true;if(a.kind==='fall')sound('bossFallRaise');if(a.kind==='pillars')sound('bossPillarRaise');}
 if(a.kind==='pillars'&&!a.impactSound&&a.age>=a.impact-.20){a.impactSound=true;sound('bossPillarImpact');}
 if(a.kind==='fall'&&!a.dropSound&&a.age>=a.impact+cfg.warning){a.dropSound=true;sound('bossFallDrop');}
 if(!a.done&&a.age>=a.impact){
  a.done=true;const cue={wide:'bossWide',dragon:'bossDragon',laser:'bossLaser'}[a.kind];if(cue)sound(cue);
  if(a.kind==='dragon')exSpawnBolt(e,a,a.l,'dragon',a.age-a.impact);
 }
 if(!a.done)return;
 if(a.kind==='wide'&&a.age<=a.duration)resolveBossWideHit(a);
 if(a.kind==='fall'){
  const landing=a.impact+cfg.warning+cfg.flight;
  if(!a.landed&&a.age>=landing){
   a.landed=true;
   for(const cell of a.cells)burst(cell.l,cell.z,'#ff6319',10);
   if(a.cells.some(cell=>Math.abs(S.ll-cell.l)<=.5&&Math.abs(S.z+S.pd-cell.z)<=cell.size/2))hurt(cfg.damage);
  }
 }
 if(a.kind==='pillars'){
  while(a.pillars<2&&a.age>=a.impact+a.pillars*cfg.interval){
   const release=a.impact+a.pillars*cfg.interval,lanes=a.pillars===0?[1]:[0,2];a.pillars++;
   sound('bossPillarFlight');
   for(const l of lanes)exSpawnBolt(e,a,l,'pillar',a.age-release);
  }
 }
 if(a.kind==='laser'&&!a.hitPlayer&&a.age>=cfg.release&&before<=cfg.release+cfg.active){
  // Swept continuous lane interval prevents tunneling at low frame rates.
  const lo=exLaserLane(a.age),hi=exLaserLane(Math.max(before,cfg.release));
  if(S.ll>=lo-.17&&S.ll<=hi+.17&&S.z+S.pd<e.z){hurt(cfg.damage);a.hitPlayer=true;}
 }
}
function exSpawnBolt(e,a,l,kind,elapsed){
 const cfg=kind==='pillar'?EX.attacks.pillars:EX.attacks.dragon;
 // Original Strash front travels from S.z+S.pd to S.z+45 in 0.2133333333s.
 const speed=kind==='pillar'?cfg.speedMultiplier*(cfg.strashFar-S.pd)/cfg.strashTravel:cfg.speed;
 S.exBolts??=[];S.exBolts.push({kind,l,z:e.z-speed*elapsed,previousZ:e.z,age:elapsed,speed,damage:cfg.damage,fresh:true});
}
function exUpdateBolts(dt){
 const bolts=S.exBolts||[];
 S.exTrails=(S.exTrails||[]).filter(f=>{f.age+=dt;return f.age<EX.attacks.pillars.trailLife;});
 for(const p of bolts){
  const before=p.previousZ??p.z;p.previousZ=undefined;const elapsed=p.fresh?0:dt;p.fresh=false;p.z-=p.speed*elapsed;p.age+=elapsed;
  if(p.kind==='pillar'&&elapsed>0){
   const spacing=EX.attacks.pillars.trailInterval;p.trailClock=(p.trailClock||0)+elapsed;
   while(p.trailClock>=spacing){p.trailClock-=spacing;
    S.exTrails.push({l:p.l,z:p.z+p.speed*p.trailClock,age:p.trailClock});
   }
  }
  const hero=S.z+S.pd;
  if(Math.abs(S.ll-p.l)<.48&&before>=hero-.3&&p.z<=hero+.3){p.dead=true;hurt(p.damage);}
  if(p.z<S.z-2)p.dead=true;
  if(!S.run)break;
 }
 S.exBolts=S.run?bolts.filter(p=>!p.dead):[];
 S.exTrails=S.run?S.exTrails.slice(-96):[];
}
function exStartBossAttack(e){
 const kinds=['wide','dragon','fall','pillars','laser'];let kind=kinds[Math.floor(bossRandom()*kinds.length)];
 // Alternate fall masks per encounter. Start with reverse so it appears on the first fall cast.
 if(kind==='fall'){kind=(e.fallCount||0)%2===0?'fallReverse':'fall';e.fallCount=(e.fallCount||0)+1;}
 e.action=exCreateAttack(e,kind);e.exCd=bossRange(...EX.attacks.interval);e.attackCount++;e.tell=0;
 // Movement starts immediately; contact/release occurs at the matching art frame.
 exResolveBossAction(e,0);
}
function exDrawBolts(){
 for(const f of S.exTrails||[]){
  const q=C(f.age/EX.attacks.pillars.trailLife,0,1),z=f.z-S.z;
  const width=lx(f.l+.5,z)-lx(f.l-.5,z);
  exFrame('effect4',7,lx(f.l,z),yy(z),width*(.85-.35*q),.48*(1-q));
 }
 for(const p of S.exBolts||[]){
  const z=p.z-S.z,scale=perspective(z),x=lx(p.l,z),y=yy(z);
  if(p.kind==='pillar'){
   const laneWidth=lx(p.l+.5,z)-lx(p.l-.5,z),spec=window.EX_SPRITES.pillar;
   const frame=p.l===1?0:p.l===0?1:2,r=spec.frames[frame];
   exFrame('pillar',frame,x,y,laneWidth*r[3]/r[2]);
  }else exFrame('effect2',Math.min(7,Math.floor(p.age/.08)),x,y,230*scale*Math.min(1,H/844));
 }
}
function exDrawWide(e,a){
 if(!a.done||a.age>=a.duration)return;
 const q=(a.age-a.impact)/(a.duration-a.impact),z=a.targetZ-S.z,w=lx(2.5,z)-lx(-.5,z);
 const frame=Math.min(7,Math.floor(q*8)),r=window.EX_SPRITES.effect1.frames[frame];
 exFrame('effect1',frame,W/2,yy(z)-bossHeight(e.z-S.z)*.10,w*r[3]/r[2],q>.8?(1-q)/.2:1);
}
function exDrawFall(a){
 const cfg=EX.attacks.fall;if(a.age<a.impact)return;
 const t=a.age-a.impact;
 for(const cell of a.cells){
  const z=cell.z-S.z,{x,y}=exFallPoint(cell.l,z);
  if(t<cfg.warning){
   const near=z-cell.size/2,far=z+cell.size/2;
   c.save();c.fillStyle='#ff252563';c.strokeStyle='#ff7777';c.lineWidth=1.5;c.beginPath();
   const corners=[exFallPoint(cell.l-.5,near),exFallPoint(cell.l+.5,near),exFallPoint(cell.l+.5,far),exFallPoint(cell.l-.5,far)];
   corners.forEach((p,i)=>i?c.lineTo(p.x,p.y):c.moveTo(p.x,p.y));c.closePath();c.fill();c.stroke();c.restore();
  }else if(t<cfg.warning+cfg.flight){
   const q=(t-cfg.warning)/cfg.flight,h=170*perspective(z)*Math.min(1,H/844),img=im.fireDragon;
   if(img.complete&&img.naturalWidth)c.drawImage(img,x-h/3,y-h-(1-q)*H*.65,h*2/3,h);
  }else{
   const q=C((t-cfg.warning-cfg.flight)/.2,0,1);exFrame('effect4',5,x,y,150*perspective(z),1-q);
  }
 }
}
function exDrawLaser(e,a){
 const cfg=EX.attacks.laser,eyes=exBossEyes(e),p=(a.age-cfg.release)/cfg.active;
 if(p<0){exFrame('effect5',a.age<.04?1:2,eyes.x,eyes.y+2,4);return;}
 if(p>1)return;
 const endLane=exLaserLane(a.age),ty=H,item=exSprite('effect5');
 // Pass through the same lane/torso plane used by the hit test, then extend.
 const targetY=playerY()-playerHeight()*.4,targetX=lx(endLane,S.pd);
 const extension=(ty-eyes.y)/Math.max(1,targetY-eyes.y),tx=eyes.x+(targetX-eyes.x)*extension;
 const rect=item.spec.beamPatch,fade=p>.9?(1-p)/.1:1;
 c.save();c.globalAlpha*=fade;
 for(const sign of [-1,1]){
  const ox=eyes.x+sign*eyes.gap,oy=eyes.y,dx=tx+sign*4-ox,dy=ty-oy,len=Math.hypot(dx,dy),width=Math.max(5,W*.017);
  c.save();c.translate(ox,oy);c.rotate(Math.atan2(dy,dx));
  const startWidth=Math.max(.6,eyes.gap*.22);
  function taper(w0,w1){c.beginPath();c.moveTo(0,-w0/2);c.lineTo(len,-w1/2);c.lineTo(len,w1/2);c.lineTo(0,w0/2);c.closePath();}
  c.shadowColor='#ff3b0b';c.shadowBlur=3;c.fillStyle='#ff4818';taper(startWidth,width*1.3);c.fill();
  c.save();taper(startWidth,width);c.clip();
  if(item.img.complete&&item.img.naturalWidth)c.drawImage(item.img,...rect,0,-width/2,len,width);
  c.restore();c.shadowBlur=0;c.fillStyle='#fff4a1';taper(startWidth*.5,width*.24);c.fill();c.restore();
 }
 exFrame('effect5',2,eyes.x,eyes.y+2,4);
 exFrame('effect4',5,tx,ty,48,.8);c.restore();
}
function exDrawAttackEffects(){
 const e=S.en.find(e=>e.boss&&!e.dead),a=e?.action;if(!a||S.cinematic)return;
 if(a.kind==='wide')exDrawWide(e,a);
 if(a.kind==='fall')exDrawFall(a);
 if(a.kind==='laser')exDrawLaser(e,a);
}

// END EX ART RUNTIME

reset();function loop(t){let dt=last?Math.min(.033,(t-last)/1000):0;last=t;step(dt);draw();requestAnimationFrame(loop)}requestAnimationFrame(loop)})();
