"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { getPaymentProvider } from "@/lib/payments/provider";
import { PRO_PRICE } from "@/lib/payments/payment-service";

export interface SubscriptionResult {
  ok: boolean;
  error?: string;
  invoiceId?: string;
  checkoutUrl?: string;
}

async function requestOrigin() {
  const configured = process.env.NEXT_PUBLIC_APP_URL;
  if (configured) return configured.replace(/\/$/, "");

  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

function paymentReference(prefix: string, id: string) {
  return `${prefix}-${Date.now().toString(36).toUpperCase()}-${id.slice(0, 8).toUpperCase()}`;
}

export async function activateSubscription(
  plan: "pro" | "commission",
  period: "monthly" | "annual" | "commission"
): Promise<SubscriptionResult> {
  const supabase = (await createClient()) as unknown as SupabaseClient;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Please log in again." };

  if (plan === "pro") {
    if (period !== "monthly" && period !== "annual") return { ok: false, error: "Choose monthly or annual billing." };

    const amount = PRO_PRICE[period];
    const ref = paymentReference("SUB", user.id);
    const { data, error } = await supabase
      .from("subscription_payments")
      .insert({
        lawyer_id: user.id,
        plan,
        period,
        amount,
        status: "pending",
        reference_number: ref,
      })
      .select("id, reference_number")
      .single();
    if (error) return { ok: false, error: error.message };

    const provider = getPaymentProvider();
    const origin = await requestOrigin();
    const invoiceId = data?.id as string | undefined;
    const checkout = await provider.createCheckout({
      amount,
      currency: "PKR",
      reference: (data?.reference_number as string | undefined) ?? ref,
      kind: "subscription",
      description: `Wakeel360 Pro ${period} subscription`,
      customerEmail: user.email ?? undefined,
      origin,
      successPath: invoiceId ? `/dashboard/lawyer/billing/${invoiceId}/invoice` : "/dashboard/lawyer/billing",
      failurePath: "/dashboard/lawyer/billing?payment=failed",
    });

    revalidatePath("/dashboard/lawyer/billing");
    return { ok: true, invoiceId, checkoutUrl: checkout.checkoutUrl };
  }

  const now = new Date().toISOString();
  const { error: lawyerErr } = await supabase
    .from("lawyers")
    .update({
      subscription_plan: "commission",
      subscription_period: "commission",
      subscription_status: "active",
      subscription_started_at: now,
      subscription_expires_at: null,
    })
    .eq("id", user.id);
  if (lawyerErr) return { ok: false, error: lawyerErr.message };

  revalidatePath("/dashboard/lawyer");
  revalidatePath("/dashboard/lawyer/billing");
  revalidatePath("/dashboard/lawyer/profile");
  revalidatePath("/find-lawyers");
  revalidatePath("/");
  return { ok: true };
}

export async function cancelSubscription(): Promise<SubscriptionResult> {
  const supabase = (await createClient()) as unknown as SupabaseClient;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Please log in again." };

  const { error } = await supabase
    .from("lawyers")
    .update({ subscription_status: "inactive" })
    .eq("id", user.id);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/dashboard/lawyer");
  revalidatePath("/dashboard/lawyer/billing");
  revalidatePath("/find-lawyers");
  return { ok: true };
}

