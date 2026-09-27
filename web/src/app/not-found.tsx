import Image from "next/image";
import Link from "next/link";

import { ArrowLeft, Search } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-[100vh] items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md text-center">
        <Image
          src="/global/not-found.png"
          alt=""
          width={180}
          height={120}
          className="mx-auto mb-6 h-auto w-36 object-contain sm:w-40"
          priority
        />

        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
          404
        </p>

        <h1 className="mt-2 font-heading text-2xl font-semibold tracking-tight text-slate-950">
          Page not found
        </h1>

        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
          The page you’re looking for doesn’t exist or may have moved.
        </p>

        <div className="mt-6 flex items-center justify-center gap-3">
          <Button
            asChild
            size="sm"
            className="bg-slate-950 text-white hover:bg-slate-800"
          >
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
              Go home
            </Link>
          </Button>

          <Button asChild size="sm" variant="outline">
            <Link href="/find-lawyers">
              <Search className="h-4 w-4" />
              Find a lawyer
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}