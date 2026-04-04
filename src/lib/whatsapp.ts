import axios from "axios";

const PHONE_ID = (process.env.WHATSAPP_PHONE_NUMBER_ID || "").trim();
const ACCESS_TOKEN = (process.env.WHATSAPP_ACCESS_TOKEN || "").trim();
const WHATSAPP_API_URL = `https://graph.facebook.com/v20.0/${PHONE_ID}/messages`;

export async function sendWhatsAppOTP(phoneNumber: string, otp: string) {
  try {
    const response = await axios.post(
      WHATSAPP_API_URL,
      {
        messaging_product: "whatsapp",
        to: phoneNumber.startsWith("+") ? phoneNumber : `+91${phoneNumber}`,
        type: "template",
        template: {
          name: (process.env.WHATSAPP_OTP_TEMPLATE || "passfit_auth_otp").trim(),
          language: {
            code: "en",
          },
          components: [
            {
              type: "body",
              parameters: [
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
    throw error;
  }
}

export const sendWhatsAppTemplate = async (phoneNumber: string, templateName: string, parameters: string[]) => {
  try {
    const response = await axios.post(
      WHATSAPP_API_URL,
      {
        messaging_product: "whatsapp",
        to: phoneNumber.startsWith("+") ? phoneNumber : `+91${phoneNumber}`,
        type: "template",
        template: {
          name: templateName,
          language: { code: "en_US" },
          components: [
            {
              type: "body",
              parameters: parameters.map((param) => ({
                type: "text",
                text: param,
              })),
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
    console.error("WhatsApp Template Error:", error.response?.data || error.message);
    throw error;
  }
};

export const sendWelcomeMessage = async (phoneNumber: string, name: string) => {
  return sendWhatsAppTemplate(phoneNumber, "welcome_user", [name]);
};

export const sendFirstBookingCelebration = async (phoneNumber: string, name: string, gymName: string) => {
  return sendWhatsAppTemplate(phoneNumber, "first_booking_celebration", [name, gymName]);
};

export const sendWorkoutReminder = async (phoneNumber: string, name: string, gymName: string) => {
  return sendWhatsAppTemplate(phoneNumber, "workout_reminder", [name, gymName]);
};

export const sendBookingConfirmed = async (phoneNumber: string, planName: string, gymName: string, entryId: string) => {
  return sendWhatsAppTemplate(phoneNumber, "booking_confirmed_v2", [planName, gymName, entryId]);
};

export const sendBookingExpired = async (phoneNumber: string, name: string, gymName: string) => {
  return sendWhatsAppTemplate(phoneNumber, "booking_expired", [name, gymName]);
};

export const sendPostWorkoutReview = async (phoneNumber: string, gymName: string) => {
  return sendWhatsAppTemplate(phoneNumber, "post_workout_review", [gymName]);
};

export const sendGymApproved = async (phoneNumber: string, name: string, gymName: string) => {
  return sendWhatsAppTemplate(phoneNumber, "gym_approved", [name, gymName]);
};

export const sendGymRejected = async (phoneNumber: string, name: string, gymName: string, reason: string) => {
  return sendWhatsAppTemplate(phoneNumber, "gym_rejected", [name, gymName, reason]);
};

export const sendAbandonedBookingNudge = async (phoneNumber: string, name: string, gymName: string, bookingUrl: string) => {
  return sendWhatsAppTemplate(phoneNumber, "abandoned_booking_nudge", [name, gymName, bookingUrl]);
};
