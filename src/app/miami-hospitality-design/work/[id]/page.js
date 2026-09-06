import { notFound } from 'next/navigation'
import { projects } from '../../../../data/projects'
import WorkDetail from './WorkDetail'

export async function generateStaticParams() {
  return projects.map((p) => ({ id: String(p.id) }))
}

export async function generateMetadata({ params }) {
  const { id } = await params
  const project = projects.find((p) => String(p.id) === String(id))
  if (!project) return { title: 'Project | Belenko Miami' }
  return {
    title: `${project.title} — ${project.category} in ${project.location} | Belenko Miami`,
    description: project.description?.slice(0, 160),
    // Case pages live on the Miami site but mirror main-site content — keep them
    // out of the index to avoid duplicate content.
    robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
    alternates: { canonical: null }
  }
}

export default async function WorkRoutePage({ params }) {
  const { id } = await params
  const project = projects.find((p) => String(p.id) === String(id))
  if (!project) notFound()
  return <WorkDetail project={project} />
}
