import { readFile, writeFile, readdir, mkdir, cp } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
export const root = fileURLToPath(new URL('../', import.meta.url));
export const categories = ['HTML', 'CSS', 'JavaScript', 'Workflow'];
export const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const nonempty = v => typeof v === 'string' && v.trim().length > 0;
export async function loadNotes() {
  const names = (await readdir(path.join(root, 'content/notes'))).filter(n => n.endsWith('.json'));
  const slugs = new Set(), orders = new Set();
  const notes = [];
  for (const name of names) {
    const n = JSON.parse(await readFile(path.join(root, 'content/notes', name), 'utf8'));
    const ok = /^[a-z]+(?:-[a-z0-9]+)*$/.test(n.slug) && name === `${n.slug}.json` && !slugs.has(n.slug)
      && Number.isInteger(n.order) && n.order > 0 && !orders.has(n.order)
      && nonempty(n.title) && n.title.length >= 6 && n.title.length <= 40
      && nonempty(n.summary) && n.summary.length >= 20 && n.summary.length <= 100
      && categories.includes(n.category) && Number.isInteger(n.minutes) && n.minutes >= 1 && n.minutes <= 60
      && /^\d{4}-\d{2}-\d{2}$/.test(n.updated) && !Number.isNaN(Date.parse(n.updated)) && new Date(n.updated).toISOString().slice(0,10) === n.updated
      && nonempty(n.goal) && Array.isArray(n.tags) && n.tags.length >= 1 && n.tags.length <= 4 && n.tags.every(nonempty) && new Set(n.tags).size === n.tags.length
      && Array.isArray(n.concepts) && n.concepts.length >= 2 && n.concepts.every(c => nonempty(c.heading) && nonempty(c.body))
      && ['language', 'code', 'explanation'].every(k => nonempty(n.example?.[k]))
      && ['prompt', 'solution'].every(k => nonempty(n.exercise?.[k]))
      && Array.isArray(n.references) && n.references.length > 0 && n.references.every(r => nonempty(r.label) && nonempty(r.url) && /^https:\/\//.test(r.url));
    if (!ok) throw new Error(`內容格式錯誤：${name}，請對照 AGENTS.md 與 templates/note.json`);
    slugs.add(n.slug); orders.add(n.order); notes.push(n);
  }
  if (!notes.length) throw new Error('至少需要一篇筆記');
  return notes.sort((a,b) => a.order - b.order);
}
const header = base => `<a class="skip" href="#main">跳到主要內容</a><header class="site-header wrap"><a class="brand" href="${base}index.html"><span class="brand-mark" aria-hidden="true">↗</span> Sprout<span class="brand-light">Notes</span><span class="brand-sub">一點一滴，長成自己的知識</span></a><nav aria-label="主要導覽"><a href="${base}index.html#notes">所有筆記</a><a href="${base}index.html#method">關於筆記站 <span aria-hidden="true">↗</span></a></nav></header>`;
const footer = base => `<footer class="wrap site-footer"><a class="brand" href="${base}index.html"><span class="brand-mark small" aria-hidden="true">↗</span> Sprout Notes</a><p>慢慢學，讓每個觀念都生根。</p><span>以 AGENTS.md 持續生長 · 2026</span></footer>`;
const shell = (title, desc, base, body, script='') => `<!doctype html>\n<html lang="zh-Hant"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="${esc(desc)}"><meta name="theme-color" content="#f7f8f2"><title>${esc(title)}｜Sprout Notes</title><link rel="icon" href="${base}favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="${base}assets/styles.css">${script ? `<script type="module" src="${base}assets/app.js"></script>` : ''}</head><body>${header(base)}${body}${footer(base)}</body></html>`;
const badge = category => `<span class="badge ${category.toLowerCase()}">${esc(category)}</span>`;
function card(n, i) {
  return `<article class="note-card" data-slug="${n.slug}"><div class="card-top">${badge(n.category)}<span class="card-index">${String(i+1).padStart(2,'0')}</span></div><a class="card-link" href="notes/${n.slug}.html"><h3>${esc(n.title)}</h3><p>${esc(n.summary)}</p></a><div class="tags">${n.tags.map(t=>`<span>#${esc(t)}</span>`).join('')}</div><div class="card-bottom"><span>${n.minutes} 分鐘閱讀</span><button class="read-toggle" data-read="${n.slug}" aria-pressed="false"><span aria-hidden="true">○</span> 標記已讀</button><a class="arrow" href="notes/${n.slug}.html" aria-label="閱讀：${esc(n.title)}">↗</a></div></article>`;
}
function home(notes) {
  return shell('把學到的，慢慢種下來', '從 HTML 到 JavaScript，用短篇筆記、程式範例與小練習累積前端基礎。', '', `<main id="main"><section class="hero wrap"><div class="hero-copy"><p class="eyebrow"><span class="tiny-dot"></span> MY FRONTEND FIELD NOTES</p><h1>把學到的，<br>慢慢<span class="highlight">種下來。</span></h1><p class="hero-intro">寫下一個觀念，動手做一個小練習。<br>把零散的前端知識，整理成能持續生長的筆記。</p><a class="primary" href="#notes">開始探索筆記 <span aria-hidden="true">↗</span></a><div class="hero-meta"><span><b>${notes.length}</b> 篇學習筆記</span><span><b>${categories.length}</b> 個主題分類</span><span>每次一小步</span></div></div><div class="hero-art" aria-hidden="true"><div class="orbit orbit-one"></div><div class="orbit orbit-two"></div><span class="art-caption">a little progress, every day.</span><div class="code-paper"><div class="paper-header"><i></i><i></i><i></i><span>hello-growth.html</span></div><div class="paper-code"><span class="muted">&lt;!-- 每一行，都是累積 --&gt;</span><br>&lt;<span class="green">main</span>&gt;<br>&nbsp; &lt;<span class="green">h1</span>&gt;保持好奇&lt;/<span class="green">h1</span>&gt;<br>&nbsp; &lt;<span class="green">p</span>&gt;今天也學一點。&lt;/<span class="green">p</span>&gt;<br>&lt;/<span class="green">main</span>&gt;</div></div><div class="sprout"><div class="stem"></div><div class="leaf leaf-left"></div><div class="leaf leaf-right"></div><div class="soil"></div></div><div class="floating-label">✦ learning in progress</div><span class="art-plus plus-one">+</span><span class="art-plus plus-two">+</span></div></section><section class="progress-section wrap" aria-label="學習進度"><div class="progress-icon" aria-hidden="true">↗</div><div><h2>你的學習小徑</h2><p id="progress-label">每讀完一篇，就為自己留下一個記號。</p></div><div class="progress-right"><span id="progress-count">0 / ${notes.length} 篇已讀</span><progress id="progress" value="0" max="${notes.length}" aria-label="已讀筆記進度"></progress></div><p id="storage-status" class="storage-status" hidden></p></section><section class="notes-section wrap" id="notes"><div class="section-heading"><div><p class="eyebrow">THE NOTEBOOK</p><h2>今天，想學點什麼？</h2></div><p>不用一次學完，挑一篇開始就好。</p></div><div class="toolbar"><div class="filters" role="group" aria-label="筆記分類"><button class="filter active" data-category="all" aria-pressed="true">全部 <span>${notes.length}</span></button>${categories.map(c=>`<button class="filter" data-category="${c}" aria-pressed="false">${c} <span>${notes.filter(n=>n.category===c).length}</span></button>`).join('')}</div><div class="search-box"><span aria-hidden="true">⌕</span><label class="sr-only" for="search">搜尋筆記</label><input id="search" type="search" placeholder="搜尋標題、關鍵字…" autocomplete="off"></div></div><p id="result-count" class="result-count" aria-live="polite">共 ${notes.length} 篇筆記 · 依學習順序排列</p><div class="notes-grid">${notes.map(card).join('')}</div><div id="empty" class="empty" hidden><span aria-hidden="true">⌕</span><h3>這裡還沒有這個主題的筆記</h3><p>換個關鍵字，或清除條件看看。</p><button id="clear" class="primary">清除搜尋與分類</button></div><noscript><p>搜尋、篩選與已讀進度需要 JavaScript；所有筆記仍可直接開啟閱讀。</p></noscript></section><section id="method" class="method-section wrap"><div><p class="eyebrow">SMALL NOTES, STEADY GROWTH</p><h2>筆記有方法，<br>學習有自己的節奏。</h2><p>每篇沿用相同結構，讓下一次學習<br>不必重新找方向。</p></div><ol class="method-steps"><li><span>01</span><div><h3>理解一個概念</h3><p>用自己的話，說清楚它解決什麼問題。</p></div></li><li><span>02</span><div><h3>讀懂一段程式</h3><p>從最小範例，看見觀念如何落在畫面上。</p></div></li><li><span>03</span><div><h3>動手試一次</h3><p>完成小練習，再打開解答確認理解。</p></div></li></ol><span class="method-doodle" aria-hidden="true">↗</span></section></main>`, true);
}
function article(n, notes, i) {
  return shell(n.title, n.summary, '../', `<main id="main" class="article-layout wrap"><aside class="article-aside"><a class="back-link" href="../index.html#notes">← 回到所有筆記</a><p class="eyebrow">IN THIS NOTE</p><nav aria-label="文章目錄"><a href="#goal">學習目標</a><a href="#concepts">核心概念</a><a href="#example">程式範例</a><a href="#exercise">動手練習</a><a href="#references">延伸閱讀</a></nav><p class="aside-note">不用急著記住全部。<br>理解一點，就前進一點。</p></aside><article class="article-body"><div class="article-topline">${badge(n.category)}<span>${n.minutes} 分鐘閱讀 · 更新於 ${n.updated}</span></div><h1>${esc(n.title)}</h1><p class="article-lead">${esc(n.summary)}</p><div class="tags">${n.tags.map(t=>`<span>#${esc(t)}</span>`).join('')}</div><section id="goal" class="goal-box"><span class="eyebrow">TODAY’S LITTLE GOAL</span><h2>讀完這篇，你可以…</h2><p>${esc(n.goal)}</p></section><section id="concepts"><p class="eyebrow">01 / UNDERSTAND</p><h2>先把觀念弄清楚</h2>${n.concepts.map(c=>`<h3>${esc(c.heading)}</h3><p>${esc(c.body)}</p>`).join('')}</section><section id="example"><p class="eyebrow">02 / EXPLORE</p><h2>看一個小範例</h2><div class="code-block"><div class="code-title"><span>${esc(n.example.language)}</span><span>EXAMPLE</span></div><pre tabindex="0" aria-label="${esc(n.example.language)} 程式範例"><code>${esc(n.example.code)}</code></pre></div><p>${esc(n.example.explanation)}</p></section><section id="exercise" class="exercise"><p class="eyebrow">03 / TRY IT YOURSELF</p><h2>換你動手試試</h2><p>${esc(n.exercise.prompt)}</p><details><summary>我想好了，看看參考解答</summary><p>${esc(n.exercise.solution)}</p></details></section><section id="references"><h2>繼續往下挖</h2><p>本文為入門整理；完整定義與更多範例，請參考官方文件。</p><ul>${n.references.map(r=>`<li><a href="${esc(r.url)}" target="_blank" rel="noopener noreferrer">${esc(r.label)} ↗</a></li>`).join('')}</ul></section><nav class="article-pagination" aria-label="文章導覽">${i>0 ? `<a href="${notes[i-1].slug}.html"><span>← 上一篇</span>${esc(notes[i-1].title)}</a>` : '<a href="../index.html#notes"><span>← 回到總覽</span>看看其他學習筆記</a>'}${i<notes.length-1 ? `<a href="${notes[i+1].slug}.html"><span>下一篇 →</span>${esc(notes[i+1].title)}</a>` : '<a href="../index.html#notes"><span>完成這段小徑 →</span>回到總覽，標記學習進度</a>'}</nav></article></main>`);
}
export async function build() {
  const notes = await loadNotes();
  await mkdir(path.join(root,'dist/notes'),{recursive:true});
  await mkdir(path.join(root,'dist/assets'),{recursive:true});
  // Remove obsolete generated articles so deleted notes cannot remain published.
  const { unlink } = await import('node:fs/promises');
  for (const f of await readdir(path.join(root,'dist/notes'))) {
    if (f.endsWith('.html') && !notes.some(n=>`${n.slug}.html`===f)) await unlink(path.join(root,'dist/notes',f));
  }
  await writeFile(path.join(root,'dist/index.html'),home(notes));
  for (const [i,n] of notes.entries()) await writeFile(path.join(root,`dist/notes/${n.slug}.html`),article(n,notes,i));
  await cp(path.join(root,'src'),path.join(root,'dist/assets'),{recursive:true});
  await writeFile(path.join(root,'dist/assets/notes.json'),JSON.stringify(notes.map(({slug,title,summary,category,tags})=>({slug,title,summary,category,tags}))));
  await writeFile(path.join(root,'dist/.nojekyll'),'');
  await writeFile(path.join(root,'dist/favicon.svg'),'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="18" fill="#204936"/><path d="M19 45L45 19M22 19h23v23" fill="none" stroke="#d8eea5" stroke-width="5"/></svg>');
  console.log(`建置完成：${notes.length} 篇筆記、首頁與共用資源 → dist/`);
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await build();
