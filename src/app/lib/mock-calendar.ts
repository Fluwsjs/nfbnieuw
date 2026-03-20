/**
 * Mock implementation of calendar functions for development environment
 */

interface MockCalendarEvent {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  serviceName: string;
  serviceOption: string;
  date: string;
  time: string;
  duration: string | number;
  notes?: string;
}

// Store mock events in memory during development
const mockEvents: MockCalendarEvent[] = [];

/**
 * Mock implementation for adding a calendar event
 */
export function mockAddToCalendar(eventData: MockCalendarEvent): string {
  console.log('MOCK: Adding calendar event', eventData);
  
  // Generate a fake event ID
  const eventId = `mock-event-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  
  // Store the event in our mock database
  mockEvents.push({
    ...eventData,
    notes: eventData.notes || ''
  });
  
  console.log(`MOCK: Created event with ID ${eventId}`);
  console.log(`MOCK: Current mock events: ${mockEvents.length}`);
  
  return eventId;
}

/**
 * Mock implementation for retrieving calendar events
 */
export function mockGetCalendarEvents(date?: string): MockCalendarEvent[] {
  if (date) {
    console.log(`MOCK: Retrieving calendar events for date ${date}`);
    return mockEvents.filter(event => event.date === date);
  }
  
  console.log('MOCK: Retrieving all calendar events');
  return [...mockEvents];
}

/**
 * Mock implementation for checking if a time slot is available
 */
export function mockIsTimeSlotAvailable(
  date: string,
  time: string,
  duration: number
): boolean {
  console.log(`MOCK: Checking availability for ${date} at ${time} for ${duration} minutes`);
  
  // Get events for the requested date
  const dateEvents = mockEvents.filter(event => event.date === date);
  
  if (dateEvents.length === 0) {
    console.log('MOCK: No events found for this date, slot is available');
    return true;
  }
  
  // Convert requested time to minutes
  const [reqHours, reqMinutes] = time.split(':').map(Number);
  const requestedStartMinutes = reqHours * 60 + reqMinutes;
  const requestedEndMinutes = requestedStartMinutes + duration;
  
  // Check for overlaps with existing events
  for (const event of dateEvents) {
    const [eventHours, eventMinutes] = event.time.split(':').map(Number);
    const eventStartMinutes = eventHours * 60 + eventMinutes;
    
    // Convert duration to minutes if it's a string
    let eventDurationMinutes: number;
    if (typeof event.duration === 'string') {
      eventDurationMinutes = parseInt(event.duration.replace(/\D/g, ''));
    } else {
      eventDurationMinutes = event.duration;
    }
    
    const eventEndMinutes = eventStartMinutes + eventDurationMinutes;
    
    // Check if there's an overlap
    if (
      (requestedStartMinutes >= eventStartMinutes && requestedStartMinutes < eventEndMinutes) ||
      (requestedEndMinutes > eventStartMinutes && requestedEndMinutes <= eventEndMinutes) ||
      (requestedStartMinutes <= eventStartMinutes && requestedEndMinutes >= eventEndMinutes)
    ) {
      console.log('MOCK: Found overlapping event, slot is not available');
      return false;
    }
  }
  
  console.log('MOCK: No overlapping events found, slot is available');
  return true;
} 