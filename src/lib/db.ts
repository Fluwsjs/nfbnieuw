import { MongoClient } from 'mongodb';

// Get MongoDB connection string from environment variable
const uri = process.env.DATABASE_URL || 'mongodb+srv://nfbsalonboekingen:5izwB6NqQXmpnz6m@nfbsalon.95wds.mongodb.net/bookings?retryWrites=true&w=majority&appName=nfbsalon';

// Debug: log environment variable
console.log('MongoDB URI (first 20 chars):', uri.substring(0, 20) + '...');

// Validate the MongoDB URI before using it
if (!uri || (!uri.startsWith('mongodb://') && !uri.startsWith('mongodb+srv://'))) {
  throw new Error(`Invalid MongoDB connection string. Must start with mongodb:// or mongodb+srv://. 
  Current value starts with: ${uri.substring(0, 15)}...`);
}

// Set up MongoDB client
let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

// Debug: check URI structure
console.log('MongoDB protocol:', uri.split('://')[0]);

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export default clientPromise;

/**
 * Helper function to get a database collection
 */
export async function getCollection(collectionName: string) {
  const client = await clientPromise;
  const db = client.db('bookings');
  return db.collection(collectionName);
}

/**
 * Define booking types
 */
export interface Booking {
  id: string;
  service: string;
  treatment: string;
  price: number;
  duration: number;
  date: string;
  time: string;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    notes?: string;
  };
  createdAt: Date;
}

/**
 * Save a booking to the database
 */
export async function saveBooking(booking: Booking): Promise<Booking> {
  const collection = await getCollection('appointments');
  const result = await collection.insertOne(booking);
  
  if (!result.acknowledged) {
    throw new Error('Failed to save booking');
  }
  
  return booking;
}

/**
 * Get all bookings for a specific date
 */
export async function getBookingsByDate(date: string): Promise<Booking[]> {
  const collection = await getCollection('appointments');
  const bookings = await collection
    .find({ date })
    .sort({ time: 1 })
    .toArray() as unknown as Booking[];
  
  return bookings;
}

/**
 * Check if a time slot is available on a given date
 */
export async function isTimeSlotAvailable(date: string, time: string): Promise<boolean> {
  const collection = await getCollection('appointments');
  const existingBooking = await collection.findOne({ date, time });
  
  return !existingBooking;
}

/**
 * Get a booking by ID
 */
export async function getBookingById(id: string): Promise<Booking | null> {
  const collection = await getCollection('appointments');
  const booking = await collection.findOne({ id }) as unknown as Booking;
  
  return booking || null;
}

/**
 * Delete a booking by ID
 */
export async function deleteBooking(id: string): Promise<boolean> {
  const collection = await getCollection('appointments');
  const result = await collection.deleteOne({ id });
  
  return result.deletedCount === 1;
} 