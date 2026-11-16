import { filterNotes } from './filter.js';
const key = 'sprout-notes-read-v1';
let notes = [], selected = 'all', read = new Set();
const search = document.querySelector('#search');
const cards = [...document.querySelectorAll('.note-card')];
const status = document.querySelector('#storage-status');
function storageError() { status.hidden = false; status.textContent = '此瀏覽器無法保存進度，本次仍可標記與閱讀。'; }
try {
  const stored = JSON.parse(localStorage.getItem(key) || '[]');
  if (!Array.isArray(stored) || !stored.every(x => typeof x === 'string')) throw new Error('invalid data');
  read = new Set(stored);
} catch { storageError(); }
function paintProgress() {
  let count = 0;
  document.querySelectorAll('[data-read]').forEach(button => {
    const active = read.has(button.dataset.read);
    if (active) count++;
    button.textContent = active ? '✓ 已讀' : '○ 標記已讀';
    button.setAttribute('aria-pressed', String(active));
  });
  document.querySelector('#progress-count').textContent = `${count} / ${cards.length} 篇已讀`;
  document.querySelector('#progress').value = count;
  document.querySelector('#progress-label').textContent = count === cards.length ? '這段小徑完成了！隨時回來複習。' : '每讀完一篇，就為自己留下一個記號。';
}
document.querySelectorAll('[data-read]').forEach(button => button.addEventListener('click', () => {
  const slug = button.dataset.read;
  read.has(slug) ? read.delete(slug) : read.add(slug);
  try { localStorage.setItem(key,JSON.stringify([...read])); } catch { storageError(); }
  paintProgress();
}));
paintProgress();
function update() {
  const matches = new Set(filterNotes(notes, search.value, selected).map(n=>n.slug));
  cards.forEach(card => { card.hidden = !matches.has(card.dataset.slug); });
  document.querySelector('#result-count').textContent = `共 ${matches.size} 篇筆記 · 依學習順序排列`;
  document.querySelector('#empty').hidden = matches.size > 0;
  document.querySelectorAll('[data-category]').forEach(b => {
    const active = b.dataset.category === selected;
    b.classList.toggle('active',active); b.setAttribute('aria-pressed',String(active));
  });
}
// Search metadata comes from generated cards as a fallback for file:// previews.
notes = cards.map(c => ({slug:c.dataset.slug,title:c.querySelector('h3').textContent,summary:c.querySelector('.card-link p').textContent,category:c.querySelector('.badge').textContent,tags:[...c.querySelectorAll('.tags span')].map(t=>t.textContent)}));
search.addEventListener('input', update);
document.querySelectorAll('[data-category]').forEach(button => button.addEventListener('click',()=>{selected=button.dataset.category; update();}));
document.querySelector('#clear').addEventListener('click',()=>{search.value='';selected='all';update();search.focus();});
