import { Client } from '@microsoft/microsoft-graph-client';
import { ClientSecretCredential } from '@azure/identity';
import type { Booking } from '../types/booking';
import { config } from './config';

// Initialize Azure AD app credentials with retry logic
const createCredential = async (retries = 3): Promise<ClientSecretCredential> => {
  try {
    if (!config.microsoft.graph.tenantId || !config.microsoft.graph.clientId || !config.microsoft.graph.clientSecret) {
      throw new Error('Missing required Microsoft Graph credentials');
    }

    return new ClientSecretCredential(
      config.microsoft.graph.tenantId,
      config.microsoft.graph.clientId,
      config.microsoft.graph.clientSecret
    );
  } catch (error) {
    if (retries > 0) {
      // Wait 1 second before retrying
      await new Promise(resolve => setTimeout(resolve, 1000));
      return createCredential(retries - 1);
    }
    throw error;
  }
};

// Initialize the Graph client with Azure Identity and retry logic
const createGraphClient = async (retries = 3): Promise<Client> => {
  try {
    const credential = await createCredential();
    return Client.init({
      authProvider: async (done) => {
        try {
          const token = await credential.getToken(['https://graph.microsoft.com/.default']);
          done(null, token?.token || '');
        } catch (error) {
          done(error as Error, '');
        }
      },
    });
  } catch (error) {
    if (retries > 0) {
      // Wait 1 second before retrying
      await new Promise(resolve => setTimeout(resolve, 1000));
      return createGraphClient(retries - 1);
    }
    throw error;
  }
};

// Initialize client
let client: Client;

// Helper function to get Graph client with retry logic
async function getGraphClient(): Promise<Client> {
  if (!client) {
    client = await createGraphClient();
  }
  return client;
}

export async function checkAvailability(date: string, time: string, duration: number): Promise<boolean> {
  try {
    const graphClient = await getGraphClient();
    const startTime = new Date(`${date}T${time}`);
    const endTime = new Date(startTime);
    endTime.setMinutes(endTime.getMinutes() + duration);

    // Get events for the specified date
    const response = await graphClient.api(`/users/${config.microsoft.graph.userId}/calendarview`)
      .query({
        startDateTime: new Date(startTime.getTime() - 24 * 60 * 60 * 1000).toISOString(), // 24 hours before
        endDateTime: new Date(endTime.getTime() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours after
      })
      .get();

    const events = response.value || [];

    // Check for overlapping events
    for (const event of events) {
      const eventStart = new Date(event.start.dateTime);
      const eventEnd = new Date(event.end.dateTime);

      if (
        (startTime >= eventStart && startTime < eventEnd) ||
        (endTime > eventStart && endTime <= eventEnd) ||
        (startTime <= eventStart && endTime >= eventEnd)
      ) {
        return false; // Time slot is not available
      }
    }

    return true; // Time slot is available
  } catch (error) {
    // Log error to monitoring system
    console.error('Error checking calendar availability:', error);
    return false; // In case of error, assume slot is not available
  }
}

export async function addToOutlookCalendar(booking: Booking): Promise<boolean> {
  try {
    const graphClient = await getGraphClient();

    // First check if the time slot is available
    const isAvailable = await checkAvailability(booking.date.toISOString().split('T')[0], booking.time, booking.duration);
    if (!isAvailable) {
      // Log error to monitoring system
      console.error('Time slot is not available');
      return false;
    }

    // Convert date and time to ISO string
    const startTime = new Date(`${booking.date}T${booking.time}`);
    const endTime = new Date(startTime);
    endTime.setMinutes(endTime.getMinutes() + booking.duration);

    // Create the event
    const event = {
      subject: `${booking.service} - ${booking.treatment}`,
      body: {
        contentType: 'html',
        content: `
          <h2>Afspraak Details</h2>
          <p><strong>Klant:</strong> ${booking.firstName} ${booking.lastName}</p>
          <p><strong>Email:</strong> ${booking.email}</p>
          <p><strong>Telefoon:</strong> ${booking.phone}</p>
          <p><strong>Service:</strong> ${booking.service}</p>
          <p><strong>Behandeling:</strong> ${booking.treatment}</p>
          <p><strong>Duur:</strong> ${booking.duration} minuten</p>
          <p><strong>Prijs:</strong> €${booking.price}</p>
          ${booking.notes ? `<p><strong>Notities:</strong> ${booking.notes}</p>` : ''}
        `,
      },
      start: {
        dateTime: startTime.toISOString(),
        timeZone: 'Europe/Amsterdam',
      },
      end: {
        dateTime: endTime.toISOString(),
        timeZone: 'Europe/Amsterdam',
      },
      attendees: [
        {
          emailAddress: {
            address: booking.email,
            name: `${booking.firstName} ${booking.lastName}`,
          },
          type: 'required',
        },
      ],
      reminderMinutesBeforeStart: 60, // Herinnering 1 uur van tevoren
    };

    // Add the event to the calendar with retry logic
    let retries = 3;
    while (retries > 0) {
      try {
        await graphClient.api(`/users/${config.microsoft.graph.userId}/events`)
          .post(event);
        return true;
      } catch (error) {
        retries--;
        if (retries === 0) {
          throw error;
        }
        // Wait 1 second before retrying
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    return true;
  } catch (error) {
    // Log error to monitoring system
    console.error('Error adding event to calendar:', error);
    return false;
  }
} 