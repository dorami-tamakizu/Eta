const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const noop=()=>{},canvas=new Proxy({},{get:()=>noop}),nodes=new Map();
const node=()=>({style:{},classList:{add:noop,remove:noop,toggle:noop},setAttribute:noop,addEventListener:noop,getContext:()=>canvas,setPointerCapture:noop});
const context={console,Math,Set,Image:class{},innerWidth:390,innerHeight:844,devicePixelRatio:1,addEventListener:noop,requestAnimationFrame:noop,performance:{now:()=>0},document:{querySelector:s=>{if(!nodes.has(s))nodes.set(s,node());return nodes.get(s)},addEventListener:noop},window:{}};
let code=fs.readFileSync(path.join(__dirname,'../game.js'),'utf8');
code=code.replace('reset();function loop(t)','globalThis.test={im,start,forestReady,prepareStart,bg,bossHeight,bossVisual,depth,updateBoss,bossAuraProgress,ULTIMATE,fireUltimate,reset,beginRun,step,hurt,hit,accelerate,fire,score,end,highScore,drawPoseHero,playerY,playerHeight,waterState,groundZ,groundPhase,sceneryDepth,yy,get state(){return S}};reset();function loop(t)');
vm.runInNewContext(code,context);const g=context.test;


(async()=>{
 const button=nodes.get('#start');assert.equal(button.disabled,true);g.start();assert.equal(g.state.run,0,'loading never starts combat');
 for(const img of [g.im.forestTrees,g.im.forestGround]){img.complete=true;img.naturalWidth=1024;img.onload();}
 await new Promise(resolve=>setImmediate(resolve));assert.equal(button.disabled,false);g.start();assert.equal(g.state.run,1);
 g.reset();g.im.forestTrees.naturalWidth=0;g.prepareStart();g.im.forestTrees.onerror();await new Promise(resolve=>setImmediate(resolve));assert.equal(button.disabled,false);g.start();assert.equal(g.state.run,0);
 g.im.forestTrees.naturalWidth=1024;g.im.forestTrees.onload();await new Promise(resolve=>setImmediate(resolve));assert.equal(button.disabled,false);
 const root=path.join(__dirname,'..'),crypto=require('node:crypto');
 for(const file of ['index.html','game.js','bgm.js','sfx.js','ranking.js']){
  const text=fs.readFileSync(path.join(root,file),'utf8');
  for(const match of text.matchAll(/["']([^"'<>]+\.(?:png|webp|mp3|m4a|js))["']/g))assert(fs.existsSync(path.join(root,match[1])),'missing '+match[1]);
 }
 const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
 for(const [,base,hash] of html.matchAll(/(game|bgm|sfx|ranking)\.([a-f0-9]+)\.js/g)){
  const bytes=fs.readFileSync(path.join(root,base+'.js'));assert.equal(crypto.createHash('sha256').update(bytes).digest('hex').slice(0,12),hash);assert.deepEqual(bytes,fs.readFileSync(path.join(root,base+'.'+hash+'.js')));
 }
 console.log('PASS: background loading gate, failure/retry, asset references and published bundle hashes');
})().catch(e=>{console.error(e);process.exitCode=1});
