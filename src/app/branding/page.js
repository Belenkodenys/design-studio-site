import SubpageShell from '../../components/subpage/SubpageShell'
import ScrollDrift from '../../components/subpage/ScrollDrift'
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

const gallery = [
  { src: '/projects/belenko-interior-design-roya-menu-gold-v2-cut.webp', alt: 'Roya restaurant — gold menu cover' },
  { src: '/projects/belenko-interior-design-roya-menu-black-v2-cut.webp', alt: 'Roya restaurant — black floral menu cover' },
  { src: '/projects/belenko-branding-design-chou-chou-logo-cut.webp', alt: 'Chou Chou — gold foil logo with two hearts' },
  { src: '/projects/belenko-interior-design-filosofia-restaurant-dnipro-14-cut.webp', alt: 'Filosofia — logo in Greek capitals' },
  { src: '/projects/belenko-interior-design-filosofia-restaurant-dnipro-15-cut.webp', alt: 'Filosofia — coaster and menu board' },
  { src: '/projects/belenko-interior-design-filosofia-restaurant-dnipro-16-cut.webp', alt: 'Filosofia — postcard and printed menu' },
  { src: '/projects/belenko-interior-design-filosofia-restaurant-dnipro-17-cut.webp', alt: 'Filosofia — staff T-shirt with the logo' },
  { src: '/projects/belenko-branding-design-12monkeys-logo-cut.webp', alt: '12 Monkeys — logotype' },
  { src: '/projects/belenko-branding-design-atelier-coffee-illustration-cut.webp', alt: 'Atelier Design & Coffee — illustrated coffee characters' },
  { src: '/projects/belenko-branding-design-food-couture-lettering-cut.webp', alt: 'Food Couture — hand lettering' },
  { src: '/projects/belenko-branding-design-3-legs-pub-logo-cut.webp', alt: '3 Legs Pub — emblem, English and Ukrainian versions', gap: true },
  { src: '/projects/belenko-branding-design-buddka-bar-logo-cut.webp', alt: 'Buddka Bar — logotype', gap: true },
  { src: '/projects/belenko-branding-design-khryak-ribbon-logo-cut.webp', alt: 'Khryak — house of beer and meat, ribbon logo', gap: true },
  { src: '/projects/belenko-branding-design-khryak-pig-emblem-cut.webp', alt: 'Khryak — pig emblem', gap: true },
  { src: '/projects/belenko-branding-design-mimosa-pizza-box-green-cut.webp', alt: 'Mimosa Brooklyn Pizza — box, green edition' },
  { src: '/projects/belenko-branding-design-beerbasa-identity-cut.webp', alt: 'Beerbasa — beer & grill identity: logo on cards, glass and brewery wall' },
  { src: '/projects/belenko-branding-design-iva-business-cards-cut.webp', alt: 'Iva restaurant, Baku — green and orange business cards' },
  { src: '/projects/belenko-branding-design-mimosa-pizza-box-red-cut.webp', alt: 'Mimosa Brooklyn Pizza — box, red edition' },
  { src: '/projects/belenko-branding-design-smorrebrod-tshirt-cut.webp', alt: 'Smørrebrød — staff T-shirt' },
  { src: '/projects/belenko-branding-design-smorrebrod-deer-illustration-cut.webp', alt: 'Smørrebrød — tattooed deer illustration' },
  { src: '/projects/belenko-branding-design-smorrebrod-beer-bottle-cut.webp', alt: 'Smørrebrød — beer bottle label' },
  { src: '/projects/belenko-branding-design-smorrebrod-box-cut.webp', alt: 'Smørrebrød — takeaway box' },
  { src: '/projects/belenko-branding-design-smorrebrod-cups-cut.webp', alt: 'Smørrebrød — coffee cups' },
  { src: '/projects/belenko-branding-design-ladies-room-lettering-cut.webp', alt: 'Ladies Room — brush lettering sign' },
  { src: '/projects/belenko-branding-design-pixi-logo-cut.webp', alt: 'Pixi — logotype' },
  { src: '/projects/belenko-branding-design-pixi-sketch-man-cut.webp', alt: 'Pixi — sketch of a man with a cocktail' },
  { src: '/projects/belenko-branding-design-kinoshniki-logo-cut.webp', alt: 'Kinoshniki — logo and wordmark' },
  { src: '/projects/belenko-branding-design-pixi-sketch-girl-cut.webp', alt: 'Pixi — sketch of a running girl with fork and spoon' },
  { src: '/projects/belenko-branding-design-steakhouse-logo-cut.webp', alt: 'Steakhouse — wordmark', size: 'small' },
  { src: '/projects/belenko-branding-design-kinoshniki-plates-cut.webp', alt: 'Kinoshniki — branded plates, front and back' }
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
        {gallery.map((g, i) => (
          <ScrollDrift key={g.src} fx={FX[i % FX.length]} className={`br-slot br-slot--${POS[i % POS.length]}${g.size === 'small' ? ' br-slot--small' : ''}${g.gap ? ' br-slot--gap' : ''}`}>
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
