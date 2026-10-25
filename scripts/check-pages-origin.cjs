// Fail closed before publishing if the release points back to ChatGPT Sites.
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(process.argv[2]||'.');
const files=['index.html','menu.html','menu.js','menu.css','frame-after.js','sample-ranking.js','ranking.css'];
function walk(dir){for(const e of fs.readdirSync(path.join(root,dir),{withFileTypes:true})){const p=path.join(dir,e.name);if(e.isDirectory())walk(p);else if(/\.(html?|js|css|json)$/i.test(p))files.push(p);}}
for(const d of ['sword','spear','ex','spell'])walk(d);
let failed=false;
for(const file of files){const source=fs.readFileSync(path.join(root,file),'utf8');if(/chatgpt\s*\.\s*site/i.test(source)){console.error('Forbidden ChatGPT Sites destination: '+file);failed=true;}}
const index=fs.readFileSync(path.join(root,'index.html'),'utf8');
if(!index.includes('id="toStages"')||/<meta[^>]+http-equiv=["']?refresh/i.test(index)){console.error('Pages must serve the game title screen directly');failed=true;}
if(failed)process.exit(1);
console.log('GitHub Pages origin guard passed ('+files.length+' runtime text files)');
