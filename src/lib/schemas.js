const BASE_URL = "https://www.belenko.design";

const PROVIDER = {
  "@type": "ProfessionalService",
  name: "Belenko Design Studio",
  url: BASE_URL,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Barcelona",
    addressCountry: "Spain",
  },
};

export function buildServiceSchema({ serviceType, description, path }) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType,
    name: serviceType,
    description,
    url: `${BASE_URL}${path}`,
    provider: PROVIDER,
    areaServed: {
      "@type": "City",
      name: "Barcelona",
      containedInPlace: { "@type": "Country", name: "Spain" },
    },
  };
}

export function buildBreadcrumbSchema(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.path ? `${BASE_URL}${item.path}` : undefined,
    })),
  };
}

export function jsonLdScript(data) {
  return {
    type: "application/ld+json",
    dangerouslySetInnerHTML: { __html: JSON.stringify(data) },
  };
}
