import SubpageShell from '../../components/subpage/SubpageShell'
import { HomeContactForm } from '../clients/proposal/ClientLanding'
import '../clients/proposal/ClientLanding.css'

export const metadata = {
  title: 'Contacts',
  description:
    'Contact Belenko Design Studio: office@belenko.design, +34 671 825 489 (WhatsApp), Barcelona, Spain. Hospitality interior design for restaurants, bars and hotels in Europe and the United States.',
  alternates: { canonical: 'https://www.belenko.design/contact' },
  openGraph: {
    title: 'Contacts — Belenko Design Studio',
    description: 'Tell us about your venue — we reply within one business day.',
    url: 'https://www.belenko.design/contact',
    type: 'website'
  }
}

export default function ContactPage() {
  return (
    <SubpageShell
      current="/contact"
      title="Contacts"
      lead="Tell us about your venue — a new concept, a renovation, a location you are about to lease. We reply within one business day."
    >
      <div className="contact-grid">
        <div className="contact-details">
          <dl>
            <dt>Email</dt>
            <dd><a href="mailto:office@belenko.design">office@belenko.design</a></dd>
            <dt>Phone</dt>
            <dd><a href="tel:+34671825489">+34 671 825 489</a> · <a href="https://wa.me/34671825489" target="_blank" rel="noopener noreferrer">WhatsApp</a></dd>
            <dt>Studio</dt>
            <dd>Pl. de Lesseps, 6-7, Gràcia, 08023 Barcelona, Spain (CET). Calls with U.S. clients: 9am–1pm ET.</dd>
            <dt>Social</dt>
            <dd>
              <a href="https://instagram.com/belenko" target="_blank" rel="noopener noreferrer">Instagram</a> ·{' '}
              <a href="https://www.linkedin.com/in/denisbelenko/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            </dd>
            <dt>Regions</dt>
            <dd>Spain &amp; Europe · United States (Florida, California, Texas, New York) · Turkey · Caucasus · Ukraine</dd>
          </dl>
        </div>
        <div className="contact-form-wrap">
          <HomeContactForm />
        </div>
      </div>
    </SubpageShell>
  )
}
