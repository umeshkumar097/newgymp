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
      console.error(`[AUTH] WhatsApp Error:`, e.message);
      report.error += `WhatsApp: ${e.message}. `;
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
            <p>Your one-time password (OTP) is: <strong>${otp}</strong></p>
            <p style="font-size: 14px; color: #6b7280;">Do not share this code.</p>
          </div>
        `;
        await sendEmail(email, subject, html);
        report.email = true;
      } catch (e: any) {
        console.error(`[AUTH] Email Error:`, e.message);
        report.error += `Email: ${e.message}. `;
      }
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

  async sendBookingAlertToOwner(owner: { email: string; name: string }, customer: { name: string; phone: string | null }, gymName: string, planName: string, amount: number) {
    await sendEmail(owner.email, "New Booking!", `<p>New booking for ${gymName} by ${customer.name}.</p>`);
  },

  async sendBookingConfirmation(user: { phone: string; name: string }, planName: string, gymName: string, entryId: string) {
    if (user.phone) await sendWhatsAppTemplate(user.phone, "booking_confirmed_v2", [planName, gymName, entryId]);
  },

  async sendBookingCelebration(user: { phone: string; name: string }, gymName: string) {
     if (user.phone) await sendWhatsAppTemplate(user.phone, "first_booking_celebration", [user.name, gymName]);
  },

  async sendAbandonedBookingNudge(user: { phone: string; name: string; email: string }, gymName: string, bookingUrl: string) {
    await sendEmail(user.email, "Complete Your Booking", `<p>Hi ${user.name}, finish your booking for ${gymName} here: ${bookingUrl}</p>`);
    if (user.phone) await sendWhatsAppTemplate(user.phone, "abandoned_booking_nudge", [user.name, gymName, bookingUrl]);
  }
};
