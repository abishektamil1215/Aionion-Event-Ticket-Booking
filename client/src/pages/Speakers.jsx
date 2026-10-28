import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCatalog } from '../App.jsx';
import { Eyebrow, Arrow } from '../components/ui.jsx';
import { SpeakerCard } from './Home.jsx';
import BannerArt from '../components/BannerArt.jsx';

export default function Speakers() {
  const cat = useCatalog();
  const [filter, setFilter] = useState('All');
  const speakers = cat?.speakers || [];
  const companies = ['All', ...new Set(speakers.map((s) => s.company))];
  const list = filter === 'All' ? speakers : speakers.filter((s) => s.company === filter);

  return (
    <>
      <section className="page-head animated-banner">
        <div className="container">
          <div className="crumbs" data-enter style={{ '--d': 0.1 }}><Link to="/">Home</Link><span>/</span><span>Speakers</span></div>
          <h1 className="display" data-enter style={{ '--d': 0.25 }}>Meet the people<br /><strong>behind the <em>conversation.</em></strong></h1>
          <p className="lead" data-enter style={{ '--d': 0.4 }}>Strategists, researchers and advisors who manage real capital — and who show up in the room to share how they think.</p>
          <BannerArt variant="speakers" />
          <div className="row wrap" data-enter style={{ '--d': 0.55, marginTop: 36, gap: 8 }}>
            {companies.map((c) => <button key={c} className={`chip ${filter === c ? 'is-active' : ''}`} onClick={() => setFilter(c)}>{c}</button>)}
          </div>
        </div>
      </section>
      <section className="container" style={{ paddingBottom: 120 }}>
        <div className="speaker-grid">{list.map((s, i) => <SpeakerCard key={s.id} s={s} delay={(i % 3) * 0.08} />)}</div>

        <div className="glass reveal speaker-cta" style={{ marginTop: 80, padding: 'clamp(28px, 4vw, 48px)' }}>
          <div>
            <Eyebrow>Speak with Aionion</Eyebrow>
            <h3 className="h2" style={{ marginTop: 18 }}>Have a perspective<br /><strong>worth sharing?</strong></h3>
          </div>
          <Link to="/meetings" className="btn btn-light btn-lg magnetic">Get in touch <Arrow /></Link>
        </div>
      </section>
    </>
  );
}
