import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Award,
  BadgeCheck,
  BookOpen,
  Briefcase,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  ExternalLink,
  Gavel,
  Globe2,
  GraduationCap,
  Languages,
  MapPin,
  MessageSquareText,
  Scale,
  ShieldCheck,
  Star,
  WalletCards,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { JsonLd } from "@/components/seo/json-ld";
import { BookingActions } from "@/components/lawyer-profile/booking-actions";
import { ReviewForm } from "@/components/lawyer-profile/review-form";
import { ReviewsDialog } from "@/components/lawyer-profile/reviews-dialog";
import { LawyerCard } from "@/components/shared/lawyer-card";
import { RatingStars } from "@/components/shared/rating-stars";
import { VerifiedBadge } from "@/components/shared/verified-badge";
import { getPublicLawyerBySlug, getVerifiedLawyers } from "@/lib/data/public-lawyers";
import { PRACTICE_AREAS } from "@/lib/constants";
import { absoluteUrl, breadcrumbJsonLd, faqJsonLd, lawyerLegalServiceJsonLd, lawyerPersonJsonLd } from "@/lib/seo";
import type { Lawyer } from "@/lib/types";
import { formatDate, formatPKR, initials } from "@/lib/utils";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const lawyer = await getPublicLawyerBySlug(slug);
  if (!lawyer) return {};

  const areaNames = lawyer.practiceAreas.map(practiceAreaName).join(", ") || "legal practice";
  const description = `${lawyer.fullName} is a verified advocate in ${lawyer.city}, Pakistan. View courts, practice areas, languages, consultation fee, FAQs and availability on WakeelHub.`;
  const title = `${lawyer.fullName} | ${areaNames} Lawyer in ${lawyer.city}`;

  return {
    title,
    description,
    alternates: { canonical: `/lawyers/${lawyer.slug}` },
    openGraph: {
      title: `${title} | WakeelHub Pakistan`,
      description,
      url: absoluteUrl(`/lawyers/${lawyer.slug}`),
      type: "profile",
      images: [{ url: lawyer.photoUrl, alt: lawyer.fullName }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | WakeelHub Pakistan`,
      description,
      images: [lawyer.photoUrl],
    },
  };
}

function practiceAreaName(slug: string) {
  return PRACTICE_AREAS.find((area) => area.slug === slug)?.name ?? slug.replace(/-/g, " ");
}

export default async function LawyerProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lawyer = await getPublicLawyerBySlug(slug);
  if (!lawyer) notFound();

  const allLawyers = await getVerifiedLawyers();
  const similar = allLawyers
    .filter((item) => item.id !== lawyer.id && item.practiceAreas.some((area) => lawyer.practiceAreas.includes(area)))
    .slice(0, 3);

  const practiceAreas = lawyer.practiceAreas.map((area) => ({ value: area, label: practiceAreaName(area) }));
  const matterOptions = practiceAreas.length ? practiceAreas : [{ value: "consultation", label: "Legal consultation" }];
  const visibleReviews = lawyer.reviews.slice(0, 8);
  const hasReviews = visibleReviews.length > 0;
  const title = lawyer.professionalTitle || "Verified Advocate";
  const profileFaqs = getLawyerProfileFaqs(lawyer);
  const jsonLd = [
    lawyerPersonJsonLd(lawyer),
    lawyerLegalServiceJsonLd(lawyer),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Find Lawyers", path: "/find-lawyers" },
      { name: lawyer.fullName, path: `/lawyers/${lawyer.slug}` },
    ]),
    faqJsonLd(profileFaqs),
  ];

  return (
    <main className="bg-[#f8fafc] text-foreground">
      <JsonLd data={jsonLd} />

      <section className="border-b border-border bg-background">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <nav className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">Home</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link href="/find-lawyers" className="hover:text-foreground">Find lawyers</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="font-medium text-foreground">{lawyer.fullName}</span>
          </nav>

          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px] lg:items-start">
            <div className="min-w-0">
              <div className="flex flex-col gap-6 sm:flex-row">
                <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-2xl border border-border bg-secondary sm:h-40 sm:w-40">
                  <Image src={lawyer.photoUrl} alt={lawyer.fullName} fill sizes="160px" className="object-cover" priority />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <VerifiedBadge />
                    <Badge variant="outline" className="rounded-full bg-background font-normal text-muted-foreground">
                      Public profile
                    </Badge>
                  </div>

                  <h1 className="mt-4 font-heading text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                    {lawyer.fullName}
                  </h1>
                  <p className="mt-2 text-base font-medium text-slate-700">{title}</p>

                  <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="h-4 w-4 text-gold" />
                      {lawyer.city}{lawyer.province ? `, ${lawyer.province}` : ""}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Briefcase className="h-4 w-4 text-gold" />
                      {lawyer.experienceYears} years experience
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Clock3 className="h-4 w-4 text-gold" />
                      {lawyer.responseTime}
                    </span>
                  </div>

                  <div className="mt-5 flex flex-wrap items-center gap-3">
                    <RatingStars rating={lawyer.rating} size="md" showValue />
                    {hasReviews ? (
                      <ReviewsDialog reviews={lawyer.reviews} rating={lawyer.rating} reviewCount={lawyer.reviewCount} lawyerName={lawyer.fullName}>
                        <button type="button" className="text-sm font-medium text-primary underline-offset-4 hover:underline">
                          {lawyer.reviewCount} client reviews
                        </button>
                      </ReviewsDialog>
                    ) : (
                      <span className="text-sm text-muted-foreground">No reviews yet</span>
                    )}
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {practiceAreas.map((area) => (
                      <Badge key={area.value} variant="secondary" className="rounded-full px-3 py-1 font-normal">
                        {area.label}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-4">
                <TrustMetric icon={ShieldCheck} label="Verification" value="Bar Council checked" />
                <TrustMetric icon={MessageSquareText} label="Reviews" value={lawyer.reviewCount ? `${lawyer.reviewCount} published` : "Open for feedback"} />
                <TrustMetric icon={Gavel} label="Courts" value={lawyer.courts.length ? `${lawyer.courts.length} listed` : "By appointment"} />
                <TrustMetric icon={WalletCards} label="Fee" value={formatPKR(lawyer.consultationFee)} />
              </div>
            </div>

            <aside className="rounded-2xl border border-border bg-card p-5 shadow-sm lg:sticky lg:top-24">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Consultation fee</p>
                  <p className="mt-1 font-heading text-2xl font-semibold text-slate-950">{formatPKR(lawyer.consultationFee)}</p>
                </div>
                <Badge className="rounded-full bg-emerald-50 text-emerald-700 hover:bg-emerald-50">
                  Available
                </Badge>
              </div>

              <Separator className="my-5" />

              <dl className="space-y-3 text-sm">
                <InfoRow icon={Clock3} label="Response" value={lawyer.responseTime} />
                <InfoRow icon={CalendarDays} label="Hours" value={lawyer.availability.hours || "By appointment"} />
                <InfoRow icon={Globe2} label="Mode" value={lawyer.availability.mode.join(", ")} />
                <InfoRow icon={Scale} label="Enrollment" value={lawyer.barCouncilNumber} />
              </dl>

              <div className="mt-5">
                <BookingActions
                  lawyerId={lawyer.id}
                  lawyerName={lawyer.fullName}
                  onlineFee={lawyer.consultationFee}
                  inPersonFee={lawyer.consultationFee}
                  acceptsOnline={lawyer.availability.mode.includes("Video")}
                  acceptsInPerson={lawyer.availability.mode.includes("In-person")}
                  practiceAreas={lawyer.practiceAreas}
                />
              </div>

              <p className="mt-4 text-xs leading-5 text-muted-foreground">
                Booking requests are sent to the advocate first. Payment is handled after acceptance.
              </p>
            </aside>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_340px] lg:px-8">
        <div className="space-y-8">
          <ProfilePanel icon={BookOpen} title="Professional summary">
            <p className="text-sm leading-7 text-muted-foreground">
              {lawyer.about || `${lawyer.fullName} is a verified advocate available for consultations through WakeelHub.`}
            </p>
          </ProfilePanel>

          <div className="grid gap-6 md:grid-cols-2">
            <ProfilePanel icon={Gavel} title="Courts practiced">
              <SimpleList items={lawyer.courts} empty="Court details will appear after the advocate updates this profile." />
            </ProfilePanel>

            <ProfilePanel icon={Languages} title="Languages">
              {lawyer.languages.length ? (
                <div className="flex flex-wrap gap-2">
                  {lawyer.languages.map((language) => (
                    <Badge key={language} variant="outline" className="rounded-full bg-background font-normal">
                      {language}
                    </Badge>
                  ))}
                </div>
              ) : (
                <EmptyText>Language details are not listed yet.</EmptyText>
              )}
            </ProfilePanel>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <ProfilePanel icon={GraduationCap} title="Education">
              <SimpleList items={lawyer.education} empty="Education details will appear after profile completion." />
            </ProfilePanel>

            <ProfilePanel icon={CalendarDays} title="Availability">
              <div className="space-y-3 text-sm text-muted-foreground">
                <InfoLine label="Days" value={lawyer.availability.days.length ? lawyer.availability.days.join(", ") : "By appointment"} />
                <InfoLine label="Hours" value={lawyer.availability.hours || "By appointment"} />
                <InfoLine label="Consultation modes" value={lawyer.availability.mode.join(", ")} />
              </div>
            </ProfilePanel>
          </div>

          <ProfilePanel icon={MessageSquareText} title="Frequently asked questions">
            <div className="divide-y divide-border">
              {profileFaqs.map((faq) => (
                <div key={faq.question} className="py-4 first:pt-0 last:pb-0">
                  <h3 className="font-heading text-base font-semibold text-slate-950">{faq.question}</h3>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">{faq.answer}</p>
                </div>
              ))}
            </div>
          </ProfilePanel>

          {lawyer.experienceEntries && lawyer.experienceEntries.length > 0 && (
            <ProfilePanel icon={Briefcase} title="Experience">
              <div className="space-y-3">
                {lawyer.experienceEntries.map((entry) => (
                  <div key={`${entry.position}-${entry.firm}-${entry.startDate}`} className="rounded-xl border border-border bg-background p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h3 className="font-heading text-sm font-semibold text-slate-950">
                          {[entry.position, entry.firm].filter(Boolean).join(" at ")}
                        </h3>
                        {entry.description && <p className="mt-2 text-sm leading-6 text-muted-foreground">{entry.description}</p>}
                      </div>
                      {(entry.startDate || entry.endDate) && (
                        <span className="rounded-full bg-secondary px-2.5 py-1 text-xs text-muted-foreground">
                          {[entry.startDate, entry.endDate || "Present"].filter(Boolean).join(" - ")}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ProfilePanel>
          )}

          {lawyer.achievements && lawyer.achievements.length > 0 && (
            <ProfilePanel icon={Award} title="Achievements">
              <div className="flex flex-wrap gap-2">
                {lawyer.achievements.map((achievement) => (
                  <Badge key={achievement} variant="secondary" className="rounded-full px-3 py-1.5 font-normal">
                    {achievement}
                  </Badge>
                ))}
              </div>
            </ProfilePanel>
          )}

          <ProfilePanel icon={Star} title="Client reviews">
            <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
              <div>
                <div className="rounded-2xl border border-border bg-background p-5">
                  <div className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                      <p className="font-heading text-3xl font-semibold text-slate-950">{lawyer.rating.toFixed(1)}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <RatingStars rating={lawyer.rating} />
                        <span className="text-sm text-muted-foreground">
                          {lawyer.reviewCount ? `${lawyer.reviewCount} published reviews` : "No published reviews yet"}
                        </span>
                      </div>
                    </div>
                    <Badge variant="outline" className="rounded-full bg-card font-normal">
                      Verified client feedback
                    </Badge>
                  </div>
                </div>

                <div className="mt-5 space-y-4">
                  {hasReviews ? (
                    visibleReviews.map((review) => (
                      <article key={review.id} className="rounded-2xl border border-border bg-background p-5">
                        <div className="flex gap-3">
                          <Avatar className="h-10 w-10 shrink-0 ring-1 ring-border">
                            <AvatarImage src={review.avatarUrl} alt={review.clientName} />
                            <AvatarFallback className="bg-primary/5 text-sm font-semibold text-primary">{initials(review.clientName)}</AvatarFallback>
                          </Avatar>
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <div>
                                <p className="flex items-center gap-1.5 text-sm font-semibold text-slate-950">
                                  {review.clientName}
                                  <BadgeCheck className="h-3.5 w-3.5 text-emerald-600" aria-label="Verified client" />
                                </p>
                                <p className="text-xs text-muted-foreground">{formatDate(review.date)}</p>
                              </div>
                              <RatingStars rating={review.rating} />
                            </div>
                            <ReviewsDialog reviews={lawyer.reviews} rating={lawyer.rating} reviewCount={lawyer.reviewCount} lawyerName={lawyer.fullName}>
                              <button type="button" className="mt-3 inline-flex">
                                <Badge variant="outline" className="cursor-pointer rounded-full bg-card text-xs font-normal transition-colors hover:border-gold/50 hover:bg-gold/5 hover:text-gold-foreground">
                                  {review.caseType}
                                </Badge>
                              </button>
                            </ReviewsDialog>
                            <p className="mt-3 text-sm leading-6 text-muted-foreground">{review.comment}</p>
                          </div>
                        </div>
                      </article>
                    ))
                  ) : (
                    <div className="rounded-2xl border border-dashed border-border bg-background p-6 text-center">
                      <Star className="mx-auto h-8 w-8 text-muted-foreground/50" />
                      <h3 className="mt-3 font-heading text-base font-semibold text-slate-950">No public reviews yet</h3>
                      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                        Once clients leave feedback, ratings and review notes will appear here in real time.
                      </p>
                    </div>
                  )}

                  {hasReviews && (
                    <ReviewsDialog reviews={lawyer.reviews} rating={lawyer.rating} reviewCount={lawyer.reviewCount} lawyerName={lawyer.fullName}>
                      <button type="button" className="flex w-full items-center justify-center gap-2 rounded-2xl border border-border bg-card py-3 text-sm font-semibold text-foreground transition-colors hover:border-gold/50 hover:bg-secondary">
                        <Star className="h-4 w-4 fill-gold text-gold" />
                        See all {lawyer.reviewCount || lawyer.reviews.length} reviews
                      </button>
                    </ReviewsDialog>
                  )}
                </div>
              </div>

              <ReviewForm
                lawyerId={lawyer.id}
                lawyerSlug={lawyer.slug}
                lawyerName={lawyer.fullName}
                matterOptions={matterOptions}
              />
            </div>
          </ProfilePanel>
        </div>

        <aside className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h2 className="font-heading text-base font-semibold text-slate-950">Trust and verification</h2>
            <div className="mt-4 space-y-3">
              <TrustLine>Bar Council enrollment displayed publicly</TrustLine>
              <TrustLine>Profile details controlled from lawyer dashboard</TrustLine>
              <TrustLine>Client reviews are published from real accounts</TrustLine>
              <TrustLine>Joined WakeelHub on {formatDate(lawyer.joinedDate)}</TrustLine>
            </div>
          </div>

          {(lawyer.officeName || lawyer.officeAddress || lawyer.googleMapsLink) && (
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <h2 className="font-heading text-base font-semibold text-slate-950">Office details</h2>
              <div className="mt-4 space-y-2 text-sm leading-6 text-muted-foreground">
                {lawyer.officeName && <p className="font-medium text-slate-950">{lawyer.officeName}</p>}
                {lawyer.officeAddress && <p>{lawyer.officeAddress}</p>}
                {lawyer.googleMapsLink && (
                  <a href={lawyer.googleMapsLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 font-medium text-primary hover:underline">
                    View location <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
            </div>
          )}

          {lawyer.socialLinks && (lawyer.socialLinks.website || lawyer.socialLinks.linkedin || lawyer.socialLinks.facebook) && (
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <h2 className="font-heading text-base font-semibold text-slate-950">Professional links</h2>
              <div className="mt-4 flex flex-col gap-2 text-sm">
                {lawyer.socialLinks.website && <ProfileLink href={lawyer.socialLinks.website} label="Website" />}
                {lawyer.socialLinks.linkedin && <ProfileLink href={lawyer.socialLinks.linkedin} label="LinkedIn" />}
                {lawyer.socialLinks.facebook && <ProfileLink href={lawyer.socialLinks.facebook} label="Facebook" />}
              </div>
            </div>
          )}

          {similar.length > 0 && (
            <div>
              <h2 className="mb-4 font-heading text-base font-semibold text-slate-950">Similar advocates</h2>
              <div className="space-y-4">
                {similar.map((item) => (
                  <LawyerCard key={item.id} lawyer={item} />
                ))}
              </div>
            </div>
          )}
        </aside>
      </section>
    </main>
  );
}

function TrustMetric({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <Icon className="h-4 w-4 text-gold" />
      <p className="mt-3 text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-semibold text-slate-950">{value}</p>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <dt className="inline-flex items-center gap-2 text-muted-foreground">
        <Icon className="h-4 w-4 text-gold" />
        {label}
      </dt>
      <dd className="max-w-[180px] text-right font-medium text-slate-950">{value}</dd>
    </div>
  );
}

function ProfilePanel({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
      <div className="mb-5 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/5 text-primary ring-1 ring-primary/10">
          <Icon className="h-4.5 w-4.5" />
        </span>
        <h2 className="font-heading text-lg font-semibold text-slate-950">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function SimpleList({ items, empty }: { items: string[]; empty: string }) {
  if (items.length === 0) return <EmptyText>{empty}</EmptyText>;

  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2.5 text-sm leading-6 text-muted-foreground">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
          {item}
        </li>
      ))}
    </ul>
  );
}

function InfoLine({ label, value }: { label: string; value: string }) {
  return (
    <p>
      <span className="font-medium text-slate-950">{label}:</span> {value}
    </p>
  );
}

function EmptyText({ children }: { children: React.ReactNode }) {
  return <p className="text-sm leading-6 text-muted-foreground">{children}</p>;
}

function TrustLine({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-start gap-2 text-sm leading-6 text-muted-foreground">
      <BadgeCheck className="mt-1 h-4 w-4 shrink-0 text-gold" />
      {children}
    </p>
  );
}

function ProfileLink({ href, label }: { href: string; label: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 font-medium text-primary hover:underline">
      <Globe2 className="h-4 w-4" />
      {label}
      <ExternalLink className="h-3.5 w-3.5" />
    </a>
  );
}

function getLawyerProfileFaqs(lawyer: Lawyer) {
  const practiceAreas = lawyer.practiceAreas.map(practiceAreaName).join(", ") || "legal matters";
  const courts = lawyer.courts.length ? lawyer.courts.join(", ") : `${lawyer.city} courts`;
  const languages = lawyer.languages.length ? lawyer.languages.join(", ") : "languages listed on the profile";

  return [
    {
      question: `What practice areas does ${lawyer.fullName} handle?`,
      answer: `${lawyer.fullName} lists ${practiceAreas} on this WakeelHub profile. You should confirm whether your specific facts fall within the lawyer's current practice before hiring.`,
    },
    {
      question: `Where does ${lawyer.fullName} practice?`,
      answer: `${lawyer.fullName} is listed in ${lawyer.city}, Pakistan, with courts shown as ${courts}. Court availability can depend on the matter and schedule.`,
    },
    {
      question: `What languages are listed for ${lawyer.fullName}?`,
      answer: `This profile lists ${languages}. Confirm your preferred language when requesting a consultation.`,
    },
    {
      question: `Is this profile legal advice?`,
      answer: "No. WakeelHub is a lawyer marketplace and does not provide legal advice. Book a consultation with a qualified advocate for advice on your specific facts.",
    },
  ];
}
