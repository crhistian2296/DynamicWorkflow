import { getCreditsPack, PackId } from "@/types/billing";
import "server-only";
import Stripe from "stripe";
import prisma from "../prisma";

export default async function HandleCheckoutSessionCompleted(
  event: Stripe.Checkout.Session,
) {
  // writeFile(
  //   "session_completed.json",
  //   JSON.stringify(session, null, 4),
  //   (err) => {
  //     if (err) {
  //       console.error("Error writing session file:", err);
  //     } else {
  //       console.log("Session file written successfully.");
  //     }
  //   },
  // );
  if (!event.metadata) throw new Error("No metadata found in session");

  const { userId, packId } = event.metadata;

  if (!userId || !packId) throw new Error("Missing session metadata");

  const purchasedPack = getCreditsPack(packId as PackId);
  if (!purchasedPack) throw new Error("Invalid packId");

  // If the user already has a balance, increment it. Otherwise, create a new balance record.
  await prisma.userBalance.upsert({
    where: { userId },
    create: {
      userId,
      credits: purchasedPack.credits,
    },
    update: {
      credits: {
        increment: purchasedPack.credits,
      },
    },
  });

  await prisma.userPurchase.create({
    data: {
      userId,
      stripeId: event?.id,
      description: `${purchasedPack.credits} - ${purchasedPack.credits} credits pack`,
      amount: event.amount_total ?? 0,
      currency: event.currency ?? "usd",
    },
  });
}
