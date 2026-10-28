import { COMPANY as C, POLICY as P } from './legal.js';

/* Page content for /about, /organizers, /help, /contact and the legal pages.
   Block types: string (paragraph) · { ul } · { table: { head, rows } } · { note } · { faq } · { steps } · { contacts } */

const fee = `${P.convenienceFeePercent}% convenience fee plus ${P.gstOnFeePercent}% GST on that fee`;

export const PAGES = {
  /* ------------------------------------------------------------------ CANCELLATION */
  'cancellation-policy': {
    kind: 'legal',
    eyebrow: 'Policies',
    title: 'Cancellation Policy',
    intro: `How to cancel a booking on ${C.brand}, what you get back, and what happens when an event is changed or called off.`,
    glance: [
      ['calendar', `${P.fullRefundDays}+ days before`, '100% of the ticket amount refunded'],
      ['clock', `${P.fullRefundDays} days – ${P.partialRefundHours} hours`, `${P.partialRefundPercent}% of the ticket amount refunded`],
      ['lock', `Within ${P.partialRefundHours} hours`, 'Cancellation closed, no refund'],
      ['shield', 'Event cancelled by us', '100% refund, including all fees']
    ],
    sections: [
      { id: 'scope', heading: 'Scope', blocks: [
        `This policy applies to every ticket booked on ${C.brand}, the event booking platform operated by ${C.legalName} (“${C.group}”, “we”, “us”). It covers public events, online events, workshops, investor meets and Invite Only tickets on public events. Private invitations and client meetings have their own sections below.`,
        'Where an event page states a different cancellation policy (for example, an event hosted by a third-party organizer), the policy on the event page applies to that event. If the event page is silent, this policy applies.',
        'Time windows are measured from the scheduled start time of the event in Indian Standard Time (IST).'
      ] },
      { id: 'how', heading: 'How to cancel', blocks: [
        { steps: [
          ['Sign in with your booking email', 'Use the same email address you entered as the attendee at checkout.'],
          ['Open My Tickets', 'Find the booking under Upcoming and select Cancel.'],
          ['Review and confirm', 'We show the exact refund amount and any non-refundable charges before you confirm.'],
          ['Receive confirmation', 'Your tickets are cancelled immediately, the QR codes stop working and your seat is released.']
        ] },
        `Booked as a guest or can’t sign in? Email ${C.supportEmail} from your booking email with your Booking ID (for example, AIO-7Q2K9M). The same time windows apply, based on when we receive your request.`
      ] },
      { id: 'windows', heading: 'Cancellation windows', blocks: [
        { table: { head: ['When you cancel', 'Refund of ticket amount', 'Convenience fee & GST'], rows: [
          [`${P.fullRefundDays} days or more before the event`, '100%', 'Not refundable'],
          [`Between ${P.fullRefundDays} days and ${P.partialRefundHours} hours before`, `${P.partialRefundPercent}%`, 'Not refundable'],
          [`Less than ${P.partialRefundHours} hours before`, 'Cancellation closed, no refund', 'Not refundable'],
          ['Free registration', 'Nothing to refund, cancel any time before the start', 'Not applicable'],
          ['Event cancelled by us or the organizer', '100%', 'Refunded in full']
        ] } },
        `The “ticket amount” is the price you actually paid for the tickets after any promo-code discount. The ${fee} covers payment processing and is not refundable when you choose to cancel.`
      ] },
      { id: 'partial', heading: 'Bookings with more than one ticket', blocks: [
        'Cancelling from My Tickets cancels every ticket in that booking. To cancel only some tickets, write to us with the Booking ID and the ticket IDs you want to cancel before the 48-hour cutoff. The same windows apply to each cancelled ticket.',
        'Promo-code redemptions are not reinstated after a cancellation.'
      ] },
      { id: 'changes', heading: 'If we change or cancel an event', blocks: [
        { ul: [
          '**Cancelled event:** you receive a full refund of everything you paid, including the convenience fee and GST. No action is needed; refunds start automatically.',
          '**Postponed or rescheduled event:** your tickets remain valid for the new date. If the new date doesn’t work for you, ask for a full refund within 7 days of our announcement.',
          '**Venue moved to a different city:** you can keep your tickets or request a full refund within 7 days of our announcement. A change of venue within the same city does not qualify for a refund.',
          '**Speaker or agenda changes:** sessions sometimes change speakers or running order. These changes do not qualify for a refund unless the event is materially different from what was advertised.',
          '**In-person event moved online:** you can attend online or request a full refund within 7 days of our announcement.'
        ] },
        'We announce changes by email and SMS or WhatsApp (if you opted in) to the attendee contact details on the booking.'
      ] },
      { id: 'no-refund', heading: 'When no refund is available', blocks: [
        { ul: [
          `Cancellation requests made less than ${P.partialRefundHours} hours before the event starts.`,
          'Not attending (no-show) or arriving after entry has closed.',
          'Being refused entry because the name or photo ID doesn’t match the ticket, the ticket was already scanned, or for behaviour that breaches our Terms of Use or venue rules.',
          'Tickets bought from anyone other than Aionion Events or an authorised partner. Resold tickets may be cancelled without notice.',
          'Events disrupted by causes beyond our reasonable control (see Force majeure). We will still try to reschedule or offer credit where we can.'
        ] }
      ] },
      { id: 'transfers', heading: 'Name changes and transfers', blocks: [
        `Tickets are issued to a named attendee and checked against photo ID. If you can’t attend, you can ask us to change the attendee name free of charge until ${P.partialRefundHours} hours before the event by emailing ${C.supportEmail} with your Booking ID and the new attendee’s name, email and mobile number. A fresh QR ticket is issued and the old one stops working.`,
        'Invite Only tickets and private invitations are personal and cannot be transferred.'
      ] },
      { id: 'invite', heading: 'Invite Only tickets and private invitations', blocks: [
        'Invite Only tickets (unlocked with an access code) and private invitations are complimentary, so there is nothing to refund. If your plans change, please cancel or decline your RSVP as early as possible so the place can be offered to another guest.',
        `To change an RSVP for a private event (for example, from Admit 2 to Admit 1), contact your relationship director or write to ${C.privateEmail}.`
      ] },
      { id: 'online', heading: 'Online events and webinars', blocks: [
        'Free webinars can be cancelled any time before they start. Paid online events follow the same windows as in-person events. Access links are personal; sharing them may lead to cancellation without refund.'
      ] },
      { id: 'meetings', heading: 'Client meetings', blocks: [
        'Meetings booked through Book a Client Meeting are free. Please reschedule or cancel at least 24 hours in advance by contacting your relationship manager, so the slot can be offered to another client.'
      ] },
      { id: 'force-majeure', heading: 'Force majeure', blocks: [
        'We are not responsible for cancellations or changes caused by events beyond our reasonable control, including natural disasters, extreme weather, epidemics, government orders, civil unrest, strikes, or venue or utility failures. In these cases we will reschedule where possible, or offer a refund or credit as described in this policy.'
      ] },
      { id: 'refunds', heading: 'Refund timelines', blocks: [
        `Approved refunds are processed as set out in our Refund & Return Policy: initiated within ${P.refundInitiateDays} working days and usually credited to your original payment method within ${P.refundCreditDays} working days, depending on your bank.`
      ] }
    ],
    related: ['refund-policy', 'terms', 'help']
  },

  /* ------------------------------------------------------------------ REFUND & RETURN */
  'refund-policy': {
    kind: 'legal',
    eyebrow: 'Policies',
    title: 'Refund & Return Policy',
    intro: 'When you are eligible for a refund, how much you get back, how long it takes and where it goes. It also explains how “returns” work for digital tickets and event materials.',
    glance: [
      ['rupee', 'Original payment method', 'Refunds go back to the UPI ID, card, bank or wallet you paid with'],
      ['clock', `${P.refundCreditDays} working days`, `Initiated within ${P.refundInitiateDays} working days; bank timelines vary`],
      ['shield', 'Failed or duplicate payments', 'Reversed in full, automatically'],
      ['ticket', 'Digital tickets', 'A “return” is a cancellation within the policy windows']
    ],
    sections: [
      { id: 'eligibility', heading: 'Refund eligibility', blocks: [
        'You are eligible for a refund when:',
        { ul: [
          'You cancel a paid booking within the windows in our Cancellation Policy (100% of the ticket amount at least 7 days before; 50% between 7 days and 48 hours before).',
          'We or the organizer cancel the event (full refund including all fees).',
          'An event is postponed, moved to another city or moved online, and you request a refund within 7 days of our announcement (full refund including all fees).',
          'Your payment was debited but the booking was not confirmed, or you were charged twice for the same booking (full refund).'
        ] }
      ] },
      { id: 'amounts', heading: 'How refund amounts are calculated', blocks: [
        { table: { head: ['Situation', 'Ticket amount', `Convenience fee (${P.convenienceFeePercent}%) & GST`], rows: [
          ['You cancel 7+ days before', 'Refunded in full', 'Not refunded'],
          ['You cancel 7 days – 48 hours before', `${P.partialRefundPercent}% refunded`, 'Not refunded'],
          ['Event cancelled by us / organizer', 'Refunded in full', 'Refunded'],
          ['Rescheduled or relocated event (you opt out in time)', 'Refunded in full', 'Refunded'],
          ['Failed, pending-then-failed or duplicate payment', 'Refunded in full', 'Refunded']
        ] } },
        'Refunds are calculated on the amount you actually paid. If you used a promo code, the refund is based on the discounted ticket price. Complimentary tickets (free registrations, Invite Only tickets and private invitations) have no amount to refund.',
        'Example: two General tickets at ₹750 each (₹1,500) plus a ₹30 convenience fee and ₹5 GST, total ₹1,535. Cancelled 10 days before the event, you receive ₹1,500. Cancelled 3 days before, you receive ₹750.'
      ] },
      { id: 'timeline', heading: 'Refund timelines', blocks: [
        { steps: [
          ['Request approved', 'Instantly when you cancel in My Tickets, or within 2 working days of an emailed request.'],
          ['Refund initiated', `We send the refund to our payment gateway within ${P.refundInitiateDays} working days and email you the amount and reference number.`],
          ['Credited by your bank', `Usually ${P.refundCreditDays} working days for cards and net banking; UPI and wallets are often faster.`]
        ] },
        `If you haven’t received your refund 10 working days after we confirmed it, contact ${C.supportEmail} with your Booking ID and the refund reference. We will follow up with the payment gateway and your bank.`
      ] },
      { id: 'mode', heading: 'Where refunds are sent', blocks: [
        'Refunds always go back to the original payment method: the same UPI ID, card, bank account or wallet. We cannot refund in cash, to a different account, or as a bank transfer to a third party. If the original card or account is closed, your bank will normally redirect the credit; contact them with the refund reference.'
      ] },
      { id: 'failed', heading: 'Failed, pending and duplicate payments', blocks: [
        'If money left your account but you did not receive a booking confirmation, do not pay again straight away. Most failed payments are reversed automatically by your bank or the payment gateway, in line with Reserve Bank of India timelines. A booking shown as “payment pending” is not valid for entry until the payment is confirmed.',
        `If you were charged twice for the same booking, we refund the duplicate in full once the payment gateway confirms it. Write to ${C.supportEmail} with the transaction references if it isn’t reversed within ${P.refundCreditDays} working days.`
      ] },
      { id: 'returns', heading: 'Returns', blocks: [
        '**Digital tickets.** Tickets are a digital service for a specific date, so they cannot be returned or exchanged for a different event. Returning a ticket means cancelling it within the Cancellation Policy windows, after which the QR code stops working.',
        '**Upgrades.** To move from General to Premium or VIP for the same event, contact us before the event. Upgrades depend on availability and you pay the price difference.',
        '**Event materials.** Research kits, printed materials and any items handed out at events are complimentary and cannot be returned or refunded. If an item is damaged or missing, tell the event desk at the venue or email us within 7 days and we will replace it where possible.',
        '**Recordings and digital content.** Session recordings and downloadable material shared after an event are not refundable once access has been provided.'
      ] },
      { id: 'chargebacks', heading: 'Chargebacks', blocks: [
        'Please contact us before raising a dispute with your bank; most issues are resolved quickly. If a chargeback is raised for a booking, the related tickets are suspended while the dispute is reviewed. Chargebacks found to be unjustified may lead to cancellation of the tickets without refund.'
      ] },
      { id: 'track', heading: 'Tracking a refund', blocks: [
        'Cancelled bookings move to the Cancelled tab in My Tickets, along with the refund amount. You also receive an email confirmation with the refund reference number for your bank.'
      ] }
    ],
    related: ['cancellation-policy', 'terms', 'contact']
  },

  /* ------------------------------------------------------------------ PRIVACY */
  privacy: {
    kind: 'legal',
    eyebrow: 'Policies',
    title: 'Privacy Policy',
    intro: `How ${C.brand} collects, uses, shares and protects your personal data, and the choices and rights you have. Written with the Digital Personal Data Protection Act, 2023 and the Information Technology Act, 2000 in mind.`,
    glance: [
      ['user', 'Only what we need', 'Data to book, admit and support you'],
      ['shield', 'We never sell your data', 'Shared only to run your event and payments'],
      ['lock', 'No card details stored', 'Payments are handled by a certified gateway'],
      ['check', 'You stay in control', 'Access, correct, erase and withdraw consent']
    ],
    sections: [
      { id: 'who', heading: 'Who we are', blocks: [
        `${C.brand} is operated by ${C.legalName} (${C.cin}), with its registered office at ${C.address}. For the personal data described in this policy we are the “Data Fiduciary” under the Digital Personal Data Protection Act, 2023 (DPDP Act).`,
        'This policy covers our website, booking and check-in services, private invitations, client-meeting bookings, newsletters and organizer tools. It does not cover third-party websites linked from our pages.'
      ] },
      { id: 'collect', heading: 'Personal data we collect', blocks: [
        { table: { head: ['Category', 'Examples', 'When'], rows: [
          ['Account', 'Name, email address, sign-in credentials, city, profession, company, investor type', 'When you create an account or update your profile'],
          ['Booking & attendee', 'Attendee name, email, mobile number, company and designation (optional), ticket type, quantity, promo code, access code', 'When you book a ticket'],
          ['Payment', 'Payment method, transaction ID, amount and status. Full card numbers, CVV, UPI PIN and banking passwords are handled by our payment gateway and never stored by us', 'When you pay or receive a refund'],
          ['Event participation', 'Ticket IDs, QR check-in time, RSVP responses, number of guests and guest names for private invitations', 'At the event and when you RSVP'],
          ['Client services', 'Meeting type, preferred mode, date and time, purpose and notes; private-access requests including client ID', 'When you book a meeting or request access'],
          ['Preferences', 'Interests (e.g. Stocks, Mutual Funds), reminders, WhatsApp updates, newsletter and private-invitation preferences', 'When you set them in your profile'],
          ['Technical', 'IP address, device and browser type, pages viewed, error logs; local browser storage for your sign-in session and theme', 'When you use the site']
        ] } },
        'We don’t ask for government ID numbers when you book. Venue staff may look at a photo ID at the entrance to check it matches the ticket name, but we don’t copy or store it.',
        'If you book on behalf of other people, make sure they agree to you sharing their details with us for that purpose.'
      ] },
      { id: 'use', heading: 'How we use your data', blocks: [
        { ul: [
          'To create and secure your account, and sign you in.',
          'To process bookings, payments, cancellations and refunds, and to issue QR tickets and private passes.',
          'To admit you at the venue: verifying tickets, recording check-in and preventing duplicate or fraudulent entry.',
          'To send booking confirmations, tickets, reminders and important changes to an event you booked.',
          'To arrange client meetings and respond to access requests, support queries and grievances.',
          'With your consent, to send newsletters, event recommendations and private invitations matching your interests. You can opt out at any time.',
          'To understand overall attendance and improve our events, using aggregated or de-identified statistics where possible.',
          'To meet legal, tax, accounting and regulatory obligations, and to establish or defend legal claims.'
        ] },
        'We process personal data on the basis of your consent and, where the DPDP Act allows, for legitimate uses such as providing a service you have asked for or meeting a legal obligation.'
      ] },
      { id: 'share', heading: 'Who we share it with', blocks: [
        'We do not sell or rent your personal data. We share it only as needed to deliver our services:',
        { ul: [
          '**Event organizers and hosts**: the attendee list for the event you booked (name, contact details, ticket type, company and designation if provided, and check-in status), so they can run the event and admit you.',
          '**Payment gateways and banks**: to process payments and refunds securely.',
          '**Communication providers**: email, SMS and WhatsApp services, to deliver tickets and updates.',
          '**Venue partners**: limited entry information where a venue requires a guest list for security.',
          '**Technology service providers**: hosting, storage and support tools that process data for us under contract.',
          '**Authorities**: where required by law, court order or a lawful request from a government agency.'
        ] },
        'Our service providers may only use your data to provide services to us, and must protect it to standards at least as strict as ours.'
      ] },
      { id: 'retention', heading: 'How long we keep it', blocks: [
        { ul: [
          'Account data: while your account is active, and for up to 12 months after you ask us to close it.',
          'Booking, payment and invoice records: for as long as tax and accounting laws require (typically 8 years).',
          'Check-in and RSVP records: up to 24 months after the event.',
          'Marketing preferences: until you withdraw consent.',
          'Technical logs: up to 12 months, unless needed to investigate a security incident.'
        ] },
        'When data is no longer needed, we delete or anonymise it.'
      ] },
      { id: 'rights', heading: 'Your rights', blocks: [
        'Subject to the DPDP Act and other applicable law, you can:',
        { ul: [
          '**Access**: get a summary of the personal data we hold about you and how we use it.',
          '**Correct and update**: fix inaccurate or incomplete data (most of it you can edit yourself in Profile).',
          '**Erase**: ask us to delete data we no longer need. Booking and payment records we must keep by law are excepted.',
          '**Withdraw consent**: for marketing and other consent-based uses, at any time. This doesn’t affect anything done before you withdrew.',
          '**Nominate**: name someone to exercise your rights if you die or become incapacitated.',
          '**Grievance redressal**: complain to our Grievance Officer and, if you are not satisfied, to the Data Protection Board of India.'
        ] },
        `To make a request, email ${C.privacyEmail} from your registered email address. We may need to verify your identity before acting on a request.`
      ] },
      { id: 'security', heading: 'How we protect your data', blocks: [
        'We use encryption in transit (HTTPS), access controls based on role (for example, only authorised organizer staff can see attendee lists), secure payment processing through PCI-DSS compliant gateways, and regular review of who has access. No system is completely secure; if a personal data breach affects you, we will notify you and the Data Protection Board as the law requires.'
      ] },
      { id: 'cookies', heading: 'Cookies and browser storage', blocks: [
        'We use essential browser storage to keep you signed in and remember your light or dark theme. These are needed for the site to work. If we add analytics or advertising cookies, we will ask for your consent first and update this policy.'
      ] },
      { id: 'camera', heading: 'Camera use at check-in', blocks: [
        'Our QR check-in screen asks organizer staff for camera access on their own device to read ticket QR codes. Camera frames are processed on that device to read the code and are not recorded or uploaded. Only the ticket code is sent to our servers.'
      ] },
      { id: 'children', heading: 'Children', blocks: [
        'Our services are intended for people aged 18 and over. Students under 18 may attend selected events only with verifiable consent from a parent or legal guardian, who should make the booking. We do not knowingly track minors or send them targeted advertising.'
      ] },
      { id: 'changes', heading: 'Changes to this policy', blocks: [
        'We may update this policy as our services or the law change. Significant changes will be notified by email or on the site before they take effect. The “Last updated” date above shows the latest version.'
      ] },
      { id: 'grievance', heading: 'Grievance Officer', blocks: [
        { contacts: [
          ['Grievance Officer', C.grievanceOfficer],
          ['Email', C.grievanceEmail, `mailto:${C.grievanceEmail}`],
          ['Address', `${C.legalName}, ${C.address}`],
          ['Response time', `Acknowledged within ${P.grievanceAckHours} hours, resolved within ${P.grievanceResolveDays} days`]
        ] }
      ] }
    ],
    related: ['terms', 'cancellation-policy', 'contact']
  },

  /* ------------------------------------------------------------------ TERMS */
  terms: {
    kind: 'legal',
    eyebrow: 'Policies',
    title: 'Terms of Use',
    intro: `The rules for using ${C.brand}: booking tickets, attending events, private invitations and hosting events as an organizer. Please read them along with our Privacy, Cancellation and Refund & Return policies.`,
    glance: [
      ['ticket', `Up to ${P.maxTicketsPerBooking} tickets per booking`, 'Named tickets, checked against photo ID'],
      ['rupee', 'Clear pricing', `Ticket price + ${P.convenienceFeePercent}% fee + GST on fee, shown before you pay`],
      ['qr', 'One scan per ticket', 'Each QR admits one person, once'],
      ['info', 'Educational events', 'Not investment advice']
    ],
    sections: [
      { id: 'acceptance', heading: '1. About these terms', blocks: [
        `These Terms of Use (“Terms”) are an agreement between you and ${C.legalName} (“${C.group}”, “we”, “us”), which operates ${C.brand} at ${C.website}. By browsing, creating an account, booking a ticket, accepting an invitation or listing an event, you agree to these Terms, our Privacy Policy, Cancellation Policy and Refund & Return Policy.`,
        'If you do not agree, please do not use the platform.'
      ] },
      { id: 'eligibility', heading: '2. Eligibility and accounts', blocks: [
        { ul: [
          'You must be at least 18 years old and able to enter a binding contract under Indian law. Minors may attend selected events only when a parent or guardian books and accompanies them, or as the event page allows.',
          'You can book public events as a guest. An account lets you view and manage your tickets in My Tickets.',
          'Keep your sign-in details confidential. You are responsible for activity on your account; tell us immediately if you suspect unauthorised use.',
          'The details you give us must be accurate. Tickets are issued in the attendee’s name and may be checked against photo ID.'
        ] }
      ] },
      { id: 'booking', heading: '3. Booking and pricing', blocks: [
        { ul: [
          'All prices are in Indian Rupees (₹). Ticket prices include applicable taxes unless the event page says otherwise.',
          `A convenience fee of ${P.convenienceFeePercent}% of the ticket amount, plus ${P.gstOnFeePercent}% GST on that fee, is added at checkout. The full total is shown before you pay.`,
          `You can book up to ${P.maxTicketsPerBooking} tickets per booking, subject to availability. Seat availability is shown live and may change while you are checking out.`,
          'Ticket types (General, Premium, VIP and Invite Only) include the benefits listed for that event. Benefits are subject to availability on the day and may be substituted with equivalent benefits.',
          'Invite Only tickets need a valid access code issued by us. Access codes are personal to the people they were issued to.',
          'One promo code can be used per booking. Promo codes have no cash value, cannot be combined, may have usage limits and expiry dates, and can be withdrawn at any time.',
          'A booking is confirmed only when payment succeeds and you receive a confirmation with a Booking ID. We may cancel a booking and refund it in full if there is an obvious pricing error or a payment is reversed.'
        ] }
      ] },
      { id: 'payments', heading: '4. Payments', blocks: [
        'We accept UPI, debit and credit cards, net banking and supported wallets through third-party payment gateways. Your payment is also subject to the gateway’s terms and your bank’s rules. We do not store your full card number, CVV, UPI PIN or banking passwords.'
      ] },
      { id: 'tickets', heading: '5. Tickets and entry', blocks: [
        { ul: [
          'Your ticket is the QR code on your confirmation page, in My Tickets and in your confirmation email. Each ticket admits one person, once. After the first scan, the same QR code cannot be used again.',
          'Carry a government photo ID that matches the attendee name. Entry may be refused if the details don’t match, the ticket was cancelled or already used, or payment is pending.',
          'Doors usually open 30 minutes before the start. Late entry is at the organizer’s discretion and may not be possible once a session has begun.',
          'Venue rules (security checks, prohibited items, dress code and seating) apply. The organizer and venue keep the right of admission.',
          'Tickets may not be resold, auctioned or used for promotions without our written permission. Tickets obtained in breach of this may be cancelled without refund.'
        ] }
      ] },
      { id: 'cancellations', heading: '6. Cancellations, changes and refunds', blocks: [
        'Cancellations and refunds are covered by our Cancellation Policy and Refund & Return Policy, which form part of these Terms. We may change the speakers, agenda, timing or venue of an event where needed; significant changes are handled as described in those policies.'
      ] },
      { id: 'private', heading: '7. Private invitations', blocks: [
        { ul: [
          'Private (HNI) events are not publicly listed. Invitations and access codes are personal, non-transferable and may be withdrawn if shared.',
          'You may be asked to verify the email the invitation was sent to before you RSVP. The number of guests is limited to the “Admit” count on your invitation, and guest details must be accurate.',
          'Unless the host says otherwise, private events follow the Chatham House Rule: you may use what you hear, but must not reveal the identity or affiliation of speakers or other guests.'
        ] }
      ] },
      { id: 'conduct', heading: '8. Your conduct', blocks: [
        'You agree not to:',
        { ul: [
          'Disrupt events or harass speakers, staff or other attendees.',
          'Record, livestream or redistribute sessions without permission.',
          'Solicit attendees for investments, tips or paid services at our events or through the platform.',
          'Copy, scrape or reverse-engineer the platform, or try to get around ticket or access controls.',
          'Use false identities, other people’s payment details or automated tools to book tickets.'
        ] },
        'We may refuse entry, remove attendees or suspend accounts that breach these rules, without refund.'
      ] },
      { id: 'content', heading: '9. Educational content and investment risk', blocks: [
        'Events, sessions, materials and recordings are for education and information only. They are not investment, tax or legal advice, an offer, or a recommendation to buy or sell any security. Speakers’ views are their own. Investments in securities markets carry risk; read our Investment Disclaimer and consult a qualified adviser before acting on anything you learn.'
      ] },
      { id: 'media', heading: '10. Photography and recordings', blocks: [
        'Events may be photographed, filmed or recorded. By attending, you agree that you may appear in this material and that we may use it to report on and promote our events. If you would rather not be photographed, tell the event desk on arrival. Private events are not photographed without the host’s consent.'
      ] },
      { id: 'organizers', heading: '11. Organizers', blocks: [
        { ul: [
          'Organizers must give accurate event details, hold the rights and permits the event needs, and honour the tickets sold.',
          'Events are reviewed before publishing. We may decline, edit for clarity, or unpublish listings that are misleading, unlawful or against these Terms.',
          'Organizers must use attendee data only to run their event, in line with our Privacy Policy and data-protection law, and must not use it for unrelated marketing without consent.',
          'Commercial terms (platform fees, payout schedules and responsibility for refunds) are agreed separately in writing.'
        ] }
      ] },
      { id: 'ip', heading: '12. Intellectual property', blocks: [
        `The ${C.group} name and logo, the platform design, text, graphics and event materials belong to us or our licensors. You may use them only for personal, non-commercial purposes connected to your attendance.`
      ] },
      { id: 'liability', heading: '13. Limitation of liability', blocks: [
        'To the extent the law allows, we are not liable for indirect or consequential losses, or for investment decisions you make based on event content. Our total liability for any claim relating to a booking is limited to the amount you paid for that booking. Nothing in these Terms limits liability that cannot be limited under Indian law, including your rights under the Consumer Protection Act, 2019.'
      ] },
      { id: 'indemnity', heading: '14. Indemnity', blocks: [
        'You agree to compensate us for losses arising from your breach of these Terms or misuse of the platform, including claims by other attendees, venues or organizers.'
      ] },
      { id: 'suspension', heading: '15. Suspension and termination', blocks: [
        'We may suspend or close accounts, or cancel bookings, that involve fraud, abuse, chargeback misuse or serious breaches of these Terms. You can close your account at any time by writing to us. Bookings already made remain subject to these Terms.'
      ] },
      { id: 'law', heading: '16. Governing law and disputes', blocks: [
        `These Terms are governed by the laws of India. Please contact our Grievance Officer first so we can try to resolve any concern. Subject to your statutory rights as a consumer, the courts at ${C.jurisdiction} have exclusive jurisdiction.`
      ] },
      { id: 'changes', heading: '17. Changes to these terms', blocks: [
        'We may update these Terms from time to time. The version in force when you make a booking applies to that booking. Continuing to use the platform after an update means you accept the updated Terms.'
      ] },
      { id: 'contact', heading: '18. Contact and grievances', blocks: [
        { contacts: [
          ['Support', C.supportEmail, `mailto:${C.supportEmail}`],
          ['Grievance Officer', `${C.grievanceOfficer} · ${C.grievanceEmail}`, `mailto:${C.grievanceEmail}`],
          ['Registered office', `${C.legalName}, ${C.address}`]
        ] }
      ] }
    ],
    related: ['privacy', 'cancellation-policy', 'refund-policy', 'disclaimer']
  },

  /* ------------------------------------------------------------------ DISCLAIMER */
  disclaimer: {
    kind: 'legal',
    eyebrow: 'Policies',
    title: 'Investment Disclaimer',
    intro: 'Our events are designed to help you think more clearly about money. Please read this before acting on anything you hear or read at them.',
    sections: [
      { id: 'education', heading: 'Educational purpose only', blocks: [
        'All events, webinars, workshops, presentations, research kits, recordings and other material on Aionion Events are for education and general information only. They do not take your personal financial situation, objectives or risk appetite into account, and are not investment, tax, legal or accounting advice.',
        'Nothing presented is an offer, solicitation or recommendation to buy, sell or hold any security, fund or financial product.'
      ] },
      { id: 'risk', heading: 'Market risk', blocks: [
        { note: 'Investments in securities markets are subject to market risks. Read all the related documents carefully before investing.' },
        'The value of investments can go down as well as up, and you may get back less than you invest. Past performance is not a reliable indicator of future returns. Market data and examples, including those labelled “illustrative”, are for explanation only and may not be current.',
        'Mutual fund investments are subject to market risks; read all scheme-related documents carefully.'
      ] },
      { id: 'speakers', heading: 'Speakers and guests', blocks: [
        `Views expressed by speakers, panellists and guests are their own and may not reflect the views of ${C.group}. Speakers may hold positions in the securities they discuss.`
      ] },
      { id: 'advice', heading: 'Getting personal advice', blocks: [
        'Before making an investment decision, consult a SEBI-registered investment adviser or another qualified professional. Aionion clients can book a meeting with their relationship manager for a discussion based on their own portfolio.'
      ] },
      { id: 'regulatory', heading: 'Regulatory information', blocks: [
        `${C.legalName}. CIN: ${C.cin}. SEBI registration: ${C.sebiReg}.`,
        'Registration granted by SEBI and certification from NISM in no way guarantee the performance of the intermediary or provide any assurance of returns to investors.'
      ] }
    ],
    related: ['terms', 'privacy']
  },

  /* ------------------------------------------------------------------ HELP */
  help: {
    kind: 'help',
    eyebrow: 'Help centre',
    title: 'How can we help?',
    intro: 'Answers to the questions we hear most, from finding an event to walking in with your QR ticket.',
    sections: [
      { id: 'booking', heading: 'Booking tickets', blocks: [{ faq: [
        ['Do I need an account to book?', 'No. Public events support guest checkout: just enter the attendee details. Signing in with the same email later shows the booking in My Tickets.'],
        ['How many tickets can I book at once?', `Up to ${P.maxTicketsPerBooking} per booking, depending on availability. For larger groups, contact us.`],
        ['What’s the difference between General, Premium and VIP?', 'Each event lists the benefits for every ticket type, such as front-section seating, analyst Q&A, research packs or a speaker roundtable. Prices and seats remaining are shown at checkout.'],
        ['What is an Invite Only ticket?', 'A complimentary ticket for Aionion clients and invited guests. Enter the access code you received to unlock it at checkout.'],
        ['How do promo codes work?', 'Enter the code on the payment step. The discount applies to the ticket price, and one code can be used per booking.']
      ] }] },
      { id: 'payments', heading: 'Payments', blocks: [{ faq: [
        ['Which payment methods do you accept?', 'UPI, debit and credit cards, net banking and supported wallets.'],
        ['What are the extra charges?', `A ${fee}. The full breakdown is shown before you pay.`],
        ['My money was debited but I didn’t get a ticket.', `Don’t pay again straight away. Failed payments are usually reversed automatically within ${P.refundCreditDays} working days. If you received a Booking ID, your ticket is valid; otherwise email ${C.supportEmail} with the transaction reference.`],
        ['Is my payment secure?', 'Yes. Payments go through a PCI-DSS compliant gateway over an encrypted connection. We never see or store your full card number, CVV or UPI PIN.']
      ] }] },
      { id: 'tickets', heading: 'Your tickets', blocks: [{ faq: [
        ['Where is my ticket?', 'On your confirmation page, in the confirmation email and in My Tickets (sign in with your booking email). Each ticket has its own QR code.'],
        ['Can I download or print it?', 'Yes. Use Download Ticket and choose “Save as PDF”, or just show the QR code on your phone.'],
        ['Can I change the attendee name?', `Yes, free of charge until ${P.partialRefundHours} hours before the event. Email ${C.supportEmail} with your Booking ID and the new attendee’s details.`],
        ['Can I add it to my calendar?', 'Yes. Use Add to Calendar on the confirmation page or in My Tickets.']
      ] }] },
      { id: 'cancel', heading: 'Cancellations & refunds', blocks: [{ faq: [
        ['How do I cancel?', 'Sign in, open My Tickets and select Cancel. You’ll see the exact refund before you confirm.'],
        ['How much will I get back?', `100% of the ticket amount if you cancel ${P.fullRefundDays}+ days before, ${P.partialRefundPercent}% between ${P.fullRefundDays} days and ${P.partialRefundHours} hours before, and nothing within ${P.partialRefundHours} hours. The convenience fee and GST are non-refundable unless we cancel the event.`],
        ['How long do refunds take?', `Initiated within ${P.refundInitiateDays} working days and usually credited within ${P.refundCreditDays} working days to your original payment method.`],
        ['What if the event is cancelled?', 'You get a full refund, fees included, automatically.']
      ] }] },
      { id: 'event-day', heading: 'On the day', blocks: [{ faq: [
        ['What should I bring?', 'Your QR ticket (on your phone or printed) and a government photo ID matching the attendee name.'],
        ['When should I arrive?', 'Doors usually open 30 minutes before the start. Check-in is a quick QR scan at the entrance.'],
        ['My QR says “already checked in”.', 'Each ticket can be scanned once. If someone else used your ticket, or you have a problem at the door, the event desk can help. Bring your Booking ID.'],
        ['Is the venue accessible?', 'Accessibility and other amenities are listed on each event page. Tell us about any needs in advance and we’ll help.']
      ] }] },
      { id: 'private', heading: 'Private invitations', blocks: [{ faq: [
        ['How do I open my invitation?', 'Use the personal link in your invitation, or enter your access code under Private Events.'],
        ['Why do I need to verify my email?', 'To confirm the invitation is yours. Enter the email address the invitation was sent to.'],
        ['Can I bring a guest?', 'If your invitation says Admit 2, add your guest’s name when you RSVP. Invitations can’t be transferred.']
      ] }] },
      { id: 'organizers', heading: 'For organizers', blocks: [{ faq: [
        ['How do I list an event?', 'Sign in as an organizer and use Create Event. Events are reviewed before publishing.'],
        ['How do I check guests in?', 'Open QR Check-In on any phone, choose the event and scan tickets. Results appear instantly: success, already checked in, or invalid.'],
        ['Can I export my attendee list?', 'Yes. Download a CSV report per event from the organizer dashboard.']
      ] }] }
    ],
    related: ['cancellation-policy', 'refund-policy', 'contact']
  },

  /* ------------------------------------------------------------------ CONTACT */
  contact: {
    kind: 'info',
    eyebrow: 'Contact',
    title: 'Let’s talk.',
    intro: 'Questions about a booking, a private invitation or hosting an event? Reach the right team directly.',
    sections: [
      { id: 'channels', heading: 'Reach the right team', blocks: [{ contacts: [
        ['Bookings & tickets', C.supportEmail, `mailto:${C.supportEmail}`],
        ['Private events & invitations', C.privateEmail, `mailto:${C.privateEmail}`],
        ['Organizers & partnerships', C.organizerEmail, `mailto:${C.organizerEmail}`],
        ['Privacy requests', C.privacyEmail, `mailto:${C.privacyEmail}`],
        ['Phone', C.phone],
        ['Support hours', C.hours]
      ] }] },
      { id: 'tips', heading: 'Help us help you faster', blocks: [
        { ul: [
          'Write from the email address used for the booking.',
          'Include your Booking ID (e.g. AIO-7Q2K9M) and the event name.',
          'For payment issues, add the transaction reference from your bank or UPI app.'
        ] },
        'We reply within one working day. On event days, the event desk at the venue can help in person.'
      ] },
      { id: 'meet', heading: 'Prefer to talk it through?', blocks: [
        'Aionion clients can book a meeting with their relationship manager online, at our office or by phone.'
      ] },
      { id: 'grievance', heading: 'Grievance Officer', blocks: [
        `If you’re not satisfied with our response, you can escalate to our Grievance Officer, in line with the Consumer Protection (E-Commerce) Rules, 2020 and the DPDP Act, 2023. We acknowledge complaints within ${P.grievanceAckHours} hours and aim to resolve them within ${P.grievanceResolveDays} days.`,
        { contacts: [
          ['Name', C.grievanceOfficer],
          ['Email', C.grievanceEmail, `mailto:${C.grievanceEmail}`],
          ['Registered office', `${C.legalName}, ${C.address}`]
        ] }
      ] }
    ],
    cta: ['Book a Meeting', '/meetings'],
    related: ['help', 'cancellation-policy', 'privacy']
  },

  /* ------------------------------------------------------------------ ABOUT */
  about: {
    kind: 'info',
    eyebrow: 'About',
    title: 'Where ideas meet opportunity.',
    intro: `${C.brand} is the events platform of ${C.group}. We bring investors, professionals, entrepreneurs and Aionion clients together for market conversations, wealth sessions, workshops and private gatherings across India.`,
    glance: [
      ['users', '10K+ participants', 'Across investor meets, workshops and webinars'],
      ['calendar', '50+ events', 'In Chennai, Bengaluru, Mumbai, Hyderabad, Delhi and Coimbatore'],
      ['star', '25+ experts', 'Strategists, fund researchers and wealth advisers']
    ],
    sections: [
      { id: 'why', heading: 'Why we exist', blocks: [
        'Good financial decisions start with good conversations. Too many investors learn about money from noise, tips and headlines. We create rooms where people can hear from those who manage real capital, ask honest questions and leave with frameworks they can use.'
      ] },
      { id: 'what', heading: 'What we host', blocks: [{ ul: [
        '**Investor meets**: large-format evenings with live market outlooks and Q&A.',
        '**Stock market and mutual fund sessions**: strategy, allocation and SIP discipline.',
        '**Workshops**: small-group, hands-on sessions on reading balance sheets, risk and tax.',
        '**Financial literacy**: approachable, often free sessions for students and first-time earners.',
        '**Networking**: founders, angels and professionals in the same room.',
        '**Client meets and private events**: relationship days, strategy dinners and roundtables by invitation.'
      ] }] },
      { id: 'principles', heading: 'What we stand for', blocks: [{ ul: [
        '**Education first.** Our events inform; they don’t sell. Content is educational and never a promise of returns.',
        '**Verified events.** Every listing is reviewed before it is published.',
        '**Respect for your time and data.** Transparent pricing, quick QR entry and a privacy policy written in plain language.'
      ] }] }
    ],
    cta: ['Explore Events', '/explore'],
    related: ['contact', 'disclaimer']
  },

  /* ------------------------------------------------------------------ ORGANIZERS */
  organizers: {
    kind: 'info',
    eyebrow: 'For organizers',
    title: 'Host your next investor event.',
    intro: 'Ticketing, private invitations, QR check-in and live analytics, built for financial and professional events.',
    glance: [
      ['ticket', 'Flexible ticketing', 'General, Premium, VIP and Invite Only tiers'],
      ['key', 'Private events', 'Unlisted invitations with RSVP and guest verification'],
      ['scan', 'QR check-in', 'Scan from any phone; results are instant'],
      ['chart', 'Live analytics', 'Sales, revenue, payments and check-ins']
    ],
    sections: [
      { id: 'how', heading: 'How it works', blocks: [{ steps: [
        ['Create your event', 'Add the title, category, date, venue, capacity and ticket price, then choose public or invite-only.'],
        ['We review it', 'Our team checks every listing for accuracy and compliance before it goes live, usually within one working day.'],
        ['Sell and invite', 'Share your event page, run promo codes, or send personal invitations for private sessions.'],
        ['Welcome guests', 'Scan QR tickets at the door and watch check-ins update live.'],
        ['Review results', 'Track revenue and attendance, and export attendee reports as CSV.']
      ] }] },
      { id: 'tools', heading: 'What’s included', blocks: [{ ul: [
        'Organizer dashboard: overview, events, bookings, attendees, check-in, revenue, promotions, reports and settings.',
        'Promo codes with percentage discounts and usage limits.',
        'Attendee lists with payment and check-in status, searchable and exportable.',
        'Secure checkout with UPI, cards, net banking and wallets, with instant QR tickets for your guests.'
      ] }] },
      { id: 'pricing', heading: 'Pricing', blocks: [
        `Attendees pay the ticket price plus a ${fee}, shown clearly before payment. There is no listing fee for free events.`,
        `For paid events, platform fees and payout schedules are agreed with each organizer in writing. Write to ${C.organizerEmail} for a proposal.`,
        { note: 'Organizers are responsible for accurate listings and for using attendee data only to run their event. See section 11 of our Terms of Use.' }
      ] }
    ],
    cta: ['Create Event', '/organizer/events/new'],
    related: ['terms', 'privacy', 'contact']
  }
};
