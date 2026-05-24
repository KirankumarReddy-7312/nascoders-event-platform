import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Create a Nodemailer transporter using SMTP
    // Requires EMAIL_USER and EMAIL_PASS to be set in .env.local
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER || 'kiranlaptop77@gmail.com',
        pass: process.env.EMAIL_PASS || '', 
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER || 'kiranlaptop77@gmail.com',
      to: data.contactEmail,
      subject: `Booking Confirmation: ${data.occasion} Event - ${data.id}`,
      html: `
        <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #d97706;">Booking Confirmed!</h1>
          <p>Hi ${data.yourName},</p>
          <p>Thank you for booking with Euphoria! We are thrilled to help you celebrate your ${data.occasion}.</p>
          <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #92400e;">Event Details:</h3>
            <ul style="list-style: none; padding: 0;">
              <li><strong>Booking ID:</strong> ${data.id}</li>
              <li><strong>City:</strong> ${data.city}</li>
              <li><strong>Occasion:</strong> ${data.occasion}</li>
              <li><strong>Event Type:</strong> ${data.eventType}</li>
              <li><strong>Date:</strong> ${data.targetDate}</li>
              <li><strong>Time:</strong> ${data.targetTime}</li>
              <li><strong>Total Price:</strong> ₹${data.priceDetails.total.toLocaleString("en-IN")}</li>
            </ul>
          </div>
          <p>Our team will contact you shortly to finalize the arrangements.</p>
          <p>Warm regards,<br>The Euphoria Team</p>
        </div>
      `,
    };

    // If no password is provided in ENV, log it and return success for testing purposes
    // so it doesn't crash the frontend if they haven't set up the password yet.
    if (!process.env.EMAIL_PASS) {
      console.warn("EMAIL_PASS not set. Skipping actual email send. Mock success.");
      return NextResponse.json({ success: true, message: 'Mock email sent (Missing credentials)' });
    }

    await transporter.sendMail(mailOptions);
    return NextResponse.json({ success: true, message: 'Email sent successfully' });

  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ success: false, error: 'Failed to send email' }, { status: 500 });
  }
}
