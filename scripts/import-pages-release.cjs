// One-time, hash-checked import of the approved public release.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const manifest=require('../pages-release-manifest.json');
const sourceRoot=process.argv[2];
const out=path.resolve(process.argv[3]||'.');
const prefix='/Eta/';
const textExtensions=new Set(['.html','.css','.js']);
function digest(data){return crypto.createHash('sha256').update(data).digest('hex');}
function adapt(file,data){
  if(!textExtensions.has(path.extname(file)))return data;
  let text=data.toString('utf8');
  text=text.replace(/(["'])\/(?!\/)/g,'$1'+prefix).replace(/url\(\/(?!\/)/g,'url('+prefix);
  return Buffer.from(text);
}
async function get(entry){
  if(sourceRoot)return fs.readFileSync(path.join(sourceRoot,entry.path));
  if(entry.sourceText!==undefined)return Buffer.from(entry.sourceText);
  let last;
  for(let attempt=0;attempt<3;attempt++){
    try{
      const response=await fetch(manifest.source+'/'+entry.path+'?pages-export='+manifest.commit,{signal:AbortSignal.timeout(90000)});
      if(!response.ok)throw Error('HTTP '+response.status+' '+entry.path);
      const data=Buffer.from(await response.arrayBuffer());
      if(digest(data)!==entry.sha256)throw Error('Source changed or wrong content: '+entry.path);
      return data;
    }catch(error){last=error;}
  }
  throw last;
}
(async()=>{
  const queue=[...manifest.files];let count=0;
  await Promise.all(Array.from({length:6},async()=>{
    while(queue.length){
      const entry=queue.shift();
      if(entry.path.startsWith('/')||entry.path.split('/').includes('..'))throw Error('Unsafe path');
      const data=await get(entry);
      if(digest(data)!==entry.sha256)throw Error('Hash mismatch: '+entry.path);
      const target=path.join(out,entry.path);fs.mkdirSync(path.dirname(target),{recursive:true});
      fs.writeFileSync(target,adapt(entry.path,data));count++;
    }
  }));
  // The advertised Pages URL opens the actual title screen, without a redirect.
  fs.copyFileSync(path.join(out,'menu.html'),path.join(out,'index.html'));
  fs.writeFileSync(path.join(out,'.nojekyll'),'');
  fs.writeFileSync(path.join(out,'pages-release.json'),JSON.stringify({sourceCommit:manifest.commit,files:count,prefix},null,2)+'\n');
  console.log('Imported and verified '+count+' files');
})().catch(error=>{console.error(error);process.exitCode=1;});
