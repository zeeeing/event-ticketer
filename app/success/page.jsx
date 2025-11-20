import { redirect } from "next/navigation";

import { stripe } from "@/lib/stripe";

export default async function SuccessPage({ searchParams }) {
  const { session_id } = await searchParams;

  if (!session_id) {
    throw new Error("Please provide a valid session_id (`cs_test_...`)");
  }

  const session = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ["line_items", "payment_intent"],
  });

  if (session.status === "open") {
    return redirect("/protected");
  }

  if (session.status === "complete") {
    const customerEmail = session.customer_details?.email;
    return (
      <section id="success">
        <p>
          We appreciate your business! A confirmation email will be sent to{" "}
          {customerEmail || "your email"}. If you have any questions, please
          email{" "}
        </p>
        <a href="mailto:orders@example.com">
          <span className="underline">orders@example.com</span>
        </a>
        .
      </section>
    );
  }

  return redirect("/protected");
}
