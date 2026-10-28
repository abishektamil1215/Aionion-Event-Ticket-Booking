import { useEffect, useState } from 'react';
import QRCode from 'qrcode';

/* Real, scannable QR code rendered as SVG. */
export default function QR({ value = 'AIONION', label }) {
  const [svg, setSvg] = useState('');
  useEffect(() => {
    let alive = true;
    QRCode.toString(value, { type: 'svg', margin: 0, errorCorrectionLevel: 'M', color: { dark: '#020617', light: '#ffffff' } })
      .then((s) => alive && setSvg(s));
    return () => { alive = false; };
  }, [value]);
  return <span className="qr-svg" role="img" aria-label={label || `QR code ${value}`} dangerouslySetInnerHTML={{ __html: svg }} />;
}

/** Payload format scanned at entry: AIO|<bookingId>|<ticketId> */
export const ticketPayload = (bookingId, ticketId) => `AIO|${bookingId}|${ticketId}`;
