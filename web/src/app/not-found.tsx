import Link from "next/link";
import { Home, Search, Scale } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] items-center bg-[#f8fafc] px-4 py-16">
      <Card className="mx-auto max-w-2xl border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gold/10 text-gold-foreground">
          <Scale className="h-7 w-7" />
        </div>
        <p className="mt-6 text-sm font-semibold uppercase tracking-wide text-slate-500">404</p>
        <h1 className="mt-2 font-heading text-3xl font-semibold text-slate-950">Page not found</h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-slate-600">
          This page may have moved, or the lawyer, practice area or guide URL may not be available yet.
        </p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild className="bg-slate-950 text-white hover:bg-slate-800">
            <Link href="/">
              <Home className="h-4 w-4" />
              Go home
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/find-lawyers">
              <Search className="h-4 w-4" />
              Search lawyers
            </Link>
          </Button>
        </div>
      </Card>
    </main>
  );
}
