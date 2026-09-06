import MiamiLanding from './MiamiLanding'

export const metadata = {
  title: 'Belenko Design — Hospitality Interiors for Miami',
  description:
    'Award-winning, Barcelona-based hospitality design studio bringing world-class restaurant, bar, and hotel concepts to Miami.',
  // Hidden landing: keep it out of search engines and unlinked from the site.
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false
    }
  },
  alternates: {
    canonical: null
  }
}

export default function MiamiRoutePage() {
  return <MiamiLanding />
}
