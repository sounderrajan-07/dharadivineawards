import mongoose, { Schema, Document } from 'mongoose';

export interface IDelegate extends Document {
  id: string;
  delegate_name: string;
  email: string;
  phone: string;
  organization?: string;
  interest?: string;
  specialNotes?: string;
  pass_tier: string;
  ticket_count: number;
  pass_code: string;
  checked_in: boolean;
  checkin_time?: string;
  seat_zone?: string;
  payment_status?: string;
  payment_id?: string;
  order_id?: string;
  amount?: number;
  created_at: string;
}

const DelegateSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true },
  delegate_name: { type: String, required: true },
  email: { type: String, default: '' },
  phone: { type: String, required: true },
  organization: { type: String },
  interest: { type: String },
  specialNotes: { type: String },
  pass_tier: { type: String, required: true },
  ticket_count: { type: Number, default: 1 },
  pass_code: { type: String, required: true, unique: true },
  checked_in: { type: Boolean, default: false },
  checkin_time: { type: String },
  seat_zone: { type: String, default: 'Zone B - Seva Row 10' },
  payment_status: { type: String, default: 'PENDING' },
  payment_id: { type: String },
  order_id: { type: String },
  amount: { type: Number },
  created_at: { type: String, default: () => new Date().toISOString() }
});

export default mongoose.models.Delegate || mongoose.model<IDelegate>('Delegate', DelegateSchema);
