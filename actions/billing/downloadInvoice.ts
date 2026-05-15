"use server";

import prisma from "@/lib/prisma";
import stripe from "@/lib/stripe/stripe";
import { auth } from "@clerk/nextjs/server";

export const DownloadInvoice = async (id: string) => {
  const { userId } = await auth.protect();
  if (!userId) {
    throw new Error("Unauthenticated");
  }

  const purchase = await prisma.userPurchase.findUnique({
    where: { id, userId },
  });

  if (!purchase) {
    throw new Error("Purchase not found");
  }

  const session = await stripe.checkout.sessions.retrieve(purchase.stripeId);

  if (!session || !session.invoice) {
    throw new Error("Invoice not found for this purchase");
  }

  const invoice = await stripe.invoices.retrieve(session.invoice as string);

  if (!invoice || !invoice.hosted_invoice_url) {
    throw new Error("Invoice PDF not available");
  }

  return invoice.hosted_invoice_url;
};
