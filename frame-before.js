window.GAME_ACTIVE=false;
const gameRAF=window.requestAnimationFrame.bind(window);
// Park the single game loop while its iframe is inactive instead of polling each frame.
let parkedGameLoop=null;
window.requestAnimationFrame=function(callback){
 if(callback.name!=='loop')return gameRAF(callback);
 if(!window.GAME_ACTIVE||document.hidden){parkedGameLoop=callback;return 0;}
 return gameRAF(t=>{if(window.GAME_ACTIVE&&!document.hidden)callback(t);else parkedGameLoop=callback;});
};
window.GameRenderResume=function(){if(parkedGameLoop&&window.GAME_ACTIVE&&!document.hidden){const callback=parkedGameLoop;parkedGameLoop=null;window.requestAnimationFrame(callback);}};
// Keep tab switching as a pause, independent of the navigation button.
document.addEventListener('visibilitychange',e=>{e.stopImmediatePropagation();if(document.hidden)window.GameBridge?.pause();else window.GameRenderResume();},true);
