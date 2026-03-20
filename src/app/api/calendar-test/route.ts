import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import { DateTime } from 'luxon';

// Type definities toevoegen voor Node.js
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      GOOGLE_CALENDAR_CREDENTIALS?: string;
      GOOGLE_CALENDAR_ID?: string;
    }
  }
}

/**
 * Directe test voor Google Calendar integratie
 * Gebruik: GET /api/calendar-test
 */
export async function GET() {
  console.log('=== DIRECTE GOOGLE CALENDAR TEST ===');
  try {
    // 1. Haal credentials op en debug deze
    if (!process.env.GOOGLE_CALENDAR_CREDENTIALS) {
      return NextResponse.json({ 
        success: false, 
        error: 'Geen GOOGLE_CALENDAR_CREDENTIALS gevonden in omgevingsvariabelen' 
      }, { status: 500 });
    }

    // Log de eerste 100 karakters van de credentials (veilig)
    console.log('Credentials (eerste 100 chars):', process.env.GOOGLE_CALENDAR_CREDENTIALS.substring(0, 100) + '...');

    try {
      // 2. Parse credentials
      const credentials = JSON.parse(
        Buffer.from(process.env.GOOGLE_CALENDAR_CREDENTIALS, 'base64').toString()
      );
      
      console.log('Credentials succesvol geparsed.');
      console.log('Client Email:', credentials.client_email);
      console.log('Private Key ID:', credentials.private_key_id); // Alleen ID, niet de hele key
      
      // 3. Maak JWT client
      const auth = new google.auth.JWT({
        email: credentials.client_email,
        key: credentials.private_key,
        scopes: ['https://www.googleapis.com/auth/calendar'],
      });
      
      console.log('Auth client succesvol aangemaakt.');
      
      // 4. Maak calendar client
      const calendar = google.calendar({ version: 'v3', auth });
      console.log('Calendar client succesvol aangemaakt.');
      
      // 5. Haal kalender ID op
      const calendarId = process.env.GOOGLE_CALENDAR_ID || 'nfbsalonboekingen@gmail.com';
      console.log('Gebruikte Calendar ID:', calendarId);
      
      // 6. Controleer toegang tot de kalender
      console.log('Controleren of kalender toegankelijk is...');
      try {
        const calendarInfoResponse = await calendar.calendars.get({
          calendarId
        });
        console.log('Kalender details opgehaald:', JSON.stringify(calendarInfoResponse.data, null, 2));
      } catch (calendarError) {
        console.error('Fout bij ophalen kalender details:', calendarError);
        return NextResponse.json({ 
          success: false, 
          error: `Geen toegang tot kalender met ID ${calendarId}: ${calendarError instanceof Error ? calendarError.message : 'Onbekende fout'}` 
        }, { status: 500 });
      }
      
      // 7. Maak een test event over 1 dag (om collision met echte events te voorkomen)
      const startTime = DateTime.now().plus({ days: 1 }).set({ hour: 10, minute: 0 });
      const endTime = startTime.plus({ minutes: 30 });
      
      console.log('Test event voor tijd:', startTime.toFormat('yyyy-MM-dd HH:mm'));
      
      // 8. Maak event object
      const testEvent = {
        summary: `TEST EVENT - ${new Date().toISOString()}`,
        description: 'Dit is een automatisch gegenereerd test event. Deze kan veilig worden verwijderd.',
        start: {
          dateTime: startTime.toISO(),
          timeZone: 'Europe/Amsterdam',
        },
        end: {
          dateTime: endTime.toISO(),
          timeZone: 'Europe/Amsterdam',
        },
        colorId: '2', // Rood voor test events (anders dan normale events)
      };
      
      console.log('Test event object aangemaakt:', JSON.stringify(testEvent, null, 2));
      
      // 9. Voeg het event toe
      console.log('Event toevoegen aan kalender...');
      try {
        const insertResponse = await calendar.events.insert({
          calendarId,
          requestBody: testEvent,
        });
        
        console.log('Event succesvol toegevoegd:', insertResponse.data.htmlLink);
        console.log('Event ID:', insertResponse.data.id);
        console.log('Volledige response:', JSON.stringify(insertResponse.data, null, 2));
        
        return NextResponse.json({ 
          success: true, 
          message: 'Test event succesvol aangemaakt',
          eventUrl: insertResponse.data.htmlLink,
          eventId: insertResponse.data.id,
          eventData: insertResponse.data,
        });
      } catch (insertError) {
        console.error('Fout bij toevoegen event:', insertError);
        
        return NextResponse.json({ 
          success: false, 
          error: `Kon test event niet toevoegen: ${insertError instanceof Error ? insertError.message : 'Onbekende fout'}`,
          requestBody: testEvent
        }, { status: 500 });
      }
    } catch (credentialsError) {
      console.error('Fout bij verwerken credentials:', credentialsError);
      return NextResponse.json({ 
        success: false, 
        error: `Ongeldige credentials: ${credentialsError instanceof Error ? credentialsError.message : 'Onbekende fout'}` 
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Algemene fout in calendar test:', error);
    
    return NextResponse.json({ 
      success: false, 
      error: `Algemene fout in test: ${error instanceof Error ? error.message : 'Onbekende fout'}` 
    }, { status: 500 });
  }
} 