import { NextRequest, NextResponse } from 'next/server';
import { generateId } from '../../../lib/utils';
import { Booking, saveBooking, getBookingsByDate, isTimeSlotAvailable } from '../../../lib/db';
import { sendBookingConfirmation, sendOwnerNotification } from '../../../lib/email';
import { addToGoogleCalendar } from '../../../lib/calendar';
import { MongoClient } from 'mongodb';
import { connectToDatabase } from '../../../lib/mongodb';
import { addBookingToCalendar, BookingData } from '../../../lib/calendar';
import { ObjectId } from 'mongodb';

// Interfaces
interface CalendarResult {
  success: boolean;
  message?: string;
  id?: string;
  htmlLink?: string;
}

interface EmailResult {
  customerSent: boolean;
  ownerSent: boolean;
}

/**
 * Handle GET request to check available time slots
 */
export async function GET(request: Request) {
  // Haal de datum parameter op uit de query string
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date');

  if (!date) {
    return NextResponse.json(
      { error: 'Date parameter is required' },
      { status: 400 }
    );
  }

  console.log(`Fetching appointments for date: ${date}`);

  try {
    const { db } = await connectToDatabase();
    const appointments = await db
      .collection('appointments')
      .find({ date: date })
      .toArray();

    // Extraheer de geboekte tijdslots
    const bookedTimeSlots = appointments.map(appointment => appointment.time);

    return NextResponse.json({ 
      appointments, 
      bookedTimeSlots 
    });
  } catch (error: any) {
    console.error('Error fetching appointments:', error);
    return NextResponse.json(
      { error: 'Error fetching appointments', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * Handle POST request for creating a new booking
 */
export async function POST(request: Request) {
  console.log('POST /api/bookings - Nieuwe boeking ontvangen');
  
  try {
    const bookingData = await request.json();
    
    // Log de ontvangen data voor debugging
    console.log('Ontvangen boekingsdata:', JSON.stringify(bookingData, null, 2));
    
    // Valideer verplichte velden
    const requiredFields = ['service', 'treatment', 'customer', 'email', 'phone', 'date', 'time'];
    for (const field of requiredFields) {
      if (!bookingData[field]) {
        console.error(`Missend verplicht veld: ${field}`);
        return NextResponse.json(
          { error: `Missend verplicht veld: ${field}` },
          { status: 400 }
        );
      }
    }

    // Maak verbinding met de database
    const { db } = await connectToDatabase();
    
    // Controleer of het tijdslot al is geboekt
    const existingAppointment = await db.collection('appointments').findOne({
      date: bookingData.date,
      time: bookingData.time
    });

    if (existingAppointment) {
      console.error('Tijdslot is al geboekt');
      return NextResponse.json(
        { error: 'Dit tijdslot is reeds geboekt. Kies een ander tijdslot.' },
        { status: 409 }
      );
    }

    // Voeg document toe aan MongoDB
    const result = await db.collection('appointments').insertOne({
      ...bookingData,
      createdAt: new Date()
    });

    console.log(`Boeking succesvol opgeslagen met ID: ${result.insertedId}`);
    
    // Bereid gegevens voor voor e-mail en kalender
    const bookingId = result.insertedId.toString();
    const customerName = typeof bookingData.customer === 'string' 
      ? bookingData.customer 
      : `${bookingData.customer.firstName} ${bookingData.customer.lastName}`;
    
    const email = bookingData.email || 
                 (bookingData.customer && typeof bookingData.customer === 'object' ? 
                  bookingData.customer.email : '');
    
    const phone = bookingData.phone || 
                 (bookingData.customer && typeof bookingData.customer === 'object' ? 
                  bookingData.customer.phone : '');
    
    // Data voorbereiden voor kalender en e-mails
    const calendarBookingData: BookingData = {
      id: bookingId,
      service: bookingData.service,
      treatment: bookingData.treatment,
      customer: customerName,
      email: email,
      phone: phone,
      notes: bookingData.notes || '',
      date: bookingData.date,
      time: bookingData.time,
      duration: bookingData.duration || '60 min',
      price: bookingData.price || '0'
    };

    // Resultaten bijhouden
    const results = {
      booking: {
        id: bookingId,
        service: bookingData.service,
        treatment: bookingData.treatment,
        date: bookingData.date,
        time: bookingData.time
      },
      calendar: { success: false } as CalendarResult,
      email: { customerSent: false, ownerSent: false } as EmailResult
    };

    // Probeer toe te voegen aan Google Calendar (als geconfigureerd)
    try {
      console.log('Proberen toe te voegen aan Google Calendar...');
      const calendarResult = await addBookingToCalendar(calendarBookingData);
      results.calendar = calendarResult as CalendarResult;
      console.log('Calendar integratie resultaat:', calendarResult);
    } catch (calendarError: any) {
      console.error('Fout bij toevoegen aan Calendar (maar boeking is opgeslagen):', calendarError);
      results.calendar = { 
        success: false, 
        message: calendarError instanceof Error ? calendarError.message : 'Onbekende kalenderfout'
      };
    }

    // Probeer e-mailbevestigingen te verzenden
    try {
      console.log('Verzenden van e-mailbevestiging naar klant:', email);
      if (email) {
        const emailSent = await sendBookingConfirmation({
          to: email,
          customerName: customerName,
          bookingId: bookingId,
          service: bookingData.service,
          treatment: bookingData.treatment,
          date: bookingData.date,
          time: bookingData.time,
          price: bookingData.price || '',
          duration: bookingData.duration || ''
        });
        results.email.customerSent = emailSent;
      }
      
      // Stuur ook een notificatie naar de salon-eigenaar
      const ownerEmail = process.env.SALON_EMAIL || process.env.OWNER_EMAIL;
      if (ownerEmail) {
        console.log('Verzenden van e-mailnotificatie naar eigenaar:', ownerEmail);
        const ownerEmailSent = await sendOwnerNotification({
          to: ownerEmail,
          customerName: customerName,
          customerEmail: email,
          customerPhone: phone,
          notes: bookingData.notes || '',
          bookingId: bookingId,
          service: bookingData.service,
          treatment: bookingData.treatment,
          date: bookingData.date,
          time: bookingData.time
        });
        results.email.ownerSent = ownerEmailSent;
      }
    } catch (emailError: any) {
      console.error('Fout bij verzenden van e-mails (maar boeking is opgeslagen):', emailError);
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Afspraak succesvol geboekt',
      id: bookingId,
      results: results
    });
  } catch (error: any) {
    console.error('Fout bij boeken van afspraak:', error);
    return NextResponse.json(
      { error: 'Er is een fout opgetreden bij het boeken', details: error.message },
      { status: 500 }
    );
  }
} 