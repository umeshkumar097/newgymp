import { sendEmail } from "./email";
import { 
  sendWhatsAppOTP,
  sendWhatsAppTemplate, 
  sendWelcomeMessage, 
} from "./whatsapp";

/**
 * Solid Notification Engine - Simple, Sequental, Traceable.
 */
export const NotificationEngine = {
  
  /**
   * Core Auth OTP - The most important function.
   * Sends code via WhatsApp (Primary) and Email (Fallback).
   */
  async sendAuthOTP(params: { 
    phone: string; 
    otp: string; 
    email?: string | null; 
    name?: string | null;
  }) {
    const { phone, otp, email, name } = params;
    const userName = name || "User";
    const report = { whatsapp: false, email: false, error: "" };

    // 1. Try WhatsApp (Primary)
    try {
      console.log(`[AUTH] Attempting WhatsApp delivery to ${phone}...`);
      await sendWhatsAppOTP(phone, otp);
      report.whatsapp = true;
      console.log(`[AUTH] WhatsApp Success for ${phone}`);
    } catch (e: any) {
      console.error(`[AUTH] WhatsApp Failed for ${phone}:`, e.message);
      report.error += `WhatsApp Fail: ${e.message}. `;
    }

    // 2. Try Email (If provided)
    if (email) {
      try {
        console.log(`[AUTH] Attempting Email delivery to ${email}...`);
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
        console.log(`[AUTH] Email Success for ${email}`);
      } catch (e: any) {
        console.error(`[AUTH] Email Failed for ${email}:`, e.message);
        report.error += `Email Fail: ${e.message}. `;
      }
    }

    return report;
  },

  // Simplified Partner Notifications
  async sendWelcomePartner(user: { email: string; name: string; phone: string | null }) {
    try {
      await sendEmail(user.email, "Welcome to PassFit!", `<h1>Welcome ${user.name}</h1>`);
      if (user.phone) await sendWelcomeMessage(user.phone, user.name);
    } catch (e) {
      console.error("Partner Notification Error:", e);
    }
  },

  async sendGymApproval(user: { email: string; name: string; phone: string | null }, gymName: string) {
    try {
       await sendEmail(user.email, "Gym Approved!", `<p>${gymName} is live!</p>`);
       if (user.phone) await sendWhatsAppTemplate(user.phone, "gym_approved", [user.name, gymName]);
    } catch (e) {
      console.error("Approval Notification Error:", e);
    }
  }
};
