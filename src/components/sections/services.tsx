"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Heart, Award } from "lucide-react";
import Link from "next/link";
import servicesData from "../../../content/services.json";

// Icons are assigned by position since they can't be stored in JSON
const serviceIcons = [
  <Sparkles key="1" className="w-6 h-6 text-[#B99885]" />,
  <Heart key="2" className="w-6 h-6 text-[#B99885]" />,
  <Award key="3" className="w-6 h-6 text-[#B99885]" />,
];

interface ServicesSectionProps {
  showAllDetails?: boolean;
}

export function ServicesSection({ showAllDetails = false }: ServicesSectionProps) {
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
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <section className="section py-28 relative overflow-hidden bg-gradient-to-b from-background to-[#FDF6F1]/50">
      {/* Elegant background decoration with subtle animations */}
      <div className="absolute inset-0 z-0">
        <motion.div 
          className="absolute top-40 right-10 w-[32rem] h-[32rem] rounded-full bg-[#B99885]/10 blur-3xl opacity-70"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.7 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5 }}
        />
        <motion.div 
          className="absolute bottom-40 left-10 w-[25rem] h-[25rem] rounded-full bg-[#B99885]/5 blur-3xl opacity-70"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.7 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, delay: 0.3 }}
        />
        <div className="absolute inset-0 opacity-5 bg-[url('/images/pattern.png')] bg-repeat"></div>
      </div>
    
      <div className="container mx-auto px-6 relative z-10">
        {!showAllDetails && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl mx-auto text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-semibold text-[#331A12] mb-6 text-center">
              Onze <span className="text-[#B99885] relative">
                Diensten
                <motion.span 
                  className="absolute -bottom-3 left-0 right-0 h-[6px] bg-[#B99885]/20 rounded-full" 
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.6 }}
                />
              </span>
            </h2>
            <p className="text-lg text-[#331A12]/80 max-w-2xl mx-auto mt-6 leading-relaxed text-center">
              {servicesData.sectionSubtitle}
            </p>
          </motion.div>
        )}

        <motion.div 
          className={`grid grid-cols-1 ${showAllDetails ? 'lg:grid-cols-3' : 'md:grid-cols-2 lg:grid-cols-3'} gap-8 lg:gap-10 mx-auto`}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {servicesData.services.map((service, index) => (
            <motion.div
              key={service.id}
              variants={itemVariants}
              className="h-full"
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 40 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="h-full bg-white/90 backdrop-blur-sm shadow-md border-0 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-500 service-card">
                <CardContent className="p-8 h-full flex flex-col">
                  {/* Service header with icon and title */}
                  <div className="mb-6 flex items-center justify-between">
                    <h3 className="font-serif text-lg md:text-xl lg:text-2xl text-[#331A12] font-medium tracking-wide pr-2">
                      {service.name}
                    </h3>
                    <div className="service-icon bg-[#F9F0EA] p-3 rounded-full flex-shrink-0">
                      {serviceIcons[index] ?? serviceIcons[0]}
                    </div>
                  </div>
                  
                  <motion.div 
                    className="h-1 w-16 bg-[#B99885] mb-6 rounded-full"
                    initial={{ width: 0 }}
                    whileInView={{ width: 64 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.3 + index * 0.1 }}
                  ></motion.div>
                  
                  {/* Price */}
                  <div className="mb-4">
                    <span className="text-[#B99885] font-semibold text-lg">{service.price}</span>
                  </div>
                  
                  {/* Description with improved typography */}
                  <p className="text-[#331A12]/80 mb-8 leading-relaxed">{service.description}</p>
                  
                  {/* Features with enhanced styling */}
                  <ul className="space-y-4 mb-8 flex-grow">
                    {service.features.map((feature, i) => (
                      <li 
                        key={i} 
                        className="text-[#331A12]/80 flex items-start gap-3 relative feature-item"
                      >
                        <div className="mt-1.5 min-w-[8px]">
                          <span className="block w-2 h-2 rounded-full bg-[#B99885]"></span>
                        </div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  {/* CTA with enhanced hover effects */}
                  {showAllDetails ? (
                    <motion.div 
                      className="transition-all"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Link href="/afspraak">
                        <Button 
                          className="w-full py-6 rounded-full bg-[#B99885] text-white hover:bg-[#a88774] shadow-md hover:shadow-lg transition-all duration-300"
                        >
                          Boek deze behandeling
                          <ArrowRight className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                        </Button>
                      </Link>
                    </motion.div>
                  ) : (
                    <motion.div 
                      className="transition-all"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Link href={`/diensten#${service.name.toLowerCase().replace(/[\s,&]+/g, '-')}`}>
                        <Button 
                          variant="outline" 
                          className="w-full py-6 rounded-full border-[#B99885]/30 text-[#B99885] hover:bg-[#B99885]/5 transition-all duration-300 group"
                        >
                          <span>Meer informatie</span>
                          <ArrowRight className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                        </Button>
                      </Link>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
} 