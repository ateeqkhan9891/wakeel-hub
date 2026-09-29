"use client";

import { ShieldCheck, Scale, UserRound, X } from "lucide-react";

interface DemoAccountsDialogProps {
  open: boolean;
  onClose: () => void;
}

const accounts = [
  {
    role: "Client",
    email: "client123@gmail.com",
    password: "client123",
    icon: UserRound,
  },
  {
    role: "Lawyer",
    email: "wakeel123@gmail.com",
    password: "wakeel123",
    icon: Scale,
  },
  {
    role: "Admin",
    email: "admin123@gmail.com",
    password: "admin123",
    icon: ShieldCheck,
  },
];

export function DemoAccountsDialog({
  open,
  onClose,
}: DemoAccountsDialogProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close demo accounts dialog"
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/45 backdrop-blur-sm"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="demo-accounts-title"
        className="relative z-10 w-full max-w-xl overflow-hidden rounded-2xl border border-slate-200 bg-background shadow-2xl"
      >
        <div className="relative overflow-hidden border-b border-slate-200 px-6 py-5">
          <div className="pointer-events-none absolute -right-10 -top-16 h-36 w-36 rounded-full bg-gradient-to-br from-blue-200/60 via-indigo-100/40 to-transparent blur-2xl" />

          <div className="pointer-events-none absolute -bottom-10 left-1/3 h-20 w-20 rounded-full bg-blue-100/40 blur-2xl" />

          <div className="relative flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="mb-2.5 flex items-center gap-2">
                <span className="flex size-7 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-sm">
                  <ShieldCheck className="size-3.5" />
                </span>

                <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-blue-600">
                  Demo Access
                </span>
              </div>

              <h2
                id="demo-accounts-title"
                className="text-xl font-semibold tracking-tight text-slate-950"
              >
                Try Wakeel360
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Sign in with a demo account to explore each role.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close demo accounts"
              className="relative shrink-0 rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {accounts.map((account) => {
            const Icon = account.icon;

            return (
              <div
                key={account.role}
                className="grid grid-cols-[140px_1fr] items-center gap-5 px-6 py-4 transition-colors hover:bg-slate-50/70"
              >
                <div className="flex items-center gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-blue-600">
                    <Icon className="size-4" />
                  </div>

                  <span className="text-sm font-semibold text-slate-800">
                    {account.role}
                  </span>
                </div>

                <div className="min-w-0 space-y-1.5">
                  <div className="flex min-w-0 items-center gap-2">
                    <span className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
                      Email
                    </span>

                    <p className="min-w-0 truncate font-mono text-xs font-medium text-slate-700">
                      {account.email}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
                      Password
                    </span>

                    <p className="font-mono text-xs text-slate-500">
                      {account.password}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="border-t border-slate-200 bg-slate-50/70 px-6 py-3">
          <p className="text-center text-[11px] text-slate-500">
            Demo credentials are provided for portfolio exploration.
          </p>
        </div>
      </div>
    </div>
  );
}