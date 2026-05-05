import HandleCheckoutSessionCompleted from "@/lib/stripe/handleCheckoutSessionCompleted";
import stripe from "@/lib/stripe/stripe";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature") as string;

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );

    // console.log("@@@ Stripe Webhook Event:", event.type);

    switch (event.type) {
      case "checkout.session.completed":
        HandleCheckoutSessionCompleted(event.data.object);
        break;
      default:
        console.warn(`Unhandled event type: ${event.type}`);
        break;
    }

    return new NextResponse(null, { status: 200 });
  } catch (error) {
    console.error("Error processing Stripe webhook:", error);
    return new NextResponse("Webhook Error", { status: 400 });
  }
}
