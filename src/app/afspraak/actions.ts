'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// Define a schema for booking validation
const bookingSchema = z.object({
  firstName: z.string().min(2, 'Voornaam moet minimaal 2 karakters bevatten'),
  lastName: z.string().min(1, 'Achternaam is verplicht'),
  email: z.string().email('Voer een geldig e-mailadres in'),
  phone: z.string().min(10, 'Voer een geldig telefoonnummer in'),
  serviceName: z.string().min(1, 'Selecteer een service'),
  serviceOption: z.string().min(1, 'Selecteer een behandeling'),
  date: z.string().min(1, 'Selecteer een datum'),
  time: z.string().min(1, 'Selecteer een tijd'),
  duration: z.number().min(1, 'Duur is vereist'),
  price: z.number().min(1, 'Prijs is vereist'),
  notes: z.string().optional(),
});

// Define the input type based on the schema
type BookingFormInputs = z.infer<typeof bookingSchema>;

/**
 * Server action to handle form submission
 */
export async function createBooking(formData: FormData) {
  // Extract data from form
  const rawData = {
    firstName: formData.get('firstName'),
    lastName: formData.get('lastName'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    serviceName: formData.get('serviceName'),
    serviceOption: formData.get('serviceOption'),
    date: formData.get('date'),
    time: formData.get('time'),
    duration: Number(formData.get('duration')),
    price: Number(formData.get('price')),
    notes: formData.get('notes') || '',
  };

  // Validate form data
  const validationResult = bookingSchema.safeParse(rawData);

  if (!validationResult.success) {
    // Return validation errors
    return {
      success: false,
      errors: validationResult.error.flatten().fieldErrors,
    };
  }

  try {
    // Make API call to the internal booking endpoint
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || ''}/api/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(validationResult.data),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: result.error || 'Er is een fout opgetreden bij het maken van de afspraak.',
      };
    }

    // Revalidate the bookings page to show updated data
    revalidatePath('/afspraak');

    // Return success response with booking ID
    return {
      success: true,
      bookingId: result.bookingId,
      message: 'Afspraak succesvol gemaakt!',
    };
  } catch (error) {
    console.error('Error creating booking:', error);
    return {
      success: false,
      message: 'Er is een fout opgetreden bij het maken van de afspraak. Probeer het later opnieuw.',
    };
  }
}

/**
 * Server action to check available time slots for a specific date
 */
export async function getAvailableTimeSlots(date: string) {
  try {
    // Make API call to the internal booking endpoint
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || ''}/api/bookings?date=${encodeURIComponent(date)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: result.error || 'Er is een fout opgetreden bij het ophalen van beschikbare tijdsloten.',
        appointments: [],
      };
    }

    // Return available time slots
    return {
      success: true,
      appointments: result.appointments || [],
    };
  } catch (error) {
    console.error('Error fetching available time slots:', error);
    return {
      success: false,
      message: 'Er is een fout opgetreden bij het ophalen van beschikbare tijdsloten.',
      appointments: [],
    };
  }
} 