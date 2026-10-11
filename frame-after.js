(()=>{
 const $=s=>document.querySelector(s),pause=$('#stop').onclick;
 function leave(){pause();window.GameBGM?.pause();window.GameSFX?.pause();window.GAME_ACTIVE=false;parent.postMessage({type:'game-return',stage:window.GAME_STAGE},location.origin);}
 $('#stop').onclick=leave;$('#retry').onclick=leave;
 window.GameBridge={pause,start(){if($('#start').disabled)return false;window.GAME_ACTIVE=true;$('#pause').classList.add('hide');$('#result').classList.add('hide');$('#scoreEntry').classList.add('hide');$('#start').click();window.GameRenderResume?.();return true;},ranking(body){window.GameRanking.open(body);}};
 const timer=setInterval(()=>{if(!$('#start').disabled){clearInterval(timer);parent.postMessage({type:'game-ready',stage:window.GAME_STAGE},location.origin);}},100);
 if(parent===window)location.replace('/Eta/menu.html#stages');
})();
