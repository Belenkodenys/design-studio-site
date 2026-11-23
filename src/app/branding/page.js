import SubpageShell from '../../components/subpage/SubpageShell'
import ScrollDrift from '../../components/subpage/ScrollDrift'
import './branding.css'
import { gallery } from './gallery'

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
    images: [{ url: 'https://www.belenko.design/projects/belenko-interior-design-roya-menu-gold-v2-cut.webp', width: 1536, height: 1024 }]
  }
}

// Gallery: add images here (transparent-background cutouts, no backdrop).
// Motion and placement are assigned automatically in sequence, so a new
// picture only needs src and alt. Options: size: 'small' (shown at about
// half width), gap: true (extra space above it).
// Five kinds of motion and three horizontal positions, cycled so neighbours
// never move the same way or sit on the same side.
const FX = ['slide-l', 'rise', 'slide-r', 'zoom', 'tilt', 'slide-r', 'rise', 'slide-l', 'zoom', 'tilt']
const POS = ['left', 'center', 'right', 'center', 'right', 'left', 'center']


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
        {gallery.map((g, i) => (
          <ScrollDrift key={g.src} fx={FX[i % FX.length]} className={`br-slot br-slot--${POS[i % POS.length]}${g.size === 'small' ? ' br-slot--small' : g.size === 'large' ? ' br-slot--large' : ''}${g.gap ? ' br-slot--gap' : ''}`}>
            <img
              src={g.src}
              srcSet={`${g.src.replace('-cut.webp', '-cut-m.webp')} 1000w, ${g.src} 2200w`}
              sizes="(max-width: 600px) 100vw, 80vw"
              alt={g.alt}
              loading="eager"
              decoding="async"
              fetchPriority={i < 4 ? 'high' : 'low'}
              draggable={false}
            />
          </ScrollDrift>
        ))}
      </div>
    </SubpageShell>
  )
}
