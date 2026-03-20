"use client";

import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, Calendar, Clock, Check, Star, AlertCircle, Mail, Phone, Info, 
         Loader2, Lock, Scissors, Euro, XCircle, CheckCircle, Printer, Sparkles, Paintbrush } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { BookingForm } from "@/app/components/BookingForm";
import { z } from "zod";
import FallbackImage from "@/components/ui/fallback-image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, addDays } from "date-fns";
import { nl } from "date-fns/locale";
import { nanoid } from "nanoid";

// Define types
interface ServiceOption {
  id: string;
  name: string;
  price: string;
  duration: string;
  description?: string;
}

interface Service {
  id: string;
  name: string;
  description: string;
  image: string;
  icon: string;
  options: ServiceOption[];
  duration?: string;
}

interface Day {
  date: Date;
  formatted: string;
}

interface CustomerDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  notes: string;
  [key: string]: string; // Index signature to allow string indexing
}

interface FieldErrors {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  notes: string;
  [key: string]: string; // Index signature to allow string indexing
}

// Form data schema
const formSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

// Services data with updated prices and categories
const services: Service[] = [
  {
    id: "gezichtsbehandelingen",
    name: "Gezichtsbehandelingen",
    description: "Professionele en persoonlijke gezichtsbehandelingen voor een stralende huid.",
    image: "/images/services/facial.jpg",
    icon: "Sparkles",
    options: [
      { 
        id: "meet-treat", 
        name: "Meet & Treat", 
        price: "€52", 
        duration: "60 min",
        description: "Kennismakingsbehandeling" 
      },
      { 
        id: "pure-clean", 
        name: "Pure & Clean", 
        price: "€52", 
        duration: "60 min",
        description: "Reinigende behandeling" 
      },
      { 
        id: "relax-nourish", 
        name: "Relax & Nourish", 
        price: "€69", 
        duration: "75 min",
        description: "Voedend & ontspannend" 
      },
      { 
        id: "time-reverse", 
        name: "Time Reverse", 
        price: "€120", 
        duration: "90 min",
        description: "Anti Aging behandeling" 
      },
    ]
  },
  {
    id: "waxen-epileren-verven",
    name: "Waxen / Epileren / Verven",
    description: "Professionele wax-, epileer- en verfbehandelingen voor wenkbrauwen en wimpers.",
    image: "/images/services/lashes.jpg",
    icon: "Scissors",
    options: [
      { id: "waxen-epileren-wenkbrauwen", name: "Waxen en epileren wenkbrauwen", price: "€17", duration: "30 min" },
      { id: "waxen-epileren-wenkbrauwen-verven", name: "Waxen en epileren wenkbrauwen incl. verven", price: "€27", duration: "45 min" },
      { id: "waxen-bovenlip", name: "Waxen bovenlip", price: "€15", duration: "20 min" },
      { id: "waxen-bovenlip-kin", name: "Waxen bovenlip en kin", price: "€24", duration: "30 min" },
      { id: "verven-wimpers", name: "Verven wimpers", price: "€12,50", duration: "30 min" },
      { id: "waxen-epileren-wenkbrauwen-verven-wimpers", name: "Waxen en epileren wenkbrauwen + verven wimpers", price: "€33", duration: "60 min" },
      { id: "waxen-oksels", name: "Waxen oksels", price: "€40,50", duration: "30 min" },
      { id: "waxen-rug", name: "Waxen rug", price: "€37,50", duration: "45 min" },
      { id: "harsen-onderbenen-bovenbenen", name: "Harsen onderbenen of bovenbenen", price: "€28,50", duration: "45 min" },
      { id: "harsen-benen-volledig", name: "Harsen onderbenen en bovenbenen", price: "€40,50", duration: "75 min" },
      { id: "lashlifting", name: "Lashlifting", price: "€43,50", duration: "60 min" },
    ]
  },
  {
    id: "nagelbehandelingen",
    name: "Nagelbehandelingen",
    description: "Professionele nagelbehandelingen voor mooie en verzorgde nagels.",
    image: "/images/services/nails.jpg",
    icon: "Paintbrush",
    options: [
      { id: "next-gel-nieuwe-set", name: "Next Gel - Nieuwe set", price: "€57,50", duration: "90 min" },
      { id: "next-gel-bijwerken", name: "Next Gel - Bijwerken", price: "€42,50", duration: "60 min" },
      { id: "next-gel-verwijderen", name: "Next Gel - Verwijderen", price: "€15", duration: "30 min" },
      { id: "biab-handnagels", name: "BIAB op handnagels", price: "€34,50", duration: "60 min" },
      { id: "biab-verwijderen", name: "BIAB verwijderen", price: "€10", duration: "30 min" },
      { id: "gellak-handnagels", name: "Gellak handnagels", price: "€24,50", duration: "45 min" },
      { id: "gellak-handnagels-hema-tpo-vrij", name: "Gellak handnagels (HEMA/TPO vrije gellak)", price: "€26,50", duration: "45 min" },
      { id: "gellak-teennagels", name: "Gellak teennagels", price: "€22,50", duration: "45 min" },
    ]
  }
];

// Function to check if a date is a working day (Monday, Thursday, Friday only)
const isWorkingDay = (date: Date): boolean => {
  const day = date.getDay();
  // 0 = Sunday, 1 = Monday, 2 = Tuesday, 3 = Wednesday, 4 = Thursday, 5 = Friday, 6 = Saturday
  return day === 1 || day === 4 || day === 5; // Monday, Thursday, Friday
};

