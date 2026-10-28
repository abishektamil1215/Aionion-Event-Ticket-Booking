import { useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function useLuxuryHeroMotion(ref, eventId) {
  useLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;
    const media = gsap.matchMedia();
    media.add({
      desktop: '(min-width: 1101px) and (hover: hover) and (pointer: fine)',
      tablet: '(min-width: 769px) and (max-width: 1100px)',
      mobile: '(max-width: 768px)',
      motion: '(prefers-reduced-motion: no-preference)'
    }, ({ conditions }) => {
      if (!conditions.motion) return;
      const layers = [...root.querySelectorAll('[data-hero-depth]')];
      const multiplier = conditions.mobile ? .3 : conditions.tablet ? .6 : 1;
      gsap.set(layers, { '--hx': '0px', '--hy': '0px', '--hs': '0px', '--hi': '0px', '--he': '0px', '--hscale': 1 });
      const foreground = layers.filter(el => el.hasAttribute('data-hero-float'));
      if (foreground.length) gsap.fromTo(foreground, { opacity: 0, '--he': '18px' }, { opacity: 1, '--he': '0px', duration: 1, stagger: .1, ease: 'power3.out' });
      layers.forEach((el, index) => {
        const floating = Number(el.dataset.heroFloat) || 0;
        if (floating && (!conditions.mobile || el.classList.contains('launch-pass-float'))) {
          gsap.to(el, { '--hi': `${-floating * multiplier}px`, duration: 3 + (index % 4) * .55, repeat: -1, yoyo: true, ease: 'sine.inOut' });
        }
        if (!conditions.mobile) {
          gsap.fromTo(el, { '--hs': `${Number(el.dataset.heroStart || 0) * multiplier}px` }, {
            '--hs': `${Number(el.dataset.heroScroll || -8) * multiplier}px`,
            '--hscale': el.hasAttribute('data-hero-ring') ? 1.02 : 1,
            ease: 'none',
            scrollTrigger: { trigger: root, start: 'top top', end: 'bottom top', scrub: .8,
              onToggle: ({isActive}) => el.classList.toggle('hero-layer-active', isActive) }
          });
        }
      });
      let move, reset;
      if (conditions.desktop) {
        const pointers = layers.map(el => ({
          amount: Number(el.dataset.heroDepth),
          x: gsap.quickTo(el, '--hx', { duration: .9, ease: 'power3.out' }),
          y: gsap.quickTo(el, '--hy', { duration: .9, ease: 'power3.out' })
        }));
        move = event => {
          const bounds = root.getBoundingClientRect();
          const x = Math.max(-1, Math.min(1, ((event.clientX - bounds.left) / bounds.width - .5) * 2));
          const y = Math.max(-1, Math.min(1, ((event.clientY - bounds.top) / bounds.height - .5) * 2));
          pointers.forEach(p => { p.x(x * p.amount); p.y(y * p.amount); });
        };
        reset = () => pointers.forEach(p => { p.x(0); p.y(0); });
        root.addEventListener('pointermove', move);
        root.addEventListener('pointerleave', reset);
      }
      return () => {
        if (move) root.removeEventListener('pointermove', move);
        if (reset) root.removeEventListener('pointerleave', reset);
        layers.forEach(el => el.classList.remove('hero-layer-active'));
      };
    }, root);
    return () => media.revert();
  }, [ref, eventId]);
}
