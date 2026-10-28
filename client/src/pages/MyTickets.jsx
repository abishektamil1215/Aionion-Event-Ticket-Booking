import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, useApi } from '../lib/api.js';
import { longDate, time } from '../lib/format.js';
import Icon from '../components/Icon.jsx';
import QR, { ticketPayload } from '../components/QR.jsx';
import Credential from '../components/Credential.jsx';
import { Ph, Eyebrow, Arrow, Loading, useToast } from '../components/ui.jsx';
import { calendarUrl, directionsUrl, downloadTicket } from '../lib/ticketActions.js';

const TABS = [['upcoming', 'Upcoming'], ['past', 'Past'], ['cancelled', 'Cancelled']];

export default function MyTickets() {
  const toast = useToast();
  const { data: profile } = useApi('/profile');
  const [bookings, setBookings] = useState(null);
  const [tab, setTab] = useState('upcoming');
  const [open, setOpen] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => { api.get('/bookings').then(setBookings).catch((err) => setError(err.message)); }, []);
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setOpen(null);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  if (error) return <section className="container workspace-page"><h1 className="h2">Tickets unavailable</h1><p className="coral" role="alert">{error}</p><button className="btn btn-primary" onClick={() => window.location.reload()}>Try again</button></section>;
  if (!bookings) return <Loading label="Opening your passes" />;

  const list = bookings.filter((b) => b.status === tab && b.event);
  const count = (s) => bookings.filter((b) => b.status === s).length;
  const cancel = async (b) => {
    try {
      const terms = await api.get(`/bookings/${b.id}/cancel-preview`);
      if (!terms.allowed) { toast(terms.reason, 'error'); return; }
      const msg = terms.refund
        ? `Cancel your booking for ${b.event.title}?\n\nRefund: ₹${terms.refund.toLocaleString('en-IN')} (${terms.percent}% of the ticket amount), credited to your original payment method within 5–7 working days.\nNon-refundable: ₹${terms.nonRefundable.toLocaleString('en-IN')} (convenience fee, GST${terms.percent < 100 ? ' and the cancellation deduction' : ''}).`
        : `Cancel your booking for ${b.event.title}? Your seat will be released. ${terms.note || ''}`;
      if (!window.confirm(msg)) return;
      const upd = await api.post(`/bookings/${b.id}/cancel`);
      setBookings((all) => all.map((x) => (x.id === b.id ? upd : x)));
      toast(upd.refund ? `Booking cancelled. Refund of ₹${upd.refund.amount.toLocaleString('en-IN')} initiated.` : 'Booking cancelled. Your seat has been released.');
    } catch (err) { toast(err.message, 'error'); }
  };

  return (
    <section className="container" style={{ paddingTop: 'calc(var(--header-h) + 90px)', paddingBottom: 140 }}>
      <div className="dash-head">
        <div>
          <div data-enter style={{ '--d': 0.1 }}><Eyebrow>{profile?.tier || 'Member'} · {profile?.clientId}</Eyebrow></div>
          <h1 className="h1" data-enter style={{ '--d': 0.25, marginTop: 22 }}>Welcome back,<br /><strong>{profile?.first || 'Arjun'}.</strong></h1>
        </div>
        <div className="tabs" role="tablist" data-enter style={{ '--d': 0.4 }}>
          {TABS.map(([k, l]) => <button key={k} role="tab" aria-selected={tab === k} className={tab === k ? 'is-active' : ''} onClick={() => setTab(k)}>{l}<sup>{count(k)}</sup></button>)}
        </div>
      </div>

      <div className="member-strip glass" data-enter style={{ '--d': 0.5 }}>
        <div><span className="label">Upcoming</span><b>{String(count('upcoming')).padStart(2, '0')}</b></div>
        <div><span className="label">Attended</span><b>{String(count('past')).padStart(2, '0')}</b></div>
        <div><span className="label">Experts met</span><b>{String(profile?.stats.experts ?? 0).padStart(2, '0')}</b></div>
        <div><span className="label">Member since</span><b>{profile?.memberSince}</b></div>
      </div>

      {list.length === 0 ? (
        <div className="empty">
          <h3 className="h3">{tab === 'upcoming' ? 'No upcoming passes.' : tab === 'past' ? 'No past experiences yet.' : 'No cancellations.'}</h3>
          <p style={{ marginBottom: 24 }}>Your next conversation is a click away.</p>
          <Link to="/explore" className="btn btn-primary">Explore Events <Arrow /></Link>
        </div>
      ) : (
        <div className="pass-list">
          {list.map((b, i) => {
            const e = b.event;
            return (
              <article key={b.id} className={`pass reveal ${b.status === 'past' ? 'past' : ''} ${b.status === 'cancelled' ? 'cancelled' : ''}`} style={{ '--d': i * 0.08 }}>
                <div className="p-img"><Ph src={e.img} /></div>
                <div className="p-body">
                  <div>
                    <div className="row wrap" style={{ gap: 10 }}>
                      <span className={`status ${b.status === 'past' ? 'past' : b.status === 'cancelled' ? 'cancel' : ''}`}><i />{b.status === 'upcoming' ? 'Confirmed' : b.status === 'past' ? 'Attended' : 'Cancelled'}</span>
                      <span className="tag">{b.tierName}</span>
                      {b.qty > 1 && <span className="tag">{b.qty} seats</span>}
                    </div>
                    <h3>{e.title}</h3>
                  </div>
                  <div className="p-meta">
                    <div><span className="label">Date</span><b>{longDate(e.date)}</b></div>
                    <div><span className="label">Time</span><b>{time(e.date)}</b></div>
                    <div><span className="label">Venue</span><b>{e.venue}, {e.city}</b></div>
                  </div>
                  {b.status === 'upcoming' && (
                    <div className="p-actions">
                      <button className="btn-mini" onClick={() => setOpen(b)}><Icon name="ticket" />View</button>
                      <button className="btn-mini" onClick={() => { setOpen(b); setTimeout(downloadTicket, 400); }}><Icon name="download" />Download</button>
                      <a className="btn-mini" href={calendarUrl(e.id)}><Icon name="calendar" />Calendar</a>
                      {e.format !== 'Online' && <a className="btn-mini" href={directionsUrl(e)} target="_blank" rel="noreferrer"><Icon name="directions" />Directions</a>}
                      <button className="btn-mini" onClick={() => cancel(b)} style={{ marginLeft: 'auto' }}>Cancel</button>
                    </div>
                  )}
                  {b.status === 'past' && <div className="p-actions"><Link to="/explore" className="btn-mini">Find similar <Icon name="arrow" /></Link></div>}
                </div>
                <div className="p-qr">
                  <button className="qr" aria-label={`Show QR ticket for ${e.title}`} disabled={b.status !== 'upcoming'} onClick={() => setOpen(b)} style={{ opacity: b.status === 'upcoming' ? 1 : 0.35 }}><QR value={ticketPayload(b.id, b.tickets[0])} /></button>
                  <div style={{ textAlign: 'center' }}><small>BOOKING {b.id}</small></div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <div className={`modal wide ${open ? 'open' : ''}`} onClick={(ev) => ev.target === ev.currentTarget && setOpen(null)} role="dialog" aria-modal="true" aria-hidden={!open}>
        <div className="m-box glass" style={{ position: 'relative' }}>
          <button className="icon-btn m-close" onClick={() => setOpen(null)} aria-label="Close" style={{ background: 'rgba(2,6,23,.6)' }}><Icon name="close" /></button>
          {open && <div className="print-area"><Credential booking={open} /></div>}
        </div>
      </div>
    </section>
  );
}
