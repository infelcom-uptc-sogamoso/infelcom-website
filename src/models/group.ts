import { IGroup } from '@/interfaces';
import mongoose, { model, Model, Schema } from 'mongoose';

const groupSchema = new Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, required: true },
    description: { type: String, default: '' },
    objectives: { type: String, default: '' },
    lines: { type: String, default: '' },
    info: { type: String, default: '' },
    logo: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
    // People come from the researchers collection, so editing a researcher updates every group.
    director: { type: Schema.Types.ObjectId, ref: 'Researcher', default: null },
    members: [{ type: Schema.Types.ObjectId, ref: 'Researcher' }],
    // Optional English versions; empty → the Spanish field above is shown.
    en: {
      name: { type: String },
      description: { type: String },
      objectives: { type: String },
      lines: { type: String },
      info: { type: String },
    },
  },
  { timestamps: true },
);

const Group: Model<IGroup> = mongoose.models.Group || model('Group', groupSchema);

export default Group;
