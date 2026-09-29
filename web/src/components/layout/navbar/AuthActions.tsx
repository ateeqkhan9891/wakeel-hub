"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  ChevronDown,
  Scale,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const getStartedOptions = [
  {
    href: "/register/client",
    eyebrow: "CLIENT",
    title: "Find a Lawyer",
    description:
      "Connect with verified advocates for your legal needs.",
    icon: UserRound,
  },
  {
    href: "/register/lawyer",
    eyebrow: "LAWYER",
    title: "Join Wakeel360",
    description:
      "Build your profile and connect with new clients.",
    icon: Scale,
  },
] as const;

export function AuthActions() {
  const [startOpen, setStartOpen] = useState(false);

  return (
    <div className="hidden items-center gap-2 md:flex">
      <Button
        variant="ghost"
        asChild
        className="rounded-full px-4 font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
      >
        <Link href="/login">Log in</Link>
      </Button>

      <DropdownMenu
        open={startOpen}
        onOpenChange={setStartOpen}
      >
        <DropdownMenuTrigger asChild>
          <Button className="group relative gap-2 overflow-hidden rounded-full border border-[#D4AF37]/30 bg-[#0F2347] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(15,35,71,0.16)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#D4AF37]/50 hover:bg-[#132B55] hover:shadow-[0_12px_30px_rgba(15,35,71,0.22)] focus-visible:ring-2 focus-visible:ring-[#D4AF37]/40 focus-visible:ring-offset-2">
            <span className="relative z-10">
              Get Started
            </span>

            <ChevronDown
              className={cn(
                "relative z-10 h-4 w-4 transition-transform duration-300",
                startOpen && "rotate-180"
              )}
            />

            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/[0.08] to-transparent transition-transform duration-700 group-hover:translate-x-full" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          sideOffset={10}
          className="w-[360px] overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-2.5 text-slate-950 shadow-[0_24px_70px_rgba(15,35,71,0.16)] ring-1 ring-[#0F2347]/5"
        >
          <div className="px-3 pb-2.5 pt-2">
            <p className="text-sm font-semibold text-[#0F2347]">
              Get started with Wakeel360
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Choose how you want to use the platform.
            </p>
          </div>

          <DropdownMenuSeparator className="mb-2 bg-slate-200/80" />

          <div className="space-y-1">
            {getStartedOptions.map((option, index) => {
              const Icon = option.icon;

              return (
                <div key={option.href}>
                  {index > 0 && (
                    <DropdownMenuSeparator className="my-1 bg-slate-100" />
                  )}

                  <DropdownMenuItem
                    asChild
                    className="cursor-pointer rounded-xl p-0 focus:bg-transparent"
                  >
                    <Link
                      href={option.href}
                      className="group relative flex items-center gap-3 rounded-xl p-3 outline-none transition-all duration-200 hover:bg-[#F6F8FB] focus-visible:bg-[#F6F8FB]"
                    >
                      <motion.span
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.97 }}
                        transition={{
                          duration: 0.15,
                          ease: "easeOut",
                        }}
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#D4AF37]/20 bg-[#D4AF37]/10 text-[#0F2347] transition-all duration-200 group-hover:border-[#D4AF37]/40 group-hover:bg-[#D4AF37]/15 group-hover:text-[#B89224]"
                      >
                        <Icon className="h-5 w-5" />
                      </motion.span>

                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-2">
                          <span className="text-[10px] font-bold tracking-[0.14em] text-[#B89224]">
                            {option.eyebrow}
                          </span>
                        </span>

                        <span className="mt-0.5 block text-sm font-semibold text-[#0F2347]">
                          {option.title}
                        </span>

                        <span className="mt-0.5 block text-xs leading-5 text-slate-500">
                          {option.description}
                        </span>
                      </span>

                      <ArrowRight className="h-4 w-4 shrink-0 text-slate-300 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-[#0F2347]" />
                    </Link>
                  </DropdownMenuItem>
                </div>
              );
            })}
          </div>

          <div className="mt-2 flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50/80 px-3 py-2.5">
            <ShieldCheck className="h-4 w-4 shrink-0 text-[#D4AF37]" />

            <span className="text-[11px] font-medium leading-4 text-slate-500">
              A trusted platform connecting clients with legal professionals
              across Pakistan.
            </span>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
