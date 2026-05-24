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
      bcc: process.env.EMAIL_USER || 'kiranlaptop77@gmail.com',
      subject: `Booking Confirmation: ${data.occasion} Event - ${data.id}`,
      html: `
        <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto; background-color: #fff; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
          <div style="background-color: #d97706; padding: 30px; text-align: center;">
            <h1 style="color: #fff; margin: 0; font-size: 28px;">Euphoria Booking Confirmed! 🎉</h1>
          </div>
          <div style="padding: 30px;">
            <p style="font-size: 16px;">Hi <strong>${data.yourName}</strong>,</p>
            <p style="font-size: 16px;">Thank you for choosing Euphoria! We are thrilled to help you celebrate your <strong>${data.occasion}</strong>. Your magical event has been successfully registered.</p>
            
            <div style="background-color: #fef3c7; border-left: 4px solid #d97706; padding: 20px; border-radius: 4px; margin: 25px 0;">
              <h3 style="margin-top: 0; color: #92400e; font-size: 18px; border-bottom: 1px solid #fcd34d; padding-bottom: 10px;">Your Official Ticket Details:</h3>
              <table style="width: 100%; border-collapse: collapse; font-size: 15px;">
                <tr><td style="padding: 8px 0; color: #92400e;"><strong>Booking ID:</strong></td> <td style="padding: 8px 0; font-family: monospace; font-size: 16px;">${data.id}</td></tr>
                <tr><td style="padding: 8px 0; color: #92400e;"><strong>Date & Time:</strong></td> <td style="padding: 8px 0;">${data.targetDate} at ${data.targetTime}</td></tr>
                <tr><td style="padding: 8px 0; color: #92400e;"><strong>Event Type:</strong></td> <td style="padding: 8px 0;">${data.eventType} (${data.occasion})</td></tr>
                <tr><td style="padding: 8px 0; color: #92400e;"><strong>City & Venue:</strong></td> <td style="padding: 8px 0;">${data.city} - ${data.venueAddress || 'Not specified'}</td></tr>
                <tr><td style="padding: 8px 0; color: #92400e;"><strong>Guest of Honor:</strong></td> <td style="padding: 8px 0;">${data.targetPerson} (${data.relationship})</td></tr>
                <tr><td style="padding: 8px 0; color: #92400e;"><strong>Total Guests:</strong></td> <td style="padding: 8px 0;">${data.guestCount}</td></tr>
              </table>
            </div>

            <div style="margin: 25px 0;">
              <h3 style="color: #4b5563; font-size: 16px; border-bottom: 1px solid #e5e7eb; padding-bottom: 8px;">Contact Information Provided:</h3>
              <p style="margin: 5px 0; font-size: 14px;"><strong>Email:</strong> ${data.contactEmail}</p>
              <p style="margin: 5px 0; font-size: 14px;"><strong>Phone:</strong> ${data.contactPhone}</p>
              ${data.guestPhone && data.guestPhone !== 'Not Provided' ? `<p style="margin: 5px 0; font-size: 14px;"><strong>Guest's Phone:</strong> ${data.guestPhone}</p>` : ''}
            </div>
            
            <div style="background-color: #f3f4f6; padding: 15px; border-radius: 6px; text-align: center; margin: 25px 0;">
              <p style="margin: 0; font-size: 18px; color: #1f2937;"><strong>Total Estimate:</strong> ₹${data.priceDetails.total.toLocaleString("en-IN")}</p>
            </div>

            <p style="font-size: 15px; color: #4b5563;">Our event planning team will contact you shortly on the phone number provided to finalize all the magical arrangements.</p>
            <p style="font-size: 15px; color: #4b5563; margin-top: 30px;">Warm regards,<br><strong>The Euphoria Team</strong></p>
          </div>
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
