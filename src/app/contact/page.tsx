"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { 
  ArrowRight, 
  Send, 
  PhoneCall, 
  Mail, 
  MapPin, 
  Clock, 
  Instagram,
  Facebook 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface FormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

interface OpeningHours {
  day: string;
  hours: string;
}

// Contact information
const contactInfo = {
  address: {
    street: "Loostraat 7",
    city: "6913 AG Aerdt",
    mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2471.051281637704!2d6.075211476776298!3d51.74930769260798!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c7b7dd51ef3eb3%3A0x1d59b2be7a5347de!2sLoostraat%207%2C%206913%20AG%20Aerdt!5e0!3m2!1sen!2snl!4v1715277486154!5m2!1sen!2snl"
  },
  phone: "+31 20 123 4567",
  email: "info@nfbsalon.nl",
  social: {
    instagram: "https://instagram.com/nfbsalon",
    facebook: "https://facebook.com/nfbsalon"
  },
  openingHours: [
    { day: "Maandag", hours: "09:00 - 18:00" },
    { day: "Dinsdag", hours: "Gesloten" },
    { day: "Woensdag", hours: "Gesloten" },
    { day: "Donderdag", hours: "09:00 - 16:00" },
    { day: "Vrijdag", hours: "09:00 - 18:00" },
    { day: "Zaterdag", hours: "Gesloten" },
    { day: "Zondag", hours: "Gesloten" }
  ] as OpeningHours[]
};

export default function ContactPage() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log("Form submitted:", formData);
    
    // Reset form after submission
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: ""
    });
    
    // Show success message (in a real app, this would be more sophisticated)
    alert("Bedankt voor je bericht! We nemen zo snel mogelijk contact met je op.");
  };

  // Simplified animation variant - less complexity
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.4 } }
  };

  return (
    <main className="bg-background overflow-hidden pt-24">
      {/* Hero Section - Simple fade animation */}
      <section className="relative min-h-[40vh] flex items-center justify-center px-4 py-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          {/* Static background elements instead of animations */}
          <div className="absolute top-1/4 right-1/3 w-80 h-80 rounded-full bg-primary/10 blur-3xl"></div>
          <div className="absolute bottom-1/3 left-1/4 w-96 h-96 rounded-full bg-primary/15 blur-3xl"></div>
          <div className="absolute inset-0 opacity-5 bg-[url('/images/pattern.png')] bg-repeat"></div>
        </div>
        
        <motion.div 
          className="container relative z-10 text-center max-w-3xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-light tracking-tight text-primary-foreground mb-6">
            Contact
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto leading-relaxed">
            Heb je vragen of wil je een afspraak maken? We horen graag van je.
          </p>
        </motion.div>
      </section>

      {/* Contact Information and Form - No animations */}
      <section className="section-bg-light py-20">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
              <h2 className="text-3xl md:text-4xl font-serif font-light mb-6">Contactgegevens</h2>
              
              <div className="bg-white p-6 rounded-2xl shadow-md">
                <div className="flex items-start gap-4 mb-6">
                  <MapPin className="text-primary w-6 h-6 mt-1" />
                  <div>
                    <h3 className="font-medium text-lg">Adres</h3>
                    <p className="text-foreground/70">{contactInfo.address.street}</p>
                    <p className="text-foreground/70">{contactInfo.address.city}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 mb-6">
                  <PhoneCall className="text-primary w-6 h-6 mt-1" />
                  <div>
                    <h3 className="font-medium text-lg">Telefoon</h3>
                    <a href={`tel:${contactInfo.phone}`} className="text-foreground/70 hover:text-primary transition-colors">
                      {contactInfo.phone}
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 mb-6">
                  <Mail className="text-primary w-6 h-6 mt-1" />
                  <div>
                    <h3 className="font-medium text-lg">Email</h3>
                    <a href={`mailto:${contactInfo.email}`} className="text-foreground/70 hover:text-primary transition-colors">
                      {contactInfo.email}
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="flex gap-2">
                    <a href={contactInfo.social.instagram} target="_blank" rel="noopener noreferrer" className="text-foreground/70 hover:text-primary transition-colors">
                      <Instagram className="w-6 h-6" />
                    </a>
                    <a href={contactInfo.social.facebook} target="_blank" rel="noopener noreferrer" className="text-foreground/70 hover:text-primary transition-colors">
                      <Facebook className="w-6 h-6" />
                    </a>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-2xl shadow-md">
                <div className="flex items-start gap-4 mb-4">
                  <Clock className="text-primary w-6 h-6 mt-1" />
                  <h3 className="font-medium text-lg">Openingstijden</h3>
                </div>
                
                <div className="space-y-2 pl-10">
                  {contactInfo.openingHours.map((item, index) => (
                    <div key={index} className="flex justify-between">
                      <span className={`${item.hours === 'Gesloten' ? 'text-foreground/50' : 'text-foreground/70'}`}>
                        {item.day}
                      </span>
                      <span className={`${item.hours === 'Gesloten' ? 'text-foreground/50' : 'text-foreground/70'}`}>
                        {item.hours}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-2xl shadow-md">
                <h3 className="font-medium text-lg mb-4">Plan een bezoek</h3>
                <Link href="/afspraak">
                  <Button className="button-primary w-full flex items-center justify-center gap-2">
                    Maak een afspraak
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
            
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl md:text-4xl font-serif font-light mb-6">Stuur ons een bericht</h2>
              
              <div className="bg-white p-6 rounded-2xl shadow-md">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">Naam *</label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Je naam"
                        required
                        className="w-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">Email *</label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Je emailadres"
                        required
                        className="w-full"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="phone" className="text-sm font-medium">Telefoon</label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Je telefoonnummer"
                        className="w-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="subject" className="text-sm font-medium">Onderwerp *</label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="Onderwerp van je bericht"
                        required
                        className="w-full"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium">Bericht *</label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Je bericht"
                      required
                      className="min-h-[150px] w-full"
                    />
                  </div>
                  
                  <Button type="submit" className="button-primary w-full">
                    Verstuur bericht
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Map - Static without animation */}
      <section className="py-20">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            <iframe
              src={contactInfo.address.mapUrl}
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              title="NFB Salon locatie"
            ></iframe>
          </div>
        </div>
      </section>
    </main>
  );
} 