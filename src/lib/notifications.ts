import { sendEmail } from "./email";
import { sendWhatsAppTemplate } from "./whatsapp";

export const NotificationEngine = {
  // 1. Onboarding Submission
  async sendOnboardingConfirmation(user: { email: string; name: string; phone: string | null }, gymName: string) {
    const subject = "Application Received - PassFit Partner Program 🛡️";
    const html = `
      <div style="font-family: sans-serif; max-width: 600px; padding: 20px; color: #333;">
        <h2 style="color: #3b82f6;">Hello ${user.name},</h2>
        <p>Thank you for submitting your application for <strong>${gymName}</strong>.</p>
        <p>Our team is currently verifying your KYC documents and legal agreement. This process usually takes less than 24 hours.</p>
        <p>We will notify you via Email and WhatsApp once your application is approved.</p>
        <br/>
        <p>Best Regards,<br/>Team PassFit</p>
      </div>
    `;

    await sendEmail(user.email, subject, html);
    if (user.phone) {
      await sendWhatsAppTemplate(user.phone, "onboarding_received", [user.name, gymName]);
    }
  },

  // 2. Approval & Activation Fee
  async sendApprovalNotification(user: { email: string; name: string; phone: string | null }, gymName: string, fee: number) {
    const subject = "Action Required: Your Gym is Approved! 🚀";
    const html = `
      <div style="font-family: sans-serif; max-width: 600px; padding: 20px; background: #f9fafb; border-radius: 12px;">
        <h2 style="color: #10b981;">Congratulations ${user.name}!</h2>
        <p>Your gym <strong>${gymName}</strong> has been approved.</p>
        <p>To go live on the PassFit marketplace, please complete the one-time activation fee:</p>
        <div style="padding: 15px; background: #fff; border: 1px solid #e5e7eb; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; font-size: 12px; color: #6b7280;">Activation Fee</p>
            <p style="margin: 5px 0 0 0; font-size: 24px; font-weight: 800; color: #10b981;">₹${fee}</p>
        </div>
        <a href="https://www.passfit.in/gym-login" style="display: inline-block; padding: 12px 24px; background: #10b981; color: #fff; text-decoration: none; border-radius: 6px; font-weight: bold;">Login & Activate Now</a>
      </div>
    `;

    await sendEmail(user.email, subject, html);
    if (user.phone) {
      await sendWhatsAppTemplate(user.phone, "gym_approved", [user.name, gymName, fee.toString()]);
    }
  },

  // 3. Activation Success (Hub Live)
  async sendActivationSuccess(user: { email: string; name: string; phone: string | null }, gymName: string) {
    const subject = "Your Hub is LIVE! Welcome to PassFit 🏙️";
    const html = `
      <div style="font-family: sans-serif; max-width: 600px; padding: 20px;">
        <h2 style="color: #3b82f6;">Welcome Aboard!</h2>
        <p>Payment received. <strong>${gymName}</strong> is now live on PassFit.</p>
        <p>You can now:</p>
        <ul>
            <li>Upload High-Quality Photos</li>
            <li>Set Day/Weekly/Monthly Pass prices</li>
            <li>Track daily walk-ins in real-time</li>
        </ul>
        <p>Your 90-Day 0% Commission period starts TODAY!</p>
      </div>
    `;

    await sendEmail(user.email, subject, html);
    if (user.phone) {
      await sendWhatsAppTemplate(user.phone, "gym_activated", [user.name, gymName]);
    }
  }
};
