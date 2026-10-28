import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../lib/auth.jsx';
import { Eyebrow, Arrow } from '../components/ui.jsx';

export default function Login() {
  const { login } = useAuth();
  const [params] = useSearchParams();
  const nav = useNavigate();
  const organizer = params.get('role') === 'organizer';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const submit = async (event) => {
    event.preventDefault(); setBusy(true); setError('');
    try {
      const user = await login(email, password);
      if (organizer && user.role !== 'organizer') { setError('This area requires an organizer account. Use the organizer demo below.'); return; }
      const next = params.get('next');
      nav(next?.startsWith('/') && !next.startsWith('//') && !next.startsWith('/login') ? next : '/', { replace: true });
    } catch (err) { setError(err.message); } finally { setBusy(false); }
  };
  return <section className="container workspace-page"><div className="auth-card glass stack-24">
    <Eyebrow>Aionion access</Eyebrow><h1 className="h2">Welcome<br /><strong>to your next chapter.</strong></h1>
    <p className="muted">Sign in to manage your tickets{organizer ? ' and events' : ''}. Public events also support guest checkout.</p>
    <form className="stack-16" onSubmit={submit}>
      <div className="field"><input id="login-email" type="email" placeholder=" " required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} /><label htmlFor="login-email">Email</label></div>
      <div className="field"><input id="login-password" type="password" minLength={6} placeholder=" " required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} /><label htmlFor="login-password">Password</label></div>
      {error && <p role="alert" className="coral">{error}</p>}
      <button className="btn btn-primary btn-lg btn-block" disabled={busy}>{busy ? 'Signing in…' : 'Continue'} <Arrow /></button>
    </form>
    <div className="demo-note"><b>Demo access</b><p>This preview uses simulated sign-in. Choose an account and enter any password with at least six characters.</p><div className="row wrap"><button className="chip" onClick={() => { setEmail('arjun.raman@example.com'); setPassword('demo123'); }}>Member demo</button><button className="chip" onClick={() => { setEmail('organizer@aionion.com'); setPassword('demo123'); }}>Organizer demo</button></div></div>
    <Link className="link-u" to="/explore">Continue discovering events <Arrow /></Link>
  </div></section>;
}
