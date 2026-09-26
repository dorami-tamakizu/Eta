const fs=require('fs'),vm=require('vm'),assert=require('assert/strict'),cp=require('child_process');
const before=cp.execFileSync('git',['show','fde1f3a:game.js'],{encoding:'utf8'}),after=fs.readFileSync('game.js','utf8');
function runtime(source,failed=[]){
 const trace=[],nodes=new Map();let seed=1;
 const math=Object.create(Math);math.random=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296);
 const normalize=x=>x&&x.src?x.src:typeof x==='object'?'object':x;
 const ctx=new Proxy({globalAlpha:1},{get(o,k){if(k in o)return o[k];return (...a)=>{trace.push([k,...a.map(normalize)]);if(k.startsWith('create'))return {addColorStop(...a){trace.push(['addColorStop',...a])}};if(k==='measureText')return {width:20};};},set(o,k,v){o[k]=v;trace.push(['set',k,normalize(v)]);return true;}});
 const noop=()=>{},node=()=>({style:{},classList:{add:noop,remove:noop,toggle:noop},setAttribute:noop,addEventListener:noop,getContext:()=>ctx,setPointerCapture:noop,getBoundingClientRect:()=>({left:0,top:0,width:390,height:844}),focus:noop});
 const env={Math:math,console,Set,Image:class{constructor(){this.complete=true;this.naturalWidth=1536;this.naturalHeight=1024}},innerWidth:390,innerHeight:844,devicePixelRatio:2,addEventListener:noop,requestAnimationFrame:noop,performance:{now:()=>0},document:{querySelector:s=>{if(!nodes.has(s))nodes.set(s,node());return nodes.get(s)},addEventListener:noop,createElement:node},window:{}};
 source=source.replace('reset();function loop(t)','globalThis.test={im,bounds,reset,beginRun,step,draw,fire,fireUltimate,accelerate,score,get state(){return S}};reset();function loop(t)');vm.runInNewContext(source,env);const g=env.test;
 for(const [key,img] of Object.entries(g.im)){g.bounds.set(img,[0,0,img.naturalWidth,img.naturalHeight]);if(failed.includes(key)){img.complete=false;img.naturalWidth=0}}
 return {g,trace};
}
let checks=0;
for(const failed of [[],['heroSkills'],['heroRun'],['heroGuard'],['boss'],['bossSkills'],['forestTrees','forestGround']]){
 const a=runtime(before,failed),b=runtime(after,failed);
 for(const scene of ['road','boss','defeat','ultimate']){
  for(const r of [a,b]){r.g.reset();const s=r.g.state;s.run=1;
   if(scene==='boss'){s.phase='boss';s.en=[{t:'boss',boss:true,hp:40,max:40,l:1,displayLane:1,z:12,dead:0,cd:2,mv:1,tell:0,fl:0,walk:0}];}
   if(scene==='defeat'){s.defeat={t:.3};s.run=0;}
   if(scene==='ultimate')r.g.fireUltimate();
  }
  for(let i=0;i<120;i++){
   for(const r of [a,b]){r.trace.length=0;if(i===10)r.g.accelerate();if(i===20)r.g.fire(1);if(i===70)r.g.fire(2);r.g.step(i%3===0?.033:.016);r.g.draw();}
   assert.equal(JSON.stringify(a.g.state),JSON.stringify(b.g.state),scene+' state');
   assert.equal(JSON.stringify(a.trace),JSON.stringify(b.trace),scene+' draw commands');
   assert.equal(JSON.stringify(a.g.score(1)),JSON.stringify(b.g.score(1)),scene+' score');checks++;
  }
 }
}
console.log('PASS:',checks,'paired frames: state, draw commands and scores identical; normal and six asset-failure scenarios');
