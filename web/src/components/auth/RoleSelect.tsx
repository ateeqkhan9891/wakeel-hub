"use client";

import { BriefcaseBusiness, UserRound } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

type Role = "client" | "lawyer";

interface RoleSelectProps {
  onSelect: (role: Role) => void;
  onSwitch: () => void;
}

export function RoleSelect({
  onSelect,
  onSwitch,
}: RoleSelectProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <h2 className="text-lg font-semibold tracking-tight">
          Create your account
        </h2>

        <p className="text-sm text-muted-foreground">
          Choose how you want to use Wakeel360.
        </p>
      </div>

      <div className="space-y-3">
        <RoleOption
          icon={UserRound}
          title="Client"
          description="Find and connect with qualified lawyers."
          onClick={() => onSelect("client")}
        />

        <RoleOption
          icon={BriefcaseBusiness}
          title="Lawyer"
          description="Build your profile and connect with clients."
          onClick={() => onSelect("lawyer")}
        />
      </div>

      <div className="pt-2 text-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <button
            type="button"
            onClick={onSwitch}
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}

interface RoleOptionProps {
  icon: LucideIcon;
  title: string;
  description: string;
  onClick: () => void;
}

function RoleOption({
  icon: Icon,
  title,
  description,
  onClick,
}: RoleOptionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full items-center gap-4 rounded-lg border bg-background p-4 text-left transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-muted">
        <Icon className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-foreground" />
      </span>

      <span className="min-w-0 flex-1">
        <span className="block text-sm font-medium">
          {title}
        </span>

        <span className="mt-0.5 block text-xs leading-5 text-muted-foreground">
          {description}
        </span>
      </span>

      <span
        aria-hidden
        className="text-muted-foreground transition-transform group-hover:translate-x-0.5"
      >
        →
      </span>
    </button>
  );
}
