'use client'

import ProposalFooter from '../clients/proposal/ProposalFooter'
import './awards.css'

// Verified international wins (research as of 21 Nov 2026).
const WINS = [
  {
    year: '2024',
    award: 'FoodInSpace Awards',
    status: 'Winner',
    note: 'Two categories, two projects',
    entries: [
      { project: 'Pixi', city: 'Istanbul, Turkey', category: 'Club', href: '/project/4', image: '/projects/belenko-interior-design-pixi-restaurant-istanbul-1.webp' },
      { project: 'Mamaliga', city: 'Odesa, Ukraine', category: 'Ethnic', href: '/project/3', image: '/projects/belenko-interior-design-mamaliga-restaurant-odesa-1.webp' }
    ]
  },
  {
    year: '2023',
    award: 'Kyoto Global Design Awards',
    status: 'Laureate',
    note: 'Restaurant / Hotel / Bar',
    entries: [
      { project: 'Nikos', city: 'Odesa, Ukraine', category: 'Restaurant / Hotel / Bar', href: '/project/7', image: '/projects/belenko-interior-design-nikos-restaurant-odesa-1.webp' }
    ]
  },
  {
    year: '2022',
    award: 'Restaurant & Bar Design Awards',
    status: 'Winner',
    note: 'Europe — Café',
    entries: [
      { project: 'Nikos Greek Bistro', city: 'Odesa, Ukraine', category: 'Café, Europe', href: '/project/7', image: '/projects/belenko-interior-design-nikos-restaurant-odesa-1.webp' }
    ]
  }
]

// Finalists, shortlists and entries.
const SHORTLIST = [
  { year: '2024', award: 'Mix Awards North', project: 'Mamaliga', result: 'Finalist — Project of the Year, Bar & Leisure Interiors' },
  { year: '2024', award: 'FoodInSpace Awards', project: 'Mamaliga', result: 'Finalist — Ceiling' },
  { year: '2024', award: 'FoodInSpace Awards', project: 'Pixi', result: 'Finalist — Lighting' },
  { year: '2024', award: 'Restaurant & Bar Design Awards', project: 'Mamaliga', result: 'Shortlist — Surface Interiors' },
  { year: '2024', award: 'Restaurant & Bar Design Awards', project: 'Pixi', result: 'Entry — Lighting, Luxury, Ceiling' },
  { year: '2019', award: 'Restaurant & Bar Design Awards', project: 'Frebule, Odesa', result: 'Shortlist — Europe Restaurant' },
  { year: '2017', award: 'Restaurant & Bar Design Awards', project: 'Gra z Vognem, Kyiv', result: 'Shortlist' },
  { year: '2014', award: 'Restaurant & Bar Design Awards', project: '—', result: 'Shortlist' },
  { year: '2013', award: 'Restaurant & Bar Design Awards', project: 'Banka · Steakhouse, Odesa', result: 'Entries' }
]

// Recognition beyond interior-design competitions.
const RECOGNITION = [
  { year: '2024', title: 'FoodInSpace Awards — International Jury', body: 'Denys Belenko served on the international jury as Lead Designer and Owner, Belenko Design Studio, Spain.' },
  { year: '2013', title: 'Palm Branch Award — Tavernetta', body: 'Best restaurant concept in Ukraine. Awarded to the restaurant, whose interior was created with Belenko.' },
  { year: '2013', title: 'Eat! Best of Interior Design (BRAUN)', body: 'Tavernetta selected among 30 restaurant interiors of the world in the international publication.' },
  { year: '2012', title: 'Designer of the Year — Esquire Ukraine', body: 'Editorial recognition of Denys Belenko, published January 2013.' },
  { year: '2013', title: 'Kobe — first place, national interior competition', body: 'Reported in the press in early 2013.' }
]

