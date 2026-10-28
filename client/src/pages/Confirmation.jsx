import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api, useApi } from '../lib/api.js';
import { inr } from '../lib/format.js';
import Icon from '../components/Icon.jsx';
import Credential from '../components/Credential.jsx';
import { Loading, useToast } from '../components/ui.jsx';
import { calendarUrl, directionsUrl, shareEvent, downloadTicket } from '../lib/ticketActions.js';
import NotFound from './NotFound.jsx';

export default function Confirmation() {
  const { bookingId } = useParams();
  const toast = useToast();
  const { data: b, loading } = useApi(`/bookings/${bookingId}`);
  const [idx, setIdx] = useState(0);
  const [emailing, setEmailing] = useState(false);
  const emailTicket = async () => { setEmailing(true); try { await api.post(`/bookings/${bookingId}/email`); toast('Email request recorded in this preview. Save your ticket below; email delivery is not connected.'); } catch (err) { toast(err.message, 'error'); } finally { setEmailing(false); } };

  if (loading) return <Loading label="Issuing your credential" />;
  if (!b || !b.event) return <NotFound />;
  const e = b.event;

  return (
    <section className="success">
      <div className="container">
        <div className="pulse-orb" data-enter style={{ '--d': 0 }} />
        <h1 className="display" data-enter style={{ '--d': 0.4 }}>YOU’RE IN.</h1>
        <p className="sub" data-enter style={{ '--d': 0.7 }}>Booking Confirmed · {b.id} · {inr(b.total)}</p>

        <div className="ticket-reveal print-area">
          <Credential booking={b} ticketIndex={idx} />
        </div>

        {b.qty > 1 && (
          <div className="row" style={{ justifyContent: 'center', marginTop: 24 }}>
            {b.tickets.map((t, i) => <button key={t} className={`chip ${i === idx ? 'is-active' : ''}`} onClick={() => setIdx(i)}>Seat {i + 1}</button>)}
          </div>
        )}

        <div className="ticket-actions" data-enter style={{ '--d': 2.2 }}>
          <button className="btn btn-primary" onClick={downloadTicket}><Icon name="download" className="icon" />Download Ticket</button>
          <button className="btn btn-ghost" onClick={emailTicket} disabled={emailing}><Icon name="mail" className="icon" />{emailing ? 'Requesting…' : 'Email Ticket'}</button>
          <a className="btn btn-ghost" href={calendarUrl(e.id)}><Icon name="calendar" className="icon" />Add to Calendar</a>
          <button className="btn btn-ghost" onClick={() => shareEvent(e, toast)}><Icon name="share" className="icon" />Share Event</button>
          {e.format !== 'Online' && <a className="btn btn-ghost" href={directionsUrl(e)} target="_blank" rel="noreferrer"><Icon name="directions" className="icon" />Get Directions</a>}
        </div>

        <div className="next-steps">
          {[
            ['01', 'Save your pass', `Your ticket is issued to ${b.attendee?.email}. Download it now for easy access at the venue.`],
            ['02', 'Prepare for the session', 'Review the agenda, venue details and entry requirements before the event.'],
            ['03', 'Arrive and scan', 'Show the QR at the entrance — no printout required.']
          ].map(([n, t, p], i) => <div key={n} className="glass reveal" style={{ '--d': i * 0.08 }}><span>{n}</span><b>{t}</b><p>{p}</p></div>)}
        </div>

        <div className="row" style={{ justifyContent: 'center', marginTop: 56 }}>
          <Link to="/tickets" className="link-u">Go to My Tickets <Icon name="arrow" /></Link>
          <span className="steel">·</span>
          <Link to="/explore" className="link-u">Explore more events <Icon name="arrow" /></Link>
        </div>
      </div>
    </section>
  );
}

