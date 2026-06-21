import { Schema, model } from 'mongoose';

const CategorySchema = new Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  description: { type: String }
}, {
  timestamps: true
});

export const Category = model('Category', CategorySchema);
