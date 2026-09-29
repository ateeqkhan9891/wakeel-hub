"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Crown, Percent, Check, Loader2, ShieldCheck, ShieldAlert, Sparkles, FileDown, Lock, ArrowRight,
  CalendarClock, CalendarDays, BadgeCheck, AlertTriangle, Wallet, RefreshCw,
} from "lucide-react";
import { toast } from "sonner";

import { cn, formatDate, formatPKR } from "@/lib/utils";
import type { LawyerSubscription } from "@/lib/data/lawyer-subscription";
import { activateSubscription, cancelSubscription } from "@/app/actions/subscription-actions";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/dashboard/shared/status-badge";

type Period = "monthly" | "annual";
const easeOut = [0.22, 1, 0.36, 1] as const;

const PRO_FEATURES = ["Verified advocate badge", "Featured placement in search", "Unlimited client bookings", "Full case & client tools", "Analytics dashboard", "Priority support", "0% commission"];
const COMMISSION_FEATURES = ["Listed in the public directory", "Receive booking requests", "Full case & client tools", "Secure client chat", "Only pay when you earn", "Standard support"];

export function BillingPanel({ subscription }: { subscription: LawyerSubscription }) {
  const router = useRouter();
  const reduce = useReducedMotion();
  const [period, setPeriod] = useState<Period>("annual");
  const [pending, start] = useTransition();
  const [busyPlan, setBusyPlan] = useState<string | null>(null);

  const active = subscription.status === "active";

  function activate(plan: "pro" | "commission", p: Period | "commission") {
    setBusyPlan(plan);
    start(async () => {
      const r = await activateSubscription(plan, p);
      setBusyPlan(null);
      if (!r.ok) { toast.error("Could not activate", { description: r.error }); return; }
      if (plan === "pro" && r.checkoutUrl) {
        toast.loading("Opening secure checkout...");
        window.location.assign(r.checkoutUrl);
        return;
      }
      if (plan === "pro" && r.invoiceId) {
        toast.success("Payment successful", { description: "Your Pro subscription is active. Downloading your invoice..." });
        router.push(`/dashboard/lawyer/billing/${r.invoiceId}/invoice`);
        return;
      }
      toast.success("Plan activated", { description: "You're set. Get verified to go live in the directory." });
      router.refresh();
    });
  }

  function cancel() {
    if (!window.confirm("Pause your subscription? Your profile will be hidden from clients.")) return;
    start(async () => {
      const r = await cancelSubscription();
      if (!r.ok) { toast.error("Could not cancel", { description: r.error }); return; }
      toast.success("Subscription paused");
      router.refresh();
    });
  }

  return (
    <div className="space-y-6">
      {active && <ActiveSubscriptionCard subscription={subscription} onPause={cancel} pausing={pending} />}

      {/* plan picker - shown when inactive */}
      {!active && (
        <>
          <Card className="border-gold/30 bg-gold/10 p-5">
            <div className="flex items-start gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gold/20 text-gold"><Lock className="h-5.5 w-5.5" /></span>
              <div>
                <p className="font-heading text-sm font-semibold text-foreground">You&apos;re on the free plan</p>
                <p className="mt-0.5 max-w-xl text-sm leading-6 text-muted-foreground">Your verified profile appears in the directory and you pay a small commission per consultation. Upgrade to <span className="font-medium text-foreground">Pro</span> for <span className="font-medium text-foreground">0% commission</span> and featured placement.</p>
              </div>
            </div>
          </Card>

          <div className="flex flex-col items-center gap-3">
            <div className="inline-flex items-center rounded-full border border-border bg-card p-1">
              {(["monthly", "annual"] as Period[]).map((b) => (
                <button key={b} type="button" onClick={() => setPeriod(b)} className={cn("relative z-10 rounded-full px-5 py-2 text-sm font-semibold capitalize transition-colors", period === b ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground")}>
                  {period === b && <motion.span layoutId="bill-pill" className="absolute inset-0 -z-10 rounded-full bg-primary" transition={{ type: "spring", stiffness: 400, damping: 32 }} />}
                  {b}
                </button>
              ))}
            </div>
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gold-foreground/80"><Sparkles className="h-3.5 w-3.5 text-gold" /> Save Rs. 6,000 a year with annual billing</span>
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {/* Pro */}
            <motion.div initial={reduce ? { opacity: 0 } : { opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, ease: easeOut }}>
              <Card className="relative flex h-full flex-col overflow-hidden border-gold/40 p-6 ring-1 ring-gold/30">
                <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-gold/10 blur-3xl" aria-hidden />
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gold/15 text-gold"><Crown className="h-5.5 w-5.5" /></span>
                  <div><p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Recommended</p><p className="font-heading text-lg font-semibold text-foreground">Pro</p></div>
                </div>
                <div className="mt-5 min-h-[60px]">
                  <AnimatePresence mode="wait">
                    <motion.div key={period} initial={reduce ? { opacity: 0 } : { opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={reduce ? { opacity: 0 } : { opacity: 0, y: -6 }} transition={{ duration: 0.22 }}>
                      <div className="flex items-baseline gap-1.5"><span className="font-heading text-3xl font-bold text-foreground">{period === "monthly" ? "Rs. 2,000" : "Rs. 18,000"}</span><span className="text-sm text-muted-foreground">/ {period === "monthly" ? "month" : "year"}</span></div>
                      <p className="mt-1 text-xs text-muted-foreground">{period === "monthly" ? "Billed monthly" : "≈ Rs. 1,500 / month - billed annually"}</p>
                    </motion.div>
                  </AnimatePresence>
                </div>
                <Button onClick={() => activate("pro", period)} disabled={pending} className="mt-4 w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                  {busyPlan === "pro" && pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
                  {busyPlan === "pro" && pending ? "Processing payment..." : "Subscribe & pay"}
                </Button>
                <ul className="mt-6 space-y-2.5 border-t border-border/70 pt-5">
                  {PRO_FEATURES.map((f) => <li key={f} className="flex items-start gap-2.5 text-sm text-muted-foreground"><span className="mt-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-gold/20 text-gold"><Check className="h-3 w-3" /></span>{f}</li>)}
                </ul>
              </Card>
            </motion.div>

            {/* Commission */}
            <motion.div initial={reduce ? { opacity: 0 } : { opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, ease: easeOut, delay: 0.08 }}>
              <Card className="flex h-full flex-col border-border/80 p-6">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/8 text-primary"><Percent className="h-5.5 w-5.5" /></span>
                  <div><p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Pay-as-you-go</p><p className="font-heading text-lg font-semibold text-foreground">Commission</p></div>
                </div>
                <div className="mt-5 min-h-[60px]">
                  <div className="flex items-baseline gap-1.5"><span className="font-heading text-3xl font-bold text-foreground">10%</span><span className="text-sm text-muted-foreground">/ paid consultation</span></div>
                  <p className="mt-1 text-xs text-muted-foreground">Rs. 0 monthly - perfect to get started</p>
                </div>
                <Button onClick={() => activate("commission", "commission")} disabled={pending} variant="outline" className="mt-4 w-full gap-2 hover:border-gold/40 hover:bg-secondary">
                  {busyPlan === "commission" && pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                  Activate free
                </Button>
                <ul className="mt-6 space-y-2.5 border-t border-border/70 pt-5">
                  {COMMISSION_FEATURES.map((f) => <li key={f} className="flex items-start gap-2.5 text-sm text-muted-foreground"><span className="mt-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary/10 text-primary"><Check className="h-3 w-3" /></span>{f}</li>)}
                </ul>
              </Card>
            </motion.div>
          </div>
          <p className="flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground"><ShieldAlert className="h-3.5 w-3.5 text-gold" /> Payments are processed securely. You can pause your plan anytime.</p>
        </>
      )}

      {/* payment history */}
      {subscription.payments.length > 0 && (
        <Card className="overflow-hidden border-border/80 p-0">
          <div className="border-b border-border px-5 py-3"><h3 className="font-heading text-sm font-semibold text-foreground">Payment history</h3></div>
          <div className="divide-y divide-border/60">
            {subscription.payments.map((p) => (
              <div key={p.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5">
                <div>
                  <p className="text-sm font-medium text-foreground">{p.invoiceNumber}</p>
                  <p className="text-xs text-muted-foreground">{p.plan === "pro" ? "Pro" : "Commission"} - {p.period} - {formatDate(p.paidAt)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-foreground">{formatPKR(p.amount)}</span>
                  <StatusBadge status={p.status} />
                  <Link href={`/dashboard/lawyer/billing/${p.id}/invoice`} className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"><FileDown className="h-3.5 w-3.5" /> Invoice</Link>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Active subscription - professional details card (for paid / active members)
// ---------------------------------------------------------------------------
function Detail({ icon: Icon, label, value, accent }: { icon: typeof Crown; label: string; value: React.ReactNode; accent?: boolean }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground"><Icon className="h-3.5 w-3.5 text-gold" /> {label}</p>
      <p className={cn("mt-1.5 text-sm font-semibold", accent ? "text-gold-foreground" : "text-foreground")}>{value}</p>
    </div>
  );
}

function ActiveSubscriptionCard({ subscription, onPause, pausing }: { subscription: LawyerSubscription; onPause: () => void; pausing: boolean }) {
  const isPro = subscription.plan === "pro";
  const latest = subscription.payments[0];
  const planName = isPro ? "Wakeel360 Pro" : "Pay-as-you-go";
  const used = subscription.totalDays && subscription.daysRemaining !== null ? Math.min(100, Math.max(0, Math.round(((subscription.totalDays - subscription.daysRemaining) / subscription.totalDays) * 100))) : 0;

  return (
    <Card className="overflow-hidden border-border/80 p-0">
      {/* header band */}
      <div className="relative flex flex-wrap items-center justify-between gap-3 border-b border-border bg-gradient-to-r from-primary/[0.06] to-gold/[0.06] p-5">
        <div className="flex items-center gap-3">
          <span className={cn("flex h-12 w-12 items-center justify-center rounded-2xl", isPro ? "bg-gold/15 text-gold" : "bg-primary/8 text-primary")}>
            {isPro ? <Crown className="h-6 w-6" /> : <Percent className="h-6 w-6" />}
          </span>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-heading text-base font-semibold text-foreground">{planName}</p>
              {subscription.expired ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-0.5 text-[11px] font-semibold text-rose-700"><AlertTriangle className="h-3 w-3" /> Expired</span>
              ) : subscription.expiringSoon ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700"><CalendarClock className="h-3 w-3" /> Expiring soon</span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700"><BadgeCheck className="h-3 w-3" /> Active</span>
              )}
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {subscription.isVerified ? "Your verified profile is live to clients." : "Active - submit verification to appear in search."}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isPro && latest && (
            <Button variant="outline" size="sm" asChild className="gap-1.5">
              <Link href={`/dashboard/lawyer/billing/${latest.id}/invoice`}><FileDown className="h-3.5 w-3.5" /> Latest invoice</Link>
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={onPause} disabled={pausing} className="gap-1.5 text-rose-600 hover:bg-rose-50">
            {pausing && <Loader2 className="h-3.5 w-3.5 animate-spin" />} Pause
          </Button>
        </div>
      </div>

      {/* details */}
      <div className="p-5">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Detail icon={RefreshCw} label="Billing" value={isPro ? (subscription.period === "annual" ? "Annual" : "Monthly") : "Per consultation"} />
          <Detail icon={Wallet} label={isPro ? "Amount" : "Commission"} value={isPro ? formatPKR(subscription.currentAmount || latest?.amount || 0) : "10% per consultation"} />
          <Detail icon={ShieldCheck} label="Commission rate" value={isPro ? "0% - you keep 100%" : "10%"} accent={isPro} />
          {subscription.startedAt && <Detail icon={CalendarDays} label="Started on" value={formatDate(subscription.startedAt)} />}
          {isPro && subscription.expiresAt && <Detail icon={CalendarClock} label={subscription.expired ? "Expired on" : "Renews / expires"} value={formatDate(subscription.expiresAt)} />}
          {isPro && subscription.daysRemaining !== null && (
            <Detail icon={CalendarClock} label="Days remaining" value={subscription.expired ? "-" : `${subscription.daysRemaining} day${subscription.daysRemaining === 1 ? "" : "s"}`} accent={subscription.expiringSoon && !subscription.expired} />
          )}
        </div>

        {/* time progress for Pro */}
        {isPro && subscription.daysRemaining !== null && !subscription.expired && (
          <div className="mt-5">
            <div className="mb-1.5 flex items-center justify-between text-xs text-muted-foreground">
              <span>Current {subscription.period === "annual" ? "year" : "month"}</span>
              <span>{subscription.daysRemaining} of {subscription.totalDays} days left</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-secondary">
              <div className={cn("h-full rounded-full", subscription.expiringSoon ? "bg-amber-500" : "bg-gradient-to-r from-primary to-gold")} style={{ width: `${used}%` }} />
            </div>
          </div>
        )}

        {subscription.expired && isPro && (
          <p className="mt-4 flex items-center gap-1.5 rounded-lg bg-rose-50 px-3 py-2 text-xs text-rose-700">
            <AlertTriangle className="h-3.5 w-3.5" /> Your Pro plan has expired. Renew to keep 0% commission and featured placement.
          </p>
        )}
      </div>
    </Card>
  );
}

