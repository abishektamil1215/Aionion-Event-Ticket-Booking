/* Aionion Events — content data (demo). Served by the API. */

const U = (id, w = 1600) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

const IMG = {
  auditorium: '/images/india/conference.webp',
  stage: '/images/india/market-outlook.webp',
  speaker: '/images/india/market-pulse.webp',
  networking: '/images/india/networking.webp',
  meeting: '/images/india/relationship-day.webp',
  workshop: '/images/india/workshop.webp',
  lights: '/images/india/global-markets.webp',
  panel: '/images/india/risk-workshop.webp',
  boardroom: '/images/india/investor-roundtable.webp',
  discussion: '/images/india/retirement.webp',
  dinner: '/images/india/strategy-dinner.webp',
  lounge: '/images/india/legacy-circle.webp',
  office: U('photo-1497366216548-37526070297c'),
  office2: U('photo-1497366811353-6870744d04b2'),
  webinar: '/images/india/tax-webinar.webp',
  seminar: '/images/india/investor-day.webp',
  chennai: U('photo-1582510003544-4d00b7f74220', 1000),
  bangalore: U('photo-1596176530529-78163a4f7af2', 1000),
  mumbai: U('photo-1529253355930-ddbe423a2ac7', 1000),
  hyderabad: U('photo-1551161242-b5af797b7233', 1000),
  delhi: U('photo-1587474260584-136574528ed5', 1000),
  coimbatore: U('photo-1477587458883-47145ed94245', 1000)
};

const PEOPLE = {
  vikram: '/images/india/vikram.webp',
  ananya: '/images/india/ananya.webp',
  karthik: '/images/india/karthik.webp',
  meera: '/images/india/meera.webp',
  arvind: '/images/india/arvind.webp',
  priya: '/images/india/priya.webp',
  a1: '/images/india/vikram-avatar.webp',
  a2: '/images/india/ananya-avatar.webp',
  a3: '/images/india/arvind-avatar.webp',
  a4: '/images/india/meera-avatar.webp'
};

const CATEGORIES = [
  { key: 'investor-meets', name: 'Investor Meets', icon: 'users', line: 'Large-format investor gatherings with live market views and Q&A.' },
  { key: 'stock-markets', name: 'Stock Markets', icon: 'candles', line: 'Market outlooks, sector strategy and live market briefings.' },
  { key: 'mutual-funds', name: 'Mutual Funds', icon: 'pie', line: 'Allocation masterclasses and SIP discipline for the long run.' },
  { key: 'wealth', name: 'Wealth Management', icon: 'diamond', line: 'Retirement, succession and the architecture of lasting wealth.' },
  { key: 'literacy', name: 'Financial Literacy', icon: 'book', line: 'Approachable sessions that turn money basics into confidence.' },
  { key: 'hni', name: 'HNI Events', icon: 'key', line: 'Invitation-only gatherings for Aionion Private clients.' },
  { key: 'client', name: 'Client Meets', icon: 'chat', line: 'Relationship days and reviews with your Aionion team.' },
  { key: 'workshops', name: 'Workshops', icon: 'cap', line: 'Hands-on, small-group sessions with practical frameworks.' },
  { key: 'networking', name: 'Networking', icon: 'share', line: 'Evenings for founders, investors and professionals to connect.' },
  { key: 'business', name: 'Business Events', icon: 'briefcase', line: 'Professional conferences and conversations for business leaders.' },
  { key: 'general', name: 'General Events', icon: 'sparkle', line: 'Open community events for anyone curious about money.' }
];

const INTERESTS = ['Stocks', 'Mutual Funds', 'Global Markets', 'Tax', 'Retirement', 'Wealth', 'Financial Literacy', 'Entrepreneurship'];
const AUDIENCES = ['Investors', 'HNIs', 'Professionals', 'Entrepreneurs', 'Students', 'Existing clients'];

