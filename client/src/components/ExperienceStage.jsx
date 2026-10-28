import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { EVENT_GROUPS } from '../content/eventGroups.js';
import '../styles/experience-stage.css';

const COPY = ['Build your financial confidence.', 'Find your next conversation.', 'Make room for what matters.'];

export default function ExperienceStage() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (paused || motion.matches) return;
    const timer = window.setInterval(() => setActive((value) => (value + 1) % EVENT_GROUPS.length), 5000);
    return () => window.clearInterval(timer);
  }, [paused]);
  const group = EVENT_GROUPS[active];
  return <section className={`experience-stage experience-stage-${active}`} aria-label="Learn, Connect and Private experiences">
    <div className="container experience-layout">
      <div className="experience-intro">
        <span className="experience-eyebrow">THREE WAYS TO GO FURTHER</span>
        <h2>Your next chapter.<br /><span className="experience-word" key={group.name}>{group.name}<span className="experience-period">.</span></span></h2>
        <p className="experience-message" key={active}>{COPY[active]}</p>
        <div className="experience-controls" role="group" aria-label="Choose an experience">
          {EVENT_GROUPS.map(({ name }, index) => <button key={name} aria-pressed={active === index} onClick={() => { setActive(index); setPaused(true); }}><span>0{index + 1}</span>{name}<i /></button>)}
        </div>
        <button className="experience-pause" onClick={() => setPaused((value) => !value)} aria-pressed={paused}>{paused ? 'Play animation' : 'Pause animation'}<span aria-hidden="true">{paused ? ' ▷' : ' Ⅱ'}</span></button>
      </div>
      <div className="experience-space">
        <div className="experience-ring" aria-hidden="true" />
        <div className="experience-ring experience-ring-two" aria-hidden="true" />
        <div className={`experience-deck ${paused ? 'is-paused' : ''}`}>
          <div className="experience-backplate experience-backplate-one" aria-hidden="true" />
          <div className="experience-backplate experience-backplate-two" aria-hidden="true" />
          <article className="experience-card" key={group.name}>
            <div className="experience-card-top"><span>AIONION / EXPERIENCES</span><span>0{active + 1}</span></div>
            <div className="experience-sculpture" aria-hidden="true"><i /><i /><i /><span>{['↗', '∞', '◇'][active]}</span></div>
            <h3>{group.name}<span>↗</span></h3>
            <ul>{group.items.map(([label, to]) => <li key={label}><Link to={to}>{label}<span aria-hidden="true">↗</span></Link></li>)}</ul>
            <div className="experience-card-bottom"><span>IDEAS. PEOPLE. POSSIBILITIES.</span><span>✦</span></div>
          </article>
        </div>
        <span className="experience-floor" aria-hidden="true" />
      </div>
    </div>
  </section>;
}
