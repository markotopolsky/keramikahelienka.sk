import { supabase } from "@/lib/supabase";

/**
 * Pings the site to rebuild its cached pages now instead of waiting for the `revalidate`
 * window. Best-effort: if it fails, the change still shows on the next timed revalidation.
 */
export async function triggerRevalidate() {
  try {
    const {
      data: { session },
    } = await supabase!.auth.getSession();
    if (!session) return;
    await fetch("/api/revalidate", {
      method: "POST",
      headers: { authorization: `Bearer ${session.access_token}` },
    });
  } catch {
    // ignore — the timed revalidate is the fallback
  }
}
