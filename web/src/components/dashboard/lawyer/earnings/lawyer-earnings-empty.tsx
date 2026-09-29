import { Receipt } from "lucide-react";

export function LawyerEarningsEmpty() {
  return (
    <div className="flex flex-col items-center px-6 py-16 text-center">
      <div className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-primary/5 to-transparent">
        <div className="absolute -inset-4 animate-[spin_6s_linear_infinite] bg-gradient-to-r from-primary/15 via-transparent to-primary/20 blur-xl" />
        <Receipt className="relative h-5 w-5 text-primary" />
      </div>

      <h3 className="mt-4 font-heading text-base font-semibold text-foreground">
        No earnings yet
      </h3>

      <p className="mt-1.5 max-w-sm text-sm leading-6 text-muted-foreground">
        When clients pay for consultations, your net earnings and payout
        status will appear here.
      </p>
    </div>
  );
}
