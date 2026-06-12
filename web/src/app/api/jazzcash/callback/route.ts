import type { NextRequest } from "next/server";
import { handlePaymentCallback } from "@/lib/payments/callback-handler";

export async function GET(request: NextRequest) {
  return handlePaymentCallback(request, "jazzcash");
}

export async function POST(request: NextRequest) {
  return handlePaymentCallback(request, "jazzcash");
}
