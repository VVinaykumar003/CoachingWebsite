import { NextResponse ,NextRequest } from "next/server";
import  {connectDB}  from "../../../lib/mongodb";
import blog from "../../../models/blog.model";

export const GET = async (request: NextRequest) => {
  try {
    await connectDB();

    const blogs = await blog.find();
    return NextResponse.json({
      success: true,
      blogs,
    });
  } catch (error : any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      {
        status: 500,
      }
    );
  }
}