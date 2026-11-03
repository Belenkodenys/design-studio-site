import SubpageShell from '../../components/subpage/SubpageShell'
import Portfolio from '../../components/Portfolio'
import { projects } from '../../data/projects'

export const metadata = {
  title: 'Our Works',
  description:
    'Portfolio of Belenko Design Studio: restaurant, bar, café, hotel and beach club interiors in Spain, the United States, Turkey, Azerbaijan, Moldova and Ukraine. Concept, interior design, branding and FF&E by a Barcelona hospitality studio.',
  alternates: { canonical: 'https://www.belenko.design/projects' },
  openGraph: {
    title: 'Our Works — Belenko Design Studio',
    description: 'Restaurant, bar, café and hotel interiors by a Barcelona hospitality design studio.',
    url: 'https://www.belenko.design/projects',
    type: 'website'
  }
}

export default function ProjectsPage() {
  const countries = [...new Set(projects.map((p) => p.location.split(', ').pop()))]
  return (
    <SubpageShell
      current="/projects"
      wide
      title="Our Works"
      lead={`${projects.length} selected venues — restaurants, bars, cafés, hotels and beach clubs in ${countries.join(', ')}. Each project page shows the concept, the scope of work and the finished interior.`}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: 'Our Works — Belenko Design Studio',
            url: 'https://www.belenko.design/projects',
            hasPart: projects.map((p) => ({
              '@type': 'CreativeWork',
              name: p.title,
              url: `https://www.belenko.design/project/${p.id}`,
              locationCreated: p.location,
              dateCreated: p.year || undefined,
              image: `https://www.belenko.design${p.image}`
            }))
          })
        }}
      />
      <Portfolio />
    </SubpageShell>
  )
}
