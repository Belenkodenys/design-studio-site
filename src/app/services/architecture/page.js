import { projects } from '../../../data/projects'
import ServicePageClient from '../ServicePageClient'

export const metadata = {
  title: 'Hospitality Architecture | Restaurant & Hotel Design | Belenko',
  description: 'Architectural design for restaurants, bars, hotels, and hospitality venues. From space planning to facade design, we create buildings that inspire.',
  keywords: 'hospitality architecture, restaurant architecture, hotel architecture, commercial architecture, space planning',
  openGraph: {
    title: 'Hospitality Architecture | Belenko Design Studio',
    description: 'Architectural solutions for hospitality venues. Creating spaces that function beautifully and inspire emotionally.',
    images: [{ url: 'https://belenko.design/service-2.png', width: 1200, height: 630 }],
  },
  alternates: { canonical: 'https://www.belenko.design/services/architecture' },
}

export default function ArchitecturePage() {
  return (
    <ServicePageClient slug="architecture"
      serviceKey="architecture"
      heroImage="/service-2.png"
      stats={[
        { number: '150+', labelKey: 'projectsBuilt' },
        { number: '25+', labelKey: 'yearsExperience' },
        { number: '50K+', labelKey: 'sqmDesigned' }
      ]}
      projects={projects.slice(0, 6)}
    />
  )
}
