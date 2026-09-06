import ThankYou from './ThankYou'

const URL = 'https://www.belenko.design/florida/thank-you'

export const metadata = {
  title: 'Thank you | Belenko Miami',
  description: 'Your request was received. We reply within one business day.',
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
  alternates: { canonical: URL }
}

export default function ThankYouRoutePage() {
  return <ThankYou />
}
