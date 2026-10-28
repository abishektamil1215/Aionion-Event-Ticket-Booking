const { test } = require('node:test');
const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');
const path = require('node:path');
const os = require('node:os');
const fs = require('node:fs');
const { once } = require('node:events');

test('every demo event has its own existing local cover image', () => {
  const { EVENTS } = require('./data');
  assert.equal(new Set(EVENTS.map((event) => event.img)).size, EVENTS.length, 'Event covers must not be reused across events');
  for (const event of EVENTS) {
    assert.ok(event.img.startsWith('/images/india/'), event.title);
    assert.ok(fs.existsSync(path.join(__dirname, '../client/public', event.img)), `Missing cover for ${event.title}`);
  }
});

test('discovery → guest booking → QR check-in and private RSVP', { timeout: 20000 }, async (t) => {
  const port = 20000 + Math.floor(Math.random() * 30000);
  const dbFile = path.join(os.tmpdir(), `aionion-smoke-${process.pid}-${Date.now()}.json`);
  const child = spawn(process.execPath, ['index.js'], { cwd: __dirname, env: { ...process.env, PORT: String(port), AIONION_DB_FILE: dbFile }, stdio: 'pipe', windowsHide: true });
  let output = '';
  child.stdout.on('data', (chunk) => { output += chunk; });
  child.stderr.on('data', (chunk) => { output += chunk; });
  t.after(async () => { if (child.exitCode === null) { const done = once(child, 'exit'); child.kill(); await done; } if (fs.existsSync(dbFile)) fs.unlinkSync(dbFile); });
  const request = async (url, body, token) => {
    const response = await fetch(`http://127.0.0.1:${port}/api${url}`, { method: body ? 'POST' : 'GET', headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }, body: body ? JSON.stringify(body) : undefined });
    return { status: response.status, data: await response.json() };
  };
  let ready = false;
  for (let i = 0; i < 100; i++) { try { ready = (await request('/health')).data.ok; if (ready) break; } catch {} await new Promise((resolve) => setTimeout(resolve, 50)); }
  assert.ok(ready, output);
  const events = (await request('/events')).data;
  assert.ok(events.length > 0);
  const event = events.find((e) => e.price > 0 && e.seats > 5);
  assert.ok(event);
  const detail = (await request(`/events/${event.id}`)).data;
  assert.ok(detail.tiers.length >= 3);
  const quote = (await request('/quote', { eventId: event.id, tier: 'general', qty: 2, promo: 'EARLYBIRD' })).data;
  assert.equal(quote.total, quote.subtotal - quote.discount + quote.fee + quote.tax);
  assert.ok(quote.discount > 0);
  assert.equal((await request('/quote', { eventId: event.id, tier: 'general', promo: 'BAD-CODE' })).status, 400);
  const attendee = { name: 'Smoke Test Guest', email: 'smoke@example.com', mobile: '+91 9876543210', company: 'Test Company', designation: 'Analyst' };
  assert.equal((await request('/bookings', { eventId: event.id, attendee: {} })).status, 400);
  assert.equal((await request('/bookings', { eventId: event.id, tier: 'invite', attendee })).status, 403);
  const booked = await request('/bookings', { eventId: event.id, tier: 'general', qty: 2, promo: 'EARLYBIRD', attendee, method: 'Wallet' });
  assert.equal(booked.status, 201);
  const booking = booked.data;
  assert.equal(booking.total, quote.total);
  assert.equal(booking.attendee.company, attendee.company);
  assert.equal(booking.tickets.length, 2);
  assert.equal((await request(`/bookings/${booking.id}`)).data.id, booking.id);
  const payload = `AIO|${booking.id}|${booking.tickets[0]}`;
  assert.equal((await request('/checkin', { eventId: event.id, payload })).status, 401);
  const member = (await request('/auth/login', { email: attendee.email, password: 'demo123' })).data;
  assert.equal((await request('/bookings', null, member.token)).data.some((b) => b.id === booking.id), true);
  assert.equal((await request('/checkin', { eventId: event.id, payload }, member.token)).status, 403);
  const organizer = (await request('/auth/login', { email: 'organizer@aionion.com', password: 'demo123' })).data;
  assert.equal((await request('/checkin', { eventId: event.id, payload: `AIO|WRONG|${booking.tickets[0]}` }, organizer.token)).data.result, 'invalid');
  assert.equal((await request('/checkin', { eventId: event.id, payload }, organizer.token)).data.result, 'success');
  assert.equal((await request('/checkin', { eventId: event.id, payload }, organizer.token)).data.result, 'already');
  assert.equal((await request('/checkin', { eventId: event.id, payload: 'TK-INVALID' }, organizer.token)).data.result, 'invalid');
  const overview = await request('/organizer/overview', null, organizer.token);
  assert.equal(overview.status, 200);
  assert.ok(overview.data.metrics.ticketsSold >= 2);
  assert.equal(overview.data.trend.length, 30);
  const bookingSearch = await request(`/organizer/bookings?q=${booking.id}`, null, organizer.token);
  assert.equal(bookingSearch.data.total, 1);
  assert.equal(bookingSearch.data.rows[0].qty, 2);
  const invite = '/invitations/LEGACY-7Q2K';
  assert.equal((await request(`${invite}/verify`, { email: 'wrong@example.com' })).status, 403);
  assert.equal((await request(`${invite}/verify`, { email: 'arjun.raman@example.com' })).status, 200);
  const rsvp = await request(`${invite}/rsvp`, { email: 'arjun.raman@example.com', attending: true, admit: 2, guestName: 'Test Guest' });
  assert.equal(rsvp.status, 201);
  assert.ok(rsvp.data.rsvp.bookingId);
  const repeated = await request(`${invite}/rsvp`, { email: 'arjun.raman@example.com', attending: true, admit: 2 });
  assert.equal(repeated.data.rsvp.bookingId, rsvp.data.rsvp.bookingId);
  const created = await request('/organizer/events', { title: 'Test Conference', category: 'business', date: '2027-12-01', time: '10:00', city: 'Chennai', venue: 'Test Hall', capacity: 100, price: 750 }, organizer.token);
  assert.equal(created.status, 201);
  assert.equal(created.data.status, 'In review');
  assert.equal((await request('/events')).data.some((e) => e.id === created.data.id), false);

  // cancellation policy: 100% of ticket amount 7+ days out, 50% from 7 days to 48 hours, closed inside 48 hours; fees non-refundable
  const preview = (await request(`/bookings/${booking.id}/cancel-preview`, null, member.token)).data;
  const hours = (new Date(detail.date) - Date.now()) / 36e5;
  if (hours >= 48) {
    const pct = hours >= 168 ? 100 : 50;
    assert.equal(preview.percent, pct);
    assert.equal(preview.refund, Math.round((quote.subtotal - quote.discount) * pct / 100));
    assert.equal(preview.nonRefundable, booking.total - preview.refund);
    const cancelled = await request(`/bookings/${booking.id}/cancel`, {}, member.token);
    assert.equal(cancelled.status, 200);
    assert.equal(cancelled.data.refund.amount, preview.refund);
    assert.equal((await request(`/bookings/${booking.id}/cancel`, {}, member.token)).status, 409);
  } else {
    assert.equal(preview.allowed, false);
  }
});
