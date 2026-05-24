import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
    }

    // Admin backdoor for fast access
    if ((email === "admin" || email === "admin@euphoria.com") && password === "admin@nascoders") {
      return NextResponse.json({ 
        message: 'Admin login successful', 
        user: { name: "Admin", email: "admin@euphoria.com", role: "admin" } 
      }, { status: 200 });
    }

    await connectToDatabase();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 400 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 400 });
    }

    return NextResponse.json({ 
      message: 'Login successful', 
      user: { name: user.name, email: user.email, role: user.role } 
    }, { status: 200 });

  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
