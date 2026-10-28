import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useCatalog } from '../App.jsx';
import { useApi } from '../lib/api.js';
import { longDate, shortDate, time, endTime, inr, isLow } from '../lib/format.js';
import Icon from '../components/Icon.jsx';
import { Ph, Arrow, Loading, useToast } from '../components/ui.jsx';
import { SpeakerCard } from './Home.jsx';
import NotFound from './NotFound.jsx';

const COPY = {
  markets: { learn: ['How we read the macro set-up for the year ahead', 'Sectors with structural tailwinds — and the ones to avoid', 'Valuation guardrails for a stretched market', 'Building a risk budget you can actually follow'], who: ['Active equity investors', 'Business owners', 'Finance professionals', 'Aionion clients'] },
  'mutual-funds': { learn: ['Why most portfolios hold too many funds', 'Matching fund categories to goals and horizons', 'Reading a factsheet in five minutes', 'Rebalancing without emotion'], who: ['New SIP investors', 'Young professionals', 'Families planning goals', 'DIY investors'] },
  literacy: { learn: ['A budget you will actually keep', 'Emergency funds and insurance basics', 'Your first SIP — step by step', 'Avoiding the five most common money mistakes'], who: ['First-time earners', 'Students', 'Young couples', 'Anyone starting out'] },
  education: { learn: ['The three statements and how they connect', 'Spotting red flags in reported numbers', 'Return on capital and why it matters', 'From numbers to an investment thesis'], who: ['Self-directed investors', 'Analysts in training', 'Business owners', 'Curious learners'] },
  wealth: { learn: ['Income planning for the decades ahead', 'Healthcare and longevity risk', 'Estate and succession essentials', 'Balancing growth and safety'], who: ['Pre-retirees', 'Retirees', 'Families planning legacy', 'Aionion clients'] },
  client: { learn: ['A full review of your current portfolio', 'Goal tracking and rebalancing', 'New opportunities matched to your profile', 'Your questions — answered in person'], who: ['Aionion clients', 'Family members of clients', 'Prospective clients by referral'] },
  webinars: { learn: ['The week’s market moves, explained', 'What we are watching next', 'Live Q&A with analysts', 'Replay and notes after the session'], who: ['Anyone, anywhere', 'Busy professionals', 'Investors outside our cities'] },
  private: { learn: ['Candid perspectives from our CIO office', 'Peer conversation in a small, closed room', 'Long-horizon thinking on family wealth', 'Relationships that outlast the evening'], who: ['Aionion Private clients', 'Founders and promoters', 'Family office principals'] }
};

