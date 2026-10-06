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
    lastName: { type: String, default: '' },
    imageUrl: { type: String, default: '' },
    type: { type: String, required: true },
    email: { type: String, required: true },
    cvlacUrl: { type: String, default: '' },
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
    // Optional English versions; empty → the Spanish field above is shown.
    en: { type: { type: String } },
  },
  {
    timestamps: true,
  },
);

const Researcher: Model<IResearcher> =
  mongoose.models.Researcher || model('Researcher', researcherSchema);

export default Researcher;
