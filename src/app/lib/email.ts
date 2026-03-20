import nodemailer from 'nodemailer';
import { mockSendBookingConfirmation, mockSendSalonNotification } from './mock-email';
import { formatDate, formatTime } from './utils';

interface EmailData {
  to: string;
  subject: string;
  text: string;
  html: string;
  customerName: string;
  customerEmail: string;
  serviceName: string;
  serviceOption: string;
  date: string;
  time: string;
  duration: number;
  price: number;
  notes: string;
}

interface BookingConfirmationData {
  customerName: string;
  customerEmail: string;
  serviceName: string;
  serviceOption: string;
  date: string;
  time: string;
  price: string;
  duration: string;
  notes?: string;
}

/**
 * Configure the email transporter using environment variables
 */
const configureTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

/**
 * Send an email with the provided data
 * @param emailData - The data for the email to send
 * @returns A promise that resolves when the email is sent
 */
export const sendEmail = async (emailData: EmailData): Promise<boolean> => {
  try {
    // Use mock implementation in development or if email credentials are not set
    if (process.env.NODE_ENV !== 'production' || !process.env.EMAIL_HOST) {
      console.log('Using mock email implementation for development');
      return mockSendEmail(emailData);
    }
    
    const transporter = configureTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'noreply@nfbsalon.nl',
      to: emailData.to,
      subject: emailData.subject,
      text: emailData.text,
      html: emailData.html,
    };
    
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

// Mock implementation of sending an email
const mockSendEmail = async (emailData: EmailData): Promise<boolean> => {
  console.log('Mock email:', {
    to: emailData.to,
    subject: emailData.subject,
    textLength: emailData.text.length,
    htmlLength: emailData.html.length
  });
  return true;
};

/**
 * Email utility functions for sending booking confirmations and notifications
 */

// Create a transporter based on environment variables
const getTransporter = () => {
  // For development/testing, use a test account
  if (process.env.NODE_ENV !== 'production') {
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER || 'test@example.com',
        pass: process.env.SMTP_PASS || 'testpassword'
      }
    });
  }

  // For production, use configured SMTP settings
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
};

/**
 * Sends booking confirmation email to the customer
 */
export async function sendBookingConfirmation(data: EmailData): Promise<void> {
  const transporter = getTransporter();
  const salonName = process.env.SALON_NAME || 'NFB Salon';
  const salonEmail = process.env.SALON_EMAIL || 'info@nfbsalon.nl';
  
  const formattedDate = formatDate(data.date);
  const formattedTime = formatTime(data.time);
  
  await transporter.sendMail({
    from: `"${salonName}" <${salonEmail}>`,
    to: data.customerEmail,
    subject: `Bevestiging van uw afspraak bij ${salonName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
        <h2 style="color: #CFAF9D; text-align: center;">Uw afspraak is bevestigd!</h2>
        <p>Beste ${data.customerName},</p>
        <p>Bedankt voor het maken van een afspraak bij ${salonName}. Hieronder vindt u de details van uw afspraak:</p>
        
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Service:</strong> ${data.serviceName}</p>
          <p><strong>Behandeling:</strong> ${data.serviceOption}</p>
          <p><strong>Datum:</strong> ${formattedDate}</p>
          <p><strong>Tijd:</strong> ${formattedTime}</p>
          <p><strong>Duur:</strong> ${data.duration} minuten</p>
          <p><strong>Prijs:</strong> €${data.price.toFixed(2)}</p>
          ${data.notes ? `<p><strong>Notities:</strong> ${data.notes}</p>` : ''}
        </div>
        
        <p><strong>Locatie:</strong><br>
        ${process.env.SALON_ADDRESS || 'NFB Salon<br>Voorbeeldstraat 123<br>1234 AB Amsterdam'}</p>
        
        <p>Als u uw afspraak wilt wijzigen of annuleren, neem dan contact met ons op via telefoon of e-mail ten minste 24 uur van tevoren.</p>
        
        <p>We kijken ernaar uit u te verwelkomen in onze salon!</p>
        
        <p>Met vriendelijke groet,<br>
        ${salonName} Team</p>
        
        <div style="font-size: 12px; color: #999; margin-top: 30px; text-align: center; border-top: 1px solid #ddd; padding-top: 10px;">
          <p>Dit is een automatisch gegenereerde e-mail. Reageer niet op dit bericht.</p>
          <p>© ${new Date().getFullYear()} ${salonName} - Alle rechten voorbehouden</p>
        </div>
      </div>
    `
  });
}

/**
 * Sends notification email to the salon owner
 */
export async function sendSalonNotification(data: EmailData): Promise<void> {
  const transporter = getTransporter();
  const salonName = process.env.SALON_NAME || 'NFB Salon';
  const salonEmail = process.env.SALON_EMAIL || 'info@nfbsalon.nl';
  const ownerEmail = process.env.OWNER_EMAIL || salonEmail;
  
  const formattedDate = formatDate(data.date);
  const formattedTime = formatTime(data.time);
  
  await transporter.sendMail({
    from: `"${salonName} Booking System" <${salonEmail}>`,
    to: ownerEmail,
    subject: `Nieuwe afspraak: ${data.customerName} - ${formattedDate} ${formattedTime}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
        <h2 style="color: #CFAF9D; text-align: center;">Nieuwe afspraak</h2>
        
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Klant:</strong> ${data.customerName}</p>
          <p><strong>Email:</strong> ${data.customerEmail}</p>
          <p><strong>Service:</strong> ${data.serviceName}</p>
          <p><strong>Behandeling:</strong> ${data.serviceOption}</p>
          <p><strong>Datum:</strong> ${formattedDate}</p>
          <p><strong>Tijd:</strong> ${formattedTime}</p>
          <p><strong>Duur:</strong> ${data.duration} minuten</p>
          <p><strong>Prijs:</strong> €${data.price.toFixed(2)}</p>
          ${data.notes ? `<p><strong>Notities:</strong> ${data.notes}</p>` : ''}
        </div>
        
        <p>Deze afspraak is zojuist geboekt via de website.</p>
        
        <div style="font-size: 12px; color: #999; margin-top: 30px; text-align: center; border-top: 1px solid #ddd; padding-top: 10px;">
          <p>Dit is een automatisch gegenereerde e-mail van het boekingssysteem.</p>
          <p>© ${new Date().getFullYear()} ${salonName} - Alle rechten voorbehouden</p>
        </div>
      </div>
    `
  });
} 