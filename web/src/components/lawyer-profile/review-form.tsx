"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Star } from "lucide-react";
import { toast } from "sonner";

import { submitLawyerReview } from "@/app/actions/review-actions";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const RATING_OPTIONS = [5, 4, 3, 2, 1] as const;

interface ReviewFormProps {
  lawyerId: string;
  lawyerSlug: string;
  lawyerName: string;
  matterOptions: { value: string; label: string }[];
}

export function ReviewForm({ lawyerId, lawyerSlug, lawyerName, matterOptions }: ReviewFormProps) {
  const router = useRouter();
  const [rating, setRating] = useState(5);
  const [caseType, setCaseType] = useState(matterOptions[0]?.label ?? "Legal consultation");
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);

    const result = await submitLawyerReview({
      lawyerId,
      lawyerSlug,
      rating,
      caseType,
      comment,
    });

    setSubmitting(false);

    if (!result.ok) {
      if (result.requireAuth) {
        toast.error("Login required", { description: result.error });
        router.push(`/login?redirectTo=${encodeURIComponent(window.location.pathname)}`);
        return;
      }
      toast.error("Review not submitted", { description: result.error });
      return;
    }

    setComment("");
    toast.success("Review published", {
      description: `Your feedback for ${lawyerName} is now visible on the profile.`,
    });
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div>
        <h3 className="font-heading text-base font-semibold text-foreground">Share your experience</h3>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          Reviews are public and should describe your consultation or case experience without private case details.
        </p>
      </div>

      <div className="mt-5 space-y-4">
        <div className="space-y-2">
          <Label>Rating</Label>
          <div className="grid grid-cols-5 gap-2" role="radiogroup" aria-label="Review rating">
            {RATING_OPTIONS.map((value) => (
              <button
                key={value}
                type="button"
                role="radio"
                aria-checked={rating === value}
                onClick={() => setRating(value)}
                className={cn(
                  "inline-flex h-10 items-center justify-center gap-1 rounded-lg border text-sm font-medium transition",
                  rating === value
                    ? "border-gold/60 bg-gold/10 text-foreground shadow-sm"
                    : "border-border bg-background text-muted-foreground hover:border-foreground/20 hover:bg-secondary/60"
                )}
              >
                <Star className={cn("h-3.5 w-3.5", rating === value && "fill-gold text-gold")} />
                {value}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Legal matter</Label>
          <Select value={caseType} onValueChange={setCaseType}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {matterOptions.map((option) => (
                <SelectItem key={option.value} value={option.label}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="review-comment">Review</Label>
          <Textarea
            id="review-comment"
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            placeholder="Explain how the advocate communicated, prepared, and guided you."
            rows={5}
            maxLength={700}
            required
          />
          <p className="text-xs text-muted-foreground">{comment.length}/700 characters</p>
        </div>

        <Button type="submit" disabled={submitting} className="w-full gap-2">
          {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {submitting ? "Publishing..." : "Publish review"}
        </Button>
      </div>
    </form>
  );
}

