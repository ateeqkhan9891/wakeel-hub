import type { Metadata } from "next";
import { AuthCard } from "@/components/auth/auth-card";

export const metadata: Metadata = {
  title: "Register as a Lawyer",
  description: "Join WakeelHub Pakistan as a verified advocate - build your profile, get matched with clients, and manage your practice online.",
  alternates: { canonical: "/register/lawyer" },
};

export default function RegisterLawyerPage() {
  return <AuthCard initialTab="signup" initialRole="lawyer" />;
}
