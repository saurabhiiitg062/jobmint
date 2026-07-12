import mongoose, { Document, Schema } from 'mongoose';

export interface IOrganization extends Document {
  name: string;
  slug: string;
  logo?: string;
  metaTitle?: string;
  metaDescription?: string;
  content: string; // Tiptap HTML string
  createdAt: Date;
  updatedAt: Date;
}

const OrganizationSchema = new Schema<IOrganization>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    logo: { type: String },
    metaTitle: { type: String },
    metaDescription: { type: String },
    content: { type: String, required: true, default: '' },
  },
  { timestamps: true }
);

export const Organization = mongoose.models.Organization || mongoose.model<IOrganization>('Organization', OrganizationSchema);
