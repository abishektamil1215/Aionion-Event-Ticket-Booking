import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Icon, { CATEGORY_ICON } from './Icon.jsx';
import { Logo, Arrow, Ph, useToast } from './ui.jsx';
import { api, useApi } from '../lib/api.js';
import { useAuth } from '../lib/auth.jsx';
import { shortDate } from '../lib/format.js';
import { useCatalog } from '../App.jsx';
import { EVENT_GROUPS } from '../content/eventGroups.js';

const NAV = [
  { to: '/', label: 'Discover', match: (p) => p === '/' },
  { to: '/explore', label: 'Events', mega: 'events', match: (p) => p.startsWith('/explore') || p.startsWith('/events') },
  { to: '/categories', label: 'Categories', mega: 'categories', match: (p) => p.startsWith('/categories') },
  { to: '/#cities', label: 'Cities', match: () => false },
  { to: '/organizers', label: 'For Organizers', match: (p) => p.startsWith('/organizers') },
  { to: '/about', label: 'About', match: (p) => p.startsWith('/about') }
];

const QUICK = [
  ['This week', '/explore?quick=week', 'calendar', 'Happening in the next 7 days'],
  ['Free events', '/explore?quick=free', 'ticket', 'Open sessions & community days'],
  ['Online & webinars', '/explore?quick=online', 'broadcast', 'Join live from anywhere'],
  ['Premium experiences', '/explore?quick=premium', 'diamond', 'Workshops & briefings from ₹1,500'],
  ['Near Chennai', '/explore?city=Chennai', 'pin', 'Investor meets in your city']
];

const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);

/** Header behaviour: compact after 12px, hide on scroll-down, reveal on scroll-up, reading progress. */
function useHeaderScroll(ref, pinned) {
  const [state, setState] = useState({ scrolled: false, hidden: false });
  useEffect(() => {
    let last = window.scrollY, raf = 0;
    const tick = () => {
      raf = 0;
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      ref.current?.style.setProperty('--progress', max > 0 ? Math.min(1, y / max).toFixed(4) : 0);
      const delta = y - last;
      setState((s) => {
        const scrolled = y > 12;
        let hidden = s.hidden;
        if (y < 140 || delta < -6) hidden = false;
        else if (delta > 8) hidden = true;
        return scrolled === s.scrolled && hidden === s.hidden ? s : { scrolled, hidden };
      });
      if (Math.abs(delta) > 6 || y < 140) last = y;
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(tick); };
    tick();
    window.addEventListener('scroll', on, { passive: true });
    window.addEventListener('resize', on);
    return () => { window.removeEventListener('scroll', on); window.removeEventListener('resize', on); cancelAnimationFrame(raf); };
  }, [ref]);
  return { scrolled: state.scrolled, hidden: state.hidden && !pinned };
}

