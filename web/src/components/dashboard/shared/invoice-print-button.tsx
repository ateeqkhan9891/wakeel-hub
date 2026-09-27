"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export function InvoicePrintButton() {
  return (
    <Button onClick={() => window.print()} className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
      <Download className="h-4 w-4" />
      Download / Print
    </Button>
  );
}
