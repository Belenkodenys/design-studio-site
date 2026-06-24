import { projects } from '../../../data/projects'
import ServicePageClient from '../ServicePageClient'

export const metadata = {
  title: 'Restaurant Branding & Graphic Design | Belenko Design',
  description: 'Complete branding and graphic design for restaurants, bars, and hotels. Logo design, visual identity, menus, signage, and all guest touchpoints.',
  keywords: 'restaurant branding, hospitality branding, menu design, logo design, restaurant visual identity, signage design',
  openGraph: {
    title: 'Branding & Graphic Design | Belenko Design Studio',
    description: 'Creating cohesive brand identities for hospitality venues. From logo to menu to signage.',
    images: [{ url: 'https://belenko.design/service-5.png', width: 1200, height: 630 }],
  },
  alternates: { canonical: 'https://www.belenko.design/services/branding' },
}

export default function BrandingPage() {
  return (
    <ServicePageClient slug="branding"
      serviceKey="branding"
      heroImage="/service-5.png"
      stats={[
        { number: '200+', labelKey: 'brandsCreated' },
        { number: '25+', labelKey: 'yearsExperience' },
        { number: '15+', labelKey: 'countriesWorked' }
      ]}
      projects={projects.slice(0, 6)}
    />
  )
}
