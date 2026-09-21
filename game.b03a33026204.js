(()=>{const $=s=>document.querySelector(s),cv=$('#game'),c=cv.getContext('2d');let W,H,last=0,S,combatSeed=17319;function random(){combatSeed=(Math.imul(combatSeed,1664525)+1013904223)>>>0;return combatSeed/4294967296}const C=(v,a,b)=>Math.max(a,Math.min(b,v)),R=(a,b)=>a+random()*(b-a),RI=(a,b)=>Math.floor(R(a,b+1)),E=t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;const D={slime:{hp:2,d:1,r:0,h:205},skeleton:{hp:3,d:2,r:0,h:220},mage:{hp:3,d:2,r:1,h:228},bonobo:{hp:4,d:4,r:0,h:245},dragon:{hp:4,d:3,r:1,h:215}},im={};const src={hero:'assets/hero.webp',slime:'assets/suraimu.png',skeleton:'assets/がいこつ.png',mage:'assets/mahoutukai.png',bonobo:'assets/bonobo.png',dragon:'assets/minidoragonn.png',body:'hero_body.png.png',upper:'hero_arm1.png',fore:'hero_arm2.png',hand:'hero_hand.png',shoulder:'hero_shoulder.png',sword:'assets/hero_sword_motion.png',forest:'assets/forest-background.webp',forestTrees:'assets/forest-trees-gpt-v1.webp',forestGround:'assets/forest-ground-gpt-v1.webp',poses:'assets/hero-motion-sheet.png',waterSheet:'assets/water-slash-gpt-v3.webp',earthSheet:'assets/earth-slash-gpt-v1.webp',heroSkills:'assets/hero-skills-gpt-v1.webp',heroRun:'assets/hero-run-gpt-v2.webp',heroGuard:'assets/hero-guard-gpt-v1.webp',guardImpact:'assets/guard-impact-gpt-v1.webp'};for(const k in src){im[k]=new Image;im[k].src=src[k]}
function size(){const v=window.visualViewport;W=v?v.width:innerWidth;H=v?v.height:innerHeight;const frame=$('#gameViewport');frame.style.width=W+'px';frame.style.height=H+'px';frame.style.top=(v?v.offsetTop:0)+'px';frame.style.left=(v?v.offsetLeft:0)+'px';let d=Math.min(devicePixelRatio||1,2);cv.width=W*d;cv.height=H*d;c.setTransform(d,0,0,d,0,0)}addEventListener('resize',size);if(window.visualViewport){window.visualViewport.addEventListener('resize',size);window.visualViewport.addEventListener('scroll',size)}size();function sh(a){for(let i=a.length-1;i;i--){let j=RI(0,i);[a[i],a[j]]=[a[j],a[i]]}return a}function mk(t,z){return{t,z,l:RI(0,2),hp:D[t].hp,max:D[t].hp,dead:0,cd:R(1.8,3.8),tell:0,mv:R(.7,2),fl:0}}function roster(){let a=[],e=sh([...Array(3).fill('slime'),...Array(3).fill('skeleton')]),r=sh([...Array(6).fill('slime'),...Array(6).fill('skeleton'),...Array(6).fill('mage'),...Array(3).fill('bonobo'),...Array(3).fill('dragon')]);e.forEach((t,i)=>a.push(mk(t,18+i*6+R(-1,1))));r.forEach((t,i)=>a.push(mk(t,56+i*135/23+R(-1,1))));return a}function reset(){combatSeed=17319;S={run:0,pause:0,t:0,hp:20,dmg:0,dealtDamage:0,overkill:0,z:0,l:1,guard:0,guardPose:0,guardImpact:0,introRun:0,ch:[5,5],fr:[0,0],skill:null,fin:0,dashUntil:-1,dash:null,boost:0,normalAttack:null,norm:0,en:roster(),shots:[],ptr:null,hit:0,pd:0,pt:0,notice:null,ll:1,fx:[],waves:[],waterFx:[],earthFx:[],combo:0,comboTime:0,shake:0,speed:0,runPhase:0,retreat:0};hideNotice();ui()}function ui(){const hpRatio=C(S.hp/20,0,1),hpColor='hsl('+(120*hpRatio)+',100%,50%)';$('#hp').textContent=Math.ceil(C(S.hp,0,20))+'/20';$('#hpf').style.width=(hpRatio*100)+'%';$('#hpf').style.background=hpColor;$('#hpbar').style.background=hpRatio===0?'#ff0000':'#17212b';$('#hpbar').style.borderColor=hpColor;$('#time').textContent=S.t.toFixed(1);$('#fin').textContent=S.fin;$('#kills').textContent=S.en.filter(e=>e.dead).length;for(let i=0;i<2;i++){
  // The original five charges remain unchanged; show partial recharge too.
  const fill=C((S.ch[i]+(S.ch[i]<5?S.fr[i]:0))/5,0,1);
  $('#g'+(i+1)).style.strokeDashoffset=String(100*(1-fill));
  const button=$('#s'+(i+1));
  if(button._charges!==S.ch[i]){
    button._charges=S.ch[i];
    button.setAttribute('aria-label',(i===0?'水波斬':'大陸斬')+'：残り'+S.ch[i]+'回');
    button.setAttribute('aria-disabled',String(S.ch[i]<1));
  }
}}// pd/pt are player depth in the same world units as enemy.z and stage S.z.
const HORIZON=.26,GROUND_SPAN=.49,RUN_SPEED=9;
const MAX_DEPTH=(GROUND_SPAN/(.46-HORIZON)-1)/.115, FRONT_GAP=.7;
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
  const moved=Math.min(n,Math.max(0,front()-S.z-S.pd-FRONT_GAP));
  const target=S.retreat>0?S.pd:(S.dash||S.boost>0?DASH_DEPTH:RUN_DEPTH);
  // Split world travel between the character and the following camera.
  // Their sum remains exactly the travelled distance, including at contact.
  const depthMove=target>S.pd?Math.min(target-S.pd,moved*.65):Math.max(target-S.pd,-n*.65);
  S.pd+=depthMove;S.z+=moved-depthMove;
  if(!S.retreat)S.pt=target;
  return moved;
}
function sound(kind,type){if(window.GameSFX)window.GameSFX.play(kind,type)}function hurt(n){if(S.guard){S.guardImpact=.38;return;}S.combo=0;S.shake=.18;burst(S.l,S.z+S.pd,'#ff7563',12);sound('hurt');S.hp-=n;S.dmg+=n;S.hit=.15;if(S.hp<=0)end(0)}function hit(e,n,sk){if(e.dead)return;S.dealtDamage+=Math.min(Math.max(0,e.hp),n);S.overkill+=Math.max(0,n-Math.max(0,e.hp));sound('hit',e.t);e.hp-=n;e.fl=.12;S.combo++;S.comboTime=2;S.fx.push({kind:'number',l:e.l,z:e.z,n:n,t:0,life:.8,color:sk?'#fff079':'#ffffff'});burst(e.l,e.z,sk?'#b5f7ff':'#ffffff',9);S.shake=sk?.08:.035;if(e.tell>0){e.tell=0;e.cd=R(1.8,3.8)}if(e.hp<=0){e.dead=1;e.fade=.4;burst(e.l,e.z,'#ffdfa0',18);sound('down',e.t);S.dashUntil=S.t+.5;if(sk)S.fin++}}function hideNotice(){const n=$('#actionName');n.style.opacity='0';n.classList.remove('moveArrow');if(S)S.notice=null}
// Compact skill label, styled to match the forest HUD.
function notice(text,seconds,arrow=false){
  const plate=text==='水波斬'||text==='大陸斬';
  S.notice={text,left:seconds,total:seconds,arrow,plate};const n=$('#actionName');
  n.classList.toggle('nameplate',plate);n.classList.toggle('moveArrow',arrow);
  n.style.width='';n.style.height='';
  if(plate){
    n.innerHTML='<span class="plaque-name">'+text+'</span>';
  }else n.textContent=text;
  n.style.opacity='1';placeNotice();
}
function noticePosition(){return {x:playerX(),y:Math.max(88,playerY()-playerHeight()*1.36-36)}}
function placeNotice(){
  if(!S.notice)return;const state=S.notice,n=$('#actionName'),pos=noticePosition(),age=state.total-state.left;
  n.style.left=pos.x+'px';n.style.top=pos.y+'px';
  const entrance=C(age/.12,0,1),scale=state.plate?.97+.03*E(entrance):1;
  const lift=state.plate?(1-E(entrance))*3:0;
  n.style.transform='translate(-50%,calc(-100% + '+lift+'px)) scale('+scale+')';n.style.transformOrigin='50% 100%';
  n.style.opacity=String(Math.min(1,age/.07,state.left/.13));
}
function flash(button){button.classList.remove('flash');void button.offsetWidth;button.classList.add('flash')}
function fire(k){
  if(!S.run||S.pause||S.skill||S.ch[k-1]<1)return;
  S.guard=0;S.normalAttack=null;S.ch[k-1]--;S.skill={k,l:S.l,t:0,d:k===1?.68:.82,done:0};
  sound(k===1?'waterStart':'continentStart');
  notice(k===1?'水波斬':'大陸斬',k===1?.68:.82);
}
function lane(d){
  const next=C(S.l+d,0,2);if(next===S.l)return;
  S.dash=null;S.l=next;notice(d<0?'←':'→',.3,true);
}
// One kill opens one inclusive 0.5-second window on the active game clock.
function accelerate(){
  if(!S.run||S.pause)return;
  if(S.dashUntil>=0&&S.t<=S.dashUntil+1e-9){
    S.dash={n:10};S.dashUntil=-1;S.boost=0;
  }else S.boost=1;
}
function depth(d){S.retreat=1;S.pt=C(S.pd+d,0,depthLimit())}

function step(dt){
  if(!S.run||S.pause)return;
  S.guardImpact=Math.max(0,S.guardImpact-dt);
  S.guardPose=C(S.guardPose+(S.guard?dt/.20:-dt/.16),0,1);
  const previousZ=S.z+S.pd;S.t+=dt;if(S.introRun&&S.t>=3){S.en=roster();const offset=S.z+S.pd+24;for(const e of S.en)e.z+=offset;S.introRun=0;}S.ll+=(S.l-S.ll)*(1-Math.exp(-18*dt));
  S.normalFlash=Math.max(0,(S.normalFlash||0)-dt);S.shake=Math.max(0,S.shake-dt);S.comboTime=Math.max(0,S.comboTime-dt);if(!S.comboTime)S.combo=0;
  for(const f of S.fx)f.t+=dt;S.fx=S.fx.filter(f=>f.t<f.life);
  for(const e of S.en)if(e.dead)e.fade=Math.max(0,(e.fade||0)-dt);
  for(const f of S.waterFx)f.age+=dt;S.waterFx=S.waterFx.filter(f=>f.age<.60);
  for(const f of S.earthFx)f.age+=dt;S.earthFx=S.earthFx.filter(f=>f.age<.95);
  updateWaves(dt);S.hit=Math.max(0,S.hit-dt);
  if(S.notice){S.notice.left-=dt;if(S.notice.left<=0)hideNotice()}
  for(let i=0;i<2;i++)if(S.ch[i]<5){S.fr[i]+=dt/5;if(S.fr[i]>=1){S.fr[i]--;S.ch[i]++}}
  if(!S.guard){
    if(S.dash){const requested=Math.min(S.dash.n,42*dt),v=adv(requested);S.dash.n-=v;if(v<requested-.0001||S.dash.n<=.0001)S.dash=null}
    else adv((dt+Math.min(dt,S.boost))*RUN_SPEED);
  }
  S.boost=Math.max(0,S.boost-dt);
  const travelled=S.z+S.pd-previousZ;S.speed=dt>0?travelled/dt:0;S.runPhase+=Math.max(0,travelled)*1.35;
  // Update the moving front before resolving any attacks against player depth.
  for(const e of S.en){
    if(e.dead)continue;e.fl=Math.max(0,e.fl-dt);
    const stageDistance=e.z-S.z;if(stageDistance>42||stageDistance<-2)continue;
    e.mv-=dt;
    if(e.mv<=0&&e.tell<=0){
      if(random()<.6)e.l=C(e.l+(random()<.5?-1:1),0,2);
      e.dz=(e.dz||0)+R(-.3,.12);e.mv=R(.7,2);
    }
    const shift=C(e.dz||0,-2*dt,2*dt);e.dz=(e.dz||0)-shift;
    e.z=Math.max(S.z+FRONT_GAP,e.z+shift-.1*dt);
  }
  updateDepth(dt);
  if(S.skill){
    S.skill.t+=dt;let p=S.skill.t/S.skill.d;
    if(S.skill.k===1&&!S.skill.visual&&p>.27){S.skill.visual=1;S.waterFx.push({age:0,l:S.l})}
    if(!S.skill.done&&p>(S.skill.k===1?.48:.54)){
      S.skill.done=1;sound(S.skill.k===1?'waterSwing':'continentSwing');
      S.waves.push({k:S.skill.k,l:S.l,z:S.z+S.pd,origin:S.z+S.pd,travel:0,seen:new Set()});
      if(S.skill.k===2)S.earthFx.push({age:0,l:S.l,z:S.z+S.pd+1.2});
    }
    if(S.skill.t>=S.skill.d)S.skill=null;
  }
  let con=S.en.find(e=>!e.dead&&e.l===S.l&&distance(e)<=1.05&&distance(e)>=-.1);
  S.norm=Math.max(0,S.norm-dt);
  if(S.skill||S.guard)S.normalAttack=null;
  if(con&&!S.skill&&!S.guard&&!S.normalAttack&&S.norm<=0){
    S.normalAttack={k:1,t:0,d:.5,done:0,target:con};S.norm=2;
  }
  if(S.normalAttack){
    const a=S.normalAttack;a.t+=dt;
    if(!a.done&&a.t>=a.d*.48){
      a.done=1;const e=a.target;
      if(!e.dead&&e.l===S.l&&distance(e)>=-.1&&distance(e)<=1.05){S.normalFlash=.18;hit(e,1,0)}
    }
    if(a.t>=a.d)S.normalAttack=null;
  }
  for(const e of S.en){
    if(e.dead)continue;
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
    p.z-=18*dt;
    if(distance(p)<=.35){if(p.l===S.l)hurt(p.d);p.dead=1;if(!S.run){ui();return}}
  }
  S.shots=S.shots.filter(p=>!p.dead);
  if(!S.introRun&&!S.en.some(e=>!e.dead))end(1);
  ui();
}

// Shared projective ground coordinates: hero, enemies, projectiles and effects.
function perspective(z){return 1/(1+Math.max(-1,z)*.115)}
function lx(l,z){return W/2+(l-1)*Math.min(W,520)*.27*perspective(z)}
function yy(z){return H*HORIZON+H*GROUND_SPAN*perspective(z)}
function playerY(){return yy(S.pd)}
function playerX(){return lx(S.ll,S.pd)}
function playerHeight(){return Math.min(H*.34,290)*perspective(S.pd)}
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
function drawGuardImpact(){
  const img=im.guardImpact;if(S.guardImpact<=0||!img.complete||!img.naturalWidth)return;
  const h=playerHeight(),height=h*.65,w=height*img.naturalWidth/img.naturalHeight;
  c.save();c.globalAlpha=.65*Math.min(1,S.guardImpact/.12);
  c.drawImage(img,lx(S.l,S.pd)-w/2,playerY()-h*1.25,w,height);c.restore();
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
  if(!S.run||S.t>=1.6)return;
  const t=S.t,enter=C(t/.22,0,1),leave=C((t-1.15)/.45,0,1),x=W*(1-enter)-W*leave;
  c.save();c.globalAlpha=Math.min(1,enter*2)*(1-leave);c.translate(x,H*.32);
  const g=c.createLinearGradient(0,0,W,0);g.addColorStop(0,'#122b2900');g.addColorStop(.2,'#122b29ee');g.addColorStop(.8,'#122b29ee');g.addColorStop(1,'#122b2900');c.fillStyle=g;c.fillRect(0,-32,W,64);
  c.fillStyle='#d9c795';c.fillRect(W*.12,-32,W*.76,1);c.fillRect(W*.12,31,W*.76,1);
  c.textAlign='center';c.textBaseline='middle';c.font='bold 28px serif';c.fillStyle='#fff5d9';c.fillText('戦闘開始',W/2,0);c.restore();
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
let forestLayer=null,forestKey='';
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
  // Keep the existing forest as a fallback while the painting loads.
  const d=Math.min(devicePixelRatio||1,2),key=W+':'+H+':'+d;
  if(forestKey!==key){
    forestLayer=document.createElement('canvas');forestLayer.width=Math.round(W*d);forestLayer.height=Math.round(H*d);
    const f=forestLayer.getContext('2d');f.setTransform(d,0,0,d,0,0);
    const vx=W*.5,vy=H*HORIZON;
    // Local deterministic texture: never consume the combat RNG.
    const noise=n=>{let x=Math.imul(n+71,374761393);x=Math.imul(x^(x>>>13),1274126177);return ((x^(x>>>16))>>>0)/4294967296};
    const ground=p=>vy+H*GROUND_SPAN*p;
    function shape(points,color){f.fillStyle=color;f.beginPath();points.forEach((a,i)=>i?f.lineTo(...a):f.moveTo(...a));f.closePath();f.fill()}
    function oval(x,y,rx,ry,color){f.fillStyle=color;f.beginPath();f.ellipse(x,y,Math.max(.1,rx),Math.max(.1,ry),0,0,Math.PI*2);f.fill()}
    let g=f.createLinearGradient(0,0,0,H);g.addColorStop(0,'#254c46');g.addColorStop(.18,'#bdd2b0');g.addColorStop(.34,'#71916d');g.addColorStop(1,'#172e23');f.fillStyle=g;f.fillRect(0,0,W,H);
    // Pale distant trunks and opening through the forest.
    for(let i=0;i<46;i++){
      const x=noise(i)*W,w=2+noise(i+50)*4,h=H*(.13+noise(i+80)*.17);
      f.fillStyle='rgba(49,84,67,.22)';f.fillRect(x,vy-h,w,h+H*.10);
    }
    g=f.createRadialGradient(vx,vy,0,vx,vy,W*.40);g.addColorStop(0,'rgba(229,240,194,.82)');g.addColorStop(1,'rgba(195,218,169,0)');f.fillStyle=g;f.fillRect(0,0,W,H*.48);
    // Road and two faint wheel tracks converge at exactly (vx, vy).
    g=f.createLinearGradient(0,vy,0,H);g.addColorStop(0,'#adb493');g.addColorStop(.45,'#8f906c');g.addColorStop(1,'#69654a');
    const bottomP=(H-vy)/(H*GROUND_SPAN),edge=W*.30;
    shape([[vx,vy],[vx+edge*bottomP,H],[vx-edge*bottomP,H]],g);
    for(const side of [-1,1]){
      shape([[vx,vy],[vx+side*W*.135*bottomP,H],[vx+side*W*.110*bottomP,H]],'rgba(213,206,163,.10)');
      shape([[vx,vy],[vx+side*edge*bottomP,H],[vx+side*(edge+W*.025)*bottomP,H]],'rgba(145,164,82,.5)');
    }
    for(let i=0;i<150;i++){
      const p=.07+noise(i+150)*1.45,x=vx+(noise(i+340)*2-1)*edge*p*.91,y=ground(p);
      oval(x,y,(.7+noise(i+540)*2.8)*p,.55*p,i%3?'rgba(224,210,163,.12)':'rgba(33,47,31,.16)');
    }
    // Draw trees from far to near. Their bases, height and width all use p.
    for(let row=0;row<14;row++)for(const side of [-1,1]){
      const seed=row*31+(side+1)*19,p=.09+row*.093;
      const x=vx+side*W*(.39+noise(seed)*.13)*p,y=ground(p);
      const h=H*(.61+noise(seed+1)*.13)*p,w=W*(.031+noise(seed+2)*.026)*p,lean=-side*w*.7;
      const fade=C(p,0,1),trunk=`rgb(${Math.round(57-28*fade)},${Math.round(76-32*fade)},${Math.round(56-26*fade)})`;
      oval(x,y+3*p,w*2.5,5*p,'rgba(14,34,22,.30)');
      shape([[x-w*.6,y],[x-w*.36+lean,y-h],[x+w*.24+lean,y-h],[x+w*.6,y]],trunk);
      shape([[x-w*.26,y],[x-w*.12+lean,y-h],[x+w*.08+lean,y-h],[x+w*.05,y]],'rgba(175,175,110,.18)');
      for(let branch=0;branch<3;branch++){
        const by=y-h*(.51+branch*.16),bx=x+lean*(.5+branch*.15),dir=branch%2?side:-side;
        f.strokeStyle=trunk;f.lineWidth=Math.max(1,w*(.32-branch*.065));f.lineCap='round';f.beginPath();f.moveTo(bx,by);f.quadraticCurveTo(bx+dir*w*1.6,by-h*.05,bx+dir*w*3,by-h*.18);f.stroke();
      }
      // Interlocking leaf masses create a canopy, keeping the central road open.
      for(let leaf=0;leaf<9;leaf++){
        const a=noise(seed+leaf+70)*Math.PI*2,cx=x+lean+Math.cos(a)*w*3.4,cy=y-h+Math.sin(a)*h*.075;
        const colors=['#254e36','#315e3c','#3e6c43','#4d7950'];
        oval(cx,cy,w*(2.2+noise(seed+leaf+100)*1.4),h*.105,colors[(leaf+row)%4]);
      }
      for(let root=0;root<3;root++){
        shape([[x-w*.4,y-2*p],[x+(root-1)*w*2.3,y+7*p],[x+w*.5,y]],trunk);
      }
      // Roadside ferns and grass, outside the three playable lanes.
      for(let tuft=0;tuft<5;tuft++){
        const tx=x+(tuft-2)*w*.7,ty=y+noise(seed+tuft+210)*8*p;
        f.strokeStyle=tuft%2?'#70904a':'#42673b';f.lineWidth=Math.max(.7,1.2*p);
        for(let blade=-1;blade<=1;blade++){f.beginPath();f.moveTo(tx,ty);f.quadraticCurveTo(tx+blade*5*p,ty-8*p,tx+blade*9*p,ty-12*p);f.stroke()}
      }
    }
    // Gentle shafts of light and far haze add depth without covering combat.
    shape([[W*.20,0],[W*.26,0],[W*.73,H*.70],[W*.53,H*.70]],'rgba(230,239,171,.045)');
    shape([[W*.62,0],[W*.64,0],[W*.35,H*.51],[W*.27,H*.51]],'rgba(230,239,171,.035)');
    forestKey=key;
  }
  c.drawImage(forestLayer,0,0,forestLayer.width,forestLayer.height,0,0,W,H);
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
function armoredReady(){return im.heroSkills.complete&&im.heroSkills.naturalWidth>0&&im.heroRun.complete&&im.heroRun.naturalWidth>0}
function armoredFrame(sheet,index,h,running=false,alpha=1){
  const cols=4,rows=running?2:4,cw=sheet.naturalWidth/cols,ch=sheet.naturalHeight/rows;
  const a=running?[[172,499],[177,499],[173,499],[176,498],[173,490],[174,490],[178,491],[177,490]][index]:ARMORED_ANCHORS[index];
  const scale=h/(running?450:260);
  c.save();c.globalAlpha*=alpha;
  if(running){
    const hip=ch*.53,lean=.70,sx=index%4*cw,sy=Math.floor(index/4)*ch;
    // Foreshorten the upper body toward the running direction, keep legs grounded.
    c.drawImage(sheet,sx,sy,cw,hip,-a[0]*scale,(-a[1]+hip*(1-lean))*scale,cw*scale,hip*lean*scale);
    c.drawImage(sheet,sx,sy+hip,cw,ch-hip,-a[0]*scale,(-a[1]+hip)*scale,cw*scale,(ch-hip)*scale);
  }else c.drawImage(sheet,(index%4)*cw,Math.floor(index/4)*ch,cw,ch,-a[0]*scale,-a[1]*scale,cw*scale,ch*scale);
  c.restore();
}
function drawGuardHero(h){
  const sheet=im.heroGuard,cw=sheet.naturalWidth/4,ch=sheet.naturalHeight;
  const frame=Math.min(3,Math.floor(S.guardPose*4)),scale=h/(ch*.96);
  c.drawImage(sheet,frame*cw,0,cw,ch,-cw*.46*scale,-ch*.985*scale,cw*scale,ch*scale);
}
function drawArmoredHero(h){
  const action=S.skill||S.normalAttack;
  if((S.guard||S.guardPose>0)&&im.heroGuard.complete&&im.heroGuard.naturalWidth){drawGuardHero(h);
  }else if(action){
    const p=C(action.t/action.d,0,1),i=poseFrame(action.k,p),settle=C((p-.88)/.12,0,1);
    armoredFrame(im.heroSkills,i,h,false,1-settle);
    if(settle>0)armoredFrame(im.heroSkills,0,h,false,settle);
  }else if(!S.guard&&S.speed>.05){
    const cycle=((S.runPhase/(Math.PI*2))%1+1)%1*8;
    const i=Math.floor(cycle),blend=C((cycle-i-.8)/.2,0,1);
    armoredFrame(im.heroRun,i,h,true,1-blend);
    if(blend>0)armoredFrame(im.heroRun,(i+1)%8,h,true,blend);
  }else armoredFrame(im.heroSkills,0,h);
  // The generated descending arc ends exactly where the ground effect begins.
  if(S.skill&&S.skill.k===2&&earthSheetReady()){
    const q=(S.skill.t/S.skill.d-.30)/.24;
    if(q>=0&&q<1){c.save();c.translate(h*.07,-h*.02);earthSprite(q<.40?0:1,h*1.45,Math.min(1,q*4));c.restore()}
  }
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
function draw(){
  placeNotice();c.clearRect(0,0,W,H);bg();c.save();
  if(S.shake)c.translate(Math.sin(S.t*110)*S.shake*22,Math.cos(S.t*93)*S.shake*12);
  // Motion flecks on the path use the same perspective as the combatants.
  c.fillStyle='#eadfb72b';for(let i=0;i<24;i++){let z=((i*2.7-S.z)%64.8+64.8)%64.8-3,p=1/(1+z*.115);c.fillRect(W/2+((i%3)-1)*W*.23*p,H*HORIZON+H*GROUND_SPAN*p,2*p,5*p)}
  frontline();
  for(const e of S.en.filter(e=>(!e.dead||e.fade>0)&&e.z-S.z>-2&&e.z-S.z<45).sort((a,b)=>b.z-a.z)){
    const z=e.z-S.z,p=perspective(z),img=im[e.t],x=lx(e.l,z),y=yy(z),h=D[e.t].h*p*Math.min(1,H/844)*.77;
    if(!img.complete||!img.naturalWidth)continue;const rect=crop(img),w=h*rect[2]/rect[3];
    c.save();c.translate(x,y);c.globalAlpha=e.dead?e.fade/.4:1;
    c.fillStyle='#07171966';c.beginPath();c.ellipse(0,0,w*.33,8*p,0,0,7);c.fill();
    if(e.tell>0&&!e.dead){c.strokeStyle='#ff785c';c.lineWidth=2;c.beginPath();c.ellipse(0,0,40*p,12*p,0,0,7);c.stroke();c.fillStyle='#ffd48e';c.font='bold 22px sans-serif';c.textAlign='center';c.fillText('!',0,-h-18)}
    if(e.fl)c.globalAlpha*=.6;c.drawImage(img,...rect,-w/2,-h,w,h);c.restore();
    if(!e.dead){c.fillStyle='#10202c';c.fillRect(x-25*p,y-h-10,50*p,5);c.fillStyle='#f6c977';c.fillRect(x-25*p,y-h-10,50*p*e.hp/e.max,5)}
  }
  drawWaves();
  for(const shot of S.shots){const z=shot.z-S.z,p=perspective(z),x=lx(shot.l,z),y=yy(z)-45*p;c.save();c.fillStyle=shot.t==='mage'?'#bd79ff':'#ff873d';c.shadowColor=c.fillStyle;c.shadowBlur=18;c.beginPath();c.arc(x,y,9*p+2,0,7);c.fill();c.restore()}
  drawWaterEffect(false);drawGuardImpact();
  const x=playerX(),y=playerY(),h=playerHeight(),img=im.hero;c.save();c.translate(x,y);
  c.fillStyle='#06111b66';c.beginPath();c.ellipse(0,0,h*.25,h*.04,0,0,7);c.fill();
  if(armoredReady())drawArmoredHero(h);else if(img.complete&&img.naturalWidth){const rect=crop(img),w=h*rect[2]/rect[3];c.drawImage(img,...rect,-w/2,-h,w,h)}c.restore();drawWaterEffect(true);drawEffects();c.restore();drawBattleBanner();
  if(S.hit){c.fillStyle='rgba(255,80,60,.12)';c.fillRect(0,0,W,H)}
}
const SCORE_KEY='eta.score.v2';
function score(ok){
  const skill=S.fin*1000,time=ok?Math.floor(600000/Math.max(1,S.t)):0;
  const damage=ok?Math.max(0,10000-Math.round(S.dmg*500)):0;
  const dealt=Math.floor(S.dealtDamage*100),overkill=Math.floor(S.overkill*100);
  return{skill,time,damage,dealt,overkill,total:skill+time+damage+dealt+overkill};
}
function highScore(){try{const n=Number(localStorage.getItem(SCORE_KEY));return Number.isFinite(n)&&n>=0?n:0}catch{return 0}}
function saveHighScore(n){try{localStorage.setItem(SCORE_KEY,String(n))}catch{}}
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
  if(window.GameSFX)window.GameSFX.finish();S.run=0;S.ptr=null;S.guard=0;hideNotice();
  const points=score(ok),previous=highScore();
  if(ok&&points.total>previous)saveHighScore(points.total);
  $('#resultTitle').textContent=ok?'クエスト結果':'クエスト失敗';
  $('#resultText').innerHTML=
    resultRow('クリアタイム','クリアタイム（秒）',ok?S.t.toFixed(2):'—',points.time)+
    resultRow('スキルフィニッシュ','スキルフィニッシュ回数',S.fin,points.skill)+
    resultRow('総被ダメージ','総被ダメージ',S.dmg.toLocaleString('ja-JP'),points.damage)+
    resultRow('与ダメージ','総与ダメージ',(S.dealtDamage+S.overkill).toLocaleString('ja-JP'),points.dealt+points.overkill);
  $('#totalScore').textContent=points.total.toLocaleString('ja-JP');
  $('#result').classList.remove('hide');$('#result').scrollTop=0;fitResult();
  if(window.GameBGM)window.GameBGM.fadeOut();
}
function beginRun(){reset();S.en=[];S.introRun=1;S.run=1;}
function start(){if(window.GameSFX)window.GameSFX.start();beginRun();last=performance.now();$('#intro').classList.add('hide');if(window.GameBGM)window.GameBGM.start()}$('#start').onclick=start;$('#retry').onclick=()=>{if(window.GameSFX)window.GameSFX.start();beginRun();last=performance.now();$('#result').classList.add('hide');if(window.GameBGM)window.GameBGM.start()};// Own each gesture by pointerId; button fingers cannot finish a canvas swipe.
for(const id of ['#guard','#s1','#s2']){
  const button=$(id);
  button.addEventListener('contextmenu',e=>e.preventDefault());
  button.addEventListener('dragstart',e=>e.preventDefault());
  button.addEventListener('animationend',()=>button.classList.remove('flash'));
  button.onpointerdown=e=>{
    e.preventDefault();e.stopPropagation();flash(button);
    if(S.run&&!S.pause&&window.GameSFX)window.GameSFX.wake();
    if(id==='#guard'){
      if(S.run&&!S.pause){S.guard=1;button.setPointerCapture(e.pointerId);notice('防御',.5)}
    }else fire(id==='#s1'?1:2);
  };
}
['pointerup','pointercancel','lostpointercapture'].forEach(v=>$('#guard').addEventListener(v,()=>S.guard=0));
$('#stop').onclick=()=>{
  if(!S.run)return;if(window.GameSFX)window.GameSFX.pause();S.pause=1;S.guard=0;S.ptr=null;hideNotice();
  $('#pause').classList.remove('hide');if(window.GameBGM)window.GameBGM.pause();
};
$('#resume').onclick=()=>{if(window.GameSFX)window.GameSFX.start();S.pause=0;last=performance.now();$('#pause').classList.add('hide');if(window.GameBGM)window.GameBGM.resume()};
cv.onpointerdown=e=>{
  if(!S.run||S.pause||S.ptr)return;
  e.preventDefault();if(window.GameSFX)window.GameSFX.wake();cv.setPointerCapture(e.pointerId);
  S.ptr={id:e.pointerId,x:e.clientX,y:e.clientY};
};
cv.onpointerup=e=>{
  if(!S.ptr||S.ptr.id!==e.pointerId)return;
  e.preventDefault();const ptr=S.ptr;S.ptr=null;
  if(!S.run||S.pause)return;
  const dx=e.clientX-ptr.x,dy=e.clientY-ptr.y;
  if(Math.abs(dx)>30&&Math.abs(dx)>Math.abs(dy))lane(dx<0?-1:1);
  else if(Math.abs(dy)>30&&Math.abs(dy)>Math.abs(dx)){
    if(dy<0)accelerate();else depth(-MAX_DEPTH/4);
  }
};
['pointercancel','lostpointercapture'].forEach(v=>cv.addEventListener(v,e=>{if(S.ptr&&S.ptr.id===e.pointerId)S.ptr=null}));
// iOS rubber-band scrolling needs a non-passive touchmove cancellation.
// Do not cancel touchstart/end: START, STOP and skill taps must stay native.
document.addEventListener('touchmove',e=>{if(e.target.closest&&e.target.closest('#result'))return;if(e.cancelable)e.preventDefault()},{passive:false});
cv.addEventListener('contextmenu',e=>e.preventDefault());
cv.addEventListener('dragstart',e=>e.preventDefault());
document.addEventListener('visibilitychange',()=>{if(document.hidden&&S.run&&!S.pause)$('#stop').click()});
addEventListener('keydown',e=>{if(!S.run||S.pause)return;if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','1','2',' '].includes(e.key))e.preventDefault();if(e.repeat)return;if(e.key==='ArrowLeft')lane(-1);if(e.key==='ArrowRight')lane(1);if(e.key==='ArrowUp')accelerate();if(e.key==='ArrowDown')depth(-MAX_DEPTH/4);if(e.key==='1')fire(1);if(e.key==='2')fire(2);if(e.key===' ')S.guard=1});addEventListener('keyup',e=>{if(e.key===' ')S.guard=0});
reset();function loop(t){let dt=last?Math.min(.033,(t-last)/1000):0;last=t;step(dt);draw();requestAnimationFrame(loop)}requestAnimationFrame(loop)})();
