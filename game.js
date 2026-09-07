(()=>{const $=s=>document.querySelector(s),cv=$('#game'),c=cv.getContext('2d');let W,H,last=0,S;const C=(v,a,b)=>Math.max(a,Math.min(b,v)),R=(a,b)=>a+Math.random()*(b-a),RI=(a,b)=>Math.floor(R(a,b+1)),E=t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;const D={slime:{hp:2,d:1,r:0,h:205},skeleton:{hp:3,d:2,r:0,h:220},mage:{hp:3,d:2,r:1,h:228},bonobo:{hp:4,d:4,r:0,h:245},dragon:{hp:4,d:3,r:1,h:215}},im={};const src={hero:'assets/hero.webp',slime:'assets/suraimu.png',skeleton:'assets/がいこつ.png',mage:'assets/mahoutukai.png',bonobo:'assets/bonobo.png',dragon:'assets/minidoragonn.png',body:'hero_body.png.png',upper:'hero_arm1.png',fore:'hero_arm2.png',hand:'hero_hand.png',shoulder:'hero_shoulder.png',sword:'assets/hero_sword_motion.png'};for(const k in src){im[k]=new Image;im[k].src=src[k]}
function size(){W=innerWidth;H=innerHeight;let d=Math.min(devicePixelRatio||1,2);cv.width=W*d;cv.height=H*d;c.setTransform(d,0,0,d,0,0)}addEventListener('resize',size);size();function sh(a){for(let i=a.length-1;i;i--){let j=RI(0,i);[a[i],a[j]]=[a[j],a[i]]}return a}function mk(t,z){return{t,z,l:RI(0,2),hp:D[t].hp,max:D[t].hp,dead:0,cd:R(1.8,3.8),tell:0,mv:R(.7,2),fl:0}}function roster(){let a=[],e=sh([...Array(3).fill('slime'),...Array(3).fill('skeleton')]),r=sh([...Array(6).fill('slime'),...Array(6).fill('skeleton'),...Array(6).fill('mage'),...Array(3).fill('bonobo'),...Array(3).fill('dragon')]);e.forEach((t,i)=>a.push(mk(t,18+i*6+R(-1,1))));r.forEach((t,i)=>a.push(mk(t,46+i*145/23+R(-2,2))));return a}function reset(){S={run:0,pause:0,t:0,hp:20,dmg:0,z:0,l:1,guard:0,ch:[5,5],fr:[0,0],skill:null,fin:0,win:0,dash:null,norm:0,en:roster(),shots:[],ptr:null,hit:0,pd:0,pt:0,notice:null};hideNotice();ui()}function ui(){$('#hp').textContent=Math.ceil(S.hp)+'/20';$('#hpf').style.width=C(S.hp*5,0,100)+'%';$('#time').textContent=S.t.toFixed(1);$('#fin').textContent=S.fin;$('#g1').style.width=S.ch[0]*20+'%';$('#g2').style.width=S.ch[1]*20+'%'}// pd/pt are player depth in the same world units as enemy.z and stage S.z.
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
function adv(n){let v=Math.min(n,Math.max(0,front()-S.z-S.pd-FRONT_GAP));S.z+=v;return v}function hurt(n){n=S.guard?n/2:n;S.hp-=n;S.dmg+=n;S.hit=.15;if(S.hp<=0)end(0)}function hit(e,n,sk){e.hp-=n;e.fl=.12;if(e.tell>0){e.tell=0;e.cd=R(1.8,3.8)}if(e.hp<=0){e.dead=1;if(sk){S.fin++;S.win=.3}}}function hideNotice(){const n=$('#actionName');n.style.opacity='0';n.classList.remove('moveArrow');if(S)S.notice=null}
function notice(text,seconds,arrow=false){S.notice={text,left:seconds,arrow};const n=$('#actionName');n.textContent=text;n.classList.toggle('moveArrow',arrow);n.style.opacity='1'}
function placeNotice(){if(!S.notice)return;const n=$('#actionName');n.style.left=playerX()+'px';n.style.top=Math.max(42,playerY()-playerHeight()-22)+'px'}
function flash(button){button.classList.remove('flash');void button.offsetWidth;button.classList.add('flash')}
function fire(k){
  if(!S.run||S.pause||S.ch[k-1]<1)return;
  S.guard=0;S.ch[k-1]--;S.skill={k,t:0,d:k===1?.68:.82,done:0};
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
      S.skill.done=1;
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
        if(D[e.t].r)S.shots.push({l:e.l,z:e.z,d:D[e.t].d,t:e.t});
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

function bg(){let g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,'#263e73');g.addColorStop(.34,'#c77967');g.addColorStop(.52,'#e3a15e');g.addColorStop(1,'#302a27');c.fillStyle=g;c.fillRect(0,0,W,H);c.fillStyle='#f8d68c';c.beginPath();c.arc(W*.5,H*.24,W*.07,0,7);c.fill();c.fillStyle='#2c2a2b';for(const s of [-1,1]){let x=s<0?0:W*.78;c.fillRect(x,H*.22,W*.22,H*.38);for(let i=0;i<3;i++){c.fillRect(x+i*W*.075,H*(.14+i*.025),W*.045,H*.16)}}c.fillStyle='#4a3b31';c.beginPath();c.moveTo(W*.4,H*.18);c.lineTo(W*.6,H*.18);c.lineTo(W,H);c.lineTo(0,H);c.closePath();c.fill();c.strokeStyle='#786556';for(let z=2;z<34;z+=2.5){c.beginPath();c.moveTo(lx(0,z)-W*.1,yy(z));c.lineTo(lx(2,z)+W*.1,yy(z));c.stroke()}c.strokeStyle='#ffffff20';for(let i=-1;i<=1;i++){c.beginPath();c.moveTo(W/2+i*W*.055,H*.18);c.lineTo(W/2+i*W*.25,H);c.stroke()}}
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
  if(!S.skill)return REST;
  const p=progress===undefined?C(S.skill.t/S.skill.d,0,1):progress,water=S.skill.k===1;
  const wind=water?{upper:-1.8,fore:.25,wrist:Math.PI,flat:.48,left:.5}:{upper:-2.5,fore:-.55,wrist:Math.PI,flat:1,left:.05};
  const follow=water?{upper:1.3,fore:.2,wrist:Math.PI,flat:.48,left:-.15}:{upper:-.1,fore:.1,wrist:Math.PI,flat:1,left:.3};
  const windEnd=water?.32:.36,cutEnd=water?.56:.60,holdEnd=water?.67:.70;
  let from,to,q;
  if(p<windEnd){from=REST;to=wind;q=E(p/windEnd)}
  else if(p<cutEnd){from=wind;to=follow;q=E((p-windEnd)/(cutEnd-windEnd))}
  else if(p<holdEnd){from=follow;to=follow;q=0}
  else{from=follow;to=REST;q=E((p-holdEnd)/(1-holdEnd))}
  const pose={};for(const key in REST)pose[key]=from[key]+(to[key]-from[key])*q;return pose;
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
  // Both attacks take place on the enemy-facing side. Render their blades,
  // hands, arms AND trails before the opaque body/cape, never over the back.
  // Keep the wrist at a stable grip angle; the shoulder/elbow drive the cut.
  skillEffect(h,h/Math.min(H*.285,238));
  c.save();c.scale(h/1104,h/1104);c.translate(-750,-1344);
  arm(false,pose);arm(true,pose);c.drawImage(makeBodyLayer(),0,0);
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
  const begin=water?.33:.37,end=water?.67:.70;if(p<begin||p>end)return;
  const q=(p-begin)/(end-begin),now=swordPoints(rigPose(p),h),before=swordPoints(rigPose(Math.max(begin,p-.09)),h);
  c.save();c.globalAlpha=Math.sin(q*Math.PI)*.6;
  c.strokeStyle=water?'#d7f8ff':'#fff5cf';c.fillStyle=water?'#b6edff':'#ffe8ae';
  c.shadowColor=water?'#69cfff':'#f6c77c';c.shadowBlur=9;c.lineWidth=3*sc;c.lineCap='round';
  c.beginPath();c.moveTo(...before.tip);c.lineTo(...now.tip);c.stroke();
  c.globalAlpha*=.28;c.beginPath();c.moveTo(...before.grip);c.lineTo(...before.tip);c.lineTo(...now.tip);c.lineTo(...now.grip);c.closePath();c.fill();
  if(!water&&p>.59){c.globalAlpha=(end-p)/(end-.59)*.5;c.lineWidth=2*sc;c.beginPath();c.ellipse(now.tip[0],Math.min(0,now.tip[1]),h*.2*(p-.59)/.11,h*.04,0,0,Math.PI*2);c.stroke()}
  c.restore();
}
function draw(){placeNotice();c.clearRect(0,0,W,H);bg();for(const e of S.en.filter(e=>!e.dead&&e.z-S.z>-2&&e.z-S.z<38).sort((a,b)=>b.z-a.z)){let r=e.z-S.z,p=C(1-r/38,.25,1.12),h=D[e.t].h*p,img=im[e.t],w=h*img.naturalWidth/Math.max(1,img.naturalHeight),x=lx(e.l,r),y=yy(r);c.save();c.translate(x,y);if(e.tell>0){let q=.5+.5*Math.sin(performance.now()/70);c.globalAlpha=.2+.18*q;c.fillStyle=D[e.t].r?'#9d6cff':'#ffb096';c.beginPath();c.ellipse(0,-h*.45,35*p,48*p,0,0,7);c.fill();c.globalAlpha=1}if(e.fl)c.globalAlpha=.55;if(img.complete)c.drawImage(img,-w/2,-h,w,h);c.restore();c.fillStyle='#000b';c.fillRect(x-w*.3,y-h-7,w*.6,4);c.fillStyle='#fff';c.fillRect(x-w*.3,y-h-7,w*.6*e.hp/e.max,4)}frontline();for(const p of S.shots){let r=p.z-S.z,x=lx(p.l,r),y=yy(r);c.fillStyle=p.t==='mage'?'#bd79ff':'#ff873d';c.shadowColor=c.fillStyle;c.shadowBlur=18;c.beginPath();c.arc(x,y,10,0,7);c.fill();c.shadowBlur=0}let x=playerX(),y=playerY(),img=im.hero,sc=1-.22*S.pd/MAX_DEPTH,h=playerHeight(),w=h*img.naturalWidth/Math.max(1,img.naturalHeight);c.save();c.translate(x,y);if(S.guard){c.strokeStyle='#dff7ff';c.lineWidth=5;c.beginPath();c.arc(-h*.12,-h*.42,h*.25,-2.2,2.2);c.stroke()}if(rigReady())drawRig(h);else if(img.complete&&img.naturalWidth){skillEffect(h,sc);c.drawImage(img,-w/2,-h,w,h);}c.restore();if(S.hit){c.fillStyle='rgba(255,80,60,.12)';c.fillRect(0,0,W,H)}}function end(ok){S.run=0;S.ptr=null;S.guard=0;hideNotice();if(window.GameBGM)window.GameBGM.pause();$('#resultTitle').textContent=ok?'STAGE CLEAR':'GAME OVER';$('#resultText').innerHTML='TIME '+S.t.toFixed(2)+' s<br>DAMAGE '+S.dmg.toFixed(1)+'<br>SKILL FINISH '+S.fin+' / 30';$('#result').classList.remove('hide');if(window.bgm)bgm.pause()}function start(){reset();S.run=1;last=performance.now();$('#intro').classList.add('hide');if(window.bgm){bgm.currentTime=0;bgm.play().catch(()=>{})}}$('#start').onclick=start;$('#retry').onclick=()=>{reset();S.run=1;last=performance.now();$('#result').classList.add('hide');if(window.bgm)bgm.play().catch(()=>{})};// Own each gesture by pointerId; button fingers cannot finish a canvas swipe.
for(const id of ['#guard','#s1','#s2']){
  const button=$(id);
  button.addEventListener('contextmenu',e=>e.preventDefault());
  button.addEventListener('dragstart',e=>e.preventDefault());
  button.addEventListener('animationend',()=>button.classList.remove('flash'));
  button.onpointerdown=e=>{
    e.preventDefault();e.stopPropagation();flash(button);
    if(id==='#guard'){
      if(S.run&&!S.pause){S.guard=1;button.setPointerCapture(e.pointerId);notice('防御',.5)}
    }else fire(id==='#s1'?1:2);
  };
}
['pointerup','pointercancel','lostpointercapture'].forEach(v=>$('#guard').addEventListener(v,()=>S.guard=0));
$('#stop').onclick=()=>{
  if(!S.run)return;S.pause=1;S.guard=0;S.ptr=null;hideNotice();
  $('#pause').classList.remove('hide');if(window.bgm)bgm.pause();
};
$('#resume').onclick=()=>{S.pause=0;last=performance.now();$('#pause').classList.add('hide');if(window.bgm)bgm.play().catch(()=>{})};
cv.onpointerdown=e=>{
  if(!S.run||S.pause||S.ptr)return;
  e.preventDefault();cv.setPointerCapture(e.pointerId);
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
cv.addEventListener('contextmenu',e=>e.preventDefault());
cv.addEventListener('dragstart',e=>e.preventDefault());
reset();function loop(t){let dt=last?Math.min(.033,(t-last)/1000):0;last=t;step(dt);draw();requestAnimationFrame(loop)}requestAnimationFrame(loop)})();
