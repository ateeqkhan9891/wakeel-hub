# WakeelHub Payments & Subscriptions Setup

WakeelHub now uses a callback-gated payment flow:

1. A server action creates a pending payment row.
2. The user is redirected to a checkout URL.
3. A signed callback confirms or fails the payment using the Supabase service role.
4. Only the callback activates Pro subscriptions or marks consultations paid.

## Environment

```bash
NEXT_PUBLIC_APP_URL=https://yourdomain.com
SUPABASE_SERVICE_ROLE_KEY=...
PAYMENT_PROVIDER=sandbox # sandbox | jazzcash | easypaisa
PAYMENT_CALLBACK_SECRET=replace-with-a-long-random-secret
CRON_SECRET=replace-with-a-long-random-secret
```

`sandbox` is the default local provider. It redirects through `/api/payments/sandbox`, signs a callback, and confirms the payment without external gateway credentials.

## JazzCash

```bash
PAYMENT_PROVIDER=jazzcash
JAZZCASH_CHECKOUT_URL=https://sandbox.jazzcash.com.pk/CustomerPortal/transactionmanagement/merchantform
JAZZCASH_MERCHANT_ID=...
JAZZCASH_PASSWORD=...
JAZZCASH_INTEGRITY_SALT=...
```

Set the JazzCash return/postback URL to:

```text
https://yourdomain.com/api/jazzcash/callback
```

## Easypaisa

```bash
PAYMENT_PROVIDER=easypaisa
EASYPAY_CHECKOUT_URL=https://easypay.easypaisa.com.pk/easypay/Index.jsf
EASYPAY_STORE_ID=...
EASYPAY_HASH_KEY=...
```

Set the Easypaisa postback URL to:

```text
https://yourdomain.com/api/easypaisa/callback
```

## Callback Routes

- General callback: `/api/payments/callback`
- JazzCash alias: `/api/jazzcash/callback`
- Easypaisa alias: `/api/easypaisa/callback`

Callbacks verify a signature before updating data. In production, set `PAYMENT_CALLBACK_SECRET` or the provider hash key/salt.

## Subscription Expiry

Run one of these daily:

- Next route: `POST /api/subscriptions/expire` with `Authorization: Bearer $CRON_SECRET`
- Supabase Edge Function: `supabase/functions/expire-subscriptions`

Both set expired Pro subscriptions to inactive and notify the lawyer.

## Admin Payouts

The admin payments dashboard supports:

- Payout status updates per row.
- Bulk mark selected payouts as processing or paid.
- CSV export of the current filtered table.
