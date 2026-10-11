// Confirmed values and provisional choices are kept separately for playtest tuning.
window.EX_CONFIG=Object.freeze({
  playerHP:20,bossHP:100,stocks:4,initialGauge:90,
  entry:{duration:4,flash:.35,bandIn:1.3,fadeStart:3.35},
  skills:{normal:[2,3],rechargeSeconds:5},
  ultimate:{damage:3,hits:[.42,.66,.90],duration:1.25},
  burst:{duration:10,damageMultiplier:2},
  dash:{window:.5,retreatDistance:.12},
  knockback:{unitsPerDamage:.2},
  assets:{rock:null,rockBreak:null,bossCollision:null},
  // Latest playtest: skills 3/4 visibly accumulate flame; skill 4 briefly holds it.
  // Unspecified motion markers, falling flight time and pillar speed are provisional.
  attacks:{interval:[.8,2],
    wide:{windup:0,release:.24,motion:.76,duration:.76,damage:4},
    dragon:{windup:0,release:.38,motion:.76,duration:.76,speed:10,damage:4},
    fall:{windup:0,raiseTime:.12,chargeStart:.08,riseTime:.30,release:.48,warning:.5,flight:.16,duration:1.3,damage:10,area:'frontline-to-screen-bottom'},
    pillars:{windup:0,preFireHold:.3,release:1.3,interval:.50,duration:2.0,speedMultiplier:.25,trailLife:.32,trailInterval:.04,strashFar:45,strashTravel:.2133333333,damage:10},
    laser:{windup:0,release:.10,active:.8,duration:1,damage:2}}
});
