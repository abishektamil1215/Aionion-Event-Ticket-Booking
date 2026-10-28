import { useEffect, useRef, useState } from 'react';
import Icon from './Icon.jsx';
import { Logo } from './ui.jsx';

/** Decorative, page-specific motion. It stops when the banner is off screen. */
export default function BannerArt({ variant = 'about' }) {
  const ref = useRef(null);
  const [active, setActive] = useState(false);
  useEffect(() => {
    let visible = false;
    const update = () => setActive(visible && !document.hidden);
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; update(); });
    observer.observe(ref.current);
    document.addEventListener('visibilitychange', update);
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', update); };
  }, []);
  return <div className={`page-banner-art pb-${variant} ${active ? 'is-active' : ''}`} ref={ref} aria-hidden={variant === 'about' ? undefined : true} aria-label={variant === 'about' ? 'Aionion brand' : undefined}>
    <div className="pb-aura" /><div className="pb-orbit" />
    {variant === 'explore' ? <>
      <div className="pb-radar"><i /><i /><i /><span /></div>
      <div className="pb-panel pb-discover"><div className="pb-panel-label">FIND YOUR NEXT EXPERIENCE</div><div className="pb-search"><Icon name="search" /><span>Ideas. People. Opportunity.</span><kbd>↗</kbd></div>{[['users','Investor meets'],['cap','Market workshops'],['diamond','Wealth sessions']].map(([icon,label],i)=><div className="pb-result" key={icon} style={{'--i':i}}><span><Icon name={icon} /></span><b>{label}</b><Icon name="arrowUR" /></div>)}</div>
      <span className="pb-chip pb-chip-bottom"><Icon name="pin" />Find your community</span>
    </> : variant === 'categories' ? <>
      <div className="pb-grid-base" />
      <div className="pb-category-grid">{[['candles','Stock Markets'],['pie','Mutual Funds'],['diamond','Wealth'],['book','Financial Literacy']].map(([icon,label],i)=><div className="pb-category" key={icon} style={{'--i':i}}><Icon name={icon} /><span>{label}</span><small>Explore your interests</small></div>)}</div>
      <span className="pb-chip pb-chip-bottom">Different interests. Shared ambition.</span>
    </> : variant === 'speakers' ? <>
      <div className="pb-sound-ring" /><div className="pb-mic"><Icon name="mic" /></div>
      <div className="pb-wave">{Array.from({length:17},(_,i)=><i key={i} style={{'--i':i,'--bar':`${18+((i*17)%55)}px`}} />)}</div>
      <div className="pb-chip pb-chip-top"><Icon name="chat" />Perspectives worth hearing</div><div className="pb-caption">EXPERTISE, IN CONVERSATION.</div>
    </> : variant === 'meetings' ? <>
      <div className="pb-panel pb-calendar"><div className="pb-calendar-top"><Icon name="calendar" /><span>Make time for what matters.</span><i /><i /></div><div className="pb-calendar-days">{['M','T','W','T','F','S','S'].map((d,i)=><span key={i}>{d}</span>)}{Array.from({length:14},(_,i)=><b className={i===9?'selected':''} key={`day-${i}`}>{i+1}</b>)}</div><div className="pb-calendar-foot"><span /><small>A conversation, at your pace.</small></div></div>
      <div className="pb-chip pb-chip-bottom"><Icon name="video" />Online <i /> Office <i /> Phone</div>
    </> : variant === 'private' ? <>
      <div className="pb-private-ring" /><div className="pb-private-ring second" />
      <div className="pb-invitation"><span>AIONION PRIVATE</span><Icon name="key" /><h3>A seat<br />at the right table.</h3><small>BY PERSONAL INVITATION</small></div>
      <span className="pb-chip pb-chip-bottom"><Icon name="shield" />Personal. Private. Considered.</span>
    </> : variant === 'organizers' ? <>
      <div className="pb-panel pb-organize"><span className="pb-panel-label">YOUR NEXT GREAT EVENT</span><div className="pb-organize-head"><Icon name="ticket" /><span>Create an experience.<br /><b>Build a community.</b></span></div><div className="pb-bars">{[36,54,43,72,62,90].map((height,i)=><i key={i} style={{height:`${height}%`,'--i':i}} />)}</div><div className="pb-organize-steps"><span>Create</span><span>Welcome</span><span>Grow</span></div></div><span className="pb-chip pb-chip-bottom"><Icon name="scan" />From the first ticket to the final check-in</span>
    </> : variant === 'contact' ? <>
      <div className="pb-contact-orbit"><Icon name="mail" /></div><div className="pb-bubble"><Icon name="chat" /><span>Let’s talk about<br /><b>your next move.</b></span></div><div className="pb-bubble second"><Icon name="users" /><span>A real conversation.<br />A considered response.</span></div>
    </> : variant === 'help' ? <>
      <div className="pb-help-ring"><Icon name="support" /></div><div className="pb-help-card"><Icon name="ticket" /><span>From booking<br /><b>to the door.</b></span></div><span className="pb-chip pb-chip-bottom"><Icon name="check" />A little clarity, every step.</span>
    </> : variant === 'about' ? <>
      <div className="pb-brand-grid" aria-hidden="true" />
      <div className="pb-brand-stack" aria-hidden="true"><i /><i /></div>
      <div className="pb-brand-plaque"><span className="pb-brand-overline">AIONION GROUP</span><Logo /><span className="pb-brand-subline">Connecting ambitious minds.</span></div>
      <div className="pb-brand-values">{[['users','People'],['chart','Perspective'],['compass','Opportunity']].map(([icon,label],i)=><span key={icon} style={{'--i':i}}><Icon name={icon} /><b>{label}</b></span>)}</div>
    </> : <>
      <div className="pb-network"><span className="pb-network-core"><Icon name="ticket" /></span>{[['users','People'],['chart','Perspective'],['compass','Opportunity']].map(([icon,label],i)=><div className="pb-network-node" key={icon} style={{'--i':i}}><Icon name={icon} /><span>{label}</span></div>)}</div><div className="pb-caption">BETTER CONVERSATIONS. LASTING CONNECTIONS.</div>
    </>}
  </div>;
}
