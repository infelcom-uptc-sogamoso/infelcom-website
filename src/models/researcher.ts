import { IResearcher } from '@/interfaces';
import mongoose, { Schema, model, Model } from 'mongoose';

const researcherSchema = new Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
    },
    name: { type: String, required: true },
    lastName: { type: String, required: true },
    imageUrl: { type: String, required: true },
    type: { type: String, required: true },
    email: { type: String, required: true },
    cvlacUrl: { type: String, required: true },
    isShowed: { type: Boolean, required: true },
    category: {
      type: String,
      enum: {
        values: ['undergraduate', 'master', 'doctoral'],
        message: '{VALUE} no es una Categoría valida',
        default: 'undergraduate',
        required: true,
      },
    },
    role: {
      type: String,
      enum: {
        values: ['professor', 'student'],
        message: '{VALUE} no es un rol valido',
        default: 'client',
        required: true,
      },
    },
  },
  {
    timestamps: true,
  },
);

const Researcher: Model<IResearcher> =
  mongoose.models.Researcher || model('Researcher', researcherSchema);

export default Researcher;
