import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight } from "lucide-react";

// Define form validation schema with Zod
const formSchema = z.object({
  firstName: z.string().min(2, { message: "Voornaam moet minimaal 2 tekens bevatten" }),
  lastName: z.string().min(2, { message: "Achternaam moet minimaal 2 tekens bevatten" }),
  email: z.string().email({ message: "Voer een geldig e-mailadres in" }),
  phone: z.string().min(10, { message: "Voer een geldig telefoonnummer in" }),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface BookingFormProps {
  onSubmit: (data: FormData) => void;
}

export const BookingForm = ({ onSubmit }: BookingFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      notes: "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-[#F9F5F2] rounded-xl shadow-md p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="space-y-2">
          <label htmlFor="firstName" className="block text-sm font-medium text-[#1D1D1F]/80">
            Voornaam <span className="text-[#B99885]">*</span>
          </label>
          <Input
            id="firstName"
            {...register("firstName")}
            placeholder="Voornaam"
            className={`rounded-lg shadow-md ${errors.firstName ? "border-red-500" : "border-[#B99885]/20"}`}
          />
          {errors.firstName && (
            <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <label htmlFor="lastName" className="block text-sm font-medium text-[#1D1D1F]/80">
            Achternaam <span className="text-[#B99885]">*</span>
          </label>
          <Input
            id="lastName"
            {...register("lastName")}
            placeholder="Achternaam"
            className={`rounded-lg shadow-md ${errors.lastName ? "border-red-500" : "border-[#B99885]/20"}`}
          />
          {errors.lastName && (
            <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-[#1D1D1F]/80">
            E-mail <span className="text-[#B99885]">*</span>
          </label>
          <Input
            id="email"
            type="email"
            {...register("email")}
            placeholder="E-mail"
            className={`rounded-lg shadow-md ${errors.email ? "border-red-500" : "border-[#B99885]/20"}`}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <label htmlFor="phone" className="block text-sm font-medium text-[#1D1D1F]/80">
            Telefoonnummer <span className="text-[#B99885]">*</span>
          </label>
          <Input
            id="phone"
            type="tel"
            {...register("phone")}
            placeholder="Telefoonnummer"
            className={`rounded-lg shadow-md ${errors.phone ? "border-red-500" : "border-[#B99885]/20"}`}
          />
          {errors.phone && (
            <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
          )}
        </div>
      </div>
      
      <div className="space-y-2 mb-6">
        <label htmlFor="notes" className="block text-sm font-medium text-[#1D1D1F]/80">
          Opmerkingen (optioneel)
        </label>
        <Textarea
          id="notes"
          {...register("notes")}
          placeholder="Bijv. speciale wensen of aandachtspunten..."
          className={`rounded-lg shadow-md min-h-[100px] ${errors.notes ? "border-red-500" : "border-[#B99885]/20"}`}
        />
        {errors.notes && (
          <p className="text-red-500 text-xs mt-1">{errors.notes.message}</p>
        )}
      </div>
      
      <motion.div
        className="flex items-center justify-end gap-4 mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Button
          type="submit"
          className="rounded-full bg-[#B99885] hover:bg-[#A98775] text-white px-8 flex items-center gap-2"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Een moment..." : "Naar overzicht"}
          <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </motion.div>
    </form>
  );
}; 