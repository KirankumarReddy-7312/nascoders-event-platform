import mongoose, { Schema, Document } from 'mongoose';

export interface IBooking extends Document {
  userEmail: string;
  occasion: string;
  date: string;
  time: string;
  location: string;
  status: string;
  contactEmail: string;
  contactPhone: string;
  specialRequests?: string;
  createdAt: Date;
}

const BookingSchema: Schema = new Schema({
  userEmail: { type: String, required: true }, // To link to user
  occasion: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  location: { type: String, required: true },
  status: { type: String, default: 'Pending' },
  contactEmail: { type: String, required: true },
  contactPhone: { type: String, required: true },
  specialRequests: { type: String, required: false },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Booking || mongoose.model<IBooking>('Booking', BookingSchema);
