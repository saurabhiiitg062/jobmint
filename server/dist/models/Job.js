"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Job = void 0;
const mongoose_1 = require("mongoose");
const JobSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    organization: { type: String, required: true }, // e.g. SSC, UPSC, RRB
    postName: { type: String, required: true }, // e.g. Multi Tasking Staff, Junior Engineer
    vacancy: { type: Number, default: 0 },
    salary: { type: String },
    qualification: { type: String, required: true }, // e.g. 10th Pass, 12th Pass, Graduation
    ageLimit: { type: String },
    applicationFee: { type: String },
    selectionProcess: { type: String },
    importantDates: {
        applyStart: { type: String },
        applyLastDate: { type: String },
        feePaymentLastDate: { type: String },
        examDate: { type: String },
        admitCardRelease: { type: String },
        resultDeclaration: { type: String }
    },
    importantLinks: {
        applyOnline: { type: String },
        downloadNotification: { type: String },
        officialWebsite: { type: String },
        downloadAdmitCard: { type: String },
        downloadResult: { type: String },
        downloadAnswerKey: { type: String }
    },
    notificationPdf: { type: String },
    applicationStartDate: { type: Date },
    applicationLastDate: { type: Date },
    examDate: { type: Date },
    category: { type: String, required: true }, // e.g. Latest Job, Admit Card, Result, Answer Key, Syllabus, Admission, Scheme
    state: { type: String }, // e.g. Bihar, Karnataka, UP, Delhi, or Central
    tags: [{ type: String }],
    seoTitle: { type: String },
    seoDescription: { type: String },
    focusKeyword: { type: String },
    featuredImage: { type: String },
    status: { type: String, enum: ['draft', 'published'], default: 'published' },
    views: { type: Number, default: 0 },
    publishedAt: { type: Date, default: Date.now }
}, {
    timestamps: true
});
// Indexing for search performance and programmatic queries
JobSchema.index({ title: 'text', postName: 'text', organization: 'text' });
JobSchema.index({ category: 1 });
JobSchema.index({ state: 1 });
JobSchema.index({ qualification: 1 });
JobSchema.index({ organization: 1 });
exports.Job = (0, mongoose_1.model)('Job', JobSchema);
