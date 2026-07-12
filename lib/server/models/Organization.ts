import mongoose, { Document, Schema } from 'mongoose';

export interface IOrganization extends Document {
  name: string;
  slug: string;
  logo?: string;
  metaTitle?: string;
  metaDescription?: string;
  parentOrganization?: string | mongoose.Types.ObjectId;
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
    parentOrganization: { type: Schema.Types.ObjectId, ref: 'Organization' },
    content: { type: String, required: true, default: '' },
  },
  { timestamps: true }
);

export const Organization = mongoose.models.Organization || mongoose.model<IOrganization>('Organization', OrganizationSchema);
