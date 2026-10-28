import { Fragment, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../components/Icon.jsx';
import { Eyebrow, Arrow } from '../components/ui.jsx';
import { PAGES } from '../content/pages.js';
import { POLICY, POLICY_PAGES } from '../content/legal.js';
import NotFound from './NotFound.jsx';
import BannerArt from '../components/BannerArt.jsx';

const TITLES = { ...Object.fromEntries(POLICY_PAGES), help: 'Help Centre', contact: 'Contact', about: 'About', organizers: 'For Organizers' };

/* Phrases that become links when they appear in copy */
const LINKS = [
  ['Cancellation Policy', '/cancellation-policy'], ['Refund & Return Policy', '/refund-policy'], ['Privacy Policy', '/privacy'],
  ['Terms of Use', '/terms'], ['Investment Disclaimer', '/disclaimer'], ['My Tickets', '/tickets'], ['Book a Client Meeting', '/meetings'],
  ['book a meeting', '/meetings'], ['Create Event', '/organizer/events/new'], ['QR Check-In', '/checkin'], ['Private Events', '/private']
];
const LINK_RE = new RegExp(`(\\*\\*[^*]+\\*\\*|\\[[^\\]]+\\]|${LINKS.map(([t]) => t.replace(/[.*+?^${}()|[\]\\&]/g, '\\$&')).join('|')})`, 'g');

/** Inline formatting: **bold**, [placeholder] markers and policy auto-links. */
function Text({ children }) {
  const { pathname } = useLocation();
  const parts = String(children).split(LINK_RE);
  return parts.map((p, i) => {
    if (!p) return null;
    if (p.startsWith('**')) return <strong key={i}>{p.slice(2, -2)}</strong>;
    if (p.startsWith('[') && p.endsWith(']')) return <mark key={i} className="tbc" title="Placeholder: replace with the registered details before launch">{p}</mark>;
    const link = LINKS.find(([t]) => t === p);
    if (link && link[1] !== pathname) return <Link key={i} to={link[1]}>{p}</Link>;
    return <Fragment key={i}>{p}</Fragment>;
  });
}

function Block({ b }) {
  if (typeof b === 'string') return <p><Text>{b}</Text></p>;
  if (b.ul) return <ul className="doc-list">{b.ul.map((x, i) => <li key={i}><Text>{x}</Text></li>)}</ul>;
  if (b.note) return <p className="doc-note"><Icon name="info" className="icon" /><span><Text>{b.note}</Text></span></p>;
  if (b.steps) return (
    <ol className="doc-steps">
      {b.steps.map(([t, d], i) => <li key={t}><span>{String(i + 1).padStart(2, '0')}</span><div><b>{t}</b><p><Text>{d}</Text></p></div></li>)}
    </ol>
  );
  if (b.table) return (
    <div className="doc-table-wrap">
      <table className="doc-table">
        <thead><tr>{b.table.head.map((h) => <th key={h} scope="col">{h}</th>)}</tr></thead>
        <tbody>{b.table.rows.map((r, i) => <tr key={i}>{r.map((c, j) => j === 0 ? <th key={j} scope="row"><Text>{c}</Text></th> : <td key={j} data-label={b.table.head[j]}><Text>{c}</Text></td>)}</tr>)}</tbody>
      </table>
    </div>
  );
  if (b.faq) return (
    <div className="doc-faq">
      {b.faq.map(([q, a]) => <details key={q}><summary>{q}<i aria-hidden="true" /></summary><p><Text>{a}</Text></p></details>)}
    </div>
  );
  if (b.contacts) return (
    <dl className="doc-contacts">
      {b.contacts.map(([k, v, href]) => <div key={k}><dt>{k}</dt><dd>{href && !/^\[/.test(v) ? <a href={href}>{v}</a> : <Text>{v}</Text>}</dd></div>)}
    </dl>
  );
  return null;
}

export default function Information({ page }) {
  const doc = PAGES[page];
  const [active, setActive] = useState(doc?.sections[0]?.id);

  useEffect(() => {
    if (!doc) return;
    document.title = `${TITLES[page] || doc.title} — Aionion Events`;
    const io = new IntersectionObserver((en) => en.forEach((x) => x.isIntersecting && setActive(x.target.id)), { rootMargin: '-30% 0px -60% 0px' });
    doc.sections.forEach((s) => { const el = document.getElementById(s.id); if (el) io.observe(el); });
    return () => io.disconnect();
  }, [doc, page]);

  if (!doc) return <NotFound />;
  const legal = doc.kind === 'legal';

  return (
    <section className="container doc-page print-area">
      <header className={`doc-head ${legal ? '' : 'animated-doc-banner'}`}>
        <div className="crumbs" data-enter style={{ '--d': 0.05 }}><Link to="/">Home</Link><span>/</span><span>{doc.eyebrow}</span></div>
        <div data-enter style={{ '--d': 0.15 }}><Eyebrow>{doc.eyebrow}</Eyebrow></div>
        <h1 className="h1" data-enter style={{ '--d': 0.25 }}>{doc.title}</h1>
        <p className="lead" data-enter style={{ '--d': 0.35 }}><Text>{doc.intro}</Text></p>
        {!legal && <BannerArt variant={['organizers','contact','help'].includes(page) ? page : 'about'} />}
        {legal && (
          <div className="doc-meta" data-enter style={{ '--d': 0.45 }}>
            <span><Icon name="calendar" className="icon" />Last updated {POLICY.lastUpdated}</span>
            <button className="link-u" onClick={() => window.print()}><Icon name="download" />Print or save as PDF</button>
          </div>
        )}
      </header>

      {doc.glance && (
        <div className="doc-glance" data-enter style={{ '--d': 0.5 }}>
          {legal && <span className="label">At a glance</span>}
          <div className="glance-grid">
            {doc.glance.map(([ic, t, d]) => <div key={t} className="glance glass"><Icon name={ic} /><b>{t}</b><p>{d}</p></div>)}
          </div>
        </div>
      )}

      <div className="doc-layout">
        {doc.sections.length > 2 && (
          <nav className="doc-toc" aria-label="On this page">
            <details open={typeof window === 'undefined' || window.matchMedia('(min-width: 1081px)').matches}>
              <summary className="label">On this page</summary>
              <ol>{doc.sections.map((s) => <li key={s.id}><a href={`#${s.id}`} className={active === s.id ? 'is-active' : ''} aria-current={active === s.id ? 'location' : undefined}>{s.heading.replace(/^\d+\.\s*/, '')}</a></li>)}</ol>
            </details>
          </nav>
        )}

        <article className={`doc-body ${doc.kind}`}>
          {doc.sections.map((s) => (
            <section key={s.id} id={s.id} className="doc-section">
              <h2>{s.heading}</h2>
              {s.blocks.map((b, i) => <Block key={i} b={b} />)}
            </section>
          ))}

          {doc.cta && (
            <div className="doc-cta glass">
              <div><b>Ready when you are.</b><p className="muted">Questions? Our team replies within one working day.</p></div>
              <div className="row wrap">
                <Link className="btn btn-primary" to={doc.cta[1]}>{doc.cta[0]} <Arrow /></Link>
                <Link className="btn btn-ghost" to="/contact">Contact us</Link>
              </div>
            </div>
          )}

          {doc.related && (
            <div className="doc-related">
              <span className="label">Related</span>
              <div className="related-grid">
                {doc.related.map((r) => <Link key={r} to={`/${r}`} className="related"><span>{TITLES[r]}</span><Icon name="arrow" className="icon" /></Link>)}
              </div>
            </div>
          )}
        </article>
      </div>
    </section>
  );
}
