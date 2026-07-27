import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/app/lib/mongodb';
import Batches from '../../../../models/batch.model';


// GET: Fetch all batches
export async function GET( request: NextRequest) {
  try {
    await connectDB();
    
    // Find all batches and sort them by newest first
    const batches = await Batches.find().sort({ createdAt: -1 });
    
    return NextResponse.json(batches, { status: 200 });
  } catch (error: unknown ) {
    console.error('Error fetching batches:', error);
    return NextResponse.json({ error: 'Failed to fetch batches' }, { status: 500 });
  }
}