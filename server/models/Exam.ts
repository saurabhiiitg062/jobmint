import { Schema, model } from 'mongoose';

const ExamSchema = new Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  organization: { type: String, required: true },
  overview: { type: String },
  importantDates: {
    applyStart: { type: String },
    applyLastDate: { type: String },
    feePaymentLastDate: { type: String },
    examDate: { type: String },
    admitCardRelease: { type: String },
    resultDeclaration: { type: String }
  },
  eligibility: {
    qualification: { type: String },
    ageLimit: { type: String }
  },
  applicationFee: { type: String },
  vacancyDetails: [{
    title: { type: String, required: true },
    columns: [{ type: String, required: true }],
    rows: [[Schema.Types.Mixed]]
  }]
}, {
  timestamps: true
});

ExamSchema.index({ title: 'text', organization: 'text' });
ExamSchema.index({ slug: 1 });

export const Exam = model('Exam', ExamSchema);
