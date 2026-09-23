# Boss arena revision

Boss feet stop at 50% of screen height (world depth 9). Camera scrolling stops in the boss phase, while the hero can return to the fighting position. Player normal attacks gain boss-only range 5 so the centered boss remains reachable; ordinary enemies retain existing reach.

Normal boss attacks: no wind-up, no pose animation, no aura. Immediate 2 damage at 1.05–1.35s intervals when not executing a skill. Guard blocks damage.

Wide slash: separate randomized cooldown, 2.6–4.4s between scheduling attempts; deferred until the current skill finishes. 0.5s rising flame aura, then one straight horizontal slash across all three lanes for 4 damage. Guard blocks it. Skill occupies 1.0s, with 0.65s until the next normal attack.

Fire dragon remains on a separate 6.5–9s randomized timer, using the same 0.5s aura before firing. Pause and player ultimate cut-in freeze gameplay timers. Boss HP unchanged.
