import mongoose, { Schema } from 'mongoose';

const cutoffSchema = new Schema({
  jobId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Job', 
    required: true,
    index: true
  },
  year: { 
    type: String, 
    required: true 
  },
  examType: { 
    type: String, 
    enum: ['Prelims', 'Mains', 'Interview', 'Final', 'Other'],
    default: 'Prelims'
  },
  category: { 
    type: String, 
    required: true 
  },
  cutoff: { 
    type: Number, 
    required: true 
  },
  qualifyingMarks: { 
    type: Number,
    default: 0
  },
  remarks: {
    type: String
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
}, {
  timestamps: true
});

// Compound index for efficient queries
cutoffSchema.index({ jobId: 1, year: 1, examType: 1 });
cutoffSchema.index({ year: 1 });

export const Cutoff = mongoose.model('Cutoff', cutoffSchema);
