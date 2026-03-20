"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { useKeenSlider } from 'keen-slider/react';
// Import CSS in a try-catch block to prevent errors
try {
  require('keen-slider/keen-slider.min.css');
} catch (e) {
  console.warn('Could not load keen-slider CSS');
}

// Define testimonial type
interface Testimonial {
  quote: string;
  name: string;
  title: string;
  rating: number;
  imageSrc?: string;
}

// Testimonials met sterrenratings
const testimonials: Testimonial[] = [
  {
    quote: "Ik kom hier al jaren voor mijn wimpers en ben altijd vol lof over het resultaat. De salon is prachtig ingericht en het team is zeer deskundig.",
    name: "Emma B.",
    title: "Vaste klant",
    rating: 5,
    imageSrc: "/images/person1.jpeg"
  },
  {
    quote: "Heerlijke gezichtsbehandeling gehad! De producten zijn van topkwaliteit en de aandacht die ik kreeg was geweldig. Mijn huid straalt na elk bezoek.",
    name: "Thomas K.",
    title: "Tevreden klant",
    rating: 5,
    imageSrc: "/images/person2.jpeg"
  },
  {
    quote: "Wat een fantastische ervaring! De wimperextensions zijn precies wat ik wilde - natuurlijk maar toch vol. Het team is vriendelijk en professioneel.",
    name: "Sophie L.",
    title: "Nieuwe klant",
    rating: 4,
    imageSrc: "/images/person3.jpeg"
  },
  {
    quote: "De body treatments zijn fantastisch! Zo ontspannend en echt een behandeling van topkwaliteit. Ik kan niet wachten om terug te gaan.",
    name: "Julia M.",
    title: "Nieuwe klant",
    rating: 5,
    imageSrc: "/images/person4.jpeg"
  },
  {
    quote: "Perfecte manicure! De aandacht voor detail is geweldig en mijn nagels zien er prachtig uit. De sfeer in de salon is ook heerlijk ontspannend.",
    name: "Linda V.",
    title: "Regelmatige klant",
    rating: 5,
    imageSrc: "/images/person5.jpeg"
  },
  {
    quote: "De gezichtsbehandeling was hemels. Mijn huid voelt zo zacht en gehydrateerd. Alle producten die gebruikt werden waren van hoge kwaliteit.",
    name: "Mila R.",
    title: "Vaste klant",
    rating: 5,
    imageSrc: "/images/person6.jpeg"
  },
];

