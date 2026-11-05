import SubpageShell from '../../components/subpage/SubpageShell'
import FlyIn from '../../components/subpage/FlyIn'
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

// Gallery: add images here — src, alt, the side they fly in from
// (left | right | top | bottom) and an optional delay in ms. Two per row on
// desktop, one per row on phones.
const gallery = [
  { src: '/projects/roya-menu-gold-v2.webp', alt: 'Roya restaurant — gold menu cover', from: 'left' },
  { src: '/projects/roya-menu-black-v2.webp', alt: 'Roya restaurant — black floral menu cover', from: 'right', delay: 120 },
  { src: '/projects/filosofia-restaurant-dnipro-14.webp', alt: 'Filosofia — logo in Greek capitals', from: 'left' },
  { src: '/projects/filosofia-restaurant-dnipro-15.webp', alt: 'Filosofia — coaster and menu board', from: 'right', delay: 100 },
  { src: '/projects/filosofia-restaurant-dnipro-16.webp', alt: 'Filosofia — postcard and printed menu', from: 'bottom' },
  { src: '/projects/filosofia-restaurant-dnipro-17.webp', alt: 'Filosofia — staff T-shirt with the logo', from: 'top', delay: 140 }
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

      <div className="br-gallery">
        {gallery.map((g) => (
          <FlyIn key={g.src} from={g.from} delay={g.delay || 0}>
            <img src={g.src} alt={g.alt} loading="lazy" draggable={false} />
          </FlyIn>
        ))}
      </div>
    </SubpageShell>
  )
}
