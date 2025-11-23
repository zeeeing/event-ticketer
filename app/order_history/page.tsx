import { Suspense } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { getUser } from "@/lib/supabase/server";
import { fetchOrdersByUser } from "@/lib/stripe";

export default async function OrderHistoryPage() {
  const user = await getUser();
  const customerEmail = user?.email || "";

  const data = await fetchOrdersByUser(customerEmail);

  return (
    <section className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold">Order history</h1>
        <Suspense>
          <p className="text-sm text-muted-foreground">
            Viewing orders for <span className="font-bold">{user?.email}</span>
          </p>
        </Suspense>
      </header>

      <Suspense>
        <pre className="text-xs font-mono p-3 rounded border max-h-64 w-full overflow-auto">
          {JSON.stringify(data, null, 2)}
        </pre>
      </Suspense>

      <Suspense>
        {!customerEmail || data.length === 0 ? (
          <div className="rounded-md border p-4 flex flex-col gap-3">
            <p className="text-sm text-muted-foreground">
              We could not find any orders from your account.
            </p>
            <div>
              <Button asChild>
                <Link href="/">Purchase your first ticket</Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid gap-4">
            {data.map((session) => {
              const totalAmount = session.amount_total
                ? session.currency?.toUpperCase() +
                  " " +
                  (session.amount_total / 100).toFixed(2)
                : "Unable to retrieve price";
              const createdDate = new Date(
                session.created * 1000
              ).toLocaleDateString("en-SG", {
                year: "numeric",
                month: "long",
                day: "numeric",
              });
              const paymentStatus = session.payment_status;
              const receiptEmail =
                session.customer_details?.email || "Not specified";

              return (
                <article
                  key={session.id}
                  className="rounded-md border p-4 flex flex-col gap-3"
                >
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex flex-col gap-1">
                      <p className="text-sm text-muted-foreground">
                        Order #{session.id.slice(-12)}
                      </p>
                      <p className="text-xl font-semibold">{totalAmount}</p>
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                      <p className="uppercase tracking-wide font-semibold text-foreground">
                        {paymentStatus}
                      </p>
                      <p>Order created: {createdDate}</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                    <p>Receipt sent to {receiptEmail}</p>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </Suspense>
    </section>
  );
}
