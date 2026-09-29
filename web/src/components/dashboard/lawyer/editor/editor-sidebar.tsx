"use client";

import { Eye, Star, ShieldCheck } from "lucide-react";

import type { LawyerFullProfile } from "@/lib/data/lawyer-profile-types";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";

import { initials } from "@/lib/utils";

export function EditorSidebar({
  form,
  completion,
  set,
}: {
  form: LawyerFullProfile;
  completion: {
    done: number;
    total: number;
    pct: number;
  };
  set: <K extends keyof LawyerFullProfile>(
    key: K,
    value: LawyerFullProfile[K],
  ) => void;
}) {
  return (
    <div className="space-y-5">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Eye className="h-4 w-4" />
            Public profile preview
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage
                src={form.photoUrl || undefined}
                alt={form.name}
              />
              <AvatarFallback>{initials(form.name)}</AvatarFallback>
            </Avatar>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-900">
                {form.name || "Your name"}
              </p>

              <p className="truncate text-xs text-slate-500">
                {form.professionalTitle || "Professional title"}
              </p>

              {form.city ? (
                <p className="mt-1 text-xs text-slate-500">{form.city}</p>
              ) : null}
            </div>
          </div>

          {form.practiceAreas.length > 0 ? (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {form.practiceAreas.slice(0, 4).map((area) => (
                <Badge key={area} variant="secondary">
                  {area}
                </Badge>
              ))}

              {form.practiceAreas.length > 4 ? (
                <Badge variant="outline">
                  +{form.practiceAreas.length - 4}
                </Badge>
              ) : null}
            </div>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Profile completion</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex items-end justify-between gap-3">
            <span className="text-sm text-slate-600">
              {completion.done} of {completion.total} completed
            </span>

            <span className="text-lg font-semibold text-slate-900">
              {completion.pct}%
            </span>
          </div>

          <Progress value={completion.pct} />

          <p className="text-xs leading-5 text-slate-500">
            Complete more sections to give clients a clearer picture of your
            professional profile.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Star className="h-4 w-4" />
            Reputation
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-slate-200 p-3">
              <p className="text-xs text-slate-500">Rating</p>
              <p className="mt-1 text-lg font-semibold text-slate-900">
                {form.rating.toFixed(1)}
              </p>
            </div>

            <div className="rounded-lg border border-slate-200 p-3">
              <p className="text-xs text-slate-500">Reviews</p>
              <p className="mt-1 text-lg font-semibold text-slate-900">
                {form.reviewCount}
              </p>
            </div>

            <div className="rounded-lg border border-slate-200 p-3">
              <p className="text-xs text-slate-500">Consultations</p>
              <p className="mt-1 text-lg font-semibold text-slate-900">
                {form.totalConsultations}
              </p>
            </div>

            <div className="rounded-lg border border-slate-200 p-3">
              <p className="text-xs text-slate-500">Response rate</p>
              <p className="mt-1 text-lg font-semibold text-slate-900">
                {form.responseRate}%
              </p>
            </div>
          </div>

          {form.isVerified ? (
            <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700">
              <ShieldCheck className="h-4 w-4" />
              Verified lawyer
            </div>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Public visibility</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-slate-900">
                Show phone publicly
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Allow clients to see your phone number.
              </p>
            </div>

            <Switch
              checked={form.showPhonePublicly}
              onCheckedChange={(checked) =>
                set("showPhonePublicly", checked)
              }
            />
          </div>

          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-slate-900">
                Show email publicly
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Allow clients to see your email address.
              </p>
            </div>

            <Switch
              checked={form.showEmailPublicly}
              onCheckedChange={(checked) =>
                set("showEmailPublicly", checked)
              }
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
