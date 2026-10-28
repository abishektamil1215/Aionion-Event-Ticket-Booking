const fs = require('node:fs');
const path = require('node:path');
const net = require('node:net');
const concurrently = require('concurrently');

const root = path.resolve(__dirname, '..');
const lock = path.join(root, '.tmp', 'dev.lock');

function claimLock() {
  fs.mkdirSync(path.dirname(lock), { recursive: true });
  try {
    const existing = Number(fs.readFileSync(lock, 'utf8'));
    if (Number.isInteger(existing) && existing > 0) {
      try { process.kill(existing, 0); console.log('Aionion development is already running. Use its existing terminal and URL; no duplicate servers were started.'); return false; }
      catch (err) { if (err.code !== 'ESRCH') throw err; }
    }
    fs.unlinkSync(lock);
  } catch (err) { if (err.code !== 'ENOENT') throw err; }
  const fd = fs.openSync(lock, 'wx');
  fs.writeFileSync(fd, String(process.pid));
  fs.closeSync(fd);
  process.on('exit', () => {
    try { if (fs.readFileSync(lock, 'utf8') === String(process.pid)) fs.unlinkSync(lock); } catch {}
  });
  return true;
}

function available(port) {
  return new Promise((resolve, reject) => {
    const probe = net.createServer();
    probe.once('error', (err) => err.code === 'EADDRINUSE' ? resolve(false) : reject(err));
    probe.listen(port, () => probe.close(() => resolve(true)));
  });
}

async function main() {
  if (!claimLock()) return;
  for (const port of [Number(process.env.PORT || 5000), 5173]) {
    if (!await available(port)) throw new Error(`Port ${port} is already occupied. Stop the previous development terminal with Ctrl+C before running npm run dev. No additional servers were started.`);
  }
  const { result } = concurrently([
    { command: 'npm --prefix server run dev', name: 'api', prefixColor: 'blue' },
    { command: 'npm --prefix client run dev', name: 'web', prefixColor: 'magenta' }
  ], { cwd: root, prefix: 'name', killOthersOn: ['failure', 'success'] });
  try { await result; } catch { process.exitCode = 1; }
}
main().catch((err) => { console.error(err.message); process.exitCode = 1; });
