import GalleryClient from './GalleryClient'

export const metadata = {
  title: 'Belenko Private Interiors',
  description: 'Private photo gallery.',
  // Hidden: kept out of search engines and unlinked from the site.
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
  alternates: { canonical: null }
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#000000'
}

export default function GalleryRoutePage() {
  return <GalleryClient />
}
