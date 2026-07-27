import mongoose, { Schema, Document } from 'mongoose';

export interface IEvent extends Document {
  id: string;
  type: 'image' | 'video';
  category: string;
  title: string;
  image: string;
  description: string;
  youtubeId?: string;
  duration?: string;
  featured?: boolean;
  priority?: number;
}

const EventSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true },
  type: { type: String, enum: ['image', 'video'], default: 'image' },
  category: { type: String, required: true },
  title: { type: String, required: true },
  image: { type: String, default: '' },
  description: { type: String, default: '' },
  youtubeId: { type: String },
  duration: { type: String },
  featured: { type: Boolean, default: false },
  priority: { type: Number, default: 0 }
});

export default mongoose.models.Event || mongoose.model<IEvent>('Event', EventSchema);
