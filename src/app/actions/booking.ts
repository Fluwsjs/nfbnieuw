'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';

// Define the validation schema for the booking form
const BookingFormSchema = z.object({
  service: z.string().min(1, 'Selecteer een service'),
  treatment: z.string().min(1, 'Selecteer een behandeling'),
  date: z.string().min(1, 'Selecteer een datum'),
  time: z.string().min(1, 'Selecteer een tijd'),
  price: z.number().min(1, 'Prijs is vereist'),
  duration: z.number().min(1, 'Duur is vereist'),
  firstName: z.string().min(2, 'Voornaam moet minimaal 2 tekens zijn'),
  lastName: z.string().min(2, 'Achternaam moet minimaal 2 tekens zijn'),
  email: z.string().email('Ongeldig e-mailadres'),
  phone: z.string().min(10, 'Telefoonnummer moet minimaal 10 cijfers zijn'),
  notes: z.string().optional(),
});

type BookingFormData = z.infer<typeof BookingFormSchema>;

/**
 * Server action to submit the booking form
 */
export async function submitBookingForm(formData: BookingFormData) {
  // Validate form data
  const validationResult = BookingFormSchema.safeParse(formData);
  
  if (!validationResult.success) {
    // Return validation errors
    return {
      success: false,
      errors: validationResult.error.format(),
    };
  }
  
  try {
    // Prepare data for API call
    const apiData = {
      service: formData.service,
      treatment: formData.treatment,
      date: formData.date,
      time: formData.time,
      price: formData.price,
      duration: formData.duration,
      customer: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        notes: formData.notes,
      },
    };
    
    // For debugging
    console.log('Submitting booking data:', JSON.stringify(apiData));
    
    // Call the bookings API - use relative URL to avoid issues with NEXT_PUBLIC_SITE_URL
    const response = await fetch(`/api/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(apiData),
    });
    
    // For debugging
    console.log('API response status:', response.status);
    
    // Parse the response
    let result;
    try {
      result = await response.json();
      console.log('API response data:', result);
    } catch (error) {
      console.error('Error parsing API response:', error);
      console.log('Response text:', await response.text());
      return {
        success: false,
        message: 'Er is een fout opgetreden bij het verwerken van de server response',
      };
    }
    
    if (!response.ok) {
      return {
        success: false,
        message: result.error || 'Er is een fout opgetreden bij het maken van de afspraak',
      };
    }
    
    // Success!
    revalidatePath('/afspraak');
    
    return {
      success: true,
      bookingId: result.booking.id,
      service: result.booking.service,
      treatment: result.booking.treatment,
      date: result.booking.date,
      time: result.booking.time,
    };
  } catch (error) {
    console.error('Error submitting booking:', error);
    
    return {
      success: false,
      message: 'Er is een onverwachte fout opgetreden. Probeer het later opnieuw of neem contact op.',
    };
  }
}

/**
 * Server action to check if a time slot is available
 */
export async function checkTimeSlotAvailability(date: string, time: string) {
  try {
    // Call the bookings API
    const response = await fetch(
      `/api/bookings?date=${date}`,
      { method: 'GET' }
    );
    
    // Parse the response
    const result = await response.json();
    
    if (!response.ok) {
      return {
        success: false,
        message: result.error || 'Er is een fout opgetreden bij het checken van de beschikbaarheid',
      };
    }
    
    // Check if the time slot is available
    const isAvailable = !result.bookedTimeSlots.includes(time);
    
    return {
      success: true,
      available: isAvailable,
    };
  } catch (error) {
    console.error('Error checking time slot availability:', error);
    
    return {
      success: false,
      message: 'Er is een onverwachte fout opgetreden bij het checken van de beschikbaarheid',
    };
  }
} 