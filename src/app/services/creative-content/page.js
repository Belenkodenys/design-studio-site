import { projects } from '../../../data/projects'
import ServicePageClient from '../ServicePageClient'

export const metadata = {
  title: 'Creative & Visual Content for Hospitality | Belenko Design',
  description: 'Professional photography, video production, and visual content creation for restaurants, bars, and hotels. Content that captures the essence of your venue.',
  keywords: 'restaurant photography, hospitality video, food photography, interior photography, social media content',
  openGraph: {
    title: 'Creative & Visual Content | Belenko Design Studio',
    description: 'Capturing the essence of hospitality spaces through photography, video, and visual storytelling.',
    images: [{ url: 'https://belenko.design/service-6.png', width: 1200, height: 630 }],
  },
  alternates: { canonical: 'https://www.belenko.design/services/creative-content' },
}

export default function CreativeContentPage() {
  return (
    <ServicePageClient slug="creative-content"
      serviceKey="creative"
      heroImage="/service-6.png"
      stats={[
        { number: '200+', labelKey: 'projectsCompleted' },
        { number: '25+', labelKey: 'yearsExperience' },
        { number: '15+', labelKey: 'countriesWorked' }
      ]}
      projects={projects.slice(0, 6)}
    />
  )
}
