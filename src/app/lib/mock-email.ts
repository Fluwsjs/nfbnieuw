/**
 * Mock email service implementation for development
 * This allows testing the appointment booking system without actual email credentials
 */

interface EmailData {
  to: string;
  subject: string;
  text: string;
  html: string;
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

// Storage key for mock emails
const MOCK_EMAILS_STORAGE_KEY = 'nfb_salon_mock_emails';

// Get emails from local storage
const getEmailsFromStorage = (): any[] => {
  if (typeof window === 'undefined') {
    return []; // Return empty array on server-side
  }
  
  try {
    const storedEmails = localStorage.getItem(MOCK_EMAILS_STORAGE_KEY);
    return storedEmails ? JSON.parse(storedEmails) : [];
  } catch (error) {
    console.error('Error reading mock emails from localStorage:', error);
    return [];
  }
};

// Save emails to local storage
const saveEmailsToStorage = (emails: any[]): void => {
  if (typeof window === 'undefined') {
    return; // Do nothing on server-side
  }
  
  try {
    localStorage.setItem(MOCK_EMAILS_STORAGE_KEY, JSON.stringify(emails));
  } catch (error) {
    console.error('Error writing mock emails to localStorage:', error);
  }
};

/**
 * Mock implementation of sending an email
 * @param emailData - The email data to send
 * @returns Success status
 */
export const mockSendEmail = async (emailData: EmailData): Promise<boolean> => {
  try {
    // Create a mock email record
    const mockEmail = {
      id: `mock-email-${Date.now()}`,
      to: emailData.to,
      from: 'noreply@nfbsalon.nl',
      subject: emailData.subject,
      text: emailData.text,
      html: emailData.html,
      sentAt: new Date().toISOString(),
    };
    
    // Get existing emails
    const emails = getEmailsFromStorage();
    
    // Add new email
    emails.push(mockEmail);
    
    // Save back to storage
    saveEmailsToStorage(emails);
    
    console.log('Mock email sent:', {
      to: mockEmail.to,
      subject: mockEmail.subject,
      sentAt: mockEmail.sentAt
    });
    
    return true;
  } catch (error) {
    console.error('Error sending mock email:', error);
    return false;
  }
};

/**
 * Mock implementation of email functions for development environment
 */

interface MockEmailData {
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

// Store sent emails in memory during development
const sentEmails: Array<{type: string, data: MockEmailData}> = [];

/**
 * Mock implementation for sending booking confirmation email
 */
export function mockSendBookingConfirmation(data: MockEmailData): boolean {
  console.log('MOCK: Sending booking confirmation email');
  console.log(`MOCK: To: ${data.customerEmail}`);
  console.log(`MOCK: Subject: Bevestiging van uw afspraak bij NFB Salon`);
  console.log(`MOCK: Email content would include: 
    - Customer name: ${data.customerName}
    - Service: ${data.serviceName}
    - Treatment: ${data.serviceOption}
    - Date: ${data.date}
    - Time: ${data.time}
    - Duration: ${data.duration} minutes
    - Price: €${data.price.toFixed(2)}
    ${data.notes ? `- Notes: ${data.notes}` : ''}
  `);
  
  // Store the sent email
  sentEmails.push({
    type: 'confirmation',
    data: { ...data }
  });
  
  console.log(`MOCK: Confirmation email sent successfully to ${data.customerEmail}`);
  return true;
}

/**
 * Mock implementation for sending salon notification email
 */
export function mockSendSalonNotification(data: MockEmailData): boolean {
  console.log('MOCK: Sending salon notification email');
  console.log(`MOCK: To: salon owner (info@nfbsalon.nl)`);
  console.log(`MOCK: Subject: Nieuwe afspraak: ${data.customerName}`);
  console.log(`MOCK: Email content would include: 
    - Customer name: ${data.customerName}
    - Customer email: ${data.customerEmail}
    - Service: ${data.serviceName}
    - Treatment: ${data.serviceOption}
    - Date: ${data.date}
    - Time: ${data.time}
    - Duration: ${data.duration} minutes
    - Price: €${data.price.toFixed(2)}
    ${data.notes ? `- Notes: ${data.notes}` : ''}
  `);
  
  // Store the sent email
  sentEmails.push({
    type: 'notification',
    data: { ...data }
  });
  
  console.log('MOCK: Notification email sent successfully to salon owner');
  return true;
}

/**
 * Get all sent emails (for debug purposes)
 */
export function getMockSentEmails() {
  return sentEmails;
}

/**
 * Clear all sent emails (for debug purposes)
 */
export function clearMockSentEmails() {
  sentEmails.length = 0;
  console.log('MOCK: Cleared all sent emails');
} 