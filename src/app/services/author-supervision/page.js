import { projects } from '../../../data/projects'
import ServicePageClient from '../ServicePageClient'

export const metadata = {
  title: 'Author Supervision & Construction Oversight | Belenko Design',
  description: 'On-site supervision ensuring design intent is realized during construction. We protect your investment by overseeing every detail from groundbreaking to opening.',
  keywords: 'design supervision, construction oversight, project management, site supervision, design implementation',
  openGraph: {
    title: 'Author Supervision | Belenko Design Studio',
    description: 'Ensuring design intent is realized on site. Expert supervision from construction to opening.',
    images: [{ url: 'https://belenko.design/service-7.png', width: 1200, height: 630 }],
  },
  alternates: { canonical: 'https://www.belenko.design/services/author-supervision' },
}

export default function AuthorSupervisionPage() {
  return (
    <ServicePageClient slug="author-supervision"
      serviceKey="supervision"
      heroImage="/service-7.png"
      stats={[
        { number: '150+', labelKey: 'projectsSupervised' },
        { number: '25+', labelKey: 'yearsExperience' },
        { number: '98%', labelKey: 'clientSatisfaction' }
      ]}
      projects={projects.slice(0, 6)}
    />
  )
}
