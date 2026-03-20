import { HeroSection } from "@/components/sections/hero";
import { AboutSection } from "@/components/sections/about";
import { ServicesSection } from "@/components/sections/services";
import { USPSection } from "@/components/sections/usp";
import { TestimonialsSection, ContactSection } from "@/app/components/dynamic-sections";
import { LocalBusinessSchema } from "@/components/seo/local-business-schema";
import { FAQSchema } from "@/components/seo/faq-schema";

// Simpele homepage functie om te testen of routing werkt
// Je kunt deze functie verwijderen als alles werkt
// export default function HomeTest() {
//   return <h1>Welkom bij NFB Salon</h1>;
// }

// FAQ Items for structured data
const faqItems = [
  {
    question: "Hoe kan ik een afspraak maken bij NFB Salon in Aerdt?",
    answer: "U kunt eenvoudig online een afspraak maken via onze boekingspagina, of telefonisch contact opnemen. We zijn geopend van maandag t/m zaterdag."
  },
  {
    question: "Welke diensten biedt NFB Salon in Aerdt aan?",
    answer: "NFB Salon biedt professionele gezichtsbehandelingen, nagelbehandelingen (manicure en pedicure), en waxen/epileren diensten aan. Bekijk onze dienstenpagina voor een volledig overzicht."
  },
  {
    question: "Moet ik me voorbereiden op mijn behandeling?",
    answer: "Voor de meeste behandelingen is geen speciale voorbereiding nodig. Voor waxen is het aan te raden dat de haren minimaal 5mm lang zijn. Voor nagelbehandelingen vragen we u om eventuele gellak of acryl vooraf te verwijderen als dat mogelijk is."
  },
  {
    question: "Hoe lang van tevoren moet ik afzeggen als ik niet kan komen?",
    answer: "We verzoeken u vriendelijk om minimaal 24 uur van tevoren af te zeggen. Bij afzegging binnen 24 uur kunnen kosten in rekening worden gebracht."
  },
  {
    question: "Zijn er parkeermogelijkheden bij NFB Salon in Aerdt?",
    answer: "Ja, er is voldoende gratis parkeergelegenheid beschikbaar in de directe omgeving van onze salon in Aerdt."
  }
];

// Local business data for structured data
const businessData = {
  name: "NFB Salon Aerdt",
  description: "NFB Salon in Aerdt biedt professionele gezichtsbehandelingen, nagelbehandelingen en waxen/epileren diensten aan in een ontspannen omgeving.",
  url: "https://nfbsalon.nl",
  telephone: "+31612345678",
  email: "info@nfbsalon.nl",
  address: {
    streetAddress: "Kerkstraat 12",
    addressLocality: "Aerdt",
    postalCode: "6913 AK",
    addressCountry: "NL"
  },
  logo: "/images/nfblogo2.png",
  geo: {
    latitude: 51.8825,
    longitude: 6.0873
  },
  openingHours: [
    {
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "18:00"
    },
    {
      dayOfWeek: "Saturday",
      opens: "10:00",
      closes: "16:00"
    }
  ],
  hasOfferCatalog: [
    {
      name: "Gezichtsbehandelingen",
      description: "Professionele en ontspannende gezichtsbehandelingen aangepast aan uw huidtype in Aerdt.",
      url: "https://nfbsalon.nl/diensten/gezichtsbehandelingen"
    },
    {
      name: "Nagelbehandelingen",
      description: "Manicure, pedicure en gellak behandelingen voor verzorgde handen en voeten in Aerdt.",
      url: "https://nfbsalon.nl/diensten/nagelbehandelingen"
    },
    {
      name: "Waxen en Epileren",
      description: "Professionele ontharing door middel van waxen en epileren voor een langdurig glad resultaat in Aerdt.",
      url: "https://nfbsalon.nl/diensten/waxen-epileren"
    }
  ],
  sameAs: [
    "https://www.facebook.com/nfbsalon",
    "https://www.instagram.com/nfbsalon"
  ]
};

export default function Home() {
  return (
    <>
      {/* Structured data for Local Business */}
      <LocalBusinessSchema {...businessData} />
      
      {/* Structured data for FAQs */}
      <FAQSchema faqItems={faqItems} />
      
      <main className="overflow-hidden">
        {/* Hero Section - text only version */}
        <section className="py-24 bg-gradient-to-b from-[#FDF6F1] to-[#F9F1EA]">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-5xl md:text-6xl font-serif font-semibold mb-8 text-[#331A12]">
              <span className="text-[#B99885]">NFB Salon</span> Aerdt
            </h1>
            <p className="text-xl text-[#331A12]/80 max-w-3xl mx-auto mb-12 leading-relaxed">
              Welkom bij NFB Salon in Aerdt - uw schoonheidssalon voor professionele gezichtsbehandelingen, nagelzorg en ontharingstechnieken in een rustgevende omgeving.
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <a 
                href="/afspraak" 
                className="px-8 py-4 bg-[#B99885] text-white rounded-full hover:bg-[#a88774] transition-colors shadow-md"
              >
                Maak een afspraak
              </a>
              <a 
                href="/diensten" 
                className="px-8 py-4 border border-[#B99885] text-[#B99885] rounded-full hover:bg-[#B99885]/5 transition-colors"
              >
                Bekijk diensten
              </a>
            </div>
          </div>
        </section>
        
        {/* About Section with light background */}
        <div className="section-bg-light">
          <AboutSection />
        </div>
        
        {/* Services Section with medium background */}
        <div className="section-bg-medium">
          <ServicesSection />
        </div>
        
        {/* Testimonials Section with accent background */}
        <div className="section-bg-accent">
          <TestimonialsSection />
        </div>
        
        {/* USP Section with light background */}
        <div className="section-bg-light">
          <USPSection />
        </div>
        
        {/* Contact Section with medium background */}
        <div className="section-bg-medium">
          <ContactSection />
        </div>
      </main>
    </>
  );
}
