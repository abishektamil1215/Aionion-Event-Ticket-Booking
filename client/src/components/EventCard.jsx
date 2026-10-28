import { Link } from 'react-router-dom';
import { Ph, Arrow } from './ui.jsx';
import { shortDate, time, inr, isLow } from '../lib/format.js';

export function Availability({ e }) {
  const pct = Math.min(100, Math.round((e.attending / e.capacity) * 100));
  const low = isLow(e);
  const label = e.seats <= 0 ? 'Sold out' : low ? `Only ${e.seats} left` : pct > 60 ? 'Filling fast' : 'Available';
  return (
    <span className={`avail ${low || e.seats <= 0 ? 'low' : pct > 60 ? 'mid' : ''}`} title={`${e.seats} of ${e.capacity} seats available`}>
      <i style={{ '--p': `${pct}%` }} />{label}
    </span>
  );
}

/** Event card. `size="lg"` is the Featured Experiences treatment. */
export default function EventCard({ e, delay = 0, size }) {
  const to = `/events/${e.id}`;
  return (
    <article className={`ecard reveal ${size === 'lg' ? 'ecard-lg' : ''}`} style={{ '--d': delay }}>
      <Link to={to} className="media" tabIndex={-1} aria-hidden="true">
        <Ph src={e.img} />
        <div className="m-top">
          <span className="tag">{e.label}</span>
          {e.format !== 'In-person' && <span className="tag blue"><i className="pulse" />{e.format}</span>}
        </div>
        {size === 'lg' && <div className="m-bottom"><span className="date-chip"><b>{shortDate(e.date).split(' ')[0]}</b>{shortDate(e.date).split(' ')[1]}</span></div>}
      </Link>
      <div className="body">
        <h3 className="ec-title"><Link to={to}>{e.title}</Link></h3>
        <p className="ec-when">{shortDate(e.date)} • {time(e.date)}</p>
        <p className="ec-where">{e.format === 'Online' ? 'Online · Aionion Live' : e.venue.split(',')[0]}{e.format !== 'Online' && <span> · {e.city}</span>}</p>
        <div className="foot">
          <span className="price">{e.price === 0 ? 'Free' : <><small>From</small> {inr(e.price)}</>}</span>
          <Availability e={e} />
        </div>
        <Link to={to} className="btn btn-ghost btn-sm btn-block ec-cta">View Event <Arrow /></Link>
      </div>
    </article>
  );
}