export function TestimonialsSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [sliderError, setSliderError] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  // Safe keen-slider initialization with fallback
  const [sliderRef, instanceRef] = useKeenSlider(
    {
      initial: 0,
      slides: {
        perView: () => {
          try {
            if (window.innerWidth < 640) return 1;
            if (window.innerWidth < 1024) return 2;
            return 3;
          } catch (e) {
            return 1;
          }
        },
        spacing: 24,
      },
      slideChanged(slider) {
        try {
          setCurrentSlide(slider.track.details.rel);
        } catch (e) {
          console.warn('Error in slideChanged handler');
          setSliderError(true);
        }
      },
      created() {
        try {
          setLoaded(true);
        } catch (e) {
          console.warn('Error in created handler');
          setSliderError(true);
        }
      },
    },
    [
      // Add error handling to the slider through supported events
      (slider) => {
        try {
          slider.on('created', () => {
            console.log('Slider initialized successfully');
          });
          
          slider.on('destroyed', () => {
            console.log('Slider destroyed');
          });
        } catch (e) {
          console.warn('Error setting up slider events');
          setSliderError(true);
        }
      }
    ]
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.8, 
        ease: [0.16, 1, 0.3, 1],
      }
    }
  };

  return (
    <section className="section py-28 relative overflow-hidden bg-[#FDF6F1]/50">
      {/* Luxe achtergrond decoratie */}
      <div className="absolute inset-0 z-0">
        <motion.div 
          className="absolute top-40 -left-20 w-96 h-96 rounded-full opacity-30 bg-[#B99885]/30 blur-3xl"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.3 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        />
        <motion.div 
          className="absolute bottom-40 -right-20 w-80 h-80 rounded-full opacity-30 bg-[#B99885]/30 blur-3xl"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.2 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.3 }}
        />
        <div className="absolute inset-0 opacity-5 bg-gradient-to-br from-[#B99885]/5 to-transparent"></div>
      </div>
      
      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-semibold text-[#331A12] mb-6">
            Wat klanten <span className="text-[#B99885]">zeggen</span>
          </h2>
          <div className="h-1 w-24 bg-[#B99885] mx-auto mb-8 rounded-full"></div>
          <p className="text-lg text-[#331A12]/80 max-w-2xl mx-auto mt-6 leading-relaxed">
            Wij zijn trots op de ervaringen die onze klanten bij <em className="text-[#B99885] font-medium">NFB Salon</em> hebben gehad en delen graag hun verhalen.
          </p>
        </motion.div>
        
        {/* Mobile Grid View (for better accessibility) */}
        <motion.div 
          className="block md:hidden space-y-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {testimonials.slice(0, 3).map((testimonial, index) => (
            <TestimonialCard key={index} testimonial={testimonial} index={index} />
          ))}
        </motion.div>
        
        {/* Desktop View - Use Grid as a Fallback if Slider Has Error */}
        {sliderError ? (
          <motion.div 
            className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {testimonials.slice(0, 6).map((testimonial, index) => (
              <TestimonialCard key={index} testimonial={testimonial} index={index} />
            ))}
          </motion.div>
        ) : (
          /* Desktop Slider */
          <div className="hidden md:block relative">
            <div ref={sliderRef} className="keen-slider min-h-[320px]">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="keen-slider__slide">
                  <TestimonialCard testimonial={testimonial} index={index} />
                </div>
              ))}
            </div>
            
            {/* Carousel Navigation Controls */}
            {loaded && instanceRef.current && (
              <div className="flex justify-center mt-12 items-center gap-6">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-3 rounded-full bg-white shadow-md hover:bg-[#B99885]/10 transition-all duration-300"
                  onClick={() => instanceRef.current?.prev()}
                  disabled={currentSlide === 0}
                >
                  <ChevronLeft className="w-5 h-5 text-[#B99885]" />
                </motion.button>
                
                <div className="flex space-x-3">
                  {[...Array(Math.ceil(testimonials.length / (isMobile ? 1 : 3)))].map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => instanceRef.current?.moveToIdx(idx * (isMobile ? 1 : 3))}
                      className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                        currentSlide === idx * (isMobile ? 1 : 3) ? 'bg-[#B99885] scale-125' : 'bg-[#B99885]/30'
                      }`}
                    />
                  ))}
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-3 rounded-full bg-white shadow-md hover:bg-[#B99885]/10 transition-all duration-300"
                  onClick={() => instanceRef.current?.next()}
                  disabled={currentSlide === testimonials.length - (isMobile ? 1 : 3)}
                >
                  <ChevronRight className="w-5 h-5 text-[#B99885]" />
                </motion.button>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

// Separate Testimonial Card Component with proper types
function TestimonialCard({ testimonial, index }: { testimonial: Testimonial; index: number }) {
  return (
    <motion.div 
      variants={itemVariants}
      className="h-full"
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
    >
      <Card className="bg-white shadow-md backdrop-blur-sm h-full flex flex-col rounded-2xl overflow-hidden border-0 hover:shadow-xl transition-all duration-500 premium-card">
        <CardFooter className="pt-6 pb-3 border-b border-[#B99885]/10 flex justify-between items-center">
          {/* Rating sterren */}
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i}
                size={16}
                fill={i < testimonial.rating ? "#B99885" : "transparent"}
                stroke={i < testimonial.rating ? "#B99885" : "#B99885"}
                className="mr-1"
              />
            ))}
          </div>
          
          {/* Luxe quote icon */}
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#B99885]/10">
            <Quote className="w-4 h-4 text-[#B99885]" />
          </div>
        </CardFooter>
        
        {/* Content met quote */}
        <CardContent className="py-6 flex-grow relative">
          <p className="text-[#331A12]/70 italic text-base leading-relaxed relative">"{testimonial.quote}"</p>
        </CardContent>
        
        <CardFooter className="pt-3 pb-6 border-t border-[#B99885]/10 flex items-center gap-4">
          {testimonial.imageSrc && (
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#B99885]/20 flex-shrink-0">
              <div className="w-full h-full bg-[#B99885]/20"></div>
            </div>
          )}
          <div>
            <p className="font-serif text-base font-medium text-[#331A12]">{testimonial.name}</p>
            <p className="text-sm text-[#331A12]/60">{testimonial.title}</p>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

// Item variants moet in globale scope voor TestimonialCard
const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.8, 
      ease: [0.16, 1, 0.3, 1],
    }
  }
};

// Add default export at the end of the file
export default TestimonialsSection;