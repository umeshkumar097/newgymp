import { sendEmail } from "./email";
import { adminMessaging } from "./firebase-admin";
import { 
  sendWhatsAppOTP,
  sendWhatsAppTemplate, 
  sendWelcomeMessage, 
} from "./whatsapp";

/**
 * PRODUCTION-GRADE NOTIFICATION ENGINE
 * Sequential, Traceable, and Robust.
 */
export const NotificationEngine = {
  
  // --- CORE AUTH NOTIFICATIONS (RESET VERSION) ---

  async sendAuthOTP(params: { 
    phone: string; 
    otp: string; 
    email?: string | null; 
    name?: string | null;
  }) {
    const { phone, otp, email, name } = params;
    const userName = name || "User";
    const report = { whatsapp: false, email: false, error: "" };

    // 1. WhatsApp Delivery
    try {
      console.log(`[AUTH] Sending WhatsApp OTP to ${phone}...`);
      await sendWhatsAppOTP(phone, otp);
      report.whatsapp = true;
    } catch (e: any) {
      const msg = e.response?.data?.error?.message || e.message;
      console.error(`[AUTH] WhatsApp Error:`, msg);
      report.error += `WHATSAPP: ${msg}. `;
    }

    // 2. Email Delivery
    if (email) {
      try {
        console.log(`[AUTH] Sending Email OTP to ${email}...`);
        const subject = `${otp} is your PassFit verification code`;
        const html = `
          <div style="font-family: sans-serif; max-width: 600px; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px;">
            <h2 style="color: #10b981;">PassFit Verification</h2>
            <p>Hello ${userName},</p>
            <p>Your verification code is: <strong>${otp}</strong></p>
            <p style="font-size: 14px; color: #6b7280;">Do not share this code.</p>
          </div>
        `;
        await sendEmail(email, subject, html);
        report.email = true;
      } catch (e: any) {
        console.error(`[AUTH] Email Error:`, e.message);
        report.error += `EMAIL: ${e.message}. `;
      }
    } else {
      report.error += "EMAIL: No address provided for register. ";
    }

    return report;
  },

  // --- PARTNER & ADMIN ACTIONS (REQUIRED FOR BUILD) ---

  async sendOnboardingConfirmation(user: { email: string; name: string; phone: string | null }, gymName: string) {
    const subject = "Application Received - PassFit Partner Program 🛡️";
    await sendEmail(user.email, subject, `<p>Hi ${user.name}, your application for ${gymName} is received.</p>`);
    if (user.phone) await sendWhatsAppTemplate(user.phone, "onboarding_received", [user.name, gymName]);
  },

  async sendApprovalNotification(user: { email: string; name: string; phone: string | null }, gymName: string, fee: number) {
    const subject = "Congratulations! Your Hub is Approved! 🚀";
    await sendEmail(user.email, subject, `<p>Hi ${user.name}, ${gymName} is approved. Activation fee: ₹${fee}</p>`);
    if (user.phone) await sendWhatsAppTemplate(user.phone, "gym_approved", [user.name, gymName]);
  },

  async sendRejectionNotification(user: { email: string; name: string; phone: string | null }, gymName: string, reason: string) {
    await sendEmail(user.email, "Application Update", `<p>Application for ${gymName} rejected: ${reason}</p>`);
    if (user.phone) await sendWhatsAppTemplate(user.phone, "gym_rejected", [user.name, gymName, reason]);
  },

  async sendWelcomePartner(user: { email: string; name: string; phone: string | null }) {
    await sendEmail(user.email, "Welcome to PassFit!", `<p>Welcome ${user.name}!</p>`);
    if (user.phone) await sendWelcomeMessage(user.phone, user.name);
  },

  // --- BOOKING NOTIFICATIONS ---

  // --- BOOKING NOTIFICATIONS ---

  async sendBookingAlertToOwner(params: {
    owner: { email: string; name: string };
    customer: { name: string; phone: string | null; email: string };
    gymName: string;
    planName: string;
    amount: number;
    dates: Date[];
    members: number;
  }) {
    const { owner, customer, gymName, planName, amount, dates, members } = params;
    const dateString = dates.map(d => new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })).join(', ');
    
    const subject = `New Booking: ${customer.name} - ${gymName} 🛡️`;
    const html = `
      <div style="font-family: sans-serif; max-width: 600px; padding: 30px; border: 1px solid #f1f5f9; border-radius: 24px; background: #fff;">
        <h2 style="color: #0f172a; margin-bottom: 20px;">New Booking Received</h2>
        <div style="background: #f8fafc; padding: 20px; border-radius: 16px; margin-bottom: 20px;">
          <p style="margin: 0; color: #64748b; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.1em;">Customer Details</p>
          <p style="margin: 10px 0 0 0; color: #0f172a; font-weight: bold; font-size: 16px;">${customer.name}</p>
          <p style="margin: 5px 0 0 0; color: #64748b; font-size: 14px;">${customer.email} | ${customer.phone || 'No Phone'}</p>
        </div>
        <div style="display: grid; grid-template-cols: 1fr 1fr; gap: 20px;">
          <div style="background: #f8fafc; padding: 20px; border-radius: 16px;">
            <p style="margin: 0; color: #64748b; font-size: 10px; font-weight: bold; text-transform: uppercase;">Dates</p>
            <p style="margin: 5px 0 0 0; color: #0f172a; font-weight: bold;">${dates.length} Days (${dateString})</p>
          </div>
          <div style="background: #f8fafc; padding: 20px; border-radius: 16px;">
            <p style="margin: 0; color: #64748b; font-size: 10px; font-weight: bold; text-transform: uppercase;">Members</p>
            <p style="margin: 5px 0 0 0; color: #0f172a; font-weight: bold;">${members} Person(s)</p>
          </div>
        </div>
        <div style="margin-top: 20px; padding: 20px; border-top: 1px solid #f1f5f9;">
          <p style="color: #64748b; font-size: 14px;">Total Payable at Gym: <strong style="color: #0f172a; font-size: 18px;">₹${amount}</strong></p>
        </div>
        <p style="font-size: 12px; color: #94a3b8; margin-top: 30px;">This is an automated operational alert from PassFit Admin.</p>
      </div>
    `;
    await sendEmail(owner.email, subject, html);
  },

  async sendBookingConfirmation(user: { phone: string; name: string }, planName: string, gymName: string, entryId: string) {
    if (user.phone) await sendWhatsAppTemplate(user.phone, "booking_confirmed_v2", [planName, gymName, entryId]);
  },

  async sendBookingInvoice(params: {
    user: { email: string; name: string; phone: string | null };
    bookingId: string;
    gymName: string;
    amount: number;
    dates: Date[];
    members: number;
  }) {
    const { user, bookingId, gymName, amount, dates, members } = params;
    const dateString = dates.map(d => new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })).join(', ');

    const subject = `Invoice for your PassFit Booking: #${bookingId.slice(-6).toUpperCase()} 🧾`;
    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #f1f5f9; border-radius: 24px; overflow: hidden; background: #fff;">
        <div style="background: #0f172a; padding: 40px; color: #fff;">
          <h1 style="margin: 0; font-size: 24px; letter-spacing: -0.02em;">Pass<span style="color: #10b981;">Fit</span></h1>
          <p style="margin: 10px 0 0 0; opacity: 0.6; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.2em;">Official Tax Invoice</p>
        </div>
        
        <div style="padding: 40px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 40px; gap: 40px;">
            <div style="flex: 1;">
              <p style="margin: 0; color: #64748b; font-size: 10px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 10px;">Billed From</p>
              <p style="margin: 0; font-weight: bold; color: #0f172a; font-size: 14px;">Aiclex Technologies</p>
              <p style="margin: 5px 0 0 0; color: #64748b; font-size: 12px; line-height: 1.5;">
                Gaur City Mall Office space sec 4<br/>
                Greater Noida UP 201318<br/>
                GSTIN: 09JAMPK1070B1ZS
              </p>
            </div>
            <div style="flex: 1; text-align: right;">
              <p style="margin: 0; color: #64748b; font-size: 10px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 10px;">Billed To</p>
              <p style="margin: 0; font-weight: bold; color: #0f172a; font-size: 14px;">${user.name}</p>
              <p style="margin: 5px 0 0 0; color: #64748b; font-size: 12px;">${user.email}</p>
              <p style="margin: 2px 0 0 0; color: #64748b; font-size: 12px;">${user.phone || ''}</p>
            </div>
          </div>

          <table style="width: 100%; border-collapse: collapse; margin-bottom: 40px;">
            <thead>
              <tr style="border-bottom: 2px solid #f8fafc;">
                <th style="padding: 15px 0; text-align: left; color: #64748b; font-size: 10px; font-weight: bold; text-transform: uppercase;">Description</th>
                <th style="padding: 15px 0; text-align: right; color: #64748b; font-size: 10px; font-weight: bold; text-transform: uppercase;">Qty</th>
                <th style="padding: 15px 0; text-align: right; color: #64748b; font-size: 10px; font-weight: bold; text-transform: uppercase;">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom: 1px solid #f8fafc;">
                <td style="padding: 20px 0;">
                  <p style="margin: 0; font-weight: bold; color: #0f172a; font-size: 14px;">HUB Access: ${gymName}</p>
                  <p style="margin: 5px 0 0 0; color: #94a3b8; font-size: 12px;">Dates: ${dateString}</p>
                </td>
                <td style="padding: 20px 0; text-align: right; color: #0f172a; font-weight: bold; vertical-align: top;">${members}</td>
                <td style="padding: 20px 0; text-align: right; color: #0f172a; font-weight: bold; vertical-align: top;">₹${amount}</td>
              </tr>
            </tbody>
          </table>

          <div style="background: #f8fafc; padding: 30px; border-radius: 20px; text-align: right;">
            <p style="margin: 0; color: #64748b; font-size: 12px; font-weight: bold; text-transform: uppercase;">Total Payable</p>
            <p style="margin: 5px 0 0 0; font-size: 32px; font-weight: 900; color: #0f172a; tracking: -0.04em;">₹${amount}</p>
          </div>
          
          <div style="margin-top: 40px; text-align: center; border-top: 1px solid #f1f5f9; pt: 30px;">
            <p style="color: #94a3b8; font-size: 11px; line-height: 1.6;">
              Thank you for choosing PassFit. This invoice is generated by Aiclex Technologies.<br/>
              Please present this at the HUB entry for check-in.
            </p>
          </div>
        </div>
      </div>
    `;
    await sendEmail(user.email, subject, html);
  },

  async sendBookingCelebration(user: { phone: string; name: string }, gymName: string) {
     if (user.phone) await sendWhatsAppTemplate(user.phone, "first_booking_celebration", [user.name, gymName]);
  },

  async sendAbandonedBookingNudge(user: { phone: string; name: string; email: string }, gymName: string, bookingUrl: string) {
    await sendEmail(user.email, "Complete Your Booking", `<p>Hi ${user.name}, finish your booking for ${gymName} here: ${bookingUrl}</p>`);
    if (user.phone) await sendWhatsAppTemplate(user.phone, "abandoned_booking_nudge", [user.name, gymName, bookingUrl]);
  }
};
