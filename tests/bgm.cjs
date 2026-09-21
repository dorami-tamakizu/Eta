const vm=require('node:vm'),fs=require('node:fs'),assert=require('node:assert/strict');
let media,timer,ramp;const param={value:.12,cancelScheduledValues(){},setValueAtTime(v){this.value=v},linearRampToValueAtTime(v,t){ramp=[v,t]}};
const context={window:{AudioContext:class{constructor(){this.currentTime=4;this.state='running';this.destination={}}createGain(){return{gain:param,connect(){}}}createMediaElementSource(){return{connect(){}}}}},Audio:class{constructor(src){media=this;this.src=src;this.paused=true}play(){this.paused=false;return Promise.resolve()}pause(){this.paused=true}},setTimeout:f=>(timer=f,1),clearTimeout:()=>{timer=null},performance:{now:()=>0}};
vm.runInNewContext(fs.readFileSync(__dirname+'/../bgm.js','utf8'),context);const b=context.window.GameBGM;
b.start();assert.equal(media.src,'assets/theme-song.mp3');assert.equal(media.currentTime,0);assert.equal(param.value,.12);assert(!media.paused);
media.currentTime=12;b.pause();assert(media.paused);b.resume();assert.equal(media.currentTime,12);assert(!media.paused);
b.fadeOut();assert.deepEqual(ramp,[0,5.5]);assert(!media.paused);timer();assert(media.paused);
b.start();assert.equal(media.currentTime,0);assert.equal(param.value,.12);assert(!media.paused);assert.equal(timer,null);
console.log('PASS: theme start, gain, pause/resume, result fade and retry');