const SPEAKERS = [
  { id: 'vikram', name: 'Vikram Raghavan', role: 'Chief Market Strategist', company: 'Aionion Capital', expertise: 'Macro & Equity Strategy', img: PEOPLE.vikram, bio: 'Two decades reading Indian market cycles. Vikram leads the house view on equities, rates and sector rotation.', sessions: ['market-outlook-2027', 'money-pechu-chennai', 'market-pulse'] },
  { id: 'ananya', name: 'Ananya Iyer', role: 'Head, Mutual Fund Research', company: 'Aionion Capital', expertise: 'Fund Selection & Allocation', img: PEOPLE.ananya, bio: 'Ananya builds the research framework behind every fund we recommend, with a focus on process and consistency.', sessions: ['mf-masterclass', 'money-pechu-chennai'] },
  { id: 'karthik', name: 'Karthik Subramanian', role: 'Director, Private Wealth', company: 'Aionion Private', expertise: 'Family Office & Succession', img: PEOPLE.karthik, bio: 'Karthik advises founders and families on structuring wealth across generations and asset classes.', sessions: ['retirement', 'founders-evening'] },
  { id: 'meera', name: 'Meera Krishnan', role: 'Head, Investor Education', company: 'Aionion Capital', expertise: 'Financial Literacy', img: PEOPLE.meera, bio: 'Meera has taught over 6,000 first-time investors to read markets calmly and invest with intent.', sessions: ['money-basics', 'balance-sheet', 'investor-day'] },
  { id: 'arvind', name: 'Arvind Menon', role: 'Portfolio Manager, Equities', company: 'Aionion Capital', expertise: 'Risk & Global Markets', img: PEOPLE.arvind, bio: 'Arvind manages long-only equity mandates and speaks on risk, hedging and global allocation.', sessions: ['risk-workshop', 'global-markets'] },
  { id: 'priya', name: 'Priya Natarajan', role: 'Senior Relationship Director', company: 'Aionion Private', expertise: 'Client Advisory & Tax', img: PEOPLE.priya, bio: 'Priya leads client relationships for Aionion Private across South India.', sessions: ['relationship-day', 'tax-webinar'] }
];

const ORGANIZER = { name: 'Aionion Capital', verified: true, since: 2019, events: 58, rating: 4.9, email: 'events@aionion.com', phone: '+91 44 4000 1234' };

const AMENITY = { parking: 'Valet parking', wifi: 'High-speed Wi-Fi', refreshments: 'Refreshments', lunch: 'Lunch', accessible: 'Wheelchair accessible', recording: 'Session recording', kit: 'Research kit', lounge: 'Networking lounge', translation: 'Tamil & English' };

const DEFAULT_THINGS = ['Carry a government photo ID matching the ticket name', 'Doors open 30 minutes before start; QR check-in at the entrance', 'Age 18+ unless stated otherwise', 'Business casual dress code'];

