"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Pencil, Plus, Loader2, Paperclip, Eye, EyeOff, FileText, Download, Trash2, Check,
  CalendarClock, CalendarPlus, Gavel, Scale, Wallet, ShieldCheck, X, CircleDot, Activity,
  User, Phone, Mail, MapPin, CreditCard, Image as ImageIcon, FileStack, Flag,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { toast } from "sonner";

import { CASE_STATUSES, UPDATE_TYPES, updateTypeLabel, caseStatusLabel } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";
import { cn, formatDate, formatDateTime, formatPKR } from "@/lib/utils";
import type { CaseRecord, CaseDocument, CaseUpdateRow, CaseHearingRow, CaseInput } from "@/lib/data/case-types";
import { addCaseUpdate, addHearing, updateCase, deleteCase, deleteCaseDocument, saveCaseNote } from "@/app/actions/case-actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusBadge } from "@/components/dashboard/shared/status-badge";
import { CaseForm } from "@/components/dashboard/shared/case-form";

const easeOut = [0.22, 1, 0.36, 1] as const;

function fmtSize(b: number) {
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(0)} KB`;
  return `${(b / 1024 / 1024).toFixed(1)} MB`;
}

const TYPE_ICON: Record<string, LucideIcon> = {
  general: CircleDot, hearing: CalendarClock, document: FileText, court_order: Gavel,
  milestone: Check, payment: Wallet, message: Activity, settlement: ShieldCheck, judgment: Scale,
};

type Tab = "overview" | "timeline" | "hearings" | "payments" | "documents" | "notes";

export function LawyerCaseWorkspace({
  record, note, documents, timeline, hearings,
}: {
  record: CaseRecord;
  note: string;
  documents: CaseDocument[];
  timeline: CaseUpdateRow[];
  hearings: CaseHearingRow[];
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [pending, start] = useTransition();
  const [tab, setTab] = useState<Tab>("overview");
  const [hearingFormOpen, setHearingFormOpen] = useState(false);

  const editInitial: CaseInput = {
    title: record.title, caseType: record.case_type ?? "", status: record.status,
    caseNumber: record.case_number ?? "", courtCaseNumber: record.court_case_number ?? "",
    court: record.court ?? "", judgeName: record.judge_name ?? "", nextHearingDate: record.next_hearing_date ?? "",
    clientName: record.client_name ?? "", clientPhone: record.client_phone ?? "", clientEmail: record.client_email ?? "",
    clientCnic: record.client_cnic ?? "", clientAddress: record.client_address ?? "",
    opponentName: record.opponent_name ?? "", opponentLawyer: record.opponent_lawyer ?? "", opponentContact: record.opponent_contact ?? "",
    totalFee: record.total_fee ? String(record.total_fee) : "", advanceReceived: record.advance_received ? String(record.advance_received) : "",
    notes: note,
  };

  async function handleEditSubmit(input: CaseInput) {
    const r = await updateCase(record.id, input);
    if (r.ok) {
      toast.success("Case details updated");
      setEditing(false);
      router.refresh();
    }
    return r;
  }

  function handleDelete() {
    if (!window.confirm("Delete this case permanently? This cannot be undone.")) return;
    start(async () => {
      const r = await deleteCase(record.id);
      if (!r.ok) { toast.error("Could not delete", { description: r.error }); return; }
      toast.success("Case deleted");
      router.push("/dashboard/lawyer/cases");
    });
  }

  function scheduleHearing() {
    setEditing(false);
    setTab("hearings");
    setHearingFormOpen(true);
  }

  function editCase() {
    setTab("overview");
    setEditing(true);
  }

  return (
    <Tabs value={tab} onValueChange={(v) => setTab(v as Tab)} className="w-full">
      {/* Quick actions */}
      <div className="flex flex-wrap items-center justify-end gap-2">
        <Button variant="outline" className="gap-2" onClick={scheduleHearing}>
          <CalendarPlus className="h-4 w-4" /> Schedule hearing
        </Button>
        <Button variant="outline" className="gap-2" onClick={editCase}>
          <Pencil className="h-4 w-4" /> Edit case
        </Button>
        <AddUpdatePanel caseId={record.id} />
      </div>

      <TabsList className="mt-4 flex h-auto flex-wrap justify-start gap-1 rounded-xl border border-slate-200 bg-white p-1">
        <TabsTrigger value="overview" className="rounded-lg">Overview</TabsTrigger>
        <TabsTrigger value="timeline" className="rounded-lg">Timeline {timeline.length > 0 && <span className="ml-1 text-xs opacity-60">{timeline.length}</span>}</TabsTrigger>
        <TabsTrigger value="hearings" className="rounded-lg">Hearings {hearings.length > 0 && <span className="ml-1 text-xs opacity-60">{hearings.length}</span>}</TabsTrigger>
        <TabsTrigger value="payments" className="rounded-lg">Payments</TabsTrigger>
        <TabsTrigger value="documents" className="rounded-lg">Documents {documents.length > 0 && <span className="ml-1 text-xs opacity-60">{documents.length}</span>}</TabsTrigger>
        <TabsTrigger value="notes" className="rounded-lg">Private notes</TabsTrigger>
      </TabsList>

      {/* OVERVIEW */}
      <TabsContent value="overview" className="mt-5">
        {editing ? (
          <Card className="border-slate-200 p-5 ring-0">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-heading text-base font-semibold text-slate-950">Edit case details</h2>
              <Button variant="ghost" size="sm" onClick={() => setEditing(false)} className="gap-1.5"><X className="h-4 w-4" /> Cancel</Button>
            </div>
            <CaseForm initial={editInitial} onSubmit={handleEditSubmit} submitLabel="Save changes" />
          </Card>
        ) : (
          <OverviewTab record={record} onDelete={handleDelete} deleting={pending} />
        )}
      </TabsContent>

      {/* TIMELINE */}
      <TabsContent value="timeline" className="mt-5">
        <TimelineTab timeline={timeline} createdAt={record.created_at} />
      </TabsContent>

      {/* HEARINGS */}
      <TabsContent value="hearings" className="mt-5">
        <HearingsTab caseId={record.id} hearings={hearings} formOpen={hearingFormOpen} setFormOpen={setHearingFormOpen} />
      </TabsContent>

      {/* PAYMENTS */}
      <TabsContent value="payments" className="mt-5">
        <PaymentsTab record={record} timeline={timeline} />
      </TabsContent>

      {/* DOCUMENTS */}
      <TabsContent value="documents" className="mt-5">
        <DocumentsTab caseId={record.id} documents={documents} />
      </TabsContent>

      {/* PRIVATE NOTES */}
      <TabsContent value="notes" className="mt-5">
        <NotesTab caseId={record.id} initial={note} />
      </TabsContent>
    </Tabs>
  );
}

// ---- Overview -------------------------------------------------------------
function OverviewTab({ record, onDelete, deleting }: { record: CaseRecord; onDelete: () => void; deleting: boolean }) {
  const caseInfo: { label: string; value: string | null; icon?: LucideIcon }[] = [
    { label: "Case type", value: record.case_type },
    { label: "Internal case no.", value: record.case_number },
    { label: "Court case no.", value: record.court_case_number },
    { label: "Court", value: record.court, icon: Gavel },
    { label: "Judge", value: record.judge_name },
    { label: "Filed", value: record.filing_date ? formatDate(record.filing_date) : null },
    { label: "Next hearing", value: record.next_hearing_date ? formatDate(record.next_hearing_date) : null, icon: CalendarClock },
  ];

  const clientInfo: { label: string; value: string | null; icon: LucideIcon }[] = [
    { label: "Name", value: record.client_name, icon: User },
    { label: "Phone", value: record.client_phone, icon: Phone },
    { label: "Email", value: record.client_email, icon: Mail },
    { label: "CNIC", value: record.client_cnic, icon: CreditCard },
    { label: "Address", value: record.client_address, icon: MapPin },
  ];

  const opponent: { label: string; value: string | null }[] = [
    { label: "Opponent", value: record.opponent_name },
    { label: "Opponent lawyer", value: record.opponent_lawyer },
    { label: "Opponent contact", value: record.opponent_contact },
  ];

  const collectedPct = record.total_fee > 0 ? Math.min(100, Math.round((record.advance_received / record.total_fee) * 100)) : 0;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <SectionCard title="Case information" className="lg:col-span-2">
          <dl className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
            <View label="Status" node={<StatusBadge status={caseStatusLabel(record.status)} />} />
            {caseInfo.filter((r) => r.value).map((r) => (
              <View key={r.label} label={r.label} value={r.value} icon={r.icon} />
            ))}
          </dl>
        </SectionCard>

        <SectionCard title="Client information">
          {clientInfo.some((r) => r.value) ? (
            <dl className="space-y-3.5">
              {clientInfo.filter((r) => r.value).map((r) => (
                <View key={r.label} label={r.label} value={r.value} icon={r.icon} />
              ))}
            </dl>
          ) : (
            <Empty>No client details recorded.</Empty>
          )}
        </SectionCard>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <SectionCard title="Fee summary">
          <div className="space-y-3 text-sm">
            <FeeRow label="Total agreed fee" value={formatPKR(record.total_fee)} />
            <FeeRow label="Amount paid" value={formatPKR(record.advance_received)} />
            <div className="border-t border-slate-100 pt-3"><FeeRow label="Remaining balance" value={formatPKR(record.remaining_fee)} strong /></div>
            {record.total_fee > 0 && (
              <div className="pt-1">
                <Progress value={collectedPct} className="h-1.5 bg-slate-100" />
                <p className="mt-1.5 text-xs text-slate-500">{collectedPct}% collected</p>
              </div>
            )}
          </div>
        </SectionCard>

        <SectionCard title="Opposite party">
          {opponent.some((r) => r.value) ? (
            <dl className="space-y-3.5">
              {opponent.filter((r) => r.value).map((r) => (
                <View key={r.label} label={r.label} value={r.value} />
              ))}
            </dl>
          ) : (
            <Empty>No opposing party recorded.</Empty>
          )}
        </SectionCard>
      </div>

      <div className="flex justify-end">
        <Button variant="outline" onClick={onDelete} disabled={deleting} className="gap-2 border-rose-200 text-rose-600 hover:bg-rose-50">
          {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />} Delete case
        </Button>
      </div>
    </div>
  );
}

// ---- Timeline -------------------------------------------------------------
type TimelineEvent = {
  id: string;
  title: string;
  type: string;
  description: string;
  createdAt: string;
  visibleToClient: boolean | null; // null = system event (no visibility chip)
  attachmentName: string | null;
  attachmentUrl: string | null;
};

function TimelineTab({ timeline, createdAt }: { timeline: CaseUpdateRow[]; createdAt: string }) {
  const events: TimelineEvent[] = [
    ...timeline.map((u) => ({
      id: u.id, title: u.title, type: u.updateType, description: u.description,
      createdAt: u.createdAt, visibleToClient: u.visibleToClient,
      attachmentName: u.attachmentName, attachmentUrl: u.attachmentUrl,
    })),
    {
      id: "__created", title: "Case created", type: "__system", description: "Case file opened in your workspace.",
      createdAt, visibleToClient: null, attachmentName: null, attachmentUrl: null,
    },
  ];

  return (
    <SectionCard title="Case activity">
      {timeline.length === 0 ? (
        <Empty>No case activity recorded yet. Use &quot;Add update&quot; to log progress. When visible, it appears on the client&apos;s dashboard.</Empty>
      ) : (
        <div className="relative pl-8">
          <div className="absolute left-[0.7rem] top-1 h-[calc(100%-1rem)] w-px bg-gradient-to-b from-gold via-gold/40 to-transparent" aria-hidden />
          <div className="space-y-4">
            {events.map((u, i) => {
              const isSystem = u.type === "__system";
              const Icon = isSystem ? Flag : (TYPE_ICON[u.type] ?? CircleDot);
              return (
                <motion.div key={u.id} initial={{ opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, ease: easeOut, delay: Math.min(i, 6) * 0.04 }} className="relative">
                  <span className={cn("absolute -left-8 top-0.5 flex h-6 w-6 items-center justify-center rounded-full ring-4 ring-white", i === 0 ? "bg-gold text-primary" : isSystem ? "bg-slate-200 text-slate-600" : "bg-primary text-primary-foreground")}>
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-slate-950">{u.title}</p>
                      <span className="text-[11px] text-slate-500">{formatDateTime(u.createdAt)}</span>
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">
                        {isSystem ? "System" : updateTypeLabel(u.type)}
                      </span>
                      <span className="text-[10px] text-slate-400">by You</span>
                      {u.visibleToClient !== null && (
                        <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium", u.visibleToClient ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600")}>
                          {u.visibleToClient ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />} {u.visibleToClient ? "Visible to client" : "Private"}
                        </span>
                      )}
                    </div>
                    {u.description && <p className="mt-2 text-sm leading-6 text-slate-600">{u.description}</p>}
                    {u.attachmentName && u.attachmentUrl && (
                      <a href={u.attachmentUrl} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:border-gold/50">
                        <FileText className="h-3.5 w-3.5 text-gold" /> {u.attachmentName} <Download className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </SectionCard>
  );
}

// ---- Payments -------------------------------------------------------------
function PaymentsTab({ record, timeline }: { record: CaseRecord; timeline: CaseUpdateRow[] }) {
  const payments = timeline.filter((u) => u.updateType === "payment");
  const collectedPct = record.total_fee > 0 ? Math.min(100, Math.round((record.advance_received / record.total_fee) * 100)) : 0;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="border-slate-200 p-5 ring-0"><p className="text-xs text-slate-500">Agreed fee</p><p className="mt-1 font-heading text-xl font-semibold text-slate-950">{formatPKR(record.total_fee)}</p></Card>
        <Card className="border-slate-200 p-5 ring-0"><p className="text-xs text-slate-500">Amount paid</p><p className="mt-1 font-heading text-xl font-semibold text-emerald-600">{formatPKR(record.advance_received)}</p></Card>
        <Card className="border-slate-200 p-5 ring-0"><p className="text-xs text-slate-500">Outstanding balance</p><p className="mt-1 font-heading text-xl font-semibold text-slate-950">{formatPKR(record.remaining_fee)}</p></Card>
      </div>

      {record.total_fee > 0 && (
        <SectionCard title="Payment progress">
          <Progress value={collectedPct} className="h-2 bg-slate-100" />
          <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
            <span>{collectedPct}% collected</span>
            <span>{formatPKR(record.advance_received)} of {formatPKR(record.total_fee)}</span>
          </div>
        </SectionCard>
      )}

      <SectionCard title="Payment history">
        {payments.length === 0 ? (
          <Empty>No payments recorded. Log a payment via &quot;Add update&quot; using the <span className="font-medium">Payment</span> type to track it here.</Empty>
        ) : (
          <div className="-mx-5 overflow-x-auto px-5">
            <table className="w-full min-w-[26rem] text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                  <th className="py-2 pr-4">Date</th>
                  <th className="py-2 pr-4">Description</th>
                  <th className="py-2">Visibility</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p.id} className="border-b border-slate-50 last:border-0">
                    <td className="py-2.5 pr-4 whitespace-nowrap text-slate-600">{formatDate(p.createdAt)}</td>
                    <td className="py-2.5 pr-4">
                      <p className="font-medium text-slate-900">{p.title}</p>
                      {p.description && <p className="text-xs text-slate-500">{p.description}</p>}
                    </td>
                    <td className="py-2.5">
                      <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium", p.visibleToClient ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600")}>
                        {p.visibleToClient ? "Shared" : "Private"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>
    </div>
  );
}

// ---- Documents ------------------------------------------------------------
function docKind(d: CaseDocument): { label: string; icon: LucideIcon } {
  const t = (d.file_type ?? "").toLowerCase();
  const ext = d.name.split(".").pop()?.toLowerCase() ?? "";
  if (t.startsWith("image/") || ["png", "jpg", "jpeg", "gif", "webp"].includes(ext)) return { label: "Images", icon: ImageIcon };
  if (t.includes("pdf") || ext === "pdf") return { label: "PDF documents", icon: FileText };
  if (t.includes("word") || ["doc", "docx"].includes(ext)) return { label: "Word documents", icon: FileStack };
  return { label: "Other files", icon: FileText };
}

function DocumentsTab({ caseId, documents }: { caseId: string; documents: CaseDocument[] }) {
  const router = useRouter();
  const [pending, start] = useTransition();

  if (documents.length === 0) {
    return (
      <SectionCard title="Documents">
        <Empty>No documents uploaded. Attach files to a case update to keep evidence, orders and filings on record.</Empty>
      </SectionCard>
    );
  }

  const groups = new Map<string, { icon: LucideIcon; docs: CaseDocument[] }>();
  for (const d of documents) {
    const { label, icon } = docKind(d);
    const g = groups.get(label) ?? { icon, docs: [] };
    g.docs.push(d);
    groups.set(label, g);
  }

  return (
    <div className="space-y-5">
      {[...groups.entries()].map(([label, { icon: GroupIcon, docs }]) => (
        <SectionCard key={label} title={`${label} (${docs.length})`}>
          <div className="space-y-2">
            {docs.map((d) => (
              <div key={d.id} className="flex items-center gap-3 rounded-lg border border-slate-200 p-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/8 text-primary">
                  <GroupIcon className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-900">{d.name}</p>
                  <p className="text-xs text-slate-500">{fmtSize(d.size_bytes)} - {formatDate(d.created_at)}</p>
                </div>
                {d.url && (
                  <a href={d.url} target="_blank" rel="noopener noreferrer" aria-label={`Download ${d.name}`} className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900">
                    <Download className="h-4 w-4" />
                  </a>
                )}
                <button
                  type="button"
                  aria-label={`Delete ${d.name}`}
                  disabled={pending}
                  onClick={() => start(async () => { const r = await deleteCaseDocument(d.id, caseId, d.storage_path); if (r.ok) { toast.success("Document deleted"); router.refresh(); } else { toast.error("Could not delete", { description: r.error }); } })}
                  className="rounded-md p-1.5 text-slate-500 hover:bg-rose-50 hover:text-rose-600 disabled:opacity-50"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </SectionCard>
      ))}
    </div>
  );
}

// ---- view helpers ---------------------------------------------------------
function SectionCard({ title, className, children }: { title: string; className?: string; children: React.ReactNode }) {
  return (
    <Card className={cn("border-slate-200 p-5 ring-0", className)}>
      <h3 className="font-heading text-sm font-semibold text-slate-950">{title}</h3>
      <div className="mt-4">{children}</div>
    </Card>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50/70 p-6 text-center text-sm leading-6 text-slate-500">
      {children}
    </p>
  );
}

function View({ label, value, node, icon: Icon }: { label: string; value?: string | null; node?: React.ReactNode; icon?: LucideIcon }) {
  return (
    <div className="min-w-0">
      <dt className="text-[11px] uppercase tracking-wide text-slate-500">{label}</dt>
      {node ? (
        <dd className="mt-1">{node}</dd>
      ) : (
        <dd className="mt-0.5 flex items-center gap-1.5 text-sm font-medium text-slate-900">
          {Icon && <Icon className="h-3.5 w-3.5 shrink-0 text-gold" />}
          <span className="truncate">{value}</span>
        </dd>
      )}
    </div>
  );
}

function FeeRow({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className={strong ? "font-semibold text-slate-900" : "text-slate-500"}>{label}</span>
      <span className={strong ? "font-heading text-base font-semibold text-slate-950" : "font-medium text-slate-900"}>{value}</span>
    </div>
  );
}

// ---- Add update slide-over ------------------------------------------------
function AddUpdatePanel({ caseId }: { caseId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [saving, start] = useTransition();
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState("");
  const [type, setType] = useState("general");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [visible, setVisible] = useState(true);
  const [notify, setNotify] = useState(true);
  const [newStatus, setNewStatus] = useState("");
  const [nextHearing, setNextHearing] = useState("");
  const [attachment, setAttachment] = useState<{ path: string; name: string; type: string; size: number } | null>(null);

  function reset() {
    setTitle(""); setType("general"); setDescription(""); setDate(""); setVisible(true);
    setNotify(true); setNewStatus(""); setNextHearing(""); setAttachment(null);
  }

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploading(true);
    const supabase = createClient();
    const ext = (file.name.split(".").pop() || "pdf").toLowerCase();
    const path = `${caseId}/${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from("case-documents").upload(path, file, { contentType: file.type || undefined });
    setUploading(false);
    if (error) return toast.error("Upload failed", { description: error.message });
    setAttachment({ path, name: file.name, type: file.type || "application/octet-stream", size: file.size });
    toast.success("File attached");
  }

  function submit() {
    if (!title.trim()) return toast.error("Add an update title");
    start(async () => {
      const r = await addCaseUpdate({
        caseId, title, updateType: type, description, date: date || undefined,
        visibleToClient: visible, notifyClient: notify,
        newStatus: newStatus || undefined, nextHearingDate: nextHearing || undefined,
        attachment: attachment ?? undefined,
      });
      if (!r.ok) { toast.error("Could not add update", { description: r.error }); return; }
      toast.success("Update added", { description: visible ? "The client has been updated." : "Saved privately." });
      reset();
      setOpen(false);
      router.refresh();
    });
  }

  return (
    <Sheet open={open} onOpenChange={(o) => { setOpen(o); if (!o) reset(); }}>
      <SheetTrigger asChild>
        <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"><Plus className="h-4 w-4" /> Add update</Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Add case update</SheetTitle>
        </SheetHeader>
        <div className="mt-4 space-y-4 px-4 pb-8">
          <Field label="Update title" required>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Evidence submitted" />
          </Field>
          <Field label="Update type">
            <Select value={type} onValueChange={setType}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{UPDATE_TYPES.map((t) => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
          <Field label="Description">
            <Textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Explain what happened..." />
          </Field>
          <Field label="Date">
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </Field>

          <Field label="Attachment (optional)">
            {attachment ? (
              <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
                <FileText className="h-4 w-4 text-gold" /><span className="min-w-0 flex-1 truncate">{attachment.name}</span>
                <button onClick={() => setAttachment(null)} className="text-slate-500 hover:text-rose-600"><X className="h-4 w-4" /></button>
              </div>
            ) : (
              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-slate-200 bg-slate-50 px-3 py-3 text-sm font-medium text-slate-500 hover:bg-slate-100">
                {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Paperclip className="h-4 w-4" />} {uploading ? "Uploading..." : "Attach a file"}
                <input type="file" accept="image/*,application/pdf,.doc,.docx" className="sr-only" disabled={uploading} onChange={handleFile} />
              </label>
            )}
          </Field>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Update status (optional)">
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger><SelectValue placeholder="No change" /></SelectTrigger>
                <SelectContent>{CASE_STATUSES.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}</SelectContent>
              </Select>
            </Field>
            <Field label="Next hearing (optional)">
              <Input type="date" value={nextHearing} onChange={(e) => setNextHearing(e.target.value)} />
            </Field>
          </div>

          <div className="space-y-1 rounded-xl border border-slate-200 p-3">
            <ToggleRow label="Visible to client" checked={visible} onChange={setVisible} />
            <ToggleRow label="Notify client" checked={notify && visible} onChange={setNotify} disabled={!visible} />
            {!visible && <p className="pt-1 text-xs text-slate-500">Private updates never appear on the client dashboard.</p>}
          </div>

          <Button onClick={submit} disabled={saving || uploading} className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
            {saving && <Loader2 className="h-4 w-4 animate-spin" />} Post update
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// ---- Hearings tab ---------------------------------------------------------
function HearingsTab({ caseId, hearings, formOpen, setFormOpen }: { caseId: string; hearings: CaseHearingRow[]; formOpen: boolean; setFormOpen: (v: boolean) => void }) {
  const router = useRouter();
  const [saving, start] = useTransition();
  const [date, setDate] = useState(""); const [time, setTime] = useState(""); const [court, setCourt] = useState("");
  const [judge, setJudge] = useState(""); const [purpose, setPurpose] = useState(""); const [status, setStatus] = useState("scheduled");
  const [outcome, setOutcome] = useState("");

  function submit() {
    if (!date) return toast.error("Pick a hearing date");
    start(async () => {
      const r = await addHearing({ caseId, date, time: time || undefined, court: court || undefined, judge: judge || undefined, purpose: purpose || undefined, status, outcome: outcome || undefined });
      if (!r.ok) { toast.error("Could not add hearing", { description: r.error }); return; }
      toast.success("Hearing added");
      setFormOpen(false); setDate(""); setTime(""); setCourt(""); setJudge(""); setPurpose(""); setStatus("scheduled"); setOutcome("");
      router.refresh();
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setFormOpen(!formOpen)} variant={formOpen ? "outline" : "default"} className={formOpen ? "gap-2" : "gap-2 bg-primary text-primary-foreground hover:bg-primary/90"}>
          {formOpen ? <><X className="h-4 w-4" /> Cancel</> : <><Plus className="h-4 w-4" /> Add hearing</>}
        </Button>
      </div>

      <AnimatePresence initial={false}>
        {formOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
            <Card className="border-slate-200 p-5 ring-0">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Date" required><Input type="date" value={date} onChange={(e) => setDate(e.target.value)} /></Field>
                <Field label="Time"><Input type="time" value={time} onChange={(e) => setTime(e.target.value)} /></Field>
                <Field label="Court"><Input value={court} onChange={(e) => setCourt(e.target.value)} placeholder="e.g. District Court Lahore" /></Field>
                <Field label="Judge"><Input value={judge} onChange={(e) => setJudge(e.target.value)} /></Field>
                <Field label="Purpose / next action"><Input value={purpose} onChange={(e) => setPurpose(e.target.value)} placeholder="e.g. Arguments" /></Field>
                <Field label="Status">
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{["scheduled", "completed", "adjourned", "cancelled"].map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
                  </Select>
                </Field>
                {status === "completed" && <div className="sm:col-span-2"><Field label="Outcome"><Textarea rows={2} value={outcome} onChange={(e) => setOutcome(e.target.value)} placeholder="What was the outcome?" /></Field></div>}
              </div>
              <div className="mt-4 flex justify-end">
                <Button onClick={submit} disabled={saving} className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">{saving && <Loader2 className="h-4 w-4 animate-spin" />} Save hearing</Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {hearings.length === 0 ? (
        <Empty>No hearings scheduled.</Empty>
      ) : (
        <div className="space-y-3">
          {hearings.map((h) => (
            <Card key={h.id} className="border-slate-200 p-5 ring-0">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/8 text-primary">
                    <Gavel className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-slate-950">
                      {formatDate(h.date)}{h.time ? ` - ${h.time.slice(0, 5)}` : ""}
                    </p>
                    {h.court && <p className="mt-0.5 text-sm text-slate-600">{h.court}</p>}
                  </div>
                </div>
                <StatusBadge status={h.status} />
              </div>
              <dl className="mt-4 grid grid-cols-1 gap-x-6 gap-y-3 border-t border-slate-100 pt-4 sm:grid-cols-2">
                {h.judge && <View label="Judge" value={h.judge} />}
                {h.purpose && <View label="Purpose / next action" value={h.purpose} />}
                {h.outcome && <View label="Outcome" value={h.outcome} />}
                {h.notes && <View label="Notes" value={h.notes} />}
              </dl>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// ---- Notes tab ------------------------------------------------------------
function NotesTab({ caseId, initial }: { caseId: string; initial: string }) {
  const router = useRouter();
  const [body, setBody] = useState(initial);
  const [saving, start] = useTransition();

  return (
    <Card className="border-slate-200 p-5 ring-0">
      <div className="flex items-center gap-2">
        <EyeOff className="h-4 w-4 text-slate-500" />
        <h3 className="font-heading text-sm font-semibold text-slate-950">Private notes</h3>
      </div>
      <p className="mt-1 text-xs text-slate-500">Only you can see this. The client never sees private notes.</p>
      <Textarea rows={8} value={body} onChange={(e) => setBody(e.target.value)} placeholder="e.g. Settlement discussion likely. Need additional affidavit before next hearing..." className="mt-3" />
      <div className="mt-3 flex justify-end">
        <Button
          onClick={() => start(async () => { const r = await saveCaseNote(caseId, body); if (!r.ok) { toast.error("Could not save", { description: r.error }); return; } toast.success("Notes saved"); router.refresh(); })}
          disabled={saving}
          className="gap-2 bg-slate-950 text-white hover:bg-slate-800"
        >
          {saving && <Loader2 className="h-4 w-4 animate-spin" />} Save notes
        </Button>
      </div>
    </Card>
  );
}

// ---- shared small bits ----------------------------------------------------
function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}{required && <span className="ml-0.5 text-rose-600">*</span>}</Label>
      {children}
    </div>
  );
}

function ToggleRow({ label, checked, onChange, disabled }: { label: string; checked: boolean; onChange: (v: boolean) => void; disabled?: boolean }) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <Label className={cn("text-sm", disabled && "opacity-50")}>{label}</Label>
      <Switch checked={checked} onCheckedChange={onChange} disabled={disabled} />
    </div>
  );
}
