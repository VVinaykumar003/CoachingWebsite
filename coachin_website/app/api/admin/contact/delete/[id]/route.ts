import { NextRequest, NextResponse } from "next/server";
import {connectDB} from "@/app/lib/mongodb"; // adjust to your db util
import Contact from "@/app/models/contactInquiry.model";   // adjust to your model path

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  await connectDB();
  await Contact.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}