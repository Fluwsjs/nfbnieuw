import React from 'react';

// Types for structured data
interface OpeningHoursSpecification {
  dayOfWeek: string | string[];
  opens: string;
  closes: string;
  validFrom?: string;
  validThrough?: string;
}

interface Address {
  streetAddress: string;
  addressLocality: string;
  postalCode: string;
  addressCountry: string;
  addressRegion?: string;
}

interface GeoCoordinates {
  latitude: string | number;
  longitude: string | number;
}

interface Service {
  name: string;
  description: string;
  url?: string;
  price?: string;
  priceCurrency?: string;
}

interface SocialProfile {
  platform: string;
  url: string;
}

interface LocalBusinessSchemaProps {
  name: string;
  legalName?: string;
  description: string;
  url: string;
  telephone: string;
  email?: string;
  address: Address;
  logo?: string;
  image?: string;
  priceRange?: string;
  currenciesAccepted?: string;
  paymentAccepted?: string[];
  openingHours?: OpeningHoursSpecification[];
  hasOfferCatalog?: Service[];
  geo?: GeoCoordinates;
  socialProfiles?: SocialProfile[];
  sameAs?: string[];
}

/**
 * Component for adding LocalBusiness structured data for better local SEO
 * Follows Schema.org LocalBusiness format with beauty salon specific fields
 */
export function LocalBusinessSchema({
  name,
  legalName,
  description,
  url,
  telephone,
  email,
  address,
  logo,
  image,
  priceRange = "€€",
  currenciesAccepted = "EUR",
  paymentAccepted = ["Cash", "Credit Card", "Debit Card"],
  openingHours,
  hasOfferCatalog,
  geo,
  socialProfiles,
  sameAs,
}: LocalBusinessSchemaProps) {
  // Transform the services array into proper schema format
  const serviceOfferings = hasOfferCatalog?.map((service, index) => ({
    "@type": "Offer",
    "itemOffered": {
      "@type": "Service",
      "name": service.name,
      "description": service.description,
      "url": service.url || `${url}/diensten`
    },
    "price": service.price,
    "priceCurrency": service.priceCurrency || "EUR",
    "position": index + 1,
  }));

  // Format opening hours in Schema.org format
  const formattedOpeningHours = openingHours?.map(hours => ({
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": hours.dayOfWeek,
    "opens": hours.opens,
    "closes": hours.closes,
    ...(hours.validFrom && { "validFrom": hours.validFrom }),
    ...(hours.validThrough && { "validThrough": hours.validThrough }),
  }));

  // Construct the structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BeautySalon",
    "name": name,
    ...(legalName && { "legalName": legalName }),
    "description": description,
    "url": url,
    "telephone": telephone,
    ...(email && { "email": email }),
    "address": {
      "@type": "PostalAddress",
      "streetAddress": address.streetAddress,
      "addressLocality": address.addressLocality,
      "postalCode": address.postalCode,
      "addressCountry": address.addressCountry,
      ...(address.addressRegion && { "addressRegion": address.addressRegion }),
    },
    ...(logo && { 
      "logo": {
        "@type": "ImageObject",
        "url": logo.startsWith('http') ? logo : `${url}${logo}`
      } 
    }),
    ...(image && { 
      "image": {
        "@type": "ImageObject",
        "url": image.startsWith('http') ? image : `${url}${image}`
      } 
    }),
    "priceRange": priceRange,
    "currenciesAccepted": currenciesAccepted,
    "paymentAccepted": paymentAccepted,
    ...(formattedOpeningHours && formattedOpeningHours.length > 0 && { 
      "openingHoursSpecification": formattedOpeningHours 
    }),
    ...(serviceOfferings && serviceOfferings.length > 0 && {
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Diensten",
        "itemListElement": serviceOfferings
      }
    }),
    ...(geo && {
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": geo.latitude,
        "longitude": geo.longitude
      }
    }),
    ...(sameAs && sameAs.length > 0 && { "sameAs": sameAs }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
} 