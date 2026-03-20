"use client";

import { motion } from "framer-motion";
import { Heart, Clock, Star, CheckCircle, Award, ThumbsUp } from "lucide-react";

// Enhanced USP items with icons and descriptions
const uspItems = [
  {
    icon: Heart,
    title: "Persoonlijke aandacht",
    description: "Elke behandeling wordt afgestemd op uw persoonlijke wensen en behoeften voor optimale resultaten.",
    delay: 0
  },
  {
    icon: Award,
    title: "Hoogwaardige producten",
    description: "Wij werken uitsluitend met premium merken en materialen voor de beste kwaliteit en duurzaamheid.",
    delay: 0.1
  },
  {
    icon: CheckCircle,
    title: "Gegarandeerd resultaat",
    description: "We streven naar perfectie en zijn niet tevreden tot u dat ook bent.",
    delay: 0.2
  },
  {
    icon: ThumbsUp,
    title: "Ontspannen sfeer",
    description: "Een luxe en rustgevende omgeving waar u volledig tot rust kunt komen tijdens uw behandeling.",
    delay: 0.3
  }
];

export function USPSection() {
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
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <section className="section py-24 relative overflow-hidden">
      {/* Simplified background decoration with fewer elements */}
      <div className="absolute inset-0 z-0">
        <motion.div 
          className="absolute top-0 left-20 w-[30rem] h-[30rem] rounded-full opacity-20 bg-primary/10 blur-3xl"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.25 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 1 }}
        />
        
        <div className="absolute inset-0 opacity-5 bg-gradient-to-br from-primary/5 to-transparent"></div>
      </div>
      
      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="section-title">Onze beloften aan u</h2>
          <div className="h-1 w-28 bg-primary/70 mx-auto mt-3 mb-6 rounded-full"></div>
          <p className="text-lg text-foreground/90 max-w-2xl mx-auto mt-6 leading-relaxed">
            Bij <em className="text-primary font-medium">NFB Salon</em> staat uw tevredenheid centraal. 
            Wij onderscheiden ons door onze toewijding aan <em className="text-primary font-medium">kwaliteit</em>, <em className="text-primary font-medium">professionaliteit</em> 
            en een ongeëvenaarde <em className="text-primary font-medium">gastvrijheid</em> bij elke behandeling.
          </p>
        </motion.div>
      
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-10%" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto"
        >
          {uspItems.map((usp, index) => (
            <motion.div 
              key={index} 
              variants={item}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="bg-white/95 backdrop-blur-sm rounded-2xl p-10 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center h-full border border-primary/10"
            >
              <div 
                className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/25 to-primary/5 flex items-center justify-center mb-8 shadow-md"
              >
                <usp.icon className="w-10 h-10 text-primary" strokeWidth={1.5} />
              </div>
              
              <h3 
                className="text-2xl font-serif mb-4 text-foreground font-medium"
              >
                {usp.title}
              </h3>
              
              <p 
                className="text-foreground/80 leading-relaxed text-base"
              >
                {usp.description}
              </p>
              
              <div 
                className="h-1 w-16 bg-gradient-to-r from-primary/60 to-primary/20 rounded-full mt-8"
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
} 