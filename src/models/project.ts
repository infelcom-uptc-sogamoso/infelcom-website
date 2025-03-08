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
        message: '{VALUE} no es una categoria valida',
        default: 'undergraduate',
        required: true,
      },
    },
    group: {
      type: String,
      enum: {
        values: ['SEMTEL', 'SCIECOM', 'SEMVR'],
        message: '{VALUE} no es un grupo valido',
        default: 'SCIECOM',
        required: true,
      },
    },
  },
  {
    timestamps: true,
  },
);

const Project: Model<IProject> = mongoose.models.Project || model('Project', projectSchema);

export default Project;
