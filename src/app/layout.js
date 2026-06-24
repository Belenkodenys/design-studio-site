import { Analytics } from '@vercel/analytics/react'
import { LanguageProvider } from '../i18n/LanguageContext'
import CookieConsent from '../components/CookieConsent'
import '../index.css'
import '../App.css'

export const metadata = {
  metadataBase: new URL('https://belenko.design'),
  title: {
    default: 'Restaurant Interior Design Barcelona | Belenko Design Studio',
    template: '%s | Belenko Design'
  },
  description: 'Award-winning restaurant, bar, cafe & hotel interior design studio in Barcelona. Leading hospitality designers in Europe with 25+ years experience and 200+ projects in Spain, Portugal, France, Italy, Germany, UK. Free consultation.',
  keywords: [
    // Barcelona & Spain
    'restaurant interior design Barcelona',
    'diseño de restaurantes Barcelona',
    'restaurant design Spain',
    'bar interior design Barcelona',
    'cafe design Barcelona',
    'hotel interior design Barcelona',
    'diseño de interiores restaurantes España',

    // Europe
    'restaurant design Europe',
    'hospitality design studio Europe',
    'European restaurant interior designer',
    'luxury restaurant design Europe',
    'bar design Europe',
    'cafe interior design Europe',
    'hotel design Europe',

    // Industry terms
    'HoReCa design',
    'hospitality architecture',
    'restaurant architect',
    'interior designer restaurants',
    'commercial interior design',
    'boutique hotel design',
    'cocktail bar design',
    'fine dining restaurant design',

    // Multilingual
    'diseño de bares',
    'diseño de cafeterías',
    'diseño de hoteles',
    'дизайн ресторанів',
    'дизайн інтер\'єру ресторану',
    'дизайн бару',
    'дизайн кафе'
  ],
  authors: [{ name: 'Denys Belenko', url: 'https://belenko.design' }],
  creator: 'Belenko Design Studio',
  publisher: 'Belenko Design Studio',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: ['es_ES', 'ru_RU', 'uk_UA'],
    url: 'https://www.belenko.design',
    siteName: 'Belenko Design Studio',
    title: 'Restaurant Interior Design Barcelona | Belenko Design Studio',
    description: 'Award-winning restaurant, bar, cafe & hotel interior design studio in Barcelona. Leading hospitality designers in Europe with 200+ projects.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Belenko Design Studio - Restaurant Interior Design Barcelona'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Restaurant Interior Design Barcelona | Belenko Design Studio',
    description: 'Award-winning restaurant interior design studio in Barcelona. 25+ years experience, 200+ hospitality projects worldwide.',
    images: ['/og-image.jpg'],
    creator: '@belenko_studio'
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  },
  alternates: {
    canonical: 'https://www.belenko.design',
    languages: {
      'en': 'https://www.belenko.design',
      'es': 'https://www.belenko.design',
      'ru': 'https://www.belenko.design',
      'uk': 'https://www.belenko.design'
    }
  },
  // verification: {
  //   google: 'YOUR_REAL_CODE_HERE'
  // },
  category: 'Interior Design'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

        {/* Meta Pixel Code */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '404907462596504');
              fbq('track', 'PageView');
            `
          }}
        />

        {/* Structured Data - Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ProfessionalService",
              "@id": "https://belenko.design/#organization",
              "name": "Belenko Design Studio",
              "alternateName": ["Belenko Studio", "Студія Беленко", "Estudio Belenko"],
              "description": "Award-winning restaurant interior design studio based in Barcelona, Spain. Specializing in restaurant, bar, cafe, and hotel interior design with 25+ years of experience and 200+ completed projects worldwide.",
              "url": "https://belenko.design",
              "logo": {
                "@type": "ImageObject",
                "url": "https://belenko.design/belenko-logo.png",
                "width": 300,
                "height": 100
              },
              "image": [
                "https://belenko.design/projects/wine-love-restaurant-kyiv-1.webp",
                "https://belenko.design/projects/agatha-restaurant-kyiv-1.webp",
                "https://belenko.design/projects/milk-bar-cafe-kyiv-1.webp"
              ],
              "telephone": "+34671825489",
              "email": "studiobelenko@gmail.com",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Barcelona",
                "addressLocality": "Barcelona",
                "addressRegion": "Catalonia",
                "postalCode": "08001",
                "addressCountry": "ES"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": 41.3851,
                "longitude": 2.1734
              },
              "areaServed": [
                {
                  "@type": "City",
                  "name": "Barcelona",
                  "containedInPlace": { "@type": "Country", "name": "Spain" }
                },
                { "@type": "City", "name": "Madrid" },
                { "@type": "City", "name": "Valencia" },
                { "@type": "City", "name": "Marbella" },
                { "@type": "City", "name": "Lisbon" },
                { "@type": "City", "name": "Paris" },
                { "@type": "City", "name": "Milan" },
                { "@type": "City", "name": "Rome" },
                { "@type": "City", "name": "London" },
                { "@type": "City", "name": "Berlin" },
                { "@type": "City", "name": "Munich" },
                { "@type": "City", "name": "Vienna" },
                { "@type": "City", "name": "Amsterdam" },
                { "@type": "City", "name": "Dubai" },
                { "@type": "Country", "name": "Spain" },
                { "@type": "Country", "name": "Portugal" },
                { "@type": "Country", "name": "France" },
                { "@type": "Country", "name": "Italy" },
                { "@type": "Country", "name": "Germany" },
                { "@type": "Country", "name": "United Kingdom" },
                { "@type": "Country", "name": "Netherlands" },
                { "@type": "Country", "name": "Austria" },
                { "@type": "Country", "name": "Ukraine" },
                { "@type": "Country", "name": "Turkey" },
                { "@type": "Country", "name": "UAE" },
                { "@type": "Continent", "name": "Europe" },
                "Worldwide"
              ],
              "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "Interior Design Services",
                "itemListElement": [
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Restaurant Interior Design",
                      "description": "Complete interior design for restaurants including concept development, space planning, furniture selection, and project supervision."
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Bar Interior Design",
                      "description": "Specialized bar and nightclub interior design creating unique atmospheres and memorable experiences."
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Cafe Interior Design",
                      "description": "Cafe and coffee shop design that balances aesthetics with functionality and brand identity."
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Hotel Interior Design",
                      "description": "Hotel and hospitality interior design for lobbies, rooms, restaurants, and common areas."
                    }
                  }
                ]
              },
              "foundingDate": "1999",
              "founder": {
                "@type": "Person",
                "name": "Denys Belenko",
                "jobTitle": "Founder & Creative Director",
                "description": "Award-winning interior designer with 25+ years of experience in hospitality design."
              },
              "numberOfEmployees": {
                "@type": "QuantitativeValue",
                "value": 28
              },
              "slogan": "We design feelings, not just spaces",
              "knowsAbout": [
                "Restaurant Interior Design",
                "Bar Design",
                "Cafe Design",
                "Hotel Design",
                "Hospitality Architecture",
                "Commercial Interior Design",
                "HoReCa Design",
                "Brand Identity for Restaurants"
              ],
              "award": [
                "Award-winning hospitality design studio",
                "200+ completed hospitality projects"
              ],
              "priceRange": "$$$$",
              "paymentAccepted": ["Bank Transfer", "Credit Card"],
              "currenciesAccepted": "EUR, USD",
              "openingHoursSpecification": {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                "opens": "09:00",
                "closes": "18:00"
              },
              "sameAs": [
                "https://instagram.com/belenko",
                "https://t.me/belenko_studio",
                "https://www.behance.net/belenko"
              ],
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.9",
                "reviewCount": "47",
                "bestRating": "5",
                "worstRating": "1"
              }
            })
          }}
        />

        {/* Structured Data - WebSite for search box */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Belenko Design Studio",
              "alternateName": "Belenko",
              "url": "https://belenko.design",
              "description": "Restaurant interior design studio in Barcelona",
              "inLanguage": ["en", "es", "ru", "uk"],
              "publisher": {
                "@id": "https://belenko.design/#organization"
              }
            })
          }}
        />

        {/* Structured Data - FAQ (Extended for AI) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "How much does restaurant interior design cost in Barcelona?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Restaurant interior design costs in Barcelona vary based on project size and complexity. Belenko Design Studio offers customized quotes for each project. Contact us for a free consultation to discuss your specific requirements and budget."
                  }
                },
                {
                  "@type": "Question",
                  "name": "What is the best restaurant interior design studio in Barcelona?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Belenko Design Studio is an award-winning restaurant interior design studio based in Barcelona with 25+ years of experience and 200+ completed hospitality projects worldwide. We specialize in creating unique atmospheres for restaurants, bars, cafes, and hotels."
                  }
                },
                {
                  "@type": "Question",
                  "name": "How long does restaurant interior design take?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "A typical restaurant interior design project takes 3-6 months from concept to completion, depending on the size and complexity. This includes concept development, detailed design, documentation, and construction supervision."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Do you work with restaurants outside Barcelona?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, while based in Barcelona, Belenko Design Studio works with clients worldwide. We have completed projects across Europe, Middle East, and beyond. Remote collaboration tools allow us to deliver excellent results regardless of location."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Who is Denys Belenko?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Denys Belenko is the founder and creative director of Belenko Design Studio, an award-winning hospitality interior design firm based in Barcelona, Spain. With over 25 years of experience, he has led the design of more than 200 restaurants, bars, cafes, and hotels worldwide."
                  }
                },
                {
                  "@type": "Question",
                  "name": "What services does Belenko Design Studio offer?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Belenko Design Studio offers comprehensive hospitality design services including: concept development and positioning, architecture and space planning, interior design, decor and custom furniture, branding and visual identity, creative content production, and author supervision during construction."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Can Belenko Design Studio help with bar and nightclub design?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, Belenko Design Studio specializes in bar and nightclub interior design. Our portfolio includes award-winning projects like 12 Monkeys speakeasy bar in Odesa and Fitz cocktail bar. We create unique atmospheres that enhance the guest experience and drive business success."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Does Belenko Design Studio offer free consultations?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, Belenko Design Studio offers free initial consultations for potential clients. Contact us via email at studiobelenko@gmail.com or phone at +34 671 825 489 to schedule your consultation and discuss your restaurant or hospitality project."
                  }
                },
                {
                  "@type": "Question",
                  "name": "What languages does Belenko Design Studio support?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Belenko Design Studio's team speaks English, Spanish, Ukrainian, and Russian. Our website is available in all four languages to serve our international clientele across Europe, Middle East, and beyond."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Where can I see Belenko Design Studio's portfolio?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "You can view Belenko Design Studio's portfolio of 200+ projects at belenko.design/projects. Our work includes restaurants, bars, cafes, and hotels in Spain, Ukraine, Turkey, Azerbaijan, and other countries. Notable projects include Bella, Wine Love, Coco Japanese, Agatha, and Bruno."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Do you design restaurants in Europe?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, Belenko Design Studio is a leading restaurant interior design firm in Europe. Based in Barcelona, we work throughout Spain, Portugal, France, Italy, Germany, UK, and other European countries. Our European portfolio includes fine dining restaurants, cocktail bars, boutique hotels, and trendy cafes."
                  }
                },
                {
                  "@type": "Question",
                  "name": "What types of hospitality venues does Belenko Design Studio design?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "We specialize in all types of hospitality venues: fine dining restaurants, casual restaurants, cocktail bars, wine bars, speakeasy bars, nightclubs, cafes, coffee shops, boutique hotels, hotel restaurants, rooftop bars, and beach clubs. Each project is tailored to create a unique atmosphere and memorable guest experience."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Can you design a hotel interior in Barcelona?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Absolutely! Hotel interior design is one of our core services. We design boutique hotels, hotel lobbies, hotel restaurants and bars, guest rooms, and common areas. Being based in Barcelona, we have deep knowledge of local regulations, suppliers, and the hospitality market in Catalonia and Spain."
                  }
                },
                {
                  "@type": "Question",
                  "name": "What makes Belenko Design Studio different from other design firms in Europe?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Belenko Design Studio stands out through our concept-first approach: we design feelings, not just spaces. With 25+ years of experience and 200+ completed projects, we understand hospitality business deeply. We offer complete service from concept to opening, including branding, architecture, interior design, furniture, and construction supervision."
                  }
                }
              ]
            })
          }}
        />

        {/* Structured Data - Person (Founder) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "@id": "https://belenko.design/#founder",
              "name": "Denys Belenko",
              "alternateName": ["Denis Belenko", "Денис Беленко"],
              "jobTitle": "Founder & Creative Director",
              "description": "Award-winning interior designer and founder of Belenko Design Studio, specializing in restaurant and hospitality design with 25+ years of experience.",
              "url": "https://belenko.design",
              "image": "https://belenko.design/about-founder.jpg",
              "worksFor": {
                "@id": "https://belenko.design/#organization"
              },
              "knowsAbout": [
                "Restaurant Interior Design",
                "Hospitality Architecture",
                "Bar Design",
                "Cafe Design",
                "Hotel Design",
                "Brand Identity"
              ],
              "sameAs": [
                "https://instagram.com/belenko",
                "https://www.behance.net/belenko"
              ]
            })
          }}
        />

        {/* Structured Data - ImageGallery (Portfolio) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ImageGallery",
              "name": "Belenko Design Studio Portfolio",
              "description": "Portfolio of 200+ restaurant, bar, cafe and hotel interior design projects by Belenko Design Studio",
              "url": "https://belenko.design/projects",
              "numberOfItems": 200,
              "author": {
                "@id": "https://belenko.design/#organization"
              }
            })
          }}
        />
      </head>
      <body>
        <noscript>
          <img height="1" width="1" style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=404907462596504&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        <LanguageProvider>
          <div className="app">
            {children}
          </div>
          <CookieConsent />
        </LanguageProvider>
        <Analytics />
      </body>
    </html>
  )
}
