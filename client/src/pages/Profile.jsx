import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCatalog } from '../App.jsx';
import { api } from '../lib/api.js';
import Icon from '../components/Icon.jsx';
import { Ph, Eyebrow, Arrow, Loading, useToast } from '../components/ui.jsx';

const INTERESTS = ['Stocks', 'Mutual Funds', 'Personal Finance', 'Wealth Management', 'Tax Planning', 'Retirement'];
const PREFS = [['reminders', 'Event reminders', 'Email and SMS, 24 hours before'], ['whatsapp', 'WhatsApp updates', 'Tickets and venue changes'], ['newsletter', 'Monday market notes', 'Our weekly research digest'], ['privateInvites', 'Private invitations', 'Aionion Private experiences']];

export default function Profile() {
  const cat = useCatalog();
  const toast = useToast();
  const [p, setP] = useState(null);
  const [edit, setEdit] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { api.get('/profile').then(setP).catch((err) => setError(err.message)); }, []);
  if (error) return <section className="container workspace-page"><h1 className="h2">Profile unavailable</h1><p className="coral" role="alert">{error}</p><Link to="/login" className="btn btn-primary">Sign in again</Link></section>;
  if (!p) return <Loading label="Loading your profile" />;

  const save = async (patch) => {
    const next = { ...p, ...patch };
    setP(next);
    try { await api.put('/profile', patch); } catch (e) { toast(e.message); }
  };
  const field = (k) => ({ value: p[k] || '', onChange: (e) => setP({ ...p, [k]: e.target.value }), placeholder: ' ' });

  return (
    <section className="container" style={{ paddingTop: 'calc(var(--header-h) + 90px)', paddingBottom: 140 }}>
      <div data-enter style={{ '--d': 0.1, marginBottom: 48 }}>
        <Eyebrow>Member Profile</Eyebrow>
        <h1 className="h1" style={{ marginTop: 22 }}>Your access,<br /><strong>in one place.</strong></h1>
      </div>

      <div className="profile-grid">
        <aside className="id-card glass sheen" data-enter style={{ '--d': 0.3 }}>
          <Ph src={cat?.people.a1} className="portrait" />
          <h2>{p.name}</h2>
          <p className="muted" style={{ fontSize: 14 }}>{p.profession} · {p.city}</p>
          <span className="tag gold tier-badge"><Icon name="key" className="icon" style={{ width: 12, height: 12 }} />{p.tier}</span>
          <dl style={{ marginTop: 24 }}>
            <div><dt>Client ID</dt><dd className="mono">{p.clientId}</dd></div>
            <div><dt>Member since</dt><dd>{p.memberSince}</dd></div>
            <div><dt>Investor type</dt><dd>{p.investorType}</dd></div>
            <div><dt>Upcoming</dt><dd>{p.stats.upcoming} events</dd></div>
          </dl>
          <Link to="/tickets" className="btn btn-primary btn-block" style={{ marginTop: 24 }}>My Tickets <Arrow /></Link>
          <Link to="/meetings" className="btn btn-ghost btn-block" style={{ marginTop: 10 }}>Book a meeting</Link>
        </aside>

        <div data-enter style={{ '--d': 0.45 }}>
          <div className="p-section glass">
            <h3>Personal details <button className="btn-mini" onClick={() => { if (edit) { save({ name: p.name, email: p.email, mobile: p.mobile, city: p.city, profession: p.profession }); toast('Profile updated'); } setEdit(!edit); }}>{edit ? 'Save' : 'Edit'}</button></h3>
            <div className="form-grid">
              {[['name', 'Full name'], ['email', 'Email'], ['mobile', 'Mobile'], ['city', 'City'], ['profession', 'Profession']].map(([k, l]) => (
                <div key={k} className={`field ${k === 'name' ? 'full' : ''}`}>
                  <input id={`p-${k}`} {...field(k)} readOnly={!edit} style={{ opacity: edit ? 1 : 0.85 }} />
                  <label htmlFor={`p-${k}`}>{l}</label>
                </div>
              ))}
            </div>
          </div>

          <div className="p-section glass">
            <h3>Investment interests</h3>
            <div className="check-chips">
              {INTERESTS.map((i) => {
                const on = p.interests.includes(i);
                return <label key={i}><input type="checkbox" checked={on} onChange={() => save({ interests: on ? p.interests.filter((x) => x !== i) : [...p.interests, i] })} /><span className="chip">{on && <Icon name="check" />}{i}</span></label>;
              })}
            </div>
          </div>

          <div className="p-section glass">
            <h3>Your Aionion journey</h3>
            <div className="journey">
              {[['ACCESS 01', 'Markets', true], ['ACCESS 02', 'Knowledge', true], ['ACCESS 03', 'Experts', true], ['ACCESS 04', 'Community', p.stats.attended > 0], ['ACCESS 05', 'Private', p.tier === 'Aionion Private']].map(([k, l, done]) => (
                <div key={k} className={done ? 'done' : ''}><span>{k}</span><b>{l}</b></div>
              ))}
            </div>
          </div>

          <div className="p-section glass">
            <h3>Preferences</h3>
            {PREFS.map(([k, l, s]) => (
              <div key={k} className="pref-row">
                <div><span>{l}</span><small>{s}</small></div>
                <button className="toggle" role="switch" aria-checked={!!p.prefs[k]} aria-label={l} onClick={() => save({ prefs: { ...p.prefs, [k]: !p.prefs[k] } })} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
