import type { Metadata } from "next";
import { AuthCard } from "@/components/auth/auth-card";

export const metadata: Metadata = {
  title: "Register as a Client",
  description: "Create a free Wakeel360 Pakistan account to search verified lawyers, book consultations, and track your cases.",
  alternates: { canonical: "/register/client" },
};

export default function RegisterClientPage() {
  return <AuthCard initialTab="signup" initialRole="client" />;
}

