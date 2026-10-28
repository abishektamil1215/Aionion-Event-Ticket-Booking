/* Single source for company details and policy numbers used across the legal and help pages.
   Values in [square brackets] are placeholders: replace them with the registered details before launch.
   They render highlighted on the site so none can slip through unnoticed. */

export const COMPANY = {
  brand: 'Aionion Events',
  group: 'Aionion Group',
  legalName: '[Registered company name]',
  cin: '[Corporate Identity Number (CIN)]',
  sebiReg: '[SEBI registration number(s), if applicable]',
  address: '[Registered office address], Chennai, Tamil Nadu, India',
  website: '[www.your-domain.com]',
  supportEmail: '[support@your-domain.com]',
  privateEmail: '[private@your-domain.com]',
  organizerEmail: '[organizers@your-domain.com]',
  privacyEmail: '[privacy@your-domain.com]',
  phone: '[+91 XXXXX XXXXX]',
  hours: 'Monday to Saturday, 9:30 AM – 6:30 PM IST (excluding public holidays)',
  grievanceOfficer: '[Name of Grievance Officer]',
  grievanceEmail: '[grievance@your-domain.com]',
  jurisdiction: 'Chennai, Tamil Nadu'
};

/* Keep in sync with server/index.js (POLICY, quote()). */
export const POLICY = {
  lastUpdated: '27 October 2026',
  fullRefundDays: 7,
  partialRefundHours: 48,
  partialRefundPercent: 50,
  convenienceFeePercent: 2,
  gstOnFeePercent: 18,
  maxTicketsPerBooking: 6,
  refundInitiateDays: 2,
  refundCreditDays: '5–7',
  grievanceAckHours: 48,
  grievanceResolveDays: 30
};

export const POLICY_PAGES = [
  ['terms', 'Terms of Use'],
  ['privacy', 'Privacy Policy'],
  ['cancellation-policy', 'Cancellation Policy'],
  ['refund-policy', 'Refund & Return Policy'],
  ['disclaimer', 'Investment Disclaimer']
];
