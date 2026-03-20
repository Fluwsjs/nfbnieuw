"use client";

import { motion } from "framer-motion";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { useRef } from "react";
import Image from "next/image";

export function AboutSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  };

  const imageVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <section className="section py-28 relative overflow-hidden bg-gradient-to-b from-background to-light-beige/40">
      {/* Background decorative elements */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <motion.div 
          className="absolute top-40 left-0 w-[30rem] h-[30rem] rounded-full bg-gradient-to-br from-primary/10 to-primary/5 blur-3xl"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.8 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5 }}
        />
        <motion.div 
          className="absolute bottom-40 right-10 w-[20rem] h-[20rem] rounded-full bg-gradient-to-tl from-primary/15 to-primary/5 blur-3xl"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.6 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, delay: 0.3 }}
        />
        <div className="absolute inset-0 opacity-5 bg-[url('/images/pattern.png')] bg-repeat"></div>
      </div>
      
      <div className="container relative z-10">
        <motion.div 
          className="text-center mb-20 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="section-title mb-6 text-4xl md:text-5xl lg:text-6xl font-serif font-semibold">
            Over <span className="text-[#B99885] relative">
              NFB Salon
              <motion.span 
                className="absolute -bottom-3 left-0 right-0 h-[6px] bg-[#B99885]/20 rounded-full" 
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.6 }}
              />
            </span>
          </h2>
          <p className="text-lg text-[#1D1D1F]/70 mt-4">Persoonlijke aandacht en kwaliteit in een warme omgeving</p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Text column */}
          <motion.div 
            className="order-2 md:order-1 pr-0 md:pr-6 lg:pr-12"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {/* Decorative quote mark */}
            <motion.div 
              className="text-7xl font-serif text-[#B99885]/10 h-10 overflow-hidden mb-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              "
            </motion.div>
            
            <motion.p 
              className="text-xl mb-8 leading-relaxed font-serif text-[#1D1D1F]"
              variants={itemVariants}
            >
              Mijn missie is om jou een <span className="text-[#B99885] font-medium">uitzonderlijke ervaring</span> te bieden in een warme, uitnodigende omgeving, waar persoonlijke aandacht, perfectie en oog voor detail vanzelfsprekend zijn.
            </motion.p>
            
            <motion.p 
              className="mb-8 leading-relaxed text-lg"
              variants={itemVariants}
            >
              Met meer dan <span className="text-[#B99885] font-semibold">8+ jaren ervaring</span> in de beautybranche combineer ik, <strong className="font-semibold">Marianne</strong>, de nieuwste technieken en <em className="italic text-[#B99885] font-medium">premium producten</em> om behandelingen te creëren die niet alleen zichtbare resultaten leveren, maar ook een moment van rust, ontspanning en pure zelfzorg bieden.
            </motion.p>
            
            <motion.p
              className="leading-relaxed text-lg mb-4"
              variants={itemVariants}
            >
              Ik luister aandachtig naar jouw wensen en behoeften, zodat ik iedere behandeling volledig op jou kan afstemmen. Bij NFB Salon draait het om <span className="text-[#B99885] font-medium">kwaliteit</span>, <span className="text-[#B99885] font-medium">vertrouwen</span> en een <span className="text-[#B99885] font-medium">persoonlijke benadering</span> — elke keer dat jij bij mij langskomt.
            </motion.p>
            
            {/* Signature - optional */}
            <motion.div
              className="mt-6 mb-10"
              variants={itemVariants}
            >
              <div className="font-serif italic text-[#B99885] text-xl">Marianne</div>
              <div className="h-[1px] w-20 bg-[#B99885]/30 mt-2"></div>
            </motion.div>
          </motion.div>
          
          {/* Image column */}
          <motion.div 
            className="relative order-1 md:order-2"
            variants={imageVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <div className="relative mx-auto max-w-md overflow-hidden rounded-2xl shadow-xl">
              <div className="aspect-[4/5] relative overflow-hidden rounded-2xl">
                <Image 
                  src="/images/nfbeigenaar.jpeg" 
                  alt="Marianne - Eigenaar NFB Salon" 
                  fill
                  className="object-cover object-center transition-transform duration-700 hover:scale-105 filter brightness-105 contrast-105"
                  sizes="(max-width: 768px) 100vw, 40vw"
                  priority
                />
                
                {/* Image overlay gradient - verbeterde versie */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#000]/25 via-transparent to-[#B99885]/10 opacity-60"></div>
                
                {/* Extra glow effect */}
                <div className="absolute inset-0 bg-[#B99885]/5 mix-blend-overlay"></div>
              </div>
              
              {/* Decorative border - verbeterd */}
              <div className="absolute inset-0 border-4 border-white/30 rounded-2xl pointer-events-none shadow-inner"></div>
              
              {/* Decorative elements - verbeterd met gradient en blur effect */}
              <div className="absolute -bottom-6 -right-6 w-40 h-40 rounded-full bg-gradient-to-tr from-[#B99885]/30 to-[#B99885]/10 blur-md -z-10"></div>
              <div className="absolute -top-6 -left-6 w-40 h-40 rounded-full bg-gradient-to-br from-[#B99885]/20 to-[#B99885]/5 blur-md -z-10"></div>
              
              {/* Subtle shine effect */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-40 pointer-events-none"></div>
              
              {/* Experience badge - updated to 8+ */}
              <motion.div 
                className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-[#B99885] shadow-lg z-10 flex flex-col items-center justify-center"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <span className="text-white font-serif text-xl font-semibold">8+</span>
                <span className="text-xs text-white/90">jaren ervaring</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
} 