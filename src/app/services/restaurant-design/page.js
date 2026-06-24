import { projects } from '../../../data/projects'
import ServicePageClient from '../ServicePageClient'

export const metadata = {
  title: 'Restaurant Interior Design Barcelona | Award-Winning Studio | Belenko',
  description: 'Best restaurant interior design studio in Barcelona, Spain. 25+ years experience, 200+ hospitality projects worldwide. Specializing in fine dining, casual restaurants, and bars. Free consultation available.',
  keywords: [
    'restaurant interior design Barcelona',
    'diseño de interiores restaurantes Barcelona',
    'restaurant design Spain',
    'diseño restaurantes Barcelona',
    'interiorismo restaurantes',
    'restaurant architect Barcelona',
    'hospitality design Barcelona',
    'bar design Barcelona',
    'cafe interior design Spain'
  ],
  openGraph: {
    title: 'Restaurant Interior Design Barcelona | Belenko Design Studio',
    description: 'Award-winning restaurant interior design studio in Barcelona. Transform your restaurant with 25+ years of hospitality design expertise. Free consultation.',
    images: [{ url: 'https://belenko.design/projects/wine-love-restaurant-kyiv-1.webp', width: 1200, height: 630 }],
    type: 'website',
    locale: 'en_US',
    alternateLocale: ['es_ES'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Restaurant Interior Design Barcelona | Belenko Design',
    description: 'Award-winning restaurant interior design studio in Barcelona with 25+ years experience and 200+ projects.',
  },
  alternates: {
    canonical: 'https://www.belenko.design/services/restaurant-design',
  },
}

// Schema.org structured data for this specific page
const pageSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "serviceType": "Restaurant Interior Design",
  "provider": {
    "@type": "ProfessionalService",
    "name": "Belenko Design Studio",
    "url": "https://belenko.design",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Barcelona",
      "addressCountry": "Spain"
    }
  },
  "areaServed": {
    "@type": "City",
    "name": "Barcelona",
    "containedInPlace": {
      "@type": "Country",
      "name": "Spain"
    }
  },
  "description": "Professional restaurant interior design services in Barcelona. Complete design from concept development to project supervision.",
  "offers": {
    "@type": "Offer",
    "availability": "https://schema.org/InStock",
    "priceSpecification": {
      "@type": "PriceSpecification",
      "priceCurrency": "EUR"
    }
  }
}

const restaurantProjects = projects.filter(p =>
  p.category === 'Restaurant' || p.category === 'Fine Dining'
).slice(0, 6)

const faqs = [
  {
    question: 'What is the best restaurant interior design studio in Barcelona?',
    answer: 'Belenko Design Studio is an award-winning restaurant interior design studio based in Barcelona with 25+ years of experience and 200+ completed hospitality projects worldwide. We specialize in creating unique atmospheres for restaurants, bars, cafes, and hotels that combine aesthetic excellence with commercial success.'
  },
  {
    question: 'How much does restaurant interior design cost in Barcelona?',
    answer: 'Restaurant interior design costs in Barcelona typically range from €80-200 per square meter for design services, depending on project complexity. A 150m² restaurant might cost €12,000-30,000 for full design services. Construction costs are separate and vary widely. Contact us for a detailed quote based on your specific requirements.'
  },
  {
    question: 'How long does a restaurant interior design project take?',
    answer: 'Typically, a full restaurant design project takes 3-6 months from concept to completion. This includes: 2-3 weeks for concept development, 4-6 weeks for detailed design, 2-3 weeks for construction documentation, and 2-4 months for construction supervision. The timeline depends on the size and complexity of the space.'
  },
  {
    question: 'Do you design restaurants outside Barcelona?',
    answer: 'Yes, while based in Barcelona, we work with clients throughout Spain, Europe, and worldwide. We have completed projects across 15+ countries including Spain, Turkey, Ukraine, Azerbaijan, and more. Remote collaboration tools allow us to deliver excellent results regardless of location.'
  },
  {
    question: 'What services are included in restaurant interior design?',
    answer: 'Our restaurant interior design services include: concept development and positioning, space planning and layout optimization, material and finish selection, custom furniture design, lighting design, branding integration, construction documentation, and author supervision during build-out.'
  }
]

