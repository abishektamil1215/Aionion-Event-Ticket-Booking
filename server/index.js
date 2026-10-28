/* Aionion Events API — Node + Express */
const path = require('path');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const D = require('./data');
const store = require('./store');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

/* ---------- helpers ---------- */
const DAY = 864e5;
const now = () => Date.now();
const isPast = (e) => new Date(e.date).getTime() < now();
const ALPHA = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const rid = (prefix, n = 6) => prefix + Array.from({ length: n }, () => ALPHA[Math.floor(Math.random() * 32)]).join('');
const validEmail = (e) => /^\S+@\S+\.\S+$/.test(e || '');
const allEvents = () => [...D.EVENTS, ...store.load().customEvents.filter((e) => e.status === 'Published')];
const findEvent = (id) => allEvents().find((e) => e.id === id) || store.load().customEvents.find((e) => e.id === id);

function soldMap() {
  const m = {};
  store.load().bookings.forEach((b) => { if (b.status !== 'cancelled') m[b.eventId] = (m[b.eventId] || 0) + b.qty; });
  return m;
}

function withLive(e, sold = soldMap()) {
  const extra = Math.max(0, (sold[e.id] || 0) - e.attending); // bookings made through the platform after launch
  return {
    ...e,
    seats: Math.max(0, e.seats - extra),
    attending: e.attending + extra,
    past: isPast(e),
    speakerInfo: D.SPEAKERS.find((s) => s.id === e.speaker) || null
  };
}

function tiersFor(e) {
  if (e.invite) return [{ key: 'invite', name: 'Invitation', price: 0, available: e.seats, benefits: ['Personal invitation', 'Admit as stated on your invite'], locked: true }];
  if (!e.price) return [{ key: 'general', name: 'Free Registration', price: 0, available: e.seats, benefits: ['Reserved seat', 'Session materials', 'Recording access'] }];
  const premium = Math.floor(e.seats * 0.2), vip = Math.floor(e.seats * 0.1);
  const avail = { general: e.seats - premium - vip, premium, vip, invite: Math.min(20, e.seats) };
  return D.TIERS.map((t) => ({ key: t.key, name: t.name, price: t.add == null ? 0 : e.price + t.add, available: avail[t.key], benefits: t.benefits, locked: t.key === 'invite' }));
}

function quote(e, tierKey, qty, promoCode) {
  const t = tiersFor(e).find((x) => x.key === tierKey);
  if (!t) return { error: 'Unknown ticket type.' };
  const db = store.load();
  const promo = promoCode ? db.promotions.find((p) => p.code === String(promoCode).toUpperCase() && p.active && p.uses < p.limit) : null;
  if (promoCode && !promo) return { error: 'That promo code is not valid or has expired.' };
  const subtotal = t.price * qty;
  const discount = promo && t.price ? Math.round(subtotal * promo.percent / 100) : 0;
  const fee = t.price ? Math.round((subtotal - discount) * 0.02) : 0;
  const tax = Math.round(fee * 0.18);
  return { tier: t, unit: t.price, qty, subtotal, discount, promo: promo ? promo.code : null, fee, tax, total: subtotal - discount + fee + tax };
}

function bookingView(b) {
  const ev = findEvent(b.eventId);
  const status = b.status === 'cancelled' ? 'cancelled' : ev && isPast(ev) ? 'past' : 'upcoming';
  const tier = ev ? tiersFor(ev).find((t) => t.key === b.tier) : null;
  const { seed, ...rest } = b;
  return { ...rest, status, tierName: b.tier === 'invite' ? 'Invitation' : tier ? tier.name : b.tier, event: ev ? withLive(ev) : null };
}

/* ---------- demo auth ---------- */
const tokenFor = (email) => 'demo.' + Buffer.from(email).toString('base64url');
app.use((req, _res, next) => {
  const h = req.headers.authorization || '';
  if (h.startsWith('Bearer demo.')) {
    const email = Buffer.from(h.slice(12), 'base64url').toString();
    req.user = store.load().users.find((u) => u.email === email) || null;
  }
  next();
});
const needUser = (req, res, next) => (req.user ? next() : res.status(401).json({ error: 'Please log in to continue.' }));
const needOrganizer = (req, res, next) => (req.user?.role === 'organizer' ? next() : res.status(403).json({ error: 'Organizer access required.' }));

