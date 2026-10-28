import { createContext, useCallback, useContext, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from './Icon.jsx';

/* Photo layer with atmospheric fallback if the image fails */
export function Ph({ src, className = '', style, children, ...rest }) {
  return <div className={`ph ${className}`} style={{ '--img': src ? `url("${src}")` : 'none', ...style }} {...rest}>{children}</div>;
}

/* Brand logo (transparent PNG; sits on light surfaces) */
export function Logo({ className = '', onClick }) {
  const goHome = (event) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    onClick?.(event);
    if (!event.defaultPrevented) window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  };
  return (
    <Link to="/" onClick={goHome} className={`logo ${className}`} title="Go to homepage" aria-label="Aionion Group — Event Ticket Booking, home">
      <img src="/aionion-logo.png" alt="Aionion Group — Event Ticket Booking" width="540" height="141" />
    </Link>
  );
}

export function Eyebrow({ children, className = '' }) {
  return <span className={`eyebrow ${className}`}>{children}</span>;
}

export function Arrow() {
  return <Icon name="arrow" className="icon arrow" />;
}

export function Avatars({ people = [], more }) {
  return (
    <div className="avatars">
      {people.map((p, i) => <span key={i} style={{ backgroundImage: `url("${p}")` }} />)}
      {more ? <span className="more">{more}</span> : null}
    </div>
  );
}

/* ---------- skeletons ---------- */
export function Skel({ w = '100%', h = 14, r = 8, style }) {
  return <span className="skel" style={{ width: w, height: h, borderRadius: r, ...style }} aria-hidden="true" />;
}

export function CardSkeleton() {
  return (
    <div className="ecard skel-card" aria-hidden="true">
      <div className="media"><span className="skel" style={{ position: 'absolute', inset: 0, borderRadius: 0 }} /></div>
      <div className="body">
        <Skel w="40%" h={10} /><Skel w="85%" h={20} /><Skel w="60%" h={12} />
        <div className="row" style={{ justifyContent: 'space-between' }}><Skel w="30%" h={18} /><Skel w="25%" h={12} /></div>
      </div>
    </div>
  );
}

export function Loading({ label = 'Loading' }) {
  return (
    <div className="container page-skel" role="status" aria-label={label}>
      <Skel w="18%" h={10} /><Skel w="62%" h={56} r={14} style={{ marginTop: 22 }} /><Skel w="40%" h={16} style={{ marginTop: 18 }} />
      <div className="event-grid" style={{ marginTop: 56 }}><CardSkeleton /><CardSkeleton /><CardSkeleton /></div>
    </div>
  );
}

export function Empty({ title, children, action }) {
  return (
    <div className="empty">
      <span className="empty-ic"><Icon name="ticket" /></span>
      <h3 className="h3">{title}</h3>
      {children && <p>{children}</p>}
      {action && <div style={{ marginTop: 24 }}>{action}</div>}
    </div>
  );
}

/* ---------- toast ---------- */
const ToastCtx = createContext(() => {});
export const useToast = () => useContext(ToastCtx);

export function ToastProvider({ children }) {
  const [t, setT] = useState({ msg: '', kind: 'info', show: false });
  const timer = useRef();
  const toast = useCallback((msg, kind = 'info') => {
    setT({ msg, kind, show: true });
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setT((x) => ({ ...x, show: false })), 2800);
  }, []);
  return (
    <ToastCtx.Provider value={toast}>
      {children}
      <div className={`toast ${t.show ? 'show' : ''} ${t.kind}`} role="status" aria-live="polite">
        {t.kind === 'error' ? <Icon name="close" className="icon" /> : <Icon name="check" className="icon" />}{t.msg}
      </div>
    </ToastCtx.Provider>
  );
}
