import { createContext, useContext, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Header, Footer, BottomNav } from './components/Layout.jsx';
import { ToastProvider } from './components/ui.jsx';
import { useApi } from './lib/api.js';
import { AuthProvider, RequireAuth } from './lib/auth.jsx';
import Login from './pages/Login.jsx';
import Organizer from './pages/Organizer.jsx';
import CheckIn from './pages/CheckIn.jsx';
import Invitation from './pages/Invitation.jsx';
import Information from './pages/Information.jsx';
import { useGlobalPointerFx, useLoaded, useRevealAll } from './lib/motion.js';
import Home from './pages/Home.jsx';
import Explore from './pages/Explore.jsx';
import Categories from './pages/Categories.jsx';
import EventDetail from './pages/EventDetail.jsx';
import Private from './pages/Private.jsx';
import Meetings from './pages/Meetings.jsx';
import Checkout from './pages/Checkout.jsx';
import Confirmation from './pages/Confirmation.jsx';
import MyTickets from './pages/MyTickets.jsx';
import Speakers from './pages/Speakers.jsx';
import Profile from './pages/Profile.jsx';
import NotFound from './pages/NotFound.jsx';

const CatalogCtx = createContext(null);
export const useCatalog = () => useContext(CatalogCtx);

export default function App() {
  const loc = useLocation();
  const { data: catalog } = useApi('/catalog');
  const checkout = loc.pathname.startsWith('/checkout');

  useLoaded(loc.pathname);
  useRevealAll(loc.pathname);
  useGlobalPointerFx();

  useEffect(() => {
    if (loc.hash) {
      const t = setTimeout(() => document.getElementById(loc.hash.slice(1))?.scrollIntoView({ behavior: 'smooth' }), 300);
      return () => clearTimeout(t);
    }
    window.scrollTo(0, 0);
  }, [loc.pathname, loc.hash]);

  useEffect(() => { document.body.classList.toggle('checkout-body', checkout); }, [checkout]);

  return (
    <AuthProvider>
      <CatalogCtx.Provider value={catalog}>
        <ToastProvider>
          <div className="atmos" aria-hidden="true" />
          <Header />
          {import.meta.env.VITE_PREVIEW_ONLY === 'true' && <aside className="visual-preview-notice" role="status">Visual preview · Bookings and sign-in are disabled</aside>}
          <main id="main">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/events/:id" element={<EventDetail />} />
              <Route path="/private" element={<Private />} />
              <Route path="/meetings" element={<Meetings />} />
              <Route path="/checkout/:id" element={<Checkout />} />
              <Route path="/confirmation/:bookingId" element={<Confirmation />} />
              <Route path="/tickets" element={<RequireAuth><MyTickets /></RequireAuth>} />
              <Route path="/login" element={<Login />} />
              <Route path="/organizer/*" element={<RequireAuth role="organizer"><Organizer /></RequireAuth>} />
              <Route path="/checkin" element={<RequireAuth role="organizer"><CheckIn /></RequireAuth>} />
              <Route path="/invite/:code" element={<Invitation />} />
              {['about', 'organizers', 'help', 'contact', 'privacy', 'terms', 'refund-policy', 'cancellation-policy', 'disclaimer'].map((page) => <Route key={page} path={`/${page}`} element={<Information page={page} />} />)}
              <Route path="/refund-and-return-policy" element={<Information page="refund-policy" />} />
              <Route path="/speakers" element={<Speakers />} />
              <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          {!checkout && <Footer />}
          <BottomNav />
        </ToastProvider>
      </CatalogCtx.Provider>
    </AuthProvider>
  );
}
