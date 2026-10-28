import { useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
const SELECTOR = '[data-parallax], [data-parallax-rotate], [data-parallax-scale], [data-parallax-x]';
const number = (value, limit) => Math.max(-limit, Math.min(limit, Number(value) || 0));

/** Home-only, opt-in scroll depth. Individual transforms preserve existing CSS transforms. */
export default function ParallaxController() {
  useLayoutEffect(() => {
    const root = document.getElementById('main');
    if (!root) return;
    let targets = [], media, frame, measurementFrame, disposed = false;
    const entered = new WeakSet();
    const measure = () => {
      cancelAnimationFrame(measurementFrame);
      measurementFrame = requestAnimationFrame(() => { if (!disposed) ScrollTrigger.refresh(); });
    };
    const refresh = () => {
      const next = [...root.querySelectorAll(SELECTOR)];
      if (next.length === targets.length && next.every((el, i) => el === targets[i])) return;
      media?.revert();
      targets = next;
      media = gsap.matchMedia();
      // Mobile keeps the existing gentle section reveals, with no scroll displacement.
      media.add('(min-width: 769px) and (prefers-reduced-motion: no-preference)', () => {
        const entering = targets.filter((el) => el.matches('.launch-pass-float, .launch-date, .launch-access') && !entered.has(el));
        entering.forEach((el) => entered.add(el));
        if (entering.length && window.scrollY < 100) {
          gsap.fromTo(entering, { '--parallax-entry': '24px', opacity: 0 }, {
            '--parallax-entry': '0px', opacity: 1, duration: 1.1, stagger: .12, ease: 'power3.out'
          });
        }
        targets.forEach((el) => {
          const section = el.closest('section') || el;
          const image = el.hasAttribute('data-parallax-image');
          gsap.fromTo(el, {
            '--parallax-y': image ? '-3%' : '0px',
            '--parallax-x': '0px', '--parallax-turn': '0deg', '--parallax-size': 1
          }, {
            '--parallax-y': image ? '3%' : () => `${-number(el.dataset.parallax, .45) * Math.min(420, window.innerHeight * .5)}px`,
            '--parallax-x': `${number(el.dataset.parallaxX, 20)}px`,
            '--parallax-turn': `${number(el.dataset.parallaxRotate, 1.5)}deg`,
            '--parallax-size': el.hasAttribute('data-parallax-scale') ? 1.02 : 1,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: section.classList.contains('launch-hero') ? 'top top' : 'top bottom',
              end: 'bottom top', scrub: .65, invalidateOnRefresh: true,
              onToggle: ({ isActive }) => el.classList.toggle('parallax-active', isActive)
            }
          });
        });
        return () => targets.forEach((el) => el.classList.remove('parallax-active'));
      });
    };
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(refresh);
    };
    refresh();
    // Event data arrives asynchronously; ignore text updates and our own inline styles.
    const observer = new MutationObserver(schedule);
    observer.observe(root, { childList: true, subtree: true });
    const resize = new ResizeObserver(measure);
    resize.observe(root);
    root.addEventListener('load', measure, true);
    document.fonts?.ready.then(() => { if (!disposed) measure(); });
    return () => {
      disposed = true;
      observer.disconnect(); resize.disconnect(); root.removeEventListener('load', measure, true);
      cancelAnimationFrame(frame); cancelAnimationFrame(measurementFrame); media?.revert();
      targets.forEach((el) => el.classList.remove('parallax-active'));
    };
  }, []);
  return null;
}
