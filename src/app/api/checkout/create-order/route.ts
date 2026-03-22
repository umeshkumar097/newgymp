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

export async function POST(req: Request) {
  try {
    const { amount, customerId, customerPhone, customerEmail, orderId } = await req.json();

    const request = {
      order_id: orderId || `order_${Date.now()}`,
      order_amount: amount,
      order_currency: "INR",
      customer_details: {
        customer_id: customerId || "guest_user",
        customer_phone: customerPhone?.toString() || "9999999999",
        customer_email: customerEmail || "john@example.com",
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
