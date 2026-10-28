/* Tiny JSON-file store. Swap for a real database in production. */
const fs = require('fs');
const path = require('path');
const { EVENTS, TIERS } = require('./data');

const FILE = process.env.AIONION_DB_FILE || path.join(__dirname, 'db.json');
const ME = 'arjun.raman@example.com';

/* deterministic PRNG so the demo data is stable between resets */
function rng(a) { // mulberry32
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const ALPHA = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const code = (r, n) => Array.from({ length: n }, () => ALPHA[Math.floor(r() * 32)]).join('');

const FIRST = ['Aarav', 'Diya', 'Rohan', 'Ishita', 'Karthik', 'Meenakshi', 'Vikram', 'Sneha', 'Arjun', 'Priya', 'Rahul', 'Kavya', 'Siddharth', 'Ananya', 'Nikhil', 'Lakshmi', 'Harish', 'Divya', 'Suresh', 'Pooja', 'Manoj', 'Revathi', 'Aditya', 'Nandini', 'Ganesh', 'Swathi', 'Varun', 'Keerthana', 'Prakash', 'Shalini'];
const LAST = ['Iyer', 'Raman', 'Subramanian', 'Krishnan', 'Menon', 'Nair', 'Sharma', 'Reddy', 'Rao', 'Pillai', 'Venkatesh', 'Shah', 'Gupta', 'Natarajan', 'Sundaram', 'Kumar', 'Bhat', 'Joshi', 'Mehta', 'Chandran'];
const COMPANY = ['Infosys', 'Zoho', 'TCS', 'Freshworks', 'HDFC Bank', 'Self-employed', 'Ashok Leyland', 'Wipro', 'Startup founder', 'Chartered Accountant', '', '', ''];

function seedBookings() {
  const r = rng(20261027);
  const out = [
    { id: 'AIO-7Q2K9M', eventId: 'market-outlook-2027', tier: 'premium', qty: 1, total: 2046, method: 'UPI', payment: 'paid', status: 'confirmed', createdAt: '2026-10-12T09:21:00Z', owner: ME, attendee: { name: 'Arjun Raman', email: ME, mobile: '+91 98400 12345', company: 'Raman Ventures', designation: 'Founder' }, tickets: ['TK-58201'], checkins: {} },
    { id: 'AIO-3HX81P', eventId: 'money-pechu-chennai', tier: 'general', qty: 2, total: 1535, method: 'Card', payment: 'paid', status: 'confirmed', createdAt: '2026-10-02T14:05:00Z', owner: ME, attendee: { name: 'Arjun Raman', email: ME, mobile: '+91 98400 12345', company: 'Raman Ventures', designation: 'Founder' }, tickets: ['TK-44120', 'TK-44121'], checkins: {} },
    { id: 'AIO-1BV77D', eventId: 'past-quarterly', tier: 'general', qty: 1, total: 0, method: 'Free', payment: 'free', status: 'confirmed', createdAt: '2026-08-20T10:00:00Z', owner: ME, attendee: { name: 'Arjun Raman', email: ME }, tickets: ['TK-30988'], checkins: { 'TK-30988': '2026-08-29T09:41:00+05:30' } },
    { id: 'AIO-9MM20C', eventId: 'risk-workshop', tier: 'general', qty: 1, total: 2046, method: 'Net Banking', payment: 'refunded', status: 'cancelled', createdAt: '2026-09-18T08:40:00Z', owner: ME, attendee: { name: 'Arjun Raman', email: ME }, tickets: ['TK-41007'], checkins: {} }
  ];
  const mine = { 'market-outlook-2027': 1, 'money-pechu-chennai': 2, 'past-quarterly': 1 };
  const now = Date.parse('2026-10-27T12:00:00+05:30');

  EVENTS.filter((e) => !e.invite).forEach((e) => {
    let left = e.attending - (mine[e.id] || 0);
    const evTime = Date.parse(e.date);
    const end = Math.min(now, evTime - 3600e3);
    while (left > 0) {
      const qty = Math.min(left, r() < 0.62 ? 1 : r() < 0.8 ? 2 : 3);
      left -= qty;
      const fn = FIRST[Math.floor(r() * FIRST.length)];
      const ln = LAST[Math.floor(r() * LAST.length)];
      const tierRoll = r();
      const tier = !e.price ? 'general' : tierRoll < 0.72 ? 'general' : tierRoll < 0.92 ? 'premium' : 'vip';
      const t = TIERS.find((x) => x.key === tier);
      const sub = e.price ? (e.price + t.add) * qty : 0;
      const fee = Math.round(sub * 0.02);
      const total = sub + fee + Math.round(fee * 0.18);
      const roll = r();
      const payment = !e.price ? 'free' : roll < 0.03 ? 'pending' : roll < 0.05 ? 'refunded' : 'paid';
      const created = new Date(end - Math.pow(r(), 1.6) * 40 * 864e5);
      const tickets = Array.from({ length: qty }, () => 'TK-' + code(r, 5));
      const checkins = {};
      if (evTime < now) tickets.forEach((tk) => { if (r() < 0.93) checkins[tk] = new Date(evTime - r() * 40 * 60e3).toISOString(); });
      const email = `${fn}.${ln}`.toLowerCase() + '@example.com';
      out.push({
        id: 'AIO-' + code(r, 6), eventId: e.id, tier, qty, total, method: !e.price ? 'Free' : ['UPI', 'UPI', 'UPI', 'Card', 'Net Banking', 'Wallet'][Math.floor(r() * 6)],
        payment, status: payment === 'refunded' ? 'cancelled' : 'confirmed', createdAt: created.toISOString(), owner: email,
        attendee: { name: `${fn} ${ln}`, email, mobile: `+91 9${Math.floor(r() * 1e9).toString().padStart(9, '0')}`, company: COMPANY[Math.floor(r() * COMPANY.length)], designation: '' },
        tickets, checkins, seed: true
      });
    }
  });
  return out;
}

function seed() {
  return {
    users: [
      { email: ME, name: 'Arjun Raman', first: 'Arjun', role: 'member', mobile: '+91 98400 12345', city: 'Chennai', profession: 'Founder', company: 'Raman Ventures', investorType: 'Experienced investor', clientId: 'AC-204817', tier: 'Aionion Private', memberSince: '2023', interests: ['Stocks', 'Mutual Funds', 'Wealth'], prefs: { reminders: true, whatsapp: true, newsletter: false, privateInvites: true } },
      { email: 'organizer@aionion.com', name: 'Aionion Events Team', first: 'Events Team', role: 'organizer', city: 'Chennai', memberSince: '2019', interests: [], prefs: {} }
    ],
    bookings: seedBookings(),
    customEvents: [],
    promotions: [
      { code: 'EARLYBIRD', percent: 15, uses: 64, limit: 200, active: true, note: 'Early bird — all public events' },
      { code: 'CLIENT20', percent: 20, uses: 31, limit: 100, active: true, note: 'Aionion clients' },
      { code: 'STUDENT50', percent: 50, uses: 12, limit: 50, active: false, note: 'Students with valid ID' }
    ],
    rsvps: [],
    meetings: [],
    accessRequests: [],
    newsletter: [],
    emails: []
  };
}

let db;

function load() {
  if (db) return db;
  try {
    db = JSON.parse(fs.readFileSync(FILE, 'utf8'));
    if (!db.users) throw new Error('old schema');
  } catch {
    db = seed();
    save();
  }
  return db;
}

function save() {
  fs.writeFileSync(FILE, JSON.stringify(db));
}

module.exports = { load, save };
