import { NextResponse, type NextRequest } from "next/server";
import { signPaymentParams, verifyPaymentSignature } from "@/lib/payments/provider";

export async function GET(request: NextRequest) {
  const incoming = request.nextUrl.searchParams;
  if (!verifyPaymentSignature(incoming)) {
    return NextResponse.json({ ok: false, error: "Invalid sandbox payment signature." }, { status: 400 });
  }

  const callback = new URL("/api/payments/callback", request.url);
  callback.searchParams.set("reference", incoming.get("reference") ?? "");
  callback.searchParams.set("status", incoming.get("status") ?? "paid");
  callback.searchParams.set("kind", incoming.get("kind") ?? "consultation");
  callback.searchParams.set("provider", incoming.get("provider") ?? "sandbox");
  callback.searchParams.set("successPath", incoming.get("successPath") ?? "/dashboard");
  callback.searchParams.set("failurePath", incoming.get("failurePath") ?? "/dashboard?payment=failed");
  callback.searchParams.set("signature", signPaymentParams(callback.searchParams));

  return NextResponse.redirect(callback);
}

