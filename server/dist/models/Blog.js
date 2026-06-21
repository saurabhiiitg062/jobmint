"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Blog = void 0;
const mongoose_1 = require("mongoose");
const BlogSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    featuredImage: { type: String },
    tags: [{ type: String }],
    seoTitle: { type: String },
    seoDescription: { type: String },
    focusKeyword: { type: String },
    views: { type: Number, default: 0 },
    publishedAt: { type: Date, default: Date.now }
}, {
    timestamps: true
});
BlogSchema.index({ title: 'text', content: 'text' });
BlogSchema.index({ slug: 1 });
exports.Blog = (0, mongoose_1.model)('Blog', BlogSchema);