export default function EventDetail() {
  const { id } = useParams();
  const cat = useCatalog();
  const nav = useNavigate();
  const toast = useToast();
  const { data: e, loading, error } = useApi(`/events/${id}`);
  const [tier, setTier] = useState('general');
  const [qty, setQty] = useState(1);

  useEffect(() => { setTier(e?.tiers?.[0]?.key || 'general'); setQty(1); }, [e?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) return <Loading label="Preparing your invitation" />;
  if (error || !e) return <NotFound />;

  const I = cat?.images || {};
  const copy = COPY[e.category] || COPY.markets;
  const t = e.tiers.find((x) => x.key === tier) || e.tiers[0];
  const total = t ? t.price * qty : 0;
  const maxQty = Math.min(6, t?.available || 0);
  const pct = Math.round((e.attending / e.capacity) * 100);
  const low = isLow(e);
  const reserve = () => { if (maxQty >= qty) nav(`/checkout/${e.id}?tier=${t.key}&qty=${qty}`); };
  const share = async () => {
    const url = window.location.href;
    try { if (navigator.share) await navigator.share({ title: e.title, url }); else { await navigator.clipboard.writeText(url); toast('Link copied to clipboard'); } } catch { /* dismissed */ }
  };

  const agenda = [
    [time(e.date), 'Arrival & welcome', 'Coffee, registration and introductions'],
    ['+ 30 min', `Keynote — ${e.subtitle}`, e.speakerInfo ? `${e.speakerInfo.name}, ${e.speakerInfo.role}` : 'Aionion research team'],
    ['+ 90 min', 'Panel conversation', 'Strategists and portfolio managers in discussion'],
    ['+ 150 min', 'Audience Q&A', 'Your questions, answered candidly'],
    [endTime(e.end), 'Close & networking', 'Conversations continue over refreshments']
  ];

  return (
    <>
      <section className="ev-hero">
        <Ph src={e.img} className="event-banner-photo" />
        <div className="container">
          <div className="crumbs" data-enter style={{ '--d': 0.1 }}><Link to="/">Home</Link><span>/</span><Link to="/explore">Events</Link><span>/</span><span>{e.label}</span></div>
          <div className="row wrap" data-enter style={{ '--d': 0.2, marginTop: 28 }}>
            <span className="tag blue">{e.kicker}</span>
            {e.invite ? <span className="tag gold">Invitation Only</span> : low ? <span className="tag coral"><i className="pulse" />Limited Seats</span> : <span className="tag">Open for booking</span>}
          </div>
          <p className="ev-name" data-enter style={{ '--d': 0.3 }}>{e.title.toUpperCase()}</p>
          <h1 className="display" data-enter style={{ '--d': 0.4 }}><strong>{e.tagline.split(/<br\s*\/?>/i).map((line, i) => <span key={i}>{i > 0 && <br />}{line}</span>)}</strong></h1>
          <div className="ev-facts" data-enter style={{ '--d': 0.6 }}>
            <div><span className="label">Date</span><b>{longDate(e.date)}</b></div>
            <div><span className="label">Time</span><b>{time(e.date)} — {endTime(e.end)}</b></div>
            <div><span className="label">Location</span><b>{e.city.toUpperCase()}</b></div>
            <div><span className="label">Format</span><b>{e.format}</b></div>
            <div><span className="label">Availability</span><b className={low || e.invite ? 'coral' : ''}>{e.seats} {e.invite ? 'places' : 'seats'} left</b></div>
          </div>
        </div>
      </section>

      <div className="container ev-layout">
        <div>
          <section className="ev-section reveal">
            <span className="label">About the Experience</span>
            <h2>{e.subtitle}.</h2>
            <p>{e.title} brings together {(Array.isArray(e.audience) ? e.audience.join(', ') : String(e.audience || 'investors')).toLowerCase()} and Aionion’s research team for a focused, expert-led conversation. Expect clarity rather than noise — frameworks you can apply to your own portfolio the following morning.</p>
            <p>Seating is deliberately limited so that every attendee can ask questions, meet the speakers and leave with a considered point of view.</p>
          </section>

          <section className="ev-section">
            <span className="label reveal">Why Attend</span>
            <div className="why">
              {[['chart', 'Institutional insight', 'The same research our portfolio managers use, presented plainly.'], ['users', 'The right room', 'Curated attendees — investors, founders and professionals.'], ['key', 'Lasting access', 'Session notes, recordings and follow-up with our team.']].map(([ic, b, p], i) => (
                <div key={b} className="glass reveal" style={{ '--d': i * 0.08 }}><Icon name={ic} /><b>{b}</b><p>{p}</p></div>
              ))}
            </div>
          </section>

          <section className="ev-section reveal">
            <span className="label">What You’ll Learn</span>
            <ul className="learn">{copy.learn.map((l, i) => <li key={l}><span>0{i + 1}</span>{l}</li>)}</ul>
          </section>

          <section className="ev-section">
            <span className="label reveal">Speakers</span>
            <h2 className="reveal">The people behind the conversation.</h2>
            <div className="ev-speakers">{e.speakers.map((s, i) => <SpeakerCard key={s.id} s={{ ...s, sessions: [] }} delay={i * 0.08} />)}</div>
          </section>

          <section className="ev-section reveal">
            <span className="label">Agenda</span>
            <ol className="agenda" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {agenda.map(([tm, b, s]) => <li key={b}><span className="t">{tm}</span><span className="dot" /><div><b>{b}</b><small>{s}</small></div></li>)}
            </ol>
          </section>

          <section className="ev-section reveal">
            <span className="label">Who Should Attend</span>
            <div className="who-grid">{copy.who.map((w) => <span key={w}>{w}</span>)}</div>
          </section>

          <section className="ev-section reveal">
            <span className="label">Venue</span>
            <div className="venue glass">
              <div className="map"><VenueMap /></div>
              <div className="v-info stack-16">
                <h3 className="h3">{e.venue}</h3>
                <p>{e.city}{e.format !== 'Online' ? ', India' : ' — join from anywhere'}</p>
                <p className="mono steel" style={{ fontSize: 12 }}>{(cat?.cities || []).find((c) => c.name === e.city)?.lat} {(cat?.cities || []).find((c) => c.name === e.city)?.lng}</p>
                {e.format !== 'Online' && <a className="link-u" target="_blank" rel="noreferrer" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(e.venue + ', ' + e.city)}`}>Get directions <Icon name="arrowUR" /></a>}
              </div>
            </div>
          </section>

          <section className="ev-section reveal">
            <span className="label">Event Highlights</span>
            <ul className="learn">{(e.highlights || []).map((highlight, i) => <li key={highlight}><span>{String(i + 1).padStart(2, '0')}</span>{highlight}</li>)}</ul>
          </section>
          <section className="ev-section reveal">
            <span className="label">Amenities</span>
            <div className="chips" style={{ marginTop: 20 }}>{(e.amenities || []).map((amenity) => <span className="chip" key={amenity.key}>{amenity.label}</span>)}</div>
          </section>
          <section className="ev-section reveal">
            <span className="label">Things to Know</span>
            <ul className="learn">{(e.thingsToKnow || []).map((item, i) => <li key={item}><span>{String(i + 1).padStart(2, '0')}</span>{item}</li>)}</ul>
            <div className="row wrap" style={{ gap: 20 }}><Link className="link-u" to="/cancellation-policy">Cancellation policy <Arrow /></Link><Link className="link-u" to="/refund-policy">Refund & return policy <Arrow /></Link></div>
          </section>
          <section className="ev-section reveal">
            <span className="label">Organizer Information</span>
            <div className="glass info-block stack-16" style={{ marginTop: 20 }}><h3 className="h3">{e.organizer.name}</h3><p>Financial education and professional experiences from the Aionion team.</p><Link className="link-u" to="/meetings">Contact the team <Arrow /></Link></div>
          </section>
          <section className="ev-section reveal">
            <span className="label">Event Gallery</span>
            <div className="gallery">{[...new Set([I.auditorium, I.networking, I.speaker, I.panel, I.discussion, I.workshop, I.meeting])].filter((src) => src && src !== e.img).slice(0, 5).map((src) => <Ph key={src} src={src} />)}</div>
          </section>

          <section className="ev-section faq reveal" id="faq">
            <span className="label">FAQs</span>
            {[
              ['What does my ticket include?', 'Entry to all sessions, materials, refreshments, and the benefits listed for your access level. Premium and VIP include additional analyst time.'],
              ['Can I transfer my ticket?', 'Tickets are issued to the named attendee and checked against photo ID. You can ask support to change the attendee name free of charge until 48 hours before the event. Invite Only tickets are non-transferable.'],
              ['What is the refund policy?', 'Cancel from My Tickets: 100% of the ticket amount 7+ days before the event, 50% between 7 days and 48 hours before, and no refund within 48 hours. The convenience fee and GST are non-refundable unless we cancel the event, in which case you get everything back. Free registrations can be cancelled any time.'],
              ['How long do refunds take?', 'Refunds are initiated within 2 working days and usually credited to your original payment method within 5–7 working days.'],
              ['Is this investment advice?', 'No. Sessions are educational and reflect general market views. For personalised advice, book a meeting with your relationship manager.'],
              ['Will there be a recording?', 'Attendees receive session notes; recordings are shared for webinars and selected sessions.']
            ].map(([q, a]) => <details key={q}><summary>{q}<i /></summary><p>{a}</p></details>)}
          </section>

          <section className="ev-section reveal" style={{ borderBottom: 0 }}>
            <span className="label">Terms</span>
            <p className="terms">Entry requires a valid QR ticket and a government photo ID matching the attendee name; each ticket admits one person, once. Speakers, agenda or timings may change; significant changes are handled under our <Link to="/cancellation-policy">Cancellation Policy</Link>. Content is educational and not a recommendation to buy or sell any security. Investments in securities markets are subject to market risks; read all related documents carefully before investing. See our <Link to="/terms">Terms of Use</Link> and <Link to="/disclaimer">Investment Disclaimer</Link>.</p>
          </section>
        </div>

        <aside>
          {e.invite ? (
            <div className="booking glass" style={{ borderColor: 'rgba(200,180,140,.25)' }}>
              <span className="tag gold">Invitation Only</span>
              <h3 style={{ margin: '18px 0 10px', color: 'var(--ivory)' }}>Request an invitation</h3>
              <p className="muted" style={{ fontSize: 14.5 }}>This experience is reserved for Aionion Private clients and their guests. {e.seats} places remain.</p>
              <div className="benefits"><ul>{copy.learn.slice(0, 3).map((b) => <li key={b}><Icon name="check" />{b}</li>)}</ul></div>
              <Link to={`/private?event=${e.id}#request`} className="btn btn-gold btn-block btn-lg">Request Access <Arrow /></Link>
              <p className="label" style={{ marginTop: 16, textAlign: 'center' }}>Responses within 2 working days</p>
            </div>
          ) : (
            <div className="booking glass sheen">
              <div className="b-top">
                <h3>Reserve Your Seat</h3>
                <button className="icon-btn" onClick={share} aria-label="Share event"><Icon name="share" /></button>
              </div>
              <div className="tiers" role="radiogroup" aria-label="Ticket type">
                {e.tiers.map((x) => (
                  <label key={x.key} className={`tier ${tier === x.key ? 'is-active' : ''}`}>
                    <input type="radio" name="tier" value={x.key} checked={tier === x.key} disabled={x.available <= 0} onChange={() => { setTier(x.key); setQty(1); }} />
                    <span className="tn"><i /><span>{x.name}<small style={{ display: 'block', color: 'var(--grey)' }}>{x.available ? `${x.available} remaining` : 'Sold out'}</small></span></span>
                    <span className="tp">{inr(x.price)}</span>
                  </label>
                ))}
              </div>
              <div className="benefits"><ul>{t?.benefits.map((b) => <li key={b}><Icon name="check" />{b}</li>)}</ul></div>
              <div className="qty-row">
                <span>Quantity</span>
                <div className="stepper">
                  <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Fewer">−</button>
                  <output aria-live="polite">{qty}</output>
                  <button disabled={qty >= maxQty} onClick={() => setQty((q) => Math.min(maxQty, q + 1))} aria-label="More">+</button>
                </div>
              </div>
              <div style={{ marginBottom: 20 }}>
                <div className="row" style={{ justifyContent: 'space-between', fontSize: 13, marginBottom: 8 }}>
                  <span className={low ? 'coral' : 'muted'}>{e.seats} seats remaining</span><span className="mono steel">{pct}% reserved</span>
                </div>
                <div className={`seat-bar ${low ? 'low' : ''}`}><i style={{ width: `${pct}%` }} /></div>
              </div>
              <div className="total-row"><span className="muted">Tickets subtotal</span><span className="num">{inr(total)}</span></div>
              {total > 0 && <p className="steel" style={{ fontSize: 12, marginBottom: 16 }}>2% booking fee + GST on the fee shown at checkout.</p>}
              <button className="btn btn-primary btn-lg btn-block b-cta magnetic" onClick={reserve} disabled={maxQty < qty}>{maxQty < 1 ? 'Sold out' : t?.price === 0 ? 'Register Free' : 'Book Now'} <Arrow /></button>
              <div className="assure">
                <span><Icon name="lock" />Secure checkout</span>
                <span><Icon name="bolt" />Instant confirmation</span>
                <span><Icon name="qr" />Digital QR ticket</span>
              </div>
            </div>
          )}
        </aside>
      </div>

      {!e.invite && (
        <div className="mobile-cta">
          <div><span className="num">{inr(t?.price ?? 0)}</span><small>{e.seats} seats left · {shortDate(e.date)}</small></div>
          <button className="btn btn-primary" disabled={maxQty < qty} onClick={reserve}>{maxQty < 1 ? 'Sold out' : 'Book Now'} <Arrow /></button>
        </div>
      )}
    </>
  );
}

function VenueMap() {
  return (
    <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs><pattern id="vm-g" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M20 0H0V20" fill="none" stroke="rgba(255,255,255,.04)" /></pattern></defs>
      <rect width="400" height="300" fill="url(#vm-g)" />
      <path d="M-10 210 C80 190 140 230 220 180 S340 120 420 140" stroke="rgba(72,103,255,.35)" strokeWidth="14" fill="none" />
      <path d="M60 -10 L120 320 M260 -10 L230 320 M-10 90 L420 70" stroke="rgba(255,255,255,.1)" strokeWidth="6" fill="none" />
      <path d="M-10 140 L420 160 M330 -10 L360 320" stroke="rgba(255,255,255,.06)" strokeWidth="3" fill="none" />
      <circle cx="235" cy="128" r="40" fill="rgba(0,35,255,.15)" />
      <circle cx="235" cy="128" r="18" fill="rgba(0,35,255,.3)" />
      <circle cx="235" cy="128" r="7" fill="#FE667C" stroke="#fff" strokeWidth="2" />
    </svg>
  );
}
