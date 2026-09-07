(()=>{const $=s=>document.querySelector(s),cv=$('#game'),c=cv.getContext('2d');let W,H,last=0,S;const C=(v,a,b)=>Math.max(a,Math.min(b,v)),R=(a,b)=>a+Math.random()*(b-a),RI=(a,b)=>Math.floor(R(a,b+1)),E=t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;const D={slime:{hp:2,d:1,r:0,h:205},skeleton:{hp:3,d:2,r:0,h:220},mage:{hp:3,d:2,r:1,h:228},bonobo:{hp:4,d:4,r:0,h:245},dragon:{hp:4,d:3,r:1,h:215}},im={};const src={hero:'assets/hero.webp',slime:'assets/suraimu.png',skeleton:'assets/がいこつ.png',mage:'assets/mahoutukai.png',bonobo:'assets/bonobo.png',dragon:'assets/minidoragonn.png',body:'hero_body.png.png',upper:'hero_arm1.png',fore:'hero_arm2.png',hand:'hero_hand.png',shoulder:'hero_shoulder.png',sword:'assets/hero_sword_motion.png',forest:'assets/forest-background.webp'};for(const k in src){im[k]=new Image;im[k].src=src[k]}
function size(){W=innerWidth;H=innerHeight;let d=Math.min(devicePixelRatio||1,2);cv.width=W*d;cv.height=H*d;c.setTransform(d,0,0,d,0,0)}addEventListener('resize',size);size();function sh(a){for(let i=a.length-1;i;i--){let j=RI(0,i);[a[i],a[j]]=[a[j],a[i]]}return a}function mk(t,z){return{t,z,l:RI(0,2),hp:D[t].hp,max:D[t].hp,dead:0,cd:R(1.8,3.8),tell:0,mv:R(.7,2),fl:0}}function roster(){let a=[],e=sh([...Array(3).fill('slime'),...Array(3).fill('skeleton')]),r=sh([...Array(6).fill('slime'),...Array(6).fill('skeleton'),...Array(6).fill('mage'),...Array(3).fill('bonobo'),...Array(3).fill('dragon')]);e.forEach((t,i)=>a.push(mk(t,18+i*6+R(-1,1))));r.forEach((t,i)=>a.push(mk(t,46+i*145/23+R(-2,2))));return a}function reset(){S={run:0,pause:0,t:0,hp:20,dmg:0,z:0,l:1,guard:0,ch:[5,5],fr:[0,0],skill:null,fin:0,win:0,dash:null,norm:0,en:roster(),shots:[],ptr:null,hit:0,pd:0,pt:0,notice:null};hideNotice();ui()}function ui(){const hpRatio=C(S.hp/20,0,1),hpColor='hsl('+(120*hpRatio)+',100%,50%)';$('#hp').textContent=Math.ceil(C(S.hp,0,20))+'/20';$('#hpf').style.width=(hpRatio*100)+'%';$('#hpf').style.background=hpColor;$('#hpbar').style.background=hpRatio===0?'#ff0000':'#17212b';$('#hpbar').style.borderColor=hpColor;$('#time').textContent=S.t.toFixed(1);$('#fin').textContent=S.fin;for(let i=0;i<2;i++){
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
const MAX_DEPTH=(.75-.46)*34/.54, FRONT_GAP=.7;
function distance(e){return e.z-S.z-S.pd}
function front(){let z=Infinity;for(const e of S.en)if(!e.dead)z=Math.min(z,e.z);return z}
function depthLimit(){return C(front()-S.z-FRONT_GAP,0,MAX_DEPTH)}
function updateDepth(dt){
  const limit=depthLimit();
  S.pt=Math.min(S.pt,limit);
  S.pd+=(S.pt-S.pd)*(1-Math.exp(-11*dt));
  // Enemy movement is continuous and bounded, so contact pushes back by only
  // the distance the front actually moved this frame, without crossing it.
  S.pd=C(S.pd,0,limit);
}
function adv(n){let v=Math.min(n,Math.max(0,front()-S.z-S.pd-FRONT_GAP));S.z+=v;return v}function sound(kind,type){if(window.GameSFX)window.GameSFX.play(kind,type)}function hurt(n){sound('hurt');n=S.guard?n/2:n;S.hp-=n;S.dmg+=n;S.hit=.15;if(S.hp<=0)end(0)}function hit(e,n,sk){if(e.dead)return;sound('hit',e.t);e.hp-=n;e.fl=.12;if(e.tell>0){e.tell=0;e.cd=R(1.8,3.8)}if(e.hp<=0){e.dead=1;sound('down',e.t);if(sk){S.fin++;S.win=.3}}}function hideNotice(){const n=$('#actionName');n.style.opacity='0';n.classList.remove('moveArrow');if(S)S.notice=null}
function notice(text,seconds,arrow=false){S.notice={text,left:seconds,arrow};const n=$('#actionName');n.textContent=text;n.classList.toggle('moveArrow',arrow);n.style.opacity='1'}
function placeNotice(){if(!S.notice)return;const n=$('#actionName');n.style.left=playerX()+'px';n.style.top=Math.max(42,playerY()-playerHeight()-22)+'px'}
function flash(button){button.classList.remove('flash');void button.offsetWidth;button.classList.add('flash')}
function fire(k){
  if(!S.run||S.pause||S.ch[k-1]<1)return;
  S.guard=0;S.ch[k-1]--;S.skill={k,t:0,d:k===1?.68:.82,done:0};
  sound(k===1?'waterStart':'continentStart');
  notice(k===1?'水波斬':'大陸斬',k===1?.68:.82);
}
function lane(d){
  const next=C(S.l+d,0,2);if(next===S.l)return;
  S.skill=null;S.dash=null;S.l=next;notice(d<0?'←':'→',.3,true);
}
function dash(){if(S.win<=0)return;S.skill=null;S.dash={n:10};S.win=0}
function depth(d){S.skill=null;S.pt=C(S.pt+d,0,depthLimit())}

function step(dt){
  if(!S.run||S.pause)return;
  S.t+=dt;S.win=Math.max(0,S.win-dt);S.hit=Math.max(0,S.hit-dt);
  if(S.notice){S.notice.left-=dt;if(S.notice.left<=0)hideNotice()}
  for(let i=0;i<2;i++)if(S.ch[i]<5){S.fr[i]+=dt/5;if(S.fr[i]>=1){S.fr[i]--;S.ch[i]++}}
  if(S.dash){let v=adv(42*dt);S.dash.n-=v;if(v<42*dt-.01||S.dash.n<=0)S.dash=null}
  else if(!S.guard&&!S.skill)adv(dt/.3);
  // Update the moving front before resolving any attacks against player depth.
  for(const e of S.en){
    if(e.dead)continue;e.fl=Math.max(0,e.fl-dt);
    const stageDistance=e.z-S.z;if(stageDistance>42||stageDistance<-2)continue;
    e.mv-=dt;
    if(e.mv<=0&&e.tell<=0){
      if(Math.random()<.6)e.l=C(e.l+(Math.random()<.5?-1:1),0,2);
      e.dz=(e.dz||0)+R(-.3,.12);e.mv=R(.7,2);
    }
    const shift=C(e.dz||0,-2*dt,2*dt);e.dz=(e.dz||0)-shift;
    e.z=Math.max(S.z+FRONT_GAP,e.z+shift-.1*dt);
  }
  updateDepth(dt);
  if(S.skill){
    S.skill.t+=dt;let p=S.skill.t/S.skill.d;
    if(!S.skill.done&&p>(S.skill.k===1?.48:.54)){
      S.skill.done=1;sound(S.skill.k===1?'waterSwing':'continentSwing');
      for(const e of S.en){
        let r=distance(e);if(e.dead||r<0||r>(S.skill.k===1?1.2:2.2))continue;
        if(S.skill.k===1){if(S.l===1||e.l===S.l||e.l===1)hit(e,2,1)}
        else if(e.l===S.l)hit(e,3,1);
      }
    }
    if(S.skill.t>=S.skill.d)S.skill=null;
  }
  let con=S.en.find(e=>!e.dead&&e.l===S.l&&distance(e)<=1.05&&distance(e)>=-.1);
  if(con){S.norm+=dt;if(S.norm>=2){S.norm-=2;hit(con,1,0)}}else S.norm=0;
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
  if(S.z>=200&&!S.en.some(e=>!e.dead))end(1);
  ui();
}

function lx(l,z){let p=C(1-z/34,0,1),sp=W*.055+(W*.25-W*.055)*p;return W/2+(l-1)*sp}function yy(z){let p=C(1-z/34,0,1);return H*.18+(H*.72-H*.18)*p}function playerY(){return H*.75-H*.54/34*S.pd}
function playerX(){return lx(S.l,S.pd)}
function playerHeight(){return Math.min(H*.285,238)*(1-.22*S.pd/MAX_DEPTH)}

// One vanishing point, shared with the enemy ground horizon. Cache the painted
// scenery at device resolution so foliage does not add work to each game frame.
let forestLayer=null,forestKey='';
function bg(){
  const image=im.forest;
  if(image.complete&&image.naturalWidth>0){
    // Uniform scaling keeps the painting's perspective intact. Anchor its
    // vanishing point (50%,18%) to the same point used by the game horizon.
    const scale=Math.max(W/image.naturalWidth,H/image.naturalHeight);
    const width=image.naturalWidth*scale,height=image.naturalHeight*scale;
    c.drawImage(image,W*.5-width*.5,H*.18-height*.18,width,height);
    return;
  }
  // Keep the existing forest as a fallback while the painting loads.
  const d=Math.min(devicePixelRatio||1,2),key=W+':'+H+':'+d;
  if(forestKey!==key){
    forestLayer=document.createElement('canvas');forestLayer.width=Math.round(W*d);forestLayer.height=Math.round(H*d);
    const f=forestLayer.getContext('2d');f.setTransform(d,0,0,d,0,0);
    const vx=W*.5,vy=H*.18;
    // Local deterministic texture: never consume the combat RNG.
    const noise=n=>{let x=Math.imul(n+71,374761393);x=Math.imul(x^(x>>>13),1274126177);return ((x^(x>>>16))>>>0)/4294967296};
    const ground=p=>vy+H*.54*p;
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
    const bottomP=(H-vy)/(H*.54),edge=W*.30;
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

function frontline(){let fl=front();if(fl>=999)return;let r=fl-S.z,y=yy(r),p=C(1-r/34,0,1),half=W*(.08+.34*p);c.save();c.strokeStyle='rgba(255,225,125,.95)';c.shadowColor='rgba(255,170,50,.9)';c.shadowBlur=10;c.lineWidth=3;c.beginPath();c.moveTo(W/2-half,y);c.lineTo(W/2+half,y);c.stroke();c.restore()}
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
  if(!S.skill)return {...REST,behind:false};
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
  if(!S.skill)return;
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
function draw(){placeNotice();c.clearRect(0,0,W,H);bg();for(const e of S.en.filter(e=>!e.dead&&e.z-S.z>-2&&e.z-S.z<38).sort((a,b)=>b.z-a.z)){let r=e.z-S.z,p=C(1-r/38,.25,1.12),h=D[e.t].h*p,img=im[e.t],w=h*img.naturalWidth/Math.max(1,img.naturalHeight),x=lx(e.l,r),y=yy(r);c.save();c.translate(x,y);if(e.tell>0){let q=.5+.5*Math.sin(performance.now()/70);c.globalAlpha=.2+.18*q;c.fillStyle=D[e.t].r?'#9d6cff':'#ffb096';c.beginPath();c.ellipse(0,-h*.45,35*p,48*p,0,0,7);c.fill();c.globalAlpha=1}if(e.fl)c.globalAlpha=.55;if(img.complete)c.drawImage(img,-w/2,-h,w,h);c.restore();c.fillStyle='#000b';c.fillRect(x-w*.3,y-h-7,w*.6,4);c.fillStyle='#fff';c.fillRect(x-w*.3,y-h-7,w*.6*e.hp/e.max,4)}frontline();for(const p of S.shots){let r=p.z-S.z,x=lx(p.l,r),y=yy(r);c.fillStyle=p.t==='mage'?'#bd79ff':'#ff873d';c.shadowColor=c.fillStyle;c.shadowBlur=18;c.beginPath();c.arc(x,y,10,0,7);c.fill();c.shadowBlur=0}let x=playerX(),y=playerY(),img=im.hero,sc=1-.22*S.pd/MAX_DEPTH,h=playerHeight(),w=h*img.naturalWidth/Math.max(1,img.naturalHeight);c.save();c.translate(x,y);if(S.guard){c.strokeStyle='#dff7ff';c.lineWidth=5;c.beginPath();c.arc(-h*.12,-h*.42,h*.25,-2.2,2.2);c.stroke()}if(rigReady())drawRig(h);else if(img.complete&&img.naturalWidth){skillEffect(h,sc);c.drawImage(img,-w/2,-h,w,h);}c.restore();if(S.hit){c.fillStyle='rgba(255,80,60,.12)';c.fillRect(0,0,W,H)}}function end(ok){if(window.GameSFX)window.GameSFX.finish();S.run=0;S.ptr=null;S.guard=0;hideNotice();if(window.GameBGM)window.GameBGM.pause();$('#resultTitle').textContent=ok?'STAGE CLEAR':'GAME OVER';$('#resultText').innerHTML='TIME '+S.t.toFixed(2)+' s<br>DAMAGE '+S.dmg.toFixed(1)+'<br>SKILL FINISH '+S.fin+' / 30';$('#result').classList.remove('hide');if(window.bgm)bgm.pause()}function start(){if(window.GameSFX)window.GameSFX.start();reset();S.run=1;last=performance.now();$('#intro').classList.add('hide');if(window.bgm){bgm.currentTime=0;bgm.play().catch(()=>{})}}$('#start').onclick=start;$('#retry').onclick=()=>{if(window.GameSFX)window.GameSFX.start();reset();S.run=1;last=performance.now();$('#result').classList.add('hide');if(window.bgm)bgm.play().catch(()=>{})};// Own each gesture by pointerId; button fingers cannot finish a canvas swipe.
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
  $('#pause').classList.remove('hide');if(window.bgm)bgm.pause();
};
$('#resume').onclick=()=>{if(window.GameSFX)window.GameSFX.start();S.pause=0;last=performance.now();$('#pause').classList.add('hide');if(window.bgm)bgm.play().catch(()=>{})};
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
    if(dy<0){if(S.win>0)dash();depth(MAX_DEPTH/4)}else depth(-MAX_DEPTH/4);
  }
};
['pointercancel','lostpointercapture'].forEach(v=>cv.addEventListener(v,e=>{if(S.ptr&&S.ptr.id===e.pointerId)S.ptr=null}));
// iOS rubber-band scrolling needs a non-passive touchmove cancellation.
// Do not cancel touchstart/end: START, STOP and skill taps must stay native.
document.addEventListener('touchmove',e=>{if(e.cancelable)e.preventDefault()},{passive:false});
cv.addEventListener('contextmenu',e=>e.preventDefault());
cv.addEventListener('dragstart',e=>e.preventDefault());
reset();function loop(t){let dt=last?Math.min(.033,(t-last)/1000):0;last=t;step(dt);draw();requestAnimationFrame(loop)}requestAnimationFrame(loop)})();
