import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Booking from '@/models/Booking';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    
    await connectToDatabase();

    const updatedBooking = await Booking.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true }
    );

    if (!updatedBooking) {
      return NextResponse.json({ message: 'Booking not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Booking updated', booking: updatedBooking }, { status: 200 });
  } catch (error: any) {
    console.error('Update booking error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    await connectToDatabase();

    const deletedBooking = await Booking.findByIdAndDelete(id);

    if (!deletedBooking) {
      return NextResponse.json({ message: 'Booking not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Booking deleted' }, { status: 200 });
  } catch (error: any) {
    console.error('Delete booking error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
