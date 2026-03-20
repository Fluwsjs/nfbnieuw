"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Award, Heart, Star, Shield, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import overOnsData from "../../../content/over-ons.json";

// Icons matched by position (id 1-5); can't be stored in JSON
const valueIcons = [
  <Star  key="1" className="w-8 h-8 text-[#CFAF9D]" />,
  <Heart key="2" className="w-8 h-8 text-[#CFAF9D]" />,
  <Shield key="3" className="w-8 h-8 text-[#CFAF9D]" />,
  <Clock key="4" className="w-8 h-8 text-[#CFAF9D]" />,
  <Award key="5" className="w-8 h-8 text-[#CFAF9D]" />,
];

const coreValues = overOnsData.coreValues.map((v, i) => ({
  ...v,
  icon: valueIcons[i] ?? valueIcons[0],
}));

export default function OverOnsPage() {
  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemFadeIn = {
    hidden: { opacity: 0, y: 15 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <main className="bg-background overflow-hidden">
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#F5EDE8]/30 to-[#CFAF9D]/10">
          <div className="absolute top-1/4 right-1/3 w-80 h-80 rounded-full bg-[#CFAF9D]/10 blur-3xl"></div>
          <div className="absolute bottom-1/3 left-1/4 w-96 h-96 rounded-full bg-[#CFAF9D]/15 blur-3xl"></div>
        </div>
        
        <motion.div 
          className="container relative z-10 text-center max-w-3xl mx-auto px-6"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-medium tracking-tight text-[#1D1D1F] mb-6">
            Over <span className="text-[#CFAF9D]">NFB Salon</span>
          </h1>
          <p className="text-lg md:text-xl text-[#1D1D1F]/80 max-w-2xl mx-auto leading-relaxed">
            {overOnsData.heroSubtitle}
          </p>
        </motion.div>
      </section>

      {/* Introductie section with 2 columns */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container max-w-6xl mx-auto px-6">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.div 
              variants={fadeIn}
              className="flex flex-col gap-6 order-2 md:order-1"
            >
              <h2 className="text-3xl md:text-4xl font-serif font-medium text-[#1D1D1F]">
                {overOnsData.introTitle}
              </h2>
              <p className="text-[#1D1D1F]/80 leading-relaxed text-lg">{overOnsData.intro1}</p>
              <p className="text-[#1D1D1F]/80 leading-relaxed text-lg">{overOnsData.intro2}</p>
              <p className="text-[#1D1D1F]/80 leading-relaxed text-lg">{overOnsData.intro3}</p>
            </motion.div>

            <motion.div 
              variants={fadeIn}
              className="relative h-[450px] md:h-[550px] rounded-xl overflow-hidden shadow-lg order-1 md:order-2 border border-[#CFAF9D]/10"
            >
              <Image 
                src="/images/nfbeigenaar.jpeg" 
                alt="Marianne - Eigenaar NFB Salon" 
                fill 
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-16 md:py-24 bg-[#F9F5F2]">
        <div className="container max-w-6xl mx-auto px-6">
          <motion.div 
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
          >
            <h2 className="text-3xl md:text-4xl font-serif font-medium mb-6 text-[#1D1D1F]">
              {overOnsData.valuesTitle}
            </h2>
            <p className="text-lg text-[#1D1D1F]/80 max-w-2xl mx-auto">
              {overOnsData.valuesSubtitle}
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            {coreValues.slice(0, 3).map((value) => (
              <motion.div 
                key={value.id}
                variants={itemFadeIn}
                className="bg-white p-8 rounded-xl shadow-md border border-[#CFAF9D]/10 hover:shadow-lg transition-all duration-300"
                whileHover={{ y: -5, transition: { duration: 0.3 } }}
              >
                <div className="mb-6 p-4 bg-[#F9F5F2] inline-block rounded-full">
                  {value.icon}
                </div>
                <h3 className="text-xl font-serif font-medium text-[#1D1D1F] mb-4">{value.name}</h3>
                <p className="text-[#1D1D1F]/75 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            {coreValues.slice(3).map((value) => (
              <motion.div 
                key={value.id}
                variants={itemFadeIn}
                className="bg-white p-8 rounded-xl shadow-md border border-[#CFAF9D]/10 hover:shadow-lg transition-all duration-300"
                whileHover={{ y: -5, transition: { duration: 0.3 } }}
              >
                <div className="mb-6 p-4 bg-[#F9F5F2] inline-block rounded-full">
                  {value.icon}
                </div>
                <h3 className="text-xl font-serif font-medium text-[#1D1D1F] mb-4">{value.name}</h3>
                <p className="text-[#1D1D1F]/75 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 md:py-24 bg-[#CFAF9D]/10">
        <motion.div 
          className="container max-w-4xl mx-auto text-center px-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeIn}
        >
          <h2 className="text-3xl md:text-4xl font-serif font-medium mb-6 text-[#1D1D1F]">
            {overOnsData.ctaTitle}
          </h2>
          <p className="text-lg text-[#1D1D1F]/80 mb-10 max-w-2xl mx-auto leading-relaxed">
            {overOnsData.ctaSubtitle}
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
    </main>
  );
} 