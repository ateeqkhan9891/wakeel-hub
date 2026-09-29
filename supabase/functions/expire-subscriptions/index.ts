import { createClient } from "https://esm.sh/@supabase/supabase-js@2.107.0";

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return Response.json({ ok: false, error: "Method not allowed." }, { status: 405 });
  }

  const expectedSecret = Deno.env.get("CRON_SECRET");
  if (expectedSecret) {
    const token = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
    if (token !== expectedSecret) {
      return Response.json({ ok: false, error: "Unauthorized." }, { status: 401 });
    }
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceRoleKey) {
    return Response.json({ ok: false, error: "Missing Supabase service role configuration." }, { status: 500 });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from("lawyers")
    .select("id")
    .eq("subscription_plan", "pro")
    .eq("subscription_status", "active")
    .lt("subscription_expires_at", now);

  if (error) return Response.json({ ok: false, error: error.message }, { status: 500 });

  const ids = (data ?? []).map((row) => row.id);
  if (ids.length === 0) return Response.json({ ok: true, expired: 0 });

  const { error: updateError } = await supabase
    .from("lawyers")
    .update({ subscription_status: "inactive" })
    .in("id", ids);

  if (updateError) return Response.json({ ok: false, error: updateError.message }, { status: 500 });

  await supabase.from("notifications").insert(
    ids.map((id) => ({
      user_id: id,
      type: "payment",
      title: "Pro subscription expired",
      body: "Your Pro plan has expired. Renew to restore 0% commission and Pro placement.",
      related_entity_type: "subscription",
      related_entity_id: id,
    }))
  );

  return Response.json({ ok: true, expired: ids.length });
});

