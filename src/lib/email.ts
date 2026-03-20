import nodemailer from 'nodemailer';
import { Booking } from './db';
import { formatDate, formatTime, formatPrice } from './utils';

// Configureer email transporter
const getTransporter = () => {
  const host = process.env.EMAIL_SERVER_HOST;
  const port = parseInt(process.env.EMAIL_SERVER_PORT || '587');
  const user = process.env.EMAIL_SERVER_USER;
  const password = process.env.EMAIL_SERVER_PASSWORD;
  
  if (!host || !user || !password) {
    console.error('Missing email configuration. Check environment variables.');
    return null;
  }
  
  console.log(`Configureren email met host: ${host}, user: ${user.substring(0, 4)}...`);
  
  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass: password,
    },
    // Verhoog kans dat e-mails worden afgeleverd
    tls: {
      rejectUnauthorized: false  // Accepteer ook self-signed certificaten
    },
    pool: true,  // Gebruik connection pooling voor betere performantie
    maxConnections: 5, // Maximum aantal connecties in de pool
    rateDelta: 1000,  // Maximum aantal e-mails per seconde
    rateLimit: 5      // Maximum aantal e-mails per rateDelta
  });
};

// Interface voor boekingsbevestiging
interface BookingConfirmationProps {
  to: string;
  customerName: string;
  bookingId: string;
  service: string;
  treatment: string;
  date: string;
  time: string;
  price?: string;
  duration?: string;
}

// Interface voor eigenaar notificatie
interface OwnerNotificationProps {
  to: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  notes?: string;
  bookingId: string;
  service: string;
  treatment: string;
  date: string;
  time: string;
}

