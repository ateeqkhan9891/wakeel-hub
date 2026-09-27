"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Download, FileText, Loader2, Lock, Search, Share2, Upload, X } from "lucide-react";
import { toast } from "sonner";

import { addCaseDocument } from "@/app/actions/case-actions";
import { createClient } from "@/lib/supabase/client";
import { formatDate } from "@/lib/utils";
import type { LawyerDocumentsData } from "@/lib/data/lawyer-documents";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

function fmtSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export function LawyerDocumentsLibrary({ data }: { data: LawyerDocumentsData }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [uploading, setUploading] = useState(false);
  const [query, setQuery] = useState("");
  const [caseId, setCaseId] = useState(data.cases[0]?.id ?? "");
  const [share, setShare] = useState(true);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return data.documents.filter((doc) => !q || `${doc.name} ${doc.caseTitle} ${doc.clientName ?? ""}`.toLowerCase().includes(q));
  }, [data.documents, query]);

  async function upload(file: File) {
    if (!caseId) return toast.error("Choose a case first");
    setUploading(true);
    const supabase = createClient();
    const ext = (file.name.split(".").pop() || "file").toLowerCase();
    const path = `${caseId}/${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from("case-documents").upload(path, file, { contentType: file.type || undefined });
    setUploading(false);
    if (error) return toast.error("Upload failed", { description: error.message });

    start(async () => {
      const result = await addCaseDocument(caseId, { name: file.name, path, fileType: file.type || "application/octet-stream", size: file.size, isPrivate: !share });
      if (!result.ok) {
        toast.error("Could not save document", { description: result.error });
        return;
      }
      toast.success(share ? "Document uploaded and shared" : "Private document uploaded");
      router.refresh();
    });
  }

  return (
    <div className="space-y-5">
      <Card className="border-border/80 p-4">
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1fr)_220px_180px]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search documents..." className="pl-9" />
          </div>
          <Select value={caseId} onValueChange={setCaseId}>
            <SelectTrigger><SelectValue placeholder="Choose case" /></SelectTrigger>
            <SelectContent>
              {data.cases.map((c) => <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>)}
            </SelectContent>
          </Select>
          <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            {uploading || pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            Upload
            <input type="file" className="sr-only" disabled={uploading || pending || !caseId} onChange={(e) => { const file = e.target.files?.[0]; e.target.value = ""; if (file) void upload(file); }} />
          </label>
        </div>
        <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
          <input id="share-document" type="checkbox" checked={share} onChange={(e) => setShare(e.target.checked)} className="h-4 w-4 rounded border-border" />
          <Label htmlFor="share-document" className="text-sm">Visible to client</Label>
        </div>
      </Card>

      {rows.length === 0 ? (
        <Card className="flex flex-col items-center gap-2 border-dashed border-border/80 p-8 text-center">
          <FileText className="h-8 w-8 text-muted-foreground/60" />
          <p className="text-sm font-medium text-foreground">No documents found</p>
          <p className="text-sm text-muted-foreground">Upload files against a case to build the document library.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
          {rows.map((doc) => (
            <Card key={doc.id} className="border-border/80 p-4">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-gold"><FileText className="h-5 w-5" /></span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-foreground">{doc.name}</p>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">{doc.caseTitle}{doc.clientName ? ` with ${doc.clientName}` : ""}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <span>{fmtSize(doc.size)}</span>
                    <span>{formatDate(doc.createdAt)}</span>
                    <span className="inline-flex items-center gap-1">{doc.isPrivate ? <Lock className="h-3 w-3" /> : <Share2 className="h-3 w-3" />}{doc.isPrivate ? "Private" : "Client visible"}</span>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  {doc.url && <Button asChild variant="ghost" size="icon" aria-label={`Download ${doc.name}`}><a href={doc.url} target="_blank" rel="noopener noreferrer"><Download className="h-4 w-4" /></a></Button>}
                  <Button asChild variant="ghost" size="icon" aria-label="Open case"><Link href={`/dashboard/lawyer/cases/${doc.caseId}`}><X className="h-4 w-4 rotate-45" /></Link></Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
