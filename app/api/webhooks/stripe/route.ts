import HandleCheckoutSessionCompleted from "@/lib/stripe/handleCheckoutSessionCompleted";
import stripe from "@/lib/stripe/stripe";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature")!;

  let event: import("stripe").default.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return new Response("Webhook Error", { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed":
      await HandleCheckoutSessionCompleted(event.data.object);
      break;
    default:
      console.warn(`Unhandled event type: ${event.type}`);
      break;
  }

  return new Response("OK", { status: 200 });
}
