import mongoose, { Schema } from "mongoose";

const cutoffSchema = new Schema(
  {
    jobId: {
      type: Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    examType: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    cutoff: {
      type: Number,
      required: true,
    },
    qualifyingMarks: {
      type: Number,
      default: 0,
    },
    remarks: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

cutoffSchema.index({ jobId: 1, year: 1, examType: 1 });
cutoffSchema.index({ year: 1 });

export const Cutoff = mongoose.models.Cutoff || mongoose.model("Cutoff", cutoffSchema);
