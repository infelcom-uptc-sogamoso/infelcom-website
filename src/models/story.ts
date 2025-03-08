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
  },
  {
    timestamps: true,
  },
);

const Story: Model<IStory> = mongoose.models.Story || model('Story', storySchema);

export default Story;
