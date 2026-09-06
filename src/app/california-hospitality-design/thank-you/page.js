import ThankYou from '../../florida/thank-you/ThankYou'

const URL = 'https://www.belenko.design/california-hospitality-design/thank-you'

export const metadata = {
  title: 'Thank you | Belenko California',
  description: 'Your request was received. We reply within one business day.',
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
  alternates: { canonical: URL }
}

export default function ThankYouRoutePage() {
  return <ThankYou basePath="/california-hospitality-design" marketLabel="California & the West Coast" />
}
