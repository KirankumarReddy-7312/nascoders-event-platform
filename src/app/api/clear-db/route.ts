import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectToDatabase from '@/lib/db';
import Booking from '@/models/Booking';
import User from '@/models/User';

export async function GET() {
  try {
    await connectToDatabase();
    await Booking.deleteMany({});
    await User.deleteMany({ role: { $ne: 'admin' } }); // keep admin if exists
    return NextResponse.json({ message: 'Database cleared' });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
