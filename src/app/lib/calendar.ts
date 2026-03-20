import { google, calendar_v3 } from 'googleapis';
import { mockAddToCalendar } from './mock-calendar';
import { formatDate, formatTime } from './utils';

// Types for calendar operations
interface TimeSlot {
  start: string;
  end: string;
}

interface BookingData {
  service: string;
  option: string;
  date: string;
  time: string;
  duration: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  notes?: string;
}

interface CalendarEvent {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  serviceName: string;
  serviceOption: string;
  date: string;
  time: string;
  duration: string;
  notes?: string;
}

// Interface for appointment calendar data
interface CalendarAppointment {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  serviceName: string;
  serviceOption: string;
  date: string;
  time: string;
  duration: number;
  notes: string;
}

// Google Calendar auth setup
const getCalendarAuth = () => {
  // If in development or no credentials, return null (will be mocked in development)
  if (process.env.NODE_ENV !== 'production' || !process.env.GOOGLE_CREDENTIALS) {
    return null;
  }

  try {
    const credentials = JSON.parse(
      Buffer.from(process.env.GOOGLE_CREDENTIALS, 'base64').toString()
    );

    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/calendar'],
    });

    return auth;
  } catch (error) {
    console.error('Error setting up Google Calendar auth:', error);
    return null;
  }
};

/**
 * Configure the Google Calendar API client
 */
const configureCalendarClient = () => {
  const oAuth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );

  // Set credentials
  oAuth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN
  });

  return google.calendar({ version: 'v3', auth: oAuth2Client });
};

/**
 * Check availability for a specific date
 * @param date - The date to check in ISO format
 * @returns List of available time slots
 */
export const checkAvailability = async (date: string): Promise<TimeSlot[]> => {
  try {
    const calendar = configureCalendarClient();
    const calendarId = process.env.GOOGLE_CALENDAR_ID;
    
    if (!calendarId) {
      throw new Error('Google Calendar ID is not configured');
    }

    // Get the start and end of the day
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    // Get existing events
    const response = await calendar.events.list({
      calendarId,
      timeMin: startDate.toISOString(),
      timeMax: endDate.toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
    });

    const events = response.data.items || [];
    
    // Calculate available time slots based on salon hours and existing bookings
    // This is a simplified version - in production, you'd need to consider operating hours, 
    // treatment durations, etc.
    
    // For now, we'll return a placeholder response
    return [
      { start: '09:00', end: '10:00' },
      { start: '10:00', end: '11:00' },
      { start: '11:00', end: '12:00' },
      { start: '13:00', end: '14:00' },
      { start: '14:00', end: '15:00' },
      { start: '15:00', end: '16:00' },
      { start: '16:00', end: '17:00' },
    ];
  } catch (error) {
    console.error('Error checking availability:', error);
    throw error;
  }
};

/**
 * Create a new booking in Google Calendar
 * @param bookingData - The details of the booking
 * @returns The created event ID
 */
export const createBooking = async (bookingData: BookingData): Promise<string> => {
  try {
    const calendar = configureCalendarClient();
    const calendarId = process.env.GOOGLE_CALENDAR_ID;
    
    if (!calendarId) {
      throw new Error('Google Calendar ID is not configured');
    }

    // Parse the date and time
    const startDateTime = new Date(`${bookingData.date}T${bookingData.time}`);
    
    // Add duration in minutes to start time
    const durationMinutes = parseInt(bookingData.duration.split(' ')[0]);
    const endDateTime = new Date(startDateTime.getTime() + durationMinutes * 60000);

    // Create event
    const event = {
      summary: `${bookingData.service} - ${bookingData.option}`,
      description: `
        Klant: ${bookingData.customerName}
        Email: ${bookingData.customerEmail}
        Telefoon: ${bookingData.customerPhone}
        ${bookingData.notes ? `Opmerkingen: ${bookingData.notes}` : ''}
      `,
      start: {
        dateTime: startDateTime.toISOString(),
        timeZone: 'Europe/Amsterdam',
      },
      end: {
        dateTime: endDateTime.toISOString(),
        timeZone: 'Europe/Amsterdam',
      },
      attendees: [
        { email: bookingData.customerEmail },
      ],
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 }, // 24 hours before
          { method: 'popup', minutes: 30 }, // 30 minutes before
        ],
      },
    };

    const response = await calendar.events.insert({
      calendarId,
      requestBody: event,
    });

    return response.data.id || '';
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
};

