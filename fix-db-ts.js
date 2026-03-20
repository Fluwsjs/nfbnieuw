const fs = require('fs');
const path = require('path');

// Path to the target db.ts file
const targetFile = path.resolve(process.cwd(), 'src/lib/db.ts');

// The content for the fixed db.ts file
const fixedDbContent = `import { MongoClient, Db, ObjectId } from 'mongodb';

// Get MongoDB URI from environment variables
const uri = process.env.DATABASE_URL || '';

// Debug - only show a portion of the URI for security
console.log('MongoDB URI (first 20 chars):', uri.substring(0, 20) + '...');

// Validate MongoDB URI
if (!uri) {
  throw new Error('Please define DATABASE_URL in environment variables');
}

if (!uri.startsWith('mongodb://') && !uri.startsWith('mongodb+srv://')) {
  throw new Error('Invalid MongoDB connection string. Must start with mongodb:// or mongodb+srv://. \\n  Current value starts with: ' + uri.substring(0, 15) + '...');
}

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export interface Booking {
  _id?: ObjectId | string;
  service: string;
  treatment: string;
  date: string;
  time: string;
  price: number;
  duration: number;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    notes?: string;
  };
  createdAt?: Date;
  calendarEventId?: string;
}

export async function connectToDatabase(): Promise<{ client: MongoClient; db: Db }> {
  // If we already have a connection, return it
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  try {
    // Create new connection
    const client = await MongoClient.connect(uri);
    const db = client.db();

    // Cache the connection
    cachedClient = client;
    cachedDb = db;

    return { client, db };
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

export async function saveBooking(booking: Booking): Promise<Booking> {
  const { db } = await connectToDatabase();
  
  // Add timestamp
  booking.createdAt = new Date();
  
  const result = await db.collection('bookings').insertOne(booking);
  
  return {
    ...booking,
    _id: result.insertedId
  };
}

export async function getBookingsByDate(date: string): Promise<Booking[]> {
  const { db } = await connectToDatabase();
  
  return db.collection('bookings')
    .find({ date })
    .sort({ time: 1 })
    .toArray();
}

export async function isTimeSlotAvailable(date: string, time: string, duration: number): Promise<boolean> {
  const { db } = await connectToDatabase();
  
  const bookings = await db.collection('bookings')
    .find({ date })
    .toArray();
  
  // Parse the requested time
  const [hours, minutes] = time.split(':').map(Number);
  const requestedTime = hours * 60 + minutes;
  const requestedEndTime = requestedTime + duration;
  
  // Check if the time slot overlaps with any existing booking
  for (const booking of bookings) {
    const [bookingHours, bookingMinutes] = booking.time.split(':').map(Number);
    const bookingTime = bookingHours * 60 + bookingMinutes;
    const bookingEndTime = bookingTime + booking.duration;
    
    // Check for overlap
    if (
      (requestedTime >= bookingTime && requestedTime < bookingEndTime) ||
      (requestedEndTime > bookingTime && requestedEndTime <= bookingEndTime) ||
      (requestedTime <= bookingTime && requestedEndTime >= bookingEndTime)
    ) {
      return false;
    }
  }
  
  return true;
}

export async function getBookingById(id: string): Promise<Booking | null> {
  const { db } = await connectToDatabase();
  
  return db.collection('bookings').findOne({ _id: new ObjectId(id) });
}

export async function deleteBooking(id: string): Promise<boolean> {
  const { db } = await connectToDatabase();
  
  const result = await db.collection('bookings').deleteOne({ _id: new ObjectId(id) });
  
  return result.deletedCount === 1;
}
`;

// Write the fixed content to the file
try {
  fs.writeFileSync(targetFile, fixedDbContent);
  console.log(`Successfully fixed db.ts file at ${targetFile}`);
  console.log('The script has replaced the file with a corrected version.');
} catch (error) {
  console.error('Error writing to db.ts:', error);
} 