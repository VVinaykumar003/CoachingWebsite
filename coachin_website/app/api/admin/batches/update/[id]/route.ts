import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import Batches from "@/app/models/batch.model";


export async function PUT(
  request: NextRequest,
  context: {
    params: Promise<{ id: string }>;
  },
) {
  try {
    await connectDB();

    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { message: "Batch ID is missing from URL." },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { batchName, batchSize, startingDate, timing } = body;

    const updatedBatch = await Batches.findByIdAndUpdate(id, {
      batchName,
      batchSize,
      startingDate,
      timing
    }, {
      new: true,
      runValidators: true,
    });

    if (!updatedBatch) {
      return NextResponse.json(
        { message: "Batch not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Batch updated successfully.",
        batch: updatedBatch,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Update failed:", error);

    return NextResponse.json(
      {
        message: "Something went wrong.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
