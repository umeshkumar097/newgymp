import { sendEmail } from "./email";
import { 
  sendWhatsAppTemplate, 
  sendWelcomeMessage, 
  sendFirstBookingCelebration, 
  sendWorkoutReminder as sendWSWorkoutReminder, 
  sendBookingConfirmed, 
  sendBookingExpired as sendWSBookingExpired, 
  sendPostWorkoutReview, 
  sendGymApproved, 
  sendGymRejected,
  sendAbandonedBookingNudge as sendWSAbandonedBookingNudge
} from "./whatsapp";

export const NotificationEngine = {
  // --- PARTNER NOTIFICATIONS ---

  // 0. Welcome & Account Activation (Onboarding Step 1)
  async sendWelcomePartner(user: { email: string; name: string; phone: string | null }) {
    const subject = "Activate Your PassFit Partner Account! 🚀";
    const html = `
      <div style="font-family: sans-serif; max-width: 600px; padding: 20px; color: #333;">
        <h2 style="color: #10b981;">Welcome to PassFit, ${user.name}!</h2>
        <p>Your partner account has been created successfully.</p>
        <p>To start accepting customers and listing your gym, please complete your onboarding details: </p>
        <ul>
            <li>Business Information & Photos</li>
            <li>KYC Verification (PAN, Bank)</li>
            <li>Legal Agreement</li>
        </ul>
        <a href="https://passfit.in/partner/onboarding" style="display: inline-block; padding: 12px 24px; background: #10b981; color: #fff; text-decoration: none; border-radius: 6px; font-weight: bold;">Complete Onboarding Now</a>
        <br/><br/>
        <p>Once you submit the details, our team will review your application within 24 hours.</p>
        <p>Best Regards,<br/>Team PassFit</p>
      </div>
    `;
    await sendEmail(user.email, subject, html);
    if (user.phone) {
      await sendWelcomeMessage(user.phone, user.name);
    }
  },

  // 1. Onboarding Submission (Final Step)
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

  // 2. Approval (Activation Fee Pending)
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
        <a href="https://passfit.in/gym-login" style="display: inline-block; padding: 12px 24px; background: #10b981; color: #fff; text-decoration: none; border-radius: 6px; font-weight: bold;">Login & Activate Now</a>
      </div>
    `;

    await sendEmail(user.email, subject, html);
    if (user.phone) {
      await sendGymApproved(user.phone, user.name, gymName);
    }
  },

  // 3. Rejection Notification
  async sendRejectionNotification(user: { email: string; name: string; phone: string | null }, gymName: string, reason: string) {
    const subject = "PassFit Application Update - Action Required 🛡️";
    const html = `
      <div style="font-family: sans-serif; max-width: 600px; padding: 20px;">
        <h3 style="color: #ef4444;">Application Update</h3>
        <p>Hi ${user.name}, we reviewed your application for <strong>${gymName}</strong>.</p>
        <p>Unfortunately, we could not approve it at this time due to: <strong>${reason}</strong></p>
        <p>Please log in to your dashboard to resolve this or contact support.</p>
      </div>
    `;
    await sendEmail(user.email, subject, html);
    if (user.phone) {
      await sendGymRejected(user.phone, user.name, gymName, reason);
    }
  },

  // 4. Activation Success (Hub Live)
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
  },

  // 5. Booking Alert to Gym Owner
  async sendBookingAlertToOwner(owner: { email: string; name: string }, customer: { name: string; phone: string | null }, gymName: string, planName: string, amount: number) {
    const subject = `New Booking Received! 🏋️‍♂️ - ${customer.name}`;
    const html = `
      <div style="font-family: sans-serif; max-width: 600px; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px;">
        <h2 style="color: #10b981;">New Hub Booking!</h2>
        <p>Hello ${owner.name}, you have a new customer booking for <strong>${gymName}</strong>.</p>
        
        <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; font-size: 12px; color: #6b7280; text-transform: uppercase;">Customer Details</p>
            <p style="margin: 5px 0; font-size: 16px; font-weight: bold; color: #111827;">${customer.name}</p>
            <p style="margin: 0; font-size: 14px; color: #4b5563;">Phone: ${customer.phone || 'N/A'}</p>
            
            <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 15px 0;" />
            
            <p style="margin: 0; font-size: 12px; color: #6b7280; text-transform: uppercase;">Plan Details</p>
            <p style="margin: 5px 0; font-size: 16px; font-weight: bold; color: #111827;">${planName}</p>
            <p style="margin: 0; font-size: 18px; font-weight: 800; color: #10b981;">₹${amount}</p>
        </div>
        
        <p style="font-size: 14px; color: #6b7280;">Please ensure the facility is ready. You can verify the customer's Entry ID at the desk.</p>
        <br/>
        <p>Best Regards,<br/>Team PassFit</p>
      </div>
    `;
    await sendEmail(owner.email, subject, html);
  },

  // --- USER NOTIFICATIONS ---

  async sendUserWelcome(phoneNumber: string, name: string) {
    await sendWelcomeMessage(phoneNumber, name);
  },

  async sendBookingCelebration(user: { phone: string; name: string }, gymName: string) {
     await sendFirstBookingCelebration(user.phone, user.name, gymName);
  },

  async sendBookingConfirmation(user: { phone: string; name: string }, planName: string, gymName: string, entryId: string) {
     await sendBookingConfirmed(user.phone, planName, gymName, entryId);
  },

  async sendWorkoutReminder(user: { phone: string; name: string }, gymName: string) {
     await sendWSWorkoutReminder(user.phone, user.name, gymName);
  },

  async sendBookingExpiredNotification(user: { phone: string; name: string }, gymName: string) {
     await sendWSBookingExpired(user.phone, user.name, gymName);
  },

  async sendReviewRequestNotification(user: { phone: string; name: string }, gymName: string) {
     await sendPostWorkoutReview(user.phone, gymName);
  },

  async sendAbandonedBookingNudge(user: { phone: string; name: string; email: string }, gymName: string, bookingUrl: string) {
    const subject = "Don't miss out on your fitness goals! 🏋️‍♂️";
    const html = `
      <div style="font-family: sans-serif; max-width: 600px; padding: 20px;">
        <h2 style="color: #3b82f6;">Hey ${user.name}!</h2>
        <p>We noticed you were looking at <strong>${gymName}</strong> but didn't finish your booking.</p>
        <p>Your fitness journey is just a few clicks away. Don't let your goals slip!</p>
        <a href="${bookingUrl}" style="display: inline-block; padding: 12px 24px; background: #3b82f6; color: #fff; text-decoration: none; border-radius: 6px; font-weight: bold;">Complete Your Booking</a>
        <br/><br/>
        <p>Best Regards,<br/>Team PassFit</p>
      </div>
    `;
    await sendEmail(user.email, subject, html);
    if (user.phone) {
      await sendWSAbandonedBookingNudge(user.phone, user.name, gymName, bookingUrl);
    }
  }
};
