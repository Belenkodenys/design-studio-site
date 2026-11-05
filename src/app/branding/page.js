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

// Gallery: add images here (transparent-background cutouts, no backdrop) —
// src, alt, direction of travel while scrolling down ('ltr' = left → right,
// 'rtl' = right → left) and depth (1 = normal). Each picture crosses the
// screen horizontally with the scroll, in both directions.
const gallery = [
  { src: '/projects/roya-menu-gold-v2-cut.webp', alt: 'Roya restaurant — gold menu cover', axis: 'ltr', depth: 1 },
  { src: '/projects/roya-menu-black-v2-cut.webp', alt: 'Roya restaurant — black floral menu cover', axis: 'rtl', depth: 1.3 },
  { src: '/projects/filosofia-restaurant-dnipro-14-cut.webp', alt: 'Filosofia — logo in Greek capitals', axis: 'ltr', depth: 1.2 },
  { src: '/projects/filosofia-restaurant-dnipro-15-cut.webp', alt: 'Filosofia — coaster and menu board', axis: 'rtl', depth: 0.9 },
  { src: '/projects/filosofia-restaurant-dnipro-16-cut.webp', alt: 'Filosofia — postcard and printed menu', axis: 'ltr', depth: 1.4 },
  { src: '/projects/filosofia-restaurant-dnipro-17-cut.webp', alt: 'Filosofia — staff T-shirt with the logo', axis: 'rtl', depth: 1.1 },
  { src: '/projects/branding-12monkeys-logo-cut.webp', alt: '12 Monkeys — logotype', axis: 'ltr', depth: 1 },
  { src: '/projects/branding-atelier-coffee-illustration-cut.webp', alt: 'Atelier Design & Coffee — illustrated coffee characters', axis: 'rtl', depth: 1.2 },
  { src: '/projects/branding-food-couture-lettering-cut.webp', alt: 'Food Couture — hand lettering', axis: 'ltr', depth: 0.9 },
  { src: '/projects/branding-3-legs-pub-logo-cut.webp', alt: '3 Legs Pub — emblem, English and Ukrainian versions', axis: 'rtl', depth: 1.3 },
  { src: '/projects/branding-buddka-bar-logo-cut.webp', alt: 'Buddka Bar — logotype', axis: 'ltr', depth: 1 },
  { src: '/projects/branding-khryak-ribbon-logo-cut.webp', alt: 'Khryak — house of beer and meat, ribbon logo', axis: 'rtl', depth: 1.2 },
  { src: '/projects/branding-khryak-pig-emblem-cut.webp', alt: 'Khryak — pig emblem', axis: 'ltr', depth: 1.1 },
  { src: '/projects/branding-mimosa-pizza-box-green-cut.webp', alt: 'Mimosa Brooklyn Pizza — box, green edition', axis: 'rtl', depth: 1 },
  { src: '/projects/branding-mimosa-pizza-box-red-cut.webp', alt: 'Mimosa Brooklyn Pizza — box, red edition', axis: 'ltr', depth: 1.3 },
  { src: '/projects/branding-smorrebrod-tshirt-cut.webp', alt: 'Smørrebrød — staff T-shirt', axis: 'rtl', depth: 0.9 },
  { src: '/projects/branding-smorrebrod-deer-illustration-cut.webp', alt: 'Smørrebrød — tattooed deer illustration', axis: 'ltr', depth: 1.2 },
  { src: '/projects/branding-smorrebrod-beer-bottle-cut.webp', alt: 'Smørrebrød — beer bottle label', axis: 'rtl', depth: 1 },
  { src: '/projects/branding-smorrebrod-box-cut.webp', alt: 'Smørrebrød — takeaway box', axis: 'ltr', depth: 1.3 },
  { src: '/projects/branding-smorrebrod-cups-cut.webp', alt: 'Smørrebrød — coffee cups', axis: 'rtl', depth: 1.1 }
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
          <ScrollDrift key={g.src} axis={g.axis} depth={g.depth || 1}>
            <img src={g.src} alt={g.alt} loading="lazy" draggable={false} />
          </ScrollDrift>
        ))}
      </div>
    </SubpageShell>
  )
}
