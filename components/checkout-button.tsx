"use client";

import { Loader2 } from "lucide-react";
import { useState } from "react";

import { Button } from "./ui/button";

function CheckoutButton() {
  const [isLoading, setIsLoading] = useState(false);

  // Keep default form submission (server 303 redirect) but show a spinner until navigation.
  const handleSubmit = () => {
    setIsLoading(true);
  };

  return (
    <div>
      <form action="/api/checkout_sessions" method="POST" onSubmit={handleSubmit}>
        <section>
          <Button type="submit" role="link" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? "Redirecting to checkout..." : "Purchase Event Ticket"}
          </Button>
        </section>
      </form>
    </div>
  );
}

export default CheckoutButton;
