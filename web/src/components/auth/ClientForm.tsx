"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  CityField,
  ErrText,
  Field,
  PasswordField,
  SubmitButton,
  TermsRow,
} from "./AuthFields";

interface ClientFormProps {
  onBack: () => void;
  onSwitch: () => void;
}

interface FormErrors {
  fullName?: string;
  phone?: string;
  email?: string;
  password?: string;
  city?: string;
  terms?: string;
  general?: string;
}

export function ClientForm({
  onBack,
  onSwitch,
}: ClientFormProps) {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [city, setCity] = useState("");
  const [terms, setTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  function validate() {
    const nextErrors: FormErrors = {};

    if (!fullName.trim()) {
      nextErrors.fullName = "Please enter your full name.";
    } else if (fullName.trim().length < 2) {
      nextErrors.fullName = "Name must be at least 2 characters.";
    }

    if (!phone.trim()) {
      nextErrors.phone = "Please enter your phone number.";
    }

    if (!email.trim()) {
      nextErrors.email = "Please enter your email address.";
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      nextErrors.email = "Please enter a valid email address.";
    }

    if (!password) {
      nextErrors.password = "Please enter a password.";
    } else if (password.length < 8) {
      nextErrors.password =
        "Password must be at least 8 characters.";
    }

    if (!city) {
      nextErrors.city = "Please select your city.";
    }

    if (!terms) {
      nextErrors.terms =
        "You must accept the terms to continue.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!validate()) return;

    setLoading(true);

    try {
      const supabase = createClient();

      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/login`,
          data: {
            role: "client",
            full_name: fullName.trim(),
            phone: phone.trim(),
            city,
          },
        },
      });

      if (error) {
        setErrors({ general: error.message });
        return;
      }

      if (data.session) {
        toast.success("Account created successfully.");
        router.push("/onboarding");
        router.refresh();
        return;
      }

      toast.success("Account created. Check your email to verify it.");
      router.push("/login?new=1");
    } catch {
      setErrors({
        general: "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onBack}
          disabled={loading}
          className="-ml-2 h-8 w-8 shrink-0"
          aria-label="Choose another account type"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>

        <div>
          <h2 className="text-lg font-semibold tracking-tight">
            Create a client account
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Find and connect with qualified lawyers.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <Field
          label="Full name"
          htmlFor="client-full-name"
          error={errors.fullName}
        >
          <Input
            id="client-full-name"
            value={fullName}
            onChange={(event) => {
              setFullName(event.target.value);
              setErrors((current) => ({
                ...current,
                fullName: undefined,
                general: undefined,
              }));
            }}
            placeholder="Your full name brother"
            autoComplete="name"
            disabled={loading}
          />
        </Field>

        <Field
          label="Phone number"
          htmlFor="client-phone"
          error={errors.phone}
        >
          <Input
            id="client-phone"
            type="tel"
            value={phone}
            onChange={(event) => {
              setPhone(event.target.value);
              setErrors((current) => ({
                ...current,
                phone: undefined,
                general: undefined,
              }));
            }}
            placeholder="+92 0000 0000"
            autoComplete="tel"
            disabled={loading}
          />
        </Field>

        <Field
          label="Email address"
          htmlFor="client-email"
          error={errors.email}
        >
          <Input
            id="client-email"
            type="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              setErrors((current) => ({
                ...current,
                email: undefined,
                general: undefined,
              }));
            }}
            placeholder="kendaljenner_wazir@gmail.com"
            autoComplete="email"
            disabled={loading}
          />
        </Field>

        <Field
          label="Password"
          htmlFor="client-password"
          error={errors.password}
        >
          <PasswordField
            id="client-password"
            value={password}
            onChange={(value) => {
              setPassword(value);
              setErrors((current) => ({
                ...current,
                password: undefined,
                general: undefined,
              }));
            }}
            showPassword={showPassword}
            onToggle={() =>
              setShowPassword((value) => !value)
            }
            disabled={loading}
          />
        </Field>

        <Field
          label="City"
          htmlFor="client-city"
          error={errors.city}
        >
          <CityField
            value={city}
            onChange={(value) => {
              setCity(value);
              setErrors((current) => ({
                ...current,
                city: undefined,
                general: undefined,
              }));
            }}
            disabled={loading}
          />
        </Field>

        <TermsRow
          checked={terms}
          onCheckedChange={(checked) => {
            setTerms(checked);
            setErrors((current) => ({
              ...current,
              terms: undefined,
              general: undefined,
            }));
          }}
          disabled={loading}
          error={errors.terms}
        />

        {errors.general && <ErrText>{errors.general}</ErrText>}

        <SubmitButton loading={loading}>
          Create client account
        </SubmitButton>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <button
          type="button"
          onClick={onSwitch}
          disabled={loading}
          className="font-medium text-foreground underline-offset-4 hover:underline disabled:opacity-50"
        >
          Sign in
        </button>
      </p>
    </div>
  );
}
