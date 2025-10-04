// Event-App/backend/utils/sendEmail.js
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD, // should be an App Password for Gmail
  },
  tls: { rejectUnauthorized: false },
});

// Verify transporter once on startup
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Email transporter error:", error.message);
  } else {
    console.log("✅ Email transporter ready to send messages");
  }
});

const sendOtpEmail = async ({ email, fullname, otp }) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: `Password Reset OTP`,
      html: `
        <div style="font-family: Arial; padding: 20px; border: 1px solid #ccc;">
          <h2>Password Reset OTP</h2>
          <p>Hello ${fullname || "User"},</p>
          <p>Your OTP is:</p>
          <h2>${otp}</h2>
          <p>Expires in 15 minutes.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ OTP email sent to ${email}`);
  } catch (error) {
    console.error("❌ Error sending OTP email:", error.message);
    throw error;
  }
};

const sendStatusUpdateEmail = async ({ email, subject, status }) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: `Your Ticket Status Has Been Updated`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <h2 style="color: #3b82f6;">Ticket Status Update</h2>
          <p>Your ticket with subject "<strong>${subject}</strong>" is now <strong>${status}</strong>.</p>
          <p>If you have any further queries, feel free to reply to this email.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Status update email sent to ${email}`);
  } catch (error) {
    console.error("❌ Error sending status update email:", error.message);
    throw error;
  }
};

const sendBookingConfirmationEmail = async ({
  email,
  name,
  bookingId,
  eventTitle,
  date,
  totalAmount,
  tickets,
}) => {
  try {
    const formatDate = (dateString) =>
      new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

    const ticketList = tickets
      .map(
        (t) => `<li>${t.type} x ${t.quantity} - ₹${t.price * t.quantity}</li>`
      )
      .join("");

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: `✅ Booking Confirmed for ${eventTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <h2 style="color: #10b981;">Booking Confirmed!</h2>
          <p>Hello ${name},</p>
          <p>Thank you for booking with EventHive. Your booking for the event is now confirmed.</p>
          
          <h3 style="color: #3b82f6;">Event Details</h3>
          <p><strong>Event:</strong> ${eventTitle}</p>
          <p><strong>Date:</strong> ${formatDate(date)}</p>
          <p><strong>Booking ID:</strong> ${bookingId}</p>

          <h3 style="color: #3b82f6;">Tickets & Receipt</h3>
          <ul style="list-style-type: none; padding: 0;">
            ${ticketList}
          </ul>
          <p style="font-size: 1.2em; font-weight: bold; margin-top: 15px;">Total Paid: ₹${totalAmount}</p>

          <p>We look forward to seeing you there!</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Booking confirmation email sent to ${email}`);
  } catch (error) {
    console.error("❌ Error sending booking confirmation email:", error.message);
    throw error;
  }
};

const sendNewEventEmail = async ({ 
  email, 
  eventTitle, 
  eventDate, 
  eventTime,
  eventVenue,
  eventId
}) => {
  try {
    const formatDate = (dateString) =>
      new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

    // NOTE: Replace with your actual frontend URL if deployed
    const eventLink = `https://event-app.vercel.app//event/${eventId}`;

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: `✅ Event Successfully Created: ${eventTitle}`, 
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px; background-color: #ffffff;">
          <h2 style="color: #10b981; text-align: center; margin-bottom: 20px;">Your Event is Live!</h2>
          <p style="color: #333333;">Congratulations! Your new event has been successfully created and is ready to be managed.</p>
          
          <div style="margin: 20px 0; padding: 15px; background-color: #f3f4f6; border-radius: 8px;">
            <h3 style="color: #3b82f6; margin-top: 0; font-size: 18px;">Event Details Overview</h3>
            <ul style="list-style-type: none; padding: 0; margin: 0; line-height: 1.8; color: #555555;">
              <li><strong>Title:</strong> ${eventTitle}</li>
              <li><strong>Date:</strong> ${formatDate(eventDate)}</li>
              <li><strong>Time:</strong> ${eventTime}</li>
              <li><strong>Venue:</strong> ${eventVenue}</li>
            </ul>
          </div>

          <div style="margin-top: 25px; text-align: center;">
            <a href="${eventLink}" target="_blank" style="display: inline-block; padding: 12px 25px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              View & Manage Event
            </a>
          </div>

          <p style="margin-top: 25px; font-size: 12px; color: #777; text-align: center;">
            This email confirms the successful creation of your event on EventHive.
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ New event confirmation email sent to ${email}`);
  } catch (error) {
    console.error("❌ Error sending new event email:", error.message);
    throw error;
  }
};

module.exports = {
  sendOtpEmail,
  sendStatusUpdateEmail,
  sendBookingConfirmationEmail,
  sendNewEventEmail,
};
