import axios from "axios";

const WHATSAPP_API_URL = `https://graph.facebook.com/v21.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`;
const ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;

export async function sendWhatsAppOTP(phoneNumber: string, otp: string, gymName: string) {
  try {
    const response = await axios.post(
      WHATSAPP_API_URL,
      {
        messaging_product: "whatsapp",
        to: phoneNumber.startsWith("+") ? phoneNumber : `+91${phoneNumber}`,
        type: "template",
        template: {
          name: process.env.WHATSAPP_OTP_TEMPLATE || "otp",
          language: {
            code: "en_US",
          },
          components: [
            {
              type: "body",
              parameters: [
                {
                  type: "text",
                  text: gymName,
                },
                {
                  type: "text",
                  text: otp,
                },
              ],
            },
            {
              type: "button",
              sub_type: "url",
              index: "0",
              parameters: [
                {
                  type: "text",
                  text: otp,
                },
              ],
            },
          ],
        },
      },
      {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.error("WhatsApp API Detailed Error:", JSON.stringify(error.response.data, null, 2));
    } else {
      console.error("WhatsApp API Error:", error.message);
    }
    throw new Error("Failed to send WhatsApp message");
  }
}

// 1. Welcome Message
export async function sendWelcomeMessage(phoneNumber: string, name: string) {
  return sendWhatsAppTemplate(phoneNumber, "welcome_message", [name]);
}

// 2. First Booking Celebration
export async function sendFirstBookingCelebration(phoneNumber: string, name: string, gymName: string) {
  return sendWhatsAppTemplate(phoneNumber, "first_booking_celebration", [name, gymName]);
}

// 3. Workout Reminder
export async function sendWorkoutReminder(phoneNumber: string, name: string, gymName: string) {
  return sendWhatsAppTemplate(phoneNumber, "workout_reminder", [name, gymName]);
}

// 4. Booking Confirmation
export async function sendBookingConfirmed(phoneNumber: string, planName: string, gymName: string, entryId: string) {
  return sendWhatsAppTemplate(phoneNumber, "booking_confirmed1", [planName, gymName, entryId]);
}

// 5. Booking Expired
export async function sendBookingExpired(phoneNumber: string, name: string, gymName: string) {
  return sendWhatsAppTemplate(phoneNumber, "booking_expired", [name, gymName]);
}

// 6. Post Workout Review
export async function sendPostWorkoutReview(phoneNumber: string, gymName: string) {
  return sendWhatsAppTemplate(phoneNumber, "post_workout_review", [gymName]);
}

// 7. Gym Approval Final
export async function sendGymApproved(phoneNumber: string, name: string, gymName: string) {
  return sendWhatsAppTemplate(phoneNumber, "gym_approve", [name, gymName]);
}

// 8. Gym Rejected Final
export async function sendGymRejected(phoneNumber: string, name: string, gymName: string, reason: string) {
  return sendWhatsAppTemplate(phoneNumber, "gym_reject", [name, gymName, reason]);
}

// 9. Abandoned Booking Recovery Nudge
export async function sendAbandonedBookingNudge(phoneNumber: string, name: string, gymName: string, bookingUrl: string) {
  return sendWhatsAppTemplate(phoneNumber, "booking_abandoned_recovery", [name, gymName, bookingUrl]);
}

export async function sendWhatsAppTemplate(phoneNumber: string, templateName: string, parameters: any[]) {
  try {
    const response = await axios.post(
      WHATSAPP_API_URL,
      {
        messaging_product: "whatsapp",
        to: phoneNumber.startsWith("+") ? phoneNumber : `+91${phoneNumber}`,
        type: "template",
        template: {
          name: templateName,
          language: {
            code: "en_US",
          },
          components: [
            {
              type: "body",
              parameters: parameters.map(p => ({ type: "text", text: p })),
            },
          ],
        },
      },
      {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error("WhatsApp API Error:", error.response?.data || error.message);
    // Log but don't crash if WhatsApp fails (Email is primary)
    return null;
  }
}

export async function sendWhatsAppVoucher(phoneNumber: string, gymName: string, bookingId: string) {
    return sendWhatsAppTemplate(phoneNumber, "gym_voucher", [gymName, bookingId]);
}
