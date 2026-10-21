import mongoose from "mongoose";

const batchSchema = new mongoose.Schema(
  {
    batchName: {
      type: String,
      required: true,
    },
    batchSize: {
      type: String,
      required: true,
    },
    startingDate: {
      type: Date,
      required: true,
    },
    timing: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.batches || mongoose.model("batches", batchSchema);