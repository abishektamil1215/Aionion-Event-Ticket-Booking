import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCatalog } from '../App.jsx';
import { useApi } from '../lib/api.js';
import { shortDate, inr } from '../lib/format.js';
import Icon from '../components/Icon.jsx';
import BannerArt from '../components/BannerArt.jsx';
import EventGroups from '../components/EventGroups.jsx';
import { calendarUrl } from '../lib/ticketActions.js';
import { Ph, Eyebrow, Arrow } from '../components/ui.jsx';

const SECTIONS = [['markets', 'Stock Market'], ['mutual-funds', 'Mutual Funds'], ['literacy', 'Financial Literacy'], ['client', 'Client Meetings'], ['wealth', 'Private Wealth'], ['webinars', 'Webinars']];

function MiniList({ events, cat }) {
  const list = (events || []).filter((e) => cat.includes(e.category)).slice(0, 3);
  if (!list.length) return null;
  return (
    <div className="list-mini">
      {list.map((e) => (
        <Link key={e.id} to={`/events/${e.id}`}>
          <span className="d">{shortDate(e.date).toUpperCase()}</span>
          <span>{e.title} <span className="muted" style={{ fontSize: 13 }}>· {e.city}</span></span>
          <span className="mono" style={{ fontSize: 13 }}>{inr(e.price)}</span>
        </Link>
      ))}
    </div>
  );
}