app.post('/api/auth/login', (req, res) => {
  const { email, password, name } = req.body || {};
  if (!validEmail(email) || String(password || '').length < 6) return res.status(400).json({ error: 'Enter a valid email and a password of at least 6 characters.' });
  const db = store.load();
  let user = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    const nm = name || email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    user = { email, name: nm, first: nm.split(' ')[0], role: 'member', city: 'Chennai', memberSince: String(new Date().getFullYear()), tier: 'Member', interests: [], prefs: { reminders: true, whatsapp: false, newsletter: true, privateInvites: false } };
    db.users.push(user);
    store.save();
  }
  res.json({ user, token: tokenFor(user.email) });
});

app.get('/api/me', needUser, (req, res) => res.json(req.user));

/* ---------- catalog ---------- */
app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.get('/api/catalog', (_req, res) => {
  const upcoming = allEvents().filter((e) => !isPast(e));
  const pub = upcoming.filter((e) => !e.hidden);
  const count = (fn) => pub.filter(fn).length;
  res.json({
    categories: D.CATEGORIES.map((c) => ({ ...c, count: c.key === 'hni' ? upcoming.filter((e) => e.category === 'hni').length : count((e) => e.category === c.key) })),
    interests: D.INTERESTS.map((name) => ({ name, count: count((e) => e.interests?.includes(name)) })),
    audiences: D.AUDIENCES,
    speakers: D.SPEAKERS.map((s) => ({ ...s, sessions: s.sessions.map(findEvent).filter((e) => e && !isPast(e) && !e.hidden).map((e) => ({ id: e.id, title: e.title, date: e.date, city: e.city })) })),
    cities: D.CITIES.map((c) => ({ ...c, events: count((e) => e.city === c.name) })),
    organizer: D.ORGANIZER,
    images: D.IMG,
    people: D.PEOPLE
  });
});

app.get('/api/events', (req, res) => {
  const { q = '', category, city, date, format, price, audience, interest, quick, sort = 'recommended', featured, limit } = req.query;
  const t = now();
  const quicks = String(quick || '').split(',').filter(Boolean);
  const sold = soldMap();
  let list = allEvents().filter((e) => !isPast(e) && !e.hidden).map((e) => withLive(e, sold));

  if (featured) list = list.filter((e) => e.featured);
  if (q) {
    const s = String(q).toLowerCase();
    list = list.filter((e) => [e.title, e.subtitle, e.city, e.label, e.venue, e.speakerInfo?.name, e.speakerInfo?.expertise, ...(e.interests || [])].join(' ').toLowerCase().includes(s));
  }
  if (category && category !== 'all') list = list.filter((e) => e.category === category);
  if (city && city !== 'all') list = list.filter((e) => e.city === city);
  if (format && format !== 'all') list = list.filter((e) => e.format === format);
  if (audience && audience !== 'all') list = list.filter((e) => e.audience?.includes(audience));
  if (interest && interest !== 'all') list = list.filter((e) => e.interests?.includes(interest));
  if (price === 'free') list = list.filter((e) => e.price === 0);
  if (price === 'paid') list = list.filter((e) => e.price > 0);
  if (price === 'premium') list = list.filter((e) => e.price >= 1500);
  const within = (days) => (e) => new Date(e.date).getTime() - t <= days * DAY;
  if (date === 'week') list = list.filter(within(7));
  if (date === 'month') list = list.filter(within(31));
  if (date === 'quarter') list = list.filter(within(92));
  quicks.forEach((k) => {
    if (k === 'week') list = list.filter(within(7));
    if (k === 'month') list = list.filter(within(31));
    if (k === 'free') list = list.filter((e) => e.price === 0);
    if (k === 'premium') list = list.filter((e) => e.price >= 1500);
    if (k === 'online') list = list.filter((e) => e.format !== 'In-person');
  });

  if (sort === 'soonest') list.sort((a, b) => new Date(a.date) - new Date(b.date));
  else if (sort === 'popular') list.sort((a, b) => b.popular - a.popular);
  else if (sort === 'price') list.sort((a, b) => a.price - b.price);
  else list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || new Date(a.date) - new Date(b.date));

  res.json(limit ? list.slice(0, Number(limit)) : list);
});

