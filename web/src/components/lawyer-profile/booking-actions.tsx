"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Briefcase, CalendarCheck, Clock3, Loader2, MapPin, Phone, ShieldCheck, Video } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatPKR } from "@/lib/utils";
import { PRACTICE_AREAS } from "@/lib/constants";
import { createBooking } from "@/app/actions/booking-actions";

type Mode = "online" | "in_person" | "phone";

const MODE_META: Record<Mode, { label: string; icon: typeof Video }> = {
  online: { label: "Online (video call)", icon: Video },
  in_person: { label: "In-person", icon: MapPin },
  phone: { label: "Phone call", icon: Phone },
};

interface BookingActionsProps {
  lawyerId: string;
  lawyerName: string;
  onlineFee: number;
  inPersonFee: number;
  acceptsOnline: boolean;
  acceptsInPerson: boolean;
  practiceAreas: string[];
}

export function BookingActions({
  lawyerId, lawyerName, onlineFee, inPersonFee, acceptsOnline, acceptsInPerson, practiceAreas,
}: BookingActionsProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const modes: Mode[] = [];
  if (acceptsOnline) modes.push("online");
  if (acceptsInPerson) modes.push("in_person");
  modes.push("phone");

  const [mode, setMode] = useState<Mode>(modes[0]);
  const [area, setArea] = useState<string>(practiceAreas[0] ?? "");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [details, setDetails] = useState("");

  const fee = mode === "in_person" ? inPersonFee || onlineFee : onlineFee;
  const today = new Date().toISOString().split("T")[0];

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);

    const result = await createBooking({
      lawyerId,
      mode,
      scheduledDate: date || undefined,
      scheduledTime: time || undefined,
      practiceAreaSlug: area || undefined,
      issueSummary: details || undefined,
    });

    if (!result.ok) {
      setSubmitting(false);
      if (result.requireAuth) {
        toast.error("Please log in first", { description: "You need a client account to book a consultation." });
        router.push(`/login?redirectTo=${encodeURIComponent(window.location.pathname)}`);
        return;
      }
      toast.error("Could not send request", { description: result.error });
      return;
    }

    setSubmitting(false);
    setOpen(false);
    setDetails("");
    toast.success("Consultation request sent", {
      description: `${lawyerName} has been notified and will accept or decline shortly. You'll get a notification with their response.`,
    });
    router.refresh();
  }

  const areaOptions = practiceAreas.length > 0
    ? practiceAreas
    : PRACTICE_AREAS.map((a) => a.slug);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
          <CalendarCheck className="h-4.5 w-4.5" />
          Book Consultation
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[92svh] w-[calc(100vw-1rem)] overflow-hidden p-0 sm:max-w-3xl lg:max-w-4xl">
        <div className="border-b border-border bg-secondary/30 px-5 py-5 pr-12 sm:px-7">
          <DialogHeader className="max-w-2xl">
            <DialogTitle className="font-heading text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
              Book a consultation
            </DialogTitle>
            <DialogDescription className="leading-6">
              Send a structured request to {lawyerName}. They&apos;ll review it first, then accept, reject, or propose a new time.
            </DialogDescription>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit} className="max-h-[calc(92svh-112px)] overflow-y-auto">
          <div className="grid lg:grid-cols-[1fr_320px]">
            <div className="space-y-5 p-5 sm:p-7">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label>Consultation mode</Label>
                  <Select value={mode} onValueChange={(v) => setMode(v as Mode)}>
                    <SelectTrigger className="h-11 w-full rounded-xl bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {modes.map((m) => {
                        const Icon = MODE_META[m].icon;
                        return (
                          <SelectItem key={m} value={m}>
                            <span className="flex items-center gap-2">
                              <Icon className="h-4 w-4 text-muted-foreground" />
                              {MODE_META[m].label}
                            </span>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label>Legal matter</Label>
                  <Select value={area} onValueChange={setArea}>
                    <SelectTrigger className="h-11 w-full rounded-xl bg-background">
                      <SelectValue placeholder="Select a practice area" />
                    </SelectTrigger>
                    <SelectContent>
                      {areaOptions.map((slug) => (
                        <SelectItem key={slug} value={slug}>
                          {PRACTICE_AREAS.find((a) => a.slug === slug)?.name ?? slug.replace(/-/g, " ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="booking-date">Preferred date</Label>
                  <Input id="booking-date" type="date" min={today} value={date} onChange={(e) => setDate(e.target.value)} required className="h-11 rounded-xl bg-background" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="booking-time">Preferred time</Label>
                  <Input id="booking-time" type="time" value={time} onChange={(e) => setTime(e.target.value)} required className="h-11 rounded-xl bg-background" />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="booking-notes">Briefly describe your matter</Label>
                <Textarea
                  id="booking-notes"
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="E.g. I need advice regarding a property possession dispute in Lahore..."
                  rows={6}
                  className="resize-none rounded-xl bg-background"
                />
              </div>
            </div>

            <aside className="border-t border-border bg-secondary/25 p-5 sm:p-7 lg:border-l lg:border-t-0">
              <div className="rounded-2xl border border-border bg-background p-4">
                <p className="text-sm font-semibold text-foreground">Request summary</p>
                <div className="mt-4 space-y-3 text-sm">
                  <SummaryRow icon={MODE_META[mode].icon} label="Mode" value={MODE_META[mode].label} />
                  <SummaryRow
                    icon={Briefcase}
                    label="Matter"
                    value={area ? PRACTICE_AREAS.find((a) => a.slug === area)?.name ?? area.replace(/-/g, " ") : "Not selected"}
                  />
                  <SummaryRow icon={Clock3} label="Preferred slot" value={date && time ? `${date} at ${time}` : "Choose date and time"} />
                </div>
                <div className="mt-4 rounded-xl border border-border bg-secondary/40 px-4 py-3">
                  <p className="text-xs text-muted-foreground">Consultation fee</p>
                  <p className="mt-1 font-heading text-xl font-semibold text-foreground">{formatPKR(fee)}</p>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-primary/10 bg-primary/5 p-4 text-sm leading-6 text-muted-foreground">
                <div className="flex items-start gap-2">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <p>No payment is taken until the advocate accepts your request.</p>
                </div>
              </div>

              <div className="mt-5">
                <Button type="submit" disabled={submitting} size="lg" className="w-full gap-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90">
                  {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                  {submitting ? "Sending request..." : "Send consultation request"}
                </Button>
              </div>
            </aside>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function SummaryRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Video;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="flex items-center gap-2 text-muted-foreground">
        <Icon className="h-4 w-4 text-gold" />
        {label}
      </span>
      <span className="max-w-[150px] text-right font-medium text-foreground">{value}</span>
    </div>
  );
}

