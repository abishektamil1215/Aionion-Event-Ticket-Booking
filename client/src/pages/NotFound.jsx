import { Link } from 'react-router-dom';
import { Eyebrow, Arrow } from '../components/ui.jsx';

export default function NotFound() {
  return (
    <section className="success">
      <div className="container">
        <Eyebrow className="no-line">404 · Access not found</Eyebrow>
        <h1 className="display" style={{ margin: '28px 0' }}>This door<br /><strong>is closed.</strong></h1>
        <p className="lead" style={{ margin: '0 auto 40px' }}>The page or event you’re looking for may have moved or concluded.</p>
        <Link to="/explore" className="btn btn-primary btn-lg">Explore Events <Arrow /></Link>
      </div>
    </section>
  );
}
