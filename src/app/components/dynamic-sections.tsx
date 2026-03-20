"use client";

import dynamic from 'next/dynamic';

// Use dynamic imports for components with potential issues
export const TestimonialsSection = dynamic(() => 
  import('@/components/sections/testimonials').then(mod => ({ default: mod.TestimonialsSection })), { 
  ssr: false,
  loading: () => <div className="py-24 text-center">Loading testimonials...</div>
});

export const ContactSection = dynamic(() => 
  import('@/components/sections/contact').then(mod => ({ default: mod.ContactSection })), {
  ssr: false,
  loading: () => <div className="py-24 text-center">Loading contact form...</div>
}); 