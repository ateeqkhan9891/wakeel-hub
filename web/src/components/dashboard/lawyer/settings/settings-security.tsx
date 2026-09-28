"use client";

import { useState } from "react";

import {
  AlertTriangle,
  CheckCircle2,
  KeyRound,
  LogOut,
  Mail,
  ShieldCheck,
  Trash2,
} from "lucide-react";

import type { LawyerSettings } from "@/lib/data/lawyer-settings";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  InfoRow,
  SettingsCard,
  ToggleGroup,
} from "./settings-ui";

type SettingsSecurityProps = {
  settings: LawyerSettings;
  isVerified: boolean;
  onChangePassword: (
    password: string,
    confirmPassword: string,
  ) => void | Promise<void>;
  onSignOut: () => void | Promise<void>;
  onRequestDeletion: () => void | Promise<void>;
};

export function SettingsSecurity({
  settings,
  isVerified,
  onChangePassword,
  onSignOut,
  onRequestDeletion,
}: SettingsSecurityProps) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <div className="space-y-5">
      <SettingsCard
        icon={KeyRound}
        title="Change password"
        description="Update your password regularly to help keep your account secure."
      >
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void onChangePassword(password, confirmPassword);
          }}
          className="space-y-5"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label
                htmlFor="new-password"
                className="text-xs font-medium text-slate-700"
              >
                New password
              </Label>

              <Input
                id="new-password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter a new password"
                className="h-10 border-slate-200 bg-white shadow-none focus-visible:border-primary/40 focus-visible:ring-primary/15"
              />
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="confirm-password"
                className="text-xs font-medium text-slate-700"
              >
                Confirm password
              </Label>

              <Input
                id="confirm-password"
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Repeat your new password"
                className="h-10 border-slate-200 bg-white shadow-none focus-visible:border-primary/40 focus-visible:ring-primary/15"
              />
            </div>
          </div>

          <div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-slate-50/60 p-3.5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-medium text-slate-700">
                Password requirements
              </p>
              <p className="mt-0.5 text-xs text-slate-500">
                Use at least 6 characters and make sure both fields match.
              </p>
            </div>

            <Button
              type="submit"
              size="sm"
              className="shrink-0"
            >
              Update password
            </Button>
          </div>
        </form>
      </SettingsCard>

      <SettingsCard
        icon={ShieldCheck}
        title="Account information"
        description="Review the basic security and account details associated with your account."
      >
        <dl className="divide-y divide-slate-100">
          <InfoRow label="Email">
            <span className="flex items-center justify-end gap-1.5">
              <Mail className="h-3.5 w-3.5 text-slate-400" />
              <span className="max-w-[220px] truncate">
                {settings.email || "Not available"}
              </span>
            </span>
          </InfoRow>

          <InfoRow label="Account status">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
              <CheckCircle2 className="h-3.5 w-3.5" />
              {isVerified ? "Verified" : "Active"}
            </span>
          </InfoRow>

          <InfoRow label="Last sign-in">
            {settings.lastSignInAt
              ? new Date(settings.lastSignInAt).toLocaleString()
              : "Not available"}
          </InfoRow>

          <InfoRow label="Member since">
            {settings.accountCreatedAt
              ? new Date(settings.accountCreatedAt).toLocaleDateString()
              : "Not available"}
          </InfoRow>
        </dl>
      </SettingsCard>

      <SettingsCard
        icon={LogOut}
        title="Session"
        description="Sign out of your WakeelHub account on this device."
      >
        <div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-slate-50/50 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-slate-500 shadow-sm ring-1 ring-slate-200/80">
              <LogOut className="h-4 w-4" />
            </div>

            <div>
              <p className="text-sm font-medium text-slate-800">
                Sign out of this device
              </p>
              <p className="mt-0.5 text-xs text-slate-500">
                You can sign back in at any time.
              </p>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={() => void onSignOut()}
            className="shrink-0 gap-2"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </Button>
        </div>
      </SettingsCard>

      <SettingsCard
        icon={AlertTriangle}
        title="Danger zone"
        description="Actions here can have permanent consequences for your account."
      >
        <ToggleGroup>
          <div className="rounded-xl border border-red-200 bg-red-50/40 p-4">
            <div className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-red-200 bg-red-100 text-red-600">
                <Trash2 className="h-4 w-4" />
              </span>

              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-semibold text-slate-900">
                  Request account deletion
                </h4>

                <p className="mt-1 max-w-xl text-xs leading-5 text-slate-500">
                  Request permanent deletion of your account and associated
                  data. This action will be reviewed by support before any
                  account data is removed.
                </p>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => void onRequestDeletion()}
                  className="mt-3 border-red-200 bg-white text-red-600 hover:bg-red-50 hover:text-red-700"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Request deletion
                </Button>
              </div>
            </div>
          </div>
        </ToggleGroup>
      </SettingsCard>
    </div>
  );
}