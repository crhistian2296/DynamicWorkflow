export enum PackId {
  STARTER = "STARTER",
  PRO = "PRO",
  PRO_PLUS = "PRO_PLUS",
}

export type CreditsPack = {
  id: PackId;
  name: string;
  label: string;
  credits: number;
  price: number; // in cents
  priceId: string; // Stripe Price ID
};

export const StarterPack: CreditsPack = {
  id: PackId.STARTER,
  name: "Starter Pack",
  label: "1000 Credits",
  credits: 1000,
  price: 1000,
  priceId: process.env.STRIPE_PRICE_STARTER!, // Replace with your actual Stripe Price ID
};

export const ProPack: CreditsPack = {
  id: PackId.PRO,
  name: "Pro Pack",
  label: "5000 Credits",
  credits: 5000,
  price: 2000,
  priceId: process.env.STRIPE_PRICE_PRO!, // Replace with your actual Stripe Price ID
};

export const ProPlusPack: CreditsPack = {
  id: PackId.PRO_PLUS,
  name: "Pro Plus Pack",
  label: "12000 Credits",
  credits: 12000,
  price: 4000,
  priceId: process.env.STRIPE_PRICE_PRO_PLUS!, // Replace with your actual Stripe Price ID
};

export const creditsPacks: CreditsPack[] = [StarterPack, ProPack, ProPlusPack];

export const getCreditsPack = (packId: PackId): CreditsPack =>
  creditsPacks.find((pack) => pack.id === packId)!;
