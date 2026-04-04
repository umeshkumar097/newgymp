const axios = require("axios");
require("dotenv").config();

const WHATSAPP_API_URL = `https://graph.facebook.com/v21.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`;
const ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;

async function debugOTP() {
  console.log("🚀 Testing WhatsApp LIVE Delivery...");
  console.log("Using template:", process.env.WHATSAPP_OTP_TEMPLATE);
  
  const otp = "9999";
  const helpNumber = "9871881183";
  
  const payload = {
    messaging_product: "whatsapp",
    to: "+918449488090",
    type: "template",
    template: {
      name: process.env.WHATSAPP_OTP_TEMPLATE || "otp",
      language: { code: "en_US" },
      components: [
        {
          type: "body",
          parameters: [
            { type: "text", text: otp },
            { type: "text", text: helpNumber }
          ]
        },
        {
          type: "button",
          sub_type: "url",
          index: "0",
          parameters: [{ type: "text", text: otp }]
        }
      ]
    }
  };

  try {
    const response = await axios.post(WHATSAPP_API_URL, payload, {
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
    });
    console.log("✅ Meta Accepted the request!");
    console.log("Response:", JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.log("❌ Meta REJECTED the request!");
    if (error.response) {
      console.log("Error Details:", JSON.stringify(error.response.data, null, 2));
    } else {
      console.log("Error:", error.message);
    }
  }
}

debugOTP();
