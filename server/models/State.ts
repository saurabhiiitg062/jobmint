import { Schema, model } from 'mongoose';

const StateSchema = new Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true }
}, {
  timestamps: true
});

export const State = model('State', StateSchema);
