import mongoose from "mongoose";
import testimonial from "../../../models/testimonial.model";
import  {connectDB}  from "../../../lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export const GET = async (request: NextRequest) => {
  try {
    await connectDB();
    const testimonials = await testimonial.find();
    return NextResponse.json(testimonials, { status: 200 });
  } catch (error: any) {
    console.error("Testimonial GET error:", error);
    return NextResponse.json({ error: error?.message || "Failed to fetch testimonials" }, { status: 500 });
  }
};