// Updated available days (next 4 weeks, only include working days)
const getAvailableDays = (): Day[] => {
  const days: Day[] = [];
  const today = new Date();
  
  for (let i = 1; i <= 28; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    
    // Only include working days
    if (isWorkingDay(date)) {
      days.push({
        date: date,
        formatted: date.toLocaleDateString('nl-NL', { weekday: 'long', day: 'numeric', month: 'long' })
      });
    }
  }
  
  return days;
};

// Update getTimeSlots functie om ook geboekte slots te kunnen bijhouden
const getTimeSlots = (day: Day): string[] => {
  const dayOfWeek = day.date.getDay();
  
  // Monday & Friday: 09:00 - 18:00
  if (dayOfWeek === 1 || dayOfWeek === 5) {
    return [
      "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", 
      "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", 
      "15:00", "15:30", "16:00", "16:30", "17:00", "17:30"
    ];
  }
  // Thursday: 09:00 - 16:00
  else if (dayOfWeek === 4) {
    return [
      "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", 
      "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", 
      "15:00", "15:30"
    ];
  }
  
  return [];
};

// Maak een helper component voor titels die deze netjes splitst
const SplitServiceTitle = ({ title }: { title: string }) => {
  // Splits specifieke titels handmatig voor betere controle
  if (title === "Gezichtsbehandelingen") {
    return (
      <h2 className="text-lg md:text-xl font-semibold text-[#1D3557] group-hover:text-[#B22234] transition-colors duration-300 text-center max-w-[200px] break-words leading-tight z-10">
        Gezichts-<br />behandelingen
      </h2>
    );
  } else if (title === "Waxen / Epileren / Verven") {
    return (
      <h2 className="text-lg md:text-xl font-semibold text-[#1D3557] group-hover:text-[#B22234] transition-colors duration-300 text-center max-w-[200px] break-words leading-tight z-10">
        Waxen /<br />Epileren /<br />Verven
      </h2>
    );
  } else if (title === "Nagelbehandelingen") {
    return (
      <h2 className="text-lg md:text-xl font-semibold text-[#1D3557] group-hover:text-[#B22234] transition-colors duration-300 text-center max-w-[200px] break-words leading-tight z-10">
        Nagel-<br />behandelingen
      </h2>
    );
  }
  
  // Fallback voor andere titels
  return (
    <h2 className="text-lg md:text-xl font-semibold text-[#1D3557] group-hover:text-[#B22234] transition-colors duration-300 text-center max-w-[200px] break-words leading-tight z-10">
      {title}
    </h2>
  );
};

