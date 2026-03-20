import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    // Output environment variables for debugging
    console.log('Using DATABASE_URL from env:', process.env.DATABASE_URL?.substring(0, 20) + '...');
    
    // Try to connect to MongoDB
    const client = await clientPromise;
    const db = client.db('bookings');
    const collections = await db.listCollections().toArray();
    
    // Return success response
    return NextResponse.json({
      success: true,
      message: 'MongoDB connection successful',
      collections: collections.map(c => c.name)
    });
  } catch (error: any) {
    console.error('MongoDB connection error:', error);
    
    // Return detailed error information
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
} 