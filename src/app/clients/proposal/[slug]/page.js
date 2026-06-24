import { notFound } from 'next/navigation'
import { sections, findSection } from '../sections'
import SectionDetail from './SectionDetail'

export async function generateStaticParams() {
  return sections.map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const s = findSection(slug)
  if (!s) return { title: 'Belenko Studio' }
  return {
    title: `${s.title} — Belenko Studio`,
    description: s.body,
    robots: {
      index: false,
      follow: false,
      googleBot: { index: false, follow: false }
    },
    alternates: { canonical: null }
  }
}

export default async function ProposalSectionPage({ params }) {
  const { slug } = await params
  const section = findSection(slug)
  if (!section) notFound()
  return <SectionDetail section={section} />
}
