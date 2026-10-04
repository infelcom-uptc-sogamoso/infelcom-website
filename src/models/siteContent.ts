import mongoose, { model, Model, Schema } from 'mongoose';

export interface ISiteContent {
  key: string;
  data: unknown;
  updatedBy?: string;
  updatedAt?: Date;
}

// One document (key: 'site') holds all editable site content. `data` is validated against
// src/content/siteContent.ts by the API before saving, so the schema stays free-form here.
const siteContentSchema = new Schema(
  {
    key: { type: String, required: true, unique: true },
    data: { type: Schema.Types.Mixed, required: true },
    updatedBy: { type: String },
  },
  { timestamps: true, minimize: false },
);

const SiteContent: Model<ISiteContent> =
  mongoose.models.SiteContent || model('SiteContent', siteContentSchema);

export default SiteContent;
