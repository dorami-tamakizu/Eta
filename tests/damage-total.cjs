const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const noop=()=>{},canvas=new Proxy({},{get:()=>noop}),nodes=new Map();
const node=()=>({style:{},classList:{add:noop,remove:noop,toggle:noop},setAttribute:noop,addEventListener:noop,getContext:()=>canvas,setPointerCapture:noop});
const context={console,Math,Set,Image:class{},innerWidth:390,innerHeight:844,devicePixelRatio:1,addEventListener:noop,requestAnimationFrame:noop,performance:{now:()=>0},document:{querySelector:s=>{if(!nodes.has(s))nodes.set(s,node());return nodes.get(s)},addEventListener:noop},window:{}};
let code=fs.readFileSync(path.join(__dirname,'../game.js'),'utf8');
code=code.replace('reset();function loop(t)','globalThis.test={totalDealtDamage,bossHeight,bossVisual,depth,updateBoss,bossAuraProgress,ULTIMATE,fireUltimate,reset,beginRun,step,hurt,hit,accelerate,fire,score,end,highScore,drawPoseHero,playerY,playerHeight,waterState,groundZ,groundPhase,sceneryDepth,yy,get state(){return S}};reset();function loop(t)');
vm.runInNewContext(code,context);const g=context.test;


for(const [over,total] of [[94,308],[125,339],[109,323]]){
 g.reset();const s=g.state;s.dealtDamage=214;s.overkill=over;assert.equal(g.totalDealtDamage(),total);const points=g.score(1);assert.equal(points.dealt,Math.round(total*100000/214));g.end(1);assert(nodes.get('#resultText').innerHTML.includes('<strong>'+total+'</strong>'));assert.equal(nodes.get('#overkillValue').textContent,String(over));
}
g.reset();const s=g.state;s.ultimateCharge=0;const e={t:'boss',hp:4,max:4,l:1,z:9,dead:0};g.hit(e,3,1);g.hit(e,3,1);assert.equal(s.dealtDamage,4);assert.equal(s.overkill,2);assert.equal(g.totalDealtDamage(),6);assert.equal(s.ultimateCharge,4,'overkill does not charge ultimate');g.hit(e,10,1);assert.equal(g.totalDealtDamage(),6,'dead enemy does not count again');
g.reset();const r=g.state;const enemies=r.en;assert.equal(enemies.reduce((n,e)=>n+e.hp,0)+40,214);enemies.push({t:'boss',hp:40,max:40,l:1,z:400,dead:0});let attackSum=0;for(const e of enemies){while(!e.dead){g.hit(e,3,1);attackSum+=3;}}assert.equal(r.dealtDamage,214);assert.equal(g.totalDealtDamage(),214+r.overkill);assert.equal(g.totalDealtDamage(),attackSum);
console.log('PASS: all three screenshot totals, full-stage HP plus overkill, score/display agreement, no duplicate credit or extra ultimate charge');
