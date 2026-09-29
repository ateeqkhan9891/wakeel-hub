"use client";

import { useState } from "react";

import { DemoAccountsDialog } from "./DemoAccountsDialog";

export function DemoAccountsLauncher() {
  const [open, setOpen] = useState(true);

  return (
    <DemoAccountsDialog
      open={open}
      onClose={() => setOpen(false)}
    />
  );
}
