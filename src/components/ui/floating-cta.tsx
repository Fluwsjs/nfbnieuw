"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { MessageCircle } from "lucide-react";

export function FloatingCTA() {
  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-4 items-end">
      {/* WhatsApp Chat Button */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 2.5, duration: 0.5 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="relative group"
      >
        <Link 
          href="https://wa.me/31201234567?text=Hallo,%20ik%20heb%20een%20vraag%20over%20NFB%20Salon"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-12 h-12 rounded-full bg-[#25D366] text-white shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <MessageCircle className="w-5 h-5" />
        </Link>
        <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-white text-gray-800 px-4 py-2 rounded-lg shadow-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 whitespace-nowrap text-sm font-medium">
          Stel je vraag
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-2 h-2 bg-white transform rotate-45"></div>
        </div>
      </motion.div>
      
      {/* 'Plan jouw moment' knop verwijderd */}
    </div>
  );
} 