import { NextResponse } from "next/server";
import Course from "../../../models/course.model";
import { connectDB } from "../../../lib/mongodb";

export const dynamic = "force-dynamic";

export const GET = async () => {
  try {
    await connectDB();
    const courses = await Course.find();
    return NextResponse.json(courses, { status: 200 });
  } catch (error: any) {
    console.error("Course GET error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to fetch courses" },
      { status: 500 }
    );
  }
};