import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { root, loadNotes } from './build.mjs';
const notes = await loadNotes();
async function walk(dir) {
  const files=[];
  for(const e of await readdir(dir,{withFileTypes:true})) {
    const f=path.join(dir,e.name); files.push(...(e.isDirectory()?await walk(f):[f]));
  }
  return files;
}
const files = await walk(path.join(root,'dist'));
const htmlFiles = files.filter(f=>f.endsWith('.html'));
if(htmlFiles.length!==notes.length+1) throw new Error('產生的頁數與內容數量不一致');
for (const f of htmlFiles) {
  const html=await readFile(f,'utf8');
  if ((html.match(/<h1[ >]/g)||[]).length!==1 || !html.includes('lang="zh-Hant"')) throw new Error(`標題或語言設定錯誤：${f}`);
  for(const [,target] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    if (/^(https?:|data:|mailto:)/.test(target)) continue;
    const [relative,anchor]=target.split('#');
    const dest=relative?path.resolve(path.dirname(f),relative):f;
    if (!(await stat(dest).catch(()=>null))?.isFile()) throw new Error(`失效連結：${f} → ${target}`);
    if(anchor && dest.endsWith('.html') && !(await readFile(dest,'utf8')).includes(`id="${anchor}"`)) throw new Error(`失效錨點：${target}`);
  }
}
console.log(`檢查通過：${notes.length} 篇內容、${htmlFiles.length} 個 HTML 頁面與全部站內連結。`);
