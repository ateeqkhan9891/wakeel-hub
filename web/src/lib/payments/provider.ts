import "server-only";

import { createHmac, timingSafeEqual } from "crypto";

export type PaymentProviderName = "sandbox" | "manual" | "jazzcash" | "easypaisa";
export type PaymentKind = "consultation" | "subscription";
export type PaymentStatus = "pending" | "paid" | "failed";

export interface CheckoutInput {
  amount: number;
  currency: string;
  reference: string;
  kind: PaymentKind;
  description: string;
  customerEmail?: string;
  origin: string;
  successPath: string;
  failurePath: string;
}

export interface CheckoutResult {
  reference: string;
  status: PaymentStatus;
  gatewayFee: number;
  provider: PaymentProviderName;
  checkoutUrl: string;
}

export interface GatewayCallback {
  reference: string;
  status: PaymentStatus;
  provider: PaymentProviderName;
  gatewayReference?: string;
  gatewayFee?: number;
}

export interface PaymentProvider {
  readonly name: PaymentProviderName;
  createCheckout(input: CheckoutInput): Promise<CheckoutResult>;
  parseCallback(params: URLSearchParams): GatewayCallback;
}

const SIGNATURE_KEYS = ["signature", "secureHash", "pp_SecureHash", "hash", "checksum", "hmac"];

function callbackSecret() {
  const secret =
    process.env.PAYMENT_CALLBACK_SECRET ??
    process.env.JAZZCASH_INTEGRITY_SALT ??
    process.env.EASYPAY_HASH_KEY;

  if (!secret && process.env.NODE_ENV === "production") {
    throw new Error("PAYMENT_CALLBACK_SECRET is required in production.");
  }

  return secret ?? "wakeelhub-dev-payment-secret";
}

function canonicalParams(params: URLSearchParams) {
  return [...params.entries()]
    .filter(([key]) => !SIGNATURE_KEYS.includes(key))
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join("&");
}

export function signPaymentParams(params: URLSearchParams) {
  return createHmac("sha256", callbackSecret()).update(canonicalParams(params)).digest("hex");
}

export function verifyPaymentSignature(params: URLSearchParams) {
  const supplied = SIGNATURE_KEYS.map((key) => params.get(key)).find(Boolean);
  if (!supplied) return false;

  const expected = signPaymentParams(params);
  const suppliedBuffer = Buffer.from(supplied, "hex");
  const expectedBuffer = Buffer.from(expected, "hex");
  return suppliedBuffer.length === expectedBuffer.length && timingSafeEqual(suppliedBuffer, expectedBuffer);
}

function normalizeStatus(value: string | null): PaymentStatus {
  const v = (value ?? "").toLowerCase();
  if (["000", "paid", "success", "successful", "completed", "captured", "ok"].includes(v)) return "paid";
  if (["failed", "failure", "declined", "cancelled", "canceled", "error"].includes(v)) return "failed";
  return "pending";
}

function callbackUrl(origin: string, provider: PaymentProviderName) {
  if (provider === "jazzcash") return `${origin}/api/jazzcash/callback`;
  if (provider === "easypaisa") return `${origin}/api/easypaisa/callback`;
  return `${origin}/api/payments/callback`;
}

function signedUrl(base: string, params: Record<string, string | number | undefined>) {
  const url = new URL(base);
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) url.searchParams.set(key, String(value));
  }
  url.searchParams.set("signature", signPaymentParams(url.searchParams));
  return url.toString();
}

abstract class BaseProvider implements PaymentProvider {
  abstract readonly name: PaymentProviderName;
  abstract createCheckout(input: CheckoutInput): Promise<CheckoutResult>;