export default function AfspraakPage() {
  const router = useRouter();
  const [step, setStep] = useState<number>(1);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedOption, setSelectedOption] = useState<ServiceOption | null>(null);
  const [selectedDay, setSelectedDay] = useState<Day | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [bookingLoading, setBookingLoading] = useState<boolean>(false);
  const [bookingConfirmed, setBookingConfirmed] = useState<boolean>(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [customerDetails, setCustomerDetails] = useState<CustomerDetails>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    notes: ""
  });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    notes: ""
  });
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);
  const [bookedTimeSlots, setBookedTimeSlots] = useState<string[]>([]);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      notes: ""
    }
  });

  // Stappen progress indicator component
  const StepIndicator = () => {
    return (
      <div className="w-full mb-6 md:mb-8">
        <div className="flex items-center justify-between mb-2">
          <div className="hidden sm:block text-xs text-[#1D1D1F]/60">
            {step === 1 ? "Kies een service" : 
             step === 2 ? "Kies een datum en tijd" : 
             "Vul je gegevens in"}
          </div>
          <div className="text-sm text-[#1D1D1F]/70 font-medium">
            Stap {step} van 3
          </div>
        </div>
        
        <div className="relative">
          <div className="overflow-hidden h-2 mb-4 flex rounded-full bg-[#F9F5F2]">
            <div 
              style={{ width: `${(step / 3) * 100}%` }} 
              className="shadow-none flex flex-col text-center whitespace-nowrap justify-center bg-[#B99885] transition-all duration-500 ease-in-out"
            ></div>
          </div>
          
          <div className="flex justify-between -mt-6">
            {[1, 2, 3].map((stepNum) => (
              <div 
                key={stepNum} 
                className={`relative w-8 h-8 flex items-center justify-center rounded-full border-2 transition-all duration-300 ${
                  step >= stepNum 
                    ? "bg-[#B99885] border-[#B99885] text-white" 
                    : "bg-white border-[#E5E7EB] text-[#9CA3AF]"
                }`}
              >
                {step > stepNum ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <span className="text-xs font-medium">{stepNum}</span>
                )}
                
                <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-medium whitespace-nowrap hidden md:inline-block">
                  {stepNum === 1 ? "Service" : 
                   stepNum === 2 ? "Datum & Tijd" : 
                   "Gegevens"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Form navigation
  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);
  
  // Function to fetch available time slots
  const fetchAvailableTimeSlots = async (day: Day) => {
    setIsFetching(true);
    try {
      // Format date as YYYY-MM-DD for API
      const formattedDate = day.date.toISOString().split('T')[0];
      
      const response = await fetch(`/api/bookings?date=${formattedDate}`);
      const data = await response.json();
      
      // Get all standard time slots for this day
      const allSlots = getTimeSlots(day);
      
      if (!response.ok) {
        console.error('Error fetching time slots:', data);
        // If error, fall back to standard time slots
        setTimeSlots(allSlots);
        setAvailableTimeSlots(allSlots);
        setBookedTimeSlots([]);
        return;
      }
      
      // Filter out booked slots based on API response
      if (data.appointments && data.appointments.length > 0) {
        const bookedSlots = data.appointments.map((app: any) => app.time);
        setBookedTimeSlots(bookedSlots);
        
        const availableSlots = allSlots.filter(slot => !bookedSlots.includes(slot));
        setAvailableTimeSlots(availableSlots);
        
        // Set all slots for UI rendering, both available and booked
        setTimeSlots(allSlots);
      } else {
        // If no appointments, all slots are available
        setTimeSlots(allSlots);
        setAvailableTimeSlots(allSlots);
        setBookedTimeSlots([]);
      }
    } catch (error) {
      console.error('Error fetching time slots:', error);
      // If error, fall back to standard time slots
      const allSlots = getTimeSlots(day);
      setTimeSlots(allSlots);
      setAvailableTimeSlots(allSlots);
      setBookedTimeSlots([]);
    } finally {
      setIsFetching(false);
    }
  };
  
  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    setSelectedOption(null); // Reset option when service changes
    nextStep(); // Weer toevoegen: ga direct naar de volgende stap na service selectie
  };
  
  const handleOptionSelect = (option: ServiceOption) => {
    setSelectedOption(option);
  };
  
  const handleDaySelect = (day: Day) => {
    setSelectedDay(day);
    setSelectedTime(null); // Reset time when day changes
    
    // Fetch available time slots from API
    fetchAvailableTimeSlots(day);
  };
  
  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    // Don't automatically advance to next step in the new design
  };
  
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCustomerDetails(prev => ({ ...prev, [name]: value }));
  };
  
  const handleFormSubmit = (data: FormData) => {
    // Update customer details from form data
    setCustomerDetails({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      notes: data.notes || "",
    });
    
    // Move to the confirmation step
    nextStep();
  };
  
  // Function to submit the booking to the API
  const submitBooking = async () => {
    setBookingLoading(true);
    setBookingError(null);
    
    try {
      if (!selectedDay || !selectedTime || !selectedService || !selectedOption) {
        throw new Error("Alle velden voor de afspraak moeten ingevuld zijn.");
      }
      
      const bookingData = {
        id: nanoid(),
        service: selectedService.name,
        treatment: selectedOption.name,
        customer: `${customerDetails.firstName} ${customerDetails.lastName}`,
        email: customerDetails.email,
        phone: customerDetails.phone,
        notes: customerDetails.notes || "",
        date: format(selectedDay.date, "yyyy-MM-dd"),
        time: selectedTime,
        duration: selectedOption.duration,
        price: selectedOption.price
      };
      
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || "Er is een fout opgetreden bij het boeken.");
      }
      
      // Success - show confirmation
      setBookingConfirmed(true);
    } catch (error: any) {
      console.error("Booking error:", error);
      setBookingError(error.message || "Er is een onbekende fout opgetreden.");
    } finally {
      setBookingLoading(false);
    }
  };
  
  // Animation variants
  const pageTransition = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring", 
        duration: 0.5, 
        bounce: 0.3,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    },
    exit: { 
      opacity: 0, 
      y: -20, 
      transition: { duration: 0.3 } 
    }
  };
  
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };
  
  const item = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    }
  };
  
  // Render service selection step
  const renderServiceSelect = () => {
    return (
      <motion.div
        key="step1"
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={pageTransition}
        className="p-4 md:p-8 relative"
      >
        <Link 
          href="/" 
          className="mb-6 flex items-center text-[#1D1D1F]/70 hover:text-[#1D1D1F] transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Terug naar home
        </Link>
        
        <div className="mb-8 md:mb-10">
          <StepIndicator />
        </div>
        
        <h1 className="text-2xl md:text-3xl font-serif font-medium text-[#1D3557] mb-2">
          Maak een Afspraak
        </h1>
        <p className="text-sm md:text-base text-[#1D1D1F]/70 mb-6 md:mb-8">
          Selecteer het type behandeling dat je wenst te reserveren.
        </p>

        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6"
        >
          {services.map((service) => (
            <motion.div
              key={service.id}
              variants={item}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className={`bg-white rounded-2xl shadow-md cursor-pointer transition-all duration-300 transform hover:shadow-xl overflow-hidden group ${
                selectedService?.id === service.id
                  ? "border-2 border-[#B22234] scale-[1.02]"
                  : "border border-[#E9DFD8] hover:border-[#1D3557]/40"
              }`}
              onClick={() => handleServiceSelect(service)}
            >
              <div className="p-6 flex flex-col h-full">
                <div className="mb-4 flex justify-center">
                  <div className="bg-[#F9F5F2] p-4 rounded-full">
                    {service.icon === "Sparkles" && <Sparkles className="h-6 w-6 text-[#B22234]" />}
                    {service.icon === "Scissors" && <Scissors className="h-6 w-6 text-[#B22234]" />}
                    {service.icon === "Paintbrush" && <Paintbrush className="h-6 w-6 text-[#B22234]" />}
                  </div>
                </div>
                
                <h2 className="text-lg md:text-xl font-medium text-[#1D3557] mb-3 text-center px-1">
                  {service.name === "Gezichtsbehandelingen" ? (
                    <>
                      Gezichts-<br />behandelingen
                    </>
                  ) : service.name === "Nagelbehandelingen" ? (
                    <>
                      Nagel-<br />behandelingen
                    </>
                  ) : (
                    service.name
                  )}
                </h2>
                
                <div className="w-16 h-0.5 bg-[#E9DFD8] mx-auto mb-4"></div>
                
                <p className="text-sm text-[#1D1D1F]/70 text-center mb-5 flex-grow">
                  {service.description}
                </p>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center bg-[#F9F5F2] px-3 py-2 rounded-full">
                    <Clock className="h-4 w-4 mr-2 text-[#B22234]" />
                    <span className="text-sm text-[#1D1D1F]/70 font-medium">
                      {service.duration || "30-90 min"}
                    </span>
                  </div>
                  
                  <div className="flex items-center text-[#1D3557] font-medium group-hover:text-[#B22234] transition-colors duration-300">
                    <span className="text-sm mr-1 group-hover:underline">Bekijk opties</span>
                    <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        {services.length === 0 && (
          <div className="bg-white rounded-2xl shadow-md p-6 md:p-8 text-center">
            <div className="w-14 h-14 mx-auto bg-[#F9F5F2] rounded-full flex items-center justify-center mb-4">
              <Loader2 className="h-6 w-6 animate-spin text-[#1D3557]" />
            </div>
            <h2 className="text-lg font-medium text-[#1D1D1F] mb-2">Services worden geladen...</h2>
            <p className="text-sm text-[#1D1D1F]/70">Even geduld terwijl we beschikbare services ophalen.</p>
          </div>
        )}
      </motion.div>
    );
  };
  
  // Render date/time selection step
  const renderDateTimeSelect = () => {
    return (
      <motion.div
        key="step2"
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={pageTransition}
        className="p-4 md:p-8 relative"
      >
        <button
          onClick={prevStep}
          className="mb-6 flex items-center text-[#1D1D1F]/70 hover:text-[#1D1D1F] transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Terug naar services
        </button>
        
        <div className="mb-8 md:mb-10">
          <StepIndicator />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-5 md:p-6 shadow-md">
            <h2 className="text-xl md:text-2xl font-serif font-medium mb-3 text-[#1D3557]">
              Behandeling
            </h2>
            <p className="text-[#1D1D1F]/70 mb-5 text-sm">
              Selecteer de gewenste behandeling voor <span className="font-medium">{selectedService?.name}</span>
            </p>
            
            <motion.div 
              variants={container}
              initial="hidden"
              animate="visible"
              className="space-y-3 mb-8 max-h-[400px] overflow-y-auto pr-2 styled-scrollbar"
              style={{
                scrollbarWidth: 'thin',
                scrollbarColor: '#B99885 #F9F5F2'
              }}
            >
              {selectedService?.options.map((option) => (
                <motion.div
                  key={option.id}
                  variants={item}
                  whileHover={{ x: 5, transition: { duration: 0.2 } }}
                  className={`bg-[#F9F5F2] rounded-xl p-4 cursor-pointer transition-all duration-300 border-2 ${
                    selectedOption?.id === option.id
                      ? "border-[#B22234] shadow-md"
                      : "border-transparent hover:border-[#1D3557]/30"
                  }`}
                  onClick={() => handleOptionSelect(option)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-base font-medium text-[#1D3557]">{option.name}</h3>
                      {option.description && (
                        <p className="text-[#1D1D1F]/70 text-xs mt-1">{option.description}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-base font-medium text-[#B22234]">{option.price}</p>
                      <div className="flex items-center text-[#1D1D1F]/60 text-xs">
                        <Clock className="h-3 w-3 mr-1 inline" />
                        <span>{option.duration}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
          
          {selectedOption && (
            <div className="bg-white rounded-2xl p-5 md:p-6 shadow-md">
              <h2 className="text-xl md:text-2xl font-serif font-medium mb-3 text-[#1D3557]">
                Datum en Tijd
              </h2>
              <p className="text-[#1D1D1F]/70 mb-5 text-sm">
                Selecteer een beschikbare datum en tijd voor je <span className="font-medium">{selectedOption.name}</span>
              </p>
              
              <div className="bg-[#F9F5F2] rounded-xl p-4 mb-5">
                <h3 className="text-base font-medium text-[#1D3557] mb-4 flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-[#B22234]" />
                  Beschikbare Dagen
                </h3>
                
                {/* Dagen in een horizontale scrollable container voor mobiel */}
                <div className="overflow-x-auto pb-3 styled-scrollbar">
                  <div className="grid grid-flow-col auto-cols-max gap-2 md:grid-cols-3 md:grid-flow-row md:auto-cols-fr">
                    {getAvailableDays().slice(0, 15).map((day) => (
                      <motion.div
                        key={day.formatted}
                        variants={item}
                        whileHover={{ y: -2, transition: { duration: 0.2 } }}
                        className={`p-2 rounded-xl cursor-pointer transition-all duration-300 flex flex-col items-center border min-w-[90px] min-h-[90px] ${
                          selectedDay?.formatted === day.formatted
                            ? "bg-[#1D3557]/10 border-[#1D3557] shadow-sm"
                            : "border-gray-200 hover:border-[#1D3557]/30 bg-white"
                        }`}
                        onClick={() => handleDaySelect(day)}
                      >
                        <p className="font-medium text-[#1D1D1F] text-xs">
                          {day.formatted.split(" ")[0]} {/* Weekday */}
                        </p>
                        <div className="bg-white w-10 h-10 rounded-full flex items-center justify-center my-1 shadow-sm border border-[#1D3557]/10">
                          <span className="font-bold text-[#1D3557] text-sm">
                            {day.date.getDate()}
                          </span>
                        </div>
                        <p className="text-xs text-[#1D1D1F]/70 text-center">
                          {day.formatted.split(" ")[1]} {/* Month only */}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
              
              {selectedDay && (
                <div>
                  {isFetching ? (
                    <div className="bg-[#F9F5F2] rounded-xl p-4 flex justify-center items-center h-32">
                      <Loader2 className="h-8 w-8 animate-spin text-[#1D3557]" />
                    </div>
                  ) : timeSlots.length > 0 ? (
                    <div className="bg-[#F9F5F2] rounded-xl p-4">
                      <h3 className="text-base font-medium text-[#1D3557] mb-4 flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-[#B22234]" />
                        Beschikbare Tijden
                      </h3>
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 gap-2">
                        {timeSlots.map((time) => {
                          const isBooked = bookedTimeSlots.includes(time);
                          return (
                            <motion.button
                              key={time}
                              variants={item}
                              whileHover={isBooked ? {} : { y: -2, transition: { duration: 0.2 } }}
                              className={`py-3 rounded-xl transition-all duration-300 text-center min-h-[48px] ${
                                selectedTime === time
                                  ? "bg-[#1D3557] text-white shadow-sm"
                                  : isBooked 
                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200 relative"
                                    : "bg-white border border-gray-200 hover:border-[#1D3557]/30 text-[#1D1D1F]"
                              }`}
                              onClick={() => !isBooked && handleTimeSelect(time)}
                              disabled={isBooked}
                            >
                              <span className="text-sm font-medium">{time}</span>
                              {isBooked && (
                                <div className="absolute inset-0 flex items-center justify-center bg-gray-100/80 rounded-xl">
                                  <Lock className="h-3 w-3 text-gray-500 mr-1" />
                                  <span className="text-xs text-gray-500">Bezet</span>
                                </div>
                              )}
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-[#F9F5F2] rounded-xl p-5 text-center">
                      <XCircle className="h-8 w-8 text-[#B22234]/70 mx-auto mb-2" />
                      <h3 className="text-base font-medium text-[#1D1D1F] mb-1">Geen tijdsloten beschikbaar</h3>
                      <p className="text-sm text-[#1D1D1F]/70">Kies een andere datum om beschikbare tijden te zien.</p>
                    </div>
                  )}
                </div>
              )}
              
              {!selectedDay && (
                <div className="bg-[#F9F5F2] rounded-xl p-5 text-center">
                  <Calendar className="h-8 w-8 text-[#1D3557]/70 mx-auto mb-2" />
                  <h3 className="text-base font-medium text-[#1D1D1F] mb-1">Selecteer een datum</h3>
                  <p className="text-sm text-[#1D1D1F]/70">Kies eerst een datum om beschikbare tijdsloten te zien.</p>
                </div>
              )}
            </div>
          )}

          {!selectedOption && (
            <div className="bg-white rounded-2xl p-5 md:p-6 shadow-md flex items-center justify-center h-full">
              <div className="text-center p-6">
                <div className="w-14 h-14 bg-[#F9F5F2] rounded-full flex items-center justify-center mx-auto mb-4">
                  <ArrowLeft className="h-5 w-5 text-[#1D3557]" />
                </div>
                <h3 className="text-lg font-medium text-[#1D1D1F] mb-2">Kies eerst een behandeling</h3>
                <p className="text-sm text-[#1D1D1F]/70">
                  Selecteer een behandeling om beschikbare datums en tijden te zien
                </p>
              </div>
            </div>
          )}
        </div>
        
        {/* Sticky footer */}
        {selectedOption && selectedDay && selectedTime && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 flex justify-end lg:hidden shadow-lg z-10">
            <Button 
              onClick={() => {
                if (!selectedDay) {
                  alert("Selecteer een datum voor je afspraak");
                  return;
                }
                
                if (!selectedTime) {
                  alert("Selecteer een tijd voor je afspraak");
                  return;
                }
                
                nextStep();
              }}
              className="rounded-full bg-[#1D3557] hover:bg-[#1D3557]/90 text-white px-6 py-3 w-full"
            >
              Verder
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}
        
        {selectedOption && selectedDay && selectedTime && (
          <div className="hidden lg:flex justify-end mt-6">
            <Button 
              onClick={() => {
                if (!selectedDay) {
                  alert("Selecteer een datum voor je afspraak");
                  return;
                }
                
                if (!selectedTime) {
                  alert("Selecteer een tijd voor je afspraak");
                  return;
                }
                
                nextStep();
              }}
              className="rounded-full bg-[#1D3557] hover:bg-[#1D3557]/90 text-white px-8 py-3"
            >
              Verder
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}
      </motion.div>
    );
  };
  
  // Render customer information form
  const renderCustomerForm = () => {
    const handleFieldChange = (field: string, value: string) => {
      setCustomerDetails((prev) => ({ ...prev, [field]: value }));
      // Reset error when user types
      if (fieldErrors[field]) {
        setFieldErrors((prev) => ({ ...prev, [field]: "" }));
      }
    };
    
    const validateField = (field: string): boolean => {
      if (!customerDetails[field] || customerDetails[field].trim() === "") {
        setFieldErrors(prev => ({ ...prev, [field]: "Dit veld is verplicht" }));
        return false;
      }
      
      // Email validation
      if (field === "email" && !/^\S+@\S+\.\S+$/.test(customerDetails.email)) {
        setFieldErrors(prev => ({ ...prev, email: "Vul een geldig e-mailadres in" }));
        return false;
      }
      
      // Phone validation (basic format)
      if (field === "phone" && !/^[0-9\s+()-]{10,15}$/.test(customerDetails.phone)) {
        setFieldErrors(prev => ({ ...prev, phone: "Vul een geldig telefoonnummer in" }));
        return false;
      }
      
      return true;
    };

    return (
      <motion.div
        key="step3"
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={pageTransition}
        className="p-4 md:p-8 relative pb-24 md:pb-4"
      >
        <button
          onClick={prevStep}
          className="mb-6 flex items-center text-[#1D1D1F]/70 hover:text-[#1D1D1F] transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Terug naar datum/tijd
        </button>
        
        <div className="mb-8 md:mb-10">
          <StepIndicator />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 order-2 lg:order-1">
            <div className="bg-white rounded-2xl p-5 md:p-6 shadow-md">
              <h2 className="text-xl md:text-2xl font-serif font-medium mb-3 text-[#1D3557]">
                Jouw Gegevens
              </h2>
              <p className="text-[#1D1D1F]/70 mb-6 text-sm">
                Vul je contactgegevens in om de afspraak te bevestigen.
              </p>
              
              <form className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="firstName" className="block text-sm font-medium text-[#1D1D1F]">
                      Voornaam <span className="text-[#B22234]">*</span>
                    </label>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      value={customerDetails.firstName}
                      onChange={(e) => handleFieldChange("firstName", e.target.value)}
                      className={`w-full rounded-lg border ${
                        fieldErrors.firstName ? "border-[#B22234]" : "border-gray-300"
                      } px-4 py-3 text-[#1D1D1F] focus:outline-none focus:ring-2 focus:ring-[#1D3557] transition-all duration-200`}
                      placeholder="Voornaam"
                    />
                    {fieldErrors.firstName && (
                      <p className="text-xs text-[#B22234]">{fieldErrors.firstName}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="lastName" className="block text-sm font-medium text-[#1D1D1F]">
                      Achternaam <span className="text-[#B22234]">*</span>
                    </label>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      value={customerDetails.lastName}
                      onChange={(e) => handleFieldChange("lastName", e.target.value)}
                      className={`w-full rounded-lg border ${
                        fieldErrors.lastName ? "border-[#B22234]" : "border-gray-300"
                      } px-4 py-3 text-[#1D1D1F] focus:outline-none focus:ring-2 focus:ring-[#1D3557] transition-all duration-200`}
                      placeholder="Achternaam"
                    />
                    {fieldErrors.lastName && (
                      <p className="text-xs text-[#B22234]">{fieldErrors.lastName}</p>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-[#1D1D1F]">
                    E-mailadres <span className="text-[#B22234]">*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={customerDetails.email}
                    onChange={(e) => handleFieldChange("email", e.target.value)}
                    className={`w-full rounded-lg border ${
                      fieldErrors.email ? "border-[#B22234]" : "border-gray-300"
                    } px-4 py-3 text-[#1D1D1F] focus:outline-none focus:ring-2 focus:ring-[#1D3557] transition-all duration-200`}
                    placeholder="naam@voorbeeld.nl"
                  />
                  {fieldErrors.email && (
                    <p className="text-xs text-[#B22234]">{fieldErrors.email}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="phone" className="block text-sm font-medium text-[#1D1D1F]">
                    Telefoonnummer <span className="text-[#B22234]">*</span>
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={customerDetails.phone}
                    onChange={(e) => handleFieldChange("phone", e.target.value)}
                    className={`w-full rounded-lg border ${
                      fieldErrors.phone ? "border-[#B22234]" : "border-gray-300"
                    } px-4 py-3 text-[#1D1D1F] focus:outline-none focus:ring-2 focus:ring-[#1D3557] transition-all duration-200`}
                    placeholder="06 12345678"
                  />
                  {fieldErrors.phone && (
                    <p className="text-xs text-[#B22234]">{fieldErrors.phone}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="notes" className="block text-sm font-medium text-[#1D1D1F]">
                    Opmerkingen <span className="text-[#1D1D1F]/40 text-xs">(optioneel)</span>
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    rows={3}
                    value={customerDetails.notes}
                    onChange={(e) => handleFieldChange("notes", e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-[#1D1D1F] focus:outline-none focus:ring-2 focus:ring-[#1D3557] transition-all duration-200"
                    placeholder="Speciale verzoeken of belangrijke informatie..."
                  />
                </div>
              </form>
            </div>
          </div>
          
          <div className="lg:col-span-2 order-1 lg:order-2">
            <div className="bg-white rounded-2xl p-5 md:p-6 shadow-md">
              <h2 className="text-xl font-serif font-medium mb-5 text-[#1D3557] flex items-center">
                <CheckCircle className="h-5 w-5 mr-2 text-[#B22234]" />
                Afspraakdetails
              </h2>
              
              <div className="bg-[#F9F5F2] rounded-xl p-4 mb-6">
                <div className="flex items-start space-x-3 mb-4 pb-4 border-b border-[#1D3557]/10">
                  <div className="mt-1 bg-white p-2 rounded-full">
                    <Scissors className="h-5 w-5 text-[#1D3557]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#1D1D1F]/60">Behandeling</p>
                    <p className="font-medium text-[#1D3557]">{selectedService?.name} - {selectedOption?.name}</p>
                    <div className="flex items-center mt-1">
                      <p className="text-sm text-[#1D1D1F]/70">{selectedOption?.duration}</p>
                      <span className="mx-2 text-[#1D1D1F]/30">•</span>
                      <p className="text-sm text-[#1D1D1F]/70">{selectedOption?.price}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 mb-4 pb-4 border-b border-[#1D3557]/10">
                  <div className="mt-1 bg-white p-2 rounded-full">
                    <Calendar className="h-5 w-5 text-[#1D3557]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#1D1D1F]/60">Datum</p>
                    <p className="font-medium text-[#1D3557]">{selectedDay?.formatted}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="mt-1 bg-white p-2 rounded-full">
                    <Clock className="h-5 w-5 text-[#1D3557]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#1D1D1F]/60">Tijd</p>
                    <p className="font-medium text-[#1D3557]">{selectedTime} uur</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                <div className="flex items-start">
                  <div className="mt-1 bg-white p-2 rounded-full mr-3">
                    <Info className="h-4 w-4 text-[#1D3557]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#1D3557] mb-1">Belangrijk om te weten</p>
                    <ul className="text-xs text-[#1D1D1F]/70 list-disc list-inside space-y-1">
                      <li>Annuleren kan kosteloos tot 24 uur voor de afspraak</li>
                      <li>Bij verhindering graag tijdig contact opnemen</li>
                      <li>Na het boeken ontvang je een bevestiging per e-mail</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Sticky footer met bevestigingsknop */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 flex justify-end lg:hidden shadow-lg z-10">
          <Button 
            onClick={validateAndSubmit}
            disabled={bookingLoading}
            className="rounded-full bg-[#1D3557] hover:bg-[#1D3557]/90 text-white px-6 py-3 w-full"
          >
            {bookingLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Bezig met boeken...
              </>
            ) : (
              <>
                Afspraak bevestigen
                <CheckCircle className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
        
        <div className="hidden lg:flex justify-end mt-8">
          <Button 
            onClick={validateAndSubmit}
            disabled={bookingLoading}
            className="rounded-full bg-[#1D3557] hover:bg-[#1D3557]/90 text-white px-8 py-3"
          >
            {bookingLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Bezig met boeken...
              </>
            ) : (
              <>
                Afspraak bevestigen
                <CheckCircle className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </motion.div>
    );
  };
  
  // Render the confirmation step
  const renderConfirmation = () => {
    return (
      <motion.div
        key="confirmation"
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={pageTransition}
        className="p-4 md:p-8"
      >
        <div className="bg-white rounded-2xl shadow-md overflow-hidden max-w-4xl mx-auto">
          <div className="relative bg-[#1D3557] text-white p-8 text-center">
            <div className="absolute top-0 right-0 bottom-0 left-0 opacity-10 pattern-dots-lg">
            </div>
            <div className="relative z-10">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 md:h-10 md:w-10 text-white" />
              </div>
              
              <h1 className="text-2xl md:text-3xl font-serif font-medium mb-2">
                Afspraak Bevestigd!
              </h1>
              
              <p className="text-white/80 mb-0">
                We hebben je reservering ontvangen
              </p>
            </div>
          </div>
          
          <div className="p-5 md:p-8">
            <p className="text-[#1D1D1F]/80 mb-6 text-center">
              Bedankt voor je boeking, <span className="font-medium">{customerDetails.firstName}</span>. 
              Een bevestiging is verzonden naar <span className="font-medium underline">{customerDetails.email}</span>.
            </p>
            
            <div className="bg-[#F9F5F2] rounded-xl p-5 mb-6">
              <h2 className="text-base md:text-lg font-medium mb-4 text-[#1D1D1F] text-center">Jouw Afspraakdetails</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start space-x-3">
                  <div className="mt-1 bg-[#1D3557]/10 p-2 rounded-full shrink-0">
                    <Calendar className="h-5 w-5 text-[#1D3557]" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-[#1D1D1F]/60">Datum</p>
                    <p className="font-medium text-[#1D3557]">{selectedDay?.formatted}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="mt-1 bg-[#1D3557]/10 p-2 rounded-full shrink-0">
                    <Clock className="h-5 w-5 text-[#1D3557]" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-[#1D1D1F]/60">Tijd</p>
                    <p className="font-medium text-[#1D3557]">{selectedTime} uur</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 sm:col-span-2">
                  <div className="mt-1 bg-[#1D3557]/10 p-2 rounded-full shrink-0">
                    <Scissors className="h-5 w-5 text-[#1D3557]" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-[#1D1D1F]/60 mb-1">Behandeling</p>
                    <p className="font-medium text-[#1D3557]">{selectedService?.name}</p>
                    <div className="flex items-center mt-1">
                      <p className="text-sm text-[#1D1D1F]/70">{selectedOption?.name}</p>
                      <span className="mx-2 text-[#1D1D1F]/30">•</span>
                      <p className="text-sm text-[#1D1D1F]/70">{selectedOption?.price}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 rounded-xl p-4 md:p-5 mb-6 border border-blue-100">
              <div className="flex items-center justify-center mb-3">
                <Info className="h-5 w-5 text-[#1D3557] mr-2" />
                <h3 className="text-base font-medium text-[#1D3557]">Belangrijk om te weten</h3>
              </div>
              
              <ul className="text-sm text-[#1D1D1F]/80 space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 mr-2 text-[#1D3557] mt-0.5 shrink-0" />
                  <span>De salon bevindt zich aan Adres 123, 1234 AB Stad</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 mr-2 text-[#1D3557] mt-0.5 shrink-0" />
                  <span>Aankomst graag 5 minuten voor aanvang van je afspraak</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 mr-2 text-[#1D3557] mt-0.5 shrink-0" />
                  <span>Indien je verhinderd bent, graag minimaal 24 uur van tevoren afzeggen</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-green-50 rounded-xl p-4 mb-6 border border-green-100 flex items-start md:items-center flex-col md:flex-row">
              <div className="bg-[#34D399]/20 p-2 rounded-full mr-0 md:mr-4 mb-3 md:mb-0 shrink-0 self-center md:self-auto">
                <Mail className="h-5 w-5 text-[#34D399]" />
              </div>
              <div className="text-center md:text-left">
                <p className="text-sm font-medium text-[#1D1D1F]">
                  Een bevestiging is verzonden naar {customerDetails.email}
                </p>
                <p className="text-xs text-[#1D1D1F]/70">
                  Controleer je inbox (en eventueel je spam folder)
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/" className="order-2 sm:order-1">
                <Button className="rounded-full bg-white border border-[#1D3557] text-[#1D3557] hover:bg-[#1D3557]/5 px-6 py-2.5 w-full">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Terug naar home
                </Button>
              </Link>
              
              <Button 
                className="rounded-full bg-[#1D3557] hover:bg-[#1D3557]/90 text-white px-6 py-2.5 order-1 sm:order-2 w-full"
                onClick={() => window.print()}
              >
                <Printer className="mr-2 h-4 w-4" />
                Afdrukken
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };
  
  // Render the current step
  const renderStep = () => {
    if (bookingConfirmed) {
      return renderConfirmation();
    }
    
    switch (step) {
      case 1:
        return renderServiceSelect();
      case 2:
        return renderDateTimeSelect();
      case 3:
        return renderCustomerForm();
      default:
        return renderServiceSelect();
    }
  };
  
  // Validate and submit the form
  const validateAndSubmit = () => {
    setFieldErrors({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      notes: ""
    });
      
    let isValid = true;
    const requiredFields = ["firstName", "lastName", "email", "phone"];
    
    const validateField = (field: string, value: string | undefined, message: string) => {
      if (!value || value.trim() === '') {
        setFieldErrors(prev => ({ ...prev, [field]: message }));
        isValid = false;
      }
    };

    validateField("firstName", customerDetails.firstName, "Voornaam is verplicht");
    validateField("lastName", customerDetails.lastName, "Achternaam is verplicht");
    validateField("email", customerDetails.email, "E-mail is verplicht");
    validateField("phone", customerDetails.phone, "Telefoonnummer is verplicht");
    
    if (!isValid) {
      return;
    }
      
    submitBooking();
  };
  
  if (bookingConfirmed) {
    return (
      <div className="bg-[#FDF6F1] min-h-screen">
        <div className="container max-w-4xl mx-auto px-4 py-8 md:py-16">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={pageTransition}
            className="bg-white rounded-2xl shadow-lg p-6 md:p-12"
          >
            <div className="mb-6 md:mb-8 mx-auto w-16 h-16 md:w-20 md:h-20 bg-[#B99885]/20 rounded-full flex items-center justify-center">
              <Check className="h-8 w-8 md:h-10 md:w-10 text-[#B99885]" />
            </div>
            
            <h1 className="text-2xl md:text-3xl font-serif font-medium mb-4 text-[#1D1D1F] text-center">
              Afspraak Bevestigd!
            </h1>
            
            <p className="text-base md:text-lg text-[#1D1D1F]/80 mb-6 md:mb-10 text-center">
              Bedankt voor je reservering, <span className="font-medium">{customerDetails.firstName}</span>. We hebben je afspraak ontvangen en kijken ernaar uit je binnenkort te verwelkomen bij NFB Salon.
            </p>
            
            <div className="bg-[#F9F5F2] rounded-xl p-5 md:p-6 mb-6 md:mb-10">
              <h2 className="text-lg md:text-xl font-medium mb-5 text-[#1D1D1F] text-center">Jouw Afspraakdetails</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start space-x-3">
                  <div className="mt-1 bg-[#B99885]/10 p-2 rounded-full shrink-0">
                    <Calendar className="h-5 w-5 text-[#B99885]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#1D1D1F]/60 mb-1">Datum</p>
                    <p className="font-medium text-[#1D3557]">{selectedDay?.formatted}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="mt-1 bg-[#B99885]/10 p-2 rounded-full shrink-0">
                    <Clock className="h-5 w-5 text-[#B99885]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#1D1D1F]/60 mb-1">Tijd</p>
                    <p className="font-medium text-[#1D3557]">{selectedTime} uur</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="mt-1 bg-[#B99885]/10 p-2 rounded-full shrink-0">
                    <Scissors className="h-5 w-5 text-[#B99885]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#1D1D1F]/60 mb-1">Behandeling</p>
                    <p className="font-medium text-[#1D3557]">{selectedService?.name}</p>
                    <p className="text-sm text-[#1D1D1F]/70 mt-1">{selectedOption?.name}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border-t border-[#B99885]/20 mt-5 pt-5">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <Info className="h-5 w-5 text-[#B99885]" />
                <h3 className="text-base md:text-lg font-medium text-[#1D1D1F]">Belangrijk om te weten</h3>
              </div>
              
              <ul className="text-left list-none text-sm text-[#1D1D1F]/80 space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 mr-2 text-[#B99885] mt-0.5 shrink-0" />
                  <span>24 uur voor je afspraak kun je deze kosteloos annuleren</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 mr-2 text-[#B99885] mt-0.5 shrink-0" />
                  <span>Je ontvangt een bevestiging per e-mail na het voltooien van de boeking</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 mr-2 text-[#B99885] mt-0.5 shrink-0" />
                  <span>Neem bij vragen contact op via telefoon of e-mail</span>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FDF6F1] min-h-screen">
      <div className="container max-w-5xl mx-auto px-4 py-16">
        <div className="text-center mb-4">
          <h1 className="text-3xl md:text-4xl font-serif font-medium text-[#1D1D1F]">
            Plan Uw <span className="text-[#CFAF9D]">Afspraak</span>
          </h1>
          <p className="text-lg text-[#1D1D1F]/70 mt-3 max-w-2xl mx-auto">
            Kies een service, selecteer een datum en tijd, en vul je gegevens in om je afspraak te bevestigen.
          </p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <AnimatePresence mode="wait">
            {renderStep()}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
} 