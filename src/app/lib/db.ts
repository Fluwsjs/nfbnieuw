/**
 * Database utility functions for handling appointments
 * 
 * This is a simplified version using local storage.
 * For production, replace with a real database like MongoDB, PostgreSQL, etc.
 */

// Appointment type definition
export interface Appointment {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  serviceName: string;
  serviceOption: string;
  date: string;
  time: string;
  duration: number;
  price: number;
  notes: string;
  createdAt: string;
}

// Simulated database using localStorage in browser and memory in Node.js
const DB_KEY = 'nfb_salon_appointments';
let memoryDb: Appointment[] = [];

/**
 * Gets all appointments from storage
 */
export async function getAllAppointments(): Promise<Appointment[]> {
  if (typeof window !== 'undefined') {
    // Browser environment
    const storedData = localStorage.getItem(DB_KEY);
    return storedData ? JSON.parse(storedData) : [];
  } else {
    // Server environment
    return memoryDb;
  }
}

/**
 * Saves an appointment to storage
 */
export async function saveAppointment(appointment: Appointment): Promise<void> {
  const appointments = await getAllAppointments();
  const updatedAppointments = [...appointments, appointment];
  
  if (typeof window !== 'undefined') {
    // Browser environment
    localStorage.setItem(DB_KEY, JSON.stringify(updatedAppointments));
  } else {
    // Server environment
    memoryDb = updatedAppointments;
  }
}

/**
 * Gets appointments for a specific date
 */
export async function getAppointmentsByDate(date: string): Promise<Appointment[]> {
  const appointments = await getAllAppointments();
  return appointments.filter(appointment => appointment.date === date);
}

/**
 * Checks if a time slot is available
 */
export async function isTimeSlotAvailable(
  date: string, 
  time: string, 
  duration: number
): Promise<boolean> {
  const appointments = await getAppointmentsByDate(date);
  
  // Convert request time to minutes since midnight
  const [reqHours, reqMinutes] = time.split(':').map(Number);
  const reqTimeInMinutes = reqHours * 60 + reqMinutes;
  const reqEndTimeInMinutes = reqTimeInMinutes + duration;
  
  // Check for overlaps with existing appointments
  for (const appointment of appointments) {
    const [appHours, appMinutes] = appointment.time.split(':').map(Number);
    const appTimeInMinutes = appHours * 60 + appMinutes;
    const appEndTimeInMinutes = appTimeInMinutes + appointment.duration;
    
    // Check if there's an overlap
    if (
      (reqTimeInMinutes >= appTimeInMinutes && reqTimeInMinutes < appEndTimeInMinutes) ||
      (reqEndTimeInMinutes > appTimeInMinutes && reqEndTimeInMinutes <= appEndTimeInMinutes) ||
      (reqTimeInMinutes <= appTimeInMinutes && reqEndTimeInMinutes >= appEndTimeInMinutes)
    ) {
      return false; // There is an overlap, time slot is not available
    }
  }
  
  return true; // No overlaps found, time slot is available
}

/**
 * Gets an appointment by ID
 */
export async function getAppointmentById(id: string): Promise<Appointment | null> {
  const appointments = await getAllAppointments();
  const appointment = appointments.find(app => app.id === id);
  return appointment || null;
}

/**
 * Deletes an appointment by ID
 */
export async function deleteAppointment(id: string): Promise<boolean> {
  const appointments = await getAllAppointments();
  const filteredAppointments = appointments.filter(app => app.id !== id);
  
  if (filteredAppointments.length === appointments.length) {
    return false; // No appointment was deleted
  }
  
  if (typeof window !== 'undefined') {
    // Browser environment
    localStorage.setItem(DB_KEY, JSON.stringify(filteredAppointments));
  } else {
    // Server environment
    memoryDb = filteredAppointments;
  }
  
  return true; // Appointment was deleted successfully
} 