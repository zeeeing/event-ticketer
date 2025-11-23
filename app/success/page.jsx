import { redirect } from "next/navigation";
import { Suspense } from "react";

import { stripe } from "@/lib/stripe";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function SuccessPage({ searchParams }) {
  return (
    <Suspense
      fallback={<section id="success">Loading your receipt...</section>}
    >
      <SuccessContent searchParams={searchParams} />
    </Suspense>
  );
}

async function SuccessContent({ searchParams }) {
  const { session_id } = await searchParams;

  if (!session_id) {
    throw new Error("Please provide a valid session_id (`cs_test_...`)");
  }

  const session = await stripe.checkout.sessions.retrieve(session_id);

  if (session.status === "open") {
    return redirect("/");
  }

  if (session.status === "complete") {
    const customerEmail = session?.customer_details?.email;
    const orderStatus = session?.payment_status;
    const paymentMethod =
      Object.keys(session?.payment_method_options)[0] || "Unknown";

    return (
      <section id="success" className="flex flex-col gap-4">
        <pre className="text-xs font-mono p-3 rounded border max-h-64 w-full overflow-auto">
          {JSON.stringify(session, null, 2)}
        </pre>
        <p>
          Thank you for your purchase. A confirmation email will be sent to{" "}
          {<em>{customerEmail}</em> || "your email"}.
          <br />
          <br />
          If you have any questions, please email{" "}
          <a href="mailto:orders@example.com">
            <span className="underline">orders@example.com</span>.
          </a>
        </p>
        <div className="flex flex-col p-3 rounded border">
          <p>Order Status: {orderStatus.toUpperCase()}</p>
          <p>Payment Method: {paymentMethod.toUpperCase()}</p>
        </div>

        {/* return home */}
        <div className="flex w-full justify-center">
          <Link href="/">
            <Button>Return to Home</Button>
          </Link>
        </div>
      </section>
    );
  }

  return redirect("/");
}
