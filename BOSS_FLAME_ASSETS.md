# Boss overhead stance and horizontal fire slash

Built-in GPT image generation. Both sheets 1536x1024 pixels, RGBA, converted to WebP for runtime.

assets/boss-overhead-walk-v1.webp: eight frames in 4x2 grid. Prompt: preserve the original black/red/gold armored male boss, flaming curved sword, beard and cape. Hold sword with both hands above the head in every walking frame; alternate feet naturally, fixed camera and scale, transparent background. Pose checked against supplied video at 3.2 seconds. Idle and wind-up use this stance, active sword attack uses existing swing frames.

assets/boss-horizontal-flame-v1.webp: four full-width rows. Prompt: a single horizontal sword strike of orange-red turbulent flames, compact ignition, outward spread, full-width blaze, then embers. White-hot core, distinct curling flame tongues; no characters, scenery, text, or floor. Transparent background.

Flame animates for 0.48 seconds at the locked attack depth, replacing the old red beam and local wide-attack arc. Existing 0.5-second aura warning, damage timing and depth-dodge hitbox unchanged.
