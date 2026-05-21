import Stripe from "stripe";

// Lazily instantiated so the SDK does not throw at build time
// when STRIPE_SECRET_KEY is absent from the environment.
let _instance: Stripe | null = null;

function getInstance(): Stripe {
  if (!_instance) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key)
      throw new Error("STRIPE_SECRET_KEY environment variable is not set");
    _instance = new Stripe(key, {
      apiVersion: "2026-04-22.dahlia",
    });
  }
  return _instance;
}

// Proxy keeps the same call-site API (stripe.charges.create, etc.)
const stripe = new Proxy({} as Stripe, {
  get(_target, prop: string | symbol) {
    return (getInstance() as unknown as Record<string | symbol, unknown>)[prop];
  },
});

export default stripe;
