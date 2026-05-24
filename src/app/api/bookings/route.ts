import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Booking from '@/models/Booking';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');
    const role = searchParams.get('role');

    await connectToDatabase();

    let bookings = [];
    if (role === 'admin') {
      // Admin sees all bookings
      bookings = await Booking.find({}).sort({ createdAt: -1 });
    } else if (email) {
      // Normal user sees only their bookings
      bookings = await Booking.find({ userEmail: email }).sort({ createdAt: -1 });
    }

    return NextResponse.json({ bookings }, { status: 200 });
  } catch (error: any) {
    console.error('Fetch bookings error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userEmail, occasion, date, time, location, contactEmail, contactPhone, specialRequests } = body;

    if (!occasion || !date || !time || !location || !contactEmail || !contactPhone) {
      return NextResponse.json({ message: 'Missing required booking fields' }, { status: 400 });
    }

    await connectToDatabase();

    const newBooking = await Booking.create({
      userEmail: userEmail || 'guest', // Allow guest bookings temporarily if needed
      occasion,
      date,
      time,
      location,
      contactEmail,
      contactPhone,
      specialRequests,
      status: 'Pending'
    });

    return NextResponse.json({ message: 'Booking created successfully', booking: newBooking }, { status: 201 });
  } catch (error: any) {
    console.error('Create booking error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
