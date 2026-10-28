import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useCatalog } from '../App.jsx';
import { useApi } from '../lib/api.js';
import Icon from '../components/Icon.jsx';
import { Eyebrow, CardSkeleton } from '../components/ui.jsx';
import EventCard from '../components/EventCard.jsx';
import BannerArt from '../components/BannerArt.jsx';

const QUICK = [['week', 'This Week'], ['month', 'This Month'], ['free', 'Free'], ['premium', 'Premium'], ['online', 'Online'], ['invite', 'Invitation Only']];
const SORTS = [['recommended', 'Recommended'], ['soonest', 'Soonest'], ['popular', 'Most Popular']];

export default function Explore() {
  const cat = useCatalog();
  const [params, setParams] = useSearchParams();
  const [q, setQ] = useState(params.get('q') || '');
  const [sheet, setSheet] = useState(false);

  // debounce search text into the URL
  useEffect(() => {
    const t = setTimeout(() => update('q', q), 250);
    return () => clearTimeout(t);
  }, [q]); // eslint-disable-line react-hooks/exhaustive-deps

  const update = (key, val) => {
    const next = new URLSearchParams(params);
    if (!val || val === 'all') next.delete(key); else next.set(key, val);
    if (next.toString() !== params.toString()) setParams(next, { replace: true });
  };
  const quick = (params.get('quick') || '').split(',').filter(Boolean);
  const toggleQuick = (k) => update('quick', (quick.includes(k) ? quick.filter((x) => x !== k) : [...quick, k]).join(','));
  const sort = params.get('sort') || 'recommended';

  const { data: events, loading, error, reload } = useApi(`/events?${params.toString()}`);

  const filters = [
    ['category', 'Category', [['all', 'All categories'], ...(cat?.categories || []).map((c) => [c.key, c.name])]],
    ['city', 'City', [['all', 'All cities'], ...(cat?.cities || []).map((c) => [c.name, c.name]), ['Online', 'Online']]],
    ['date', 'Date', [['all', 'Any time'], ['week', 'Next 7 days'], ['month', 'Next 30 days'], ['quarter', 'Next 3 months']]],
    ['format', 'Format', [['all', 'All formats'], ['In-person', 'In-person'], ['Online', 'Online'], ['Hybrid', 'Hybrid']]],
    ['price', 'Price', [['all', 'Any price'], ['free', 'Free'], ['paid', 'Paid'], ['premium', '₹1,500 +']]],
    ['audience', 'Audience', [['all', 'Everyone'], ['Beginners', 'Beginners'], ['Investors', 'Investors'], ['Professionals', 'Professionals'], ['Clients', 'Clients'], ['HNI', 'HNI']]]
  ];
  const activeCount = filters.filter(([k]) => params.get(k)).length + quick.length + (params.get('q') ? 1 : 0);

  return (
    <>
      <section className="page-head animated-banner">
        <div className="container">
          <div className="crumbs" data-enter style={{ '--d': 0.1 }}><Link to="/">Home</Link><span>/</span><span>Explore</span></div>
          <h1 className="display" data-enter style={{ '--d': 0.25 }}>Discover<br /><strong>what’s <em>next.</em></strong></h1>
          <p className="lead" data-enter style={{ '--d': 0.4 }}>Markets, masterclasses, private gatherings and live webinars — curated by Aionion Capital.</p>
          <BannerArt variant="explore" />
        </div>
      </section>

      <section className="container" style={{ paddingBottom: 120 }}>
        <div data-enter style={{ '--d': 0.55 }}>
          <label className="search-field glass">
            <Icon name="search" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search events, experts, cities or topics" aria-label="Search events" />
            {q ? <button className="icon-btn" onClick={() => setQ('')} aria-label="Clear"><Icon name="close" /></button> : <kbd>/</kbd>}
          </label>

          <div className={`filters glass ${sheet ? 'sheet-open' : ''}`}>
            <div className="sheet-title" style={{ display: 'none' }}>
              <b style={{ fontFamily: 'var(--f-display)', fontWeight: 400, fontSize: 20 }}>Filters</b>
              <button className="icon-btn" onClick={() => setSheet(false)} aria-label="Close filters"><Icon name="close" /></button>
            </div>
            {filters.map(([key, label, opts]) => (
              <div key={key} className={`fctl ${params.get(key) ? 'on' : ''}`}>
                <label htmlFor={`f-${key}`}>{label}</label>
                <select id={`f-${key}`} value={params.get(key) || 'all'} onChange={(e) => update(key, e.target.value)}>
                  {opts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              </div>
            ))}
            <div className="sheet-bar">
              <button className="btn btn-ghost grow" onClick={() => setParams({}, { replace: true })}>Reset</button>
              <button className="btn btn-primary grow" onClick={() => setSheet(false)}>Show {events?.length ?? ''} events</button>
            </div>
          </div>

          <div className="quickbar">
            <div className="chips">
              <button className="chip filter-open" onClick={() => setSheet(true)}><Icon name="filter" />Filters{activeCount ? ` · ${activeCount}` : ''}</button>
              {QUICK.map(([k, l]) => <button key={k} className={`chip ${quick.includes(k) ? 'is-active' : ''}`} onClick={() => toggleQuick(k)} aria-pressed={quick.includes(k)}>{l}</button>)}
            </div>
            <div className="row">
              <span className="label hide-m">Sort by</span>
              <div className="sort" role="group" aria-label="Sort">
                {SORTS.map(([k, l]) => <button key={k} className={sort === k ? 'is-active' : ''} onClick={() => update('sort', k === 'recommended' ? '' : k)}>{l}</button>)}
              </div>
            </div>
          </div>
        </div>

        <div className="results-meta">
          <span>{loading ? 'Curating…' : <><b style={{ color: 'var(--white)', fontWeight: 500 }}>{events?.length || 0}</b> experiences</>}</span>
          {activeCount > 0 && <button className="link-u" onClick={() => { setQ(''); setParams({}, { replace: true }); }}>Clear all</button>}
        </div>

        {error ? <div className="demo-note" role="alert"><p>{error.message}</p><button className="btn btn-ghost" onClick={reload}>Try again</button></div> : loading ? <div className="event-grid">{[0,1,2].map((i) => <CardSkeleton key={i} />)}</div> : events && events.length === 0 ? (
          <div className="empty">
            <h3 className="h3">Nothing on the calendar — yet.</h3>
            <p>Try widening your dates or removing a filter. New sessions are added every week.</p>
          </div>
        ) : (
          <div className="event-grid">{(events || []).map((e, i) => <EventCard key={e.id} e={e} delay={(i % 3) * 0.08} />)}</div>
        )}

        <div className="glass" style={{ marginTop: 80, padding: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
          <div>
            <Eyebrow>Prefer a private conversation?</Eyebrow>
            <h3 className="h3" style={{ marginTop: 14 }}>Book time with a relationship manager.</h3>
          </div>
          <Link to="/meetings" className="btn btn-light magnetic">Book a Meeting <Icon name="arrow" className="icon arrow" /></Link>
        </div>
      </section>
    </>
  );
}
