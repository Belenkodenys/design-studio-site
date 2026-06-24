import { projects } from '../../../data/projects'
import { projectTranslations } from '../../../i18n/projectTranslations'
import ProjectDetailClient from './ProjectDetailClient'

// Generate static params for all projects
export async function generateStaticParams() {
  return projects.map((project) => ({
    id: String(project.id),
  }))
}

// Generate metadata for each project (SSG)
export async function generateMetadata({ params }) {
  const { id } = await params
  const project = projects.find(p => p.id === parseInt(id))

  if (!project) {
    return {
      title: 'Project Not Found',
      description: 'The requested project was not found.'
    }
  }

  const { title, category, location, year, description, image } = project
  const [city, country] = (location || '').split(', ')

  // Generate SEO-optimized title
  const seoTitle = `${title} — ${category} | ${city}, ${country} (${year})`

  // Truncate description to 160 chars
  let seoDescription = description
  if (seoDescription && seoDescription.length > 160) {
    seoDescription = seoDescription.substring(0, 157) + '...'
  }

  const imageUrl = image?.startsWith('http') ? image : `https://belenko.design${image}`

  return {
    title: seoTitle,
    description: seoDescription,
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title
        }
      ],
      type: 'article'
    },
    twitter: {
      card: 'summary_large_image',
      title: seoTitle,
      description: seoDescription,
      images: [imageUrl]
    },
    alternates: {
      canonical: `https://www.belenko.design/project/${id}`
    }
  }
}

export default async function ProjectPage({ params }) {
  const { id } = await params
  const project = projects.find(p => p.id === parseInt(id))

  if (!project) {
    return (
      <div className="project-not-found">
        <h1>Project not found</h1>
        <a href="/#portfolio">Back to Portfolio</a>
      </div>
    )
  }

  const currentIndex = projects.findIndex(p => p.id === parseInt(id))
  const prevProject = currentIndex > 0 ? projects[currentIndex - 1] : projects[projects.length - 1]
  const nextProject = currentIndex < projects.length - 1 ? projects[currentIndex + 1] : projects[0]

  const projectImageUrl = project.image?.startsWith('http')
    ? project.image
    : `https://www.belenko.design${project.image}`

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.belenko.design/" },
      { "@type": "ListItem", "position": 2, "name": "Portfolio", "item": "https://www.belenko.design/#portfolio" },
      { "@type": "ListItem", "position": 3, "name": project.title, "item": `https://www.belenko.design/project/${id}` }
    ]
  }

  const imageObjectSchema = project.image ? {
    "@context": "https://schema.org",
    "@type": "ImageObject",
    "contentUrl": projectImageUrl,
    "name": project.title,
    "description": project.description,
    "creditText": "Belenko Design Studio",
    "creator": { "@type": "Organization", "name": "Belenko Design Studio" }
  } : null

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {imageObjectSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(imageObjectSchema) }}
        />
      )}
      <ProjectDetailClient
        project={project}
        prevProject={prevProject}
        nextProject={nextProject}
      />
    </>
  )
}
