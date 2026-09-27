"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, FileWarning, Loader2, SearchCheck, X } from "lucide-react";
import { toast } from "sonner";

import { updateComplaintStatus } from "@/app/actions/complaint-actions";
import type { AdminComplaint } from "@/lib/data/admin";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/dashboard/shared/status-badge";
import { formatDate } from "@/lib/utils";

export function ComplaintsList({ reports }: { reports: AdminComplaint[] }) {
  const router = useRouter();
  const [pending, start] = useTransition();

  function setStatus(id: string, status: "investigating" | "resolved" | "dismissed") {
    start(async () => {
      const result = await updateComplaintStatus(id, status);
      if (!result.ok) {
        toast.error("Could not update complaint", { description: result.error });
        return;
      }
      toast.success(`Complaint marked ${status}`);
      router.refresh();
    });
  }

  return (
    <div className="space-y-4">
      {reports.map((r) => (
        <Card key={r.id} className="border-border/80 p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
                <FileWarning className="h-4.5 w-4.5" />
              </span>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-semibold text-foreground">{r.subject}</p>
                  <StatusBadge status={r.status} />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Reported by {r.reportedBy} {r.against ? `against ${r.against}` : ""} - {formatDate(r.createdAt)}
                </p>
                <Badge variant="outline" className="mt-2 rounded-full font-normal">{r.category}</Badge>
                {r.description && <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">{r.description}</p>}
              </div>
            </div>

            {(r.status === "open" || r.status === "investigating") && (
              <div className="flex shrink-0 flex-wrap items-center gap-2">
                {r.status === "open" && (
                  <Button size="sm" variant="outline" disabled={pending} className="gap-1.5" onClick={() => setStatus(r.id, "investigating")}>
                    {pending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <SearchCheck className="h-3.5 w-3.5" />} Investigate
                  </Button>
                )}
                <Button size="sm" disabled={pending} className="gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => setStatus(r.id, "resolved")}>
                  {pending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />} Resolve
                </Button>
                <Button size="sm" disabled={pending} variant="outline" className="gap-1.5" onClick={() => setStatus(r.id, "dismissed")}>
                  {pending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <X className="h-3.5 w-3.5" />} Dismiss
                </Button>
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}
