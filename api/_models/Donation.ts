import mongoose, { Schema, Document } from 'mongoose';

export interface IDonation extends Document {
  id: string;
  type: 'individual' | 'corporate';
  name: string;
  email: string;
  phone: string;
  amount: number;
  seva_domain: string;
  pan?: string;
  is_anonymous: boolean;
  sponsorship_tier?: string;
  receipt_sent: boolean;
  payment_status: string;
  payment_method?: string;
  payment_id?: string;
  transaction_id?: string;
  proof_image?: string;
  verified?: boolean;
  order_id?: string;
  created_at: string;
}

const DonationSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true },
  type: { type: String, enum: ['individual', 'corporate'], required: true },
  name: { type: String, required: true },
  email: { type: String, default: '' },
  phone: { type: String, default: '' },
  amount: { type: Number, required: true },
  seva_domain: { type: String, default: 'General Fund' },
  pan: { type: String },
  is_anonymous: { type: Boolean, default: false },
  sponsorship_tier: { type: String },
  receipt_sent: { type: Boolean, default: false },
  payment_status: { type: String, default: 'pending' },
  payment_method: { type: String, default: 'Razorpay' },
  payment_id: { type: String },
  transaction_id: { type: String, default: '' },
  proof_image: { type: String, default: '' },
  verified: { type: Boolean, default: false },
  order_id: { type: String },
  created_at: { type: String, default: () => new Date().toISOString() }
});

export default mongoose.models.Donation || mongoose.model<IDonation>('Donation', DonationSchema);
