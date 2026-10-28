import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { api, useApi } from '../lib/api.js';
import { longDate, time, inr } from '../lib/format.js';
import Icon from '../components/Icon.jsx';
import { Ph, Arrow, Loading } from '../components/ui.jsx';
import NotFound from './NotFound.jsx';

const STEPS = ['Ticket', 'Attendee', 'Payment', 'Confirmation'];
const INTERESTS = ['Stocks', 'Mutual Funds', 'Personal Finance', 'Wealth Management'];
const BANKS = ['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank', 'Kotak Mahindra', 'Other banks'];

export default function Checkout() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const nav = useNavigate();
  const { data: e, loading } = useApi(`/events/${id}`);
  const { data: profile } = useApi('/profile');

  const [step, setStep] = useState(0);
  const [tier, setTier] = useState(params.get('tier') || 'general');
  const [qty, setQty] = useState(Math.max(1, Math.min(6, Number(params.get('qty')) || 1)));
  const [a, setA] = useState({ name: '', email: '', mobile: '', company: '', designation: '', city: '', profession: '', investorType: '', interests: [] });
  const [accessCode, setAccessCode] = useState('');
  const [promo, setPromo] = useState('');
  const [quote, setQuote] = useState(null);
  const [quoteError, setQuoteError] = useState('');
  const [quoting, setQuoting] = useState(true);
  const [errors, setErrors] = useState({});
  const [method, setMethod] = useState('UPI');
  const [pay, setPay] = useState({ upi: '', card: '', exp: '', cvv: '', holder: '', bank: '', wallet: '' });
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (profile) setA((x) => ({ ...x, name: x.name || profile.name, email: x.email || profile.email, mobile: x.mobile || profile.mobile, city: x.city || profile.city, profession: x.profession || profile.profession, investorType: x.investorType || profile.investorType, interests: x.interests.length ? x.interests : profile.interests }));
  }, [profile]);
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [step]);
  useEffect(() => {
    if (!e?.tiers?.length) return;
    const selected = e.tiers.find((x) => x.key === tier) || e.tiers[0];
    let alive = true;
    setQuoting(true); setQuoteError('');
    const timer = setTimeout(() => api.post('/quote', { eventId: e.id, tier: selected.key, qty, promo: promo.trim() })
      .then((value) => { if (alive) setQuote(value); })
      .catch((err) => { if (alive) { setQuote(null); setQuoteError(err.message); } })
      .finally(() => { if (alive) setQuoting(false); }), 250);
    return () => { alive = false; clearTimeout(timer); };
  }, [e, tier, qty, promo]);

  if (loading) return <Loading label="Preparing checkout" />;
  if (!e || e.invite || !e.tiers.length) return <NotFound />;

  const t = e.tiers.find((x) => x.key === tier) || e.tiers[0];
  const free = t.price === 0;
  const subtotal = t.price * qty;
  const fee = quote?.fee ?? (free ? 0 : Math.round(subtotal * 0.02));
  const tax = quote?.tax ?? Math.round(fee * 0.18);
  const total = quote?.total ?? subtotal + fee + tax;
  const maxQty = Math.min(6, t.available);

  const set = (k) => (ev) => setA({ ...a, [k]: ev.target.value });
  const setP = (k) => (ev) => setPay({ ...pay, [k]: ev.target.value });
  const toggleInterest = (i) => setA({ ...a, interests: a.interests.includes(i) ? a.interests.filter((x) => x !== i) : [...a.interests, i] });

  const validateAttendee = () => {
    const er = {};
    if (!a.name.trim()) er.name = 'Please enter your full name';
    if (!/^\S+@\S+\.\S+$/.test(a.email)) er.email = 'Please enter a valid email';
    if (!/^[+\d\s-]{10,}$/.test(a.mobile)) er.mobile = 'Please enter a valid mobile number';
    setErrors(er);
    return !Object.keys(er).length;
  };
  const payReady = free || (method === 'UPI' && /^[\w.-]+@[\w]+$/.test(pay.upi)) || (method === 'Card' && pay.card.replace(/\s/g, '').length >= 15 && /^\d{2}\/\d{2}$/.test(pay.exp) && pay.cvv.length >= 3 && pay.holder) || (method === 'Net Banking' && pay.bank) || (method === 'Wallet' && pay.wallet);

  const next = () => {
    if (quoting || quoteError || maxQty < qty) return;
    if (t.locked && !accessCode.trim()) { setError('Enter your invitation access code.'); return; }
    if (step === 1 && !validateAttendee()) return;
    setStep((s) => s + 1);
  };

  const complete = async () => {
    if (processing || quoting || quoteError || !payReady || !validateAttendee() || maxQty < qty) return;
    setError('');
    setProcessing(true);
    try {
      const [b] = await Promise.all([
        api.post('/bookings', { eventId: e.id, tier: t.key, qty, attendee: a, method, accessCode, promo: promo.trim() }),
        new Promise((r) => setTimeout(r, 1800))
      ]);
      nav(`/confirmation/${b.id}`, { replace: true });
    } catch (err) {
      setProcessing(false);
      setError(err.message);
    }
  };

  const Field = ({ k, label, type = 'text', full, ...rest }) => (
    <div className={`field ${full ? 'full' : ''} ${errors[k] ? 'invalid' : ''}`}>
      <input id={`a-${k}`} type={type} placeholder=" " value={a[k]} onChange={set(k)} {...rest} />
      <label htmlFor={`a-${k}`}>{label}</label>
      <span className="err">{errors[k]}</span>
    </div>
  );

  return (
    <section className="container" style={{ paddingTop: 'calc(var(--header-h) + 56px)', paddingBottom: 120 }}>
      <Link to={`/events/${e.id}`} className="link-u"><Icon name="arrowL" /> Back to event</Link>

      <div className="progress" aria-label="Checkout progress">
        <span className="fill" style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
        {STEPS.map((s, i) => <div key={s} className={`p-step ${i < step ? 'is-done' : ''} ${i === step ? 'is-active' : ''}`}><b>0{i + 1}</b><span>— {s}</span></div>)}
      </div>

      <div className="co-grid">
        <div>
          {/* 01 TICKET */}
          <div className={`co-panel ${step === 0 ? 'is-active' : ''}`}>
            <h2>Choose your access</h2>
            <p>Select a ticket type and how many seats you need. Guest booking is welcome.</p>
            <div className="tiers">
              {e.tiers.map((x) => (
                <label key={x.key} className={`tier ${tier === x.key ? 'is-active' : ''}`} style={{ padding: '22px 22px' }}>
                  <input type="radio" name="tier" checked={t.key === x.key} disabled={x.available <= 0} onChange={() => { setTier(x.key); setQty(1); }} />
                  <span className="tn"><i /><span><b style={{ fontWeight: 500, display: 'block' }}>{x.name}</b><small className="muted">{x.benefits.join(' · ')}<br />{x.available ? `${x.available} remaining` : 'Sold out'}</small></span></span>
                  <span className="tp">{inr(x.price)}</span>
                </label>
              ))}
            </div>
            <div className="qty-row" style={{ marginTop: 28 }}>
              <span>Number of seats <small className="steel">(max 6)</small></span>
              <div className="stepper">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Fewer">−</button>
                <output>{qty}</output>
                <button disabled={qty >= maxQty} onClick={() => setQty((q) => Math.min(maxQty, q + 1))} aria-label="More">+</button>
              </div>
            </div>
            {t.locked && <label className="stack-8"><span className="label">Invitation access code</span><input className="control" value={accessCode} onChange={(e) => setAccessCode(e.target.value)} /></label>}
            <div className="co-actions"><span className="muted" style={{ fontSize: 14 }}>{t.available} seats remaining</span><button className="btn btn-primary btn-lg" disabled={quoting || !!quoteError || qty > maxQty} onClick={next}>Continue <Arrow /></button></div>
            {error && <p className="coral" role="alert">{error}</p>}
          </div>

          {/* 02 ATTENDEE */}
          <div className={`co-panel ${step === 1 ? 'is-active' : ''}`}>
            <h2>Attendee details</h2>
            <p>Your digital credential will be issued in this name.</p>
            <div className="form-grid">
              {Field({ k: 'name', label: 'Full name', full: true, autoComplete: 'name' })}
              {Field({ k: 'email', label: 'Email', type: 'email', autoComplete: 'email' })}
              {Field({ k: 'mobile', label: 'Mobile', type: 'tel', autoComplete: 'tel' })}
              {Field({ k: 'company', label: 'Company (optional)', autoComplete: 'organization' })}
              {Field({ k: 'designation', label: 'Designation (optional)', autoComplete: 'organization-title' })}
              {Field({ k: 'city', label: 'City', autoComplete: 'address-level2' })}
              {Field({ k: 'profession', label: 'Profession' })}
              <div className="field full">
                <select id="a-it" value={a.investorType} onChange={set('investorType')}>
                  <option value="">Select</option>
                  {['New to investing', 'Experienced investor', 'Active trader', 'Business owner', 'Aionion client'].map((o) => <option key={o}>{o}</option>)}
                </select>
                <label htmlFor="a-it">Investor type</label>
              </div>
            </div>
            <div style={{ marginTop: 28 }}>
              <span className="label">Investment interests · Optional</span>
              <div className="check-chips" style={{ marginTop: 14 }}>
                {INTERESTS.map((i) => <label key={i}><input type="checkbox" checked={a.interests.includes(i)} onChange={() => toggleInterest(i)} /><span className="chip">{a.interests.includes(i) && <Icon name="check" />}{i}</span></label>)}
              </div>
            </div>
            <div className="co-actions"><button className="link-u" onClick={() => setStep(0)}>Back</button><button className="btn btn-primary btn-lg" onClick={next}>Continue to payment <Arrow /></button></div>
          </div>

          {/* 03 PAYMENT */}
          <div className={`co-panel ${step === 2 ? 'is-active' : ''}`}>
            <h2>{free ? 'Confirm registration' : 'Payment'}</h2>
            <p>{free ? 'This session is complimentary — no payment needed.' : 'All transactions are encrypted and processed securely.'}</p>
            {!free && (
              <>
                <div className="pay-tabs" role="tablist">
                  {[['UPI', 'upi'], ['Card', 'card'], ['Net Banking', 'bank'], ['Wallet', 'wallet']].map(([m, ic]) => <button key={m} role="tab" aria-selected={method === m} className={`pay-tab ${method === m ? 'is-active' : ''}`} onClick={() => setMethod(m)}><Icon name={ic} />{m === 'Card' ? 'Cards' : m}</button>)}
                </div>
                <div className={`pay-pane ${method === 'UPI' ? 'is-active' : ''}`}>
                  <div className="field"><input id="upi" placeholder=" " value={pay.upi} onChange={setP('upi')} /><label htmlFor="upi">UPI ID (e.g. name@okbank)</label></div>
                  <div className="upi-apps">{['GPay', 'PhonePe', 'Paytm', 'BHIM'].map((x) => <span key={x} className="chip">{x}</span>)}</div>
                </div>
                <div className={`pay-pane ${method === 'Card' ? 'is-active' : ''}`}>
                  <div className="form-grid">
                    <div className="field full"><input id="cn" inputMode="numeric" placeholder=" " maxLength={19} value={pay.card} onChange={(ev) => setPay({ ...pay, card: ev.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim() })} autoComplete="cc-number" /><label htmlFor="cn">Card number</label></div>
                    <div className="field"><input id="ce" placeholder=" " maxLength={5} value={pay.exp} onChange={(ev) => setPay({ ...pay, exp: ev.target.value.replace(/\D/g, '').replace(/^(\d{2})(\d)/, '$1/$2').slice(0, 5) })} autoComplete="cc-exp" /><label htmlFor="ce">Expiry (MM/YY)</label></div>
                    <div className="field"><input id="cc" type="password" inputMode="numeric" placeholder=" " maxLength={4} value={pay.cvv} onChange={(ev) => setPay({ ...pay, cvv: ev.target.value.replace(/\D/g, '') })} autoComplete="cc-csc" /><label htmlFor="cc">CVV</label></div>
                    <div className="field full"><input id="ch" placeholder=" " value={pay.holder} onChange={setP('holder')} autoComplete="cc-name" /><label htmlFor="ch">Name on card</label></div>
                  </div>
                </div>
                <div className={`pay-pane ${method === 'Net Banking' ? 'is-active' : ''}`}>
                  <div className="bank-list">{BANKS.map((b) => <button key={b} className={pay.bank === b ? 'is-active' : ''} onClick={() => setPay({ ...pay, bank: b })}>{b}</button>)}</div>
                </div>
                <div className={`pay-pane ${method === 'Wallet' ? 'is-active' : ''}`}><label className="stack-8"><span className="label">Select wallet</span><select aria-label="Select wallet" className="control" value={pay.wallet} onChange={setP('wallet')}><option value="">Choose wallet</option><option>Paytm</option><option>Amazon Pay</option><option>Mobikwik</option></select></label></div>
              </>
            )}
            <div className="trust-row">
              <span><Icon name="shield" />Secure Payment</span>
              <span><Icon name="lock" />256-bit Encrypted Checkout</span>
              <span><Icon name="check" />No hidden charges</span>
            </div>
            {error && <p className="coral" style={{ marginTop: 20 }}>{error}</p>}
            <div className="co-actions">
              <button className="link-u" onClick={() => setStep(1)}>Back</button>
              <button className="btn btn-primary btn-lg" disabled={!payReady || processing || quoting || !!quoteError || qty > maxQty} onClick={complete}>{free ? 'Confirm Registration' : `Pay Securely · ${inr(total)}`} <Icon name="lock" className="icon" /></button>
            </div>
            {!free && <p className="steel" style={{ fontSize: 12, marginTop: 16 }}>Demo checkout — no money is charged. Use sample payment details.</p>}
          </div>
        </div>

        <aside className="summary">
          <span className="label">Order Summary</span>
          <div className="s-ev" style={{ marginTop: 16 }}>
            <Ph src={e.img} />
            <div><b>{e.title}</b><span className="muted" style={{ fontSize: 13 }}>{longDate(e.date)} · {time(e.date)}<br />{e.venue}, {e.city}</span></div>
          </div>
          <label className="stack-8" style={{ marginTop: 20 }}><span className="label">Promo code (optional)</span><input className="control" value={promo} onChange={(e) => setPromo(e.target.value.toUpperCase())} placeholder="Enter code" /></label>
          {quoteError && <p className="coral" role="alert">{quoteError}</p>}
          <dl>
            <div><dt>Event</dt><dd>{e.title}</dd></div>
            <div><dt>Ticket type</dt><dd>{t.name}</dd></div>
            <div><dt>Quantity</dt><dd>{qty}</dd></div>
            <div><dt>Price</dt><dd>{inr(t.price)} × {qty}</dd></div>
            {!free && <div><dt>Convenience fee</dt><dd>{inr(fee)}</dd></div>}
            {!!quote?.discount && <div><dt>Discount</dt><dd>−{inr(quote.discount)}</dd></div>}
            {!free && <div><dt>GST on fee (18%)</dt><dd>{inr(tax)}</dd></div>}
          </dl>
          <div className="s-total" aria-live="polite"><span>Total</span><span className="num">{quoting ? 'Updating…' : inr(total)}</span></div>
          <p className="policy-consent">By continuing you agree to our <Link to="/terms">Terms of Use</Link>, <Link to="/cancellation-policy">Cancellation Policy</Link> and <Link to="/refund-policy">Refund & Return Policy</Link>. Full ticket refund 7+ days before the event, 50% up to 48 hours before; the convenience fee and GST are non-refundable.</p>
          <div className="secure-note"><Icon name="shield" />Secure checkout · Instant confirmation · Digital QR ticket</div>
        </aside>
      </div>

      <div className={`processing ${processing ? 'open' : ''}`} aria-live="assertive">
        <div><div className="orb" /><p>{free ? 'CONFIRMING YOUR SEAT' : 'SECURING YOUR PAYMENT'}</p></div>
      </div>
    </section>
  );
}
