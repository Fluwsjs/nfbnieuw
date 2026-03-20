"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X } from "lucide-react";
import galerijData from "../../../content/galerij.json";

const galleryImages = galerijData.images.map(img => ({
  ...img,
  before: { src: img.beforeSrc, alt: img.beforeAlt },
  after:  { src: img.afterSrc,  alt: img.afterAlt  },
}));

const categories = ["Alle", ...Array.from(new Set(galleryImages.map(img => img.category)))];

export default function GalerijPage() {
  const [selectedImage, setSelectedImage] = useState<null | {src: string, alt: string}>(null);
  const [activeCategory, setActiveCategory] = useState("Alle");
  
  const filteredImages = activeCategory === "Alle" 
    ? galleryImages 
    : galleryImages.filter(img => img.category === activeCategory);

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const openLightbox = (image: {src: string, alt: string}) => {
    setSelectedImage(image);
    // Prevent body scrolling when lightbox is open
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    // Re-enable body scrolling
    document.body.style.overflow = "auto";
  };

  return (
    <main className="bg-background overflow-hidden pt-24">
      {/* Hero Section */}
      <section className="relative min-h-[40vh] flex items-center justify-center px-4 py-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          {/* Subtiele gouden/nude accenten */}
          <div className="absolute top-1/4 right-1/3 w-80 h-80 rounded-full bg-primary/10 blur-3xl"></div>
          <div className="absolute bottom-1/3 left-1/4 w-96 h-96 rounded-full bg-primary/15 blur-3xl"></div>
          
          {/* Subtiel patroon overlay voor textuur */}
          <div className="absolute inset-0 opacity-5 bg-[url('/images/pattern.png')] bg-repeat"></div>
        </div>
        
        <motion.div 
          className="container relative z-10 text-center max-w-3xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-light tracking-tight text-primary-foreground mb-6">
            Onze Galerij
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto leading-relaxed">
            {galerijData.heroSubtitle}
          </p>
        </motion.div>
      </section>

      {/* Category Filter */}
      <motion.section
        className="py-10 bg-white"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <div className="container mx-auto">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category}
                className={`px-4 py-2 rounded-full text-sm transition-all duration-300 ${
                  activeCategory === category
                    ? "bg-primary text-white"
                    : "bg-primary/10 hover:bg-primary/20"
                }`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Gallery Grid */}
      <motion.section 
        className="section-bg-light py-20"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer}
      >
        <div className="container max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredImages.map((item) => (
              <motion.div 
                key={item.id}
                variants={fadeIn}
                className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="p-4">
                  <h3 className="text-lg font-medium mb-2">{item.description}</h3>
                  <p className="text-sm text-primary mb-4">{item.category}</p>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <div className="relative h-40 w-full cursor-pointer rounded-lg overflow-hidden" onClick={() => openLightbox(item.before)}>
                        <Image 
                          src={item.before.src} 
                          alt={item.before.alt} 
                          fill 
                          className="object-cover transition-transform hover:scale-105 duration-300"
                        />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                          <span className="text-white text-xs font-medium bg-black/50 px-2 py-1 rounded">Voor</span>
                        </div>
                      </div>
                      <p className="text-xs text-center text-foreground/60">Voor</p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="relative h-40 w-full cursor-pointer rounded-lg overflow-hidden" onClick={() => openLightbox(item.after)}>
                        <Image 
                          src={item.after.src} 
                          alt={item.after.alt} 
                          fill 
                          className="object-cover transition-transform hover:scale-105 duration-300"
                        />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                          <span className="text-white text-xs font-medium bg-black/50 px-2 py-1 rounded">Na</span>
                        </div>
                      </div>
                      <p className="text-xs text-center text-foreground/60">Na</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-w-4xl max-h-[90vh] w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-4 right-4 text-white bg-black/50 p-2 rounded-full z-10 hover:bg-black/70 transition-colors"
                onClick={closeLightbox}
              >
                <X className="w-6 h-6" />
              </button>
              
              <div className="relative w-full h-[80vh] rounded-lg overflow-hidden">
                <Image
                  src={selectedImage.src}
                  alt={selectedImage.alt}
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
} 