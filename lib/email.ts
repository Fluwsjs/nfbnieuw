import nodemailer from 'nodemailer';
import type { Booking } from '@prisma/client';
import { config } from './config';

// Create SMTP transporter with retry logic
const createTransporter = async (retries = 3): Promise<nodemailer.Transporter> => {
  try {
    const transporter = nodemailer.createTransport({
      host: config.email.server.host,
      port: config.email.server.port,
      secure: false,
      auth: {
        user: config.email.server.user,
        pass: config.email.server.password,
      },
      tls: {
        rejectUnauthorized: config.isProduction,
      },
    });

    // Verify connection
    await transporter.verify();
    return transporter;
  } catch (error) {
    if (retries > 0) {
      // Wait 1 second before retrying
      await new Promise(resolve => setTimeout(resolve, 1000));
      return createTransporter(retries - 1);
    }
    throw error;
  }
};

// Initialize transporter
let transporter: nodemailer.Transporter;

// Helper function to send email with retry logic
async function sendEmailWithRetry(mailOptions: nodemailer.SendMailOptions, retries = 3): Promise<boolean> {
  try {
    if (!transporter) {
      transporter = await createTransporter();
    }

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    if (retries > 0) {
      // Wait 1 second before retrying
      await new Promise(resolve => setTimeout(resolve, 1000));
      return sendEmailWithRetry(mailOptions, retries - 1);
    }
    
    // Log error to monitoring system
    console.error('Failed to send email after retries:', error);
    return false;
  }
}

function formatPrice(price: string): string {
  return `€${parseFloat(price).toFixed(2)}`;
}

function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (hours > 0) {
    return `${hours} uur ${remainingMinutes > 0 ? `${remainingMinutes} minuten` : ''}`;
  }
  return `${minutes} minuten`;
}

