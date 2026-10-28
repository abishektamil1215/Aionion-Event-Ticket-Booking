import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCatalog } from '../App.jsx';
import { api } from '../lib/api.js';
import Icon from '../components/Icon.jsx';
import BannerArt from '../components/BannerArt.jsx';
import { Ph, Eyebrow, Arrow } from '../components/ui.jsx';

const TYPES = [['Relationship Manager', 'Your dedicated contact', 'user'], ['Portfolio Discussion', 'Strategy & allocation', 'pie'], ['Investment Review', 'Performance check-in', 'review'], ['Financial Consultation', 'Goals & planning', 'briefcase'], ['Client Support', 'Account & service', 'support']];
const MODES = [['Online', 'Video call', 'video'], ['Office', 'Visit us', 'building'], ['Phone', 'We call you', 'phone']];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const pad = (n) => String(n).padStart(2, '0');
const ymd = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export default function Meetings() {
  const cat = useCatalog();
  const today = useMemo(() => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; }, []);
  const [view, setView] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [type, setType] = useState(TYPES[0][0]);
  const [mode, setMode] = useState(MODES[0][0]);
  const [date, setDate] = useState(null);
  const [slots, setSlots] = useState(null);
  const [slot, setSlot] = useState(null);
  const [purpose, setPurpose] = useState('');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState({ sending: false, error: '', done: null });
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    if (!date) return;
    setSlots(null); setSlot(null);
    api.get(`/meetings/availability?date=${date}`).then(setSlots).catch(() => setSlots([]));
  }, [date, refresh]);

  const days = useMemo(() => {
    const first = new Date(view);
    const offset = (first.getDay() + 6) % 7; // Monday-first
    const count = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
    const max = new Date(today); max.setDate(max.getDate() + 60);
    return [...Array(offset).fill(null), ...Array.from({ length: count }, (_, i) => {
      const d = new Date(view.getFullYear(), view.getMonth(), i + 1);
      return { d, key: ymd(d), disabled: d < today || d > max || d.getDay() === 0, today: +d === +today };
    })];
  }, [view, today]);

  const canPrev = view > new Date(today.getFullYear(), today.getMonth(), 1);
  const shift = (n) => setView(new Date(view.getFullYear(), view.getMonth() + n, 1));
  const pretty = date ? new Date(date + 'T00:00').toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' }) : '—';

  const confirm = async () => {
    setStatus({ sending: true, error: '', done: null });
    try { const m = await api.post('/meetings', { type, mode, date, time: slot, purpose, notes }); setStatus({ sending: false, error: '', done: m }); }
    catch (err) { setStatus({ sending: false, error: err.message, done: null }); if (/taken/.test(err.message)) setRefresh((n) => n + 1); }
  };

  if (status.done) {
    const m = status.done;
    return (
      <section className="success">
        <div className="container">
          <div className="pulse-orb" />
          <span className="label" data-enter style={{ '--d': 0.2 }}>Appointment Confirmed · {m.id}</span>
          <h1 className="display" data-enter style={{ '--d': 0.4, margin: '24px 0' }}>See you soon.</h1>
          <div className="glass" data-enter style={{ '--d': 0.7, maxWidth: 560, margin: '40px auto 0', padding: 32, textAlign: 'left' }}>
            <div className="rm-card"><Ph src={cat?.people.priya} /><div><b>{m.manager}</b><p className="muted" style={{ fontSize: 13 }}>Senior Relationship Director</p></div></div>
            <dl className="meet-summary" style={{ position: 'static', padding: 0, background: 'none', border: 0, boxShadow: 'none' }}>
              {[['Meeting', m.type], ['Mode', m.mode], ['Date', new Date(m.date + 'T00:00').toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })], ['Time', `${m.time} IST`]].map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
            </dl>
            <p className="muted" style={{ fontSize: 14 }}>A calendar invitation{m.mode === 'Online' ? ' with your video link' : ''} has been sent to your registered email.</p>
          </div>
          <div className="ticket-actions"><Link to="/tickets" className="btn btn-ghost">My Tickets</Link><Link to="/explore" className="btn btn-primary">Explore Events <Arrow /></Link></div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="page-head animated-banner">
        <div className="container">
          <div className="crumbs" data-enter style={{ '--d': 0.1 }}><Link to="/">Home</Link><span>/</span><span>Client Meetings</span></div>
          <h1 className="display" data-enter style={{ '--d': 0.25 }}>Let’s talk about<br /><strong>what <em>matters</em> to you.</strong></h1>
          <p className="lead" data-enter style={{ '--d': 0.4 }}>Book unhurried time with your relationship team — online, at our office, or over the phone.</p>
          <BannerArt variant="meetings" />
        </div>
      </section>

      <section className="container meet-grid" style={{ paddingBottom: 140 }}>
        <div data-enter style={{ '--d': 0.55 }}>
          <div className="step-block">
            <div className="sb-head"><span>01</span><h3>Meeting type</h3></div>
            <div className="opt-grid">
              {TYPES.map(([t, s, ic]) => <button key={t} className={`opt ${type === t ? 'is-active' : ''}`} onClick={() => setType(t)} aria-pressed={type === t}><Icon name={ic} /><b>{t}</b><small>{s}</small></button>)}
            </div>
          </div>

          <div className="step-block">
            <div className="sb-head"><span>02</span><h3>How would you like to meet?</h3></div>
            <div className="opt-grid modes">
              {MODES.map(([t, s, ic]) => <button key={t} className={`opt ${mode === t ? 'is-active' : ''}`} onClick={() => setMode(t)} aria-pressed={mode === t}><Icon name={ic} /><b>{t}</b><small>{s}</small></button>)}
            </div>
          </div>

          <div className="step-block">
            <div className="sb-head"><span>03</span><h3>Choose a date</h3></div>
            <div className="cal glass">
              <div className="cal-head">
                <h4>{MONTHS[view.getMonth()]} <span className="steel">{view.getFullYear()}</span></h4>
                <div className="rail-ctrl">
                  <button onClick={() => shift(-1)} disabled={!canPrev} style={{ opacity: canPrev ? 1 : 0.3 }} aria-label="Previous month"><Icon name="arrowL" /></button>
                  <button onClick={() => shift(1)} aria-label="Next month"><Icon name="arrow" /></button>
                </div>
              </div>
              <div className="cal-grid sel-swap" key={view.getMonth()}>
                {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((d) => <span key={d} className="dow">{d}</span>)}
                {days.map((x, i) => x ? (
                  <button key={x.key} className={`cal-day ${x.today ? 'today' : ''} ${date === x.key ? 'is-active' : ''}`} disabled={x.disabled} onClick={() => setDate(x.key)} aria-pressed={date === x.key} aria-label={x.d.toDateString()}>
                    {x.d.getDate()}
                  </button>
                ) : <span key={'e' + i} />)}
              </div>
            </div>
          </div>

          <div className="step-block">
            <div className="sb-head"><span>04</span><h3>Available slots</h3></div>
            {!date ? <p className="slot-hint">Select a date to see available times.</p> : !slots ? <p className="slot-hint">Checking availability…</p> : (
              <div className="slots" key={date}>
                {slots.map((s, i) => <button key={s.time} className={`slot ${slot === s.time ? 'is-active' : ''}`} style={{ '--i': i }} disabled={!s.available} onClick={() => setSlot(s.time)}>{s.time}</button>)}
              </div>
            )}
          </div>

          <div className="step-block" style={{ borderBottom: 0 }}>
            <div className="sb-head"><span>05</span><h3>A little context</h3></div>
            <div className="stack-16">
              <div className="field">
                <select id="mp" value={purpose} onChange={(e) => setPurpose(e.target.value)}>
                  <option value="">Select a purpose</option>
                  {['Review my portfolio', 'Plan for a goal', 'New investment', 'Tax & structuring', 'Account or service query', 'Something else'].map((p) => <option key={p}>{p}</option>)}
                </select>
                <label htmlFor="mp">Purpose of meeting</label>
              </div>
              <div className="field"><textarea id="mn" placeholder=" " value={notes} onChange={(e) => setNotes(e.target.value)} /><label htmlFor="mn">Notes (optional)</label></div>
            </div>
          </div>
        </div>

        <aside data-enter style={{ '--d': 0.7 }}>
          <div className="meet-summary glass sheen">
            <span className="label">Your appointment</span>
            <h3 className="h3" style={{ marginTop: 10 }}>{type}</h3>
            <dl>
              <div><dt>Mode</dt><dd>{mode}</dd></div>
              <div><dt>Date</dt><dd>{pretty}</dd></div>
              <div><dt>Time</dt><dd>{slot ? `${slot} IST` : '—'}</dd></div>
              <div><dt>Duration</dt><dd>45 minutes</dd></div>
            </dl>
            <div className="rm-card" style={{ marginBottom: 20 }}>
              <Ph src={cat?.people.priya} />
              <div><span className="label">With</span><b style={{ display: 'block', fontWeight: 500 }}>Priya Natarajan</b><small className="muted">Senior Relationship Director</small></div>
            </div>
            {status.error && <p className="coral" style={{ fontSize: 14, marginBottom: 12 }}>{status.error}</p>}
            <button className="btn btn-primary btn-lg btn-block magnetic" disabled={!date || !slot || status.sending} onClick={confirm}>{status.sending ? 'Confirming…' : 'Confirm Appointment'} <Arrow /></button>
            <p className="label" style={{ textAlign: 'center', marginTop: 14 }}>Free · Reschedule any time</p>
          </div>
        </aside>
      </section>
    </>
  );
}
