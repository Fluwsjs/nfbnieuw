"use client";

import Link from "next/link";
import * as React from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export function NavLink({ href, children, className }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;
  
  return (
    <Link href={href} className={className || ''}>
      <div className="relative flex flex-col items-center">
        {children}
        <motion.div 
          className="absolute -bottom-1 h-0.5 bg-[#B99885] rounded-full"
          initial={{ width: isActive ? "100%" : "0%" }}
          animate={{ width: isActive ? "100%" : "0%" }}
          whileHover={{ width: "100%" }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        />
      </div>
    </Link>
  );
} 