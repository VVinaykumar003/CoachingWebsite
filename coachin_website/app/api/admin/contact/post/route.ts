import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/app/lib/mongodb';

// TODO: Import your Mongoose model for storing contacts when you're ready
import ContactInquiry from '@/app/models/contactInquiry.model';

export async function POST(request: NextRequest) {
  try {
    // 1. Establish database connection
    await connectDB();

    // 2. Parse the incoming request body
    const body = await request.json();
  
    const { fullName, whatsapp,batch, course, message } = body;

    // 3. Simple server-side validation
    if (!fullName || !whatsapp || !course) {
      return NextResponse.json(
        { error: 'Please provide all required fields (Name, WhatsApp, Course)' },
        { status: 400 }
      );
    }

    // 4. Save to the database (Uncomment when you have a Mongoose model ready)
    const newInquiry = new ContactInquiry({ fullName, whatsapp,batch, course, message });
    await newInquiry.save();
    
    
    // Simulate a brief delay and log the result to console for now
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('New Contact Form Submission:', { fullName, whatsapp,batch, course, message });

    // 5. Send success response back to the frontend
    return NextResponse.json({ success: true, message: 'Request received' }, { status: 201 });
  } catch (error: any) {
    console.error('Contact API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
