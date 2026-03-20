import type { Booking } from '../types/booking';
import { sendReminderEmail } from './email';

// Function to check if a booking needs a reminder
export function shouldSendReminder(booking: Booking): boolean {
  const now = new Date();
  const appointmentTime = new Date(booking.date);
  const hoursUntilAppointment = (appointmentTime.getTime() - now.getTime()) / (1000 * 60 * 60);
  
  // Stuur reminder tussen 24 en 25 uur voor de afspraak
  return hoursUntilAppointment >= 24 && hoursUntilAppointment <= 25;
}

// Function to process reminders for a list of bookings
export async function processReminders(bookings: Booking[]): Promise<void> {
  for (const booking of bookings) {
    try {
      if (shouldSendReminder(booking)) {
        const success = await sendReminderEmail(booking);
        if (!success) {
          // Log error to monitoring system
          throw new Error(`Failed to send reminder for booking ${booking.id}`);
        }
      }
    } catch (error: unknown) {
      // Log error to monitoring system
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Error processing reminder for booking ${booking.id}: ${errorMessage}`);
    }
  }
} 