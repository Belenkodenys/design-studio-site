import { Helmet } from 'react-helmet-async';

const BASE_URL = 'https://www.belenko.design';

// Organization schema for the whole site
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Belenko Design Studio",
  "alternateName": "Belenko Studio",
  "url": BASE_URL,
  "logo": `${BASE_URL}/belenko-logo.png`,
  "description": "Award-winning interior design studio specializing in restaurants, bars, cafes, and hospitality spaces.",
  "foundingDate": "2008",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Kyiv",
    "addressCountry": "Ukraine"
  },
  "sameAs": [
    "https://www.instagram.com/belenko.design",
    "https://www.behance.net/belenkodesign",
    "https://www.pinterest.com/belenkodesign"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer service",
    "email": "office@belenko.design",
    "availableLanguage": ["English", "Ukrainian", "Russian", "Spanish"]
  }
};

// Website schema with search action
const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Belenko Design Studio",
  "url": BASE_URL,
  "potentialAction": {
    "@type": "SearchAction",
    "target": `${BASE_URL}/projects/?search={search_term_string}`,
    "query-input": "required name=search_term_string"
  }
};

export default function SEO({
  title,
  description,
  image,
  url,
  type = 'website',
  noindex = false,
  schema = null,
  article = null
}) {
  const fullTitle = title
    ? `${title} | Belenko Design`
    : 'Belenko Design Studio — Restaurant & Bar Interior Design';

  const fullDescription = description ||
    'Award-winning interior design studio specializing in restaurants, bars, and hospitality spaces. Projects in Ukraine, Turkey, Spain, Azerbaijan.';

  const canonicalUrl = url ? `${BASE_URL}${url}` : BASE_URL;
  const fullImage = image ? (image.startsWith('http') ? image : `${BASE_URL}${image}`) : `${BASE_URL}/og-image.jpg`;

  // Combine schemas
  const allSchemas = [organizationSchema, websiteSchema];
  if (schema) {
    allSchemas.push(schema);
  }

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={fullDescription} />
      <link rel="canonical" href={canonicalUrl} />

      {/* hreflang tags - same content, language selection via UI */}
      <link rel="alternate" hrefLang="x-default" href={canonicalUrl} />
      <link rel="alternate" hrefLang="en" href={canonicalUrl} />
      <link rel="alternate" hrefLang="uk" href={canonicalUrl} />
      <link rel="alternate" hrefLang="ru" href={canonicalUrl} />
      <link rel="alternate" hrefLang="es" href={canonicalUrl} />

      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={fullDescription} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:site_name" content="Belenko Design Studio" />
      <meta property="og:locale" content="en_US" />
      <meta property="og:locale:alternate" content="uk_UA" />
      <meta property="og:locale:alternate" content="ru_RU" />
      <meta property="og:locale:alternate" content="es_ES" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={fullDescription} />
      <meta name="twitter:image" content={fullImage} />

      {/* Schema.org JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify(allSchemas)}
      </script>
    </Helmet>
  );
}

// Helper function to generate project SEO data with schema
export function getProjectSEO(project, lang = 'en') {
  if (!project) return {};

  const { id, title, category, location, year, description, image, services } = project;

  // Parse location (e.g., "Odesa, Ukraine" -> { city: "Odesa", country: "Ukraine" })
  const [city, country] = (location || '').split(', ');

  // Generate title: "Project Name — Category | City, Country (Year) | Belenko Design"
  const seoTitle = `${title} — ${category} Interior Design | ${city}, ${country} (${year})`;

  // Generate description: 140-160 chars with key info
  let seoDescription = description;
  if (seoDescription && seoDescription.length > 160) {
    seoDescription = seoDescription.substring(0, 157) + '...';
  }

  // Project schema (CreativeWork)
  const projectSchema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "name": title,
    "description": description,
    "image": image ? `${BASE_URL}${image}` : undefined,
    "url": `${BASE_URL}/project/${id}/`,
    "dateCreated": year,
    "creator": {
      "@type": "Organization",
      "name": "Belenko Design Studio",
      "url": BASE_URL
    },
    "genre": `${category} Interior Design`,
    "locationCreated": {
      "@type": "Place",
      "name": location,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": city,
        "addressCountry": country
      }
    },
    "keywords": services ? services.join(', ') : undefined
  };

  // Breadcrumb schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": BASE_URL
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Projects",
        "item": `${BASE_URL}/projects/`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": title,
        "item": `${BASE_URL}/project/${id}/`
      }
    ]
  };

  return {
    title: seoTitle,
    description: seoDescription,
    image: image,
    url: `/project/${id}/`,
    type: 'article',
    schema: [projectSchema, breadcrumbSchema]
  };
}

// Helper for blog posts
export function getBlogPostSEO(post, lang = 'en') {
  if (!post) return {};

  const { slug, title, excerpt, image, date, category } = post;

  const blogPostSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": title,
    "description": excerpt,
    "image": image ? `${BASE_URL}${image}` : undefined,
    "url": `${BASE_URL}/blog/${slug}/`,
    "datePublished": date,
    "dateModified": date,
    "author": {
      "@type": "Organization",
      "name": "Belenko Design Studio",
      "url": BASE_URL
    },
    "publisher": {
      "@type": "Organization",
      "name": "Belenko Design Studio",
      "logo": {
        "@type": "ImageObject",
        "url": `${BASE_URL}/belenko-logo.png`
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${BASE_URL}/blog/${slug}/`
    },
    "articleSection": category
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": BASE_URL
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Blog",
        "item": `${BASE_URL}/blog/`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": title,
        "item": `${BASE_URL}/blog/${slug}/`
      }
    ]
  };

  return {
    title: title,
    description: excerpt,
    image: image,
    url: `/blog/${slug}/`,
    type: 'article',
    schema: [blogPostSchema, breadcrumbSchema]
  };
}

// Helper for service pages
export function getServiceSEO(service) {
  if (!service) return {};

  const { slug, title, description, image } = service;

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": title,
    "description": description,
    "url": `${BASE_URL}/services/${slug}/`,
    "provider": {
      "@type": "Organization",
      "name": "Belenko Design Studio",
      "url": BASE_URL
    },
    "areaServed": ["Ukraine", "Turkey", "Spain", "Azerbaijan", "Europe"],
    "serviceType": title
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": BASE_URL
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Services",
        "item": `${BASE_URL}/#services`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": title,
        "item": `${BASE_URL}/services/${slug}/`
      }
    ]
  };

  return {
    title: `${title} | Professional Interior Design Services`,
    description: description,
    image: image,
    url: `/services/${slug}/`,
    type: 'website',
    schema: [serviceSchema, breadcrumbSchema]
  };
}
