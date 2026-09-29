"use client";

import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { CASE_TYPES, CASE_STATUSES } from "@/lib/constants";
import { formatPKR } from "@/lib/utils";
import type { CaseInput } from "@/lib/data/case-types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const EMPTY_CASE_INPUT: CaseInput = {
  title: "", caseType: "", status: "active", caseNumber: "", courtCaseNumber: "",
  court: "", judgeName: "", nextHearingDate: "", clientName: "", clientPhone: "",
  clientEmail: "", clientCnic: "", clientAddress: "", opponentName: "", opponentLawyer: "",
  opponentContact: "", totalFee: "", advanceReceived: "", notes: "",
};

function num(v: string) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</p>
      {children}
    </div>
  );
}

function TF({
  label, value, onChange, type = "text", placeholder, required = false,
}: {
  label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string; required?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}{required && <span className="ml-0.5 text-rose-600">*</span>}</Label>
      <Input value={value} onChange={(e) => onChange(e.target.value)} type={type} placeholder={placeholder} className="h-9 rounded-lg border-slate-200 bg-white" />
    </div>
  );
}

export function CaseForm({
  initial, onSubmit, submitLabel, onSuccess,
}: {
  initial: CaseInput;
  onSubmit: (input: CaseInput) => Promise<{ ok: boolean; error?: string }>;
  submitLabel: string;
  onSuccess?: () => void;
}) {
  const [form, setForm] = useState<CaseInput>(initial);
  const [saving, start] = useTransition();

  function set<K extends keyof CaseInput>(key: K, value: CaseInput[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  const remaining = Math.max(num(form.totalFee) - num(form.advanceReceived), 0);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) {
      toast.error("Case title is required");
      return;
    }
    start(async () => {
      const result = await onSubmit(form);
      if (!result.ok) {
        toast.error("Could not save case", { description: result.error });
        return;
      }
      onSuccess?.();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Section title="Basic details">
        <TF label="Case title" value={form.title} onChange={(v) => set("title", v)} placeholder="e.g. Ahmed Khan vs XYZ Housing Society" required />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="space-y-1.5">
            <Label className="text-xs">Case type</Label>
            <Select value={form.caseType || undefined} onValueChange={(v) => set("caseType", v)}>
              <SelectTrigger className="h-9 rounded-lg border-slate-200 bg-white"><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>{CASE_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Status</Label>
            <Select value={form.status} onValueChange={(v) => set("status", v)}>
              <SelectTrigger className="h-9 rounded-lg border-slate-200 bg-white"><SelectValue /></SelectTrigger>
              <SelectContent>{CASE_STATUSES.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <TF label="Internal case no. (optional)" value={form.caseNumber} onChange={(v) => set("caseNumber", v)} placeholder="C-123/2026" />
        </div>
      </Section>

      <Section title="Client information">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <TF label="Client name" value={form.clientName} onChange={(v) => set("clientName", v)} />
          <TF label="Phone number" value={form.clientPhone} onChange={(v) => set("clientPhone", v)} placeholder="03XX XXXXXXX" />
          <TF label="Email (optional)" value={form.clientEmail} onChange={(v) => set("clientEmail", v)} type="email" />
        </div>
      </Section>

      <Section title="Court information">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <TF label="Court name" value={form.court} onChange={(v) => set("court", v)} placeholder="e.g. Family Court Peshawar" />
          <TF label="Case number in court (optional)" value={form.courtCaseNumber} onChange={(v) => set("courtCaseNumber", v)} placeholder="FC-55/2026" />
          <TF label="Judge name (optional)" value={form.judgeName} onChange={(v) => set("judgeName", v)} />
          <TF label="Next hearing date" value={form.nextHearingDate} onChange={(v) => set("nextHearingDate", v)} type="date" />
        </div>
      </Section>

      <Section title="Opposite party (optional)">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <TF label="Opponent name" value={form.opponentName} onChange={(v) => set("opponentName", v)} />
          <TF label="Opponent lawyer" value={form.opponentLawyer} onChange={(v) => set("opponentLawyer", v)} />
          <TF label="Opponent contact" value={form.opponentContact} onChange={(v) => set("opponentContact", v)} />
        </div>
      </Section>

      <Section title="Financial information">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <TF label="Total agreed fee" value={form.totalFee} onChange={(v) => set("totalFee", v)} type="number" placeholder="100000" />
          <TF label="Advance received" value={form.advanceReceived} onChange={(v) => set("advanceReceived", v)} type="number" placeholder="40000" />
          <div className="space-y-1.5">
            <Label className="text-xs">Remaining</Label>
            <div className="flex h-9 items-center rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-950">{formatPKR(remaining)}</div>
          </div>
        </div>
      </Section>

      <Section title="Case notes (private to you)">
        <Textarea
          value={form.notes}
          onChange={(e) => set("notes", e.target.value)}
          rows={4}
          placeholder="e.g. Client seeks child custody after divorce. Documents reviewed. Petition to be filed next week."
          className="rounded-lg border-slate-200 bg-white"
        />
      </Section>

      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={saving} className="gap-2 rounded-lg bg-slate-950 text-white hover:bg-slate-800">
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}

