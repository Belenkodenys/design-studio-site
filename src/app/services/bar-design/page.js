import { projects } from '../../../data/projects'
import ServicePageClient from '../ServicePageClient'

export const metadata = {
  title: 'Bar Interior Design | Cocktail & Wine Bar Design | Belenko Design',
  description: 'Specialized bar interior design services. We create atmospheric cocktail bars, wine bars, and nightlife venues that attract customers and drive revenue. Award-winning studio.',
  keywords: 'bar interior design, cocktail bar design, wine bar interior, nightclub design, lounge design, bar renovation',
  openGraph: {
    title: 'Bar Interior Design | Belenko Design Studio',
    description: 'Create an unforgettable bar experience with expert interior design. Cocktail bars, wine bars, lounges — we design spaces that become destinations.',
    images: [{ url: 'https://belenko.design/projects/saint-bar-kyiv-1.webp', width: 1200, height: 630 }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bar Interior Design | Belenko Design',
    description: 'Expert bar and lounge interior design. Creating atmospheric spaces that become city destinations.',
  },
  alternates: {
    canonical: 'https://www.belenko.design/services/bar-design',
  },
}

const barProjects = projects.filter(p =>
  p.category === 'Bar' || p.category === 'Lounge' || p.category === 'Wine Bar'
).slice(0, 6)

const faqs = [
  {
    question: 'What makes a bar design successful?',
    answer: 'A successful bar design creates atmosphere and drives revenue. Key elements include strategic bar placement for efficient service, lighting that sets the mood, acoustics that allow conversation, and a layout that encourages guests to stay longer. We also focus on creating Instagram-worthy moments that generate organic marketing.'
  },
  {
    question: 'How do you approach cocktail bar design differently from other bars?',
    answer: 'Cocktail bars require a theater-like quality where the bartender becomes a performer. We design bar stations that showcase the craft, with proper lighting for the show, storage for extensive spirit collections, and sight lines that allow guests to appreciate the artistry.'
  },
  {
    question: 'Can you design bars within restaurants?',
    answer: 'Yes, we frequently design bar areas as part of larger restaurant projects. The bar can serve as a focal point, a waiting area, or a destination in itself. We ensure it integrates seamlessly while maintaining its own identity.'
  },
  {
    question: 'What about outdoor bar design?',
    answer: 'Outdoor and rooftop bars present unique challenges and opportunities. We consider weather protection, heating/cooling solutions, noise regulations, and views. Our designs maximize the outdoor experience while ensuring year-round functionality.'
  },
  {
    question: 'How do you handle nightclub and late-night venue design?',
    answer: 'Late-night venues require special attention to sound systems, lighting rigs, flow management, and security. We work with acoustic engineers and lighting designers to create immersive experiences that keep guests engaged until closing time.'
  }
]

export default function BarDesignPage() {
  return (
    <ServicePageClient slug="bar-design"
      title="Bar Interior Design"
      subtitle="Designing cocktail bars, wine bars, and lounges that become the city's most talked-about destinations"
      heroImage="/projects/saint-bar-kyiv-1.webp"
      stats={[
        { number: '80+', label: 'Bars Designed' },
        { number: '25+', label: 'Years Experience' },
        { number: '12+', label: 'Countries' }
      ]}
      introTitle="We create bars that become destinations"
      introText={[
        'A great bar is more than a place to drink — it\'s a social hub, a stage, a retreat. Our bar designs create atmospheres that draw people in and keep them coming back.',
        'We understand the alchemy of bar design: the interplay of lighting and mood, the theater of the back bar, the intimacy of a corner booth. Every element is considered, from the height of bar stools to the acoustics that allow conversation to flow.',
        'Whether you\'re creating a speakeasy-style cocktail bar, an elegant wine bar, or a high-energy nightclub, we bring the expertise to make your vision a reality.'
      ]}
      projects={barProjects}
      faqs={faqs}
      ctaTitle="Ready to create your dream bar?"
      ctaSubtitle="Let's design a space that becomes the talk of the town"
    />
  )
}
