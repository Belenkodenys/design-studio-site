import Link from 'next/link'
import SubpageShell from '../../components/subpage/SubpageShell'
import { sections } from '../clients/proposal/sections'

export const metadata = {
  title: 'Services — Hospitality Interior Design Packages | Belenko Design Studio',
  description:
    'Four ways to work with Belenko Design Studio: Concept & Interior, Full-Service (concept → FF&E → opening), Brand & Guest Experience, Consulting / Audit. Restaurant, bar, café and hotel design from Barcelona for Europe and the U.S.',
  alternates: { canonical: 'https://www.belenko.design/services' },
  openGraph: {
    title: 'Services — Belenko Design Studio',
    description: 'Concept & Interior · Full-Service · Brand & Guest Experience · Consulting / Audit.',
    url: 'https://www.belenko.design/services',
    type: 'website'
  }
}

const venueTypes = [
  ['restaurant-design', 'Restaurant interior design'],
  ['bar-design', 'Bar interior design'],
  ['cafe-design', 'Café design'],
  ['hotel-design', 'Hotel design'],
  ['concept-positioning', 'Concept & positioning'],
  ['architecture', 'Architecture & space planning'],
  ['interior-design', 'Interior design'],
  ['decor-furniture', 'Decor & furniture'],
  ['branding', 'Branding'],
  ['creative-content', 'Creative content'],
  ['author-supervision', 'Author supervision']
]

export default function ServicesPage() {
  return (
    <SubpageShell
      current="/services"
      title="Services"
      lead="Four ways to work with the studio — from a concept-and-interior package to a full-service project with one point of accountability from the first sketch to opening night."
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: 'Belenko Design Studio services',
            itemListElement: sections.map((s, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              item: {
                '@type': 'Service',
                name: s.title,
                description: s.body,
                url: `https://www.belenko.design/clients/proposal/${s.slug}`,
                provider: { '@id': 'https://www.belenko.design/#organization' },
                areaServed: ['Spain', 'Europe', 'United States']
              }
            }))
          })
        }}
      />
      <div className="svc-packages">
        {sections.map((s, i) => (
          <Link key={s.slug} href={`/clients/proposal/${s.slug}`} className="svc-package">
            <div className="svc-package-num">{String(i + 1).padStart(2, '0')}</div>
            <h2>{s.title}</h2>
            <p>{s.body}</p>
            <ul>
              {s.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </Link>
        ))}
      </div>

      <div className="svc-types">
        <h2>By venue type and discipline</h2>
        <div className="svc-types-grid">
          {venueTypes.map(([slug, label]) => (
            <Link key={slug} href={`/services/${slug}`}>{label}</Link>
          ))}
        </div>
      </div>
    </SubpageShell>
  )
}
