const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const noop=()=>{},canvas=new Proxy({},{get:()=>noop}),nodes=new Map();
const node=()=>({style:{},classList:{add:noop,remove:noop,toggle:noop},setAttribute:noop,addEventListener:noop,getContext:()=>canvas,setPointerCapture:noop});
const context={console,Math,Set,Image:class{},innerWidth:390,innerHeight:844,devicePixelRatio:1,addEventListener:noop,requestAnimationFrame:noop,performance:{now:()=>0},document:{querySelector:s=>{if(!nodes.has(s))nodes.set(s,node());return nodes.get(s)},addEventListener:noop},window:{}};
let code=fs.readFileSync(path.join(__dirname,'../game.js'),'utf8');
code=code.replace('reset();function loop(t)','globalThis.test={bossHeight,bossVisual,depth,updateBoss,bossAuraProgress,ULTIMATE,fireUltimate,reset,beginRun,step,hurt,hit,accelerate,fire,score,end,highScore,playerY,playerHeight,waterState,groundZ,groundPhase,sceneryDepth,yy,get state(){return S}};reset();function loop(t)');
vm.runInNewContext(code,context);const g=context.test;


// Inject deterministic entropy to verify decisions without flaky statistical tests.
let seed=91823;context.crypto={getRandomValues(v){seed=(Math.imul(seed,1664525)+1013904223)>>>0;v[0]=seed;return v;}};
function encounter(){g.reset();const s=g.state;s.run=1;s.phase='boss';s.guard=1;const e={boss:true,z:9,l:1,displayLane:1,attackCount:0};const moves=[],casts=[];let previous=null;
 for(let i=0;i<6000;i++){g.updateBoss(e,.01);if(previous!==e.patrol){moves.push([...e.patrol.target,e.patrol.duration,e.patrol.stride]);previous=e.patrol;}if(e.action&&e.action.age===0)casts.push([i,e.action.kind]);assert(e.z>=9-1e-9&&e.z<=15+1e-9);assert(e.displayLane>=0&&e.displayLane<=2);}
 return {moves,casts};}
const a=encounter(),b=encounter();assert.notDeepEqual(a,b,'retry must not reset the boss random sequence');assert(a.moves.length>5);assert(a.casts.some(c=>c[1]==='wide')&&a.casts.some(c=>c[1]==='dragon'));assert(a.casts.some((c,i)=>i&&c[1]===a.casts[i-1][1]),'consecutive identical skills allowed');assert(new Set(a.casts.slice(1).map((c,i)=>c[0]-a.casts[i][0])).size>5,'timing is not periodic');assert(new Set(a.moves.map(m=>m[2])).size>5);
console.log('PASS: independent replay sequences, random bounded movement/speed, both skills, repeated skills and nonperiodic timing');
