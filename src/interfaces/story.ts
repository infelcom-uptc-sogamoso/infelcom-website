export interface IStory {
  _id?: string;
  en?: { title?: string; resume?: string; content?: string };
  code: string;
  title: string;
  resume: string;
  content: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}
