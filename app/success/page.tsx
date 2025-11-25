import { redirect } from "next/navigation";
import { Suspense } from "react";

import { stripe } from "@/lib/stripe";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type SuccessPageProps = {
  searchParams: { session_id?: string | string[] };
};

export default function SuccessPage({ searchParams }: SuccessPageProps) {
  return (
    <Suspense
      fallback={<section id="success">Loading your receipt...</section>}
    >
      <SuccessContent searchParams={searchParams} />
    </Suspense>
  );
}

async function SuccessContent({ searchParams }: SuccessPageProps) {
  const sessionIdParam = searchParams?.session_id;
  const sessionId = Array.isArray(sessionIdParam)
    ? sessionIdParam[0]
    : sessionIdParam;

  if (!sessionId) {
    throw new Error("Please provide a valid session_id (`cs_test_...`)");
  }

  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (session.status === "open") {
    return redirect("/");
  }

  if (session.status === "complete") {
    const customerEmail = session?.customer_details?.email ?? "your email";
    const orderStatus =
      session?.payment_status?.toUpperCase() ?? "UNKNOWN STATUS";
    const paymentMethod = (
      Object.keys(session?.payment_method_options || {})[0] || "Unknown"
    ).toUpperCase();

    return (
      <section id="success" className="flex flex-col gap-4">
        <pre className="text-xs font-mono p-3 rounded border max-h-64 w-full overflow-auto">
          {JSON.stringify(session, null, 2)}
        </pre>
        <p>
          Thank you for your purchase. A confirmation email will be sent to{" "}
          <em>{customerEmail}</em>.
          <br />
          <br />
          If you have any questions, please email{" "}
          <a href="mailto:orders@example.com">
            <span className="underline">zingafication@gmail.com</span>.
          </a>
        </p>
        <div className="flex flex-col p-3 rounded border">
          <p>Order Status: {orderStatus}</p>
          <p>Payment Method: {paymentMethod}</p>
        </div>

        {/* return home */}
        <div className="flex w-full justify-center">
          <Button asChild>
            <Link href="/">Return to Home</Link>
          </Button>
        </div>
      </section>
    );
  }

  return redirect("/");
}
