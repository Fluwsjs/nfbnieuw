"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ChevronDown, ChevronUp, CheckCircle2, Star, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import dienstenData from "../../../content/diensten.json";

// Types
interface Review { name: string; text: string; stars?: number; }
interface Treatment { name: string; price: string; duration: string; }
interface ServiceCategory {
  id: string; title: string; description: string;
  reviews: Review[]; treatments: Treatment[];
}

const services: ServiceCategory[] = dienstenData.services;
const faqItems = dienstenData.faq;

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { 
      duration: 0.8, 
      delay: delay * 0.2,
      ease: [0.16, 1, 0.3, 1]
    }
  })
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
  }
};

interface ServiceSectionProps {
  service: ServiceCategory;
  expanded: boolean;
  toggleExpanded: () => void;
}

const ServiceSection = ({ service, expanded, toggleExpanded }: ServiceSectionProps) => {
  return (
    <motion.div 
      id={service.id}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={itemVariants}
      className="mb-12 md:mb-20 scroll-mt-24"
    >
      <Card className="rounded-2xl border bg-white/95 shadow-md overflow-hidden">
        <CardContent className="p-0">
          <div 
            className={`p-6 md:p-8 cursor-pointer transition-colors duration-300 ${expanded ? 'bg-[#F9F5F2]' : 'hover:bg-[#F9F5F2]/50'}`}
            onClick={toggleExpanded}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-[#B99885]/15 flex items-center justify-center text-[#B99885]">
                  {service.id === "gezichtsbehandelingen" && <Star className="w-5 h-5" />}
                  {service.id === "waxen-epileren" && <CheckCircle2 className="w-5 h-5" />}
                  {service.id === "nagelbehandelingen" && <ArrowRight className="w-5 h-5" />}
                </div>
                <h2 className="font-serif text-lg md:text-xl lg:text-2xl text-[#1D3557] font-medium tracking-wide px-1">
                  {service.title === "Gezichtsbehandelingen" ? (
                    <>
                      Gezichts-<br />behandelingen
                    </>
                  ) : service.title === "Nagelbehandelingen" ? (
                    <>
                      Nagel-<br />behandelingen
                    </>
                  ) : (
                    service.title
                  )}
                </h2>
              </div>
              <div className="flex items-center space-x-2">
                <motion.div
                  animate={{ rotate: expanded ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm"
                >
                  <ChevronDown className="w-5 h-5 text-[#1D3557]" />
                </motion.div>
              </div>
            </div>
            <div className="mt-4 md:ml-14">
              <p className="text-sm md:text-base text-[#1D1D1F]/80 pr-4">
                {service.description}
              </p>
            </div>
          </div>
          
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden"
              >
                <div className="p-6 md:p-8 pt-0 md:ml-14">
                  <div className="h-px w-full bg-[#1D3557]/10 my-6"></div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <div className="lg:col-span-3">
                      <h3 className="text-lg font-medium text-[#1D3557] mb-4 flex items-center gap-2">
                        <span className="inline-block h-3 w-3 rounded-full bg-[#B99885]"></span>
                        Beschikbare Behandelingen
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {service.treatments.map((treatment, index) => (
                          <motion.div 
                            key={treatment.name}
                            variants={itemVariants}
                            initial="hidden"
                            animate="visible"
                            transition={{ delay: index * 0.1 }}
                            className="bg-white rounded-xl p-4 shadow-sm border border-[#E9DFD8]"
                          >
                            <div className="flex justify-between mb-2">
                              <h4 className="font-medium text-[#1D3557]">{treatment.name}</h4>
                              <span className="text-[#B22234] font-medium">{treatment.price}</span>
                            </div>
                            <div className="text-xs text-[#1D1D1F]/60 flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3 mr-1">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                              </svg>
                              {treatment.duration}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                      
                      <div className="mt-8">
                        <Link href={`/afspraak`}>
                          <Button 
                            className="rounded-full bg-[#1D3557] hover:bg-[#1D3557]/90 text-white px-6 py-2.5"
                          >
                            Maak een afspraak
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                    
                    <div className="lg:col-span-1">
                      <h3 className="text-lg font-medium text-[#1D3557] mb-4 flex items-center gap-2">
                        <span className="inline-block h-3 w-3 rounded-full bg-[#B99885]"></span>
                        Reviews
                      </h3>
                      
                      {service.reviews.map((review, index) => (
                        <motion.div 
                          key={index}
                          variants={itemVariants}
                          initial="hidden"
                          animate="visible"
                          transition={{ delay: 0.3 }}
                          className="bg-[#F9F5F2] p-4 rounded-xl mb-2"
                        >
                          <div className="flex gap-1 mb-1">
                            {[...Array(review.stars || 5)].map((_, i) => (
                              <Star key={i} className="h-3 w-3 fill-[#B99885] text-[#B99885]" />
                            ))}
                          </div>
                          <p className="text-sm italic text-[#1D1D1F]/80 mb-2">"{review.text}"</p>
                          <p className="text-xs font-medium text-[#1D3557]">- {review.name}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default function DienstenPage() {
  const [expandedServices, setExpandedServices] = useState<{[key: number]: boolean}>({});
  const [expandedFaqs, setExpandedFaqs] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Add a useEffect to handle client-side loading
  useEffect(() => {
    // Set loading to false after all assets have loaded
    setIsLoading(false);
  }, []);

  const toggleExpanded = (serviceId: number) => {
    setExpandedServices(prev => ({
      ...prev,
      [serviceId]: !prev[serviceId]
    }));
  };

  // Show a simple loading state
  if (isLoading) {
    return (
      <main className="bg-[#FDF6F1] pt-20 overflow-hidden min-h-screen">
        <div className="flex items-center justify-center h-[50vh]">
          <div className="text-center">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-[#CFAF9D] border-t-transparent"></div>
            <p className="mt-4 text-[#1D1D1F]/80">Pagina laden...</p>
          </div>
        </div>
      </main>
    );
  }

  // Structure for JSON-LD data
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BeautySalon',
    'name': 'NFB Salon Aerdt',
    'description': 'NFB Salon in Aerdt biedt gezichtsbehandelingen, nagelbehandelingen en epileren/waxen diensten.',
    'url': 'https://nfbsalon.nl/diensten',
    'telephone': '+31612345678',
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': 'Kerkstraat 12',
      'addressLocality': 'Aerdt',
      'postalCode': '6913 AK',
      'addressCountry': 'NL'
    },
    'hasOfferCatalog': {
      '@type': 'OfferCatalog',
      'name': 'Diensten',
      'itemListElement': services.map((service, index) => ({
        '@type': 'OfferCatalog',
        'name': service.title,
        'position': index + 1,
        'itemListElement': service.treatments.map((treatment, treatmentIndex) => ({
          '@type': 'Offer',
          'itemOffered': {
            '@type': 'Service',
            'name': treatment.name,
            ...(treatment.duration && { 'description': `Duur: ${treatment.duration}` })
          },
          'price': treatment.price,
          'priceCurrency': 'EUR',
          'position': treatmentIndex + 1
        }))
      }))
    }
  };

  return (
    <>
      {/* Add JSON-LD script for structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <main className="bg-[#FDF6F1] pt-20 overflow-hidden">
        {/* Hero Section */}
        <section className="relative py-16 md:py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[#FDF6F1] via-[#F9F1EA] to-[#F5EDE8] z-0"></div>
          
          {/* Decorative elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/3 right-1/4 w-64 h-64 rounded-full bg-[#CFAF9D]/10 blur-3xl"></div>
            <div className="absolute bottom-1/4 left-1/3 w-80 h-80 rounded-full bg-[#CFAF9D]/5 blur-3xl"></div>
            <div className="absolute top-1/2 left-1/2 w-40 h-40 rounded-full bg-[#CFAF9D]/5 blur-2xl"></div>
          </div>
          
          <div className="container mx-auto px-6 relative z-10">
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              className="max-w-3xl mx-auto text-center"
            >
              <motion.h1 
                variants={fadeIn}
                custom={0}
                className="text-5xl md:text-6xl lg:text-7xl font-serif mb-6 text-[#1D1D1F]"
              >
                Onze <span className="text-[#CFAF9D]">Diensten</span>
              </motion.h1>
              
              <motion.p 
                variants={fadeIn}
                custom={1}
                className="text-xl text-[#1D1D1F]/80 max-w-2xl mx-auto mb-12 leading-relaxed"
              >
                {dienstenData.heroSubtitle}
              </motion.p>
              
              <motion.div 
                variants={fadeIn}
                custom={2}
                className="flex flex-wrap justify-center gap-4 mb-8"
              >
                {services.map((service, i) => (
                  <Link 
                    key={i} 
                    href={`#${service.id}`}
                    className="px-4 py-2 bg-white rounded-full text-[#CFAF9D] border border-[#CFAF9D]/20 shadow-sm hover:shadow-md transition-all duration-300 hover:bg-[#CFAF9D]/5"
                  >
                    {service.title}
                  </Link>
                ))}
              </motion.div>
              
              <motion.div
                variants={fadeIn}
                custom={3}
                className="flex flex-col items-center"
              >
                <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-md border border-[#CFAF9D]/10 mb-10 max-w-xl">
                  <p className="flex items-start">
                    <CheckCircle size={20} className="text-[#CFAF9D] mr-2 mt-1 flex-shrink-0" />
                    <span className="text-[#1D1D1F]/80">{dienstenData.heroBadge}</span>
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Services Sections */}
        <section className="py-8 md:py-16">
          <div className="container mx-auto px-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={containerVariants}
              className="max-w-6xl mx-auto"
            >
              {services.map((service, index) => (
                <div key={index} id={service.id} className="scroll-mt-24">
                  <ServiceSection
                    service={service}
                    expanded={!!expandedServices[index]}
                    toggleExpanded={() => toggleExpanded(index)}
                  />
                </div>
              ))}
            </motion.div>
          </div>
        </section>
        
        {/* Call to Action Section */}
        <section className="py-16 md:py-24 bg-[#CFAF9D]/10">
          <motion.div 
            className="container mx-auto text-center px-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-serif font-medium mb-6 text-[#1D1D1F]">
              {dienstenData.ctaTitle.split(' ').slice(0, -1).join(' ')} <span className="text-[#CFAF9D]">{dienstenData.ctaTitle.split(' ').at(-1)}</span>
            </h2>
            <p className="text-lg text-[#1D1D1F]/80 mb-10 max-w-2xl mx-auto leading-relaxed">
              {dienstenData.ctaSubtitle}
            </p>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Link href="/afspraak">
                <Button 
                  size="lg" 
                  className="px-10 py-6 text-lg bg-[#CFAF9D] text-white font-medium rounded-full shadow-md hover:shadow-lg hover:bg-[#B99885] transition-all duration-300"
                >
                  Plan jouw moment
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </section>
        
        {/* Sticky Mobile CTA */}
        <div className="fixed bottom-6 right-6 md:hidden z-50">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1, type: "spring", stiffness: 400, damping: 17 }}
          >
            <Link href="/afspraak">
              <Button 
                className="bg-[#CFAF9D] hover:bg-[#B99885] text-white rounded-full p-4 shadow-lg"
              >
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </main>
    </>
  );
} 