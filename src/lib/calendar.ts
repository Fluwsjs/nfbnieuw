import { google } from 'googleapis';
import { Booking } from './db';
import { formatDuration } from './utils';
import { DateTime } from 'luxon';

// Setup Google Calendar client
const setupCalendarClient = () => {
  // During development, if no credentials are available, use a mock
  if (!process.env.GOOGLE_CALENDAR_CREDENTIALS) {
    console.log('No Google Calendar credentials found');
    return null;
  }

  try {
    // Get service account credentials from base64-encoded env variable
    const credentials = JSON.parse(
      Buffer.from(process.env.GOOGLE_CALENDAR_CREDENTIALS, 'base64').toString()
    );

    // Create JWT auth client
    const auth = new google.auth.JWT({
      email: credentials.client_email,
      key: credentials.private_key,
      scopes: ['https://www.googleapis.com/auth/calendar'],
    });

    // Create and return the calendar client
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

export interface BookingData {
  id: string;
  service: string;
  treatment: string;
  customer: string;
  email: string;
  phone: string;
  notes?: string;
  date: string;
  time: string;
  duration: string;
  price: string;
}

export async function addBookingToCalendar(booking: BookingData) {
  console.log('Starting Google Calendar integration...');
  
  try {
    const calendarId = process.env.GOOGLE_CALENDAR_ID;
    const credentials = process.env.GOOGLE_CALENDAR_CREDENTIALS;
    
    if (!calendarId || !credentials) {
      console.error('Missing Google Calendar credentials or calendar ID');
      console.log(`Calendar ID exists: ${!!calendarId}, Credentials exist: ${!!credentials}`);
      // Maak er een waarschuwing van in plaats van een fout, zodat het boekproces kan doorgaan
      return {
        success: false,
        message: 'Google Calendar configuration is missing'
      };
    }
    
    console.log('Decoding base64 credentials and parsing JSON...');
    // Decode en parse de credentials
    const decodedCredentials = Buffer.from(credentials, 'base64').toString('utf-8');
    const parsedCredentials = JSON.parse(decodedCredentials);
    
    // Create a JWT auth client
    console.log('Creating JWT auth client with client email:', parsedCredentials.client_email);
    const jwtClient = new google.auth.JWT(
      parsedCredentials.client_email,
      undefined,
      parsedCredentials.private_key,
      ['https://www.googleapis.com/auth/calendar']
    );
    
    // Authenticate
    console.log('Authenticating with Google...');
    await jwtClient.authorize();
    
    // Create calendar client
    const calendar = google.calendar({ version: 'v3', auth: jwtClient });
    
    // Format datetimes
    const dateString = booking.date; // YYYY-MM-DD format
    const timeString = booking.time; // HH:MM format
    
    // Parse the duration string
    const durationMinutes = parseInt(booking.duration.replace(/\D/g, '')) || 60;
    
    // Create start and end time
    console.log(`Creating start time using date: ${dateString} and time: ${timeString}`);
    
    const startTime = new Date(`${dateString}T${timeString}:00`);
    console.log(`Start time (local): ${startTime.toString()}`);
    
    const endTime = new Date(startTime.getTime() + durationMinutes * 60000);
    console.log(`End time (local): ${endTime.toString()}`);
    
    // Format for Google Calendar ISO 8601 format
    const startTimeISO = startTime.toISOString();
    const endTimeISO = endTime.toISOString();
    
    console.log(`Start time (ISO): ${startTimeISO}`);
    console.log(`End time (ISO): ${endTimeISO}`);
    
    // Create event
    const event = {
      summary: `${booking.service} - ${booking.treatment}`,
      description: `Klant: ${booking.customer}\nTel: ${booking.phone}\nEmail: ${booking.email}\n${booking.notes ? `Opmerkingen: ${booking.notes}` : ''}`,
      start: {
        dateTime: startTimeISO,
        timeZone: 'Europe/Amsterdam',
      },
      end: {
        dateTime: endTimeISO,
        timeZone: 'Europe/Amsterdam',
      },
      colorId: '4', // Color for appointment type
    };
    
    console.log('Creating calendar event with data:', JSON.stringify(event, null, 2));
    
    // Insert the event
    const response = await calendar.events.insert({
      calendarId: calendarId,
      requestBody: event,
    });
    
    console.log('Calendar event created successfully:', response.data.id);
    
    return {
      success: true,
      id: response.data.id,
      htmlLink: response.data.htmlLink
    };
  } catch (error: any) {
    console.error('Error adding to Google Calendar:', error);
    // Maak er een waarschuwing van in plaats van een fout, zodat het boekproces kan doorgaan
    return {
      success: false,
      message: `Failed to add to Google Calendar: ${error.message}`
    };
  }
}

/**
 * Add a booking to Google Calendar
 */
export async function addToGoogleCalendar(booking: Booking): Promise<{ success: boolean; message?: string; eventId?: string }> {
  try {
    console.log('=== START CALENDAR INTEGRATION ===');
    const calendar = setupCalendarClient();
    
    // If calendar client couldn't be created, still allow the booking process to continue
    if (!calendar) {
      console.log('Unable to access Google Calendar, continuing with booking but no calendar event created.');
      return { success: false, message: 'Calendar client not configured. Booking saved but no calendar event created.' };
    }

    const calendarId = process.env.GOOGLE_CALENDAR_ID || 'nfbsalonboekingen@gmail.com';
    console.log('Using Calendar ID:', calendarId);
    
    // Parse booking date and time with Luxon
    console.log('Raw booking date/time:', booking.date, booking.time);
    
    // Veilige datumverwerking met Luxon
    const dateString = `${booking.date}T${booking.time}`;
    console.log('Date string voor parsing:', dateString);
    
    const startTime = DateTime.fromISO(dateString, { zone: 'Europe/Amsterdam' });
    
    if (!startTime.isValid) {
      console.error('Ongeldige datum/tijd:', startTime.invalidExplanation);
      return { success: false, message: `Ongeldige datum/tijd: ${startTime.invalidExplanation}` };
    }
    
    console.log('Parsed start time:', startTime.toISO());
    
    // Create end time (start time + duration)
    console.log('Duration value before parsing:', booking.duration, typeof booking.duration);
    
    // Zorg dat duration een getal is
    let durationMinutes = 0;
    if (typeof booking.duration === 'number') {
      durationMinutes = booking.duration;
    } else {
      // Zeker weten dat we met een string werken
      const durationString = String(booking.duration);
      // Haal alleen het getal uit de string (verwijder 'min' of andere tekst)
      const durationMatch = durationString.match(/(\d+)/);
      if (durationMatch && durationMatch[1]) {
        durationMinutes = parseInt(durationMatch[1], 10);
      }
    }
    
    console.log('Parsed duration minutes:', durationMinutes);
    const endTime = startTime.plus({ minutes: durationMinutes });
    console.log('Calculated end time:', endTime.toISO());
    
    // Format price safely
    const formattedPrice = formatPrice(booking.price);
    
    // Log for debugging
    console.log('Adding to calendar:', {
      service: booking.service,
      treatment: booking.treatment,
      customer: `${booking.customer.firstName} ${booking.customer.lastName}`,
      date: booking.date,
      time: booking.time,
      price: formattedPrice,
      calendarId
    });
    
    // Create event
    const event = {
      summary: `${booking.service} - ${booking.treatment}`,
      description: `
        Klant: ${booking.customer.firstName} ${booking.customer.lastName}
        Email: ${booking.customer.email}
        Telefoon: ${booking.customer.phone}
        ${booking.customer.notes ? `Opmerkingen: ${booking.customer.notes}` : ''}
        
        Behandeling: ${booking.treatment}
        Duur: ${formatDuration(booking.duration)}
        Prijs: ${formattedPrice}
        
        Boeking ID: ${booking.id}
      `,
      start: {
        dateTime: startTime.toISO(),
        timeZone: 'Europe/Amsterdam',
      },
      end: {
        dateTime: endTime.toISO(),
        timeZone: 'Europe/Amsterdam',
      },
      colorId: '1', // Adjust as needed (different colors have different IDs)
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 }, // 1 day before
          { method: 'popup', minutes: 60 }, // 1 hour before
        ],
      },
    };
    
    console.log('Event object:', JSON.stringify(event, null, 2));
    
    try {
      // Insert event into calendar
      console.log('Invoegen event in kalender...');
      const response = await calendar.events.insert({
        calendarId,
        requestBody: event,
      });
      
      console.log('Calendar event created successfully:', response.data.htmlLink);
      console.log('Event ID:', response.data.id);
      console.log('=== END CALENDAR INTEGRATION ===');
      
      return { 
        success: true, 
        eventId: response.data.id || undefined,
      };
    } catch (insertError) {
      console.error('Failed to insert event into calendar:', insertError);
      console.log('=== END CALENDAR INTEGRATION WITH ERROR ===');
      
      // Allow booking to continue even if calendar fails
      return { 
        success: false, 
        message: `Booking saved but calendar event failed: ${insertError instanceof Error ? insertError.message : 'Unknown error'}`
      };
    }
  } catch (error) {
    console.error('Failed to add booking to Google Calendar:', error);
    console.log('=== END CALENDAR INTEGRATION WITH ERROR ===');
    
    // Don't prevent booking from completing when calendar fails
    return { 
      success: false, 
      message: `Booking processed but calendar event creation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
} 