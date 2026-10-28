import { useMemo, useRef, useState } from 'react';

/* Single-series charts for the organizer dashboard.
   One axis, 2px line / 24px-max bars with 4px data-ends, hairline grid, hover tooltip. */

const SERIES = '#5B78FF';

function niceMax(v) {
  if (v <= 0) return 1;
  const p = Math.pow(10, Math.floor(Math.log10(v)));
  const n = v / p;
  return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10) * p;
}
export const compact = (n) => (n >= 1e7 ? `${(n / 1e7).toFixed(1)}Cr` : n >= 1e5 ? `${(n / 1e5).toFixed(1)}L` : n >= 1e3 ? `${(n / 1e3).toFixed(n >= 1e4 ? 0 : 1)}K` : String(Math.round(n)));
const dayLabel = (iso) => new Date(iso + 'T00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });

function useTip() {
  const [tip, setTip] = useState(null);
  return [tip, setTip];
}

function Frame({ height, children, tip, yTicks, fmt }) {
  return (
    <div className="chart" style={{ height }}>
      <div className="chart-y" aria-hidden="true">{yTicks.slice().reverse().map((t) => <span key={t}>{fmt(t)}</span>)}</div>
      <div className="chart-plot">
        <div className="chart-grid" aria-hidden="true">{yTicks.map((t) => <i key={t} />)}</div>
        {children}
        {tip && (
          <div className="chart-tip" style={{ left: `${tip.x}%` }} role="status">
            <b>{tip.value}</b><span>{tip.label}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export function BarChart({ data, valueKey, height = 220, fmt = compact, valueFmt = (v) => v.toLocaleString('en-IN'), label = 'value' }) {
  const [tip, setTip] = useTip();
  const max = niceMax(Math.max(...data.map((d) => d[valueKey]), 1));
  const ticks = [0, max / 4, max / 2, (3 * max) / 4, max];
  return (
    <Frame height={height} tip={tip} yTicks={ticks} fmt={fmt}>
      <div className="bars" onPointerLeave={() => setTip(null)}>
        {data.map((d, i) => {
          const v = d[valueKey];
          return (
            <button key={d.date} className="bar-slot" aria-label={`${dayLabel(d.date)}: ${valueFmt(v)} ${label}`}
              onPointerEnter={() => setTip({ x: ((i + 0.5) / data.length) * 100, value: valueFmt(v), label: `${dayLabel(d.date)} · ${label}` })}
              onFocus={() => setTip({ x: ((i + 0.5) / data.length) * 100, value: valueFmt(v), label: `${dayLabel(d.date)} · ${label}` })}
              onBlur={() => setTip(null)}>
              <i style={{ height: `${(v / max) * 100}%`, background: SERIES }} />
            </button>
          );
        })}
      </div>
      <div className="chart-x" aria-hidden="true">
        {data.map((d, i) => <span key={d.date} style={{ visibility: i % Math.ceil(data.length / 6) === 0 || i === data.length - 1 ? 'visible' : 'hidden' }}>{dayLabel(d.date)}</span>)}
      </div>
    </Frame>
  );
}

export function AreaChart({ data, valueKey, height = 220, fmt = compact, valueFmt = (v) => `₹${v.toLocaleString('en-IN')}`, label = 'revenue' }) {
  const [tip, setTip] = useTip();
  const [hover, setHover] = useState(null);
  const ref = useRef(null);
  const max = niceMax(Math.max(...data.map((d) => d[valueKey]), 1));
  const ticks = [0, max / 4, max / 2, (3 * max) / 4, max];
  const pts = useMemo(() => data.map((d, i) => [data.length === 1 ? 50 : (i / (data.length - 1)) * 100, 100 - (d[valueKey] / max) * 100]), [data, valueKey, max]);
  const line = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x} ${y}`).join(' ');
  const last = data.length - 1;

  const move = (ev) => {
    const r = ref.current.getBoundingClientRect();
    const i = Math.max(0, Math.min(last, Math.round(((ev.clientX - r.left) / r.width) * last)));
    setHover(i);
    setTip({ x: pts[i][0], value: valueFmt(data[i][valueKey]), label: `${dayLabel(data[i].date)} · ${label}` });
  };

  return (
    <Frame height={height} tip={tip} yTicks={ticks} fmt={fmt}>
      <div className="area" ref={ref} onPointerMove={move} onPointerLeave={() => { setTip(null); setHover(null); }} role="img" aria-label={`${label} per day, last ${data.length} days`}>
        <svg viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d={`${line} L100 100 L0 100 Z`} fill={SERIES} fillOpacity=".1" />
          <path d={line} fill="none" stroke={SERIES} strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinejoin="round" strokeLinecap="round" />
        </svg>
        {hover != null && <span className="crosshair" style={{ left: `${pts[hover][0]}%` }} />}
        {hover != null && <span className="dot" style={{ left: `${pts[hover][0]}%`, top: `${pts[hover][1]}%` }} />}
        <span className="dot end" style={{ left: `${pts[last][0]}%`, top: `${pts[last][1]}%` }} />
      </div>
      <div className="chart-x" aria-hidden="true">
        {data.map((d, i) => <span key={d.date} style={{ visibility: i % Math.ceil(data.length / 6) === 0 || i === last ? 'visible' : 'hidden' }}>{dayLabel(d.date)}</span>)}
      </div>
    </Frame>
  );
}

/** Horizontal labelled bars (one hue; the label carries identity). */
export function BarList({ rows, fmt = (v) => v.toLocaleString('en-IN') }) {
  const max = Math.max(...rows.map((r) => r.value), 1);
  return (
    <ul className="barlist">
      {rows.map((r) => (
        <li key={r.label} title={`${r.label}: ${fmt(r.value)}`}>
          <span className="bl-label">{r.icon}{r.label}</span>
          <span className="bl-track"><i style={{ width: `${(r.value / max) * 100}%` }} /></span>
          <b>{fmt(r.value)}</b>
        </li>
      ))}
    </ul>
  );
}
