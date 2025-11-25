import Link from "next/link";

import CheckoutButton from "@/components/checkout-button";
import OrderHistoryButton from "@/components/order-history-button";
import TicketCarousel from "@/components/ticket-carousel";
import { Button } from "@/components/ui/button";
import { getUser } from "@/lib/supabase/server";
import { fetchTicketsForUser } from "@/lib/supabase/server";
import type { TicketRecord } from "@/types/ticket";
import { JwtPayload } from "@supabase/supabase-js";
import { Suspense } from "react";

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="w-full flex justify-center">
          <p className="text-sm text-muted-foreground">
            Loading your experience...
          </p>
        </div>
      }
    >
      <HomeContent />
    </Suspense>
  );
}

async function HomeContent() {
  const user = await getUser();

  if (user) {
    const tickets = await fetchTicketsForUser(user.sub as string | undefined);
    return <AuthenticatedHome user={user} tickets={tickets} />;
  }

  return <PublicHome />;
}

function AuthenticatedHome({
  user,
  tickets,
}: {
  user: JwtPayload;
  tickets: TicketRecord[];
}) {
  return (
    <div className="flex-1 w-full flex flex-col gap-10">
      <div className="font-bold text-lg rounded-md text-foreground flex justify-center">
        Welcome back, {user.email ?? "user"}. You are signed in!
      </div>
      <div className="flex flex-col gap-4">
        <h2 className="font-bold text-2xl">Your tickets</h2>
        <p className="text-sm text-muted-foreground">
          Access all purchased tickets and their QR codes from here.
        </p>
        <TicketCarousel tickets={tickets} />
      </div>
      <div className="flex flex-col w-full items-center gap-4">
        <CheckoutButton />
        <OrderHistoryButton />
      </div>
    </div>
  );
}

function PublicHome() {
  return (
    <div className="flex flex-col flex-1 gap-16 justify-center items-center">
      <p className="text-3xl lg:text-4xl !leading-tight mx-auto max-w-2xl text-center">
        Your <em>express</em> ride into any event.
      </p>
      <div className="w-full p-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent my-8" />
      <div className="flex gap-4">
        <Button asChild size="lg" variant={"outline"}>
          <Link href="/auth/login">Sign in</Link>
        </Button>
        <Button asChild size="lg" variant={"default"}>
          <Link href="/auth/sign-up">Sign up</Link>
        </Button>
      </div>
    </div>
  );
}
