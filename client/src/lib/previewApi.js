const disabled = 'This is a visual preview. Bookings, account access and form submissions are disabled.';
async function read(file) {
  const response = await fetch(`/preview-api/${file}`);
  if (!response.ok || !response.headers.get('content-type')?.includes('json')) throw new Error('Preview event data is unavailable.');
  return response.json();
}
export async function previewRequest(method, url, body) {
  if (method !== 'GET') throw new Error(disabled);
  const [route, query = ''] = url.split('?');
  if (route === '/catalog') return read('catalog.json');
  if (/^\/events\/[a-z0-9-]+$/.test(route)) return read(`${route.slice(1)}.json`);
  if (route === '/events') {
    const params = new URLSearchParams(query);
    let events = await read('events.json');
    const q = params.get('q')?.toLowerCase();
    if (q) events = events.filter(event => [event.title,event.subtitle,event.city,event.label,event.venue,event.speakerInfo?.name,...event.interests].join(' ').toLowerCase().includes(q));
    for (const key of ['category','city','format']) { const value = params.get(key); if (value && value !== 'all') events = events.filter(event => event[key] === value); }
    for (const [key, field] of [['interest','interests'],['audience','audience']]) { const value = params.get(key); if (value && value !== 'all') events = events.filter(event => event[field]?.includes(value)); }
    const filters = [params.get('price'),params.get('date'),...(params.get('quick') || '').split(',')];
    for (const filter of filters) {
      if (filter === 'free') events = events.filter(event => event.price === 0);
      if (filter === 'paid') events = events.filter(event => event.price > 0);
      if (filter === 'premium') events = events.filter(event => event.price >= 1500);
      if (filter === 'online') events = events.filter(event => event.format !== 'In-person');
      if (['week','month','quarter'].includes(filter)) events = events.filter(event => new Date(event.date) - Date.now() <= ({week:7,month:31,quarter:92}[filter]) * 864e5);
    }
    if (params.get('featured')) events = events.filter(event => event.featured);
    const sort = params.get('sort');
    if (sort === 'popular') events.sort((a,b) => b.popular-a.popular);
    else if (sort === 'price') events.sort((a,b) => a.price-b.price);
    else if (sort === 'soonest') events.sort((a,b) => new Date(a.date)-new Date(b.date));
    const limit = Number(params.get('limit')); return limit > 0 ? events.slice(0,limit) : events;
  }
  if (route === '/meetings/availability') return [];
  throw new Error(disabled);
}
