import './globals.css';
import Script from 'next/script';
import { Navbar } from '@/components/ui/navbar';
import { Footer } from '@/components/ui/footer';
import { FloatingCTA } from '@/components/ui/floating-cta';
import { Inter, Playfair_Display } from 'next/font/google';
import type { Metadata } from "next";

// Font optimizations - reduce font subset to only needed characters
const inter = Inter({ 
  subsets: ['latin'], 
  display: 'swap',
  preload: true,
  variable: '--font-sans' 
});

const playfair = Playfair_Display({ 
  subsets: ['latin'], 
  display: 'swap',
  preload: true,
  variable: '--font-serif' 
});

export const metadata: Metadata = {
  title: "NFB Salon Aerdt | Nails Face Body Salon voor Gezichtsbehandelingen & Nagelstyling",
  description: "NFB Salon in Aerdt, dé beauty salon voor professionele gezichtsbehandelingen, waxen, epileren, manicure en nagelstyling. Persoonlijke aandacht in een rustgevende omgeving.",
  keywords: [
    "beauty salon Aerdt", 
    "gezichtsbehandelingen Aerdt", 
    "waxen epileren Aerdt", 
    "nagels Aerdt", 
    "nagelbehandelingen Aerdt", 
    "wimperextensions Aerdt", 
    "schoonheidsspecialist Aerdt", 
    "lichaamsbehandelingen Aerdt",
    "manicure pedicure Aerdt",
    "salon Gelderland"
  ],
  authors: [{ name: "NFB Salon Aerdt" }],
  creator: "NFB Salon",
  metadataBase: new URL("https://nfbsalon.nl"),
  alternates: {
    canonical: '/',
    languages: {
      'nl-NL': '/',
      'en-US': '/en',
    },
  },
  openGraph: {
    type: "website",
    locale: "nl_NL",
    url: "https://nfbsalon.nl",
    title: "NFB Salon Aerdt | Gezichtsbehandelingen & Nagelstyling",
    description: "Beauty salon in Aerdt voor gezichtsbehandelingen, waxen & epileren, nagelstyling en lichaamsbehandelingen. Maak nu een afspraak!",
    siteName: "NFB Salon Aerdt",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "NFB Salon Aerdt - Beauty Salon",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NFB Salon Aerdt | Gezichtsbehandelingen & Nagelstyling",
    description: "Beauty salon in Aerdt voor gezichtsbehandelingen, waxen & epileren, nagelstyling en lichaamsbehandelingen. Maak nu een afspraak!",
    images: ["/images/og-image.jpg"],
    creator: "@nfbsalon",
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.png", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
    shortcut: "/favicon.ico",
  },
  manifest: "/site.webmanifest",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="preload" href="/next.svg" as="image" />
        <meta name="theme-color" content="#FFF9F5" />
        
        {/* LocalBusiness Structured Data */}
        <Script
          id="schema-local-business"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BeautySalon",
              "name": "NFB Salon Aerdt",
              "image": "https://nfbsalon.nl/images/salon-interior.jpg",
              "description": "Beauty salon in Aerdt voor gezichtsbehandelingen, waxen & epileren, nagelstyling en lichaamsbehandelingen.",
              "@id": "https://nfbsalon.nl",
              "url": "https://nfbsalon.nl",
              "telephone": "+31201234567",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Loostraat 7",
                "addressLocality": "Aerdt",
                "postalCode": "6913 AG",
                "addressCountry": "NL"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": 51.749308,
                "longitude": 6.075211
              },
              "openingHoursSpecification": [
                {
                  "@type": "OpeningHoursSpecification",
                  "dayOfWeek": ["Monday"],
                  "opens": "09:00",
                  "closes": "18:00"
                },
                {
                  "@type": "OpeningHoursSpecification",
                  "dayOfWeek": ["Thursday", "Friday"],
                  "opens": "09:00",
                  "closes": "20:00"
                },
                {
                  "@type": "OpeningHoursSpecification",
                  "dayOfWeek": "Saturday",
                  "opens": "10:00",
                  "closes": "17:00"
                }
              ],
              "sameAs": [
                "https://www.facebook.com/nfbsalon",
                "https://www.instagram.com/nfbsalon"
              ],
              "priceRange": "€€"
            })
          }}
        />
        
        {/* Service Offerings Structured Data */}
        <Script
          id="schema-services"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ItemList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "item": {
                    "@type": "Service",
                    "name": "Gezichtsbehandelingen Aerdt",
                    "url": "https://nfbsalon.nl/diensten/gezichtsbehandelingen",
                    "description": "Professionele gezichtsbehandelingen in Aerdt inclusief reiniging, peeling, masker en verzorging afgestemd op uw huidtype.",
                    "provider": {
                      "@type": "BeautySalon",
                      "name": "NFB Salon Aerdt",
                      "image": "https://nfbsalon.nl/images/services/facial.jpg"
                    },
                    "areaServed": {
                      "@type": "City",
                      "name": "Aerdt"
                    }
                  }
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "item": {
                    "@type": "Service",
                    "name": "Waxen & Epileren Aerdt",
                    "url": "https://nfbsalon.nl/diensten/waxen-epileren",
                    "description": "Professioneel waxen en epileren voor uw wenkbrauwen en andere lichaamsdelen in Aerdt.",
                    "provider": {
                      "@type": "BeautySalon",
                      "name": "NFB Salon Aerdt",
                      "image": "https://nfbsalon.nl/images/services/waxen.jpg"
                    },
                    "areaServed": {
                      "@type": "City",
                      "name": "Aerdt"
                    }
                  }
                },
                {
                  "@type": "ListItem",
                  "position": 3,
                  "item": {
                    "@type": "Service",
                    "name": "Nagelbehandelingen Aerdt",
                    "url": "https://nfbsalon.nl/diensten/nagelbehandelingen",
                    "description": "Professionele nagelstyling, manicure en pedicure in Aerdt. Behandelingen voor zowel natuurlijke als kunstnagels.",
                    "provider": {
                      "@type": "BeautySalon",
                      "name": "NFB Salon Aerdt",
                      "image": "https://nfbsalon.nl/images/services/nails.jpg"
                    },
                    "areaServed": {
                      "@type": "City",
                      "name": "Aerdt"
                    }
                  }
                }
              ]
            })
          }}
        />
      </head>
      <body className="bg-background min-h-screen flex flex-col">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
