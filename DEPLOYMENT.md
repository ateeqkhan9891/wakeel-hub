# Deploying WakeelHub Pakistan to Vercel

This is a monorepo. The deployable Next.js app lives in **`web/`** and has its
own complete `package.json`. Deploy it as a Vercel project pointed at `web/`.

## 1. Vercel project settings

In **Vercel → Project → Settings → General → Build & Output Settings**:

| Setting              | Value            |
| -------------------- | ---------------- |
| **Root Directory**   | `web`            |
| **Framework Preset** | Next.js          |
| **Install Command**  | `npm install`    |
| **Build Command**    | `npm run build`  |
| **Output Directory** | _(leave empty / default)_ |

Do **not** set a custom output directory. With Root Directory = `web`, the build
produces `web/.next` and Vercel finds `routes-manifest.json` automatically.

`web/vercel.json` pins `framework: "nextjs"` so Vercel always serves this as a
Next.js app (correct routing + `.next` output), even if the project was first
created pointing at the repo root.

### Troubleshooting: `404: NOT_FOUND` after a successful install

This is almost never a code problem — it means Vercel didn't serve the Next.js
output. Check, in **Project → Settings → Build & Output Settings**:

1. **Root Directory** = `web` (the install log should add ~670 packages).
2. **Framework Preset** = **Next.js** (not "Other"). `web/vercel.json` enforces this.
3. **Output Directory** = empty. If it's set to `.next` / `web/.next`, clear it.
4. **Build Command** = `npm run build` (or leave as framework default).

After changing settings, trigger **Redeploy** (disable build cache once).

## 2. Environment variables

Add these in **Vercel → Project → Settings → Environment Variables**
(see `web/.env.example` for the full template).

### Required

| Variable                        | Notes                                              |
| ------------------------------- | -------------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Supabase → Project Settings → API → Project URL    |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon / public key                         |
| `SUPABASE_SERVICE_ROLE_KEY`     | Supabase service_role key (server-only secret)     |
| `NEXT_PUBLIC_SITE_URL`          | Production URL, e.g. `https://yourdomain.com`      |

### Optional (only for payments / transactional email)

| Variable               | Notes                                        |
| ---------------------- | -------------------------------------------- |
| `NEXT_PUBLIC_APP_URL`  | Absolute origin for payment/email links      |
| `JAZZCASH_CHECKOUT_URL`| JazzCash checkout endpoint                   |
| `EASYPAY_CHECKOUT_URL` | EasyPaisa checkout endpoint                  |

> The build never crashes if `NEXT_PUBLIC_SITE_URL` is missing — it falls back to
> the Vercel-provided host, then `http://localhost:3000` in development.

## 3. Local development

```bash
cd web
npm install
npm run dev        # http://localhost:3000
```

Quality checks (run from `web/`):

```bash
npm run typecheck
npm run lint
npm run build
```

## 4. Monorepo scripts (run from repo root)

The root `package.json` is a controller only — it has no dependencies and
delegates to `web/`:

```bash
npm run web:dev
npm run web:build
npm run web:start
npm run web:lint
npm run web:typecheck
```
