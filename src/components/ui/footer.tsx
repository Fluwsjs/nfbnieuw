"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Instagram, Facebook, Mail, MapPin, Phone, Clock } from "lucide-react";
import Image from "next/image";

export function Footer() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };
  
  return (
    <footer className="relative overflow-hidden bg-gradient-to-t from-primary/5 to-background border-t border-primary/10">
      {/* Decorative elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-40 -right-40 w-96 h-96 rounded-full opacity-10 bg-primary/10 blur-3xl"></div>
        <div className="absolute bottom-40 -left-40 w-80 h-80 rounded-full opacity-10 bg-primary/10 blur-3xl"></div>
        <div className="absolute inset-0 opacity-5 bg-[url('/images/pattern.png')] bg-repeat"></div>
      </div>
      
      <div className="container py-20 relative z-10">
        {/* Logo and brand section */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-16 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-xs"
          >
            <h2 className="font-serif text-3xl mb-4 text-primary-foreground">NFB Salon</h2>
            <p className="text-muted-foreground mb-6">
              Uw bestemming voor luxe beauty behandelingen en ontspanning in het prachtige Aerdt.
            </p>
            
            <div className="flex space-x-4 mb-8">
              <a 
                href="https://instagram.com" 
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all duration-300 hover:scale-105"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a 
                href="https://facebook.com" 
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all duration-300 hover:scale-105"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a 
                href="mailto:info@nfbsalon.nl" 
                className="p-2.5 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all duration-300 hover:scale-105"
                aria-label="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
            
            <div className="h-px w-20 bg-primary/20 my-6"></div>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16">
            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              <motion.h3 variants={item} className="font-serif text-lg mb-5 text-primary-foreground">Diensten</motion.h3>
              <motion.ul variants={container} className="space-y-3 text-muted-foreground">
                <motion.li variants={item}>
                  <Link href="/diensten/nagelbehandelingen" className="hover:text-primary transition-all hover:pl-2 duration-300 inline-block">
                    Nagelbehandelingen
                  </Link>
                </motion.li>
                <motion.li variants={item}>
                  <Link href="/diensten/waxen-lashlifting" className="hover:text-primary transition-all hover:pl-2 duration-300 inline-block">
                    Waxen & Lashlifting
                  </Link>
                </motion.li>
                <motion.li variants={item}>
                  <Link href="/diensten/gezichtsbehandelingen" className="hover:text-primary transition-all hover:pl-2 duration-300 inline-block">
                    Gezichtsbehandelingen
                  </Link>
                </motion.li>
              </motion.ul>
            </motion.div>
            
            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              <motion.h3 variants={item} className="font-serif text-lg mb-5 text-primary-foreground">Informatie</motion.h3>
              <motion.ul variants={container} className="space-y-3 text-muted-foreground">
                <motion.li variants={item}>
                  <Link href="/over-nfb" className="hover:text-primary transition-all hover:pl-2 duration-300 inline-block">
                    Over NFB
                  </Link>
                </motion.li>
                <motion.li variants={item}>
                  <Link href="/contact" className="hover:text-primary transition-all hover:pl-2 duration-300 inline-block">
                    Contact
                  </Link>
                </motion.li>
              </motion.ul>
            </motion.div>
            
            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              <motion.h3 variants={item} className="font-serif text-lg mb-5 text-primary-foreground">Boeken</motion.h3>
              <motion.div variants={item} className="space-y-4">
                <p className="text-muted-foreground">
                  Plan vandaag nog uw behandeling en geniet van een moment voor uzelf.
                </p>
                <Link 
                  href="/boek-nu" 
                  className="button-primary py-2.5 px-6 rounded-full inline-flex items-center text-sm group"
                >
                  <span>Maak een afspraak</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
        
        {/* Separator */}
        <motion.div 
          className="h-px w-full bg-gradient-to-r from-primary/10 via-primary/30 to-primary/10 my-8"
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        ></motion.div>
        
        {/* Copyright and legal links */}
        <motion.div 
          className="flex flex-col md:flex-row justify-between items-center pt-4 text-sm text-muted-foreground"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <p>&copy; {new Date().getFullYear()} NFB Salon. Alle rechten voorbehouden.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="/privacy" className="hover:text-primary transition-colors">
              Privacybeleid
            </Link>
            <Link href="/voorwaarden" className="hover:text-primary transition-colors">
              Algemene Voorwaarden
            </Link>
            <Link href="/cookies" className="hover:text-primary transition-colors">
              Cookies
            </Link>
          </div>
        </motion.div>
      </div>
    </footer>
  );
} 