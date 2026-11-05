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
    images: [{ url: 'https://www.belenko.design/projects/roya-menu-gold-v2-cut.webp', width: 1536, height: 1024 }]
  }
}

// Gallery: add images here (transparent-background cutouts, no backdrop).
// Motion and placement are assigned automatically in sequence, so a new
// picture only needs src and alt.
// Five kinds of motion and three horizontal positions, cycled so neighbours
// never move the same way or sit on the same side.
const FX = ['slide-l', 'rise', 'slide-r', 'zoom', 'tilt', 'slide-r', 'rise', 'slide-l', 'zoom', 'tilt']
const POS = ['left', 'center', 'right', 'center', 'right', 'left', 'center']

const gallery = [
  { src: '/projects/roya-menu-gold-v2-cut.webp', alt: 'Roya restaurant — gold menu cover' },
  { src: '/projects/roya-menu-black-v2-cut.webp', alt: 'Roya restaurant — black floral menu cover' },
  { src: '/projects/filosofia-restaurant-dnipro-14-cut.webp', alt: 'Filosofia — logo in Greek capitals' },
  { src: '/projects/filosofia-restaurant-dnipro-15-cut.webp', alt: 'Filosofia — coaster and menu board' },
  { src: '/projects/filosofia-restaurant-dnipro-16-cut.webp', alt: 'Filosofia — postcard and printed menu' },
  { src: '/projects/filosofia-restaurant-dnipro-17-cut.webp', alt: 'Filosofia — staff T-shirt with the logo' },
  { src: '/projects/branding-12monkeys-logo-cut.webp', alt: '12 Monkeys — logotype' },
  { src: '/projects/branding-atelier-coffee-illustration-cut.webp', alt: 'Atelier Design & Coffee — illustrated coffee characters' },
  { src: '/projects/branding-food-couture-lettering-cut.webp', alt: 'Food Couture — hand lettering' },
  { src: '/projects/branding-3-legs-pub-logo-cut.webp', alt: '3 Legs Pub — emblem, English and Ukrainian versions' },
  { src: '/projects/branding-buddka-bar-logo-cut.webp', alt: 'Buddka Bar — logotype' },
  { src: '/projects/branding-khryak-ribbon-logo-cut.webp', alt: 'Khryak — house of beer and meat, ribbon logo' },
  { src: '/projects/branding-khryak-pig-emblem-cut.webp', alt: 'Khryak — pig emblem' },
  { src: '/projects/branding-mimosa-pizza-box-green-cut.webp', alt: 'Mimosa Brooklyn Pizza — box, green edition' },
  { src: '/projects/branding-mimosa-pizza-box-red-cut.webp', alt: 'Mimosa Brooklyn Pizza — box, red edition' },
  { src: '/projects/branding-smorrebrod-tshirt-cut.webp', alt: 'Smørrebrød — staff T-shirt' },
  { src: '/projects/branding-smorrebrod-deer-illustration-cut.webp', alt: 'Smørrebrød — tattooed deer illustration' },
  { src: '/projects/branding-smorrebrod-beer-bottle-cut.webp', alt: 'Smørrebrød — beer bottle label' },
  { src: '/projects/branding-smorrebrod-box-cut.webp', alt: 'Smørrebrød — takeaway box' },
  { src: '/projects/branding-smorrebrod-cups-cut.webp', alt: 'Smørrebrød — coffee cups' },
  { src: '/projects/branding-ladies-room-lettering-cut.webp', alt: 'Ladies Room — brush lettering sign' },
  { src: '/projects/branding-pixi-logo-cut.webp', alt: 'Pixi — logotype' },
  { src: '/projects/branding-pixi-sketch-man-cut.webp', alt: 'Pixi — sketch of a man with a cocktail' },
  { src: '/projects/branding-kinoshniki-logo-cut.webp', alt: 'Kinoshniki — logo and wordmark' },
  { src: '/projects/branding-pixi-sketch-girl-cut.webp', alt: 'Pixi — sketch of a running girl with fork and spoon' },
  { src: '/projects/branding-kinoshniki-plates-cut.webp', alt: 'Kinoshniki — branded plates, front and back' }
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
          <ScrollDrift key={g.src} fx={FX[i % FX.length]} className={`br-slot br-slot--${POS[i % POS.length]}`}>
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
