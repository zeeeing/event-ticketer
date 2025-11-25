"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export function LogoutButton() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const logout = async () => {
    setIsLoggingOut(true);
    let navigated = false;

    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      navigated = true;
      router.push("/auth/login");
      router.refresh();
    } finally {
      if (!navigated) {
        setIsLoggingOut(false);
      }
    }
  };

  return (
    <Button onClick={logout} disabled={isLoggingOut}>
      {isLoggingOut && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {isLoggingOut ? "Signing out..." : "Logout"}
    </Button>
  );
}
