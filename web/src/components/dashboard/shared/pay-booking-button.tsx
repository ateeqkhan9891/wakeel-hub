"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import { formatPKR } from "@/lib/utils";
import { payForBooking } from "@/app/actions/payment-actions";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export function PayBookingButton({ bookingId, amount, lawyerName }: { bookingId: string; amount: number; lawyerName: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, start] = useTransition();

  function pay() {
    start(async () => {
      const res = await payForBooking(bookingId);
      if (!res.ok) { toast.error("Payment failed", { description: res.error }); return; }
      if (res.checkoutUrl) {
        toast.loading("Opening secure checkout...");
        window.location.assign(res.checkoutUrl);
        return;
      }
      toast.success("Payment successful", { description: "Your consultation is confirmed." });
      setOpen(false);
      if (res.paymentId) { router.push(`/dashboard/client/payments/${res.paymentId}/invoice`); return; }
      router.refresh();
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"><CreditCard className="h-4 w-4" /> Pay {formatPKR(amount)}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Pay for consultation</DialogTitle>
          <DialogDescription>Pay the full consultation fee to confirm your booking with {lawyerName}.</DialogDescription>
        </DialogHeader>
        <div className="rounded-xl border border-border bg-secondary/30 p-4">
          <div className="flex items-center justify-between text-sm"><span className="text-muted-foreground">Consultation fee</span><span className="font-heading text-lg font-semibold text-foreground">{formatPKR(amount)}</span></div>
          <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground"><ShieldCheck className="h-3.5 w-3.5 text-gold" /> Secure payment. A receipt is generated instantly.</p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={pending}>Cancel</Button>
          <Button onClick={pay} disabled={pending} className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
            {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <CreditCard className="h-4 w-4" />} {pending ? "Processing..." : `Pay ${formatPKR(amount)}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

