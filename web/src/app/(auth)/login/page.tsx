import type { Metadata } from "next";
import { AuthCard } from "@/components/auth/auth-card";

export const metadata: Metadata = {
  title: "Log In",
  description: "Log in to your WakeelHub Pakistan account to manage bookings, cases, and messages.",
  alternates: { canonical: "/login" },
};

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ new?: string }> }) {
  const { new: isNew } = await searchParams;
  return <AuthCard initialTab="login" isNew={isNew === "1"} />;
}
