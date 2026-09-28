const { spawnSync } = require('node:child_process');
const path = require('node:path');

// cleanup-equivalence.cjs is a historical comparison; see README.md.
const tests = [
  'bgm.cjs',
  'boss-animation.cjs',
  'boss-hitbox.cjs',
  'boss-random.cjs',
  'damage-total.cjs',
  'frontline-title.cjs',
  'release.cjs',
  'running.cjs',
  'shared-ranking.cjs',
  'swipe-movement.cjs',
  'title-menu.cjs',
  'ultimate-audio.cjs',
];

const root = path.join(__dirname, '..');
let failed = 0;
for (const test of tests) {
  console.log(`\nRunning tests/${test}`);
  const result = spawnSync(process.execPath, [path.join(root, 'tests', test)], {
    cwd: root,
    stdio: 'inherit',
  });
  if (result.error || result.status !== 0) {
    console.error(`FAIL: ${test}`, result.error || result.signal || `exit ${result.status}`);
    failed++;
  }
}

console.log(`\n${tests.length - failed}/${tests.length} regression tests passed.`);
process.exitCode = failed ? 1 : 0;
