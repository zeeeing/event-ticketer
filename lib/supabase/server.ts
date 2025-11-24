import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { JwtPayload } from "@supabase/supabase-js";
import type { TicketRecord } from "@/types/ticket";

/**
 * Especially important if using Fluid compute: Don't put this client in a
 * global variable. Always create a new client within each function when using
 * it.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have proxy refreshing
            // user sessions.
          }
        },
      },
    }
  );
}

export async function getUser(): Promise<JwtPayload | null> {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    return null;
  }

  return data.claims;
}

export async function fetchTicketsForUser(
  userId?: string
): Promise<TicketRecord[]> {
  if (!userId) {
    return [];
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("tickets")
    .select(
      "id, created_at, user_id, stripe_session_id, amount_paid, ticket_code, status"
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching tickets for user", error);
    return [];
  }

  return data ?? [];
}
