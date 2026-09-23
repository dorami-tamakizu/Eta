const vm=require('node:vm'),fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const media=[];class Audio{constructor(src){this.src=src;this.currentTime=0;this.plays=0;media.push(this)}play(){this.plays++;this.paused=false;return Promise.resolve()}pause(){this.paused=true}}
const node=()=>({connect(){},disconnect(){},gain:{value:1}});
class Context{constructor(){this.state='running';this.destination={}}createGain(){return node()}createDynamicsCompressor(){return {...node(),threshold:{},knee:{},ratio:{},attack:{},release:{}}}createMediaElementSource(){return node()}resume(){this.state='running';return Promise.resolve()}suspend(){this.state='suspended';return Promise.resolve()}}
const c={window:{AudioContext:Context},Audio,document:{hidden:false,addEventListener(){}},Map,Set,Float32Array,Math,Promise};
vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../sfx.js'),'utf8'),c);const s=c.window.GameSFX;
s.start();s.play('ultimateCutin',0);const audio=media[1];
assert.equal(media[0].volume,.12,'battle cue uses field BGM level');
assert.equal(media[0].src,'assets/battle-start-syakiin-v8.mp3');assert.equal(audio.src,'assets/ultimate-syakiin-heavy-v9.mp3');s.play('battleStart');assert.equal(media[0].plays,1);assert.equal(media[0].currentTime,0);
assert(audio);assert.equal(audio.plays,1);assert.equal(audio.currentTime,0);
s.pause();assert.equal(audio.paused,true);s.play('ultimateCutin');assert.equal(audio.plays,1,'cannot play while paused');
s.start();s.play('ultimateCutin',.05);assert.equal(audio.currentTime,.05);assert.equal(audio.plays,3);
audio.currentTime=.08;s.finish();assert.equal(audio.paused,false,'tail continues after results');s.pause();assert.equal(audio.paused,true);s.start();assert.equal(audio.currentTime,.08);assert.equal(audio.paused,false,'resume tail after cut-in ends');s.start();assert.equal(audio.currentTime,.08,'retry does not truncate tail');s.play('ultimateCutin',0);assert.equal(audio.currentTime,0);
console.log('PASS: reference audio playback, pause, resume offset and restart');

s.start();const flight=media[2];assert.equal(flight.src,'assets/ultimate-sword-flight-v10.mp3');s.play('ultimateFlight');const count=flight.plays;assert(count>0);flight.currentTime=.3;s.pause();assert(flight.paused);s.start();assert.equal(flight.currentTime,.3);assert.equal(flight.plays,count+1);s.finish();assert.equal(flight.paused,false,'flight tail continues after result');

s.start();const fall=media[3];assert.equal(fall.src,'assets/hero-fall-v11.mp3');s.play('heroFall');assert(fall.plays>0);fall.currentTime=.4;s.pause();assert(fall.paused);s.start();assert.equal(fall.currentTime,.4);assert.equal(fall.paused,false);s.finish();assert.equal(fall.paused,false,'fall sound retains tail');
