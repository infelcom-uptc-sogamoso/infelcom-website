import { IProject } from '@/interfaces';
import mongoose, { model, Model, Schema } from 'mongoose';

const projectSchema = new Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    url: { type: String, required: false },
    category: {
      type: String,
      enum: {
        values: ['undergraduate', 'master', 'doctoral'],
        message: '{VALUE} no es una Categoría valida',
        default: 'undergraduate',
        required: true,
      },
    },
    // Code of the research group (groups collection); '' = not in any group.
    group: { type: String, default: '' },
    // Optional English versions; empty → the Spanish field above is shown.
    en: { title: { type: String }, description: { type: String } },
  },
  {
    timestamps: true,
  },
);

const Project: Model<IProject> = mongoose.models.Project || model('Project', projectSchema);

export default Project;
