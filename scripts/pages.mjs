import { cp, readdir, unlink } from 'node:fs/promises';
import path from 'node:path';
import { root } from './build.mjs';
// Only remove obsolete generated .html notes; preserve human-authored docs.
const target=path.join(root,'docs/notes');
const current=new Set(await readdir(path.join(root,'dist/notes')));
for(const f of await readdir(target).catch(()=>[])) if(f.endsWith('.html')&&!current.has(f)) await unlink(path.join(target,f));
await cp(path.join(root,'dist'),path.join(root,'docs'),{recursive:true});
console.log('GitHub Pages 發布檔已同步至 docs/');
