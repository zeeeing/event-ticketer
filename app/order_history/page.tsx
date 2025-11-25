import { Suspense } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { getUser } from "@/lib/supabase/server";
import { fetchOrdersByUser } from "@/lib/stripe";

export default function OrderHistoryPage() {
  return (
    <div className="flex flex-col gap-6 w-full">
      <h1 className="text-3xl font-semibold">Order History</h1>
      <Suspense fallback={<p>Loading order history...</p>}>
        <OrderHistoryContent />
      </Suspense>
    </div>
  );
}

async function OrderHistoryContent() {
  const user = await getUser();
  const customerEmail = user?.email || "";

  const data = await fetchOrdersByUser(customerEmail);
  return (
    <>
      <p className="text-sm text-muted-foreground">
        Viewing orders for <span className="font-bold">{user?.email}</span>
      </p>

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
            const orderId = session.id.slice(-12);
            const totalAmount = session.amount_total
              ? session.currency?.toUpperCase() +
                " " +
                (session.amount_total / 100).toFixed(2)
              : "Unable to retrieve price";
            const createdDateTime = new Date(
              session.created * 1000
            ).toLocaleString("en-SG", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            });
            const paymentStatus = session.payment_status;
            const receiptEmail =
              session.customer_details?.email || "Not specified";
            const paymentMethod = (
              Object.keys(session?.payment_method_options || {})[0] || "Unknown"
            ).toUpperCase();

            return (
              <article
                key={session.id}
                className="rounded-md border p-4 flex flex-col gap-4"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex flex-col gap-1">
                    <p className="text-xs font-semibold tracking-wide text-muted-foreground">
                      Order #{orderId}
                    </p>
                    <p className="text-2xl font-semibold leading-tight">
                      {totalAmount}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1 text-sm text-muted-foreground sm:items-end sm:text-right">
                    <p className="uppercase tracking-wide font-semibold text-foreground">
                      {paymentStatus}
                    </p>
                    <p className="text-xs sm:text-sm">
                      Order created: {createdDateTime}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                  <p>Receipt sent to {receiptEmail}</p>
                  <p className="text-xs sm:text-sm">
                    Payment method: {paymentMethod}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </>
  );
}