function eventPayload(e) {
  const speakers = [e.speaker, ...D.SPEAKERS.filter((s) => s.sessions.includes(e.id)).map((s) => s.id)]
    .filter((v, i, a) => a.indexOf(v) === i).map((id) => D.SPEAKERS.find((s) => s.id === id)).filter(Boolean).slice(0, 3);
  return {
    ...withLive(e),
    tiers: tiersFor(withLive(e)),
    speakers,
    amenities: (e.amenities || []).map((k) => ({ key: k, label: D.AMENITY[k] || k })),
    thingsToKnow: e.thingsToKnow || D.DEFAULT_THINGS,
    organizer: D.ORGANIZER
  };
}

app.get('/api/events/:id', (req, res) => {
  const e = findEvent(req.params.id);
  if (!e || (e.hidden && !D.INVITATIONS.some((i) => i.code === req.query.invite && i.eventId === e.id))) return res.status(404).json({ error: 'Event not found' });
  res.json(eventPayload(e));
});

const icsDate = (d) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
app.get('/api/events/:id/ics', (req, res) => {
  const e = findEvent(req.params.id);
  if (!e) return res.status(404).end();
  const start = new Date(e.date);
  const end = new Date(`${e.date.slice(0, 11)}${e.end}:00+05:30`);
  const body = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Aionion//Events//EN', 'BEGIN:VEVENT', `UID:${e.id}@events.aionion`, `DTSTAMP:${icsDate(new Date())}`, `DTSTART:${icsDate(start)}`, `DTEND:${icsDate(end)}`, `SUMMARY:${e.title} — Aionion Events`, `LOCATION:${e.venue}, ${e.city}`, `DESCRIPTION:${e.subtitle}`, 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
  res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="${e.id}.ics"`);
  res.send(body);
});

/* ---------- checkout ---------- */
app.post('/api/access-codes/verify', (req, res) => {
  const { code } = req.body || {};
  const label = D.ACCESS_CODES[String(code || '').trim().toUpperCase()];
  if (!label) return res.status(400).json({ error: 'That access code is not recognised.' });
  res.json({ ok: true, label });
});

app.post('/api/quote', (req, res) => {
  const { eventId, tier, qty = 1, promo } = req.body || {};
  const e = findEvent(eventId);
  if (!e) return res.status(404).json({ error: 'Event not found' });
  const q = quote(withLive(e), tier, Math.max(1, Math.min(6, parseInt(qty, 10) || 1)), promo);
  if (q.error) return res.status(400).json(q);
  res.json(q);
});

app.post('/api/bookings', (req, res) => {
  const { eventId, tier = 'general', qty = 1, attendee = {}, method = 'UPI', promo, accessCode } = req.body || {};
  const raw = findEvent(eventId);
  if (!raw || isPast(raw) || raw.hidden) return res.status(400).json({ error: 'This event is not open for booking.' });
  const e = withLive(raw);
  if (tier === 'invite' && !D.ACCESS_CODES[String(accessCode || '').toUpperCase()]) return res.status(403).json({ error: 'A valid access code is required for Invite Only tickets.' });
  const n = Math.max(1, Math.min(6, parseInt(qty, 10) || 1));
  const q = quote(e, tier, n, promo);
  if (q.error) return res.status(400).json(q);
  if (q.tier.available < n) return res.status(409).json({ error: `Only ${q.tier.available} ${q.tier.name} seats remain.` });
  if (!attendee.name || !validEmail(attendee.email) || !/^[+\d\s-]{10,}$/.test(attendee.mobile || '')) return res.status(400).json({ error: 'Name, a valid email and mobile number are required.' });

  const db = store.load();
  const booking = {
    id: rid('AIO-'), eventId: e.id, tier: q.tier.key, qty: n, total: q.total, pricing: { unit: q.unit, subtotal: q.subtotal, discount: q.discount, fee: q.fee, tax: q.tax, promo: q.promo },
    method: q.total ? method : tier === 'invite' ? 'Complimentary' : 'Free', payment: q.total ? 'paid' : 'free', status: 'confirmed', createdAt: new Date().toISOString(),
    owner: req.user?.email || attendee.email,
    attendee: { name: String(attendee.name).slice(0, 80), email: attendee.email, mobile: attendee.mobile, company: attendee.company || '', designation: attendee.designation || '' },
    tickets: Array.from({ length: n }, () => rid('TK-', 5)), checkins: {}
  };
  if (q.promo) db.promotions.find((p) => p.code === q.promo).uses += 1;
  db.bookings.push(booking);
  store.save();
  res.status(201).json(bookingView(booking));
});

app.get('/api/bookings', needUser, (req, res) => {
  const mine = store.load().bookings.filter((b) => b.owner === req.user.email).map(bookingView);
  res.json(mine.sort((a, b) => new Date(a.event?.date) - new Date(b.event?.date)));
});

app.get('/api/bookings/:id', (req, res) => {
  const b = store.load().bookings.find((x) => x.id === req.params.id);
  if (!b) return res.status(404).json({ error: 'Booking not found' });
  res.json(bookingView(b));
});

/* Cancellation policy — keep in sync with client/src/content/legal.js (POLICY).
   Attendee-initiated: 100% of the ticket amount ≥ 7 days before start, 50% from 7 days to 48 hours,
   closed inside 48 hours. Convenience fee and GST on it are non-refundable. Free and complimentary
   bookings can be cancelled until the event starts. */
const POLICY = { fullHours: 168, halfHours: 48 };

function cancellationTerms(b) {
  const ev = findEvent(b.eventId);
  if (!ev) return { allowed: false, reason: 'This event is no longer available.' };
  if (b.status === 'cancelled') return { allowed: false, reason: 'This booking is already cancelled.' };
  const hours = (new Date(ev.date).getTime() - now()) / 36e5;
  if (hours <= 0) return { allowed: false, reason: 'This event has already started.' };
  // ticket amount actually paid, excluding the convenience fee and GST (older records lack a breakdown)
  const ticketAmount = b.pricing ? b.pricing.subtotal - b.pricing.discount : Math.round(b.total / 1.0236);
  if (b.payment !== 'paid' || !ticketAmount) return { allowed: true, percent: 0, refund: 0, nonRefundable: 0, hours, note: 'No payment was taken for this booking.' };
  if (hours < POLICY.halfHours) return { allowed: false, reason: 'Cancellations close 48 hours before the event starts. Please contact support if you need help.' };
  const percent = hours >= POLICY.fullHours ? 100 : 50;
  const refund = Math.round(ticketAmount * percent / 100);
  return { allowed: true, percent, refund, nonRefundable: b.total - refund, hours };
}

app.get('/api/bookings/:id/cancel-preview', needUser, (req, res) => {
  const b = store.load().bookings.find((x) => x.id === req.params.id && x.owner === req.user.email);
  if (!b) return res.status(404).json({ error: 'Booking not found' });
  res.json(cancellationTerms(b));
});

app.post('/api/bookings/:id/cancel', needUser, (req, res) => {
  const db = store.load();
  const b = db.bookings.find((x) => x.id === req.params.id && x.owner === req.user.email);
  if (!b) return res.status(404).json({ error: 'Booking not found' });
  const terms = cancellationTerms(b);
  if (!terms.allowed) return res.status(409).json({ error: terms.reason });
  b.status = 'cancelled';
  b.cancelledAt = new Date().toISOString();
  if (b.payment === 'paid') {
    b.payment = 'refunded';
    b.refund = { amount: terms.refund, percent: terms.percent, status: 'initiated', at: b.cancelledAt };
  }
  store.save();
  res.json(bookingView(b));
});

app.post('/api/bookings/:id/email', (req, res) => {
  const db = store.load();
  const b = db.bookings.find((x) => x.id === req.params.id);
  if (!b) return res.status(404).json({ error: 'Booking not found' });
  const to = req.body?.email || b.attendee.email;
  if (!validEmail(to)) return res.status(400).json({ error: 'Please enter a valid email.' });
  db.emails.push({ bookingId: b.id, to, at: new Date().toISOString() }); // demo: connect an email provider to actually send
  store.save();
  res.json({ ok: true, to });
});

/* ---------- private invitations ---------- */
const inviteView = (inv) => {
  const e = findEvent(inv.eventId);
  const rsvp = store.load().rsvps.find((r) => r.code === inv.code) || null;
  return { code: inv.code, guest: inv.name, admit: inv.admit, host: inv.host, rsvp, event: eventPayload(e) };
};
const findInvite = (code) => D.INVITATIONS.find((i) => i.code === String(code || '').trim().toUpperCase());

app.get('/api/invitations/:code', (req, res) => {
  const inv = findInvite(req.params.code);
  if (!inv) return res.status(404).json({ error: 'This invitation could not be found. Please check the code or contact your relationship director.' });
  res.json(inviteView(inv));
});

app.post('/api/invitations/:code/verify', (req, res) => {
  const inv = findInvite(req.params.code);
  if (!inv) return res.status(404).json({ error: 'Invitation not found.' });
  if (String(req.body?.email || '').toLowerCase() !== inv.email) return res.status(403).json({ error: 'That email does not match this invitation.' });
  res.json({ ok: true });
});

app.post('/api/invitations/:code/rsvp', (req, res) => {
  const inv = findInvite(req.params.code);
  if (!inv) return res.status(404).json({ error: 'Invitation not found.' });
  const { email, attending, admit = 1, guestName = '' } = req.body || {};
  if (String(email || '').toLowerCase() !== inv.email) return res.status(403).json({ error: 'Please verify your email first.' });
  const db = store.load();
  let r = db.rsvps.find((x) => x.code === inv.code);
  if (r) return res.json(inviteView(inv));
  const n = Math.max(1, Math.min(inv.admit, parseInt(admit, 10) || 1));
  r = { code: inv.code, attending: !!attending, admit: attending ? n : 0, guestName: attending && n > 1 ? String(guestName).slice(0, 80) : '', at: new Date().toISOString(), bookingId: null };
  if (attending) {
    const b = { id: rid('AIO-'), eventId: inv.eventId, tier: 'invite', qty: n, total: 0, method: 'Complimentary', payment: 'free', status: 'confirmed', createdAt: r.at, owner: inv.email, invitation: inv.code, attendee: { name: inv.name, email: inv.email, guest: r.guestName }, tickets: Array.from({ length: n }, () => rid('TK-', 5)), checkins: {} };
    db.bookings.push(b);
    r.bookingId = b.id;
  }
  db.rsvps.push(r);
  store.save();
  res.status(201).json(inviteView(inv));
});

/* ---------- QR check-in ---------- */
app.post('/api/checkin', needUser, needOrganizer, (req, res) => {
  const { eventId, payload } = req.body || {};
  const raw = String(payload || '').trim();
  const parts = raw.split('|');
  const tid = parts.length === 3 ? parts[2] : raw.toUpperCase();
  const db = store.load();
  const b = db.bookings.find((x) => x.tickets.includes(tid)) || (parts.length !== 3 && db.bookings.find((x) => x.id === raw.toUpperCase()));
  const invalid = (reason) => res.json({ result: 'invalid', reason });
  if (parts.length > 1 && (parts.length !== 3 || parts[0] !== 'AIO')) return invalid('This QR code is not an Aionion ticket.');
  if (!b) return invalid('No ticket matches this code.');
  if (parts.length === 3 && parts[1] !== b.id) return invalid('The booking and ticket codes do not match.');
  if (eventId && b.eventId !== eventId) return invalid(`This ticket is for ${findEvent(b.eventId)?.title || 'another event'}.`);
  if (b.status === 'cancelled') return invalid('This booking was cancelled.');
  if (b.payment === 'pending') return invalid('Payment for this booking is still pending.');
  const ticket = b.tickets.includes(tid) ? tid : b.tickets.find((t) => !b.checkins[t]) || b.tickets[0];
  const who = { name: b.attendee.name, ticketType: bookingView(b).tierName, bookingId: b.id, ticketId: ticket, seat: `${b.tickets.indexOf(ticket) + 1} of ${b.qty}` };
  if (b.checkins[ticket]) return res.json({ result: 'already', at: b.checkins[ticket], ...who });
  b.checkins[ticket] = new Date().toISOString();
  store.save();
  res.json({ result: 'success', at: b.checkins[ticket], ...who });
});

app.get('/api/checkin/:eventId/stats', needUser, needOrganizer, (req, res) => {
  const list = store.load().bookings.filter((b) => b.eventId === req.params.eventId && b.status !== 'cancelled');
  res.json({ checkedIn: list.reduce((n, b) => n + Object.keys(b.checkins).length, 0), total: list.reduce((n, b) => n + b.qty, 0) });
});

/* ---------- organizer ---------- */
const org = express.Router();
org.use(needUser, needOrganizer);

function eventStats(e, bookings) {
  const bs = bookings.filter((b) => b.eventId === e.id);
  const live = bs.filter((b) => b.status !== 'cancelled');
  return {
    id: e.id, title: e.title, date: e.date, city: e.city, category: e.category, img: e.img,
    status: e.status || (e.hidden ? 'Invite only' : isPast(e) ? 'Completed' : 'Published'),
    sold: live.reduce((n, b) => n + b.qty, 0), capacity: e.capacity,
    revenue: live.filter((b) => b.payment === 'paid').reduce((n, b) => n + b.total, 0),
    bookings: live.length,
    checkedIn: live.reduce((n, b) => n + Object.keys(b.checkins).length, 0)
  };
}

org.get('/overview', (req, res) => {
  const db = store.load();
  const { eventId } = req.query;
  const bookings = eventId ? db.bookings.filter((b) => b.eventId === eventId) : db.bookings;
  const live = bookings.filter((b) => b.status !== 'cancelled');
  const days = 30;
  const start = new Date(); start.setHours(0, 0, 0, 0); start.setTime(start.getTime() - (days - 1) * DAY);
  const trend = Array.from({ length: days }, (_, i) => ({ date: new Date(start.getTime() + i * DAY).toISOString().slice(0, 10), tickets: 0, revenue: 0 }));
  live.forEach((b) => {
    const i = Math.floor((new Date(b.createdAt) - start) / DAY);
    if (i >= 0 && i < days) { trend[i].tickets += b.qty; if (b.payment === 'paid') trend[i].revenue += b.total; }
  });
  const pay = { paid: 0, free: 0, pending: 0, refunded: 0 };
  bookings.forEach((b) => { pay[b.payment] = (pay[b.payment] || 0) + 1; });
  const events = [...D.EVENTS, ...db.customEvents].filter((e) => !eventId || e.id === eventId).map((e) => eventStats(e, db.bookings)).sort((a, b) => new Date(a.date) - new Date(b.date));
  res.json({
    metrics: {
      ticketsSold: live.reduce((n, b) => n + b.qty, 0),
      revenue: live.filter((b) => b.payment === 'paid').reduce((n, b) => n + b.total, 0),
      bookings: live.length,
      checkedIn: live.reduce((n, b) => n + Object.keys(b.checkins).length, 0),
      last7: trend.slice(-7).reduce((n, d) => n + d.tickets, 0),
      prev7: trend.slice(-14, -7).reduce((n, d) => n + d.tickets, 0)
    },
    trend, payments: pay, events,
    recent: [...bookings].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 8).map(bookingView)
  });
});

org.get('/events', (_req, res) => {
  const db = store.load();
  res.json([...D.EVENTS, ...db.customEvents].map((e) => eventStats(e, db.bookings)).sort((a, b) => new Date(b.date) - new Date(a.date)));
});

org.post('/events', (req, res) => {
  const { title, category, date, time, end = '', city, venue, format = 'In-person', price = 0, capacity, description = '', visibility = 'Public' } = req.body || {};
  if (!title || !category || !date || !time || !city || !venue || !(capacity > 0)) return res.status(400).json({ error: 'Title, category, date, time, city, venue and capacity are required.' });
  const db = store.load();
  const cat = D.CATEGORIES.find((c) => c.key === category);
  const ev = {
    id: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-' + Math.random().toString(36).slice(2, 6),
    title, kicker: `${cat?.name || 'Event'} — ${city}`, tagline: title, subtitle: description.slice(0, 120) || title, category, label: cat?.name || 'Event', speaker: 'vikram',
    date: `${date}T${time}:00+05:30`, end: end || time, city, venue, format, price: Number(price) || 0, seats: Number(capacity), capacity: Number(capacity), attending: 0,
    audience: ['Investors'], interests: [], img: D.IMG.lights, popular: 40, amenities: [], highlights: [], hidden: visibility !== 'Public', invite: visibility !== 'Public',
    status: 'In review', createdAt: new Date().toISOString()
  };
  db.customEvents.push(ev);
  store.save();
  res.status(201).json(eventStats(ev, db.bookings));
});

org.get('/attendees', (req, res) => {
  const { eventId, q = '', payment, checkin, page = 1 } = req.query;
  const db = store.load();
  let rows = [];
  db.bookings.filter((b) => !eventId || b.eventId === eventId).forEach((b) => {
    const ev = findEvent(b.eventId);
    b.tickets.forEach((t, i) => rows.push({ ticketId: t, bookingId: b.id, name: i === 0 ? b.attendee.name : `${b.attendee.name} +${i}`, email: b.attendee.email, mobile: b.attendee.mobile, company: b.attendee.company, event: ev?.title, eventId: b.eventId, tier: bookingView(b).tierName, payment: b.payment, status: b.status, checkedIn: b.checkins[t] || null, createdAt: b.createdAt }));
  });
  if (q) { const s = q.toLowerCase(); rows = rows.filter((r) => [r.name, r.email, r.bookingId, r.ticketId, r.company].join(' ').toLowerCase().includes(s)); }
  if (payment && payment !== 'all') rows = rows.filter((r) => r.payment === payment);
  if (checkin === 'in') rows = rows.filter((r) => r.checkedIn);
  if (checkin === 'out') rows = rows.filter((r) => !r.checkedIn);
  rows.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const per = 25, p = Math.max(1, Number(page));
  res.json({ total: rows.length, page: p, pages: Math.max(1, Math.ceil(rows.length / per)), rows: rows.slice((p - 1) * per, p * per) });
});

org.get('/bookings', (req, res) => {
  const { eventId, q = '', payment, checkin, page = 1 } = req.query;
  const query = String(q).toLowerCase();
  let rows = store.load().bookings.filter((b) => !eventId || b.eventId === eventId).map((b) => ({
    bookingId: b.id, name: b.attendee.name, email: b.attendee.email, event: findEvent(b.eventId)?.title,
    tier: bookingView(b).tierName, qty: b.qty, total: b.total, payment: b.payment, status: b.status,
    checkedIn: Object.keys(b.checkins).length, createdAt: b.createdAt
  }));
  if (query) rows = rows.filter((b) => [b.bookingId, b.name, b.email, b.event].join(' ').toLowerCase().includes(query));
  if (payment && payment !== 'all') rows = rows.filter((b) => b.payment === payment);
  if (checkin === 'in') rows = rows.filter((b) => b.checkedIn > 0);
  if (checkin === 'out') rows = rows.filter((b) => b.checkedIn === 0);
  rows.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const p = Math.max(1, Number(page) || 1), per = 25;
  res.json({ total: rows.length, page: p, pages: Math.max(1, Math.ceil(rows.length / per)), rows: rows.slice((p - 1) * per, p * per) });
});

org.get('/promotions', (_req, res) => res.json(store.load().promotions));
org.post('/promotions', (req, res) => {
  const { code, percent, limit, note = '' } = req.body || {};
  const c = String(code || '').trim().toUpperCase();
  if (!/^[A-Z0-9-]{4,20}$/.test(c) || !(percent > 0 && percent <= 100) || !(limit > 0)) return res.status(400).json({ error: 'Use a 4–20 character code, a 1–100% discount and a usage limit.' });
  const db = store.load();
  if (db.promotions.some((p) => p.code === c)) return res.status(409).json({ error: 'That code already exists.' });
  db.promotions.unshift({ code: c, percent: Number(percent), limit: Number(limit), uses: 0, active: true, note });
  store.save();
  res.status(201).json(db.promotions);
});
org.patch('/promotions/:code', (req, res) => {
  const db = store.load();
  const p = db.promotions.find((x) => x.code === req.params.code);
  if (!p) return res.status(404).json({ error: 'Not found' });
  p.active = !!req.body?.active;
  store.save();
  res.json(db.promotions);
});

org.get('/report.csv', (req, res) => {
  const { eventId } = req.query;
  const db = store.load();
  const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const lines = [['Booking ID', 'Ticket ID', 'Event', 'Attendee', 'Email', 'Mobile', 'Ticket type', 'Payment', 'Amount', 'Booked at', 'Checked in at'].map(esc).join(',')];
  db.bookings.filter((b) => !eventId || b.eventId === eventId).forEach((b) => b.tickets.forEach((t, i) => lines.push([b.id, t, findEvent(b.eventId)?.title, b.attendee.name, b.attendee.email, b.attendee.mobile, bookingView(b).tierName, b.payment, i === 0 ? b.total : 0, b.createdAt, b.checkins[t] || ''].map(esc).join(','))));
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="aionion-${eventId || 'all-events'}-report.csv"`);
  res.send(lines.join('\n'));
});

