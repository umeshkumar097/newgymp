const axios = require("axios");
require("dotenv").config();

const WHATSAPP_API_URL = `https://graph.facebook.com/v21.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`;
const ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;

async function debugOTP() {
  console.log("🚀 Starting WhatsApp OTP Debug...");
  console.log("Template:", process.env.WHATSAPP_OTP_TEMPLATE);
  console.log("Phone ID:", process.env.WHATSAPP_PHONE_NUMBER_ID);
  
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
            { type: "text", text: "PassFit" },
            { type: "text", text: "8888" }
          ]
        },
        {
          type: "button",
          sub_type: "url",
          index: "0",
          parameters: [{ type: "text", text: "8888" }]
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
    console.log("✅ SUCCESS! Message sent ID:", response.data.messages[0].id);
  } catch (error) {
    console.log("❌ FAILED!");
    if (error.response) {
      console.log("Meta Error Details:", JSON.stringify(error.response.data, null, 2));
    } else {
      console.log("Error Message:", error.message);
    }
  }
}

debugOTP();
