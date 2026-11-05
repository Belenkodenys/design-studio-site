// Four service packages shown in the Services accordion on the homepage and
// as detail pages at /clients/proposal/<slug>. Old, more granular slugs are
// redirected to these in vercel.json.
export const sections = [
  {
    slug: 'concept-interior',
    title: 'Concept & Interior',
    body: 'Positioning, space planning and interior design for a restaurant, bar or hotel venue — a room that earns from every square foot and stays relevant for years.',
    longDescription: 'We start with the business, not the mood board: who the guest is, what the average check should be, how many seats the room needs, how fast tables should turn. From that we build the concept, the layout and the interior — seating, flow, light, material, detail.\n\nEvery interior eventually goes silent. At first it speaks — loud and confident. Then guests get used to it and stop seeing it. We design against that: ideas driven by positioning rather than trends, and details that keep bringing the guest back.\n\nDeliverables run from concept presentation and 3D visualisation to full construction drawings, finish schedules and lighting design.',
    bullets: [
      'Concept & positioning, guest-journey mapping',
      'Space planning: seating density, guest and staff flow, operational zones',
      'Interior design: materials, lighting, custom joinery and furniture',
      'Construction documentation and on-site design oversight'
    ],
    gallery: [
      { src: '/fresh-01.jpg', alt: 'Vintage dining room with tapestry armchairs' },
      { src: '/fresh-02.jpg', alt: 'Set table with glass birds suspended from the ceiling' },
      { src: '/fresh-03.jpg', alt: 'Wine cabinet and plant branches in the dining room' },
      { src: '/fresh-04.jpg', alt: 'Dining room with fabric ceiling and spring branches' },
      { src: '/fresh-05.jpg', alt: 'Bar area with candles and mirrors' },
      { src: '/fresh-06.jpg', alt: 'Wine bar with chandelier and mirrors' },
      { src: '/fresh-07.jpg', alt: 'Facade of the Mimosa wine bar with glasses in the foreground' },
      { src: '/fresh-08.jpg', alt: 'Dining room with floral installation and original wallpaper' },
      { src: '/fresh-09.jpg', alt: 'Bar with a glass ceiling installation and stone counter' },
      { src: '/fresh-10.jpg', alt: 'Lounge area with a massive chandelier and velvet furniture' },
      { src: '/fresh-11.jpg', alt: 'Outdoor scene with two women at an autumn café' },
      { src: '/fresh-12.jpg', alt: 'Restaurant dining room behind a painted shopfront' }
    ]
  },
  {
    slug: 'full-service',
    title: 'Full-Service',
    body: 'Concept → design → FF&E → opening. One team and one point of accountability from the first sketch to the first guest.',
    longDescription: 'Full-Service is for owners who want one team responsible for the result. We take the venue from concept and architecture through interior, brand, menu structure, uniforms and content, to FF&E procurement, construction administration and the opening itself. No seams between contractors, one plan, one budget, one outcome.\n\nFF&E is handled in-house: sourcing tuned to contract loads and depreciation, direct contracts with manufacturers, price and lead-time negotiation, logistics, delivery and installation control. We budget realistically from day one — with hidden line items and a risk reserve — and keep the project on schedule as a system, not by luck.\n\nFor projects outside Spain we work alongside a local architect of record and general contractor, with remote project management and site visits at the key stages.',
    bullets: [
      'Single team from concept to opening — one contract, one schedule, one estimate',
      'Architecture, interior, brand, menu structure, uniforms, content',
      'FF&E: specification, sourcing, procurement, logistics, installation',
      'Budgeting, construction administration and pre-opening support'
    ],
    gallery: []
  },
  {
    slug: 'brand-experience',
    title: 'Brand & Guest Experience',
    body: 'Identity, menu, tableware, uniforms and service behaviour designed as one system — so what the guest remembers is what you intended.',
    longDescription: 'A brand isn\'t what you say about yourself. It\'s what the guest carries with them — sometimes in their pocket, sometimes in their head. We design every point of contact into a single logic: from the first Instagram post to the sign above the door, the menu in their hands, the plate in front of them, the person who serves it and the way they leave.\n\nThe guest arrives twice — first in your feed, then in the dining room. So the same visual language runs through identity, printed matter, tableware, uniforms, the launch and the event calendar that fills the weekdays.',
    bullets: [
      'Visual identity, naming, signage and printed matter',
      'Menu structure built around the concept and the economics',
      'Tableware, uniforms and service behaviour as part of the set',
      'Launch strategy, content and digital presence'
    ],
    link: { href: '/branding', label: 'See our branding work' },
    gallery: []
  },
  {
    slug: 'consulting',
    title: 'Consulting / Audit',
    body: 'A location check before you sign the lease, an audit of a venue that\'s slipping, or a second opinion on someone else\'s project — an outside view before a mistake gets expensive.',
    longDescription: 'Not every project needs the full cycle. Sometimes you need a sharp outside view: is this site right for the concept, why is a running venue losing guests, is the design another studio proposed going to earn. We do focused sessions — one day, one week, or a remote review — and come back with a clear diagnosis and a prioritised list of moves.\n\nOften it takes one precise change, not a rebuild, to make a space start speaking again.',
    bullets: [
      'Location and lease assessment before signing',
      'Audit of an operating venue: layout, atmosphere, menu, service',
      'Second opinion on a concept or design by another studio',
      'Remote review or on-site deep-dive'
    ],
    gallery: []
  }
]

export function findSection(slug) {
  return sections.find((s) => s.slug === slug)
}
