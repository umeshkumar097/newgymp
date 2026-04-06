import { NextResponse } from "next/server";
import { Cashfree, CFEnvironment } from "cashfree-pg";

// Initialize Cashfree Instance
const cashfree = new Cashfree(
  process.env.CASHFREE_ENVIRONMENT === "PRODUCTION" 
    ? CFEnvironment.PRODUCTION 
    : CFEnvironment.SANDBOX,
  process.env.CASHFREE_APP_ID || "",
  process.env.CASHFREE_SECRET_KEY || ""
);

import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: "Session required to initiate checkout" }, { status: 401 });
    }

    const { amount, customerId, customerPhone, customerEmail, orderId } = await req.json();

    // Safety: Always use the session ID if available, ignore the guest input
    const realCustomerId = (session.user as any).id || customerId;
    if (!realCustomerId || realCustomerId === "guest_user") {
        return NextResponse.json({ error: "Invalid identity signature" }, { status: 403 });
    }

    const request = {
      order_id: orderId || `order_${Date.now()}`,
      order_amount: amount,
      order_currency: "INR",
      customer_details: {
        customer_id: realCustomerId,
        customer_phone: customerPhone?.toString() || (session.user as any).phone || "9999999999",
        customer_email: customerEmail || session.user.email || "john@example.com",
      },
      order_meta: {
        return_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/checkout/verify?order_id={order_id}`,
      },
    };

    // Note: The second argument is x-api-version, using "2023-08-01" as per Cashfree docs for this payload
    const response = await cashfree.PGCreateOrder(request);
    
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("Cashfree Order Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
