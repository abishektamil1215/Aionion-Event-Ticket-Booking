import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useCatalog } from '../App.jsx';
import { api } from '../lib/api.js';
import { Ph, Eyebrow, Arrow } from '../components/ui.jsx';
import Icon from '../components/Icon.jsx';
import { PrivateTeaser } from './Home.jsx';
import BannerArt from '../components/BannerArt.jsx';

const EXPERIENCES = ['Legacy Circle', 'Private Wealth Conversations', 'Investor Roundtable', 'Portfolio Strategy Dinner', 'CEO Conversations', 'Family Wealth Dialogue'];
const BY_ID = { 'legacy-circle': 'Legacy Circle', 'strategy-dinner': 'Portfolio Strategy Dinner', 'investor-roundtable': 'Investor Roundtable' };

export default function Private() {
  const cat = useCatalog();
  const [params] = useSearchParams();
  const [form, setForm] = useState({ name: '', email: '', clientId: '', experience: BY_ID[params.get('event')] || EXPERIENCES[0], note: '' });
  const [state, setState] = useState({ sending: false, done: null, error: '' });
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setState({ sending: true, done: null, error: '' });
    try { const r = await api.post('/access-requests', form); setState({ sending: false, done: r, error: '' }); }
    catch (err) { setState({ sending: false, done: null, error: err.message }); }
  };

  return (
    <div style={{ background: '#08080c' }}>
      <section className="page-head animated-banner animated-banner--private">
        <div className="container">
          <div data-enter style={{ '--d': 0.2 }}><span className="eyebrow no-line" style={{ color: 'var(--champagne)', letterSpacing: '.4em' }}>AIONION PRIVATE</span></div>
          <h1 className="display" data-enter style={{ '--d': 0.4, color: 'var(--ivory)', fontWeight: 400, margin: '26px 0' }}>Private experiences<br />for Aionion clients.</h1>
          <p className="lead" data-enter style={{ '--d': 0.6, margin: '0 0 28px', color: 'rgba(239,233,221,.7)' }}>Curated conversations designed for deeper relationships, strategic thinking and meaningful access.</p>
          <div data-enter style={{ '--d': 0.9 }}><a href="#request" className="btn btn-gold btn-lg">Request Access <Arrow /></a></div>
          <BannerArt variant="private" />
        </div>
      </section>

      <PrivateTeaser cat={cat} full />

      <section className="section private-sec" style={{ background: '#08080c' }}>
        <div className="container">
          <div className="atm-grid">
            <div className="reveal">
              <Eyebrow>The Experiences</Eyebrow>
              <ul style={{ marginTop: 32 }}>
                {EXPERIENCES.map((x, i) => (
                  <li key={x} className="access-row" style={{ gridTemplateColumns: '60px 1fr', padding: '22px 0', borderColor: 'rgba(200,180,140,.12)' }}>
                    <span className="a-idx" style={{ color: 'var(--champagne)' }}>0{i + 1}</span>
                    <span style={{ fontFamily: 'var(--f-display)', fontWeight: 200, fontSize: 'clamp(24px,2.6vw,36px)', letterSpacing: '-.03em', color: 'var(--ivory)' }}>{x}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div id="request" className="glass reveal" style={{ padding: 40, borderColor: 'rgba(200,180,140,.2)', background: 'linear-gradient(160deg, rgba(239,233,221,.06), rgba(239,233,221,.015))', scrollMarginTop: 100 }}>
              {state.done ? (
                <div className="sel-swap" style={{ textAlign: 'center', padding: '40px 0' }}>
                  <span className="tag gold">Request received</span>
                  <h3 className="h2" style={{ color: 'var(--ivory)', margin: '24px 0 16px', fontWeight: 200 }}>Thank you, {state.done.name.split(' ')[0]}.</h3>
                  <p className="muted">Your relationship director will be in touch within two working days regarding <b style={{ color: 'var(--ivory)', fontWeight: 500 }}>{state.done.experience}</b>.</p>
                  <p className="mono steel" style={{ fontSize: 12, marginTop: 24 }}>REF {state.done.id}</p>
                </div>
              ) : (
                <form onSubmit={submit} className="stack-16">
                  <span className="eyebrow" style={{ color: 'var(--champagne)' }}>Request an Invitation</span>
                  <h3 className="h3" style={{ color: 'var(--ivory)', marginBottom: 12 }}>Every invitation is personal.</h3>
                  <div className="field"><input id="pn" placeholder=" " required value={form.name} onChange={set('name')} /><label htmlFor="pn">Full name</label></div>
                  <div className="field"><input id="pe" type="email" placeholder=" " required value={form.email} onChange={set('email')} /><label htmlFor="pe">Email</label></div>
                  <div className="field"><input id="pc" placeholder=" " value={form.clientId} onChange={set('clientId')} /><label htmlFor="pc">Aionion client ID (optional)</label></div>
                  <div className="field"><select id="px" value={form.experience} onChange={set('experience')}>{EXPERIENCES.map((x) => <option key={x}>{x}</option>)}</select><label htmlFor="px">Experience</label></div>
                  <div className="field"><textarea id="pm" placeholder=" " value={form.note} onChange={set('note')} /><label htmlFor="pm">A note for your relationship director</label></div>
                  {state.error && <p className="coral" style={{ fontSize: 14 }}>{state.error}</p>}
                  <button className="btn btn-gold btn-lg btn-block" disabled={state.sending}>{state.sending ? 'Sending…' : 'Request Access'} <Arrow /></button>
                  <p className="row steel" style={{ fontSize: 12.5, justifyContent: 'center' }}><Icon name="lock" className="icon" style={{ width: 14, height: 14 }} />Held in confidence. Never shared.</p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
