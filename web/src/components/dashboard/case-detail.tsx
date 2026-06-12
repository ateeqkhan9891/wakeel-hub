"use client";

import { useState } from "react";
import { Calendar, FileText, Gavel, Upload } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { PRACTICE_AREAS } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import type { CaseFile } from "@/lib/types";

export function CaseDetail({ caseFile, viewerRole }: { caseFile: CaseFile; viewerRole: "client" | "lawyer" }) {
  const [uploading, setUploading] = useState(false);
  const areaName = PRACTICE_AREAS.find((p) => p.slug === caseFile.practiceArea)?.name ?? caseFile.practiceArea;
  const counterparty = viewerRole === "client" ? caseFile.lawyer : caseFile.client;
  const counterpartyLabel = viewerRole === "client" ? "Represented by" : "Client";

  function handleUpload() {
    setUploading(true);
    setTimeout(() => {
      setUploading(false);
      toast.success("Document uploaded", { description: "Your file has been added to this case's document list." });
    }, 700);
  }

  return (
    <div className="space-y-6">
      <Card className="border-border/80 p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-heading text-xl font-semibold tracking-tight text-foreground sm:text-2xl">{caseFile.title}</h1>
              <StatusBadge status={caseFile.status} />
            </div>
            <p className="mt-1.5 text-sm text-muted-foreground">{caseFile.caseNumber} - {areaName} - {caseFile.court}</p>
          </div>
        </div>
        <Separator className="my-4" />
        <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
          <div>
            <p className="text-xs text-muted-foreground">{counterpartyLabel}</p>
            <p className="mt-1 flex items-center gap-1.5 font-medium text-foreground"><Gavel className="h-4 w-4 text-gold" /> {counterparty}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Filed on</p>
            <p className="mt-1 font-medium text-foreground">{formatDate(caseFile.filedDate)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Next hearing</p>
            <p className="mt-1 font-medium text-foreground">{caseFile.nextHearing ? formatDate(caseFile.nextHearing) : "Not scheduled"}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Court</p>
            <p className="mt-1 font-medium text-foreground">{caseFile.court}</p>
          </div>
        </div>
      </Card>

      <Tabs defaultValue="updates">
        <TabsList>
          <TabsTrigger value="updates">Updates</TabsTrigger>
          <TabsTrigger value="hearings">Hearing dates</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="updates" className="mt-5">
          <Card className="border-border/80 p-5">
            <ol className="space-y-5">
              {caseFile.updates.map((update, i) => (
                <li key={update.id} className="relative pl-6">
                  <span className="absolute left-0 top-1.5 h-2.5 w-2.5 rounded-full bg-primary" />
                  {i !== caseFile.updates.length - 1 && <span className="absolute left-[4.5px] top-4 h-[calc(100%+0.75rem)] w-px bg-border" />}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-foreground">{update.title}</p>
                    <span className="text-xs text-muted-foreground">{formatDate(update.date)}</span>
                  </div>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">{update.description}</p>
                  <p className="mt-1 text-xs text-muted-foreground">- {update.author}</p>
                </li>
              ))}
            </ol>
          </Card>
        </TabsContent>

        <TabsContent value="hearings" className="mt-5">
          <Card className="border-border/80 p-5">
            <div className="space-y-3">
              {caseFile.hearings.map((hearing) => (
                <div key={hearing.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-secondary/30 p-4">
                  <div className="flex items-start gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/8 text-primary">
                      <Calendar className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{hearing.purpose}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{formatDate(hearing.date)} - {hearing.court}</p>
                    </div>
                  </div>
                  <StatusBadge status={hearing.status} />
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="mt-5">
          <Card className="border-border/80 p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{caseFile.documents.length} files shared on this case</p>
              <Button size="sm" variant="outline" className="gap-2" onClick={handleUpload} disabled={uploading}>
                <Upload className="h-3.5 w-3.5" />
                {uploading ? "Uploading..." : "Upload document"}
              </Button>
            </div>
            <div className="mt-4 space-y-2.5">
              {caseFile.documents.map((doc) => (
                <div key={doc.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-secondary/30 p-3.5">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/8 text-primary">
                      <FileText className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-sm font-medium text-foreground">{doc.name}</p>
                      <p className="text-xs text-muted-foreground">Uploaded by {doc.uploadedBy} - {formatDate(doc.uploadedAt)} - {doc.size}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="rounded-full font-normal">{doc.type}</Badge>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
