"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { NavLink } from "@/components/ui/nav-link";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Diensten", href: "/diensten" },
  { label: "Over NFB", href: "/over-nfb" },
  { label: "Contact", href: "/contact" },
  { label: "Reviews", href: "/reviews" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const pathname = usePathname();

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 left-0 w-full z-50 transition-all duration-500 ${
        isScrolled
          ? 'py-3 bg-white/90 backdrop-blur-lg shadow-md'
          : 'py-5 bg-[#FDF6F1]/30 backdrop-blur-md'
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center transition-all duration-300">
          <div className={`logo-container transition-all duration-300 ${isScrolled ? 'h-12' : 'h-16'}`}>
            <Image 
              src="/images/nfblogo2.png" 
              alt="NFB Salon Logo" 
              width={isScrolled ? 120 : 140} 
              height={isScrolled ? 50 : 60}
              className="logo-image transition-all duration-300"
              style={{
                objectFit: 'contain',
                maxWidth: '100%',
                height: 'auto',
                background: 'transparent'
              }}
              priority
            />
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-8 ml-12">
          {navItems.map((item) => (
            <NavLink 
              key={item.href} 
              href={item.href} 
              className={`navbar-link text-[#1D1D1F] font-medium transition-all duration-300 hover:text-[#B99885] ${
                pathname === item.href 
                  ? 'text-[#B99885] font-semibold' 
                  : 'text-[#1D1D1F]'
              }`}
            >
              {item.label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center space-x-4">
          <Link href="/afspraak" className="hidden md:block">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Button 
                className={`transition-all duration-300 rounded-full px-6 py-3 text-white font-medium ${
                  isScrolled 
                    ? "bg-[#B99885] hover:bg-[#A67C68] shadow-md" 
                    : "bg-[#B99885] hover:bg-[#A67C68] shadow-lg"
                }`}
              >
                Plan jouw moment
              </Button>
            </motion.div>
          </Link>
          
          <motion.button 
            className={`md:hidden p-3 rounded-full transition-all duration-300 ${
              isScrolled 
                ? "bg-[#FDF6F1]/70" 
                : "bg-white/30 backdrop-blur-sm"
            }`}
            whileTap={{ scale: 0.9 }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={isScrolled ? "text-[#331A12]" : "text-[#331A12]"}
            >
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
          </motion.button>
        </div>
      </div>
    </header>
  );
} 