/* Abstract financial visualisations (decorative). */

export function MarketChart({ className }) {
  return (
    <svg viewBox="0 0 700 300" preserveAspectRatio="none" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="mc-line" x1="0" x2="1">
          <stop offset="0" stopColor="#4867FF" stopOpacity="0" />
          <stop offset=".35" stopColor="#4867FF" />
          <stop offset="1" stopColor="#7C4DFF" />
        </linearGradient>
        <linearGradient id="mc-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0023FF" stopOpacity=".28" />
          <stop offset="1" stopColor="#0023FF" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d="M0 250 L60 232 L110 240 L160 205 L210 214 L260 176 L310 186 L360 150 L410 158 L460 118 L510 128 L560 86 L610 96 L700 40 L700 300 L0 300 Z" fill="url(#mc-fill)" opacity=".8" />
      <path className="draw" style={{ '--len': 900, '--d': 0.9 }} d="M0 250 L60 232 L110 240 L160 205 L210 214 L260 176 L310 186 L360 150 L410 158 L460 118 L510 128 L560 86 L610 96 L700 40" fill="none" stroke="url(#mc-line)" strokeWidth="2" />
      <path className="draw" style={{ '--len': 900, '--d': 1.3 }} d="M0 270 L80 262 L150 268 L220 240 L300 248 L380 220 L450 226 L530 196 L610 204 L700 170" fill="none" stroke="rgba(254,102,124,.55)" strokeWidth="1.2" strokeDasharray="3 5" />
      <circle cx="700" cy="40" r="4" fill="#fff" />
      <circle cx="700" cy="40" r="12" fill="none" stroke="#4867FF" strokeOpacity=".5" />
    </svg>
  );
}

export function Spark({ up = true, className = 'spark' }) {
  return (
    <svg viewBox="0 0 72 28" className={className} aria-hidden="true">
      <path d={up ? 'M0 22 L10 18 L18 20 L28 12 L36 14 L46 8 L56 10 L72 3' : 'M0 6 L12 10 L22 8 L32 15 L44 13 L56 20 L72 22'} fill="none" stroke={up ? '#5BE3A8' : '#FE667C'} strokeWidth="1.6" />
    </svg>
  );
}

/* Category atmospheres for the conversation selector */
export function CategoryViz({ kind }) {
  const common = { viewBox: '0 0 600 560', preserveAspectRatio: 'xMidYMid slice', 'aria-hidden': true };
  const glow = (
    <defs>
      <radialGradient id="cv-g" cx="75%" cy="30%" r="70%"><stop offset="0" stopColor="#0023FF" stopOpacity=".55" /><stop offset=".6" stopColor="#7C4DFF" stopOpacity=".08" /><stop offset="1" stopColor="#050816" stopOpacity="0" /></radialGradient>
      <linearGradient id="cv-l" x1="0" x2="1"><stop offset="0" stopColor="#4867FF" stopOpacity="0" /><stop offset="1" stopColor="#8FA2FF" /></linearGradient>
      <pattern id="cv-grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0V40" fill="none" stroke="rgba(255,255,255,.05)" /></pattern>
    </defs>
  );
  const base = <><rect width="600" height="560" fill="url(#cv-grid)" /><rect width="600" height="560" fill="url(#cv-g)" /></>;
  let art = null;

  if (kind === 'candles') {
    const c = [[60, 300, 360, 1], [100, 280, 330, 1], [140, 300, 350, 0], [180, 250, 310, 1], [220, 230, 280, 1], [260, 250, 290, 0], [300, 200, 260, 1], [340, 210, 250, 0], [380, 170, 230, 1], [420, 150, 200, 1], [460, 160, 210, 0], [500, 110, 170, 1], [540, 90, 140, 1]];
    art = c.map(([x, a, b, up], i) => (
      <g key={i} opacity={0.35 + i * 0.05}>
        <line x1={x} x2={x} y1={a - 24} y2={b + 20} stroke={up ? '#8FA2FF' : '#FE667C'} strokeWidth="1" />
        <rect x={x - 8} y={a} width="16" height={b - a} rx="2" fill={up ? 'rgba(72,103,255,.55)' : 'rgba(254,102,124,.45)'} />
      </g>
    ));
  } else if (kind === 'donut') {
    const segs = [[0, 42, '#0023FF'], [42, 70, '#4867FF'], [70, 88, '#7C4DFF'], [88, 100, '#FE667C']];
    const R = 120, C = 2 * Math.PI * R;
    art = (
      <g transform="translate(420 220) rotate(-90)">
        {segs.map(([a, b, col], i) => <circle key={i} r={R} fill="none" stroke={col} strokeOpacity=".75" strokeWidth="26" strokeDasharray={`${((b - a) / 100) * C - 4} ${C}`} strokeDashoffset={-(a / 100) * C} />)}
        <circle r="84" fill="none" stroke="rgba(255,255,255,.08)" />
      </g>
    );
  } else if (kind === 'curve') {
    art = <>
      <path d="M0 470 C150 460 260 420 340 330 S500 120 600 80" fill="none" stroke="url(#cv-l)" strokeWidth="2" />
      <path d="M0 500 C180 495 300 470 380 410 S520 260 600 230" fill="none" stroke="rgba(200,180,140,.5)" strokeWidth="1" strokeDasharray="4 6" />
      {[120, 240, 360, 480].map((x) => <line key={x} x1={x} x2={x} y1="80" y2="520" stroke="rgba(255,255,255,.06)" />)}
    </>;
  } else if (kind === 'steps') {
    art = [0, 1, 2, 3, 4].map((i) => <rect key={i} x={260 + i * 64} y={400 - i * 62} width="52" height={120 + i * 62} rx="10" fill={`rgba(72,103,255,${0.12 + i * 0.1})`} stroke="rgba(143,162,255,.4)" />);
  } else if (kind === 'bars') {
    art = Array.from({ length: 16 }, (_, i) => { const h = 60 + ((i * 37) % 140) + i * 10; return <rect key={i} x={240 + i * 22} y={480 - h} width="12" height={h} rx="3" fill={i === 15 ? '#FE667C' : `rgba(72,103,255,${0.2 + i * 0.03})`} />; });
  } else if (kind === 'nodes') {
    const n = [[420, 180], [520, 260], [360, 320], [470, 390], [300, 200], [560, 140]];
    art = <>
      {n.map(([x, y], i) => n.slice(i + 1).map(([x2, y2], j) => <line key={`${i}-${j}`} x1={x} y1={y} x2={x2} y2={y2} stroke="rgba(143,162,255,.18)" />))}
      {n.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={i === 0 ? 10 : 6} fill={i === 0 ? '#4867FF' : '#0b1838'} stroke="#8FA2FF" />)}
    </>;
  } else if (kind === 'ring') {
    art = [70, 120, 170, 220].map((r, i) => <circle key={r} cx="440" cy="220" r={r} fill="none" stroke={i === 1 ? 'rgba(200,180,140,.5)' : 'rgba(255,255,255,.1)'} strokeDasharray={i % 2 ? '2 6' : undefined} />);
  } else if (kind === 'wave') {
    art = [0, 1, 2].map((i) => <path key={i} d={`M0 ${300 + i * 30} C 100 ${220 + i * 30}, 200 ${380 + i * 30}, 300 ${300 + i * 30} S 500 ${220 + i * 30}, 600 ${300 + i * 30}`} fill="none" stroke={i === 0 ? '#8FA2FF' : 'rgba(143,162,255,.25)'} strokeWidth={i === 0 ? 2 : 1} />);
  }

  return <svg {...common}>{glow}{base}{art}</svg>;
}
