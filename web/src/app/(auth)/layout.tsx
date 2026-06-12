import { Logo } from "@/components/shared/logo";
import { AuthPanel } from "@/components/auth/auth-panel";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-svh items-center justify-center overflow-hidden bg-[#f8fafc] px-4 py-10 sm:px-6 lg:px-10">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 [background:radial-gradient(60%_45%_at_86%_0%,oklch(0.78_0.13_85_/_0.10),transparent),radial-gradient(50%_40%_at_8%_100%,oklch(0.26_0.06_265_/_0.08),transparent)]"
      />

      <div className="grid w-full max-w-6xl grid-cols-1 overflow-hidden rounded-[2.25rem] border border-slate-200/80 bg-white shadow-2xl shadow-slate-950/12 lg:grid-cols-[0.92fr_1.08fr]">
        <div className="flex flex-col gap-8 bg-white/95 px-6 py-10 [box-shadow:inset_-1px_0_0_rgba(15,23,42,0.06)] sm:px-10 lg:px-12 lg:py-12">
          <Logo />
          <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center">{children}</div>
          <p className="text-center text-xs text-muted-foreground lg:text-left">
            &copy; 2026 WakeelHub Pakistan. All rights reserved.
          </p>
        </div>

        <AuthPanel />
      </div>
    </div>
  );
}
