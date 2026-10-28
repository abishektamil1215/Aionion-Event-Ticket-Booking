const IST = 'Asia/Kolkata';

const part = (iso, opts) => new Intl.DateTimeFormat('en-IN', { timeZone: IST, ...opts }).format(new Date(iso));

export const day = (iso) => part(iso, { day: '2-digit' });
export const mon = (iso) => part(iso, { month: 'short' }).toUpperCase();
export const year = (iso) => part(iso, { year: 'numeric' });
export const shortDate = (iso) => `${day(iso)} ${part(iso, { month: 'short' })}`;
export const longDate = (iso) => `${day(iso)} ${mon(iso)} ${year(iso)}`;
export const weekday = (iso) => part(iso, { weekday: 'short' });
export const time = (iso) => part(iso, { hour: 'numeric', minute: '2-digit', hour12: true }).toUpperCase().replace(':00', '');
export const time24 = (iso) => part(iso, { hour: '2-digit', minute: '2-digit', hour12: false });
export const fullTime = (iso) => part(iso, { hour: '2-digit', minute: '2-digit', hour12: true }).toUpperCase();

export const endTime = (hhmm) => {
  const [h, m] = hhmm.split(':').map(Number);
  const h12 = ((h + 11) % 12) + 1;
  return `${h12}${m ? ':' + String(m).padStart(2, '0') : ''} ${h >= 12 ? 'PM' : 'AM'}`;
};

export const inr = (n) => (n === 0 ? 'Free' : n == null ? 'By invitation' : `₹${n.toLocaleString('en-IN')}`);

export const seatsText = (e) => (e.invite ? `${e.seats} places remain` : e.seats <= 0 ? 'Sold out' : `${e.seats} Seats Left`);
export const isLow = (e) => e.seats > 0 && e.seats / e.capacity < 0.25;
