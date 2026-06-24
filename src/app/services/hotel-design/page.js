import { projects } from '../../../data/projects'
import ServicePageClient from '../ServicePageClient'

export const metadata = {
  title: 'Hotel Interior Design | Boutique & Luxury Hotels | Belenko Design',
  description: 'Award-winning hotel interior design services. We create memorable guest experiences through innovative lobby, room, and F&B venue design. Boutique hotels, luxury resorts, and hospitality spaces.',
  keywords: 'hotel interior design, boutique hotel design, luxury hotel interior, hotel lobby design, hotel room design, hospitality design',
  openGraph: {
    title: 'Hotel Interior Design | Belenko Design Studio',
    description: 'Create unforgettable hotel experiences with award-winning interior design. Lobbies, rooms, restaurants, and public spaces that wow guests.',
    images: [{ url: 'https://belenko.design/projects/agatha-restaurant-kyiv-1.webp', width: 1200, height: 630 }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hotel Interior Design | Belenko Design',
    description: 'Boutique and luxury hotel interior design. Creating spaces that turn stays into stories.',
  },
  alternates: {
    canonical: 'https://www.belenko.design/services/hotel-design',
  },
}

const hotelProjects = projects.filter(p =>
  p.category === 'Hotel' || p.category === 'Resort' || p.category === 'Boutique Hotel' ||
  p.title.toLowerCase().includes('agatha') || p.title.toLowerCase().includes('bella')
).slice(0, 6)

const faqs = [
  {
    question: 'What areas of a hotel do you design?',
    answer: 'We design all guest-facing areas: lobbies, reception, guest rooms and suites, corridors, restaurants and bars, spas, meeting rooms, rooftops, and pool areas. We can handle the entire hotel or focus on specific F&B venues and public spaces.'
  },
  {
    question: 'How do you approach boutique hotel design?',
    answer: 'Boutique hotels thrive on personality and unique experiences. We create distinctive design narratives that reflect local culture, tell a story, and create Instagram-worthy moments. Every boutique hotel should feel like a discovery.'
  },
  {
    question: 'Do you work with hotel brands and operators?',
    answer: 'Yes, we work with independent hotels, small groups, and larger brands. We understand brand standards and can design within guidelines while adding creative flair. We also help independent hotels develop their own design identity.'
  },
  {
    question: 'How do you balance aesthetics with hotel operational requirements?',
    answer: 'Hotel design must be beautiful AND functional. We work closely with operators to understand housekeeping workflows, maintenance requirements, and durability needs. Our designs use materials that look stunning and stand up to heavy use.'
  },
  {
    question: 'What about hotel restaurant and bar design?',
    answer: 'Hotel F&B venues are often our specialty projects. These spaces must serve hotel guests and attract local patrons. We design restaurants and bars that become destinations in their own right, driving revenue and building the hotel\'s reputation.'
  }
]

export default function HotelDesignPage() {
  return (
    <ServicePageClient slug="hotel-design"
      title="Hotel Interior Design"
      subtitle="Designing boutique hotels and hospitality spaces that turn stays into unforgettable stories"
      heroImage="/projects/agatha-restaurant-kyiv-1.webp"
      stats={[
        { number: '30+', label: 'Hotels Designed' },
        { number: '25+', label: 'Years Experience' },
        { number: '12+', label: 'Countries' }
      ]}
      introTitle="We design hotels that guests remember forever"
      introText={[
        'A hotel is more than a place to sleep — it\'s a stage for experiences, a retreat from the everyday, a destination in itself. Our hotel designs create spaces that guests talk about long after they\'ve checked out.',
        'We specialize in boutique and lifestyle hotels where design drives the guest experience. From the moment of arrival to the last morning coffee, every touchpoint is considered and crafted.',
        'Our team brings deep expertise in hospitality operations, understanding that beautiful design must also work seamlessly for staff and stand up to the demands of daily hotel life.'
      ]}
      projects={hotelProjects}
      faqs={faqs}
      ctaTitle="Ready to elevate your hotel?"
      ctaSubtitle="Let's create spaces that turn guests into advocates"
    />
  )
}
