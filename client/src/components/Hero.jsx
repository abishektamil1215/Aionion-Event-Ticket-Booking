import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Icon from './Icon.jsx';
import { Ph, Arrow } from './ui.jsx';
import QR from './QR.jsx';
import { day, mon, time, inr } from '../lib/format.js';
import useLuxuryHeroMotion from '../lib/useLuxuryHeroMotion.js';

export default function Hero({ cat, next }) {
  const heroRef = useRef(null);
  useLuxuryHeroMotion(heroRef, next?.id);
  const navigate = useNavigate();
  const [filters, setFilters] = useState({ q: '', city: '', category: '', date: '' });
  const change = (key) => (event) => setFilters((value) => ({ ...value, [key]: event.target.value }));
  const submit = (event) => {
    event.preventDefault();
    const params = new URLSearchParams(Object.entries(filters).map(([key, value]) => [key, value.trim()]).filter(([, value]) => value));
    navigate(`/explore${params.size ? `?${params}` : ''}`);
  };
  return <section ref={heroRef} className="launch-hero luxury-hero" aria-labelledby="launch-title">
    <div className="launch-grid-lines" data-hero-depth="1" data-hero-scroll="-8" aria-hidden="true" />
    <div className="luxury-ambient luxury-ambient-blue" data-hero-depth="2" data-hero-scroll="-10" aria-hidden="true" />
    <div className="luxury-ambient luxury-ambient-coral" data-hero-depth="1.5" data-hero-scroll="-6" aria-hidden="true" />
    <div className="container">
      <div className="launch-layout">
        <div className="launch-copy">
          <div className="launch-eyebrow"><span />Aionion Events <i /> A smarter way to gather</div>
          <h1 id="launch-title">Connect Minds.<br /><em>Create<br className="luxury-title-break" /> Possibilities.</em></h1>
          <p className="launch-description">Discover financial insights, investor conversations, exclusive client experiences and market-focused events.</p>
          <div className="launch-actions"><Link className="btn btn-primary btn-lg" to="/explore">Explore Events <Arrow /></Link><Link className="btn btn-ghost btn-lg" to="/meetings">Book a Session <Icon name="arrowUR" /></Link></div>
          <div className="launch-trust"><span><Icon name="shield" />Secure Booking</span><span><Icon name="qr" />Instant QR Tickets</span><span><Icon name="scan" />Fast Check-In</span></div>
          <div className="launch-interests"><span>Find your room</span>{[['Investor Meets','investor-meets'],['Workshops','workshops'],['Wealth Sessions','wealth']].map(([label, category]) => <Link key={category} to={`/explore?category=${category}`}>{label}<Icon name="arrowUR" /></Link>)}<Link to="/private">HNI Events<Icon name="arrowUR" /></Link></div>
        </div>
        <div className="launch-scene" aria-label="Featured Aionion experience">
          <div className="launch-halo" data-hero-depth="2" data-hero-scroll="-8" aria-hidden="true" />
          <svg className="luxury-market-lines" data-hero-depth="2" data-hero-scroll="-10" viewBox="0 0 600 500" fill="none" aria-hidden="true"><path d="M0 350 70 330 110 345 175 275 220 290 280 225 335 245 410 160 460 180 530 100 600 120" /><path d="M0 395 75 370 130 380 200 340 275 350 340 290 410 305 480 240 540 250 600 200" />{[[175,275],[335,245],[460,180],[530,100]].map(([cx,cy])=><circle key={cx} cx={cx} cy={cy} r="3" />)}</svg>
          <div className="luxury-stage-light" data-hero-depth="1" data-hero-scroll="-8" aria-hidden="true" />
          <div className="launch-orbit launch-orbit-outer" data-hero-depth="3" data-hero-scroll="-16" aria-hidden="true" /><div className="launch-orbit launch-orbit-inner" data-hero-depth="2" data-hero-scroll="-12" aria-hidden="true" />
          <div className="luxury-glass-ring" data-hero-depth="4" data-hero-scroll="-18" data-hero-ring aria-hidden="true"><i /></div>
          <div className="launch-plinth" data-hero-depth="2" data-hero-scroll="-10" aria-hidden="true"><span /><i /></div>
          {next ? <>
            <div className="launch-date luxury-glass" data-hero-depth="10" data-hero-start="20" data-hero-scroll="-40" data-hero-float="6"><Icon name="calendar" /><span>{mon(next.date)}<b>{day(next.date)}</b></span><small>Your next<br />great conversation.</small></div>
            <div className="launch-pass-float" data-hero-depth="6" data-hero-start="15" data-hero-scroll="-25" data-hero-float="4"><Link className="launch-pass luxury-glass" to={`/events/${next.id}`} aria-label={`View featured event: ${next.title}`}>
              <div className="launch-pass-heading"><span>AIONION <small>EVENTS</small></span><Icon name="ticket" /></div>
              <Ph src={next.img} className="launch-pass-image"><span>{next.label}</span></Ph>
              <div className="launch-pass-content"><span className="launch-pass-caption">EXCLUSIVE INVESTOR SESSION</span><h2>{next.title}</h2><p><Icon name="pin" />{next.city}<span>·</span>{time(next.date)}</p></div>
              <div className="launch-pass-perforation" />
              <div className="launch-pass-bottom"><div><small>TICKETS FROM</small><b>{inr(next.price)}</b><span>View experience <Icon name="arrowUR" /></span></div><div className="launch-pass-qr"><QR value={`AIO|PREVIEW|${next.id}`} label="Illustrative pass preview, not valid for entry" /><small>PREVIEW</small></div></div>
            </Link></div>
            <div className="launch-access luxury-glass" data-hero-depth="7" data-hero-scroll="-30"><span className="launch-access-icon"><Icon name="verified" /></span><div><b>{next.speakerInfo?.name || 'Aionion Capital'}</b><p>{next.seats > 0 ? `${next.seats} places available` : 'Explore the next experience'}<span />{next.format}</p></div></div>
            <div className="luxury-qr luxury-glass" data-hero-depth="9" data-hero-start="10" data-hero-scroll="-30" data-hero-float="5"><span className="luxury-mini-label">YOUR ACCESS</span><QR value={`AIO|PREVIEW|${next.id}`} label="Illustrative access pass, not valid for entry" /><span className="luxury-qr-caption">ADMIT ONE <Icon name="verified" /></span></div>
            <Link className="luxury-location luxury-glass" to={`/events/${next.id}`} data-hero-depth="7" data-hero-scroll="-22"><Icon name="pin" /><span>{next.city}<small>{next.venue}</small></span><Icon name="arrowUR" /></Link>
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
