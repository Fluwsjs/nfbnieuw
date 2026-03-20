"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { motion } from "framer-motion";
import { Star, StarHalf, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";

// Metadata is verwijderd en moet in een apart bestand komen

// Define types
interface Testimonial {
  id: number;
  name: string;
  title: string;
  quote: string;
  rating: number;
  date: string;
}

interface FormData {
  name: string;
  email: string;
  service: string;
  rating: number;
  review: string;
}

import reviewsData from "../../../content/reviews.json";

const testimonials: Testimonial[] = reviewsData.testimonials;

export default function ReviewsPage() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    service: "",
    rating: 5,
    review: ""
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
      service: "",
      rating: 5,
      review: ""
    });
    
    // Show success message (in a real app, this would be more sophisticated)
    alert("Bedankt voor je review! We hebben je bericht ontvangen.");
  };

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

  // Render stars for rating
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`star-${i}`} className="w-4 h-4 fill-primary text-primary" />);
    }
    
    if (hasHalfStar) {
      stars.push(<StarHalf key="half-star" className="w-4 h-4 fill-primary text-primary" />);
    }
    
    return stars;
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
            Onze Reviews
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto leading-relaxed">
            {reviewsData.heroSubtitle}
          </p>
        </motion.div>
      </section>

      {/* Testimonials Grid */}
      <motion.section 
        className="section-bg-light py-20"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer}
      >
        <div className="container max-w-6xl mx-auto px-4">
          <motion.div variants={fadeIn} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-light mb-6">Klanten Ervaringen</h2>
            <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
              Bij NFB Salon streven we naar de hoogste klanttevredenheid. We zijn trots op de positieve feedback die we krijgen.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <motion.div 
                key={testimonial.id}
                variants={fadeIn}
                className="bg-white rounded-2xl shadow-md p-6 flex flex-col hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex items-center gap-1 mb-2">
                  {renderStars(testimonial.rating)}
                </div>
                <blockquote className="text-foreground/80 italic mb-6 flex-grow">
                  "{testimonial.quote}"
                </blockquote>
                <div className="border-t border-primary/10 pt-4 mt-auto">
                  <p className="font-medium text-foreground">{testimonial.name}</p>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-sm text-foreground/60">{testimonial.title}</span>
                    <span className="text-xs text-foreground/50">{testimonial.date}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Review Form */}
      <motion.section 
        className="section-bg-medium py-20"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeIn}
      >
        <div className="container max-w-3xl mx-auto px-4">
          <motion.div variants={fadeIn} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-light mb-6">Laat een Review Achter</h2>
            <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
              We waarderen je feedback! Deel je ervaring met ons en help anderen de perfecte behandeling te vinden.
            </p>
          </motion.div>

          <motion.div 
            variants={fadeIn}
            className="bg-white rounded-2xl shadow-md p-8"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">Naam</label>
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
                  <label htmlFor="email" className="text-sm font-medium">Email</label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Je email"
                    required
                    className="w-full"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="service" className="text-sm font-medium">Welke behandeling heb je gehad?</label>
                <select
                  id="service"
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  required
                  className="w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm"
                >
                  <option value="">Selecteer een behandeling</option>
                  <option value="nails">Nagelbehandelingen</option>
                  <option value="waxen-lashes">Waxen & Lashlifting</option>
                  <option value="facial">Gezichtsbehandelingen</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Je beoordeling</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, rating }))}
                      className="focus:outline-none"
                    >
                      <Star 
                        className={`w-6 h-6 ${formData.rating >= rating ? 'fill-primary text-primary' : 'text-gray-300'}`} 
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="review" className="text-sm font-medium">Je ervaring</label>
                <Textarea
                  id="review"
                  name="review"
                  value={formData.review}
                  onChange={handleChange}
                  placeholder="Vertel ons over je ervaring..."
                  required
                  className="min-h-[120px] w-full"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full button-primary flex items-center justify-center gap-2"
              >
                Verstuur Review
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </motion.div>
        </div>
      </motion.section>
    </main>
  );
} 