app.use('/api/organizer', org);

/* ---------- meetings, private requests, newsletter, profile ---------- */
const SLOTS = ['09:30', '10:30', '11:30', '14:00', '15:30', '16:30'];
app.get('/api/meetings/availability', (req, res) => {
  const { date } = req.query;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date || '')) return res.status(400).json({ error: 'date=YYYY-MM-DD required' });
  const booked = store.load().meetings.filter((m) => m.date === date).map((m) => m.time);
  const seed = date.split('-').reduce((a, n) => a + Number(n), 0);
  const busy = SLOTS.filter((_, i) => (seed + i * 7) % 5 === 0);
  res.json(SLOTS.map((time) => ({ time, available: !booked.includes(time) && !busy.includes(time) })));
});

app.post('/api/meetings', (req, res) => {
  const { type, mode, date, time, purpose, notes } = req.body || {};
  if (!type || !mode || !date || !time) return res.status(400).json({ error: 'Meeting type, mode, date and time are required.' });
  const db = store.load();
  if (db.meetings.some((m) => m.date === date && m.time === time)) return res.status(409).json({ error: 'That slot was just taken. Please choose another.' });
  const meeting = { id: rid('MTG-'), type, mode, date, time, purpose: purpose || '', notes: notes || '', manager: 'Priya Natarajan', owner: req.user?.email || null, createdAt: new Date().toISOString() };
  db.meetings.push(meeting);
  store.save();
  res.status(201).json(meeting);
});

