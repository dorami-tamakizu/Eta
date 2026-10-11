const fs=require('node:fs'),path=require('node:path');
const manifest=require('../pages-release-manifest.json');
const out='_site';fs.rmSync(out,{recursive:true,force:true});fs.mkdirSync(out);
for(const name of new Set([...manifest.files.map(f=>f.path),'index.html','.nojekyll','pages-release.json'])){
 if(name.startsWith('/')||name.split('/').includes('..'))throw Error('Unsafe path');
 const target=path.join(out,name);fs.mkdirSync(path.dirname(target),{recursive:true});fs.copyFileSync(name,target);
}
