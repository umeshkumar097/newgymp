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
    console.error("WhatsApp API Error:", error.response?.data || error.message);
    throw new Error("Failed to send WhatsApp message");
  }
}

export async function sendWhatsAppVoucher(phoneNumber: string, gymName: string, bookingId: string) {
  // Similar implementation for vouchers if needed
  // For now, focusing on OTP
}
