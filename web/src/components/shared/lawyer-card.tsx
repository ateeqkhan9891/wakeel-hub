import Link from "next/link";
import Image from "next/image";
import { Briefcase, MapPin, Languages } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RatingStars } from "@/components/shared/rating-stars";
import { VerifiedBadge } from "@/components/shared/verified-badge";
import { PRACTICE_AREAS } from "@/lib/constants";
import { formatPKR } from "@/lib/utils";
import type { Lawyer } from "@/lib/types";

function practiceAreaName(slug: string) {
  return PRACTICE_AREAS.find((a) => a.slug === slug)?.name ?? slug;
}

export function LawyerCard({ lawyer }: { lawyer: Lawyer }) {
  return (
    <Card className="group flex h-full flex-col gap-0 overflow-hidden border-border/80 p-0 transition-all hover:-translate-y-0.5 hover:border-gold/40 hover:shadow-lg">
      <div className="flex items-start gap-4 p-5 pb-4">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl ring-1 ring-border">
          <Image src={lawyer.photoUrl} alt={lawyer.fullName} fill sizes="64px" className="object-cover" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <Link href={`/lawyers/${lawyer.slug}`} className="block truncate font-heading text-base font-semibold text-foreground hover:text-primary">
                {lawyer.fullName}
              </Link>
              <div className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="h-3.5 w-3.5 text-gold" />
                {lawyer.city}
              </div>
            </div>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            {lawyer.verified && <VerifiedBadge />}
            <RatingStars rating={lawyer.rating} showValue />
            <span className="text-xs text-muted-foreground">({lawyer.reviewCount})</span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 px-5">
        {lawyer.practiceAreas.slice(0, 3).map((area) => (
          <Badge key={area} variant="secondary" className="rounded-full font-normal text-xs">
            {practiceAreaName(area)}
          </Badge>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 border-t border-border/70 px-5 py-4 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Briefcase className="h-4 w-4 text-gold" />
          <span>{lawyer.experienceYears} yrs experience</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Languages className="h-4 w-4 text-gold" />
          <span className="truncate">{lawyer.languages.slice(0, 2).join(", ")}</span>
        </div>
      </div>

      <div className="mt-auto flex items-center justify-between gap-3 border-t border-border/70 bg-secondary/30 px-5 py-4">
        <div>
          <p className="text-xs text-muted-foreground">Consultation fee</p>
          <p className="font-heading text-base font-semibold text-foreground">{formatPKR(lawyer.consultationFee)}</p>
        </div>
        <Button asChild size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Link href={`/lawyers/${lawyer.slug}`}>View Profile</Link>
        </Button>
      </div>
    </Card>
  );
}
