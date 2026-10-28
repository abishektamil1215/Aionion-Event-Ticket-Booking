import QR, { ticketPayload } from './QR.jsx';
import { longDate, fullTime } from '../lib/format.js';

/* Premium digital pass. Invitation bookings get the private (black & champagne) treatment. */
export default function Credential({ booking, ticketIndex = 0 }) {
  const e = booking.event;
  const tid = booking.tickets[ticketIndex];
  const invite = booking.tier === 'invite' || e.invite;
  const guest = invite && ticketIndex > 0 && booking.attendee?.guest ? booking.attendee.guest : booking.attendee?.name;
  return (
    <div className={`credential ${invite ? 'is-invite' : ''}`}>
      <div className="cr-main">
        <div className="cr-head">
          <span className="brand">AIONION EVENTS</span>
          <span className="admit">{invite ? 'INVITATION ONLY' : booking.qty > 1 ? `ADMIT ${ticketIndex + 1} OF ${booking.qty}` : 'ADMIT ONE'}</span>
        </div>
        <h2>{e.title}</h2>
        <p className="cr-sub">{e.subtitle}</p>
        <div className="cr-meta">
          <div><span className="label">Date</span><b>{longDate(e.date)}</b></div>
          <div><span className="label">Time</span><b>{fullTime(e.date)}</b></div>
          <div><span className="label">Venue</span><b>{e.city === 'Online' ? 'Online' : e.city}</b></div>
          <div><span className="label">Ticket</span><b>{invite ? `Admit ${booking.qty}` : booking.tierName}</b></div>
        </div>
        <div className="cr-attendee">
          <div><span className="label">Attendee</span><b>{guest}</b></div>
          <span className="cr-venue">{e.venue}</span>
        </div>
      </div>
      <div className="cr-stub">
        <span className="cr-notch t" /><span className="cr-notch b" />
        <div className="qr"><QR value={ticketPayload(booking.id, tid)} label={`Entry QR for ticket ${tid}`} /></div>
        <div style={{ width: '100%' }}>
          <div className="ids">
            <div><span>BOOKING ID</span><b>{booking.id}</b></div>
            <div><span>TICKET</span><b>{tid}</b></div>
            <div><span>CATEGORY</span><b>{invite ? 'PRIVATE' : booking.tierName.toUpperCase()}</b></div>
          </div>
          <p className="scan">SCAN AT ENTRY</p>
        </div>
      </div>
    </div>
  );
}
