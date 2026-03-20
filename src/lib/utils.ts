import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a date string (YYYY-MM-DD) to readable format (DD-MM-YYYY)
 */
export function formatDate(dateString: string): string {
  if (!dateString) return '';
  
  try {
    const [year, month, day] = dateString.split('-');
    return `${day}-${month}-${year}`;
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
}

/**
 * Format a time string (HH:MM) to readable format with AM/PM
 */
export function formatTime(timeString: string): string {
  if (!timeString) return '';
  
  try {
    const [hours, minutes] = timeString.split(':');
    return `${hours}:${minutes}`;
  } catch (error) {
    console.error('Error formatting time:', error);
    return timeString;
  }
}

/**
 * Format a price number to currency string (€XX,XX)
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: 'EUR',
  }).format(price);
}

/**
 * Generate a random ID
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);
}

/**
 * Format duration in minutes to a readable string (X hours Y minutes)
 */
export function formatDuration(durationInMinutes: number): string {
  const hours = Math.floor(durationInMinutes / 60);
  const minutes = durationInMinutes % 60;
  
  if (hours > 0 && minutes > 0) {
    return `${hours} uur en ${minutes} minuten`;
  } else if (hours > 0) {
    return `${hours} uur`;
  } else {
    return `${minutes} minuten`;
  }
}

/**
 * Convert a date to yyyy-mm-dd format
 */
export function toISODateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone number format (basic validation)
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

/**
 * Check if a value is empty (null, undefined, empty string)
 */
export function isEmpty(value: any): boolean {
  return value === null || value === undefined || value === '';
}

/**
 * Check if a date is in the future
 */
export function isFutureDate(dateString: string): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  date.setHours(0, 0, 0, 0);
  
  return date >= today;
}
