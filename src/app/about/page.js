import SubpageShell from '../../components/subpage/SubpageShell'
import { StudioMission } from '../clients/proposal/ClientLanding'
import '../clients/proposal/ClientLanding.css'

export const metadata = {
  title: 'About Us',
  description:
    'Belenko Design Studio is a hospitality interior design studio founded in Barcelona by architect Denys Belenko in 1999: 25+ years, 200+ restaurants, bars, cafés and hotels in 11 countries, projects in Europe and the U.S.',
  alternates: { canonical: 'https://www.belenko.design/about' },
  openGraph: {
    title: 'About Us — Belenko Design Studio',
    description: 'Hospitality interior design studio in Barcelona — founded 1999, 200+ venues in 11 countries.',
    url: 'https://www.belenko.design/about',
    type: 'website'
  }
}

export default function AboutPage() {
  return (
    <SubpageShell
      current="/about"
      title="About Us"
      lead="Belenko Design Studio is a Barcelona-based hospitality interior design studio founded by architect Denys Belenko in 1999. We design restaurants, bars, cafés, hotels and beach clubs as complete business products — concept, interior, brand, guest experience, FF&E and opening."
    >
      <div className="about-wrap">
        <StudioMission />
      </div>
    </SubpageShell>
  )
}