export async function sendBookingConfirmation(booking: Booking): Promise<boolean> {
  try {
    const formattedDate = new Date(booking.date).toLocaleDateString('nl-NL', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const mailOptions = {
      from: `"${config.site.name}" <${config.email.from}>`,
      to: booking.email,
      subject: `Bevestiging van uw afspraak bij ${config.site.name}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { text-align: center; margin-bottom: 30px; }
              .header h1 { color: #2c3e50; }
              .details { background: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0; }
              .details ul { list-style: none; padding: 0; }
              .details li { margin: 10px 0; }
              .footer { text-align: center; margin-top: 30px; font-size: 0.9em; color: #666; }
              .important { color: #e74c3c; font-weight: bold; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Bedankt voor uw afspraak bij ${config.site.name}!</h1>
              </div>
              
              <p>Beste ${booking.firstName},</p>
              
              <p>We hebben uw afspraak goed ontvangen. Hier zijn de details:</p>
              
              <div class="details">
                <ul>
                  <li><strong>Datum:</strong> ${formattedDate}</li>
                  <li><strong>Tijd:</strong> ${booking.time}</li>
                  <li><strong>Service:</strong> ${booking.service}</li>
                  <li><strong>Behandeling:</strong> ${booking.treatment}</li>
                  <li><strong>Duur:</strong> ${formatDuration(booking.duration)}</li>
                  <li><strong>Prijs:</strong> ${formatPrice(booking.price)}</li>
                  ${booking.notes ? `<li><strong>Notities:</strong> ${booking.notes}</li>` : ''}
                </ul>
              </div>

              <p class="important">Belangrijke informatie:</p>
              <ul>
                <li>Wij verzoeken u 5 minuten voor de afgesproken tijd aanwezig te zijn.</li>
                <li>Bij verhindering graag minimaal 24 uur van tevoren afmelden.</li>
                <li>Neem bij voorkeur contant geld mee voor de betaling.</li>
              </ul>

              <p>Wij zien u graag op de afgesproken tijd!</p>

              <div class="footer">
                <p>Met vriendelijke groet,<br>${config.site.name}</p>
                <p>${config.site.address}<br>Tel: ${config.site.phone}<br>Email: ${config.site.email}</p>
              </div>
            </div>
          </body>
        </html>
      `,
    };

    return await sendEmailWithRetry(mailOptions);
  } catch (error) {
    // Log error to monitoring system
    console.error('Error preparing booking confirmation email:', error);
    return false;
  }
}

export async function sendOwnerNotification(booking: Booking): Promise<boolean> {
  try {
    const formattedDate = new Date(booking.date).toLocaleDateString('nl-NL', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const mailOptions = {
      from: `"${config.site.name}" <${config.email.from}>`,
      to: config.site.email,
      subject: `Nieuwe afspraak bij ${config.site.name}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { text-align: center; margin-bottom: 30px; }
              .header h1 { color: #2c3e50; }
              .details { background: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0; }
              .details ul { list-style: none; padding: 0; }
              .details li { margin: 10px 0; }
              .footer { text-align: center; margin-top: 30px; font-size: 0.9em; color: #666; }
              .contact-info { background: #e8f4f8; padding: 15px; border-radius: 5px; margin: 20px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Nieuwe afspraak ontvangen</h1>
              </div>

              <p>Er is een nieuwe afspraak gemaakt met de volgende details:</p>

              <div class="details">
                <ul>
                  <li><strong>Datum:</strong> ${formattedDate}</li>
                  <li><strong>Tijd:</strong> ${booking.time}</li>
                  <li><strong>Duur:</strong> ${formatDuration(booking.duration)}</li>
                  <li><strong>Service:</strong> ${booking.service}</li>
                  <li><strong>Behandeling:</strong> ${booking.treatment}</li>
                  <li><strong>Prijs:</strong> ${formatPrice(booking.price)}</li>
                  ${booking.notes ? `<li><strong>Notities:</strong> ${booking.notes}</li>` : ''}
                </ul>
              </div>

              <div class="contact-info">
                <h3>Contactgegevens klant:</h3>
                <ul>
                  <li><strong>Naam:</strong> ${booking.firstName} ${booking.lastName}</li>
                  <li><strong>Email:</strong> ${booking.email}</li>
                  <li><strong>Telefoon:</strong> ${booking.phone}</li>
                </ul>
              </div>

              <div class="footer">
                <p>Deze afspraak is automatisch toegevoegd aan uw agenda.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    };

    return await sendEmailWithRetry(mailOptions);
  } catch (error) {
    // Log error to monitoring system
    console.error('Error preparing owner notification email:', error);
    return false;
  }
}

export async function sendReminderEmail(booking: Booking): Promise<boolean> {
  try {
    const formattedDate = new Date(booking.date).toLocaleDateString('nl-NL', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const mailOptions = {
      from: `"${config.site.name}" <${config.email.from}>`,
      to: booking.email,
      subject: `Herinnering: Uw afspraak bij ${config.site.name} morgen`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { text-align: center; margin-bottom: 30px; }
              .header h1 { color: #2c3e50; }
              .details { background: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0; }
              .details ul { list-style: none; padding: 0; }
              .details li { margin: 10px 0; }
              .footer { text-align: center; margin-top: 30px; font-size: 0.9em; color: #666; }
              .important { color: #e74c3c; font-weight: bold; }
              .reminder { background: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Herinnering: Uw afspraak bij ${config.site.name}</h1>
              </div>
              
              <p>Beste ${booking.firstName},</p>
              
              <p>Dit is een herinnering dat u morgen een afspraak heeft bij ${config.site.name}.</p>
              
              <div class="details">
                <ul>
                  <li><strong>Datum:</strong> ${formattedDate}</li>
                  <li><strong>Tijd:</strong> ${booking.time}</li>
                  <li><strong>Service:</strong> ${booking.service}</li>
                  <li><strong>Behandeling:</strong> ${booking.treatment}</li>
                  <li><strong>Duur:</strong> ${formatDuration(booking.duration)}</li>
                  <li><strong>Prijs:</strong> ${formatPrice(booking.price)}</li>
                  ${booking.notes ? `<li><strong>Notities:</strong> ${booking.notes}</li>` : ''}
                </ul>
              </div>

              <div class="reminder">
                <p class="important">Belangrijke herinneringen:</p>
                <ul>
                  <li>Wij verzoeken u 5 minuten voor de afgesproken tijd aanwezig te zijn.</li>
                  <li>Neem bij voorkeur contant geld mee voor de betaling.</li>
                  <li>Bij verhindering, neem zo spoedig mogelijk contact met ons op.</li>
                </ul>
              </div>

              <p>Wij zien u graag morgen!</p>

              <div class="footer">
                <p>Met vriendelijke groet,<br>${config.site.name}</p>
                <p>${config.site.address}<br>Tel: ${config.site.phone}<br>Email: ${config.site.email}</p>
              </div>
            </div>
          </body>
        </html>
      `,
    };

    return await sendEmailWithRetry(mailOptions);
  } catch (error) {
    // Log error to monitoring system
    console.error('Error preparing reminder email:', error);
    return false;
  }
} 