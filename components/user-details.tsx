import type { JwtPayload } from "@supabase/supabase-js";

export function UserDetails({ user }: { user: JwtPayload }) {
  return (
    <pre className="text-xs font-mono p-3 rounded border w-full overflow-auto">
      {JSON.stringify(user, null, 2)}
    </pre>
  );
}