// Stuur boekingsbevestiging naar klant
export async function sendBookingConfirmation(data: BookingConfirmationProps) {
  const transporter = getTransporter();
  if (!transporter) {
    console.error('Failed to create email transporter');
    return false;
  }
  
  const salonName = process.env.SALON_NAME || 'NFB Salon';
  const salonEmail = process.env.SALON_EMAIL || 'nfbsalonboekingen@gmail.com';
  const salonPhone = process.env.SALON_PHONE || '+31 6 12345678';
  const salonAddress = process.env.SALON_ADDRESS || 'Kerkstraat 12, 6913 AK Aerdt';
  
  // Format de datum naar leesbaar formaat
  const dateParts = data.date.split('-'); // Verwacht format: YYYY-MM-DD
  const formattedDate = dateParts.length === 3 
    ? `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}` // DD-MM-YYYY
    : data.date;
  
  // Maak een gepersonaliseerde e-mail voor NFB Salon Aerdt
  const emailContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="margin-bottom: 20px; text-align: center;">
        <h1 style="color: #CFAF9D; margin-bottom: 5px;">${salonName}</h1>
        <p style="font-size: 16px; color: #666;">Uw beauty moment in Aerdt</p>
      </div>
      
      <div style="margin-bottom: 20px;">
        <p>Beste ${data.customerName},</p>
        <p>Hartelijk dank voor je boeking bij ${salonName} in Aerdt. We hebben je afspraak met plezier genoteerd en kijken ernaar uit je te ontvangen voor een heerlijk moment van ontspanning en verzorging.</p>
      </div>
      
      <div style="margin-bottom: 20px; background-color: #f8f4f1; padding: 15px; border-radius: 5px; border-left: 4px solid #CFAF9D;">
        <h2 style="color: #CFAF9D; font-size: 18px; margin-top: 0;">Je afspraakdetails</h2>
        <p><strong>Behandeling:</strong> ${data.service} - ${data.treatment}</p>
        <p><strong>Datum:</strong> ${formattedDate}</p>
        <p><strong>Tijd:</strong> ${data.time}</p>
        ${data.duration ? `<p><strong>Duur:</strong> ${data.duration}</p>` : ''}
        ${data.price ? `<p><strong>Prijs:</strong> ${data.price}</p>` : ''}
        <p><strong>Referentienummer:</strong> ${data.bookingId}</p>
      </div>
      
      <div style="margin-bottom: 20px;">
        <h3 style="color: #CFAF9D; font-size: 16px;">Locatie</h3>
        <p>${salonName}<br>${salonAddress}</p>
        <p>Telefoon: ${salonPhone}<br>E-mail: ${salonEmail}</p>
      </div>
      
      <div style="margin-bottom: 20px;">
        <h3 style="color: #CFAF9D; font-size: 16px;">Tips voor je bezoek</h3>
        <ul style="padding-left: 20px;">
          <li>Kom ongeveer 5 minuten voor je afspraak, zodat we op tijd kunnen beginnen.</li>
          <li>Voor nagelbehandelingen: verwijder eventuele oude gellak vooraf indien mogelijk.</li>
          <li>Voor waxbehandelingen: het haar moet minimaal 5mm lang zijn voor optimaal resultaat.</li>
          <li>Parkeren kan eenvoudig en gratis voor de deur.</li>
        </ul>
      </div>
      
      <div style="margin-bottom: 20px;">
        <p>Wil je je afspraak wijzigen of annuleren? Neem dan minimaal 24 uur van tevoren contact met ons op via telefoon of e-mail.</p>
        <p>We kijken ernaar uit je te mogen verwelkomen bij NFB Salon Aerdt!</p>
      </div>
      
      <div style="margin-top: 30px; color: #666; font-size: 12px; text-align: center; border-top: 1px solid #CFAF9D; padding-top: 15px;">
        <p>Met vriendelijke groet,<br>Het team van ${salonName}</p>
        <p style="font-style: italic;">Nails • Face • Body</p>
        <p>Voeg ons e-mailadres toe aan je contactenlijst om te zorgen dat onze e-mails in je inbox terechtkomen.</p>
      </div>
    </div>
  `;
  
  try {
    const info = await transporter.sendMail({
      from: {
        name: salonName,
        address: salonEmail
      },
      to: data.to,
      subject: `Je beauty afspraak bevestigd - ${salonName} Aerdt`,
      html: emailContent,
      text: `Afspraakbevestiging - ${salonName} Aerdt
      
Beste ${data.customerName},

Hartelijk dank voor je boeking bij ${salonName} in Aerdt. We hebben je afspraak met plezier genoteerd en kijken ernaar uit je te ontvangen voor een heerlijk moment van ontspanning en verzorging.

JE AFSPRAAKDETAILS
Behandeling: ${data.service} - ${data.treatment}
Datum: ${formattedDate}
Tijd: ${data.time}
${data.duration ? `Duur: ${data.duration}\n` : ''}${data.price ? `Prijs: ${data.price}\n` : ''}
Referentienummer: ${data.bookingId}

LOCATIE
${salonName}
${salonAddress}
Telefoon: ${salonPhone}
E-mail: ${salonEmail}

TIPS VOOR JE BEZOEK
- Kom ongeveer 5 minuten voor je afspraak, zodat we op tijd kunnen beginnen.
- Voor nagelbehandelingen: verwijder eventuele oude gellak vooraf indien mogelijk.
- Voor waxbehandelingen: het haar moet minimaal 5mm lang zijn voor optimaal resultaat.
- Parkeren kan eenvoudig en gratis voor de deur.

Wil je je afspraak wijzigen of annuleren? Neem dan minimaal 24 uur van tevoren contact met ons op via telefoon of e-mail.

We kijken ernaar uit je te mogen verwelkomen bij NFB Salon Aerdt!

Met vriendelijke groet,
Het team van ${salonName}
Nails • Face • Body

Voeg ons e-mailadres toe aan je contactenlijst om te zorgen dat onze e-mails in je inbox terechtkomen.`,
      headers: {
        'X-Priority': '3', // Normale prioriteit
        'Importance': 'Normal',
        'X-MSMail-Priority': 'Normal',
        'List-Unsubscribe': `<mailto:${salonEmail}?subject=unsubscribe>`,
      }
    });
    
    console.log('Mail verzonden:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    return false;
  }
}

// Stuur notificatie naar eigenaar
export async function sendOwnerNotification(data: OwnerNotificationProps) {
  const transporter = getTransporter();
  if (!transporter) {
    console.error('Failed to create email transporter');
    return false;
  }
  
  const salonName = process.env.SALON_NAME || 'NFB Salon';
  const salonEmail = process.env.SALON_EMAIL || 'nfbsalonboekingen@gmail.com';
  
  // Format de datum naar leesbaar formaat
  const dateParts = data.date.split('-'); // Verwacht format: YYYY-MM-DD
  const formattedDate = dateParts.length === 3 
    ? `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}` // DD-MM-YYYY
    : data.date;
  
  // Eenvoudigere e-mail met minder kans op spamfiltering
  const emailContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="margin-bottom: 20px;">
        <h1 style="color: #1D3557; margin-bottom: 5px;">${salonName}</h1>
        <p>Nieuwe afspraak ontvangen</p>
      </div>
      
      <div style="margin-bottom: 20px;">
        <p>Er is een nieuwe afspraak gemaakt in het online boekingssysteem.</p>
      </div>
      
      <div style="margin-bottom: 20px;">
        <h2 style="color: #1D3557; font-size: 18px;">Afspraakdetails</h2>
        <p><strong>Klant:</strong> ${data.customerName}</p>
        <p><strong>E-mail:</strong> ${data.customerEmail}</p>
        <p><strong>Telefoon:</strong> ${data.customerPhone}</p>
        ${data.notes ? `<p><strong>Opmerkingen:</strong> ${data.notes}</p>` : ''}
        <p><strong>Behandeling:</strong> ${data.service} - ${data.treatment}</p>
        <p><strong>Datum:</strong> ${formattedDate}</p>
        <p><strong>Tijd:</strong> ${data.time}</p>
        <p><strong>Referentienummer:</strong> ${data.bookingId}</p>
      </div>
      
      <div style="margin-top: 20px;">
        <p>De afspraak is automatisch toegevoegd aan de Google Agenda.</p>
      </div>
    </div>
  `;
  
  try {
    const info = await transporter.sendMail({
      from: {
        name: `${salonName} Boekingen`, 
        address: salonEmail
      },
      to: data.to,
      subject: `Nieuwe afspraak - ${data.customerName} - ${formattedDate}`,
      html: emailContent,
      text: `NIEUWE AFSPRAAK - ${salonName}

Er is een nieuwe afspraak gemaakt in het online boekingssysteem.

AFSPRAAKDETAILS
Klant: ${data.customerName}
E-mail: ${data.customerEmail}
Telefoon: ${data.customerPhone}
${data.notes ? `Opmerkingen: ${data.notes}\n` : ''}
Behandeling: ${data.service} - ${data.treatment}
Datum: ${formattedDate}
Tijd: ${data.time}
Referentienummer: ${data.bookingId}

De afspraak is automatisch toegevoegd aan de Google Agenda.`,
      headers: {
        'X-Priority': '3',
        'Importance': 'Normal',
        'X-MSMail-Priority': 'Normal',
      }
    });
    
    console.log('Eigenaarsnotificatie verzonden:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending owner notification:', error);
    return false;
  }
} 