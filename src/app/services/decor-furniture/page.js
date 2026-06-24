import { projects } from '../../../data/projects'
import ServicePageClient from '../ServicePageClient'

export const metadata = {
  title: 'Custom Furniture & Decor for Restaurants | Belenko Design',
  description: 'Bespoke furniture design and decor curation for hospitality venues. Custom tables, chairs, lighting, and decorative elements that define your space.',
  keywords: 'custom restaurant furniture, hospitality furniture design, restaurant decor, bespoke furniture, custom lighting',
  openGraph: {
    title: 'Decor & Furniture | Belenko Design Studio',
    description: 'Custom furniture and curated decor for hospitality spaces. Creating unique pieces that define your venue.',
    images: [{ url: 'https://belenko.design/service-4.png', width: 1200, height: 630 }],
  },
  alternates: { canonical: 'https://www.belenko.design/services/decor-furniture' },
}

export default function DecorFurniturePage() {
  return (
    <ServicePageClient slug="decor-furniture"
      serviceKey="decor"
      heroImage="/service-4.png"
      stats={[
        { number: '200+', labelKey: 'projectsCompleted' },
        { number: '25+', labelKey: 'yearsExperience' },
        { number: '15+', labelKey: 'countriesWorked' }
      ]}
      projects={projects.slice(0, 6)}
    />
  )
}
