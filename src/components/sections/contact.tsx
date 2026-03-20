"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail, Clock, Instagram, Facebook } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function ContactSection() {
  const [formStatus, setFormStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus("submitting");
    
    // Simulate form submission - in real app this would be an API call
    setTimeout(() => {
      setFormStatus("success");
      setFormData({ name: "", email: "", message: "" });
      
      // Reset form after showing success message
      setTimeout(() => setFormStatus("idle"), 5000);
    }, 1500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <section className="section py-24 relative overflow-hidden">
      {/* Background decoration - static instead of animated */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-10 right-0 w-[40rem] h-[30rem] rounded-full opacity-20 bg-primary/10 blur-3xl" />
        <div className="absolute bottom-20 left-10 w-[30rem] h-[20rem] rounded-full opacity-10 bg-primary/10 blur-3xl" />
        <div className="absolute inset-0 opacity-5 bg-[url('/images/pattern.png')] bg-repeat"></div>
      </div>
      
      <div className="container relative z-10">
        <div className="text-center mb-16">
          <h2 className="section-title">Contact & Locatie</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mt-6">
            Heeft u vragen of wilt u een afspraak maken? Neem contact met ons op of bezoek 
            onze salon in het centrum van Amsterdam.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Contact form */}
          <div>
            <Card className="bg-white rounded-2xl shadow-md border-0 overflow-hidden">
              <CardContent className="p-8">
                <h3 className="text-2xl font-serif mb-6 text-primary-foreground">Stuur ons een bericht</h3>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Input
                      type="text"
                      name="name"
                      placeholder="Uw naam"
                      value={formData.name}
                      onChange={handleChange}
                      className="bg-secondary/30 border-primary/10"
                      required
                    />
                  </div>
                  
                  <div>
                    <Input
                      type="email"
                      name="email"
                      placeholder="Uw e-mailadres"
                      value={formData.email}
                      onChange={handleChange}
                      className="bg-secondary/30 border-primary/10"
                      required
                    />
                  </div>
                  
                  <div>
                    <Textarea
                      name="message"
                      placeholder="Uw bericht"
                      value={formData.message}
                      onChange={handleChange}
                      className="bg-secondary/30 border-primary/10 min-h-[120px]"
                      required
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full button-primary"
                    disabled={formStatus === "submitting"}
                  >
                    {formStatus === "idle" && "Verstuur bericht"}
                    {formStatus === "submitting" && "Wordt verstuurd..."}
                    {formStatus === "success" && "Bericht verstuurd!"}
                    {formStatus === "error" && "Er ging iets mis, probeer opnieuw"}
                  </Button>
                  
                  {formStatus === "success" && (
                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-green-600 text-sm text-center"
                    >
                      Bedankt voor uw bericht! We nemen zo snel mogelijk contact met u op.
                    </motion.p>
                  )}
                </form>
              </CardContent>
            </Card>
          </div>
          
          {/* Contact info and map - no staggered animations */}
          <div className="space-y-8">
            <Card className="bg-white rounded-2xl shadow-md border-0 overflow-hidden">
              <CardContent className="p-8">
                <h3 className="text-2xl font-serif mb-6 text-primary-foreground">Contactgegevens</h3>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <MapPin className="w-5 h-5 text-primary mr-3 mt-0.5" />
                    <div>
                      <p className="text-primary-foreground">Adres</p>
                      <p className="text-muted-foreground">Loostraat 7, 6913 AG Aerdt</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Phone className="w-5 h-5 text-primary mr-3 mt-0.5" />
                    <div>
                      <p className="text-primary-foreground">Telefoon</p>
                      <p className="text-muted-foreground">+31 20 123 4567</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Mail className="w-5 h-5 text-primary mr-3 mt-0.5" />
                    <div>
                      <p className="text-primary-foreground">E-mail</p>
                      <p className="text-muted-foreground">info@nfbsalon.nl</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Clock className="w-5 h-5 text-primary mr-3 mt-0.5" />
                    <div>
                      <p className="text-primary-foreground">Openingstijden</p>
                      <p className="text-muted-foreground">Maandag: 09:00 - 18:00</p>
                      <p className="text-muted-foreground">Dinsdag: Gesloten</p>
                      <p className="text-muted-foreground">Woensdag: Gesloten</p>
                      <p className="text-muted-foreground">Donderdag: 09:00 - 16:00</p>
                      <p className="text-muted-foreground">Vrijdag: 09:00 - 18:00</p>
                      <p className="text-muted-foreground">Zaterdag: Gesloten</p>
                      <p className="text-muted-foreground">Zondag: Gesloten</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white rounded-2xl p-8 shadow-md border-0">
              <h3 className="text-2xl font-serif mb-6 text-primary-foreground">Volg Ons</h3>
              <div className="flex space-x-4">
                <a 
                  href="https://instagram.com" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all duration-300"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a 
                  href="https://facebook.com" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all duration-300"
                  aria-label="Facebook"
                >
                  <Facebook className="w-5 h-5" />
                </a>
              </div>
            </Card>
            
            <div className="aspect-video rounded-2xl overflow-hidden shadow-md">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2436.5942068948184!2d4.8812341!3d52.3702157!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c609c5e5c2e7b1%3A0x9cf598284c4ef45!2sPrinsengracht%2C%20Amsterdam!5e0!3m2!1sen!2snl!4v1620825475000!5m2!1sen!2snl" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen 
                loading="lazy"
                title="NFB Salon locatie"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 