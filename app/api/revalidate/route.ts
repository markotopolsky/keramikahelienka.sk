import { revalidateTag } from "next/cache";
import { supabase } from "@/lib/supabase";

/**
 * The admin calls this after it writes to the `content` or `produkty` table, so the change shows
 * on the site right away. Pages keep `revalidate = 3600` only as a fallback.
 *
 * Auth: the caller sends its Supabase access token as a Bearer header; only a valid signed-in
 * user can revalidate. An open endpoint would let anyone force page regenerations.
 */
export async function POST(request: Request) {
  const token = request.headers.get("authorization")?.replace(/^Bearer /, "").trim();

  if (!token) {
    return Response.json({ error: "Missing token." }, { status: 401 });
  }
  if (!supabase) {
    return Response.json({ error: "Supabase is not configured." }, { status: 401 });
  }

  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) {
    return Response.json({ error: "Invalid session." }, { status: 401 });
  }

  // Signed in is not enough: only users in public.admini edit the site (supabase/schema.sql)
  const { data: jeAdmin } = await supabase.rpc("je_admin").setHeader("Authorization", `Bearer ${token}`);

  if (jeAdmin !== true) {
    return Response.json({ error: "Not an admin." }, { status: 403 });
  }

  // { expire: 0 } instead of the reference project's "max": Helena saves and reloads the page
  // right away, and with "max" that first reload would still show the old text. The site is
  // small and saves are rare, so one blocking regeneration per page is cheap.
  revalidateTag("content", { expire: 0 });
  revalidateTag("produkty", { expire: 0 });

  return Response.json({ revalidated: true, at: Date.now() });
}
