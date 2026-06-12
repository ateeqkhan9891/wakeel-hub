import "server-only";

import { NextResponse, type NextRequest } from "next/server";
import { confirmConsultationPayment, confirmSubscriptionPayment } from "@/lib/payments/payment-service";
import { getPaymentProviderByName } from "@/lib/payments/provider";

async function callbackParams(request: NextRequest) {
  const params = new URLSearchParams(request.nextUrl.searchParams);
  if (request.method !== "POST") return params;

  const contentType = request.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
    if (body) {
      for (const [key, value] of Object.entries(body)) {
        if (value !== undefined && value !== null) params.set(key, String(value));
      }
    }
    return params;
  }

  const form = await request.formData().catch(() => null);
  if (form) {
    for (const [key, value] of form.entries()) {
      params.set(key, String(value));
    }
  }
  return params;
}

function redirectTo(request: NextRequest, path: string, status: "success" | "failed") {
  const url = new URL(path, request.url);
  url.searchParams.set("payment", status);
  return NextResponse.redirect(url);
}

export async function handlePaymentCallback(request: NextRequest, providerName?: string) {
  try {
    const params = await callbackParams(request);
    const provider = getPaymentProviderByName(providerName ?? params.get("provider"));
    const callback = provider.parseCallback(params);
    const successPath = params.get("successPath");
    const failurePath = params.get("failurePath");

    if (!callback.reference) {
      return NextResponse.json({ ok: false, error: "Missing payment reference." }, { status: 400 });
    }

    const result = callback.reference.startsWith("SUB-")
      ? await confirmSubscriptionPayment(callback.reference, callback.status)
      : await confirmConsultationPayment(callback.reference, callback.status, callback.gatewayFee);

    if (!result.ok) return NextResponse.json(result, { status: 404 });

    if (callback.status !== "paid") {
      return redirectTo(request, failurePath ?? "/dashboard", "failed");
    }

    const derivedSuccess =
      "invoiceId" in result && result.invoiceId
        ? `/dashboard/lawyer/billing/${result.invoiceId}/invoice`
        : "paymentId" in result && result.paymentId
          ? `/dashboard/client/payments/${result.paymentId}/invoice`
          : "/dashboard";

    return redirectTo(request, successPath ?? derivedSuccess, "success");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Payment callback failed.";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
