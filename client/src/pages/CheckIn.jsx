import { useEffect, useRef, useState } from 'react';
import jsQR from 'jsqr';
import { api, useApi } from '../lib/api.js';
import { Eyebrow } from '../components/ui.jsx';
import Icon from '../components/Icon.jsx';

export default function CheckIn() {
  const { data: events } = useApi('/organizer/events');
  const [eventId, setEventId] = useState('');
  const [payload, setPayload] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [camera, setCamera] = useState(false);
  const video = useRef(null);
  const { data: stats, reload } = useApi(eventId ? `/checkin/${eventId}/stats` : null);
  const submit = async (value) => {
    if (!eventId || !value.trim() || busy) return;
    setCamera(false); setBusy(true); setError(''); setResult(null);
    try { setResult(await api.post('/checkin', { eventId, payload: value })); setPayload(''); reload(); } catch (err) { setError(err.message); } finally { setBusy(false); }
  };
  useEffect(() => {
    if (!camera) return;
    let stream, frame, stopped = false;
    const canvas = document.createElement('canvas');
    const scan = () => {
      if (stopped) return;
      if (video.current?.readyState >= 2) {
        canvas.width = video.current.videoWidth; canvas.height = video.current.videoHeight;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        ctx.drawImage(video.current, 0, 0);
        const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const qr = jsQR(pixels.data, pixels.width, pixels.height);
        if (qr) { submit(qr.data); return; }
      }
      frame = requestAnimationFrame(scan);
    };
    navigator.mediaDevices?.getUserMedia ? navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false }).then(async (value) => {
      stream = value;
      if (stopped) { stream.getTracks().forEach((t) => t.stop()); return; }
      video.current.srcObject = stream; await video.current.play(); frame = requestAnimationFrame(scan);
    }).catch(() => { setError('Camera unavailable. Allow camera access or enter the ticket code below.'); setCamera(false); }) : (setError('Camera scanning requires a secure browser connection. Enter the ticket code below.'), setCamera(false));
    return () => { stopped = true; cancelAnimationFrame(frame); stream?.getTracks().forEach((t) => t.stop()); };
  }, [camera, eventId]);
  return <section className="container workspace-page"><div className="scanner-page stack-24">
    <Eyebrow>At the door</Eyebrow><h1 className="h2">Aionion Event<br /><strong>Check-In</strong></h1>
    <label className="stack-8"><span className="label">Select event</span><select className="control" value={eventId} onChange={(e) => { setCamera(false); setEventId(e.target.value); setResult(null); }}><option value="">Choose an event</option>{events?.map((e) => <option key={e.id} value={e.id}>{e.title}</option>)}</select></label>
    {stats && <p className="muted"><b>{stats.checkedIn}</b> checked in / {stats.total} registered</p>}
    <div className="scanner-window">{camera ? <video ref={video} muted playsInline aria-label="QR camera preview" /> : <><Icon name="scan" /><p>Scan a guest’s digital ticket</p></>}</div>
    <button className="btn btn-primary btn-lg btn-block" disabled={!eventId || busy} onClick={() => { setError(''); setCamera((v) => !v); }}>{camera ? 'Stop camera' : 'Start QR scanner'}</button>
    <form className="stack-16" onSubmit={(e) => { e.preventDefault(); submit(payload); }}><label className="stack-8"><span className="label">Or enter ticket / booking code</span><input className="control" value={payload} onChange={(e) => setPayload(e.target.value)} placeholder="TK-… or AIO-…" required /></label><button className="btn btn-ghost btn-block" disabled={!eventId || busy}>{busy ? 'Checking…' : 'Confirm entry'}</button></form>
    {error && <p className="coral" role="alert">{error}</p>}
    {result && <div className={`scan-result ${result.result}`} role="status"><h2 className="h3">{result.result === 'success' ? 'Entry confirmed' : result.result === 'already' ? 'Already checked in' : 'Invalid ticket'}</h2><p>{result.name || result.reason}</p>{result.ticketType && <p>{result.ticketType} · {result.seat}</p>}{result.at && <p>{new Date(result.at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>}</div>}
  </div></section>;
}
