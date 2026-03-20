import { google } from 'googleapis';
import { Booking } from './db';
import { formatDuration } from './utils';

// Setup Google Calendar client
const setupCalendarClient = () => {
  console.log('Setting up Google Calendar client...');
  
  // During development, if no credentials are available, use a mock
  if (!process.env.GOOGLE_CALENDAR_CREDENTIALS) {
    console.log('No Google Calendar credentials found');
    return null;
  }

  try {
    // Get service account credentials from base64-encoded env variable
    console.log('Parsing Google Calendar credentials...');
    const credentials = JSON.parse(
      Buffer.from(process.env.GOOGLE_CALENDAR_CREDENTIALS, 'base64').toString()
    );
    
    console.log('Credentials parsed successfully. Client email:', credentials.client_email);

    // Create JWT auth client
    console.log('Creating JWT auth client...');
    const auth = new google.auth.JWT({
      email: credentials.client_email,
      key: credentials.private_key,
      scopes: ['https://www.googleapis.com/auth/calendar'],
    });

    // Create and return the calendar client
    console.log('Creating calendar client...');
    return google.calendar({ version: 'v3', auth });
  } catch (error) {
    console.error('Failed to setup Google Calendar client:', error);
    return null;
  }
};

// Helper function to format price that handles both string and number types
const formatPrice = (price: string | number): string => {
  // If price is already a string (e.g., "€52")
  if (typeof price === 'string') {
    // Check if it starts with a currency symbol
    if (price.startsWith('€')) {
      return price; // Return as is
    }
    // If it's a numeric string, format it
    if (!isNaN(parseFloat(price))) {
      return `€${parseFloat(price).toFixed(2)}`;
    }
    return price; // Return as is if it's not a parseable number
  }

  // If price is a number
  if (typeof price === 'number') {
    return `€${price.toFixed(2)}`;
  }

  // Fallback
  return `€${price}`;
};

/**
 * Add a booking to Google Calendar
 */
