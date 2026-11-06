import SubpageShell from '../../components/subpage/SubpageShell'
import './molovata.css'

// Hidden working page: not linked from the site, not in the sitemap,
// not indexed by search engines (robots: noindex). Filled with material
// section by section as it arrives.
export const metadata = {
  title: 'Molovata',
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
  openGraph: { title: 'Molovata — Belenko Design Studio' }
}

export default function MolovataPage() {
  return (
    <SubpageShell current="/molovata" wide title="Molovata" lead="">
      <div className="mol-page">
        {/* Sections are added here as the material comes in. */}
      </div>
    </SubpageShell>
  )
}
