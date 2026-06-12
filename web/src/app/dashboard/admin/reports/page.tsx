import type { Metadata } from "next";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileWarning, Star, Inbox, SearchCheck, CheckCircle2, XCircle } from "lucide-react";
import { ComplaintsList } from "@/components/dashboard/complaints-list";
import { RatingStars } from "@/components/shared/rating-stars";
import { AdminStat } from "@/components/dashboard/admin-ui";
import { getAdminComplaints, getAdminReviews } from "@/lib/data/admin";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Reports & Reviews" };

export default async function AdminReportsPage() {
  const [complaints, reviews] = await Promise.all([getAdminComplaints(100), getAdminReviews(12)]);

  const open = complaints.filter((c) => c.status === "open").length;
  const inReview = complaints.filter((c) => c.status === "investigating").length;
  const resolved = complaints.filter((c) => c.status === "resolved").length;
  const dismissed = complaints.filter((c) => c.status === "dismissed").length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-slate-950">Reports &amp; Reviews</h1>
        <p className="mt-1 text-sm text-slate-500">Investigate complaints and monitor client reviews to keep the platform trustworthy.</p>
      </div>

      {/* Complaints center */}
      <div className="space-y-4">
        <h2 className="font-heading text-base font-semibold text-slate-950">Complaints center</h2>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <AdminStat icon={Inbox} tone="rose" label="Open" value={open} helper="Newly filed" />
          <AdminStat icon={SearchCheck} tone="gold" label="In review" value={inReview} helper="Being investigated" />
          <AdminStat icon={CheckCircle2} tone="emerald" label="Resolved" value={resolved} helper="Closed out" />
          <AdminStat icon={XCircle} tone="slate" label="Dismissed" value={dismissed} helper="No action needed" />
        </div>

        {complaints.length === 0 ? (
          <Card className="flex flex-col items-center gap-2 border-dashed border-slate-200 bg-slate-50/70 p-8 text-center ring-0">
            <FileWarning className="h-8 w-8 text-slate-400" />
            <p className="text-sm font-semibold text-slate-950">No complaints filed</p>
            <p className="text-sm text-slate-500">When a client or lawyer reports an issue, it appears here for review.</p>
          </Card>
        ) : (
          <ComplaintsList reports={complaints} />
        )}
      </div>

      {/* Reviews */}
      <div className="space-y-4">
        <h2 className="font-heading text-base font-semibold text-slate-950">Recent client reviews</h2>
        {reviews.length === 0 ? (
          <Card className="flex flex-col items-center gap-2 border-dashed border-slate-200 bg-slate-50/70 p-8 text-center ring-0">
            <Star className="h-8 w-8 text-slate-400" />
            <p className="text-sm font-semibold text-slate-950">No reviews yet</p>
            <p className="text-sm text-slate-500">Client reviews of advocates will show up here as they come in.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {reviews.map((r) => (
              <Card key={r.id} className="border-slate-200 p-4 ring-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium text-slate-950">on {r.lawyerName}</p>
                  <span className="text-xs text-slate-400">{formatDate(r.createdAt)}</span>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <RatingStars rating={r.rating} />
                  {r.caseType && <Badge variant="outline" className="rounded-full text-xs font-normal">{r.caseType}</Badge>}
                </div>
                {r.comment && <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">&ldquo;{r.comment}&rdquo;</p>}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
