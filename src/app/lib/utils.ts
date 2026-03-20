/**
 * Utility functions for formatting dates, times, etc.
 */

/**
 * Formats a date string (YYYY-MM-DD) into a localized format (DD-MM-YYYY)
 */
export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('nl-NL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString; // Return original if parsing fails
  }
}

/**
 * Formats a time string (HH:MM) for display
 */
export function formatTime(timeString: string): string {
  // If already in HH:MM format, just return it
  if (/^\d{1,2}:\d{2}$/.test(timeString)) {
    return timeString;
  }
  
  try {
    // For handling full ISO strings if needed
    if (timeString.includes('T')) {
      const date = new Date(timeString);
      return date.toLocaleTimeString('nl-NL', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
    }
    
    return timeString;
  } catch (error) {
    console.error('Error formatting time:', error);
    return timeString; // Return original if parsing fails
  }
}

/**
 * Formats a price number to currency string with € symbol
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: 'EUR'
  }).format(price);
}

/**
 * Formats a duration number to a human-readable string
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} minuten`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return hours === 1 ? '1 uur' : `${hours} uur`;
  }
  
  return `${hours} uur en ${remainingMinutes} minuten`;
}

/**
 * Formats a date range for display (e.g., "10:00 - 11:00")
 */
export function formatTimeRange(startTime: string, durationMinutes: number): string {
  try {
    const [hours, minutes] = startTime.split(':').map(Number);
    const startDate = new Date();
    startDate.setHours(hours, minutes, 0, 0);
    
    const endDate = new Date(startDate.getTime() + durationMinutes * 60000);
    const endTimeStr = endDate.toLocaleTimeString('nl-NL', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
    
    return `${startTime} - ${endTimeStr}`;
  } catch (error) {
    console.error('Error formatting time range:', error);
    return startTime;
  }
} 