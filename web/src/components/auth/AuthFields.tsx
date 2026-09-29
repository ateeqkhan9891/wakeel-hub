"use client";

import type { ReactNode } from "react";

import { Loader2, MapPin } from "lucide-react";

import { CITIES } from "@/lib/constants";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FieldProps {
  label: string;
  htmlFor?: string;
  error?: string;
  action?: ReactNode;
  children: ReactNode;
}

export function Field({
  label,
  htmlFor,
  error,
  action,
  children,
}: FieldProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-4">
        <label
          htmlFor={htmlFor}
          className="text-sm font-medium"
        >
          {label}
        </label>

        {action}
      </div>

      {children}

      {error && <ErrText>{error}</ErrText>}
    </div>
  );
}

export function ErrText({ children }: { children: ReactNode }) {
  return (
    <p className="text-sm text-destructive" role="alert">
      {children}
    </p>
  );
}

interface PasswordFieldProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  showPassword: boolean;
  onToggle: () => void;
  disabled?: boolean;
  placeholder?: string;
  error?: string;
}

export function PasswordField({
  id,
  value,
  onChange,
  showPassword,
  onToggle,
  disabled,
  placeholder = "Enter your password",
  error,
}: PasswordFieldProps) {
  return (
    <div className="space-y-2">
      <div className="relative">
        <Input
          id={id}
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          autoComplete="new-password"
          disabled={disabled}
          className="pr-16"
        />

        <button
          type="button"
          onClick={onToggle}
          disabled={disabled}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground disabled:pointer-events-none disabled:opacity-50"
        >
          {showPassword ? "Hide" : "Show"}
        </button>
      </div>

      {error && <ErrText>{error}</ErrText>}
    </div>
  );
}

interface CityFieldProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: string;
}

export function CityField({
  value,
  onChange,
  disabled,
  error,
}: CityFieldProps) {
  return (
    <div className="space-y-2">
      <Select
        value={value}
        onValueChange={onChange}
        disabled={disabled}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select your city" />
        </SelectTrigger>

        <SelectContent>
          {CITIES.map((city) => (
            <SelectItem key={city} value={city}>
              <span className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                {city}
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {error && <ErrText>{error}</ErrText>}
    </div>
  );
}

interface TermsRowProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  error?: string;
}

export function TermsRow({
  checked,
  onCheckedChange,
  disabled,
  error,
}: TermsRowProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-start gap-3">
        <Checkbox
          id="terms"
          checked={checked}
          onCheckedChange={(value) =>
            onCheckedChange(value === true)
          }
          disabled={disabled}
        />

        <label
          htmlFor="terms"
          className="text-sm leading-5 text-muted-foreground"
        >
          I agree to the{" "}
          <a
            href="/terms"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Terms of Service
          </a>{" "}
          and{" "}
          <a
            href="/privacy"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Privacy Policy
          </a>
          .
        </label>
      </div>

      {error && <ErrText>{error}</ErrText>}
    </div>
  );
}

export function SignupHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="space-y-1.5">
      <h2 className="text-lg font-semibold tracking-tight">
        {title}
      </h2>

      <p className="text-sm text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

export function SubmitButton({
  loading,
  children,
}: {
  loading: boolean;
  children: ReactNode;
}) {
  return (
    <Button
      type="submit"
      disabled={loading}
      className={cn("w-full")}
    >
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Please wait...
        </>
      ) : (
        children
      )}
    </Button>
  );
}
