(()=>{
 const files={cast:'skill-cast.mp3',fire:'skill-fire-impact.mp3',ice:'skill-ice-impact.mp3',reflect:'spell-reflect-v2.mp3',ultimate:'ultimate-cast.mp3'};
 const bytes={},buffers={},voices=new Map();let ctx,loading;
 for(const [key,file] of Object.entries(files))bytes[key]=fetch('assets/'+file).then(r=>{if(!r.ok)throw Error(file);return r.arrayBuffer()}).catch(()=>null);
 function unlock(){
  const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;
  if(!ctx){ctx=new AC();loading=Promise.all(Object.keys(files).map(async key=>{const data=await bytes[key];if(data)try{buffers[key]=await ctx.decodeAudioData(data)}catch{}}));}
  if(ctx.state==='suspended')ctx.resume().catch(()=>{});
 }
 function stop(v,fade=.025){if(!v.source)return;const now=ctx.currentTime;v.gain.gain.cancelScheduledValues(now);v.gain.gain.setValueAtTime(v.gain.gain.value,now);v.gain.gain.linearRampToValueAtTime(0,now+fade);try{v.source.stop(now+fade)}catch{};v.source=null;}
 function pause(){for(const v of voices.values())stop(v);voices.clear();}
 function sync(entries,paused){
  if(paused||document.hidden){pause();return;}
  const ids=new Set(entries.map(e=>e.id));for(const [id,v] of voices)if(!ids.has(id)){stop(v);voices.delete(id);}
  if(!ctx||ctx.state!=='running')return;
  for(const e of entries){
   if(voices.has(e.id)||!buffers[e.name])continue;
   const buffer=buffers[e.name],offset=Math.max(0,e.age),remaining=Math.min(e.duration-offset,buffer.duration-offset);
   if(remaining<=.005)continue;
   const source=ctx.createBufferSource(),gain=ctx.createGain(),now=ctx.currentTime,level=.48;
   source.buffer=buffer;source.connect(gain);gain.connect(ctx.destination);
   // Short attack avoids clicks. The tail reaches silence at the visual end.
   const attack=Math.min(.008,remaining/4),fade=Math.min(.09,remaining*.3);
   gain.gain.setValueAtTime(0,now);gain.gain.linearRampToValueAtTime(level,now+attack);
   gain.gain.setValueAtTime(level,now+remaining-fade);gain.gain.linearRampToValueAtTime(0,now+remaining);
   const v={source,gain};voices.set(e.id,v);source.onended=()=>{source.disconnect();gain.disconnect();v.source=null;};
   source.start(now,offset);source.stop(now+remaining);
  }
 }
 document.addEventListener('pointerdown',unlock,{capture:true,passive:true});document.addEventListener('keydown',unlock,{capture:true});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)pause();});window.addEventListener('pagehide',pause);
 window.SpellSFX={sync,pause,unlock};window.GameSFX={start:unlock,wake:unlock,pause,finish:pause,play(){}};
})();
