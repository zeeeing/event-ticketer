import "server-only";

import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function fetchOrdersByUser(customerEmail: string) {
  if (!customerEmail) {
    return [];
  }

  const sessions = await stripe.checkout.sessions.list({
    customer_details: { email: customerEmail },
  });
  const data = sessions.data;

  return data;
}
