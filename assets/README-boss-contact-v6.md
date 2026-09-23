# Boss contact sheet v6 and movement update — 2026-09-23

## Assets

- `boss-skills-contact-v6.webp` (1536 × 1024): supplied `ChatGPT Image 2026年9月23日 18_51_24.png`, converted to WebP with original alpha and dimensions. The character is not regenerated. Per-pose crop rectangles and boot baselines are registered in `drawBossFrame`.
- `boss-fire-dragon-v2.webp` (1024 × 1536): ChatGPT Image generated translucent flame dragon, directed toward the player with its head leading and tail behind.
- `boss-horizontal-flame-v2.webp` (1536 × 1024): ChatGPT Image generated four-stage horizontal flame slash. Row boundaries follow the actual generated frames at y=0,292,560,804,1024.

## Timing and collision

- A 0.38-second flame warning precedes each skill.
- Vertical attack: top-row frames 1/2/3/4 at 0/.228/.38/.5016 seconds. The third pose's sword contact emits one dragon projectile.
- Horizontal attack: bottom-row frames 5/6/7/8 at 0/.152/.2736/.38 seconds. The final follow-through applies one hit across three lanes at the locked depth row, with one-row depth. Retreat avoids it.
- Attack recovery blends for .22 seconds, with a low translucent generated flame afterimage. The flame does not cover the face or blade.
- The dragon starts at the boss's sword-contact side and joins the target lane over .18 seconds. It retains the existing forward projectile collision checks.

## Movement

- Base run speed remains 9 units/second.
- One upward swipe adds one footfall's travel, π/1.35 units, to the remaining boost distance. Its speed impulse decays with a .12-second time constant; repeated inputs add their remaining impulses.
- Superdash speed remains 42 units/second. Its travel budget is 32 units (one complete enemy-pack interval), leaving any excess distance for normal running and manual swipe strides, and ending earlier at contact. The remainder of the final frame uses normal running.
- A further upward swipe cannot reset an active dash's distance budget. Successful dash charge recovery remains once per dash.

- Boss arena camera stays fixed; four-direction patrol is restored at 1.3× speed. Boss sprite size depends only on its own world depth, never on player sprite size. Skill duration is .76 seconds, wide cooldown 2–3.3 seconds, dragon cooldown 4.8–6.8 seconds, ordinary cooldown .8–1.05 seconds.
- Regression checks cover player-independent scaling, four-direction patrol, synchronized faster skills, and dash expiry at one pack interval.

## Image generation prompts

Tool: built-in ChatGPT Image (`image_gen`). Both assets used the supplied contact sheet only as a style and flame-color reference.

Dragon: one transparent portrait game projectile, fearsome East Asian fire dragon charging head-first toward the viewer and slightly downward, head in the lower-central third, tapered flame body and tail trailing upward, foreshortened frontal perspective, painted fantasy-game style, white-hot gold core, orange-red wisps, narrow one-lane silhouette, full visible flame margins, no warrior, sword, text, scenery, ground or baked background.

Slash: a transparent 1536 × 1024 atlas with four vertically stacked wide, low fire-slash stages, aligned on a common center; immediate white-gold full-width slash, broader turbulent crest, dissipating flames, fading embers. Organic orange flame tongues matching the reference, one continuous transverse sweep, no character, weapon, text, grid, scenery or baked background.

Verification uses real pointer handlers and deterministic combat simulation. Actual game canvas rendering was inspected at 390 × 844 for attack poses, projectile launch, flame placement and recovery. Mobile hardware remains a separate environment from this renderer.