  parseCallback(params: URLSearchParams): GatewayCallback {
    if (!verifyPaymentSignature(params)) {
      throw new Error("Invalid payment callback signature.");
    }

    return {
      reference: params.get("reference") ?? params.get("pp_TxnRefNo") ?? params.get("orderRefNum") ?? "",
      status: normalizeStatus(params.get("status") ?? params.get("pp_ResponseCode") ?? params.get("transactionStatus")),
      provider: this.name,
      gatewayReference: params.get("gatewayReference") ?? params.get("pp_RetreivalReferenceNo") ?? params.get("transactionId") ?? undefined,
      gatewayFee: params.get("gatewayFee") ? Number(params.get("gatewayFee")) : undefined,
    };
  }
}

class SandboxPaymentProvider extends BaseProvider {
  readonly name: PaymentProviderName = "sandbox";

  async createCheckout(input: CheckoutInput): Promise<CheckoutResult> {
    const checkoutUrl = signedUrl(`${input.origin}/api/payments/sandbox`, {
      reference: input.reference,
      amount: input.amount,
      currency: input.currency,
      kind: input.kind,
      successPath: input.successPath,
      failurePath: input.failurePath,
    });

    return { reference: input.reference, status: "pending", gatewayFee: 0, provider: this.name, checkoutUrl };
  }
}

class JazzCashProvider extends BaseProvider {
  readonly name: PaymentProviderName = "jazzcash";

  async createCheckout(input: CheckoutInput): Promise<CheckoutResult> {
    const configured = process.env.JAZZCASH_CHECKOUT_URL;
    const returnUrl = callbackUrl(input.origin, this.name);

    const checkoutUrl = configured
      ? signedUrl(configured, {
          pp_MerchantID: process.env.JAZZCASH_MERCHANT_ID,
          pp_TxnRefNo: input.reference,
          pp_Amount: Math.round(input.amount * 100),
          pp_TxnCurrency: input.currency,
          pp_Description: input.description,
          pp_ReturnURL: returnUrl,
          pp_BillReference: input.kind,
          pp_CustomerEmail: input.customerEmail,
        })
      : signedUrl(`${input.origin}/api/payments/sandbox`, {
          reference: input.reference,
          amount: input.amount,
          currency: input.currency,
          kind: input.kind,
          provider: this.name,
          successPath: input.successPath,
          failurePath: input.failurePath,
        });

    return { reference: input.reference, status: "pending", gatewayFee: 0, provider: this.name, checkoutUrl };
  }
}

class EasypaisaProvider extends BaseProvider {
  readonly name: PaymentProviderName = "easypaisa";

  async createCheckout(input: CheckoutInput): Promise<CheckoutResult> {
    const configured = process.env.EASYPAY_CHECKOUT_URL;
    const returnUrl = callbackUrl(input.origin, this.name);

    const checkoutUrl = configured
      ? signedUrl(configured, {
          storeId: process.env.EASYPAY_STORE_ID,
          orderRefNum: input.reference,
          amount: input.amount.toFixed(2),
          paymentMethod: "MA_PAYMENT_METHOD",
          postBackURL: returnUrl,
          autoRedirect: "1",
          emailAddr: input.customerEmail,
        })
      : signedUrl(`${input.origin}/api/payments/sandbox`, {
          reference: input.reference,
          amount: input.amount,
          currency: input.currency,
          kind: input.kind,
          provider: this.name,
          successPath: input.successPath,
          failurePath: input.failurePath,
        });

    return { reference: input.reference, status: "pending", gatewayFee: 0, provider: this.name, checkoutUrl };
  }
}

export function getPaymentProvider(): PaymentProvider {
  const configured = (process.env.PAYMENT_PROVIDER ?? "sandbox").toLowerCase();
  switch (configured) {
    case "jazzcash":
      return new JazzCashProvider();
    case "easypaisa":
      return new EasypaisaProvider();
    case "manual":
    case "sandbox":
    default:
      return new SandboxPaymentProvider();
  }
}

export function getPaymentProviderByName(name: string | null): PaymentProvider {
  switch ((name ?? "").toLowerCase()) {
    case "jazzcash":
      return new JazzCashProvider();
    case "easypaisa":
      return new EasypaisaProvider();
    case "manual":
    case "sandbox":
    default:
      return new SandboxPaymentProvider();
  }
}
