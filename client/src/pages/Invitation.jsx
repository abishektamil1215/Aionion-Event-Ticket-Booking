import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api, useApi } from '../lib/api.js';
import { Eyebrow, Loading } from '../components/ui.jsx';
import { longDate, fullTime } from '../lib/format.js';

export default function Invitation() {
  const { code } = useParams();
  const nav = useNavigate();
  const { data, error, loading } = useApi(`/invitations/${encodeURIComponent(code)}`);
  const [email, setEmail] = useState('');
  const [verified, setVerified] = useState(false);
  const [admit, setAdmit] = useState(1);
  const [guestName, setGuestName] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [declined, setDeclined] = useState(false);
  const verify = async (e) => { e.preventDefault(); setBusy(true); setMessage(''); try { await api.post(`/invitations/${encodeURIComponent(code)}/verify`, { email }); setVerified(true); } catch (err) { setMessage(err.message); } finally { setBusy(false); } };
  const rsvp = async (attending) => { setBusy(true); setMessage(''); try { const result = await api.post(`/invitations/${encodeURIComponent(code)}/rsvp`, { email, attending, admit, guestName }); if (result.rsvp?.bookingId) nav(`/confirmation/${result.rsvp.bookingId}`); else setDeclined(true); } catch (err) { setMessage(err.message); } finally { setBusy(false); } };
  if (loading) return <Loading label="Opening your invitation" />;
  if (error || !data) return <section className="container workspace-page"><h1 className="h2">Invitation unavailable.</h1><p className="lead">{error?.message}</p><Link className="btn btn-primary" to="/private">Contact your relationship team</Link></section>;
  return <section className="workspace-page private-sec"><div className="container"><div className="invitation-card stack-24">
    <Eyebrow>Aionion Private · Invitation only</Eyebrow><span className="tag gold">Admit {data.admit}</span>
    <h1 className="h1">{data.event.title}</h1><p className="lead">A personal invitation for {data.guest}, hosted by {data.host}.</p>
    <p>{longDate(data.event.date)} · {fullTime(data.event.date)}<br />{data.event.venue}, {data.event.city}</p>
    {declined ? <p role="status">Your response has been recorded. Thank you for letting us know.</p> : !verified ? <form className="stack-16" onSubmit={verify}><p className="muted">Verify the email on your invitation to respond.</p><div className="field"><input id="invite-email" type="email" placeholder=" " required value={email} onChange={(e) => setEmail(e.target.value)} /><label htmlFor="invite-email">Invited email</label></div><button className="btn btn-gold" disabled={busy}>Verify invitation</button></form> : <div className="stack-16">
      {data.admit > 1 && <label className="row">Guests<select className="control" value={admit} onChange={(e) => setAdmit(Number(e.target.value))}>{Array.from({ length: data.admit }, (_, i) => <option key={i} value={i + 1}>Admit {i + 1}</option>)}</select></label>}
      {admit > 1 && <div className="field"><input id="invite-guest" placeholder=" " value={guestName} onChange={(e) => setGuestName(e.target.value)} /><label htmlFor="invite-guest">Guest name</label></div>}
      <div className="row wrap"><button className="btn btn-gold" disabled={busy || (admit > 1 && !guestName.trim())} onClick={() => rsvp(true)}>Accept invitation</button><button className="btn btn-ghost" disabled={busy} onClick={() => rsvp(false)}>Unable to attend</button></div>
    </div>}
    {message && <p className="coral" role="alert">{message}</p>}
  </div></div></section>;
}
