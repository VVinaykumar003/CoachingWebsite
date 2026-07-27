import { NextRequest, NextResponse } from "next/server";
import {connectDB} from "@/app/lib/mongodb";
import Batches from "@/app/models/batch.model";


export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {

  try{

    await connectDB();
    // Extract the dynamic [id] parameter from the URL
      const { id } = await params; 
  
    const deletedBatch = await Batches.findByIdAndDelete(id);
   if (!deletedBatch) {
         return NextResponse.json({ message: "Batch not found" }, { status: 404 });
       }
   
       return NextResponse.json({ message: "Batch deleted successfully" }, { status: 200 });
  }catch (error) {
    console.error("Error deleting course:", error);
    return NextResponse.json({ message: "Failed to delete course" }, { status: 500 });
  }
}