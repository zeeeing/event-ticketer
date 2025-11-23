import { InfoIcon } from "lucide-react";
import Link from "next/link";

import CheckoutButton from "@/components/checkout-button";
import OrderHistoryButton from "@/components/order-history-button";
import { UserDetails } from "@/components/user-details";
import { Button } from "@/components/ui/button";
import { getUser } from "@/lib/supabase/server";
import { JwtPayload } from "@supabase/supabase-js";
import { Suspense } from "react";

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

function AuthenticatedHome({ user }: { user: JwtPayload }) {
  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <div className="w-full">
        <div className="bg-accent text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center">
          <InfoIcon size="16" strokeWidth={2} />
          Welcome back, {user.email ?? "user"}. You are signed in!
        </div>
      </div>
      <div className="flex flex-col gap-6 items-start">
        <h2 className="font-bold text-2xl">Your user details</h2>
        <Suspense>
          <UserDetails user={user} />
        </Suspense>
      </div>
      <div className="flex flex-col w-full items-center gap-4">
        <CheckoutButton />
        <OrderHistoryButton />
      </div>
    </div>
  );
}

async function HomeContent() {
  const user = await getUser();

  if (user) {
    return <AuthenticatedHome user={user} />;
  }

  return <PublicHome />;
}

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