app.post('/api/access-requests', (req, res) => {
  const { name, email, experience } = req.body || {};
  if (!name || !validEmail(email)) return res.status(400).json({ error: 'Name and a valid email are required.' });
  const db = store.load();
  const r = { id: rid('REQ-'), name, email, experience: experience || '', clientId: req.body.clientId || '', note: req.body.note || '', createdAt: new Date().toISOString() };
  db.accessRequests.push(r);
  store.save();
  res.status(201).json(r);
});

app.post('/api/newsletter', (req, res) => {
  const { email } = req.body || {};
  if (!validEmail(email)) return res.status(400).json({ error: 'Please enter a valid email.' });
  const db = store.load();
  if (!db.newsletter.includes(email)) db.newsletter.push(email);
  store.save();
  res.status(201).json({ ok: true });
});

app.get('/api/profile', needUser, (req, res) => {
  const views = store.load().bookings.filter((b) => b.owner === req.user.email).map(bookingView);
  res.json({ ...req.user, stats: { attended: views.filter((b) => b.status === 'past').length, upcoming: views.filter((b) => b.status === 'upcoming').length, experts: 9 } });
});

app.put('/api/profile', needUser, (req, res) => {
  ['name', 'mobile', 'city', 'profession', 'company', 'investorType', 'interests', 'prefs'].forEach((k) => { if (req.body && k in req.body) req.user[k] = req.body[k]; });
  store.save();
  res.json(req.user);
});

app.use('/api', (_req, res) => res.status(404).json({ error: 'Not found' }));

/* ---------- serve built client in production ---------- */
const dist = path.join(__dirname, '..', 'client', 'dist');
if (fs.existsSync(dist)) {
  app.use(express.static(dist));
  app.get('*', (_req, res) => res.sendFile(path.join(dist, 'index.html')));
}

const server = app.listen(PORT, () => console.log(`Aionion Events API listening on http://localhost:${PORT}`));
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use by another service. Stop it or set PORT to a free port.`);
    process.exitCode = 1;
    return;
  }
  console.error('Aionion Events API failed to start:', err);
  process.exitCode = 1;
});

let closing = false;
function shutdown() {
  if (closing) return;
  closing = true;
  server.close(() => process.exit(0));
  setTimeout(() => { server.closeAllConnections(); process.exit(0); }, 5000).unref();
}
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
