import { Logo } from "@/components/shared/logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-svh bg-background">
      <header className="fixed left-6 top-6 z-50 sm:left-8 sm:top-8 lg:left-10 lg:top-10">
        <Logo />
      </header>

      <main className="flex min-h-svh items-center justify-center px-6 py-24 sm:px-8">
        <div className="w-full max-w-md">{children}</div>
      </main>
    </div>
  );
}