/**
 * Adds an appointment to Google Calendar
 */
export async function addToCalendar(appointment: CalendarAppointment): Promise<string | null> {
  // Get authentication
  const auth = getCalendarAuth();
  
  // If no auth (development or error), mock the addition
  if (!auth) {
    console.log('Development mode: Mocking calendar addition for', appointment);
    return `mock-event-id-${Date.now()}`;
  }
  
  try {
    // Create Google Calendar client
    const calendar = google.calendar({ version: 'v3', auth });
    
    // Parse date and time to create start and end timestamps
    const [year, month, day] = appointment.date.split('-').map(Number);
    const [hours, minutes] = appointment.time.split(':').map(Number);
    
    const startDateTime = new Date(year, month - 1, day, hours, minutes);
    const endDateTime = new Date(startDateTime.getTime() + appointment.duration * 60000);
    
    // Format the dates for Google Calendar
    const start = {
      dateTime: startDateTime.toISOString(),
      timeZone: 'Europe/Amsterdam',
    };
    
    const end = {
      dateTime: endDateTime.toISOString(),
      timeZone: 'Europe/Amsterdam',
    };
    
    // Create event details
    const formattedDate = formatDate(appointment.date);
    const formattedTime = formatTime(appointment.time);
    
    const event: calendar_v3.Schema$Event = {
      summary: `${appointment.serviceOption} - ${appointment.customerName}`,
      description: `
Service: ${appointment.serviceName}
Treatment: ${appointment.serviceOption}
Customer: ${appointment.customerName}
Email: ${appointment.customerEmail}
Phone: ${appointment.customerPhone}
${appointment.notes ? `Notes: ${appointment.notes}` : ''}

This appointment was created automatically by NFB Salon booking system.
      `.trim(),
      start,
      end,
      colorId: '4', // Default to a purple/mauve color
      attendees: [
        { email: appointment.customerEmail, displayName: appointment.customerName }
      ],
      // Optional reminder settings
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 60 * 24 }, // 1 day before
          { method: 'popup', minutes: 60 * 2 }   // 2 hours before
        ]
      }
    };
    
    // Insert the event
    const calendarId = process.env.GOOGLE_CALENDAR_ID || 'primary';
    const response = await calendar.events.insert({
      calendarId,
      requestBody: event,
      sendUpdates: 'all', // Send updates to attendees
    });
    
    console.log('Event created:', response.data.htmlLink);
    return response.data.id || null;
  } catch (error) {
    console.error('Error adding event to Google Calendar:', error);
    throw new Error('Failed to add appointment to calendar');
  }
}

/**
 * Retrieves occupied time slots from the calendar for a specific date
 * Used to check availability when booking
 */
export async function getOccupiedTimeSlots(date: string): Promise<Array<{ start: string; end: string }>> {
  // Get authentication
  const auth = getCalendarAuth();
  
  // If no auth (development or error), return an empty array
  if (!auth) {
    console.log('Development mode: No occupied time slots for', date);
    return [];
  }
  
  try {
    // Create Google Calendar client
    const calendar = google.calendar({ version: 'v3', auth });
    
    // Parse the date
    const [year, month, day] = date.split('-').map(Number);
    
    // Create time bounds for the specified date
    const timeMin = new Date(year, month - 1, day, 0, 0, 0).toISOString();
    const timeMax = new Date(year, month - 1, day, 23, 59, 59).toISOString();
    
    // Get events for the specified date
    const calendarId = process.env.GOOGLE_CALENDAR_ID || 'primary';
    const response = await calendar.events.list({
      calendarId,
      timeMin,
      timeMax,
      singleEvents: true,
      orderBy: 'startTime',
    });
    
    // Extract start and end times from events
    const timeSlots = response.data.items?.map(event => {
      const start = event.start?.dateTime;
      const end = event.end?.dateTime;
      
      if (!start || !end) return null;
      
      // Convert to HH:MM format
      const startDate = new Date(start);
      const endDate = new Date(end);
      
      const startTime = startDate.toLocaleTimeString('nl-NL', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
      
      const endTime = endDate.toLocaleTimeString('nl-NL', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
      
      return { start: startTime, end: endTime };
    }).filter(Boolean) as Array<{ start: string; end: string }>;
    
    return timeSlots || [];
  } catch (error) {
    console.error('Error fetching events from Google Calendar:', error);
    return []; // Return empty array in case of error
  }
} 