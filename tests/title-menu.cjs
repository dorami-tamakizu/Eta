const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const noop=()=>{},canvas=new Proxy({},{get:()=>noop}),nodes=new Map();
const node=()=>({style:{},classList:{add:noop,remove:noop,toggle:noop},setAttribute:noop,addEventListener:noop,getContext:()=>canvas,setPointerCapture:noop});
const context={console,Math,Set,Image:class{},innerWidth:390,innerHeight:844,devicePixelRatio:1,addEventListener:noop,requestAnimationFrame:noop,performance:{now:()=>0},document:{querySelector:s=>{if(!nodes.has(s))nodes.set(s,node());return nodes.get(s)},addEventListener:noop},window:{GameRanking:{open:body=>body.innerHTML='shared ranking'}}};
let code=fs.readFileSync(path.join(__dirname,'../game.js'),'utf8');
code=code.replace('reset();function loop(t)','globalThis.test={closeGuide,showGuidePage,openTitlePanel,closeTitlePanel,bossHeight,bossVisual,depth,updateBoss,bossAuraProgress,ULTIMATE,fireUltimate,reset,beginRun,step,hurt,hit,accelerate,fire,score,end,highScore,drawPoseHero,playerY,playerHeight,waterState,groundZ,groundPhase,sceneryDepth,yy,get state(){return S}};reset();function loop(t)');
vm.runInNewContext(code,context);const g=context.test;


const saved=new Map();context.localStorage={getItem:k=>saved.get(k),setItem:(k,v)=>saved.set(k,v)};
g.reset();g.openTitlePanel('help');assert.equal(g.state.run,0);assert(nodes.get('#guideImage').alt.includes('ゲーム概要'));assert.equal(nodes.get('#guidePrev').hidden,true);nodes.get('#guideNext').onclick();assert(nodes.get('#guideImage').alt.includes('スーパーダッシュ'));nodes.get('#guideNext').onclick();assert.equal(nodes.get('#guideExit').textContent,'閉じる');assert.equal(nodes.get('#guideNext').hidden,true);nodes.get('#guidePrev').onclick();assert(nodes.get('#guideImage').alt.includes('スーパーダッシュ'));g.closeGuide();g.openTitlePanel('help');assert(nodes.get('#guideImage').alt.includes('ゲーム概要'));g.closeGuide();g.openTitlePanel('ranking');assert(nodes.get('#titlePanelBody').innerHTML.includes('shared ranking'));
g.closeTitlePanel();assert.equal(g.state.run,0);
console.log('PASS: help pages close to title and shared ranking opens outside gameplay');
