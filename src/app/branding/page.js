import Link from 'next/link'
import SubpageShell from '../../components/subpage/SubpageShell'
import './branding.css'

export const metadata = {
  title: 'Branding — Identity for Restaurants, Bars & Hotels',
  description:
    'Hospitality branding by Belenko Design Studio: naming, logo and visual identity, menus, signage, tableware, uniforms and guest touchpoints designed as one system with the interior. Cases: Roya, Filosofia.',
  alternates: { canonical: 'https://www.belenko.design/branding' },
  openGraph: {
    title: 'Branding — Belenko Design Studio',
    description: 'Identity, menus, signage and every guest touchpoint — designed together with the interior so the venue reads as one idea.',
    url: 'https://www.belenko.design/branding',
    type: 'website',
    images: [{ url: 'https://www.belenko.design/projects/roya-menu-gold-v2.webp', width: 1536, height: 1024 }]
  }
}

const deliverables = [
  ['Naming & positioning', 'The name, the one-line idea and the story the guest will retell.'],
  ['Logo & visual identity', 'Mark, lettering, colour, typography and the rules that keep them consistent.'],
  ['Menus & printed matter', 'Menu structure and design, cards, postcards, packaging, stationery.'],
  ['Signage & wayfinding', 'Facade sign, interior signage, room and table numbering, toilets.'],
  ['Tableware & uniforms', 'Plates, glassware, linen and staff uniforms as part of the same set.'],
  ['Digital & launch', 'Social media language, website, launch materials and the opening event.']
]

const steps = [
  ['01', 'Concept', 'We start from the interior concept and the guest journey — the brand is the same idea told through other objects.'],
  ['02', 'Identity', 'Name, mark, type and colour are developed together with materials and lighting, so they look right in the room.'],
  ['03', 'Touchpoints', 'Every object the guest touches is designed: menu, bill folder, coaster, uniform, sign, Instagram post.'],
  ['04', 'Production', 'Print, embroidery, signage and tableware are specified, sourced and checked at the factory and on site.']
]

export default function BrandingPage() {
  return (
    <SubpageShell
      current="/branding"
      wide
      title="Branding"
      lead="Branding that reinforces the concept: the name, the mark, the menu in the guest’s hands, the sign above the door and the uniform of the person who serves them — designed as one system with the interior."
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: 'Hospitality branding',
            serviceType: 'Brand identity design for restaurants, bars and hotels',
            url: 'https://www.belenko.design/branding',
            provider: { '@id': 'https://www.belenko.design/#organization' },
            areaServed: ['Spain', 'Europe', 'United States'],
            description:
              'Naming, logo and visual identity, menus, signage, tableware, uniforms and digital touchpoints for hospitality venues, designed together with the interior.'
          })
        }}
      />

      {/* Case: Roya */}
      <section className="br-case">
        <div className="br-case-head">
          <span className="br-eyebrow">Case · Restaurant</span>
          <h2>Roya</h2>
          <p>
            A fine-dining restaurant by chef Mauro Colagreco. Dutch still-life flowers on black, a brushed-gold signature and
            a menu that is the first object the guest holds — the brand sets the tone before the first dish arrives.
          </p>
        </div>
        <div className="br-pair">
          <img src="/projects/roya-menu-gold-v2.webp" alt="Roya restaurant — gold menu cover with floral still life" loading="lazy" />
          <img src="/projects/roya-menu-black-v2.webp" alt="Roya restaurant — black floral menu cover" loading="lazy" />
        </div>
      </section>

      {/* What is included */}
      <section className="br-block">
        <h2 className="br-title">What the brand package includes</h2>
        <div className="br-grid">
          {deliverables.map(([t, d]) => (
            <div key={t} className="br-item">
              <h3>{t}</h3>
              <p>{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Case: Filosofia */}
      <section className="br-case">
        <div className="br-case-head">
          <span className="br-eyebrow">Case · Greek restaurant, Dnipro</span>
          <h2>Filosofia</h2>
          <p>
            Greek capitals in cobalt blue, a line-drawn philosopher on the coaster, a tagline printed on the staff T-shirt —
            “At a shared table, everyone becomes family.” Identity, menu, postcards and merchandise designed with the
            interior of marble, timber and lemon trees.
          </p>
        </div>
        <div className="br-quad">
          <img src="/projects/filosofia-restaurant-dnipro-14.webp" alt="Filosofia — logo in Greek capitals on a white wall" loading="lazy" />
          <img src="/projects/filosofia-restaurant-dnipro-15.webp" alt="Filosofia — coaster with the philosopher drawing and menu board" loading="lazy" />
          <img src="/projects/filosofia-restaurant-dnipro-16.webp" alt="Filosofia — postcard and printed summer menu" loading="lazy" />
          <img src="/projects/filosofia-restaurant-dnipro-17.webp" alt="Filosofia — staff T-shirt with the logo and tagline" loading="lazy" />
        </div>
        <Link href="/project/42" className="br-link">See the full Filosofia project →</Link>
      </section>

      {/* Process */}
      <section className="br-block">
        <h2 className="br-title">How we work</h2>
        <div className="br-steps">
          {steps.map(([n, t, d]) => (
            <div key={n} className="br-step">
              <span className="br-step-num">{n}</span>
              <h3>{t}</h3>
              <p>{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="br-cta">
        <p className="br-cta-text">A brand is what the guest carries home. Let’s design yours together with the room.</p>
        <div className="br-cta-actions">
          <Link href="/contact" className="br-btn">Start a project</Link>
          <Link href="/clients/proposal/brand-experience" className="br-btn br-btn--ghost">Brand &amp; Guest Experience package</Link>
        </div>
      </section>
    </SubpageShell>
  )
}
