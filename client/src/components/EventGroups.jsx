import { Link } from 'react-router-dom';
import { EVENT_GROUPS } from '../content/eventGroups.js';

export default function EventGroups() {
  return <section className="section tight" aria-label="Ways to participate">
    <div className="container event-groups">
      {EVENT_GROUPS.map(({ name, items }) => <div className="event-group glass" key={name}>
        <h2 className="h2">{name}</h2>
        <ul>{items.map(([label, to]) => <li key={label}><Link to={to}>{label}<span aria-hidden="true">↗</span></Link></li>)}</ul>
      </div>)}
    </div>
  </section>;
}
