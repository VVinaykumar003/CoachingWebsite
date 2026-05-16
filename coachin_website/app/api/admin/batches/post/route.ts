import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/app/lib/mongodb';
import Batches from '@/app/models/batch.model';



// POST: Create a new batch
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { batchName, batchSize, startingDate, timing } = body;

    // Basic validation
    if (!batchName || !batchSize || !startingDate || !timing) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const newBatch = new Batches({
      batchName,
      batchSize,
      startingDate,
      timing
    });

    await newBatch.save();
    return NextResponse.json({ success: true, batch: newBatch }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating batch:', error);
    return NextResponse.json({ error: 'Failed to create a new batch' }, { status: 500 });
  }
}