// dates are ISO (IST)
const EVENTS = [
  { id: 'money-pechu-chennai', title: 'Money Pechu Investor Meet Chennai', kicker: 'Investor Meet — Chennai', tagline: 'Talk Money.<br>Think Long Term.', subtitle: 'An evening of markets, mutual funds and honest money conversations', category: 'investor-meets', label: 'Investor Meet', speaker: 'vikram', date: '2026-11-18T17:00:00+05:30', end: '20:30', city: 'Chennai', venue: 'Chennai Trade Centre, Nandambakkam', format: 'In-person', price: 750, seats: 86, capacity: 400, attending: 314, audience: ['Investors', 'Professionals', 'Students'], interests: ['Stocks', 'Mutual Funds', 'Wealth'], img: IMG.auditorium, featured: true, popular: 99, amenities: ['parking', 'refreshments', 'accessible', 'translation', 'kit'], highlights: ['Live market outlook for 2027', 'Mutual fund portfolio clinic', 'Panel: money habits that compound', 'Meet Aionion advisors 1:1'] },
  { id: 'market-outlook-2027', title: 'Market Outlook 2027', kicker: 'Investor Meet — Chennai', tagline: 'Understanding Markets.<br>Building Wealth.', subtitle: 'Navigating Markets, Opportunities & Risk', category: 'stock-markets', label: 'Market Strategy', speaker: 'vikram', date: '2027-01-18T10:00:00+05:30', end: '13:00', city: 'Chennai', venue: 'Aionion Hall, Nungambakkam', format: 'In-person', price: 999, seats: 42, capacity: 180, attending: 128, audience: ['Investors', 'HNIs', 'Professionals'], interests: ['Stocks', 'Global Markets'], img: IMG.stage, featured: true, popular: 98, amenities: ['parking', 'wifi', 'lunch', 'kit', 'recording'], highlights: ['House view on Nifty for 2027', 'Sector rotation framework', 'Risk budgeting workshop', 'Speaker roundtable (VIP)'] },
  { id: 'mf-masterclass', title: 'The Allocation Masterclass', kicker: 'Masterclass — Bengaluru', tagline: 'Fewer Funds.<br>Better Outcomes.', subtitle: 'Building a mutual fund portfolio that lasts', category: 'mutual-funds', label: 'Mutual Funds', speaker: 'ananya', date: '2026-11-14T10:30:00+05:30', end: '13:30', city: 'Bangalore', venue: 'The Courtyard, Indiranagar', format: 'In-person', price: 499, seats: 26, capacity: 120, attending: 94, audience: ['Investors', 'Professionals', 'Students'], interests: ['Mutual Funds', 'Tax'], img: IMG.workshop, featured: true, popular: 88, amenities: ['wifi', 'refreshments', 'kit'], highlights: ['Portfolio overlap check', 'Direct vs regular, explained', 'Live SIP planning'] },
  { id: 'market-pulse', title: 'Weekly Market Pulse', kicker: 'Live Webinar', tagline: 'Thirty Minutes.<br>The Whole Market.', subtitle: 'Our analysts on the week ahead', category: 'stock-markets', label: 'Live Webinar', speaker: 'vikram', date: '2026-10-30T18:00:00+05:30', end: '18:45', city: 'Online', venue: 'Aionion Live', format: 'Online', price: 0, seats: 640, capacity: 1000, attending: 360, audience: ['Investors', 'Students'], interests: ['Stocks', 'Global Markets'], img: IMG.webinar, popular: 92, amenities: ['recording'], highlights: ['Week-ahead market map', 'Live Q&A', 'Replay within 24h'] },
  { id: 'money-basics', title: 'Money Basics for Young Professionals', kicker: 'Workshop — Hyderabad', tagline: 'Your First Salary.<br>Your First Plan.', subtitle: 'Budgeting, saving and starting to invest', category: 'literacy', label: 'Financial Literacy', speaker: 'meera', date: '2026-11-07T11:00:00+05:30', end: '13:00', city: 'Hyderabad', venue: 'T-Works Auditorium, Raidurg', format: 'In-person', price: 0, seats: 58, capacity: 150, attending: 92, audience: ['Students', 'Professionals'], interests: ['Mutual Funds', 'Tax'], img: IMG.seminar, popular: 80, amenities: ['wifi', 'refreshments', 'accessible'], highlights: ['Budget template you keep', 'Your first SIP, live', 'Insurance basics'] },
  { id: 'balance-sheet', title: 'Reading a Balance Sheet', kicker: 'Workshop — Coimbatore', tagline: 'Read the Numbers.<br>Understand the Business.', subtitle: 'A practical session on company fundamentals', category: 'workshops', label: 'Workshop', speaker: 'meera', date: '2026-11-21T10:00:00+05:30', end: '12:30', city: 'Coimbatore', venue: 'Aionion Lounge, RS Puram', format: 'In-person', price: 799, seats: 18, capacity: 60, attending: 42, audience: ['Investors', 'Entrepreneurs', 'Students'], interests: ['Stocks'], img: IMG.boardroom, popular: 70, amenities: ['wifi', 'refreshments', 'kit'], highlights: ['Three statements, one story', 'Red-flag checklist', 'Case study: a real annual report'] },
  { id: 'risk-workshop', title: 'Risk, Hedging & Position Sizing', kicker: 'Workshop — Mumbai', tagline: 'Manage Risk.<br>Stay Invested.', subtitle: 'How professionals protect portfolios', category: 'workshops', label: 'Markets Workshop', speaker: 'arvind', date: '2026-12-05T15:00:00+05:30', end: '18:00', city: 'Mumbai', venue: 'One BKC, Bandra Kurla Complex', format: 'In-person', price: 1999, seats: 9, capacity: 80, attending: 71, audience: ['Investors', 'Professionals', 'HNIs'], interests: ['Stocks', 'Global Markets'], img: IMG.panel, popular: 85, amenities: ['parking', 'wifi', 'refreshments', 'kit'], highlights: ['Position sizing models', 'Hedging with index options', 'Drawdown discipline'] },
  { id: 'retirement', title: 'Retirement, Re-imagined', kicker: 'Wealth Session — Delhi', tagline: 'Plan the Decades<br>Ahead.', subtitle: 'Income, healthcare and legacy planning', category: 'wealth', label: 'Wealth Management', speaker: 'karthik', date: '2026-12-12T11:00:00+05:30', end: '13:30', city: 'Delhi', venue: 'The Aerocity Forum', format: 'Hybrid', price: 1499, seats: 34, capacity: 140, attending: 106, audience: ['Investors', 'HNIs', 'Existing clients'], interests: ['Retirement', 'Tax', 'Wealth'], img: IMG.discussion, popular: 77, amenities: ['parking', 'lunch', 'accessible', 'recording'], highlights: ['Income ladder design', 'Healthcare cost planning', 'Will & nomination essentials'] },
  { id: 'relationship-day', title: 'Client Relationship Day', kicker: 'Client Meet — Chennai', tagline: 'Your Portfolio.<br>Our Full Attention.', subtitle: 'One-to-one reviews with your relationship team', category: 'client', label: 'Client Meet', speaker: 'priya', date: '2026-11-28T10:00:00+05:30', end: '17:00', city: 'Chennai', venue: 'Aionion Capital, Nungambakkam', format: 'In-person', price: 0, seats: 22, capacity: 40, attending: 18, audience: ['Existing clients'], interests: ['Wealth', 'Tax'], img: IMG.office, popular: 60, amenities: ['parking', 'refreshments', 'lounge'], highlights: ['45-minute portfolio review', 'Tax harvesting check', 'Goal tracking'] },
  { id: 'tax-webinar', title: 'Tax-Smart Investing', kicker: 'Live Webinar', tagline: 'Keep More of<br>What You Earn.', subtitle: 'Capital gains, harvesting and structure', category: 'literacy', label: 'Live Webinar', speaker: 'priya', date: '2026-11-03T19:00:00+05:30', end: '20:00', city: 'Online', venue: 'Aionion Live', format: 'Online', price: 0, seats: 410, capacity: 800, attending: 390, audience: ['Investors', 'Professionals'], interests: ['Tax', 'Mutual Funds'], img: IMG.meeting, popular: 82, amenities: ['recording'], highlights: ['New capital gains rules', 'Harvesting calendar', 'Live Q&A'] },
  { id: 'founders-evening', title: 'Founders & Capital Evening', kicker: 'Networking — Bengaluru', tagline: 'Build Companies.<br>Build Wealth.', subtitle: 'Founders, angels and wealth advisors in one room', category: 'networking', label: 'Networking', speaker: 'karthik', date: '2026-11-27T18:30:00+05:30', end: '21:30', city: 'Bangalore', venue: 'The Leela Bhartiya City, Thanisandra', format: 'In-person', price: 1200, seats: 38, capacity: 120, attending: 82, audience: ['Entrepreneurs', 'Investors', 'HNIs'], interests: ['Entrepreneurship', 'Wealth'], img: IMG.networking, popular: 84, amenities: ['parking', 'refreshments', 'lounge'], highlights: ['Founder liquidity planning', 'Angel investing 101', 'Curated introductions'] },
  { id: 'global-markets', title: 'Global Markets Briefing', kicker: 'Briefing — Mumbai', tagline: 'Think Global.<br>Invest Local.', subtitle: 'US, China and what it means for Indian portfolios', category: 'stock-markets', label: 'Global Markets', speaker: 'arvind', date: '2026-12-09T18:00:00+05:30', end: '20:00', city: 'Mumbai', venue: 'Jio World Convention Centre, BKC', format: 'Hybrid', price: 1499, seats: 64, capacity: 220, attending: 140, audience: ['Investors', 'HNIs', 'Professionals'], interests: ['Global Markets', 'Stocks'], img: IMG.lights, popular: 79, amenities: ['parking', 'wifi', 'refreshments', 'recording'], highlights: ['Global macro map', 'LRS & international funds', 'Currency risk explained'] },
  { id: 'investor-day', title: 'Aionion Investor Day — Coimbatore', kicker: 'Community — Coimbatore', tagline: 'Open Doors.<br>Open Conversations.', subtitle: 'A free public day of talks, clinics and Q&A', category: 'general', label: 'General Event', speaker: 'meera', date: '2026-11-15T10:00:00+05:30', end: '16:00', city: 'Coimbatore', venue: 'Codissia Trade Fair Complex', format: 'In-person', price: 0, seats: 220, capacity: 600, attending: 380, audience: ['Investors', 'Students', 'Entrepreneurs'], interests: ['Stocks', 'Mutual Funds', 'Tax'], img: IMG.seminar, popular: 75, amenities: ['parking', 'refreshments', 'accessible', 'translation'], highlights: ['Free portfolio clinics', 'Family finance corner', 'Student track'] },
  // private — not publicly discoverable, reachable only by invitation
  { id: 'legacy-circle', title: 'Legacy Circle', kicker: 'Aionion Private — Mumbai', tagline: 'Wealth That<br>Outlives Us.', subtitle: 'A closed-door conversation on succession', category: 'hni', label: 'Private Experience', speaker: 'karthik', date: '2026-12-18T19:30:00+05:30', end: '22:30', city: 'Mumbai', venue: 'Private residence, Malabar Hill', format: 'In-person', price: null, seats: 6, capacity: 24, attending: 18, audience: ['HNIs'], interests: ['Wealth', 'Retirement'], img: IMG.lounge, invite: true, hidden: true, popular: 50, amenities: ['parking', 'lounge'], highlights: ['Succession frameworks', 'Family charters', 'Dinner with the CIO office'] },
  { id: 'strategy-dinner', title: 'Portfolio Strategy Dinner', kicker: 'Aionion Private — Chennai', tagline: 'An Evening of<br>Considered Thinking.', subtitle: 'Strategy over dinner with our CIO office', category: 'hni', label: 'Private Experience', speaker: 'karthik', date: '2027-01-24T19:30:00+05:30', end: '22:00', city: 'Chennai', venue: 'The Library Room, Chennai', format: 'In-person', price: null, seats: 4, capacity: 16, attending: 12, audience: ['HNIs'], interests: ['Wealth', 'Global Markets'], img: IMG.dinner, invite: true, hidden: true, popular: 55, amenities: ['parking', 'lounge'], highlights: ['CIO house view', 'Seven-course dinner', 'Twelve guests only'] },
  { id: 'investor-roundtable', title: 'Investor Roundtable', kicker: 'Aionion Private — Delhi', tagline: 'Twelve Seats.<br>One Table.', subtitle: 'Founders and investors on the decade ahead', category: 'hni', label: 'Private Experience', speaker: 'vikram', date: '2027-02-06T18:30:00+05:30', end: '21:30', city: 'Delhi', venue: 'Members Club, Lutyens Delhi', format: 'In-person', price: null, seats: 3, capacity: 12, attending: 9, audience: ['HNIs', 'Entrepreneurs'], interests: ['Entrepreneurship', 'Wealth'], img: IMG.boardroom, invite: true, hidden: true, popular: 52, amenities: ['parking', 'lounge'], highlights: ['Closed-door, Chatham House rules', 'Founder & family office mix'] },
  // past
  { id: 'past-quarterly', title: 'Quarterly Market Review', kicker: 'Investor Meet — Chennai', tagline: 'What Changed.<br>What Matters Now.', subtitle: 'The quarter in review with our research desk', category: 'investor-meets', label: 'Investor Meet', speaker: 'vikram', date: '2026-08-29T10:00:00+05:30', end: '12:30', city: 'Chennai', venue: 'Aionion Hall, Nungambakkam', format: 'In-person', price: 0, seats: 0, capacity: 160, attending: 160, audience: ['Investors'], interests: ['Stocks'], img: IMG.stage, popular: 90, amenities: ['parking'], highlights: [] }
];

