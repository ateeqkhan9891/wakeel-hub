"use client";

import { useState, useTransition, type FormEvent } from "react";

import {
  CalendarDays,
  Download,
  FileText,
  Lock,
  MessageSquareText,
  Plus,
} from "lucide-react";

import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

import { addCaseUpdate } from "@/app/actions/case-actions";
import { formatDate } from "@/lib/utils";

import type {
  CaseDocument,
  CaseHearingRow,
  CaseRecord,
  CaseUpdateRow,
} from "@/lib/data/cases";

type LawyerCaseWorkspaceProps = {
  record: CaseRecord;
  note: string;
  documents: CaseDocument[];
  timeline: CaseUpdateRow[];
  hearings: CaseHearingRow[];
};

export function LawyerCaseWorkspace({
  record,
  note,
  documents,
  timeline,
  hearings,
}: LawyerCaseWorkspaceProps) {
  const [activeTab, setActiveTab] = useState<
    "timeline" | "hearings" | "documents"
  >("timeline");

  const [showUpdateForm, setShowUpdateForm] = useState(false);

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
      <section className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-5 sm:px-6">
          <div className="flex gap-6 overflow-x-auto">
            <TabButton
              active={activeTab === "timeline"}
              onClick={() => setActiveTab("timeline")}
              label="Timeline"
              count={timeline.length}
            />

            <TabButton
              active={activeTab === "hearings"}
              onClick={() => setActiveTab("hearings")}
              label="Hearings"
              count={hearings.length}
            />

            <TabButton
              active={activeTab === "documents"}
              onClick={() => setActiveTab("documents")}
              label="Documents"
              count={documents.length}
            />
          </div>
        </div>

        <div className="p-5 sm:p-6">
          {activeTab === "timeline" && (
            <div className="space-y-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-sm font-semibold text-slate-950">
                    Case timeline
                  </h2>
                  <p className="mt-0.5 text-xs text-slate-500">
                    Record important activity and keep the client informed.
                  </p>
                </div>

                <Button
                  type="button"
                  size="sm"
                  onClick={() => setShowUpdateForm((value) => !value)}
                  className="shrink-0 gap-1.5"
                >
                  <Plus className="h-3.5 w-3.5" />
                  {showUpdateForm ? "Close" : "Add update"}
                </Button>
              </div>

              {showUpdateForm && (
                <AddUpdateForm
                  caseId={record.id}
                  onCancel={() => setShowUpdateForm(false)}
                />
              )}

              <Timeline timeline={timeline} />
            </div>
          )}

          {activeTab === "hearings" && (
            <Hearings hearings={hearings} />
          )}

          {activeTab === "documents" && (
            <Documents documents={documents} />
          )}
        </div>
      </section>

      <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-24">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 text-slate-600 ring-1 ring-slate-200">
            <Lock className="h-3.5 w-3.5" />
          </span>

          <div>
            <h2 className="text-sm font-semibold text-slate-950">
              Private case note
            </h2>

            <p className="text-[11px] text-slate-500">
              Visible only to you
            </p>
          </div>
        </div>

        <Separator className="my-4 bg-slate-100" />

        {note ? (
          <p className="text-sm leading-6 text-slate-600">{note}</p>
        ) : (
          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/60 px-3.5 py-4">
            <p className="text-xs leading-5 text-slate-500">
              No private note has been added to this case.
            </p>
          </div>
        )}

        <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50/50 p-3.5">
          <div className="flex items-start gap-2.5">
            <MessageSquareText className="mt-0.5 h-3.5 w-3.5 shrink-0 text-blue-600" />

            <p className="text-[11px] leading-5 text-blue-700">
              Keep sensitive working notes here rather than adding them to
              client-visible case updates.
            </p>
          </div>
        </div>
      </aside>
    </div>
  );
}

function AddUpdateForm({
  caseId,
  onCancel,
}: {
  caseId: string;
  onCancel: () => void;
}) {
  const [isPending, startTransition] = useTransition();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!title.trim()) {
      toast.error("Update title is required.");
      return;
    }

    if (!description.trim()) {
      toast.error("Update description is required.");
      return;
    }

    startTransition(async () => {
      const result = await addCaseUpdate({
        caseId,
        title: title.trim(),
        updateType: "general",
        description: description.trim(),
        visibleToClient: true,
        notifyClient: true,
      });

      if (!result.ok) {
        toast.error(result.error ?? "Could not add update.");
        return;
      }

      toast.success("Case update added.");

      setTitle("");
      setDescription("");
      onCancel();
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-slate-200 bg-slate-50/60 p-4"
    >
      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label
            htmlFor="case-update-title"
            className="text-xs font-semibold text-slate-700"
          >
            Update title
          </Label>

          <Input
            id="case-update-title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="e.g. Initial case review"
            disabled={isPending}
          />
        </div>

        <div className="space-y-1.5">
          <Label
            htmlFor="case-update-description"
            className="text-xs font-semibold text-slate-700"
          >
            Description
          </Label>

          <Textarea
            id="case-update-description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Describe what happened in this case..."
            rows={4}
            disabled={isPending}
          />
        </div>

        <div className="flex items-center justify-end gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onCancel}
            disabled={isPending}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            size="sm"
            disabled={isPending}
          >
            {isPending ? "Adding..." : "Add update"}
          </Button>
        </div>
      </div>
    </form>
  );
}