export async function addToGoogleCalendar(booking: Booking): Promise<{ success: boolean; message?: string; eventId?: string }> {
  console.log('=====================================================');
  console.log('STARTING GOOGLE CALENDAR INTEGRATION');
  console.log('=====================================================');
  console.log('Received booking:', JSON.stringify(booking, null, 2));
  
  try {
    console.log('Setting up calendar client...');
    const calendar = setupCalendarClient();

    // If calendar client couldn't be created, still allow the booking process to continue
    if (!calendar) {
      console.log('Unable to access Google Calendar, continuing with booking but no calendar event created.');
      return { success: false, message: 'Calendar client not configured. Booking saved but no calendar event created.' };
    }

    console.log('Getting calendar ID...');
    const calendarId = process.env.GOOGLE_CALENDAR_ID || 'nfbsalonboekingen@gmail.com';
    console.log('Using calendar ID:', calendarId);
    
    if (!calendarId) {
      console.warn('GOOGLE_CALENDAR_ID not set, defaulting to nfbsalonboekingen@gmail.com');
      return { success: false, message: `Calendar ID not configured. Using default ${calendarId} but event creation skipped.` };
    }

    try {
      if (!booking.date || !booking.time) {
        throw new Error("Datum of tijd ontbreekt");
      }
      
      // Direct gebruik van RFC3339 strings zonder Date objecten
      // YYYY-MM-DDTHH:MM:SS+02:00 formaat zonder toISOString()
      
      // Valideer datum en tijd
      console.log("Datum:", booking.date);
      console.log("Tijd:", booking.time);
      
      if (!/^\d{4}-\d{2}-\d{2}$/.test(booking.date)) {
        throw new Error(`Ongeldige datumformaat: ${booking.date}`);
      }
      
      if (!/^\d{1,2}:\d{2}$/.test(booking.time)) {
        throw new Error(`Ongeldige tijdformaat: ${booking.time}`);
      }
      
      // Normaliseer tijd naar 24h formaat met 2 digits
      const [hours, minutes] = booking.time.split(':').map(num => parseInt(num, 10));
      const normalizedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      console.log("Genormaliseerde tijd:", normalizedTime);
      
      // Bouw start RFC3339 string rechtstreeks
      const startRFC3339 = `${booking.date}T${normalizedTime}:00+02:00`;
      console.log("Start RFC3339:", startRFC3339);
      
      // Bepaal duur in minuten
      let durationMinutes = 60; // standaard 60 minuten
      if (typeof booking.duration === "number") {
        durationMinutes = booking.duration;
      } else if (typeof booking.duration === "string") {
        const parsed = parseInt(booking.duration, 10);
        if (!isNaN(parsed)) {
          durationMinutes = parsed;
        }
      }
      console.log("Duur in minuten:", durationMinutes);
      
      // Bereken eindtijd door tijdcomponenten direct te manipuleren
      // zonder te vertrouwen op Date objecten
      let endHour = hours;
      let endMinute = minutes;
      let endDay = parseInt(booking.date.split('-')[2], 10);
      let endMonth = parseInt(booking.date.split('-')[1], 10);
      let endYear = parseInt(booking.date.split('-')[0], 10);
      
      // Voeg minuten toe
      endMinute += durationMinutes;
      
      // Verwerk overflow van minuten
      if (endMinute >= 60) {
        endHour += Math.floor(endMinute / 60);
        endMinute = endMinute % 60;
      }
      
      // Verwerk overflow van uren
      if (endHour >= 24) {
        endDay += Math.floor(endHour / 24);
        endHour = endHour % 24;
      }
      
      // Zeer eenvoudige maandafhandeling (versimpeld, voldoende voor de meeste gevallen)
      const daysInMonth = new Date(endYear, endMonth, 0).getDate();
      if (endDay > daysInMonth) {
        endMonth++;
        endDay -= daysInMonth;
        
        if (endMonth > 12) {
          endYear++;
          endMonth = 1;
        }
      }
      
      // Formatteer eindtijd componenten met voorloopnullen
      const formattedEndHour = endHour.toString().padStart(2, '0');
      const formattedEndMinute = endMinute.toString().padStart(2, '0');
      const formattedEndDay = endDay.toString().padStart(2, '0');
      const formattedEndMonth = endMonth.toString().padStart(2, '0');
      
      // Bouw eind RFC3339 string rechtstreeks
      const endRFC3339 = `${endYear}-${formattedEndMonth}-${formattedEndDay}T${formattedEndHour}:${formattedEndMinute}:00+02:00`;
      console.log("Eind RFC3339:", endRFC3339);
      
      // Format price safely
      console.log('Formatting price:', booking.price);
      const formattedPrice = formatPrice(booking.price);
      console.log('Formatted price:', formattedPrice);
      
      // Create event
      console.log('Creating calendar event object...');
      const bookingId = '_id' in booking ? String(booking._id) : ('id' in booking ? booking.id : 'Geen ID');
      
      // Maak direct het event object aan met RFC3339 strings
      const event = {
        summary: `${booking.service} - ${booking.treatment}`,
        description: `
          Klant: ${booking.customer.firstName} ${booking.customer.lastName}
          Email: ${booking.customer.email}
          Telefoon: ${booking.customer.phone}
          ${booking.customer.notes ? `Opmerkingen: ${booking.customer.notes}` : ''}

          Behandeling: ${booking.treatment}
          Duur: ${formatDuration(durationMinutes)}
          Prijs: ${formattedPrice}

          Boeking ID: ${bookingId}
        `,
        start: {
          dateTime: startRFC3339,  // Gebruik direct de RFC3339 string
          timeZone: 'Europe/Amsterdam',
        },
        end: {
          dateTime: endRFC3339,  // Gebruik direct de RFC3339 string
          timeZone: 'Europe/Amsterdam',
        },
        colorId: '1',
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: 24 * 60 },
            { method: 'popup', minutes: 60 },
          ],
        },
      };
      
      // Insert event into calendar
      console.log('Inserting event into calendar...');
      console.log('Calendar ID:', calendarId);
      console.log('Event summary:', event.summary);
      console.log('Event start time:', event.start.dateTime);
      console.log('Event end time:', event.end.dateTime);
      
      try {
        const response = await calendar.events.insert({
          calendarId,
          requestBody: event,
        });
        
        console.log('Calendar event created successfully:', response.data.htmlLink);
        console.log('Event ID:', response.data.id);
        
        return {
          success: true,
          message: 'Calendar event created successfully',
          eventId: response.data.id || undefined,
        };
      } catch (insertError) {
        console.error('Failed to insert event into calendar:', insertError);
        console.error('Error details:', JSON.stringify(insertError, null, 2));
        
        return {
          success: false,
          message: `Booking saved but calendar event failed: ${insertError instanceof Error ? insertError.message : 'Unknown error'}`
        };
      }
    } catch (dateError) {
      console.error('Date/time processing error:', dateError);
      return {
        success: false,
        message: `Invalid date or time format: ${dateError instanceof Error ? dateError.message : 'Unknown error'}`
      };
    }
  } catch (error) {
    console.error('Failed to add booking to Google Calendar:', error);

    // Don't prevent booking from completing when calendar fails
    return {
      success: false,
      message: `Booking processed but calendar event creation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  } finally {
    console.log('=====================================================');
    console.log('COMPLETED GOOGLE CALENDAR INTEGRATION');
    console.log('=====================================================');
  }
} 