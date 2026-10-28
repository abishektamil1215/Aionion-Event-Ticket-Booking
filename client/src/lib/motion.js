import { useEffect, useRef, useState } from 'react';

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Reveal `.reveal` elements on scroll; re-scan when `key` changes (route) or content loads. */
export function useRevealAll(key) {
  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
      // anything already scrolled past (fast scroll, anchor jumps) should not stay hidden
      document.querySelectorAll('.reveal:not(.in)').forEach((el) => {
        if (el.getBoundingClientRect().bottom < 0) { el.classList.add('in'); io.unobserve(el); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    const scan = () => document.querySelectorAll('.reveal:not(.in)').forEach((el) => io.observe(el));
    scan();
    const mo = new MutationObserver(scan);
    mo.observe(document.getElementById('root'), { childList: true, subtree: true });
    return () => { io.disconnect(); mo.disconnect(); };
  }, [key]);
}

/** Delegated pointer effects: glass reflection (--mx/--my) and soft magnetic buttons. */
export function useGlobalPointerFx() {
  useEffect(() => {
    if (reduced() || window.matchMedia('(max-width: 768px), (hover: none)').matches) return;
    const onMove = (ev) => {
      const t = ev.target.closest && ev.target.closest('.sheen, .ecard');
      if (t) {
        const r = t.getBoundingClientRect();
        t.style.setProperty('--mx', `${ev.clientX - r.left}px`);
        t.style.setProperty('--my', `${ev.clientY - r.top}px`);
      }
      const m = ev.target.closest && ev.target.closest('.magnetic');
      if (m) {
        const r = m.getBoundingClientRect();
        const x = (ev.clientX - (r.left + r.width / 2)) * 0.18;
        const y = (ev.clientY - (r.top + r.height / 2)) * 0.28;
        m.style.transform = `translate(${x}px, ${y}px)`;
      }
    };
    const onOut = (ev) => {
      const m = ev.target.closest && ev.target.closest('.magnetic');
      if (m && !m.contains(ev.relatedTarget)) m.style.transform = '';
    };
    document.addEventListener('pointermove', onMove);
    document.addEventListener('pointerout', onOut);
    return () => { document.removeEventListener('pointermove', onMove); document.removeEventListener('pointerout', onOut); };
  }, []);
}

/** Adds `is-loaded` to <body> after mount so entrance choreography plays. */
export function useLoaded(key) {
  useEffect(() => {
    document.body.classList.remove('is-loaded');
    const id = requestAnimationFrame(() => requestAnimationFrame(() => document.body.classList.add('is-loaded')));
    return () => cancelAnimationFrame(id);
  }, [key]);
}

/** Gentle pointer parallax for children with data-depth inside the ref element. */
export function useParallax() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced() || window.matchMedia('(hover: none)').matches) return;
    const layers = [...el.querySelectorAll('[data-depth]')];
    let raf;
    const onMove = (ev) => {
      const r = el.getBoundingClientRect();
      const x = (ev.clientX - r.left) / r.width - 0.5;
      const y = (ev.clientY - r.top) / r.height - 0.5;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => layers.forEach((l) => {
        const d = parseFloat(l.dataset.depth);
        l.style.transform = `translate3d(${-x * d * 40}px, ${-y * d * 30}px, 0)${l.dataset.rot ? ` rotate(${l.dataset.rot}deg)` : ''}`;
      }));
    };
    const reset = () => layers.forEach((l) => { l.style.transform = l.dataset.rot ? `rotate(${l.dataset.rot}deg)` : ''; });
    window.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', reset);
    return () => { window.removeEventListener('pointermove', onMove); el.removeEventListener('pointerleave', reset); cancelAnimationFrame(raf); };
  }, []);
  return ref;
}

/** Animated counter that starts when scrolled into view. */
export function useCountUp(target, duration = 1800) {
  const ref = useRef(null);
  const [val, setVal] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduced()) { setVal(target); return; }
    let raf;
    const io = new IntersectionObserver(([en]) => {
      if (!en.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const tick = (t) => {
        const p = Math.min(1, (t - t0) / duration);
        setVal(Math.round(target * (1 - Math.pow(1 - p, 4))));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, { threshold: 0.4 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [target, duration]);
  return [ref, val];
}

export function useCountdown(iso) {
  const calc = () => {
    const ms = Math.max(0, new Date(iso).getTime() - Date.now());
    return { d: Math.floor(ms / 864e5), h: Math.floor(ms / 36e5) % 24, m: Math.floor(ms / 6e4) % 60, s: Math.floor(ms / 1e3) % 60 };
  };
  const [t, setT] = useState(calc);
  useEffect(() => {
    if (!iso) return;
    setT(calc());
    const id = setInterval(() => setT(calc()), 1000);
    return () => clearInterval(id);
  }, [iso]); // eslint-disable-line react-hooks/exhaustive-deps
  return t;
}

export function useScrolled(y = 40) {
  const [s, setS] = useState(false);
  useEffect(() => {
    const on = () => setS(window.scrollY > y);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, [y]);
  return s;
}