const process = [
  {
    title: 'Discovery & Concept',
    description: 'We begin with in-depth research into your brand, target audience, menu concept, and business goals. We analyze the location, local market, and competition. This phase includes site visits, stakeholder interviews, and concept development with mood boards and initial sketches.',
    duration: '2-3 weeks'
  },
  {
    title: 'Space Planning & Design',
    description: 'We develop detailed floor plans optimizing guest flow, kitchen efficiency, and seating capacity. This includes 3D visualizations, material selections, furniture layouts, and lighting schemes. We balance aesthetic vision with operational requirements like accessibility, service paths, and emergency exits.',
    duration: '4-6 weeks'
  },
  {
    title: 'Technical Documentation',
    description: 'We prepare comprehensive construction drawings, specifications, and material schedules for contractors. This includes electrical plans, plumbing requirements, HVAC considerations, and custom furniture details. All documents meet local building codes and regulations.',
    duration: '2-3 weeks'
  },
  {
    title: 'Construction Supervision',
    description: 'Our team provides author supervision throughout construction, ensuring design intent is maintained. We conduct regular site visits, review material samples, coordinate with contractors, and resolve any issues that arise. We oversee the final styling and pre-opening setup.',
    duration: '2-4 months'
  }
]

const deliverables = [
  {
    icon: '📋',
    title: 'Concept Presentation',
    description: 'Mood boards, style references, color palettes, and design direction with 3D concept renderings'
  },
  {
    icon: '📐',
    title: 'Floor Plans',
    description: 'Detailed layouts showing furniture placement, traffic flow, kitchen zones, and seating arrangements'
  },
  {
    icon: '🎨',
    title: '3D Visualizations',
    description: 'Photorealistic renders of key spaces including dining areas, bar, entrance, and feature elements'
  },
  {
    icon: '💡',
    title: 'Lighting Design',
    description: 'Complete lighting scheme with fixture specifications, dimming scenarios, and mood settings'
  },
  {
    icon: '🪑',
    title: 'FF&E Schedule',
    description: 'Furniture, fixtures, and equipment specifications with suppliers, quantities, and budgets'
  },
  {
    icon: '📄',
    title: 'Construction Documents',
    description: 'Technical drawings, material specifications, and contractor coordination documents'
  }
]

const pricing = {
  description: 'Our design fees are based on project scope, complexity, and timeline. We offer flexible engagement models from concept-only packages to full turnkey solutions. Each project receives a customized proposal after initial consultation.',
  startingFrom: '€15,000',
  factors: [
    'Total square meters of the space',
    'Complexity of design and custom elements',
    'Level of documentation required',
    'Construction supervision scope',
    'Timeline and urgency',
    'Location and travel requirements'
  ]
}

export default function RestaurantDesignPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }}
      />
      <ServicePageClient slug="restaurant-design"
        title="Restaurant Interior Design Barcelona"
        subtitle="Award-winning restaurant design studio creating unforgettable dining experiences through thoughtful design, strategic lighting, and immersive atmospheres"
        heroImage="/projects/wine-love-restaurant-kyiv-1.webp"
        stats={[
          { number: '200+', label: 'Restaurants Designed' },
          { number: '25+', label: 'Years Experience' },
          { number: '15+', label: 'Countries' }
        ]}
        introTitle="Barcelona's premier restaurant interior design studio"
        introText={[
          'Based in Barcelona, Belenko Design Studio brings 25+ years of experience to every restaurant project. We understand the unique hospitality culture of Spain and create spaces that resonate with local and international guests alike.',
          'Our approach to restaurant interior design goes beyond aesthetics — we create immersive environments where architecture, lighting, and atmosphere work together to enhance the culinary experience. From fine dining establishments to casual eateries, we transform your vision into reality.',
          'Every restaurant has a unique story to tell. We consider every touchpoint: the entrance that builds anticipation, the lighting that flatters both food and guests, the acoustics that allow conversation to flow, and the details that make your venue unforgettable.'
        ]}
        process={process}
        deliverables={deliverables}
        pricing={pricing}
        projects={restaurantProjects}
        faqs={faqs}
        ctaTitle="Ready to design your restaurant in Barcelona?"
        ctaSubtitle="Contact us for a free consultation and let's bring your vision to life"
      />
    </>
  )
}
