"use server";

import { getAppUrl } from "@/lib/helper/appUrl";
import stripe from "@/lib/stripe/stripe";
import { getCreditsPack } from "@/types/billing";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { PackId } from "../../types/billing";

const PurchaseCredits = async (packId: PackId) => {
  const { userId } = auth();
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
    throw new Error("Failed to create Stripe checkout session");
  }

  redirect(session.url);
};

export default PurchaseCredits;
