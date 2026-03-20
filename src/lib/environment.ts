/**
 * Environment variables module
 * 
 * This module centralizes access to environment variables and ensures 
 * they're properly loaded and validated.
 */

// MongoDB database configuration
export const DATABASE_URL = process.env.DATABASE_URL || 'mongodb+srv://nfbsalonboekingen:5izwB6NqQXmpnz6m@nfbsalon.95wds.mongodb.net/bookings?retryWrites=true&w=majority&appName=nfbsalon';

// Email configuration
export const EMAIL_SERVER_HOST = process.env.EMAIL_SERVER_HOST || 'smtp.gmail.com';
export const EMAIL_SERVER_PORT = parseInt(process.env.EMAIL_SERVER_PORT || '587', 10);
export const EMAIL_SERVER_USER = process.env.EMAIL_SERVER_USER || 'nfbsalonboekingen@gmail.com';
export const EMAIL_SERVER_PASSWORD = process.env.EMAIL_SERVER_PASSWORD || '';
export const EMAIL_FROM = process.env.EMAIL_FROM || 'nfbsalonboekingen@gmail.com';

// Google Calendar configuration
export const GOOGLE_CALENDAR_CREDENTIALS = process.env.GOOGLE_CALENDAR_CREDENTIALS || '';
export const GOOGLE_CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID || 'nfbsalonboekingen@gmail.com';

// Salon information
export const SALON_NAME = process.env.SALON_NAME || 'NFB Salon';
export const SALON_EMAIL = process.env.SALON_EMAIL || 'nfbsalonboekingen@gmail.com';
export const SALON_PHONE = process.env.SALON_PHONE || '+31 6 12345678';
export const SALON_ADDRESS = process.env.SALON_ADDRESS || 'Your Salon Address, City, Postcode';
export const OWNER_EMAIL = process.env.OWNER_EMAIL || 'nfbsalonboekingen@gmail.com';

// Site URL (for API calls from server)
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

// Debug info
console.log('Environment module loaded with DATABASE_URL:', DATABASE_URL.substring(0, 15) + '...'); 