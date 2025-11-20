import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col gap-16 justify-center items-center">
      <p className="text-3xl lg:text-4xl !leading-tight mx-auto max-w-2xl text-center">
        Your express ride straight into any event.
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
