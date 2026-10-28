import { useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCatalog } from '../App.jsx';
import { useApi } from '../lib/api.js';
import { useAuth } from '../lib/auth.jsx';
import { useCountUp } from '../lib/motion.js';
import { shortDate } from '../lib/format.js';
import Icon, { CATEGORY_ICON, INTEREST_ICON } from '../components/Icon.jsx';
import { Ph, Eyebrow, Arrow, CardSkeleton, Empty } from '../components/ui.jsx';
import EventCard from '../components/EventCard.jsx';
import Hero from '../components/Hero.jsx';
import ExperienceStage from '../components/ExperienceStage.jsx';
import ParallaxController from '../components/ParallaxController.jsx';

export default function Home() {
  const cat = useCatalog();
  const { user } = useAuth();
  const { data: events, loading, error, reload } = useApi('/events');
  const showcase = useMemo(() => {
    if (!events) return { next: null, featured: null, upcoming: null, recommended: null };
    const next = events.find((event) => event.id === 'money-pechu-chennai') || events[0];
    const remaining = events.filter((event) => event.id !== next?.id);
    const featured = [...remaining].sort((a, b) => Number(!!b.featured) - Number(!!a.featured) || (b.popular || 0) - (a.popular || 0)).slice(0, 3);
    const used = new Set([next?.id, ...featured.map((event) => event.id)]);
    const score = (event) => (event.city === user?.city ? 3 : 0) + (event.interests || []).filter((interest) => user?.interests?.includes(interest)).length * 2;
    const recommended = remaining.filter((event) => !used.has(event.id)).sort((a, b) => score(b) - score(a) || (b.popular || 0) - (a.popular || 0)).slice(0, 3);
    recommended.forEach((event) => used.add(event.id));
    return { next, featured, recommended, upcoming: remaining.filter((event) => !used.has(event.id)) };
  }, [events, user]);
  return (
    <>
      <ParallaxController />
      <Hero cat={cat} next={showcase.next} />
      <ExperienceStage />
      {error && <div className="container"><div className="demo-note" role="alert"><p>We couldn’t load events. {error.message}</p><button className="btn btn-ghost" onClick={reload}>Try again</button></div></div>}
      <Featured events={showcase.featured} loading={loading} />
      <Upcoming events={showcase.upcoming} allEvents={events} loading={loading} />
      <Recommended events={showcase.recommended} loading={loading} />
      <Interests cat={cat} />
      <Experts cat={cat} />
      <WhoShouldAttend />
      <PrivateBand cat={cat} />
      <Confidence />
      <Cities cat={cat} />
      <OrganizerBand cat={cat} />
    </>
  );
}

/* ---------- CATEGORY CHIPS ---------- */
function CategoryChips({ cat }) {
  const [paused, setPaused] = useState(false);
  const categories = cat?.categories || Array.from({ length: 10 }, (_, i) => ({ key: i }));
  const items = (duplicate = false) => categories.map((c) => c.name ? (
    <Link key={c.key} tabIndex={duplicate ? -1 : undefined} to={c.key === 'hni' ? '/private' : `/explore?category=${c.key}`} className="cat-chip">
      <span className="cc-ic"><Icon name={CATEGORY_ICON[c.key] || 'sparkle'} /></span>
      <span><b>{c.name}</b><small>{c.key === 'hni' ? 'Invite only' : `${c.count} upcoming`}</small></span>
    </Link>
  ) : <span key={c.key} className="cat-chip skel-chip" />);
  return (
    <section className="cat-strip" aria-label="Browse by category">
      <div className={`container category-marquee ${paused ? 'is-paused' : ''}`}>
        <div className="category-marquee-window" role="region" aria-label="Event categories">
          <div className="category-marquee-track" style={{ '--marquee-duration': `${categories.length * 8}s` }}>
            <div className="category-marquee-group">{items()}</div>
            <div className="category-marquee-group category-marquee-copy" aria-hidden="true">{items(true)}</div>
          </div>
        </div>
        <button className="category-motion-btn" aria-label={paused ? 'Play category scrolling' : 'Pause category scrolling'} aria-pressed={paused} onClick={() => setPaused((value) => !value)}><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">{paused ? <path d="m8 5 11 7-11 7z" /> : <path d="M6 5h4v14H6zm8 0h4v14h-4z" />}</svg></button>
      </div>
    </section>
  );
}