// Stable covers belong to the event, so different events never share a thumbnail.
const EVENT_COVERS = {
  'money-pechu-chennai': 'conference',
  'market-outlook-2027': 'market-outlook',
  'mf-masterclass': 'workshop',
  'market-pulse': 'market-pulse',
  'money-basics': 'money-basics',
  'balance-sheet': 'balance-sheet',
  'risk-workshop': 'risk-workshop',
  retirement: 'retirement',
  'relationship-day': 'relationship-day',
  'tax-webinar': 'tax-webinar',
  'founders-evening': 'networking',
  'global-markets': 'global-markets',
  'investor-day': 'investor-day',
  'legacy-circle': 'legacy-circle',
  'strategy-dinner': 'strategy-dinner',
  'investor-roundtable': 'investor-roundtable',
  'past-quarterly': 'quarterly-review'
};
EVENTS.forEach((event) => { event.img = `/images/india/${EVENT_COVERS[event.id]}.webp`; });

const CITIES = [
  { name: 'Chennai', lat: '13.0827° N', lng: '80.2707° E', img: IMG.chennai, note: 'Home of Aionion' },
  { name: 'Bangalore', lat: '12.9716° N', lng: '77.5946° E', img: IMG.bangalore, note: 'Founders & professionals' },
  { name: 'Mumbai', lat: '19.0760° N', lng: '72.8777° E', img: IMG.mumbai, note: 'Markets & private wealth' },
  { name: 'Hyderabad', lat: '17.3850° N', lng: '78.4867° E', img: IMG.hyderabad, note: 'Investor education' },
  { name: 'Delhi', lat: '28.6139° N', lng: '77.2090° E', img: IMG.delhi, note: 'Roundtables & policy' },
  { name: 'Coimbatore', lat: '11.0168° N', lng: '76.9558° E', img: IMG.coimbatore, note: 'Family enterprises' }
];

