const vm=require('node:vm'),fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const media=[];class Audio{constructor(src){this.src=src;this.currentTime=0;this.plays=0;media.push(this)}play(){this.plays++;this.paused=false;return Promise.resolve()}pause(){this.paused=true}}
const node=()=>({connect(){},disconnect(){},gain:{value:1}});
class Context{constructor(){this.state='running';this.destination={}}createGain(){return node()}createDynamicsCompressor(){return {...node(),threshold:{},knee:{},ratio:{},attack:{},release:{}}}createMediaElementSource(){return node()}resume(){this.state='running';return Promise.resolve()}suspend(){this.state='suspended';return Promise.resolve()}}
const c={window:{AudioContext:Context},Audio,document:{hidden:false,addEventListener(){}},Map,Set,Float32Array,Math,Promise};
vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../sfx.js'),'utf8'),c);const s=c.window.GameSFX;
s.start();s.play('ultimateCutin',0);const audio=media.find(x=>x.src.includes('ultimate-cutin'));
assert(audio);assert.equal(audio.plays,1);assert.equal(audio.currentTime,0);
s.pause();assert.equal(audio.paused,true);s.play('ultimateCutin');assert.equal(audio.plays,1,'cannot play while paused');
s.start();s.play('ultimateCutin',.35);assert.equal(audio.currentTime,.35);assert.equal(audio.plays,3);
audio.currentTime=1.7;s.finish();assert.equal(audio.paused,false,'tail continues after results');s.pause();assert.equal(audio.paused,true);s.start();assert.equal(audio.currentTime,1.7);assert.equal(audio.paused,false,'resume tail after cut-in ends');s.start();assert.equal(audio.currentTime,1.7,'retry does not truncate tail');s.play('ultimateCutin',0);assert.equal(audio.currentTime,0);
console.log('PASS: reference audio playback, pause, resume offset and restart');
