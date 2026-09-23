# Boss arena revision

Boss feet stop at 50% of screen height (world depth 9). Camera scrolling stops in the boss phase, while the hero can return to the fighting position. Player normal attacks gain boss-only range 5 so the centered boss remains reachable; ordinary enemies retain existing reach.

Normal boss attacks: no wind-up, no pose animation, no aura. Immediate 2 damage at 1.05–1.35s intervals when not executing a skill. Guard blocks damage.

Wide slash: separate randomized cooldown, 2.6–4.4s between scheduling attempts; deferred until the current skill finishes. 0.5s rising flame aura, then one straight horizontal slash across all three lanes for 4 damage. Guard blocks it. Skill occupies 1.0s, with 0.65s until the next normal attack.

Fire dragon remains on a separate 6.5–9s randomized timer, using the same 0.5s aura before firing. Pause and player ultimate cut-in freeze gameplay timers. Boss HP unchanged.

Correction: fixed-camera movement preserves the player's reached depth, never pulls back toward default depth after dash/boost, and retains explicit retreat input. Boss floor range polygons, ground line, and ground warning marker removed; the requested flame aura remains. Cut-in sound is a direct AAC stream copy of the reference video 3.20–3.92s, with no synthesized ringing or EQ, played at its original level.

Correction: restore the same frontline renderer for road and boss enemies. Boss spawns at center depth 9 and stays at that center-depth limit (feet at 50.08% of screen height). Floor attack-area telegraphs remain removed.

Boss now retreats continuously at 0.65 depth units/s from center depth 9, never forward of center. Camera follows only beyond depth 11.5 to keep the fight visible. Hero can follow without being pulled back. Backstep atlas animates between attacks; sword atlas takes priority during skills while retreat continues. Start cue: original source brightened, echoes extended to 1.85 seconds, full-level dedicated playback.

Slow walk revision: retreat speed 0.32 units/s, backstep cycle 0.55 cycles/s. Battle start uses the exact same original-v5.m4a asset and direct output level as ultimate cut-in.
