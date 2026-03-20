import React from 'react';

interface FAQItem {
  question: string;
  answer: string;
  id?: string;
}

interface FAQSchemaProps {
  faqItems: FAQItem[];
  title?: string;
}

/**
 * Component that adds structured FAQ data for better SEO
 * Follows Schema.org FAQPage format
 * 
 * @param faqItems Array of question and answer pairs
 * @param title Optional title for the FAQ section
 */
export function FAQSchema({ faqItems, title = "Veelgestelde vragen" }: FAQSchemaProps) {
  // Only render if we have FAQ items
  if (!faqItems || faqItems.length === 0) {
    return null;
  }

  // Structure the data according to Schema.org FAQPage format
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqItems.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

/**
 * Helper method to create structured FAQ data without rendering a component
 * Useful when you want to include FAQ data in other structured data
 */
export function createFAQStructuredData(faqItems: FAQItem[]) {
  if (!faqItems || faqItems.length === 0) {
    return null;
  }
  
  return faqItems.map(faq => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer
    }
  }));
} 