"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { createClient } from "@/lib/supabase/client";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { ErrText, Field, SubmitButton } from "./AuthFields";

const ROLE_HOME: Record<string, string> = {
  client: "/dashboard/client",
  lawyer: "/dashboard/lawyer",
  admin: "/dashboard/admin",
};

interface LoginPanelProps {
  isNew?: boolean;
  onSwitch: () => void;
}

export function LoginPanel({
  isNew = false,
  onSwitch,
}: LoginPanelProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const validate = () => {
    if (!email.trim()) {
      setError("Please enter your email address.");
      return false;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Please enter a valid email address.");
      return false;
    }

    if (!password) {
      setError("Please enter your password.");
      return false;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return false;
    }

    setError("");
    return true;
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!validate()) return;

    setLoading(true);

    try {
      const supabase = createClient();

      const { data, error: signInError } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

      if (signInError) {
        setError(signInError.message);
        return;
      }

      if (!data.user) {
        setError("Unable to sign you in. Please try again.");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .maybeSingle();

     const profileData = profile as
      | { role?: string; onboarding_completed?: boolean }
      | null;

    const role = profileData?.role ?? "client";

    const destination = ROLE_HOME[role] ?? "/dashboard/client";

    const onboardingCompleted = profileData?.onboarding_completed ?? false;

      toast.success("Signed in successfully.");

      const next = searchParams.get("next");

      if (!onboardingCompleted) {
  router.push("/onboarding");
} else if (next && next.startsWith("/")) {
  router.push(next);
} else {
  router.push(destination);
}

      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {isNew && (
        <div className="rounded-lg border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
          Your account was created. Please sign in to continue.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <Field label="Email address" htmlFor="login-email">
          <Input
            id="login-email"
            type="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              if (error) setError("");
            }}
            placeholder="kyliejenner_wazir@gmail.com"
            autoComplete="email"
            disabled={loading}
          />
        </Field>

        <Field
          label="Password"
          htmlFor="login-password"
          action={
            <Link
              href="/forgot-password"
              className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Forgot password?
            </Link>
          }
        >
          <div className="relative">
            <Input
              id="login-password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                if (error) setError("");
              }}
              placeholder="Enter your password"
              autoComplete={
                remember ? "current-password" : "off"
              }
              disabled={loading}
              className="pr-16"
            />

            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground hover:text-foreground"
              tabIndex={-1}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </Field>

        <div className="flex items-center gap-2">
          <Checkbox
            id="remember"
            checked={remember}
            onCheckedChange={(checked) =>
              setRemember(checked === true)
            }
            disabled={loading}
          />

          <label
            htmlFor="remember"
            className="cursor-pointer text-sm text-muted-foreground"
          >
            Remember me
          </label>
        </div>

        {error && <ErrText>{error}</ErrText>}

        <SubmitButton loading={loading}>
          Sign in
        </SubmitButton>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t" />
        </div>

        <div className="relative flex justify-center">
          <span className="bg-background px-3 text-xs text-muted-foreground">
            New to WakeelHub?
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={onSwitch}
        className="w-full text-sm font-medium text-foreground underline-offset-4 hover:underline"
      >
        Create an account
      </button>
    </div>
  );
}