export function Header() {
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const [mega, setMega] = useState(null);
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || 'light');
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'light' ? '#ffffff' : '#050816');
    try { localStorage.setItem('aionion-theme', theme); } catch { /* Storage may be unavailable. */ }
  }, [theme]);
  const { user, logout } = useAuth();
  const cat = useCatalog();
  const loc = useLocation();
  const nav = useNavigate();
  const headerRef = useRef(null);
  const navRef = useRef(null);
  const um = useRef(null);
  const megaTimer = useRef();
  const { scrolled, hidden } = useHeaderScroll(headerRef, menu || search || userMenu || !!mega);

  // live upcoming-ticket count for signed-in members (refreshes as you move around)
  const { data: myBookings } = useApi(user ? `/bookings?r=${loc.pathname}` : null);
  const upcoming = user && myBookings ? myBookings.filter((b) => b.status === 'upcoming').length : 0;
  const { data: featured } = useApi(mega === 'events' ? '/events?featured=1&limit=1' : null);
  const next = featured?.[0];

  useEffect(() => {
    if (userMenu) um.current?.querySelector('[role="menuitem"]')?.focus();
  }, [userMenu]);
  useEffect(() => { setMenu(false); setSearch(false); setUserMenu(false); setMega(null); }, [loc.pathname, loc.search]);
  useEffect(() => {
    const onKey = (e) => {
      if ((e.key === '/' || (e.key === 'k' && (e.metaKey || e.ctrlKey))) && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) { e.preventDefault(); setSearch(true); }
      if (e.key === 'Escape') { setSearch(false); setMenu(false); setUserMenu(false); setMega(null); }
    };
    const onClick = (e) => { if (um.current && !um.current.contains(e.target)) setUserMenu(false); };
    window.addEventListener('keydown', onKey);
    document.addEventListener('click', onClick);
    return () => { window.removeEventListener('keydown', onKey); document.removeEventListener('click', onClick); };
  }, []);
  useEffect(() => { document.body.style.overflow = menu ? 'hidden' : ''; }, [menu]);

  /* ---- sliding indicators: hover pill + active underline ---- */
  const [pill, setPill] = useState({ x: 0, w: 0, on: false });
  const [line, setLine] = useState({ x: 0, w: 0, on: false });
  const measure = useCallback((el) => {
    const box = navRef.current?.getBoundingClientRect();
    if (!el || !box) return null;
    const r = el.getBoundingClientRect();
    return { x: r.left - box.left, w: r.width };
  }, []);
  const placeLine = useCallback(() => {
    const active = navRef.current?.querySelector('a.is-active');
    const m = measure(active);
    setLine(m ? { ...m, on: true } : (l) => ({ ...l, on: false }));
  }, [measure]);
  useLayoutEffect(() => { placeLine(); }, [loc.pathname, placeLine]);
  useEffect(() => {
    const ro = new ResizeObserver(placeLine);
    if (navRef.current) ro.observe(navRef.current);
    document.fonts?.ready.then(placeLine);
    return () => ro.disconnect();
  }, [placeLine]);

  const openMega = (key) => { clearTimeout(megaTimer.current); megaTimer.current = setTimeout(() => setMega(key), key ? 110 : 0); };
  const closeMega = () => { clearTimeout(megaTimer.current); megaTimer.current = setTimeout(() => setMega(null), 180); };

  const initials = user ? user.name.split(' ').map((w) => w[0]).filter(Boolean).slice(0, 2).join('').toUpperCase() : '';
  const first = user ? (user.first || user.name.split(' ')[0]) : '';

  return (
    <>
      <header ref={headerRef} className={`site-header ${scrolled ? 'scrolled' : ''} ${hidden ? 'is-hidden' : ''} ${menu ? 'menu-open' : ''} ${mega ? 'mega-open' : ''}`}>
        <div className="bar" onMouseLeave={closeMega}>
          <Logo onClick={() => { setMenu(false); setSearch(false); setUserMenu(false); }} />
          <nav className="nav" aria-label="Primary" ref={navRef}
            onMouseLeave={() => setPill((p) => ({ ...p, on: false }))}>
            <span className={`nav-pill ${pill.on ? 'on' : ''}`} style={{ '--x': `${pill.x}px`, '--w': `${pill.w}px` }} aria-hidden="true" />
            <span className={`nav-line ${line.on ? 'on' : ''}`} style={{ '--x': `${line.x}px`, '--w': `${line.w}px` }} aria-hidden="true" />
            {NAV.map((n) => {
              const active = n.match(loc.pathname);
              const hover = (e) => { const m = measure(e.currentTarget); if (m) setPill({ ...m, on: true }); openMega(n.mega || null); };
              return (
                <span key={n.label} className={`nav-item ${n.mega ? 'has-mega' : ''} ${mega === n.mega && n.mega ? 'is-open' : ''}`}>
                  <Link to={n.to} className={active ? 'is-active' : ''} aria-current={active ? 'page' : undefined} onMouseEnter={hover} onFocus={hover}>
                    {n.label}
                    {n.mega && <svg className="nav-chev" width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="m4 6 4 4 4-4" /></svg>}
                  </Link>
                  {n.mega && (
                    <button className="sr-only mega-toggle" aria-expanded={mega === n.mega} aria-controls={`mega-${n.mega}`} onClick={() => setMega((m) => (m === n.mega ? null : n.mega))}>
                      Show {n.label} menu
                    </button>
                  )}
                </span>
              );
            })}
          </nav>

          <div className="nav-tools" onMouseEnter={closeMega}>
            <button className="search-pill" aria-label="Search events" aria-keyshortcuts="Control+K Meta+K /" onClick={() => setSearch(true)}>
              <Icon name="search" />
              <span className="sp-text">Search events</span>
              <kbd>{isMac ? '⌘K' : 'Ctrl K'}</kbd>
            </button>
            <Link to="/tickets" className="tickets-btn" aria-label={upcoming ? `My Tickets, ${upcoming} upcoming` : 'My Tickets'}>
              <span className="tk-ic"><Icon name="ticket" />{upcoming > 0 && <span className="tk-count" key={upcoming}>{upcoming}</span>}</span>
              <span className="tk-label">My Tickets</span>
            </Link>
            {user ? (
              <div className="user-menu" ref={um} onKeyDown={(e) => {
                if (e.key === 'Escape') { e.stopPropagation(); setUserMenu(false); um.current?.querySelector('.avatar-btn')?.focus(); }
                if (userMenu && ['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(e.key)) {
                  e.preventDefault();
                  const items = [...um.current.querySelectorAll('[role="menuitem"]')];
                  const index = items.indexOf(document.activeElement);
                  const nextI = e.key === 'Home' ? 0 : e.key === 'End' ? items.length - 1 : (index + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length;
                  items[nextI]?.focus();
                }
                if (e.key === 'Tab') setUserMenu(false);
              }}>
                <button id="account-menu-trigger" className="avatar-btn" onClick={() => setUserMenu((v) => !v)} aria-expanded={userMenu} aria-haspopup="menu" aria-controls={userMenu ? 'account-dropdown' : undefined} aria-label={`Account menu for ${user.name}`}>
                  <span className="account-avatar" aria-hidden="true">{initials || <Icon name="user" />}</span>
                  <span className="account-trigger-label">{first}</span>
                  <svg className="account-chevron" width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="m4 6 4 4 4-4" /></svg>
                </button>
                {userMenu && (
                  <div id="account-dropdown" className="dropdown" role="menu" aria-labelledby="account-menu-trigger">
                    <div className="dd-head"><span className="account-profile-symbol" aria-hidden="true">{initials}</span><div className="account-identity"><span className="account-role">{user.role === 'organizer' ? 'Organizer account' : user.tier || 'Member account'}</span><b>{user.name}</b><small>{user.email}</small></div></div>
                    <Link to="/tickets" role="menuitem" style={{ '--i': 0 }}><Icon name="ticket" />My Tickets{upcoming > 0 && <span className="dd-count">{upcoming}</span>}</Link>
                    <Link to="/profile" role="menuitem" style={{ '--i': 1 }}><Icon name="user" />Profile</Link>
                    {user.role === 'organizer' && <><Link to="/organizer" role="menuitem" style={{ '--i': 2 }}><Icon name="grid" />Organizer Dashboard</Link><Link to="/checkin" role="menuitem" style={{ '--i': 3 }}><Icon name="scan" />QR Check-In</Link></>}
                    <button className="account-logout" role="menuitem" style={{ '--i': 4 }} onClick={() => { logout(); setUserMenu(false); nav('/'); }}><Icon name="logout" />Log out</button>
                  </div>
                )}
              </div>
            ) : (
              <Link to={`/login?next=${encodeURIComponent(loc.pathname)}`} className="login-link hide-sm">Log in</Link>
            )}
            <Link to="/organizer/events/new" className="btn btn-primary btn-sm create-btn hide-sm"><Icon name="plus" className="icon" />Create Event</Link>
            <button className={`icon-btn menu-btn ${menu ? 'is-open' : ''}`} aria-label={menu ? 'Close menu' : 'Open menu'} aria-expanded={menu} onClick={() => setMenu((m) => !m)}>
              <span className="burger" aria-hidden="true"><i /><i /><i /></span>
            </button>
          </div>
          <span className="scroll-progress" aria-hidden="true" />

          {/* ---- mega menus (desktop) ---- */}
          <div id="mega-events" className={`mega ${mega === 'events' ? 'open' : ''}`} onMouseEnter={() => openMega('events')} onMouseLeave={closeMega} aria-hidden={mega !== 'events'}>
            <div className="mega-col">
              <span className="label">Browse events</span>
              {QUICK.map(([t, to, ic, d], i) => (
                <Link key={t} to={to} className="mega-link" style={{ '--i': i }} tabIndex={mega === 'events' ? 0 : -1}>
                  <span className="ml-ic"><Icon name={ic} /></span><span><b>{t}</b><small>{d}</small></span>
                </Link>
              ))}
            </div>
            <div className="mega-col">
              <span className="label">Popular formats</span>
              {(cat?.categories || []).filter((c) => ['investor-meets', 'workshops', 'stock-markets', 'networking'].includes(c.key)).map((c, i) => (
                <Link key={c.key} to={`/explore?category=${c.key}`} className="mega-link" style={{ '--i': i + 2 }} tabIndex={mega === 'events' ? 0 : -1}>
                  <span className="ml-ic"><Icon name={CATEGORY_ICON[c.key] || 'sparkle'} /></span><span><b>{c.name}</b><small>{c.count} upcoming</small></span>
                </Link>
              ))}
              <Link to="/explore" className="mega-all" tabIndex={mega === 'events' ? 0 : -1}>View all events <Icon name="arrow" className="icon" /></Link>
            </div>
            <Link to={next ? `/events/${next.id}` : '/explore'} className="mega-feature" tabIndex={mega === 'events' ? 0 : -1}>
              <Ph src={next?.img} className="mf-img" />
              <span className="mf-body">
                <span className="tag coral"><i className="pulse" />Featured</span>
                <b>{next?.title || 'Featured experiences'}</b>
                <small>{next ? `${shortDate(next.date)} · ${next.city} · ${next.price ? `From ₹${next.price.toLocaleString('en-IN')}` : 'Free'}` : 'Hand-picked by the Aionion team'}</small>
              </span>
            </Link>
          </div>

          <div id="mega-categories" className={`mega mega-cats ${mega === 'categories' ? 'open' : ''}`} onMouseEnter={() => openMega('categories')} onMouseLeave={closeMega} aria-hidden={mega !== 'categories'}>
            <div className="event-groups">
              {EVENT_GROUPS.map(({ name, items }) => <div className="mega-col" key={name}>
                <span className="label">{name}</span>
                {items.map(([label, to], i) => <Link key={label} to={to} className="mega-link" style={{ '--i': i }} tabIndex={mega === 'categories' ? 0 : -1}><b>{label}</b></Link>)}
              </div>)}
            </div>
            <div className="mega-foot">
              <div className="mega-tags">
                <span className="label">Interests</span>
                {(cat?.interests || []).slice(0, 6).map((it) => <Link key={it.name} to={`/explore?interest=${encodeURIComponent(it.name)}`} className="chip" tabIndex={mega === 'categories' ? 0 : -1}>{it.name}</Link>)}
              </div>
              <Link to="/categories" className="mega-all" tabIndex={mega === 'categories' ? 0 : -1}>All categories <Icon name="arrow" className="icon" /></Link>
            </div>
          </div>
        </div>
      </header>
      <div className={`mega-scrim ${mega ? 'on' : ''}`} aria-hidden="true" onMouseEnter={closeMega} />

      <div className={`menu-sheet ${menu ? 'open' : ''}`} aria-hidden={!menu}>
        {NAV.map((n, i) => <Link key={n.label} to={n.to} style={{ '--i': i }}>{n.label} <small>0{i + 1}</small></Link>)}
        <Link to="/tickets" style={{ '--i': NAV.length }}>My Tickets <small>{upcoming > 0 ? `${upcoming} upcoming` : <Icon name="ticket" className="icon" />}</small></Link>
        {user?.role === 'organizer' && <Link to="/organizer" style={{ '--i': NAV.length + 1 }}>Organizer Dashboard <small><Icon name="grid" className="icon" /></small></Link>}
        <div className="sheet-actions" style={{ '--i': NAV.length + 2 }}>
          {user ? <button className="btn btn-ghost btn-lg" onClick={() => { logout(); setMenu(false); }}>Log out</button> : <Link to="/login" className="btn btn-ghost btn-lg">Log in</Link>}
          <Link to="/organizer/events/new" className="btn btn-primary btn-lg">Create Event <Arrow /></Link>
        </div>
      </div>

      <div className="theme-dock" role="group" aria-label="Appearance">
        <button className="theme-option" onClick={() => setTheme('light')} aria-pressed={theme === 'light'} title="White theme">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" /></svg>
          <span>White</span>
        </button>
        <button className="theme-option" onClick={() => setTheme('dark')} aria-pressed={theme === 'dark'} title="Dark theme">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M20.5 13A8.5 8.5 0 0 1 11 3.5 8.5 8.5 0 1 0 20.5 13Z" /></svg>
          <span>Dark</span>
        </button>
      </div>
      <SearchOverlay open={search} onClose={() => setSearch(false)} />
    </>
  );
}

function SearchOverlay({ open, onClose }) {
  const [q, setQ] = useState('');
  const input = useRef(null);
  const nav = useNavigate();
  const { data } = useApi(open ? '/events' : null);
  const results = useMemo(() => {
    if (!data) return [];
    const s = q.toLowerCase();
    return data.filter((e) => !s || [e.title, e.city, e.label, e.speakerInfo?.name, ...(e.interests || [])].join(' ').toLowerCase().includes(s)).slice(0, 6);
  }, [data, q]);

  useEffect(() => { if (open) setTimeout(() => input.current?.focus(), 80); }, [open]);
  const submit = (e) => { e.preventDefault(); nav(`/explore?q=${encodeURIComponent(q)}`); onClose(); };

  return (
    <div className={`search-overlay ${open ? 'open' : ''}`} onClick={(e) => e.target === e.currentTarget && onClose()} aria-hidden={!open}>
      <div className="search-panel glass" role="dialog" aria-label="Search events">
        <form className="search-field" onSubmit={submit}>
          <Icon name="search" />
          <input ref={input} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search events, speakers, topics or cities" aria-label="Search" />
          <kbd>ESC</kbd>
        </form>
        <div className="divider" />
        <div className="search-results">
          <span className="label" style={{ display: 'block', padding: '12px 12px 6px' }}>{q ? 'Results' : 'Upcoming'}</span>
          {results.map((e) => (
            <Link key={e.id} to={`/events/${e.id}`} onClick={onClose}>
              <span style={{ color: 'var(--white)' }}>{e.title}</span>
              <span className="mono" style={{ fontSize: 12 }}>{shortDate(e.date)} · {e.city}</span>
            </Link>
          ))}
          {data && !results.length && <p style={{ padding: 12, color: 'var(--grey)' }}>No matches. Try a city, speaker or topic.</p>}
        </div>
      </div>
    </div>
  );
}

export function BottomNav() {
  const loc = useLocation();
  const items = [
    { to: '/', label: 'Home', icon: 'home', match: (p) => p === '/' },
    { to: '/explore', label: 'Explore', icon: 'compass', match: (p) => /^\/(explore|events|categories|private|speakers|meetings|organizers|about)/.test(p) },
    { to: '/tickets', label: 'Tickets', icon: 'ticket', match: (p) => /^\/(tickets|confirmation|invite)/.test(p) },
    { to: '/profile', label: 'Profile', icon: 'user', match: (p) => /^\/(profile|login|organizer|checkin)/.test(p) }
  ];
  return (
    <nav className="bottom-nav" aria-label="Mobile">
      {items.map((i) => <Link key={i.to} to={i.to} className={i.match(loc.pathname) ? 'is-active' : ''}><Icon name={i.icon} />{i.label}</Link>)}
    </nav>
  );
}

export function Footer() {
  const toast = useToast();
  const [email, setEmail] = useState('');
  const subscribe = async (e) => {
    e.preventDefault();
    try { await api.post('/newsletter', { email }); setEmail(''); toast('You’re on the list — event alerts every Monday.'); }
    catch (err) { toast(err.message, 'error'); }
  };
  const cols = [
    ['Discover', [['Events', '/explore'], ['Categories', '/categories'], ['Cities', '/#cities'], ['Speakers', '/speakers'], ['Private Events', '/private']]],
    ['For Organizers', [['Create Event', '/organizer/events/new'], ['Pricing', '/organizers#pricing'], ['Organizer Dashboard', '/organizer'], ['QR Check-In', '/checkin']]],
    ['Support', [['Help Centre', '/help'], ['Contact', '/contact'], ['Cancellation Policy', '/cancellation-policy'], ['Refund & Return Policy', '/refund-policy'], ['Book a Client Meeting', '/meetings']]],
    ['Company', [['About', '/about'], ['Privacy Policy', '/privacy'], ['Terms of Use', '/terms'], ['Investment Disclaimer', '/disclaimer']]]
  ];
  return (
    <footer className="site-footer">
      <div className="footer-watermark" aria-hidden="true">AIONION</div>
      <div className="container">
        <div className="foot-grid">
          <div className="foot-brand">
            <div className="logo-plate"><Logo /></div>
            <p className="tagline">Where ideas meet <span className="muted">opportunity.</span></p>
            <label className="footer-news-label" htmlFor="footer-email">Stay informed about upcoming events</label>
            <form className="newsletter" onSubmit={subscribe}>
              <input id="footer-email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email address" />
              <button className="btn btn-primary btn-sm" type="submit">Subscribe</button>
            </form>
            <div className="socials">
              {[['linkedin', 'LinkedIn'], ['x', 'X'], ['youtube', 'YouTube'], ['instagram', 'Instagram']].map(([s, l]) => <a key={s} href="#" aria-label={l}><Icon name={s} /></a>)}
            </div>
          </div>
          {cols.map(([h, links]) => (
            <div key={h}>
              <h5>{h}</h5>
              <ul>{links.map(([l, to]) => <li key={l}><Link to={to}>{l}</Link></li>)}</ul>
            </div>
          ))}
        </div>

        <div className="pay-strip">
          <span className="row" style={{ gap: 10 }}><Icon name="shield" className="icon" />Clear pricing · Digital tickets · QR entry</span>
          <div className="pay-marks" aria-label="Accepted payment methods">
            {[['upi', 'UPI'], ['visa', 'Visa'], ['master', 'Mastercard'], ['rupay', 'RuPay']].map(([file, label]) => <span className="payment-method" key={file} title={label}><img src={`/payment-icons/${file}.svg`} alt={label} width="57" height="36" loading="lazy" /></span>)}
            <span className="payment-method payment-method--generic"><Icon name="bank" /><span>Net Banking</span></span>
            <span className="payment-method payment-method--generic"><Icon name="wallet" /><span>Wallets</span></span>
          </div>
        </div>

        <div className="foot-legal">
          <span>© {new Date().getFullYear()} Aionion Group. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}
