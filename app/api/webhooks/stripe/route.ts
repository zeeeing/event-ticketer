import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@supabase/supabase-js";

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  // 1. Get the Raw Body
  // In Express: request.body (configured via express.raw() middleware)
  // In Next.js: We must read the text stream manually.
  const body = await req.text();

  // 2. Get the Signature
  const sig = req.headers.get("stripe-signature") as string;

  let event;

  // 3. Verify the Event (Exact match to Docs)
  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err: any) {
    // In Express: response.status(400).send(`Webhook Error: ${err.message}`);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  // 4. Handle the Event (The Switch Statement)
  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object;

      // --- YOUR CUSTOM SUPABASE LOGIC STARTS HERE ---
      await fulfillOrder(session);
      // --- YOUR CUSTOM SUPABASE LOGIC ENDS HERE ---

      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // 5. Return Success
  // In Express: response.send();
  return NextResponse.json({ received: true });
}

async function fulfillOrder(session: any) {
  const { userId } = session.metadata;

  console.log(`💰 Payment received! Session ID: ${session.id}`);

  // Initialize Admin Client (Bypasses RLS)
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { error } = await supabaseAdmin.from("tickets").insert({
    user_id: userId,
    stripe_session_id: session.id,
    amount_paid: session.amount_total / 100,
    status: "valid",
  });

  if (error) {
    console.error("Supabase Error:", error);
  } else {
    console.log("✅ Ticket saved to database");
  }
}
