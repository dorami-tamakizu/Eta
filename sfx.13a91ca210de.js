// User-provided battle-start and ultimate cues; procedural gameplay effects.
(()=>{
  let context=null,bus=null,enabled=false,epoch=0;
  const battleAudio=new Audio('assets/battle-start-syakiin-v8.mp3');battleAudio.preload='auto';battleAudio.volume=.12;
  const ultimateAudio=new Audio('assets/ultimate-syakiin-heavy-v9.mp3');ultimateAudio.preload='auto';let resumeUltimate=false;
  const buffers=new Map(),voices=new Set(),recent=new Map();
  const durations={ultimateCutin:3.214,waterStart:.18,waterSwing:.24,continentStart:.23,continentSwing:.34,hit:.12,down:.43,shot:.28,hurt:.20,battleStart:5.329,superdash:.48,guardRaise:.18,guardBlock:.24};
  function synth(kind,type,rate){
    const duration=durations[kind],out=new Float32Array(Math.ceil(duration*rate));
    const level=['waterStart','waterSwing','continentStart','continentSwing'].includes(kind)?.25:1;
    let seed=17319,low=0,phase=0;
    for(let i=0;i<out.length;i++){
      const t=i/rate,u=t/duration;
      seed=(Math.imul(seed,1664525)+1013904223)>>>0;
      const noise=seed/2147483648-1;low+=.12*(noise-low);
      const attack=Math.min(1,t/.006),tail=Math.pow(1-u,2),env=attack*tail;
      let value=0,f=180;
      switch(kind){
        case 'waterStart':f=380+520*u;phase+=2*Math.PI*f/rate;value=.20*Math.sin(phase)+.24*low;break;
        case 'waterSwing':f=950-700*u;phase+=2*Math.PI*f/rate;value=.50*low*Math.sin(Math.PI*u)+.24*(noise-low)*Math.sin(Math.PI*u)+.09*Math.sin(phase);break;
        case 'continentStart':f=150+520*u;phase+=2*Math.PI*f/rate;value=.24*Math.sin(phase)+.13*Math.sin(phase*2.76)+.2*low;break;
        case 'continentSwing':f=145*Math.exp(-5*u)+38;phase+=2*Math.PI*f/rate;value=.40*Math.sin(phase)+.52*low+.13*noise*Math.exp(-25*u);break;
        case 'hit':
          f=type==='slime'?300-220*u:type==='skeleton'?1300-650*u:210-100*u;
          phase+=2*Math.PI*f/rate;
          value=type==='slime'?.34*Math.sin(phase)+.30*low:type==='skeleton'?.18*Math.sin(phase)*Math.exp(-8*u)+.26*noise*Math.exp(-10*u):.30*Math.sin(phase)+.24*low;
          break;
        case 'down':f=530*Math.exp(-4*u)+65;phase+=2*Math.PI*f/rate;value=.19*Math.sin(phase)+.12*Math.sin(phase*1.49)+.25*low;break;
        case 'shot':f=type==='dragon'?170-95*u:420+1700*u;phase+=2*Math.PI*f/rate;value=type==='dragon'?.50*low+.12*noise:.22*Math.sin(phase)+.09*Math.sin(phase*2)+.10*low;break;
        case 'superdash':f=280+950*u;phase+=2*Math.PI*f/rate;value=.32*low*Math.sin(Math.PI*u)+.16*(noise-low)*Math.sin(Math.PI*u)+.10*Math.sin(phase)*Math.exp(-4*u);break;
        case 'battleStart': {
          // Dense shard impact, scattered bright tinkles and a metal decay.
          value=.23*(noise-low)*Math.exp(-75*t)+.10*Math.sin(2*Math.PI*920*t)*Math.exp(-5*t);
          for(let j=0;j<18;j++){
            const delay=j===0?0:.012+j*.019+(j%3)*.007,age=t-delay;
            if(age<0)continue;
            const hz=1450+(j*947)%6100,decay=7+(j%5)*2;
            value+=(.047+(j%3)*.009)*Math.sin(2*Math.PI*hz*age)*Math.exp(-decay*age)*Math.min(1,age/.0015);
            if(j<6)value+=.014*Math.sin(2*Math.PI*hz*.501*(age-.055))*Math.exp(-4*Math.max(0,age-.055))*Math.min(1,Math.max(0,age-.055)/.012);
          }
          break;
        }
        case 'guardRaise':f=620-240*u;phase+=2*Math.PI*f/rate;value=.18*Math.sin(phase)*Math.exp(-5*u)+.12*low;break;
        case 'guardBlock':f=740-180*u;phase+=2*Math.PI*f/rate;value=.22*Math.sin(phase)*Math.exp(-6*u)+.15*Math.sin(phase*2.71)*Math.exp(-12*u)+.16*low;break;
        case 'hurt':f=95-48*u;phase+=2*Math.PI*f/rate;value=.34*Math.sin(phase)+.24*low*Math.exp(-9*u);break;
      }
      out[i]=Math.tanh(value*1.3)*env*.65*level;
    }
    return out;
  }
  function ensure(){
    if(context)return true;
    const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio)return false;
    context=new Audio();bus=context.createGain();bus.gain.value=.48;
    const limiter=context.createDynamicsCompressor();
    limiter.threshold.value=-14;limiter.knee.value=12;limiter.ratio.value=8;
    limiter.attack.value=.003;limiter.release.value=.12;
    context.createMediaElementSource(battleAudio).connect(context.destination);
    context.createMediaElementSource(ultimateAudio).connect(context.destination);
    bus.connect(limiter);limiter.connect(context.destination);return true;
  }
  function clear(){
    battleAudio.pause();battleAudio.currentTime=0;
    for(const source of voices){try{source.stop()}catch(_){}source.disconnect()}
    voices.clear();recent.clear();
  }
  function start(){
    const token=++epoch;enabled=true;
    try{
      if(!ensure())return;clear();bus.gain.value=.48;
      if(resumeUltimate){resumeUltimate=false;ultimateAudio.play().catch(()=>{});}
      // resume() is called synchronously inside START/RESUME's user gesture.
      const resumed=context.resume();
      Promise.resolve(resumed).then(()=>{if(token!==epoch&&!enabled)bus.gain.value=0}).catch(()=>{});
    }catch(_){enabled=false}
  }
  function pause(){
    ++epoch;enabled=false;
    resumeUltimate=resumeUltimate||(!ultimateAudio.paused&&!ultimateAudio.ended);ultimateAudio.pause();
    if(!context)return;bus.gain.value=0;clear();
    try{Promise.resolve(context.suspend()).catch(()=>{})}catch(_){}
  }
  function finish(){enabled=false;recent.clear()} // Let the last hit/defeat tail finish.
  function play(kind,type=''){
    if(!enabled||!context||context.state==='closed'||document.hidden||!durations[kind])return;
    try{
      if(kind==='ultimateCutin'){ultimateAudio.currentTime=Math.max(0,Math.min(3.214,Number(type)||0));ultimateAudio.play().catch(()=>{});return}
      if(kind==='battleStart'){battleAudio.currentTime=0;battleAudio.play().catch(()=>{});return}
      const key=kind+':'+type,now=context.currentTime;
      // Simultaneous multi-enemy hits share a short accent instead of clipping.
      if(now-(recent.get(key)??-Infinity)<.025)return;
      recent.set(key,now);
      if(!buffers.has(key)){
        const samples=synth(kind,type,context.sampleRate),buffer=context.createBuffer(1,samples.length,context.sampleRate);
        buffer.getChannelData(0).set(samples);buffers.set(key,buffer);
      }
      if(voices.size>=12){const oldest=voices.values().next().value;oldest.stop();oldest.disconnect();voices.delete(oldest)}
      const source=context.createBufferSource();source.buffer=buffers.get(key);source.connect(bus);
      source.onended=()=>{voices.delete(source);source.disconnect()};voices.add(source);source.start();
    }catch(_){} // Audio failure must never interrupt combat or touch input.
  }
  document.addEventListener('visibilitychange',()=>{if(document.hidden)pause()});
  function wake(){if(!enabled||context?.state!=='running')start()}
  window.GameSFX={start,pause,finish,play,wake};
})();

