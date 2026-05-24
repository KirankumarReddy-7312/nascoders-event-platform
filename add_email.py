import os
import re

# 1. Create API Route
api_dir = "src/app/api/send-email"
os.makedirs(api_dir, exist_ok=True)

api_code = """import { NextResponse } from 'next/server';
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
      from: '"Euphoria Celebrations" <kirankumarreddy7312@gmail.com>', // sender address
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
"""
with open(f"{api_dir}/route.ts", "w", encoding="utf-8") as f:
    f.write(api_code)

# 2. Modify handleSubmit in book/page.tsx
BOOK_FILE = "src/app/book/page.tsx"
with open(BOOK_FILE, "r", encoding="utf-8") as f:
    book_content = f.read()

# Add isLoading state
book_content = book_content.replace(
    '  const [bookingStep, setBookingStep] = useState(1);',
    '  const [bookingStep, setBookingStep] = useState(1);\n  const [isLoading, setIsLoading] = useState(false);'
)

new_submit = """  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const bookingData = {
      id: "EUPH-" + Math.floor(10000 + Math.random() * 90000),
      date: new Date().toISOString(),
      type: eventType,
      city: selectedCity,
      occasion: selectedOccasion,
      selectedCustomizations,
      selectedGames,
      vibe,
      guestCount,
      budgetRange,
      targetDate,
      targetTime,
      targetPerson,
      yourName,
      contactEmail,
      contactPhone,
      relationship,
      status: "Confirmed",
      quote: calculateQuote()
    };

    // 1. Send Email via API
    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData),
      });
      const data = await res.json();
      if (data.previewUrl) {
        console.log("Email Preview URL:", data.previewUrl);
      }
    } catch (err) {
      console.error("Failed to send email API request", err);
    }

    // 2. Save locally
    const sessionStr = localStorage.getItem("euphoria_session");
    let storageKey = "activeBookings";
    
    if (sessionStr) {
      const sessionObj = JSON.parse(sessionStr);
      storageKey = `activeBookings_${sessionObj.email || sessionObj.phone}`;
    }

    const existingBookings = JSON.parse(localStorage.getItem(storageKey) || "[]");
    existingBookings.unshift(bookingData);
    localStorage.setItem(storageKey, JSON.stringify(existingBookings));

    // Show notification modal when hitting profile
    localStorage.setItem("showBookingNotification", "true");
    
    // Slight delay to ensure saving
    setTimeout(() => {
      setIsLoading(false);
      router.push("/profile");
    }, 400);
  };"""

book_content = re.sub(
    r'  const handleSubmit = \(e: React\.FormEvent\) => \{.*?\n  \};\n',
    new_submit.lstrip('\n') + '\n',
    book_content,
    flags=re.DOTALL
)

# Also disable submit button while loading
book_content = book_content.replace(
    '<button type="submit" className={`${theme.accent} text-white px-8 py-4 rounded-xl font-medium transition-colors hover:opacity-90 shadow-lg ${theme.shadow} flex items-center gap-2`}>',
    '<button type="submit" disabled={isLoading} className={`${theme.accent} text-white px-8 py-4 rounded-xl font-medium transition-colors hover:opacity-90 shadow-lg ${theme.shadow} flex items-center gap-2 disabled:opacity-50`}>'
)
book_content = book_content.replace(
    '<Mail className="w-4 h-4" /> Finalize & Send Estimate',
    '{isLoading ? "Processing..." : <><Mail className="w-4 h-4" /> Finalize & Send Estimate</>}'
)

with open(BOOK_FILE, "w", encoding="utf-8") as f:
    f.write(book_content)