export default function Categories() {
  const c = useCatalog();
  const I = c?.images || {};
  const { data: events } = useApi('/events');
  const [active, setActive] = useState('markets');

  useEffect(() => {
    const io = new IntersectionObserver((en) => en.forEach((x) => x.isIntersecting && setActive(x.target.id)), { rootMargin: '-45% 0px -50% 0px' });
    SECTIONS.forEach(([id]) => { const el = document.getElementById(id); if (el) io.observe(el); });
    return () => io.disconnect();
  }, []);

  return (
    <>
      <section className="page-head animated-banner">
        <div className="container">
          <div className="crumbs" data-enter style={{ '--d': 0.1 }}><Link to="/">Home</Link><span>/</span><span>Financial Events</span></div>
          <h1 className="display" data-enter style={{ '--d': 0.25 }}>Every conversation<br /><strong>has its <em>room.</em></strong></h1>
          <p className="lead" data-enter style={{ '--d': 0.4 }}>Six kinds of experience, each designed with its own atmosphere — from the trading-floor intensity of market sessions to the quiet of a private wealth lounge.</p>
          <BannerArt variant="categories" />
        </div>
      </section>

      <EventGroups />
      <nav className="cat-nav glass" aria-label="Event types">
        {SECTIONS.map(([id, l]) => <a key={id} href={`#${id}`} className={active === id ? 'is-active' : ''}>{l}</a>)}
      </nav>

      {/* STOCK MARKET */}
      <section id="markets" className="atm atm-market" style={{ marginTop: 60 }}>
        <div className="container atm-grid">
          <div className="reveal">
            <Eyebrow>Type 01 — Stock Market</Eyebrow>
            <h2 className="h1">Read the market<br /><strong>like a strategist.</strong></h2>
            <p className="lead">Outlook sessions, sector deep-dives and risk workshops led by the people who set Aionion’s house view.</p>
            <MiniList events={events} cat={['stock-markets', 'investor-meets']} />
            <Link to="/explore?category=stock-markets" className="btn btn-primary" style={{ marginTop: 32 }}>All market sessions <Arrow /></Link>
          </div>
          <div className="candles glass reveal" style={{ '--d': 0.15 }}>
            <Candles />
            <div className="readout">
              <div><span>NIFTY 50 · ILLUSTRATIVE</span><b>24,318.40</b></div>
              <div style={{ textAlign: 'right' }}><span>SESSION</span><b className="up">+0.84%</b></div>
            </div>
          </div>
        </div>
      </section>

      {/* MUTUAL FUNDS */}
      <section id="mutual-funds" className="atm atm-mf">
        <div className="container atm-grid">
          <div className="mf-panel reveal">
            <div className="row" style={{ justifyContent: 'space-between', marginBottom: 24 }}>
              <span className="label" style={{ color: '#4a5670' }}>Model allocation · Long horizon</span>
              <span className="tag blue" style={{ color: 'var(--blue)', background: 'rgba(0,35,255,.06)' }}>Illustrative</span>
            </div>
            <div className="alloc">
              <Donut />
              <ul className="mf-legend">
                {[['Large-cap equity', '42%', '#0023FF'], ['Flexi-cap', '28%', '#4867FF'], ['Debt & hybrid', '18%', '#7C4DFF'], ['International', '12%', '#FE667C']].map(([l, v, col]) => <li key={l}><span><i style={{ background: col }} />{l}</span><b>{v}</b></li>)}
              </ul>
            </div>
            <div className="mf-growth"><Growth /></div>
          </div>
          <div className="reveal" style={{ '--d': 0.15 }}>
            <Eyebrow>Type 02 — Mutual Funds</Eyebrow>
            <h2 className="h1" style={{ color: 'var(--ink)' }}>Fewer funds.<br /><strong>Better outcomes.</strong></h2>
            <p className="lead">Masterclasses on allocation, SIP discipline and choosing funds with a process you can trust for decades.</p>
            <MiniList events={events} cat={['mutual-funds']} />
            <Link to="/explore?category=mutual-funds" className="btn" style={{ marginTop: 32, background: 'var(--blue)', color: '#fff' }}>All mutual fund sessions <Arrow /></Link>
          </div>
        </div>
      </section>

      {/* FINANCIAL LITERACY */}
      <section id="literacy" className="atm atm-lit">
        <div className="container atm-grid">
          <div className="reveal">
            <Eyebrow>Type 03 — Financial Literacy</Eyebrow>
            <h2 className="h1">Money, made<br /><strong>approachable.</strong></h2>
            <p className="lead">Friendly, jargon-free sessions for first salaries, first SIPs and first big decisions. Most are free.</p>
            <Link to="/explore?category=literacy" className="btn btn-light" style={{ marginTop: 36 }}>Start learning <Arrow /></Link>
          </div>
          <div className="lit-cards">
            {[
              ['Budget with intent', 'The 50-30-20 habit, made practical.', <Ill key="a" kind="jar" />],
              ['Your first SIP', 'Small, steady, automatic.', <Ill key="b" kind="steps" />],
              ['Emergency fund', 'Six months of calm.', <Ill key="c" kind="shield" />],
              ['Credit, decoded', 'Scores, cards and good debt.', <Ill key="d" kind="card" />]
            ].map(([t, d, ill], i) => (
              <div key={t} className="lit-card reveal" style={{ '--d': i * 0.08 }}>
                {ill}
                <div><h4>{t}</h4><p>{d}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CLIENT MEETINGS */}
      <section id="client" className="atm atm-client">
        <div className="container atm-grid">
          <Ph src={I.office2} className="client-photo reveal" />
          <div className="reveal" style={{ '--d': 0.15 }}>
            <Eyebrow>Type 04 — Private Client Meetings</Eyebrow>
            <h2 className="h1" style={{ color: '#1c1c1f' }}>Your portfolio.<br />Our full attention.</h2>
            <p className="lead" style={{ marginBottom: 48 }}>One-to-one time with your relationship manager — in our office, online, or over a call.</p>
            <Link to="/meetings" className="btn btn-dark">Book a meeting <Arrow /></Link>
          </div>
        </div>
      </section>

      {/* HNI / PRIVATE WEALTH */}
      <section id="wealth" className="atm atm-hni">
        <div className="container atm-grid">
          <div className="reveal">
            <Eyebrow>Type 05 — Private Wealth</Eyebrow>
            <h2 className="h1">The private<br />banking lounge.</h2>
            <p className="lead" style={{ color: 'rgba(239,233,221,.6)' }}>Succession, structuring and family wealth — discussed in rooms of twelve, never twelve hundred.</p>
            <MiniList events={events} cat={['wealth', 'private']} />
            <Link to="/private" className="btn btn-gold" style={{ marginTop: 32 }}>Aionion Private <Arrow /></Link>
          </div>
          <div className="hni-frame reveal" style={{ '--d': 0.15 }}>
            <Ph src={I.lounge} />
            <div className="seal">AIONION<br />PRIVATE<br />— MMXXVI —</div>
          </div>
        </div>
      </section>

      {/* WEBINARS */}
      <section id="webinars" className="atm atm-web">
        <div className="container atm-grid">
          <div className="reveal">
            <Eyebrow>Type 06 — Webinars</Eyebrow>
            <h2 className="h1">The market,<br /><strong>live on your screen.</strong></h2>
            <p className="lead">Weekly broadcasts with our analysts. Ask questions live, watch the replay, add every session to your calendar.</p>
            <MiniList events={(events || []).filter((event) => event.format === 'Online')} cat={['stock-markets', 'wealth', 'literacy', 'mutual-funds', 'workshops']} />
            <Link to="/explore?format=Online" className="btn btn-primary" style={{ marginTop: 32 }}>All webinars <Arrow /></Link>
          </div>
          <div className="reveal" style={{ position: 'relative', '--d': 0.15 }}>
            <div className="screen glass">
              <div className="video">
                <Ph src={c?.people.vikram} />
                <div className="v-top"><span className="tag coral"><i className="pulse" />Live</span><span className="tag">1,284 watching</span></div>
                <div className="v-bottom">
                  <div><span className="label" style={{ color: '#fff' }}>Weekly Market Pulse</span><p style={{ fontSize: 13, color: 'var(--grey)' }}>Vikram Raghavan</p></div>
                  <Ph src={c?.people.ananya} className="pip" />
                </div>
              </div>
              <div className="bar-ctrl"><span><Icon name="mic" /></span><span><Icon name="video" /></span><span><Icon name="chat" /></span><span className="end"><Icon name="end" /></span></div>
            </div>
            <div className="web-cal glass">
              <span className="label">Next broadcast</span>
              <p style={{ fontFamily: 'var(--f-display)', fontSize: 20, margin: '6px 0 12px' }}>Thu · 6:00 PM</p>
              <a className="btn btn-ghost btn-sm btn-block" href={calendarUrl('market-pulse')}><Icon name="calendar" className="icon" />Add to calendar</a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function Candles() {
  const data = Array.from({ length: 28 }, (_, i) => {
    const base = 300 - i * 7 + Math.sin(i * 1.3) * 30;
    const up = Math.sin(i * 2.1) > -0.3;
    const h = 20 + Math.abs(Math.cos(i)) * 40;
    return { x: 30 + i * 19, o: up ? base : base - h, c: up ? base - h : base, up };
  });
  return (
    <svg viewBox="0 0 580 480" preserveAspectRatio="none" aria-hidden="true">
      {[120, 200, 280, 360].map((y) => <line key={y} x1="0" x2="580" y1={y} y2={y} stroke="rgba(255,255,255,.05)" />)}
      {data.map((d, i) => (
        <g key={i}>
          <line x1={d.x} x2={d.x} y1={Math.min(d.o, d.c) - 16} y2={Math.max(d.o, d.c) + 14} stroke={d.up ? '#8FA2FF' : '#FE667C'} strokeOpacity=".7" />
          <rect x={d.x - 5} y={Math.min(d.o, d.c)} width="10" height={Math.abs(d.o - d.c)} rx="1.5" fill={d.up ? '#4867FF' : '#FE667C'} fillOpacity={d.up ? 0.85 : 0.6} />
        </g>
      ))}
      <path className="draw" style={{ '--len': 800 }} d={`M${data.map((d) => `${d.x} ${(d.o + d.c) / 2 + 30}`).join(' L')}`} fill="none" stroke="rgba(255,255,255,.4)" strokeDasharray="2 4" />
    </svg>
  );
}

function Donut() {
  const R = 70, C = 2 * Math.PI * R;
  const segs = [[0, 42, '#0023FF'], [42, 70, '#4867FF'], [70, 88, '#7C4DFF'], [88, 100, '#FE667C']];
  return (
    <svg viewBox="0 0 200 200" style={{ width: '100%' }} aria-label="Allocation donut">
      <g transform="translate(100 100) rotate(-90)">
        {segs.map(([a, b, col]) => <circle key={a} r={R} fill="none" stroke={col} strokeWidth="22" strokeDasharray={`${((b - a) / 100) * C - 3} ${C}`} strokeDashoffset={-(a / 100) * C} />)}
      </g>
      <text x="100" y="96" textAnchor="middle" fontFamily="Sora" fontSize="26" fontWeight="300" fill="#020617">12.4%</text>
      <text x="100" y="116" textAnchor="middle" fontFamily="IBM Plex Mono" fontSize="8" letterSpacing="1.5" fill="#68758C">10Y CAGR · ILLUS.</text>
    </svg>
  );
}

function Growth() {
  return (
    <svg viewBox="0 0 500 160" preserveAspectRatio="none" aria-hidden="true">
      <defs><linearGradient id="gr-f" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#0023FF" stopOpacity=".18" /><stop offset="1" stopColor="#0023FF" stopOpacity="0" /></linearGradient></defs>
      <path d="M0 150 C120 145 220 130 300 100 S430 30 500 10 L500 160 L0 160Z" fill="url(#gr-f)" />
      <path className="draw" style={{ '--len': 600 }} d="M0 150 C120 145 220 130 300 100 S430 30 500 10" fill="none" stroke="#0023FF" strokeWidth="2" />
      <path d="M0 150 C150 148 300 140 500 118" fill="none" stroke="#68758C" strokeWidth="1" strokeDasharray="3 4" />
      {['Y0', 'Y5', 'Y10', 'Y15', 'Y20'].map((t, i) => <text key={t} x={i * 120 + 4} y="158" fontSize="9" fontFamily="IBM Plex Mono" fill="#68758C">{t}</text>)}
    </svg>
  );
}

function Ill({ kind }) {
  const s = { fill: 'none', stroke: '#0023FF', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' };
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <circle cx="44" cy="20" r="14" fill="#FE667C" opacity=".25" />
      {kind === 'jar' && <><path {...s} d="M20 18h24v6c4 3 4 6 4 10v16a4 4 0 0 1-4 4H20a4 4 0 0 1-4-4V34c0-4 0-7 4-10z" /><path {...s} d="M24 40h16M24 46h10" /></>}
      {kind === 'steps' && <path {...s} d="M10 52h12V40h12V28h12V16h8" />}
      {kind === 'shield' && <><path {...s} d="M32 8l18 7v12c0 12-8 21-18 25-10-4-18-13-18-25V15z" /><path {...s} d="M24 32l6 6 11-12" /></>}
      {kind === 'card' && <><rect {...s} x="8" y="18" width="48" height="30" rx="6" /><path {...s} d="M8 28h48M16 40h10" /></>}
    </svg>
  );
}
