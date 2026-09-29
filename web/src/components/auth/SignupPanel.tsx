"use client";

import { useState } from "react";

import { ClientForm } from "./ClientForm";
import { LawyerForm } from "./LawyerForm";
import { RoleSelect } from "./RoleSelect";

type Role = "client" | "lawyer";

interface SignupPanelProps {
  initialRole?: Role;
  onSwitch: () => void;
}

export function SignupPanel({
  initialRole,
  onSwitch,
}: SignupPanelProps) {
  const [role, setRole] = useState<Role | null>(
    initialRole ?? null,
  );

  if (role === "client") {
    return (
      <ClientForm
        onBack={() => setRole(null)}
        onSwitch={onSwitch}
      />
    );
  }

  if (role === "lawyer") {
    return (
      <LawyerForm
        onBack={() => setRole(null)}
        onSwitch={onSwitch}
      />
    );
  }

  return (
    <RoleSelect
      onSelect={setRole}
      onSwitch={onSwitch}
    />
  );
}