/* ---------- FEATURED ---------- */
function Featured({ events, loading }) {
  const list = (events || []).slice(0, 3);
  return (
    <section className="section tight" id="featured-experiences">
      <div className="container">
        <div className="section-head">
          <div className="reveal"><Eyebrow>Hand-picked</Eyebrow><h2 className="h2">Featured<br /><strong>experiences.</strong></h2></div>
          <Link to="/explore" className="link-u reveal">See all events <Icon name="arrow" /></Link>
        </div>
        <div className="featured-grid">
          {loading && !events ? [0, 1, 2].map((i) => <CardSkeleton key={i} />) : list.map((e, i) => <EventCard key={e.id} e={e} size="lg" delay={i * 0.08} />)}
        </div>
      </div>
    </section>
  );
}

/* ---------- UPCOMING / TRENDING ---------- */
const TABS = [['all', 'All'], ['week', 'This Week'], ['month', 'This Month'], ['investor-meets', 'Investor Events'], ['workshops', 'Workshops'], ['networking', 'Networking'], ['near', 'Near You']];
function Upcoming({ events, allEvents, loading }) {
  const { user } = useAuth();
  const cat = useCatalog();
  const [tab, setTab] = useState('all');
  const [city, setCity] = useState(user?.city || 'Chennai');
  const rail = useRef(null);
  const list = useMemo(() => {
    const now = Date.now();
    const all = [...((tab === 'all' ? events : allEvents) || [])].sort((a, b) => new Date(a.date) - new Date(b.date));
    if (tab === 'week') return all.filter((e) => new Date(e.date) >= now && new Date(e.date) - now <= 7 * 864e5);
    if (tab === 'month') return all.filter((e) => new Date(e.date) >= now && new Date(e.date) - now <= 31 * 864e5);
    if (tab === 'near') return all.filter((e) => e.city === city || e.format !== 'In-person');
    if (['investor-meets', 'workshops', 'networking'].includes(tab)) return all.filter((e) => e.category === tab);
    return all;
  }, [events, allEvents, tab, city]);
  const scroll = (dir) => rail.current?.scrollBy({ left: dir * rail.current.clientWidth * 0.8, behavior: 'smooth' });

  return (
    <section className="section tight">
      <div className="container">
        <div className="section-head">
          <div className="reveal"><Eyebrow>Upcoming & trending</Eyebrow><h2 className="h2">What’s<br /><strong>happening next.</strong></h2></div>
          <div className="rail-ctrl reveal">
            <button onClick={() => scroll(-1)} aria-label="Scroll left"><Icon name="arrowL" /></button>
            <button onClick={() => scroll(1)} aria-label="Scroll right"><Icon name="arrow" /></button>
          </div>
        </div>
        <div className="tabbar reveal">
          <div className="tabs" role="tablist" aria-label="Filter upcoming events">
            {TABS.map(([k, l]) => <button key={k} role="tab" aria-selected={tab === k} className={tab === k ? 'is-active' : ''} onClick={() => { setTab(k); rail.current?.scrollTo({ left: 0 }); }}>{l}</button>)}
          </div>
          {tab === 'near' && (
            <label className="city-pick"><Icon name="pin" />
              <select value={city} onChange={(e) => setCity(e.target.value)} aria-label="Your city">
                {(cat?.cities || []).map((c) => <option key={c.name}>{c.name}</option>)}
              </select>
            </label>
          )}
        </div>
        {loading && !events ? (
          <div className="rail">{[0, 1, 2, 3].map((i) => <CardSkeleton key={i} />)}</div>
        ) : list.length ? (
          <div className="rail" ref={rail} key={tab + city}>{list.map((e, i) => <EventCard key={e.id} e={e} delay={Math.min(i, 3) * 0.06} />)}</div>
        ) : (
          <Empty title="Nothing in this window — yet." action={<button className="btn btn-ghost" onClick={() => setTab('all')}>Show all upcoming</button>}>New sessions are added every week. Try another tab or city.</Empty>
        )}
      </div>
    </section>
  );
}

