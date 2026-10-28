import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Icon from './Icon.jsx';
import { Ph, Arrow } from './ui.jsx';
import QR from './QR.jsx';
import { day, mon, time, inr } from '../lib/format.js';

const HEADLINES = [
  ['Where Finance', 'Meets', 'Opportunity.', 'Discover', 'Ideas. People. Possibilities.'],
  ['Learn Today.', 'Build', 'Tomorrow.', 'Learn', 'Stock Market · Mutual Funds · Financial Literacy · Workshops'],
  ['Connect Minds.', 'Create', 'Possibilities.', 'Connect', 'Public Meets · Investor Meets · Webinars'],
  ['Your Ambition.', 'Our', 'Attention.', 'Private', 'Client Meetings · HNI Meets · Relationship Manager sessions']
];

function AnimatedHeadline() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (paused || motion.matches) return;
    const timer = window.setInterval(() => setIndex((value) => (value + 1) % HEADLINES.length), 3000);
    return () => window.clearInterval(timer);
  }, [paused]);
  const [line, prefix, word, , detail] = HEADLINES[index];
  return <div className={`hero-type-scene hero-type-${index} ${paused ? 'hero-type-paused' : ''}`}>
    <div className="hero-type-aura" aria-hidden="true" />
    <h1 id="launch-title" aria-label="Discover opportunities. Learn, connect, and explore private experiences.">
      <span className="hero-type-frame" key={index} aria-hidden="true"><span className="hero-type-line">{line}</span><span className="hero-type-line hero-type-second"><span>{prefix} </span><em>{Array.from(word).map((letter, i) => <span key={i} style={{ '--letter': i }}>{letter}</span>)}</em></span></span>
    </h1>
    <p className="hero-type-detail" key={`detail-${index}`}>{detail}</p>
    <div className="hero-type-controls" role="group" aria-label="Headline animation">
      {HEADLINES.map((entry, i) => <button key={entry[3]} aria-pressed={index === i} onClick={() => { setIndex(i); setPaused(true); }}><span className="hero-type-dot" />{entry[3]}</button>)}
      <button className="hero-type-toggle" onClick={() => setPaused((value) => !value)} aria-label={paused ? 'Play headline animation' : 'Pause headline animation'}>{paused ? '▷' : 'Ⅱ'}</button>
    </div>
  </div>;
}

export default function Hero({ cat, next }) {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({ q: '', city: '', category: '', date: '' });
  const change = (key) => (event) => setFilters((value) => ({ ...value, [key]: event.target.value }));
  const submit = (event) => {
    event.preventDefault();
    const params = new URLSearchParams(Object.entries(filters).map(([key, value]) => [key, value.trim()]).filter(([, value]) => value));
    navigate(`/explore${params.size ? `?${params}` : ''}`);
  };
  return <section className="launch-hero" aria-labelledby="launch-title">
    <div className="launch-grid-lines" aria-hidden="true" />
    <div className="container">
      <div className="launch-layout">
        <div className="launch-copy">
          <div className="launch-eyebrow"><span />Aionion Events <i /> A smarter way to gather</div>
          <AnimatedHeadline />
          <p className="launch-description">Explore investor meets, wealth sessions, market workshops and exclusive community experiences. For ambitious minds. For what comes next.</p>
          <div className="launch-actions"><Link className="btn btn-primary btn-lg" to="/explore">Explore Events <Arrow /></Link><Link className="btn btn-ghost btn-lg" to="/organizers">Host an Event <Icon name="arrowUR" /></Link></div>
          <div className="launch-trust"><span><Icon name="shield" />Secure Booking</span><span><Icon name="qr" />Instant QR Tickets</span><span><Icon name="scan" />Fast Check-In</span></div>
          <div className="launch-interests"><span>Find your room</span>{[['Investor Meets','investor-meets'],['Workshops','workshops'],['Wealth Sessions','wealth']].map(([label, category]) => <Link key={category} to={`/explore?category=${category}`}>{label}<Icon name="arrowUR" /></Link>)}<Link to="/private">HNI Events<Icon name="arrowUR" /></Link></div>
        </div>
        <div className="launch-scene" aria-label="Featured Aionion experience">
          <div className="launch-halo" aria-hidden="true" />
          <div className="launch-orbit launch-orbit-outer" aria-hidden="true" /><div className="launch-orbit launch-orbit-inner" aria-hidden="true" />
          <div className="launch-plinth" aria-hidden="true"><span /><i /></div>
          {next ? <>
            <div className="launch-date"><Icon name="calendar" /><span>{mon(next.date)}<b>{day(next.date)}</b></span><small>Your next<br />great conversation.</small></div>
            <div className="launch-pass-float"><Link className="launch-pass" to={`/events/${next.id}`} aria-label={`View featured event: ${next.title}`}>
              <div className="launch-pass-heading"><span>AIONION <small>EVENTS</small></span><Icon name="ticket" /></div>
              <Ph src={next.img} className="launch-pass-image"><span>{next.label}</span></Ph>
              <div className="launch-pass-content"><span className="launch-pass-caption">THE FEATURED EXPERIENCE</span><h2>{next.title}</h2><p><Icon name="pin" />{next.city}<span>·</span>{time(next.date)}</p></div>
              <div className="launch-pass-perforation" />
              <div className="launch-pass-bottom"><div><small>TICKETS FROM</small><b>{inr(next.price)}</b><span>View experience <Icon name="arrowUR" /></span></div><div className="launch-pass-qr"><QR value={`AIO|PREVIEW|${next.id}`} label="Illustrative pass preview, not valid for entry" /><small>PREVIEW</small></div></div>
            </Link></div>
            <div className="launch-access"><span className="launch-access-icon"><Icon name="verified" /></span><div><b>Considered. Curated. Connected.</b><p>{next.seats > 0 ? `${next.seats} places available` : 'Explore the next experience'}<span />{next.format}</p></div></div>
          </> : <div className="launch-pass-placeholder"><Icon name="ticket" /><span>Your next opportunity<br />starts with a conversation.</span></div>}
          <span className="launch-scene-caption">REAL CONVERSATIONS. LASTING CONNECTIONS.</span>
        </div>
      </div>
      <form className="launch-discovery" onSubmit={submit} role="search" aria-label="Find your next event">
        <label className="launch-search-field"><span>YOUR NEXT OPPORTUNITY</span><div><Icon name="search" /><input value={filters.q} onChange={change('q')} placeholder="Events, topics or speakers" aria-label="Events, topics or speakers" /></div></label>
        <label><span>CITY</span><select value={filters.city} onChange={change('city')} aria-label="Event city"><option value="">Anywhere</option>{cat?.cities?.map((city) => <option key={city.name} value={city.name}>{city.name}</option>)}<option value="Online">Online</option></select></label>
        <label><span>CATEGORY</span><select value={filters.category} onChange={change('category')} aria-label="Event category"><option value="">All experiences</option>{cat?.categories?.filter((category) => category.key !== 'hni').map((category) => <option key={category.key} value={category.key}>{category.name}</option>)}</select></label>
        <label><span>WHEN</span><select value={filters.date} onChange={change('date')} aria-label="Event date"><option value="">Any time</option><option value="week">This week</option><option value="month">This month</option><option value="quarter">Next 3 months</option></select></label>
        <button type="submit" className="btn btn-primary">Find Events <Arrow /></button>
      </form>
      <div className="launch-footnote"><span>Ideas worth exploring. People worth meeting.</span><a href="#featured-experiences">Discover what’s next <Icon name="arrow" /></a></div>
    </div>
  </section>;
}
