(()=>{
  const audio=new Audio('assets/theme-song.mp3');audio.loop=true;audio.preload='auto';
  let ctx,gain,stopTimer=null;const volume=.12;
  function cancel(){clearTimeout(stopTimer);stopTimer=null;}
  function unlock(){
    if(!ctx){const AC=window.AudioContext||window.webkitAudioContext;if(AC){ctx=new AC();gain=ctx.createGain();gain.gain.value=volume;ctx.createMediaElementSource(audio).connect(gain);gain.connect(ctx.destination)}else audio.volume=volume;}
    if(ctx&&ctx.state==='suspended')ctx.resume().catch(()=>{});
  }
  function level(v){if(gain){gain.gain.cancelScheduledValues(ctx.currentTime);gain.gain.setValueAtTime(v,ctx.currentTime)}else audio.volume=v;}
  function play(restart){cancel();unlock();level(volume);if(restart)audio.currentTime=0;audio.play().catch(()=>{});}
  function pause(){cancel();audio.pause();}
  function fadeOut(){
    cancel();if(audio.paused)return;
    if(gain){gain.gain.cancelScheduledValues(ctx.currentTime);gain.gain.setValueAtTime(gain.gain.value,ctx.currentTime);gain.gain.linearRampToValueAtTime(0,ctx.currentTime+1.5);stopTimer=setTimeout(()=>audio.pause(),1550)}
    else{const start=performance.now(),v=audio.volume;function fade(){const p=Math.min(1,(performance.now()-start)/1500);audio.volume=v*(1-p);if(p<1)stopTimer=setTimeout(fade,30);else audio.pause()}fade();}
  }
  window.GameBGM={start:()=>play(false),restart:()=>play(true),resume:()=>play(false),pause,fadeOut};
})();
