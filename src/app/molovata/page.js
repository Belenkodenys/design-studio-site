import SubpageShell from '../../components/subpage/SubpageShell'
import HeroFade from './HeroFade'
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
    <SubpageShell current="/molovata" wide>
      {/* Full-screen hero: the pool terrace, edge to edge, under the fixed
          header. On scroll the photo evaporates like steam; the logo stays. */}
      <HeroFade>
        <div className="mol-hero-steam">
          <img
            className="mol-hero-bg"
            src="/molovata/molovata-hero-pool.webp"
            srcSet="/molovata/molovata-hero-pool-m.webp 1400w, /molovata/molovata-hero-pool.webp 3586w"
            sizes="100vw"
            alt="Molovata — pool terrace with stone gabion walls, loungers and hot tubs"
            fetchPriority="high"
          />
          <span className="mol-hero-mist" aria-hidden="true" />
        </div>
        <img className="mol-hero-logo" src="/molovata/molovata-logo-white.png" alt="" aria-hidden="true" />
        <h1 className="mol-hero-title visually-hidden">Molovata Wellness</h1>
      </HeroFade>
      <div className="mol-page">
        {/* Sections are added here as the material comes in. */}
      </div>
    </SubpageShell>
  )
}
