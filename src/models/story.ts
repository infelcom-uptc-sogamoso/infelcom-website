import { IStory } from '@/interfaces';
import mongoose, { model, Model, Schema } from 'mongoose';

const storySchema = new Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
    },
    title: { type: String, required: true },
    resume: { type: String, required: true },
    content: { type: String, required: true },
    imageUrl: { type: String, required: true },
    // Optional English versions; empty → the Spanish field above is shown.
    en: { title: { type: String }, resume: { type: String }, content: { type: String } },
  },
  {
    timestamps: true,
  },
);

const Story: Model<IStory> = mongoose.models.Story || model('Story', storySchema);

export default Story;
