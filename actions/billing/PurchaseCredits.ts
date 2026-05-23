"use server";

import { getAppUrl } from "@/lib/helper/appUrl";
import stripe from "@/lib/stripe/stripe";
import { getCreditsPack } from "@/types/billing";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { toast } from "sonner";
import { PackId } from "../../types/billing";

const PurchaseCredits = async (packId: PackId) => {
  const { userId } = await auth.protect();
  if (!userId) {
    throw new Error("User not authenticated");
  }

  const selectedPack = getCreditsPack(packId);
  if (!selectedPack) {
    throw new Error("Invalid credits pack selected");
  }

  const priceId = selectedPack.priceId;

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    invoice_creation: {
      enabled: true,
    },
    success_url: getAppUrl("billing"),
    cancel_url: getAppUrl("billing"),
    metadata: {
      userId,
      packId,
    },
    line_items: [
      {
        quantity: 1,
        price: priceId,
      },
    ],
  });

  if (!session.url) {
    toast.error("Failed to create checkout session");
    throw new Error("Failed to create Stripe checkout session");
  }

  console.log("Redirecting to Stripe checkout with session:", session);
  redirect(session.url);
};

export default PurchaseCredits;
