import { NextRequest, NextResponse } from 'next/server';

interface WebVitalMetric {
  name: string;
  delta: number;
  id: string;
  navigationType?: number;
  page?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: WebVitalMetric = await request.json();
    
    if (!body || !body.name || typeof body.delta !== 'number') {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    // Get the origin for the request
    const origin = request.headers.get('origin') || '';
    
    // Log the metrics for monitoring
    console.log(`
      Web Vital: ${body.name}
      Value: ${body.delta}
      ID: ${body.id}
      Page: ${body.page || 'unknown'}
      Navigation Type: ${body.navigationType || 'unknown'}
      Origin: ${origin}
    `);
    
    // Here you would typically store the metrics in a database or send to analytics
    // This example just logs the metrics but you could extend it to:
    // 1. Store in MongoDB
    // 2. Send to Google Analytics
    // 3. Push to a dedicated metrics service
    
    return NextResponse.json(
      { success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing web vitals:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 