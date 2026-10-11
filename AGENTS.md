# Public hosting requirement

The sole canonical game origin is https://dorami-tamakizu.github.io/Eta/.
Never redirect GitHub Pages visitors to ChatGPT Sites or migrate hosting without
an explicit new user instruction. The old ChatGPT Sites entrance may redirect
TO GitHub Pages, never the reverse. Preserve all existing ranking records.
Run `node scripts/check-pages-origin.cjs` before publishing. The deployment
workflow must not publish when this check fails. Do not remove or weaken this
check merely to make a build pass.
