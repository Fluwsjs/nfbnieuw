import 'dotenv/config';
import { sendBookingConfirmation, sendOwnerNotification } from './email';
import { addToOutlookCalendar } from './outlookCalendar';
import type { Booking } from '../types/booking';

// Test booking data
const testBooking: Booking = {
  id: 'test-booking-123',
  firstName: 'Test',
  lastName: 'User',
  email: process.env.OWNER_EMAIL || '', // Use the owner's email for testing
  phone: '+31612345678',
  service: 'Knippen',
  treatment: 'Dames',
  date: new Date().toISOString().split('T')[0], // Today's date
  time: '14:00',
  duration: 60,
  price: '35.00',
  notes: 'Test booking for configuration check',
  createdAt: new Date(),
  customer: {
    firstName: 'Test',
    lastName: 'User',
    email: process.env.OWNER_EMAIL || '', // Use the owner's email for testing
    phone: '+31612345678',
    notes: 'Test customer for configuration check'
  }
};

async function testConfigurations() {
  console.log('Starting configuration tests...\n');

  // Test email configuration
  console.log('Testing email configuration...');
  
  console.log('Sending test confirmation email...');
  const confirmationResult = await sendBookingConfirmation(testBooking);
  console.log('Email test result:', confirmationResult ? 'Success' : 'Failed');
  
  console.log('\nSending test owner notification...');
  const notificationResult = await sendOwnerNotification(testBooking);
  console.log('Notification test result:', notificationResult ? 'Success' : 'Failed');

  // Test calendar configuration
  console.log('\nTesting calendar configuration...');
  console.log('Adding test event to calendar...');
  const calendarResult = await addToOutlookCalendar(testBooking);
  console.log('Calendar test result:', calendarResult ? 'Success' : 'Failed');

  // Test environment variables
  console.log('\nTesting environment variables...');
  console.log('Checking required environment variables:');
  const requiredEnvVars = [
    'DATABASE_URL',
    'MICROSOFT_GRAPH_CLIENT_ID',
    'MICROSOFT_GRAPH_CLIENT_SECRET',
    'MICROSOFT_GRAPH_TENANT_ID',
    'MICROSOFT_GRAPH_USER_ID',
    'EMAIL_SERVER_HOST',
    'EMAIL_SERVER_PORT',
    'EMAIL_SERVER_USER',
    'EMAIL_SERVER_PASSWORD',
    'EMAIL_FROM',
    'SALON_NAME',
    'SALON_EMAIL',
    'SALON_PHONE',
    'SALON_ADDRESS',
    'OWNER_EMAIL',
    'NEXT_PUBLIC_SITE_URL'
  ];

  requiredEnvVars.forEach(varName => {
    console.log(`${varName}: ${process.env[varName] ? '✓ Set' : '✗ Missing'}`);
  });
}

// Run the tests
testConfigurations().catch(console.error); 