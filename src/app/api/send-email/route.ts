import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    
    // Generate test SMTP service account from ethereal.email
    const testAccount = await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: testAccount.user, // generated ethereal user
        pass: testAccount.pass, // generated ethereal password
      },
    });

    const emailHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
        <div style="background-color: #f8fafc; padding: 24px; text-align: center; border-bottom: 1px solid #e5e7eb;">
          <h1 style="color: #0f172a; margin: 0; font-size: 24px;">Euphoria Celebrations</h1>
        </div>
        <div style="padding: 32px;">
          <h2 style="color: #334155; margin-top: 0;">Your ${data.occasion} is Confirmed! 🎉</h2>
          <p style="color: #64748b; line-height: 1.6;">Dear ${data.yourName || "Valued Client"},</p>
          <p style="color: #64748b; line-height: 1.6;">Get ready for something spectacular. We have received your booking for the ${data.occasion} in ${data.city}. Our concierge team is already weaving the magic.</p>
          
          <div style="background-color: #fffbeb; border: 1px solid #fef3c7; border-radius: 8px; padding: 16px; margin: 24px 0;">
            <h3 style="color: #b45309; margin-top: 0; margin-bottom: 12px; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em;">Event Summary</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 4px 0; color: #78350f; font-weight: 600;">Booking ID</td>
                <td style="padding: 4px 0; color: #92400e; text-align: right;">${data.id}</td>
              </tr>
              <tr>
                <td style="padding: 4px 0; color: #78350f; font-weight: 600;">Date</td>
                <td style="padding: 4px 0; color: #92400e; text-align: right;">${data.targetDate}</td>
              </tr>
              <tr>
                <td style="padding: 4px 0; color: #78350f; font-weight: 600;">Time</td>
                <td style="padding: 4px 0; color: #92400e; text-align: right;">${data.targetTime}</td>
              </tr>
              <tr>
                <td style="padding: 4px 0; color: #78350f; font-weight: 600;">Location</td>
                <td style="padding: 4px 0; color: #92400e; text-align: right;">${data.city}</td>
              </tr>
            </table>
          </div>
          
          <p style="color: #64748b; font-size: 14px;">We'll reach out to your registered contact number (+91 ${data.contactPhone}) shortly.</p>
        </div>
      </div>
    `;

    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: '"Euphoria Celebrations" <kiranlaptop77@gmail.com>', // sender address
      to: data.contactEmail || "client@example.com", // list of receivers
      subject: `Booking Confirmed: ${data.occasion} - ${data.id}`, // Subject line
      html: emailHtml, // html body
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

    return NextResponse.json({ 
      success: true, 
      messageId: info.messageId,
      previewUrl: nodemailer.getTestMessageUrl(info)
    });

  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json({ success: false, error: "Failed to send email" }, { status: 500 });
  }
}
