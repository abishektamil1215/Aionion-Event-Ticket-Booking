// Export public demo data only. Never publish the local users/bookings database.
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { spawn } = require('node:child_process');
const { once } = require('node:events');
const root = path.resolve(__dirname, '..');
const output = path.join(root, 'client/public/preview-api');
const port = 20000 + Math.floor(Math.random() * 30000);
const database = path.join(os.tmpdir(), `aionion-preview-${process.pid}-${Date.now()}.json`);
const child = spawn(process.execPath, ['server/index.js'], { cwd: root, env: { ...process.env, PORT: String(port), AIONION_DB_FILE: database }, windowsHide: true, stdio: 'pipe' });
let errors = '';
child.stderr.on('data', chunk => { errors += chunk; });
async function get(url) { const response = await fetch(`http://127.0.0.1:${port}/api${url}`); if (!response.ok) throw new Error(`${url}: ${response.status}`); return response; }
async function main() {
  let ready = false;
  for (let i = 0; i < 100; i++) { try { ready = (await (await get('/health')).json()).ok; if (ready) break; } catch {} await new Promise(resolve => setTimeout(resolve, 50)); }
  if (!ready) throw new Error(`Preview export server unavailable. ${errors}`);
  fs.mkdirSync(path.join(output, 'events'), { recursive: true });
  const catalog = await (await get('/catalog')).json();
  const events = await (await get('/events')).json();
  fs.writeFileSync(path.join(output, 'catalog.json'), JSON.stringify(catalog));
  fs.writeFileSync(path.join(output, 'events.json'), JSON.stringify(events));
  for (const event of events) {
    fs.writeFileSync(path.join(output, 'events', `${event.id}.json`), JSON.stringify(await (await get(`/events/${event.id}`)).json()));
    fs.writeFileSync(path.join(output, 'events', `${event.id}.ics`), await (await get(`/events/${event.id}/ics`)).text());
  }
  console.log(`Exported ${events.length} public demo events. No accounts, bookings or private invitations included.`);
}
main().catch(err => { console.error(err.message); process.exitCode = 1; }).finally(async () => {
  if (child.exitCode === null) { const done = once(child, 'exit'); child.kill(); await done; }
  if (fs.existsSync(database)) fs.unlinkSync(database);
});
