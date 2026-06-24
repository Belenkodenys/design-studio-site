import { projects } from '../../../data/projects'
import ServicePageClient from '../ServicePageClient'

export const metadata = {
  title: 'Cafe Interior Design | Coffee Shop Design Studio | Belenko Design',
  description: 'Expert cafe and coffee shop interior design. We create welcoming spaces that build community and brand loyalty. Specialty coffee shops, bakery cafes, and concept cafes.',
  keywords: 'cafe interior design, coffee shop design, bakery cafe interior, specialty coffee design, cafe renovation, coffee bar design',
  openGraph: {
    title: 'Cafe Interior Design | Belenko Design Studio',
    description: 'Design a cafe that becomes your neighborhood\'s favorite spot. Expert interior design for coffee shops, bakeries, and concept cafes.',
    images: [{ url: 'https://belenko.design/projects/milk-bar-cafe-kyiv-1.webp', width: 1200, height: 630 }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cafe Interior Design | Belenko Design',
    description: 'Creating cafes and coffee shops that build community and brand loyalty.',
  },
  alternates: {
    canonical: 'https://www.belenko.design/services/cafe-design',
  },
}

const cafeProjects = projects.filter(p =>
  p.category === 'Cafe' || p.category === 'Coffee Shop' || p.category === 'Bakery' ||
  p.title.toLowerCase().includes('milk')
).slice(0, 6)

const faqs = [
  {
    question: 'What makes a cafe design successful?',
    answer: 'Successful cafe design creates a welcoming atmosphere that encourages both quick visits and longer stays. Key elements include comfortable seating arrangements, good natural light, acoustic management, efficient counter flow, and a design that photographs well for social media sharing.'
  },
  {
    question: 'How do you design for specialty coffee shops?',
    answer: 'Specialty coffee shops require careful attention to the coffee bar as a focal point. We design spaces that showcase the brewing process, with proper ventilation, workflow efficiency for baristas, and sight lines that allow customers to appreciate the craft. Equipment placement and water/electrical infrastructure are carefully planned.'
  },
  {
    question: 'Can you design cafes for franchise or multi-location brands?',
    answer: 'Yes, we develop scalable design concepts that maintain brand consistency across locations while allowing for site-specific adaptations. We create design guidelines and specifications that can be replicated cost-effectively.'
  },
  {
    question: 'How do you balance ambiance with efficiency in cafe design?',
    answer: 'We optimize traffic flow, queue management, and service efficiency without sacrificing atmosphere. Strategic layout planning ensures smooth operations during peak hours while maintaining a relaxed environment for guests who want to linger.'
  },
  {
    question: 'What about bakery-cafe combinations?',
    answer: 'Bakery-cafes require integration of production, display, and dining areas. We design open kitchens that showcase the baking process, display cases that highlight products, and seating areas that capture the warm, inviting aromas. Ventilation and workflow are crucial considerations.'
  }
]

export default function CafeDesignPage() {
  return (
    <ServicePageClient slug="cafe-design"
      title="Cafe Interior Design"
      subtitle="Creating coffee shops and cafes that become beloved neighborhood destinations and powerful brand expressions"
      heroImage="/projects/milk-bar-cafe-kyiv-1.webp"
      stats={[
        { number: '50+', label: 'Cafes Designed' },
        { number: '25+', label: 'Years Experience' },
        { number: '10+', label: 'Countries' }
      ]}
      introTitle="We design cafes that build community"
      introText={[
        'A great cafe is the heart of a neighborhood — a place where people start their day, hold meetings, catch up with friends, or find a quiet corner to work. Our cafe designs create these essential gathering spaces.',
        'We understand that today\'s cafes must serve multiple purposes: quick morning coffees, leisurely brunches, remote work sessions, and social meetups. Our designs accommodate all these uses while maintaining a cohesive atmosphere.',
        'From specialty coffee shops to bakery-cafes, we bring expertise in workflow optimization, equipment integration, and creating spaces that are as photogenic as they are functional.'
      ]}
      projects={cafeProjects}
      faqs={faqs}
      ctaTitle="Ready to create your dream cafe?"
      ctaSubtitle="Let's design a space your community will love"
    />
  )
}
