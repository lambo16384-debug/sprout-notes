import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { root } from './build.mjs';
const base=path.join(root,'dist');
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml'};
http.createServer(async(req,res)=>{
  try {
    const requested=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    let f=path.resolve(base,'.'+requested);
    if(f!==base&&!f.startsWith(base+path.sep)){res.writeHead(403).end();return;}
    if((await stat(f)).isDirectory())f=path.join(f,'index.html');
    res.writeHead(200,{'Content-Type':types[path.extname(f)]||'application/octet-stream'});res.end(await readFile(f));
  }catch{res.writeHead(404,{'Content-Type':'text/plain; charset=utf-8'}).end('找不到這個頁面');}
}).listen(4173,'127.0.0.1',()=>console.log('Local: http://127.0.0.1:4173'));
