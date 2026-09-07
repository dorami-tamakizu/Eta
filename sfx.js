// Original procedural effects. No downloads, microphone, or external audio service.
(()=>{
  let context=null,bus=null,enabled=false,epoch=0;
  const buffers=new Map(),voices=new Set(),recent=new Map();
  const durations={waterStart:.18,waterSwing:.24,continentStart:.23,continentSwing:.34,hit:.12,down:.43,shot:.23,hurt:.24};
  function synth(kind,type,rate){
    const duration=durations[kind],out=new Float32Array(Math.ceil(duration*rate));
    const level=['waterStart','waterSwing','continentStart','continentSwing'].includes(kind)?.5:1;
    let seed=17319,low=0,phase=0;
    for(let i=0;i<out.length;i++){
      const t=i/rate,u=t/duration;
      seed=(Math.imul(seed,1664525)+1013904223)>>>0;
      const noise=seed/2147483648-1;low+=.12*(noise-low);
      const attack=Math.min(1,t/.006),tail=Math.pow(1-u,2),env=attack*tail;
      let value=0,f=180;
      switch(kind){
        case 'waterStart':f=480+1100*u;phase+=2*Math.PI*f/rate;value=.24*Math.sin(phase)+.3*(noise-low);break;
        case 'waterSwing':f=950-700*u;phase+=2*Math.PI*f/rate;value=.68*(noise-low)*Math.sin(Math.PI*u)+.13*Math.sin(phase);break;
        case 'continentStart':f=150+520*u;phase+=2*Math.PI*f/rate;value=.24*Math.sin(phase)+.13*Math.sin(phase*2.76)+.2*low;break;
        case 'continentSwing':f=145*Math.exp(-5*u)+38;phase+=2*Math.PI*f/rate;value=.55*Math.sin(phase)+.45*low+.22*noise*Math.exp(-20*u);break;
        case 'hit':
          f=type==='slime'?300-220*u:type==='skeleton'?1300-650*u:210-100*u;
          phase+=2*Math.PI*f/rate;
          value=type==='slime'?.45*Math.sin(phase)+.3*low:type==='skeleton'?.26*Math.sin(phase)+.42*noise:.42*Math.sin(phase)+.33*noise;
          break;
        case 'down':f=530*Math.exp(-4*u)+65;phase+=2*Math.PI*f/rate;value=.27*Math.sin(phase)+.2*Math.sin(phase*1.49)+.34*low;break;
        case 'shot':f=type==='dragon'?170-95*u:420+1700*u;phase+=2*Math.PI*f/rate;value=type==='dragon'?.65*low+.25*noise:.32*Math.sin(phase)+.18*Math.sin(phase*2)+.12*noise;break;
        case 'hurt':f=95-48*u;phase+=2*Math.PI*f/rate;value=.55*Math.sin(phase)+.4*noise*Math.exp(-9*u);break;
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
    bus.connect(limiter);limiter.connect(context.destination);return true;
  }
  function clear(){
    for(const source of voices){try{source.stop()}catch(_){}source.disconnect()}
    voices.clear();recent.clear();
  }
  function start(){
    const token=++epoch;enabled=true;
    try{
      if(!ensure())return;clear();bus.gain.value=.48;
      // resume() is called synchronously inside START/RESUME's user gesture.
      const resumed=context.resume();
      Promise.resolve(resumed).then(()=>{if(token!==epoch&&!enabled)bus.gain.value=0}).catch(()=>{});
    }catch(_){enabled=false}
  }
  function pause(){
    ++epoch;enabled=false;
    if(!context)return;bus.gain.value=0;clear();
    try{Promise.resolve(context.suspend()).catch(()=>{})}catch(_){}
  }
  function finish(){enabled=false;recent.clear()} // Let the last hit/defeat tail finish.
  function play(kind,type=''){
    if(!enabled||!context||context.state!=='running'||document.hidden||!durations[kind])return;
    try{
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
