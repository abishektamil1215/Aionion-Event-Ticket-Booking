export const calendarUrl = (eventId) => import.meta.env.VITE_PREVIEW_ONLY === 'true' ? `/preview-api/events/${eventId}.ics` : `/api/events/${eventId}/ics`;

export const directionsUrl = (e) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${e.venue}, ${e.city}`)}`;

export async function shareEvent(e, toast) {
  const url = `${window.location.origin}/events/${e.id}`;
  try {
    if (navigator.share) await navigator.share({ title: `${e.title} — Aionion Events`, url });
    else { await navigator.clipboard.writeText(url); toast('Event link copied'); }
  } catch { /* share sheet dismissed */ }
}

/** Prints only the credential (see @media print in styles) — "Save as PDF" in the print dialog. */
export function downloadTicket() {
  window.print();
}
