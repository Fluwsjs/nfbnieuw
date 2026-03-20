"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star } from "lucide-react";
import Image from 'next/image';

export function HeroSection() {
  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (delay: number) => ({
      opacity: 1,
      y: 0,
      transition: { 
        duration: 0.8, 
        delay,
        ease: [0.16, 1, 0.3, 1]
      }
    })
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="hero-section relative min-h-[90vh] flex items-center overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #FDF6F1 0%, #F5EDE8 50%, #F1E2D8 100%)"
      }}
    >
      {/* Decorative elements */}
      <motion.div 
        className="absolute inset-0 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 1.2 }}
      >
        {/* Golden accents */}
        <motion.div 
          className="absolute top-[15%] right-[10%] w-64 h-64 rounded-full opacity-20" 
          style={{ background: "radial-gradient(circle, #B99885 0%, rgba(207, 175, 157, 0) 70%)" }}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.2 }}
          transition={{ delay: 0.4, duration: 1.5 }}
        />
        <motion.div 
          className="absolute bottom-[10%] left-[5%] w-96 h-96 rounded-full opacity-10" 
          style={{ background: "radial-gradient(circle, #CFAF9D 0%, rgba(185, 152, 133, 0) 70%)" }}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.1 }}
          transition={{ delay: 0.6, duration: 1.5 }}
        />
        
        {/* Pattern overlay for texture */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{ 
            backgroundImage: "url(/images/subtle-pattern.png)", 
            backgroundSize: "200px", 
            mixBlendMode: "multiply" 
          }}
        />
        
        {/* Bottom gradient for smooth transition */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-24"
          style={{ 
            background: "linear-gradient(to top, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0) 100%)" 
          }}
        />
      </motion.div>
      
      <div className="container mx-auto px-6 py-12 relative z-10">
        <motion.div 
          className="flex flex-col gap-8 max-w-3xl mx-auto text-center"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ 
            duration: 1, 
            delay: 0.4, 
            ease: [0.16, 1, 0.3, 1] 
          }}
        >
          <div className="space-y-8 mx-auto">
            <motion.h1 
              custom={0.2}
              variants={textVariants}
              initial="hidden"
              animate="visible"
              className="text-6xl md:text-8xl lg:text-9xl font-serif font-semibold tracking-wider text-[#331A12] drop-shadow-[0_1px_2px_rgba(255,255,255,0.6)] text-center"
            >
              <span className="block">NFB</span>
              <span className="block mt-2 tracking-[0.2em]">Salon</span>
            </motion.h1>
            
            <motion.p 
              custom={0.4}
              variants={textVariants}
              initial="hidden"
              animate="visible"
              className="text-xl md:text-2xl text-[#B99885] max-w-md mx-auto leading-relaxed tracking-[0.3em] font-medium drop-shadow-[0_1px_1px_rgba(255,255,255,0.5)] text-center"
            >
              NAILS • FACE • BODY
            </motion.p>
            
            <motion.div 
              custom={0.6}
              variants={textVariants}
              initial="hidden"
              animate="visible"
              className="flex justify-center mt-12"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Link href="/afspraak">
                  <Button 
                    size="lg" 
                    className="px-10 py-6 text-lg bg-[#B99885] text-white font-medium rounded-full shadow-md hover:shadow-lg hover:bg-[#A67C68] transition-all duration-300"
                  >
                    Plan jouw moment
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
} 