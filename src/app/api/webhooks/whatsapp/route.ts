import { NextResponse } from "next/server";

const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || "passfit_secret_webhook_token";

/**
 * WHATSAPP WEBHOOK HANDLER
 * Callback URL: https://passfit.in/api/webhooks/whatsapp
 * Verify Token: passfit_secret_webhook_token
 */

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode && token) {
    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      console.log("[WEBHOOK] WhatsApp Verified Successfully ✅");
      return new Response(challenge, { status: 200 });
    } else {
      console.error("[WEBHOOK] WhatsApp Verification Failed ❌ (Token Mismatch)");
      return new Response("Forbidden", { status: 403 });
    }
  }

  return new Response("Invalid Request", { status: 400 });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("[WEBHOOK] Received WhatsApp Event:", JSON.stringify(body, null, 2));

    // Logic to handle specific events:
    // 1. Status Updates (delivered, read, failed)
    // 2. Incoming Messages (replies, images, location)

    const entry = body.entry?.[0];
    const changes = entry?.changes?.[0]?.value;

    if (changes?.statuses) {
      const status = changes.statuses[0];
      console.log(`[WEBHOOK] Status Update: Message ${status.id} is now ${status.status}`);
    }

    if (changes?.messages) {
      const message = changes.messages[0];
      const from = message.from;
      const text = message.text?.body;
      console.log(`[WEBHOOK] Incoming Message from ${from}: ${text}`);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[WEBHOOK] WhatsApp Event Error:", error.message);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