function Recommended({ events, loading }) {
  const { user } = useAuth();
  const interests = user?.interests || [];
  const list = [...(events || [])].sort((a, b) => {
    const score = (e) => (e.city === user?.city ? 3 : 0) + (e.interests || []).filter((interest) => interests.includes(interest)).length * 2;
    return score(b) - score(a) || b.popular - a.popular;
  }).slice(0, 3);
  return <section className="section tight"><div className="container"><div className="section-head"><div><Eyebrow>{user ? 'Chosen around your interests' : 'A considered selection'}</Eyebrow><h2 className="h2">Recommended<br /><strong>for you.</strong></h2></div><Link className="link-u" to="/explore?sort=popular">Discover more <Arrow /></Link></div><div className="featured-grid">{loading && !events ? [0,1,2].map((i) => <CardSkeleton key={i} />) : list.map((e) => <EventCard key={e.id} e={e} />)}</div>{!loading && !list.length && <p className="muted">New experiences are on their way. Explore all events to find your next session.</p>}</div></section>;
}

/* ---------- INTERESTS ---------- */
function Interests({ cat }) {
  return (
    <section className="section tight pearl-sec">
      <div className="container">
        <div className="section-head">
          <div className="reveal"><Eyebrow>Curated by interest</Eyebrow><h2 className="h2">Follow what<br /><strong>moves your money.</strong></h2></div>
          <p className="lead reveal" style={{ '--d': 0.1 }}>From stocks and global markets to tax and retirement — every event is tagged by what you’ll actually learn.</p>
        </div>
        <div className="interest-grid">
          {(cat?.interests || []).map((it, i) => (
            <Link key={it.name} to={`/explore?interest=${encodeURIComponent(it.name)}`} className="interest reveal" style={{ '--d': i * 0.05 }}>
              <span className="in-ic"><Icon name={INTEREST_ICON[it.name] || 'sparkle'} /></span>
              <b>{it.name}</b>
              <small>{it.count} event{it.count === 1 ? '' : 's'}</small>
              <Icon name="arrowUR" className="icon in-go" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- EXPERTS ---------- */
export function SpeakerCard({ s, delay = 0 }) {
  const next = s.sessions?.[0];
  return (
    <article className="scard reveal" style={{ '--d': delay }}>
      <Ph src={s.img} role="img" aria-label={`${s.name}, illustrative professional portrait`} />
      <div className="s-top"><span className="tag">{s.expertise}</span></div>
      <div className="s-info">
        <span className="label" style={{ color: 'var(--blue-3)' }}>{s.company}</span>
        <h3>{s.name}</h3>
        <p className="role">{s.role}</p>
        {next?.id && (
          <Link to={`/events/${next.id}`} className="s-next">
            <span><small>Upcoming</small>{next.title}</span>
            <span className="mono">{shortDate(next.date)}</span>
          </Link>
        )}
        <div className="s-more"><p>{s.bio}</p></div>
      </div>
    </article>
  );
}

function Experts({ cat }) {
  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <div className="reveal"><Eyebrow>Featured experts</Eyebrow><h2 className="h2">Learn from people<br /><strong>who manage real money.</strong></h2></div>
          <Link to="/speakers" className="link-u reveal">All speakers <Icon name="arrow" /></Link>
        </div>
        <div className="speaker-grid">{(cat?.speakers || []).slice(0, 3).map((s, i) => <SpeakerCard key={s.id} s={s} delay={i * 0.08} />)}</div>
      </div>
    </section>
  );
}

/* ---------- WHO SHOULD ATTEND ---------- */
function WhoShouldAttend() {
  const items = [['Investors', 'chart', 'Sharpen your view of markets and portfolios.'], ['HNIs', 'diamond', 'Private, considered conversations on wealth.'], ['Professionals', 'briefcase', 'Make your salary and savings work harder.'], ['Entrepreneurs', 'sparkle', 'Founder liquidity, angel investing, structure.'], ['Students', 'cap', 'Start early with the right money habits.'], ['Existing clients', 'users', 'Reviews and relationship days with your team.']];
  return (
    <section className="section tight">
      <div className="container">
        <div className="section-head">
          <div className="reveal"><Eyebrow>Who should attend?</Eyebrow><h2 className="h2">Built for every<br /><strong>stage of the journey.</strong></h2></div>
        </div>
        <div className="who-cards">
          {items.map(([t, ic, d], i) => (
            <Link key={t} to={t === 'HNIs' ? '/private' : `/explore?audience=${encodeURIComponent(t)}`} className="who-card glass reveal" style={{ '--d': (i % 3) * 0.06 }}>
              <Icon name={ic} />
              <div><b>{t}</b><p>{d}</p></div>
              <Icon name="arrow" className="icon wc-go" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- PRIVATE / HNI ---------- */
export function AccessCodeForm({ compact }) {
  const nav = useNavigate();
  const [code, setCode] = useState('');
  return (
    <form className={`code-form ${compact ? 'compact' : ''}`} onSubmit={(e) => { e.preventDefault(); if (code.trim()) nav(`/invite/${encodeURIComponent(code.trim().toUpperCase())}`); }}>
      <Icon name="key" />
      <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Enter your access code" aria-label="Invitation access code" autoCapitalize="characters" spellCheck="false" />
      <button className="btn btn-gold" type="submit">Open Invitation</button>
    </form>
  );
}

function PrivateBand({ cat }) {
  const feats = [['key', 'Invite-only', 'Never listed publicly'], ['mail', 'Personal link', 'Unique invitation per guest'], ['check', 'RSVP', 'Admit 1 or Admit 2'], ['shield', 'Guest verification', 'Matched to your invite'], ['qr', 'QR access', 'Private digital pass']];
  return (
    <section className="section private-sec" id="private">
      <div className="container private-band">
        <div className="reveal">
          <Eyebrow>Aionion Private · HNI</Eyebrow>
          <h2 className="h1" style={{ margin: '22px 0' }}>Some rooms aren’t<br />on the calendar.</h2>
          <p className="lead" style={{ color: 'rgba(239,233,221,.65)' }}>Private wealth conversations, strategy dinners and investor roundtables — by personal invitation only.</p>
          <AccessCodeForm />
          <Link to="/private" className="link-u" style={{ marginTop: 22, color: 'var(--champagne)' }}>Request an invitation <Icon name="arrow" /></Link>
        </div>
        <div className="pv-visual reveal" style={{ '--d': 0.15 }}>
          <Ph src={cat?.images.lounge} className="pv-photo" />
          <ul className="pv-feats glass">
            {feats.map(([ic, t, d]) => <li key={t}><Icon name={ic} /><span><b>{t}</b><small>{d}</small></span></li>)}
          </ul>
        </div>
      </div>
    </section>
  );
}

export function PrivateTeaser({ cat, full = false }) {
  const experiences = [
    { id: 'legacy-circle', title: 'Legacy Circle', description: 'A discreet conversation on family wealth and succession.', image: cat?.images.lounge },
    { id: 'strategy-dinner', title: 'Portfolio Strategy Dinner', description: 'An evening of considered thinking with our CIO office.', image: cat?.images.dinner },
    { id: 'investor-roundtable', title: 'Investor Roundtable', description: 'A private table for founders, investors and the decade ahead.', image: cat?.images.boardroom }
  ];

  return (
    <section className={`section private-sec ${full ? 'private-teaser-full' : ''}`}>
      <div className="container">
        <div className="section-head">
          <div><Eyebrow>Aionion Private · By invitation</Eyebrow><h2 className="h2">Conversations<br /><strong>worth gathering for.</strong></h2></div>
          <Link to="/private" className="link-u">Explore private events <Icon name="arrow" /></Link>
        </div>
        <div className="private-grid">
          {experiences.map((experience) => (
            <Link key={experience.id} to={`/private?event=${experience.id}`} className="pcard">
              <Ph src={experience.image} />
              <span className="tag gold">Invitation only</span>
              <h3>{experience.title}</h3>
              <p>{experience.description}</p>
              <span className="p-cta">Request an invitation <Icon name="arrow" /></span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- CONFIDENCE ---------- */
function Stat({ n, suffix, label }) {
  const [ref, v] = useCountUp(n);
  return <div ref={ref} className="cf-stat"><b>{v}{suffix}</b><span>{label}</span></div>;
}
function Confidence() {
  const benefits = [['verified', 'Verified Events', 'Every event is reviewed before publishing.'], ['shield', 'Secure Payments', 'Protected, encrypted checkout experience.'], ['qr', 'Instant QR Tickets', 'Tickets delivered the moment you book.'], ['scan', 'Fast Check-In', 'Scan at the door and walk straight in.']];
  const steps = [['01', 'Find an event', 'Search by city, topic, speaker or date.'], ['02', 'Book & pay', 'Pick a ticket, pay by UPI, card, net banking or wallet.'], ['03', 'Scan & enter', 'Your QR ticket is your entry pass.']];
  return (
    <section className="section pearl-sec confidence">
      <div className="container">
        <div className="section-head">
          <div className="reveal"><Eyebrow>Trust</Eyebrow><h2 className="h2">Book with<br /><strong>confidence.</strong></h2></div>
          <div className="cf-stats reveal">
            <Stat n={10} suffix="K+" label="Participants" />
            <Stat n={50} suffix="+" label="Events hosted" />
            <Stat n={25} suffix="+" label="Experts" />
          </div>
        </div>
        <div className="benefits-grid">
          {benefits.map(([ic, t, d], i) => (
            <div key={t} className="benefit reveal" style={{ '--d': i * 0.06 }}>
              <span className="bf-ic"><Icon name={ic} /></span><b>{t}</b><p>{d}</p>
            </div>
          ))}
        </div>
        <ol className="steps reveal">
          {steps.map(([n, t, d]) => <li key={n}><span>{n}</span><div><b>{t}</b><p>{d}</p></div></li>)}
        </ol>
      </div>
    </section>
  );
}

/* ---------- CITIES ---------- */
function Cities({ cat }) {
  return (
    <section className="section" id="cities">
      <div className="container">
        <div className="section-head">
          <div className="reveal"><Eyebrow>Cities</Eyebrow><h2 className="h2">Meet us<br /><strong>across India.</strong></h2></div>
          <p className="lead reveal" style={{ '--d': 0.1 }}>From Chennai to Mumbai and Delhi — Aionion events travel to where our community lives.</p>
        </div>
        <div className="cities">
          {(cat?.cities || []).map((c, i) => (
            <Link key={c.name} to={`/explore?city=${c.name}`} className="city reveal" style={{ '--d': (i % 3) * 0.08 }}>
              <Ph src={c.img} />
              <Icon name="crosshair" className="icon crosshair" />
              <div><h3>{c.name}</h3><p className="coords">{c.lat}<br />{c.lng}</p></div>
              <div className="c-foot"><span className="label" style={{ color: 'var(--grey)' }}>Upcoming events</span><span className="n">{String(c.events).padStart(2, '0')}</span></div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- ORGANIZER CTA ---------- */
function OrganizerBand({ cat }) {
  return (
    <section className="section tight">
      <div className="container">
        <div className="org-band reveal">
          <Ph src={cat?.images.office2} className="ob-bg" />
          <div className="ob-copy">
            <Eyebrow>For organizers</Eyebrow>
            <h2 className="h2" style={{ margin: '18px 0 14px' }}>Host your next event<br /><strong>with Aionion.</strong></h2>
            <p className="lead">Manage registrations, ticket sales, attendees, payments and QR check-ins from one powerful platform.</p>
            <div className="hero-ctas" style={{ marginTop: 28 }}>
              <Link to="/organizer/events/new" className="btn btn-primary btn-lg magnetic">Create Event <Arrow /></Link>
              <Link to="/meetings" className="btn btn-ghost btn-lg">Talk to Our Team</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
