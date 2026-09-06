import { notFound } from 'next/navigation'
import { projects } from '../../../../data/projects'
import WorkDetail from '../../../miami-hospitality-design/work/[id]/WorkDetail'

const BASE = '/california-hospitality-design'

export async function generateStaticParams() {
  return projects.map((p) => ({ id: String(p.id) }))
}

export async function generateMetadata({ params }) {
  const { id } = await params
  const project = projects.find((p) => String(p.id) === String(id))
  if (!project) return { title: 'Project | Belenko California' }
  return {
    title: `${project.title} — ${project.category} in ${project.location} | Belenko California`,
    description: project.description?.slice(0, 160),
    robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
    alternates: { canonical: null }
  }
}

export default async function WorkRoutePage({ params }) {
  const { id } = await params
  const project = projects.find((p) => String(p.id) === String(id))
  if (!project) notFound()
  return <WorkDetail project={project} basePath={BASE} marketLabel="California" />
}
