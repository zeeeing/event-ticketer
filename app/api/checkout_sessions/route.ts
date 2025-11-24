import { NextResponse } from "next/server";
import { headers } from "next/headers";

import { stripe } from "../../../lib/stripe";
import { getUser } from "../../../lib/supabase/server";

export async function POST() {
  try {
    const headersList = await headers();
    const origin = headersList.get("origin");
    const user = await getUser();

    // SECURITY BLOCK: never let a 'ghost' user pay (no user id)
    if (!user || !user.sub) {
      return NextResponse.json(
        { error: "You must be logged in to purchase." },
        { status: 401 }
      );
    }

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          // provide the exact Price ID of the single ticket product
          // obtained via stripe dashboard
          price: "price_1SVX2OPKVxzwbBquXBMjB8Lm",
          quantity: 1,
        },
      ],
      mode: "payment",
      // pass the Checkout Session ID back so the success page can look it up and verify
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/`,
      metadata: { userId: user.sub },
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "Unable to create checkout session" },
        { status: 500 }
      );
    }

    return NextResponse.redirect(session.url, 303);
  } catch (err: any) {
    console.error("Checkout error: ", err);
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
