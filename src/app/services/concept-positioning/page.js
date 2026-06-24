import { projects } from '../../../data/projects'
import ServicePageClient from '../ServicePageClient'

export const metadata = {
  title: 'Concept & Positioning for Restaurants | Strategic Design | Belenko',
  description: 'Strategic concept development and market positioning for restaurants, bars, and hotels. We create unique brand identities that stand out in competitive markets.',
  keywords: 'restaurant concept development, hospitality positioning, brand strategy, restaurant branding, concept design',
  openGraph: {
    title: 'Concept & Positioning | Belenko Design Studio',
    description: 'Strategic concept development for hospitality venues. Creating unique identities that resonate with your target audience.',
    images: [{ url: 'https://belenko.design/service-1.png', width: 1200, height: 630 }],
  },
  alternates: { canonical: 'https://www.belenko.design/services/concept-positioning' },
}

export default function ConceptPage() {
  return (
    <ServicePageClient slug="concept-positioning"
      serviceKey="concept"
      heroImage="/service-1.png"
      stats={[
        { number: '200+', labelKey: 'conceptsDeveloped' },
        { number: '25+', labelKey: 'yearsExperience' },
        { number: '95%', labelKey: 'clientSatisfaction' }
      ]}
      projects={projects.slice(0, 6)}
    />
  )
}
