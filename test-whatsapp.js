const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

/**
 * PASSFIT WHATSAPP DIAGNOSTICS
 * Run this with: node test-whatsapp.js
 */

const PHONE_ID = (process.env.WHATSAPP_PHONE_NUMBER_ID || "").trim();
const ACCESS_TOKEN = (process.env.WHATSAPP_ACCESS_TOKEN || "").trim();
const TEMPLATE_NAME = (process.env.WHATSAPP_OTP_TEMPLATE || "passfit_auth_otp").trim();

const DESTINATION_PHONE = "8449488090"; // Test number from your screenshot
const TEST_OTP = "1234";

async function testConnection() {
    console.log("--- PASSFIT WHATSAPP DIAGNOSTICS ---");
    console.log(`Target Phone: ${DESTINATION_PHONE}`);
    console.log(`Template: ${TEMPLATE_NAME}`);
    console.log(`Phone ID: ${PHONE_ID}`);
    console.log(`API URL: https://graph.facebook.com/v20.0/${PHONE_ID}/messages`);

    if (!PHONE_ID || !ACCESS_TOKEN) {
        console.error("ERROR: Missing WhatsApp credentials in .env");
        return;
    }

    try {
        const response = await axios.post(
            `https://graph.facebook.com/v20.0/${PHONE_ID}/messages`,
            {
                messaging_product: "whatsapp",
                to: `+91${DESTINATION_PHONE}`,
                type: "template",
                template: {
                    name: TEMPLATE_NAME,
                    language: { code: "en" },
                    components: [
                        {
                            type: "body",
                            parameters: [{ type: "text", text: TEST_OTP }]
                        },
                        {
                            type: "button",
                            sub_type: "url",
                            index: "0",
                            parameters: [{ type: "text", text: TEST_OTP }]
                        }
                    ]
                }
            },
            {
                headers: {
                    Authorization: `Bearer ${ACCESS_TOKEN}`,
                    "Content-Type": "application/json",
                }
            }
        );

        console.log("\n✅ SUCCESS FROM META!");
        console.log("Response Data:", JSON.stringify(response.data, null, 2));
        console.log("\nIf you don't see the message on your phone:");
        console.log("1. Check if your Meta App is in 'Development' mode.");
        console.log("2. If yes, add your number as a 'Test Number' in Meta Dashboard.");
    } catch (error) {
        console.error("\n❌ FAILED TO CONNECT TO META");
        if (error.response) {
            console.error("Status:", error.response.status);
            console.error("Error Detail:", JSON.stringify(error.response.data, null, 2));
        } else {
            console.error("Message:", error.message);
        }
    }
}

testConnection();
