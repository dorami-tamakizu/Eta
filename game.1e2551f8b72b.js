(()=>{const $=s=>document.querySelector(s),cv=$('#game'),c=cv.getContext('2d');let W,H,last=0,S,combatSeed=17319;function random(){combatSeed=(Math.imul(combatSeed,1664525)+1013904223)>>>0;return combatSeed/4294967296}const C=(v,a,b)=>Math.max(a,Math.min(b,v)),R=(a,b)=>a+random()*(b-a),RI=(a,b)=>Math.floor(R(a,b+1)),E=t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;const D={slime:{hp:2,d:1,r:0,h:205},skeleton:{hp:3,d:2,r:0,h:220},mage:{hp:3,d:2,r:1,h:228},bonobo:{hp:4,d:4,r:0,h:245},dragon:{hp:4,d:3,r:1,h:215}},im={};const src={hero:'assets/hero.webp',slime:'assets/suraimu.png',skeleton:'assets/がいこつ.png',mage:'assets/mahoutukai.png',bonobo:'assets/bonobo.png',dragon:'assets/minidoragonn.png',body:'hero_body.png.png',upper:'hero_arm1.png',fore:'hero_arm2.png',hand:'hero_hand.png',shoulder:'hero_shoulder.png',sword:'assets/hero_sword_motion.png',forest:'assets/forest-background.webp',poses:'assets/hero-motion-sheet.png'};for(const k in src){im[k]=new Image;im[k].src=src[k]}
function size(){W=innerWidth;H=innerHeight;let d=Math.min(devicePixelRatio||1,2);cv.width=W*d;cv.height=H*d;c.setTransform(d,0,0,d,0,0)}addEventListener('resize',size);size();function sh(a){for(let i=a.length-1;i;i--){let j=RI(0,i);[a[i],a[j]]=[a[j],a[i]]}return a}function mk(t,z){return{t,z,l:RI(0,2),hp:D[t].hp,max:D[t].hp,dead:0,cd:R(1.8,3.8),tell:0,mv:R(.7,2),fl:0}}function roster(){let a=[],e=sh([...Array(3).fill('slime'),...Array(3).fill('skeleton')]),r=sh([...Array(6).fill('slime'),...Array(6).fill('skeleton'),...Array(6).fill('mage'),...Array(3).fill('bonobo'),...Array(3).fill('dragon')]);e.forEach((t,i)=>a.push(mk(t,18+i*6+R(-1,1))));r.forEach((t,i)=>a.push(mk(t,56+i*135/23+R(-1,1))));return a}function reset(){combatSeed=17319;S={run:0,pause:0,t:0,hp:20,dmg:0,z:0,l:1,guard:0,ch:[5,5],fr:[0,0],skill:null,fin:0,win:0,dash:null,norm:0,en:roster(),shots:[],ptr:null,hit:0,pd:0,pt:0,notice:null,ll:1,fx:[],waves:[],combo:0,comboTime:0,shake:0,speed:0,runPhase:0};hideNotice();ui()}function ui(){const hpRatio=C(S.hp/20,0,1),hpColor='hsl('+(120*hpRatio)+',100%,50%)';$('#hp').textContent=Math.ceil(C(S.hp,0,20))+'/20';$('#hpf').style.width=(hpRatio*100)+'%';$('#hpf').style.background=hpColor;$('#hpbar').style.background=hpRatio===0?'#ff0000':'#17212b';$('#hpbar').style.borderColor=hpColor;$('#time').textContent=S.t.toFixed(1);$('#fin').textContent=S.fin;$('#kills').textContent=S.en.filter(e=>e.dead).length;for(let i=0;i<2;i++){
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
const MAX_DEPTH=(.57/(.46-.18)-1)/.115, FRONT_GAP=.7;
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
function adv(n){let v=Math.min(n,Math.max(0,front()-S.z-S.pd-FRONT_GAP));S.z+=v;return v}function sound(kind,type){if(window.GameSFX)window.GameSFX.play(kind,type)}function hurt(n){S.combo=0;S.shake=.18;burst(S.l,S.z+S.pd,'#ff7563',12);sound('hurt');n=S.guard?n/2:n;S.hp-=n;S.dmg+=n;S.hit=.15;if(S.hp<=0)end(0)}function hit(e,n,sk){if(e.dead)return;sound('hit',e.t);e.hp-=n;e.fl=.12;S.combo++;S.comboTime=2;S.fx.push({kind:'number',l:e.l,z:e.z,n:n,t:0,life:.8,color:sk?'#fff079':'#ffffff'});burst(e.l,e.z,sk?'#b5f7ff':'#ffffff',9);S.shake=sk?.08:.035;if(e.tell>0){e.tell=0;e.cd=R(1.8,3.8)}if(e.hp<=0){e.dead=1;e.fade=.4;burst(e.l,e.z,'#ffdfa0',18);sound('down',e.t);if(sk){S.fin++;S.win=.3}}}function hideNotice(){const n=$('#actionName');n.style.opacity='0';n.classList.remove('moveArrow');if(S)S.notice=null}
// Recreate the reference's paper plaque; lettering remains native game text.
function notice(text,seconds,arrow=false){
  const plate=text==='水波斬'||text==='大陸斬';
  S.notice={text,left:seconds,total:seconds,arrow,plate};const n=$('#actionName');
  n.classList.toggle('nameplate',plate);n.classList.toggle('moveArrow',arrow);
  n.style.width='';n.style.height='';
  if(plate){
    n.innerHTML='<svg class="plaque-frame" viewBox="0 0 120 52" aria-hidden="true"><path d="M3 3 Q17 7 31 5 L89 5 Q104 7 117 3 L112 14 L114 26 L112 38 L117 49 Q103 45 88 47 L32 47 Q17 45 3 49 L8 38 L6 26 L8 14 Z" fill="#fffdf5" stroke="#383039" stroke-width="2.6" stroke-linejoin="round"/><path d="M13 11 Q27 12 37 10 M85 42 Q100 41 107 43" fill="none" stroke="#d2cabf" stroke-width="1"/></svg><span class="plaque-name">'+text+'</span>';
  }else n.textContent=text;
  n.style.opacity='1';placeNotice();
}
function noticePosition(){return {x:playerX(),y:Math.max(88,playerY()-playerHeight()*1.36-36)}}
function placeNotice(){
  if(!S.notice)return;const state=S.notice,n=$('#actionName'),pos=noticePosition(),age=state.total-state.left;
  n.style.left=pos.x+'px';n.style.top=pos.y+'px';
  let scale=1;
  if(state.plate){
    if(age<.07)scale=.65+.55*age/.07;
    else if(age<.14)scale=1.20-.26*(age-.07)/.07;
    else if(age<.23)scale=.94+.06*(age-.14)/.09;
  }
  n.style.transform='translate(-50%,-100%) scale('+scale+')';n.style.transformOrigin='50% 100%';
  n.style.opacity=String(Math.min(1,age/.03,state.left/.09));
}
function flash(button){button.classList.remove('flash');void button.offsetWidth;button.classList.add('flash')}
function fire(k){
  if(!S.run||S.pause||S.skill||S.ch[k-1]<1)return;
  S.guard=0;S.ch[k-1]--;S.skill={k,l:S.l,t:0,d:k===1?.68:.82,done:0};
  sound(k===1?'waterStart':'continentStart');
  notice(k===1?'水波斬':'大陸斬',k===1?.68:.82);
}
function lane(d){
  const next=C(S.l+d,0,2);if(next===S.l)return;
  S.dash=null;S.l=next;notice(d<0?'←':'→',.3,true);
}
function dash(){if(S.win<=0||S.skill)return;S.dash={n:10};S.win=0}
function depth(d){S.pt=C(S.pt+d,0,depthLimit())}

function step(dt){
  if(!S.run||S.pause)return;
  const previousZ=S.z;S.t+=dt;S.ll+=(S.l-S.ll)*(1-Math.exp(-18*dt));
  S.normalFlash=Math.max(0,(S.normalFlash||0)-dt);S.shake=Math.max(0,S.shake-dt);S.comboTime=Math.max(0,S.comboTime-dt);if(!S.comboTime)S.combo=0;
  for(const f of S.fx)f.t+=dt;S.fx=S.fx.filter(f=>f.t<f.life);
  for(const e of S.en)if(e.dead)e.fade=Math.max(0,(e.fade||0)-dt);
  updateWaves(dt);S.win=Math.max(0,S.win-dt);S.hit=Math.max(0,S.hit-dt);
  if(S.notice){S.notice.left-=dt;if(S.notice.left<=0)hideNotice()}
  for(let i=0;i<2;i++)if(S.ch[i]<5){S.fr[i]+=dt/5;if(S.fr[i]>=1){S.fr[i]--;S.ch[i]++}}
  if(S.dash){let v=adv(42*dt);S.dash.n-=v;if(v<42*dt-.01||S.dash.n<=0)S.dash=null}
  else if(!S.guard)adv(dt*(S.skill?1.2:1/.3));
  S.speed=(S.z-previousZ)/dt;S.runPhase+=(S.z-previousZ)*2.8;
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
    if(!S.skill.done&&p>(S.skill.k===1?.48:.54)){
      S.skill.done=1;sound(S.skill.k===1?'waterSwing':'continentSwing');
      S.waves.push({k:S.skill.k,l:S.l,z:S.z+S.pd,origin:S.z+S.pd,travel:0,seen:new Set()});
      if(S.skill.k===2){S.fx.push({kind:'impact',l:S.l,z:S.z+S.pd+.4,t:0,life:.42,color:'#8deeff'});burst(S.l,S.z+S.pd+.4,'#d1faff',14)}
    }
    if(S.skill.t>=S.skill.d)S.skill=null;
  }
  let con=S.en.find(e=>!e.dead&&e.l===S.l&&distance(e)<=1.05&&distance(e)>=-.1);
  if(con&&!S.skill&&!S.guard){S.norm+=dt;if(S.norm>=2){S.norm-=2;S.normalFlash=.18;hit(con,1,0)}}else S.norm=0;
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
  if(!S.en.some(e=>!e.dead))end(1);
  ui();
}

// Shared projective ground coordinates: hero, enemies, projectiles and effects.
function perspective(z){return 1/(1+Math.max(-1,z)*.115)}
function lx(l,z){return W/2+(l-1)*Math.min(W,520)*.27*perspective(z)}
function yy(z){return H*.18+H*.57*perspective(z)}
function playerY(){return yy(S.pd)}
function playerX(){return lx(S.ll,S.pd)}
function playerHeight(){return Math.min(H*.30,250)*perspective(S.pd)}
function burst(l,z,color,count){for(let i=0;i<count;i++)S.fx.push({kind:'spark',l,z,color,t:0,life:.35+Math.random()*.25,vx:(Math.random()-.5)*180,vy:-30-Math.random()*140})}
function updateWaves(dt){
  for(const w of S.waves){
    const previous=w.z,move=24*dt;w.z+=move;w.travel+=move;
    for(const e of S.en){
      if(e.dead||w.seen.has(e)||e.z<previous-.5||e.z>w.z+.5)continue;
      if(w.k===1?Math.abs(e.l-w.l)<=1:e.l===w.l){w.seen.add(e);hit(e,w.k===1?2:3,1);if(w.k===2)S.fx.push({kind:'impact',l:e.l,z:e.z,t:0,life:.36,color:'#c4f8ff'})}
    }
  }
  S.waves=S.waves.filter(w=>w.travel<(w.k===1?9:13));
}
function drawWaves(){for(const w of S.waves){
  const z=w.z-S.z,p=perspective(z),x=lx(w.l,z),y=yy(z);
  if(w.k===2){
    c.save();c.lineCap='round';const tail=Math.max(w.origin,w.z-5)-S.z;
    for(let layer=0;layer<3;layer++){c.strokeStyle=['#149bd944','#67e8ffbb','#efffff'][layer];c.lineWidth=[22,8,2][layer]*p;c.beginPath();c.moveTo(lx(w.l,tail),yy(tail));c.lineTo(x,y);c.stroke()}c.restore();
  }
  c.save();c.translate(x,y);c.globalAlpha=Math.min(1,( (w.k===1?9:13)-w.travel)/2);c.lineCap='round';c.shadowColor='#51d9ff';c.shadowBlur=18;
  for(let layer=0;layer<3;layer++){
    c.strokeStyle=['#159bdd88','#72edff','#ffffff'][layer];c.lineWidth=[18,7,2][layer]*p;c.beginPath();
    if(w.k===1)c.ellipse(0,-50*p,W*.33*p,32*p,-.12,Math.PI*.08,Math.PI*.95);
    else{c.moveTo(-12*p,0);c.quadraticCurveTo(34*p,-100*p,0,-240*p)}c.stroke();
  }c.restore();
}}
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
function bg(){
  const image=im.forest;
  if(image.complete&&image.naturalWidth>0){
    // Uniform scaling keeps the painting's perspective intact. Anchor its
    // vanishing point (50%,18%) to the same point used by the game horizon.
    const scale=Math.max(W/image.naturalWidth,H/image.naturalHeight);
    const width=image.naturalWidth*scale,height=image.naturalHeight*scale;
    // Continuous forward optical flow. Crossfade only at the forest loop boundary.
    const phase=(S.z/22)%1,zoom=1.28+phase*.28;
    const paint=z=>c.drawImage(image,W*.5-width*z*.5,H*.18-height*z*.18,width*z,height*z);
    paint(zoom);
    if(phase>.60){c.save();c.globalAlpha=E((phase-.60)/.40);paint(zoom-.28);c.restore()}

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
function drawPoseHero(h){
  const skill=S.skill,p=skill?C(skill.t/skill.d,0,1):0;
  if(!skill&&!S.guard&&S.speed>.05)drawRunningHero(h);else drawPoseFrame(skill?poseFrame(skill.k,p):0,h);
  if(!skill)return;
  const cut=skill.k===1?.48:.54,q=(p-cut)/.16;
  if(q<0||q>1)return;
  // Mask the intentionally skipped fast sword passage at frame 4 -> 5.
  c.save();c.globalAlpha=Math.sin(q*Math.PI)*.85;c.lineCap='round';
  c.shadowColor='#4bdfff';c.shadowBlur=16;
  for(let i=0;i<3;i++){
    c.strokeStyle=['#159de775','#8cf1ff','#f4ffff'][i];c.lineWidth=h*[.075,.025,.008][i];c.beginPath();
    if(skill.k===1)c.ellipse(0,-h*.55,h*.60,h*.12,-.16,Math.PI*.05,Math.PI*.95);
    else{c.moveTo(h*.12,-h*1.22);c.bezierCurveTo(h*.47,-h*.94,h*.32,-h*.45,h*.16,-h*.02)}c.stroke();
  }c.restore();
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
function draw(){
  placeNotice();c.clearRect(0,0,W,H);bg();c.save();
  if(S.shake)c.translate(Math.sin(S.t*110)*S.shake*22,Math.cos(S.t*93)*S.shake*12);
  // Motion flecks on the path use the same perspective as the combatants.
  c.fillStyle='#eadfb72b';for(let i=0;i<24;i++){let z=(i*2.7-S.z%2.7),p=perspective(z);c.fillRect(lx((i%3)*.72+.28,z),yy(z),2*p,8*p)}
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
  const x=playerX(),y=playerY(),h=playerHeight(),img=im.hero;c.save();c.translate(x,y);
  c.fillStyle='#06111b66';c.beginPath();c.ellipse(0,0,h*.25,h*.04,0,0,7);c.fill();
  if(S.guard){c.strokeStyle='#b3f2ff';c.fillStyle='#53baff25';c.lineWidth=3;c.beginPath();c.ellipse(0,-h*.45,h*.34,h*.52,0,0,7);c.fill();c.stroke()}
  if(posesReady())drawPoseHero(h);else if(rigReady())drawRig(h);else if(img.complete&&img.naturalWidth){const rect=crop(img),w=h*rect[2]/rect[3];c.drawImage(img,...rect,-w/2,-h,w,h)}c.restore();drawEffects();c.restore();
  if(S.hit){c.fillStyle='rgba(255,80,60,.12)';c.fillRect(0,0,W,H)}
}
function end(ok){if(window.GameSFX)window.GameSFX.finish();S.run=0;S.ptr=null;S.guard=0;hideNotice();if(window.GameBGM)window.GameBGM.pause();$('#resultTitle').textContent=ok?'STAGE CLEAR '+(S.dmg<=5?'SS':S.dmg<=12?'S':'A'):'GAME OVER';$('#resultText').innerHTML='TIME '+S.t.toFixed(2)+' s<br>DAMAGE '+S.dmg.toFixed(1)+'<br>SKILL FINISH '+S.fin+' / 30';$('#result').classList.remove('hide');if(window.bgm)bgm.pause()}function start(){if(window.GameSFX)window.GameSFX.start();reset();S.run=1;last=performance.now();$('#intro').classList.add('hide');if(window.bgm){bgm.currentTime=0;bgm.play().catch(()=>{})}}$('#start').onclick=start;$('#retry').onclick=()=>{if(window.GameSFX)window.GameSFX.start();reset();S.run=1;last=performance.now();$('#result').classList.add('hide');if(window.bgm)bgm.play().catch(()=>{})};// Own each gesture by pointerId; button fingers cannot finish a canvas swipe.
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
  $('#pause').classList.remove('hide');if(window.GameBGM)window.GameBGM.pause();if(window.bgm)bgm.pause();
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
document.addEventListener('visibilitychange',()=>{if(document.hidden&&S.run&&!S.pause)$('#stop').click()});
addEventListener('keydown',e=>{if(!S.run||S.pause)return;if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','1','2',' '].includes(e.key))e.preventDefault();if(e.repeat)return;if(e.key==='ArrowLeft')lane(-1);if(e.key==='ArrowRight')lane(1);if(e.key==='ArrowUp')depth(MAX_DEPTH/4);if(e.key==='ArrowDown')depth(-MAX_DEPTH/4);if(e.key==='1')fire(1);if(e.key==='2')fire(2);if(e.key===' ')S.guard=1});addEventListener('keyup',e=>{if(e.key===' ')S.guard=0});
reset();function loop(t){let dt=last?Math.min(.033,(t-last)/1000):0;last=t;step(dt);draw();requestAnimationFrame(loop)}requestAnimationFrame(loop)})();
