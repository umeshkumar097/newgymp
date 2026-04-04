import nodemailer from "nodemailer";

/**
 * PassFit Professional Email Delivery Engine
 * Optimized for Enterprise SMTP (Hostinger/Zoho/Gmail)
 */

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.hostinger.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_PORT === "465", // true for 465, false for 587 (STARTTLS)
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    // Crucial for some Indian hosting providers to avoid tunnel certificate rejections
    rejectUnauthorized: false,
    minVersion: "TLSv1.2"
  },
  // Increase timeouts for slower SMTP handshakes
  connectionTimeout: 10000, 
  greetingTimeout: 10000,
  socketTimeout: 10000,
});

export const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    console.log(`[EMAIL] Attempting delivery to ${to}...`);
    
    // Verify connection before each send in case of stale pooled connections
    await transporter.verify().catch(err => {
        console.warn(`[EMAIL] Transport verification warning: ${err.message}`);
    });

    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || `"PassFit Hub" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });

    console.log(`[EMAIL] ✅ Success! Message ID: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error("[EMAIL] ❌ DELIVERY FAILURE:", {
        recipient: to,
        message: error.message,
        code: error.code,
        command: error.command,
        response: error.response
    });
    return { success: false, error: error.message };
  }
};