function Badge({ award, status, year }) {
  // Typographic award mark: ring of the award name around the status.
  const id = `ring-${award.replace(/\W+/g, '').toLowerCase()}-${year}`
  const ring = `${award.toUpperCase()}  ·  ${year}  ·  `
  return (
    <svg className="aw-badge" viewBox="0 0 200 200" aria-hidden="true">
      <defs>
        <path id={id} d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
      </defs>
      <circle cx="100" cy="100" r="96" fill="none" stroke="currentColor" strokeWidth="0.8" />
      <circle cx="100" cy="100" r="60" fill="none" stroke="currentColor" strokeWidth="0.8" />
      <text className="aw-badge-ring" fontSize="12.5" letterSpacing="2.2">
        <textPath href={`#${id}`} startOffset="0">{ring + ring}</textPath>
      </text>
      <text x="100" y="94" textAnchor="middle" className="aw-badge-status" fontSize="17" letterSpacing="3">{status.toUpperCase()}</text>
      <text x="100" y="118" textAnchor="middle" className="aw-badge-year" fontSize="22" letterSpacing="2">{year}</text>
    </svg>
  )
}

export default function AwardsPageClient() {
  return (
    <div className="aw">
      <header className="aw-top">
        <a href="/" className="aw-logo" aria-label="Belenko — home"><img src="/belenko-logo-footer.png" alt="Belenko" /></a>
        <a href="/" className="aw-back">← Back to site</a>
      </header>

      <section className="aw-hero">
        <div className="aw-kicker">Belenko Design Studio</div>
        <h1>Awards &amp;<br />Recognition</h1>
        <p className="aw-lead">
          Hospitality interiors by Belenko have received international design awards and recognition across Europe and beyond —
          four international wins, a string of finals and shortlists, and a seat on an international jury.
        </p>
        <div className="aw-stats" aria-label="Summary">
          <div><strong>4</strong><span>International wins</span></div>
          <div><strong>3</strong><span>Award programmes</span></div>
          <div><strong>9</strong><span>Finals &amp; shortlists</span></div>
          <div><strong>2013–2024</strong><span>Years of recognition</span></div>
        </div>
      </section>

      <section className="aw-section" aria-labelledby="wins">
        <div className="aw-section-head">
          <span className="aw-num">01</span>
          <h2 id="wins">International wins</h2>
        </div>
        <div className="aw-wins">
          {WINS.map((w) => (
            <article key={w.award + w.year} className="aw-win">
              <div className="aw-win-badge"><Badge award={w.award} status={w.status} year={w.year} /></div>
              <div className="aw-win-body">
                <div className="aw-win-award">{w.award}</div>
                <div className="aw-win-status">{w.status} {w.year}<span> · {w.note}</span></div>
                <ul className="aw-win-projects">
                  {w.entries.map((e) => (
                    <li key={e.project}>
                      <a href={e.href} className="aw-project">
                        <img src={e.image} alt="" loading="lazy" />
                        <span className="aw-project-text">
                          <span className="aw-project-name">{e.project}</span>
                          <span className="aw-project-meta">{e.city} · {e.category}</span>
                        </span>
                        <span className="aw-project-arrow" aria-hidden="true">→</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="aw-section" aria-labelledby="finals">
        <div className="aw-section-head">
          <span className="aw-num">02</span>
          <h2 id="finals">Finalists &amp; shortlists</h2>
        </div>
        <ol className="aw-list">
          {SHORTLIST.map((r, i) => (
            <li key={i} className="aw-row">
              <span className="aw-row-year">{r.year}</span>
              <span className="aw-row-award">{r.award}</span>
              <span className="aw-row-project">{r.project}</span>
              <span className="aw-row-result">{r.result}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="aw-section" aria-labelledby="recognition">
        <div className="aw-section-head">
          <span className="aw-num">03</span>
          <h2 id="recognition">Recognition</h2>
        </div>
        <div className="aw-recog">
          {RECOGNITION.map((r, i) => (
            <article key={i} className="aw-recog-item">
              <div className="aw-recog-year">{r.year}</div>
              <h3>{r.title}</h3>
              <p>{r.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="aw-cta">
        <h2>Let&rsquo;s talk about<br />your project</h2>
        <a href="/#contact" className="aw-cta-btn">Contact the studio</a>
      </section>

      <ProposalFooter />
    </div>
  )
}
