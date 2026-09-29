import { NextResponse, type NextRequest } from "next/server";
import { expirePastDueSubscriptions } from "@/lib/payments/payment-service";

export async function POST(request: NextRequest) {
  const configured = process.env.CRON_SECRET;
  if (configured) {
    const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
    if (token !== configured) return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }

  const result = await expirePastDueSubscriptions();
  return NextResponse.json(result);
}