function TabButton({
  active,
  label,
  count,
  onClick,
}: {
  active: boolean;
  label: string;
  count: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "relative shrink-0 py-3.5 text-xs font-semibold transition-colors",
        active
          ? "text-blue-600"
          : "text-slate-500 hover:text-slate-900",
      ].join(" ")}
    >
      <span className="flex items-center gap-2">
        {label}

        <span
          className={[
            "rounded-full px-1.5 py-0.5 text-[9px]",
            active
              ? "bg-blue-50 text-blue-600"
              : "bg-slate-100 text-slate-500",
          ].join(" ")}
        >
          {count}
        </span>
      </span>

      {active && (
        <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-blue-600" />
      )}
    </button>
  );
}

function Timeline({
  timeline,
}: {
  timeline: CaseUpdateRow[];
}) {
  if (timeline.length === 0) {
    return (
      <EmptyState text="No case updates have been recorded yet." />
    );
  }

  return (
    <div className="space-y-5">
      {timeline.map((item, index) => (
        <div
          key={item.id}
          className="relative flex gap-3.5"
        >
          {index < timeline.length - 1 && (
            <span className="absolute left-[7px] top-6 h-[calc(100%+1.25rem)] w-px bg-slate-200" />
          )}

          <span className="relative mt-1.5 h-3.5 w-3.5 shrink-0 rounded-full border-[3px] border-blue-100 bg-blue-600" />

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <h3 className="text-sm font-semibold text-slate-950">
                  {item.title}
                </h3>

                <p className="mt-0.5 text-[11px] text-slate-400">
                  {formatDate(item.createdAt)}
                </p>
              </div>

              {item.visibleToClient && (
                <Badge
                  variant="outline"
                  className="rounded-full border-emerald-100 bg-emerald-50 px-2 py-0.5 text-[9px] font-semibold text-emerald-700"
                >
                  Client visible
                </Badge>
              )}
            </div>

            {item.description && (
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {item.description}
              </p>
            )}

            {item.attachmentName && item.attachmentUrl && (
              <a
                href={item.attachmentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700"
              >
                <Download className="h-3.5 w-3.5" />
                {item.attachmentName}
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function Hearings({
  hearings,
}: {
  hearings: CaseHearingRow[];
}) {
  if (hearings.length === 0) {
    return (
      <EmptyState text="No hearing dates have been recorded yet." />
    );
  }

  return (
    <div className="space-y-2.5">
      {hearings.map((hearing) => (
        <div
          key={hearing.id}
          className="rounded-xl border border-slate-200 bg-slate-50/50 p-4"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 ring-1 ring-blue-100">
                <CalendarDays className="h-4 w-4" />
              </span>

              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-950">
                  {hearing.purpose || "Court hearing"}
                </p>

                <p className="mt-0.5 text-xs text-slate-500">
                  {formatDate(hearing.date)}
                  {hearing.time ? ` · ${hearing.time}` : ""}
                </p>
              </div>
            </div>

            <Badge
              variant="outline"
              className="shrink-0 rounded-full border-slate-200 bg-white px-2 py-0.5 text-[9px] font-semibold text-slate-600"
            >
              {hearing.status}
            </Badge>
          </div>

          {(hearing.court || hearing.judge) && (
            <div className="mt-3 border-t border-slate-200 pt-3 text-xs text-slate-500">
              {hearing.court && <span>{hearing.court}</span>}
              {hearing.court && hearing.judge && <span> · </span>}
              {hearing.judge && <span>Judge {hearing.judge}</span>}
            </div>
          )}

          {hearing.outcome && (
            <p className="mt-2 text-xs leading-5 text-slate-600">
              <span className="font-semibold text-slate-700">
                Outcome:
              </span>{" "}
              {hearing.outcome}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

function Documents({
  documents,
}: {
  documents: CaseDocument[];
}) {
  if (documents.length === 0) {
    return (
      <EmptyState text="No documents have been shared on this case." />
    );
  }

  return (
    <div className="space-y-2.5">
      {documents.map((document) => (
        <div
          key={document.id}
          className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50/50 p-3.5"
        >
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-blue-600 ring-1 ring-slate-200">
              <FileText className="h-4 w-4" />
            </span>

            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-slate-950">
                {document.name}
              </p>

              <p className="mt-0.5 text-[11px] text-slate-500">
                {document.size_bytes
                  ? `${document.size_bytes} bytes`
                  : "File"}
              </p>
            </div>
          </div>

          {document.url && (
            <Button
              asChild
              size="sm"
              variant="outline"
              className="shrink-0 gap-1.5"
            >
              <a
                href={document.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Download className="h-3.5 w-3.5" />
                Open
              </a>
            </Button>
          )}
        </div>
      ))}
    </div>
  );
}

function EmptyState({
  text,
}: {
  text: string;
}) {
  return (
    <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/60 px-5 py-10 text-center">
      <p className="text-xs leading-5 text-slate-500">{text}</p>
    </div>
  );
}