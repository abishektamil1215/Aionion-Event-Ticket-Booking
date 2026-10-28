import { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { api, download, useApi } from '../lib/api.js';
import { useAuth } from '../lib/auth.jsx';
import { useCatalog } from '../App.jsx';
import { BarChart, AreaChart as LineChart } from '../components/Charts.jsx';
import { Eyebrow, Loading, useToast } from '../components/ui.jsx';
import { inr, shortDate } from '../lib/format.js';

const NAV = [['', 'Overview'], ['events', 'Events'], ['bookings', 'Bookings'], ['attendees', 'Attendees'], ['checkin', 'Check-In'], ['revenue', 'Revenue'], ['payments', 'Payments'], ['promotions', 'Promotions'], ['reports', 'Reports'], ['settings', 'Settings']];
export default function Organizer() {
  const loc = useLocation();
  const section = loc.pathname.split('/')[2] || '';
  const { data, error, loading, reload } = useApi('/organizer/overview');
  const toast = useToast();
  const report = async () => { try { await download('/organizer/report.csv', 'aionion-report.csv'); } catch (err) { toast(err.message, 'error'); } };
  return <section className="container workspace-page"><div className="organizer-shell">
    <aside className="organizer-nav glass"><span className="label">Organizer workspace</span><nav aria-label="Organizer">{NAV.map(([key, label]) => <NavLink key={key} end={key === ''} to={key === 'checkin' ? '/checkin' : `/organizer${key ? `/${key}` : ''}`}>{label}</NavLink>)}</nav></aside>
    <div className="organizer-content stack-24"><div className="workspace-heading"><div><Eyebrow>Aionion organizer</Eyebrow><h1 className="h2">{section === 'events' && loc.pathname.endsWith('/new') ? 'Create an event' : NAV.find(([key]) => key === section)?.[1] || 'Overview'}</h1></div><Link className="btn btn-primary" to="/organizer/events/new">Create Event</Link></div>
      <p className="demo-note">Preview workspace · payments, revenue and registrations include sample data.</p>
      {error ? <div role="alert"><p className="coral">{error.message}</p><button className="btn btn-ghost" onClick={reload}>Try again</button></div> : loading ? <Loading /> : data && <>
        {section === 'events' && loc.pathname.endsWith('/new') ? <CreateEvent onCreated={reload} /> :
        section === 'events' ? <EventTable events={data.events} /> :
        section === 'attendees' || section === 'bookings' ? <Attendees events={data.events} bookings={section === 'bookings'} /> :
        section === 'promotions' ? <Promotions /> :
        section === 'settings' ? <Settings /> :
        section === 'reports' ? <div className="glass info-block stack-16"><h2 className="h3">Your event data, ready to use.</h2><p className="muted">Download booking, attendee, payment and check-in details as CSV.</p><button className="btn btn-primary" onClick={report}>Export report</button></div> : <>
          <div className="metric-grid">{[['Total revenue', inr(data.metrics.revenue)], ['Tickets sold', data.metrics.ticketsSold], ['Total bookings', data.metrics.bookings], ['Checked in', data.metrics.checkedIn]].map(([label, value]) => <div className="glass metric" key={label}><span className="label">{label}</span><strong>{value}</strong></div>)}</div>
          {section !== 'payments' && <div className="analytics-grid"><div className="glass info-block"><h2 className="h3">Ticket sales · 30 days</h2><BarChart data={data.trend} valueKey="tickets" label="tickets" /></div><div className="glass info-block"><h2 className="h3">Revenue · 30 days</h2><LineChart data={data.trend} valueKey="revenue" valueFmt={inr} label="revenue" /></div></div>}
          <div className="glass info-block"><h2 className="h3">Payment status</h2><div className="payment-status-grid">{Object.entries(data.payments).map(([key, value]) => <div key={key}><span className="tag">{key}</span><strong>{value}</strong></div>)}</div></div>
          <EventTable events={data.events} />
          <button className="btn btn-ghost" onClick={report}>Export data</button>
        </>}
      </>}
    </div>
  </div></section>;
}
function EventTable({ events }) {
  return <div className="table-wrap glass"><table className="workspace-table"><caption>Event performance</caption><thead><tr><th>Event</th><th>Date</th><th>Status</th><th>Sold</th><th>Revenue</th><th>Check-in</th></tr></thead><tbody>{events.map((e) => <tr key={e.id}><td>{e.title}<small>{e.city}</small></td><td>{shortDate(e.date)}</td><td><span className="tag">{e.status}</span></td><td>{e.sold} / {e.capacity}</td><td>{inr(e.revenue)}</td><td>{e.checkedIn}</td></tr>)}</tbody></table></div>;
}
function Attendees({ events, bookings }) {
  const [q, setQ] = useState('');
  const [eventId, setEventId] = useState('');
  const [payment, setPayment] = useState('all');
  const [checkin, setCheckin] = useState('all');
  const [page, setPage] = useState(1);
  const { data, error, loading } = useApi(`/organizer/${bookings ? 'bookings' : 'attendees'}?${new URLSearchParams({ q, eventId, payment, checkin, page })}`);
  return <div className="stack-16"><div className="workspace-filters"><input className="control" aria-label="Search bookings or attendees" placeholder="Search name, email or booking ID" value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} /><select className="control" aria-label="Filter event" value={eventId} onChange={(e) => { setEventId(e.target.value); setPage(1); }}><option value="">All events</option>{events.map((e) => <option key={e.id} value={e.id}>{e.title}</option>)}</select><select className="control" aria-label="Payment status" value={payment} onChange={(e) => { setPayment(e.target.value); setPage(1); }}>{['all','paid','free','pending','refunded'].map((s) => <option key={s} value={s}>{s === 'all' ? 'All payments' : s}</option>)}</select><select className="control" aria-label="Check-in status" value={checkin} onChange={(e) => { setCheckin(e.target.value); setPage(1); }}><option value="all">All guests</option><option value="in">Checked in</option><option value="out">Not checked in</option></select></div>
    {error && <p className="coral" role="alert">{error.message}</p>}
    <p className="muted" role="status">{loading ? 'Loading…' : `${data?.total || 0} ${bookings ? 'bookings' : 'ticket records'}`}</p>
    <div className="table-wrap glass"><table className="workspace-table"><thead><tr><th>Attendee</th><th>Booking ID</th><th>Event</th><th>Ticket</th><th>Payment</th><th>Check-in</th></tr></thead><tbody>{data?.rows.map((r) => <tr key={r.ticketId || r.bookingId}><td>{r.name}<small>{r.email}</small></td><td>{r.bookingId}</td><td>{r.event}</td><td>{r.tier}{bookings && <small>{r.qty} seats · {inr(r.total)}</small>}</td><td>{r.payment}</td><td>{r.status === 'cancelled' ? 'Cancelled' : bookings ? `${r.checkedIn} / ${r.qty}` : r.checkedIn ? 'Checked in' : 'Awaiting'}</td></tr>)}</tbody></table>{!loading && !data?.rows.length && <p className="info-block muted">No records match these filters.</p>}</div>
    <div className="row"><button className="btn btn-ghost" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Previous</button><span>{page} / {data?.pages || 1}</span><button className="btn btn-ghost" disabled={!data || page >= data.pages} onClick={() => setPage((p) => p + 1)}>Next</button></div>
  </div>;
}
function CreateEvent({ onCreated }) {
  const cat = useCatalog();
  const [form, setForm] = useState({ title: '', category: 'investor-meets', date: '', time: '17:00', end: '19:00', city: 'Chennai', venue: '', price: 750, capacity: 100, description: '', visibility: 'Public', format: 'In-person' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [created, setCreated] = useState(null);
  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });
  const submit = async (e) => { e.preventDefault(); setBusy(true); setError(''); try { setCreated(await api.post('/organizer/events', form)); onCreated(); } catch (err) { setError(err.message); } finally { setBusy(false); } };
  if (created) return <div className="glass info-block stack-16"><span className="tag">In review</span><h2 className="h3">{created.title}</h2><p className="muted">Your event has been submitted for review. It will appear publicly after approval.</p><Link className="btn btn-primary" to="/organizer/events">View your events</Link></div>;
  return <form className="glass info-block stack-24" onSubmit={submit}><div className="form-grid">{[['title','Event title','text'],['date','Date','date'],['time','Start time','time'],['end','End time','time'],['city','City','text'],['venue','Venue','text'],['price','Starting price (₹)','number'],['capacity','Capacity','number']].map(([key,label,type]) => <label className="stack-8" key={key}><span className="label">{label}</span><input className="control" type={type} required min={key === 'price' ? 0 : key === 'capacity' ? 1 : undefined} value={form[key]} onChange={set(key)} /></label>)}<label className="stack-8"><span className="label">Category</span><select className="control" value={form.category} onChange={set('category')}>{cat?.categories.map((c) => <option value={c.key} key={c.key}>{c.name}</option>)}</select></label><label className="stack-8"><span className="label">Visibility</span><select className="control" value={form.visibility} onChange={set('visibility')}><option>Public</option><option>Private</option></select></label></div><label className="stack-8"><span className="label">Description</span><textarea className="control" rows={5} value={form.description} onChange={set('description')} required /></label>{error && <p className="coral" role="alert">{error}</p>}<button className="btn btn-primary" disabled={busy}>{busy ? 'Submitting…' : 'Submit for review'}</button></form>;
}
function Promotions() {
  const { data, error, reload } = useApi('/organizer/promotions');
  const [form, setForm] = useState({ code: '', percent: 10, limit: 100, note: '' });
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const submit = async (e) => { e.preventDefault(); setBusy(true); setMessage(''); try { await api.post('/organizer/promotions', form); setForm({ code: '', percent: 10, limit: 100, note: '' }); reload(); } catch (err) { setMessage(err.message); } finally { setBusy(false); } };
  const toggle = async (p) => { try { await api.patch(`/organizer/promotions/${p.code}`, { active: !p.active }); reload(); } catch (err) { setMessage(err.message); } };
  return <div className="stack-24"><form className="glass info-block stack-16" onSubmit={submit}><h2 className="h3">Create a promotion</h2><div className="form-grid">{[['code','Code'],['percent','Discount %'],['limit','Usage limit']].map(([key,label]) => <label className="stack-8" key={key}><span className="label">{label}</span><input className="control" required type={key === 'code' ? 'text' : 'number'} min={1} max={key === 'percent' ? 100 : undefined} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} /></label>)}</div><button className="btn btn-primary" disabled={busy}>Create promotion</button></form>{(message || error) && <p className="coral" role="alert">{message || error.message}</p>}<div className="table-wrap glass"><table className="workspace-table"><thead><tr><th>Code</th><th>Discount</th><th>Used</th><th>Status</th></tr></thead><tbody>{data?.map((p) => <tr key={p.code}><td>{p.code}</td><td>{p.percent}%</td><td>{p.uses} / {p.limit}</td><td><button className="chip" aria-pressed={p.active} onClick={() => toggle(p)}>{p.active ? 'Active · disable' : 'Inactive · enable'}</button></td></tr>)}</tbody></table></div></div>;
}
function Settings() {
  const { user } = useAuth();
  return <div className="glass info-block stack-16"><h2 className="h3">Workspace account</h2><p>{user.name}<br /><span className="muted">{user.email}</span></p><Link className="btn btn-ghost" to="/profile">Manage profile</Link><p className="muted">Payment processing and email delivery are simulated in this preview.</p></div>;
}
