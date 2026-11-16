export function filterNotes(notes, query = '', category = 'all') {
  const q = query.trim().toLocaleLowerCase();
  return notes.filter(n => (category === 'all' || n.category === category) &&
    [n.title,n.summary,n.category,...n.tags].join(' ').toLocaleLowerCase().includes(q));
}