/* Ticket types. `share` = portion of remaining seats allocated to the tier. */
const TIERS = [
  { key: 'general', name: 'General', add: 0, share: 0.7, benefits: ['Reserved seating', 'Session materials', 'Refreshments'] },
  { key: 'premium', name: 'Premium', add: 1000, share: 0.2, benefits: ['Front-section seating', 'Analyst Q&A', 'Research pack'] },
  { key: 'vip', name: 'VIP', add: 3000, share: 0.1, benefits: ['Front-row seating', 'Speaker roundtable', '1:1 portfolio review'] },
  { key: 'invite', name: 'Invite Only', add: null, share: 0, benefits: ['Complimentary for Aionion clients', 'Reserved client section', 'Requires access code'] }
];

/* Access codes unlock the Invite Only tier on public events (demo). */
const ACCESS_CODES = { 'AIONION-CLIENT': 'Aionion client invitation' };

/* Personal invitations to private (hidden) events (demo). */
const INVITATIONS = [
  { code: 'LEGACY-7Q2K', eventId: 'legacy-circle', name: 'Arjun Raman', email: 'arjun.raman@example.com', admit: 2, host: 'Karthik Subramanian' },
  { code: 'DINNER-4M8P', eventId: 'strategy-dinner', name: 'Arjun Raman', email: 'arjun.raman@example.com', admit: 1, host: 'Karthik Subramanian' },
  { code: 'TABLE-9X3D', eventId: 'investor-roundtable', name: 'Lakshmi Sundaram', email: 'lakshmi@example.com', admit: 2, host: 'Vikram Raghavan' }
];

module.exports = { IMG, PEOPLE, CATEGORIES, INTERESTS, AUDIENCES, SPEAKERS, ORGANIZER, AMENITY, DEFAULT_THINGS, EVENTS, CITIES, TIERS, ACCESS_CODES, INVITATIONS };
