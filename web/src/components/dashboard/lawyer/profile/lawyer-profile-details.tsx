"use client";

import {
  Award,
  BookOpen,
  Briefcase,
  Languages,
  Pencil,
  Scale,
  Sparkles,
  UserRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import type { LawyerFullProfile } from "@/lib/data/lawyer-profile-types";

import {
  ChipRow,
  EducationCard,
  Empty,
  ExperienceCard,
  PublicationCard,
  Section,
} from "./lawyer-profile-shared";

interface LawyerProfileDetailsProps {
  profile: LawyerFullProfile;
  onEdit: (section?: string) => void;
}

export function LawyerProfileDetails({
  profile,
  onEdit,
}: LawyerProfileDetailsProps) {
  return (
    <div className="space-y-3">
      <Section
        icon={UserRound}
        title="About"
        action={<EditButton onClick={() => onEdit("about")} />}
      >
        {profile.about ? (
          <p className="max-w-4xl text-sm leading-7 text-slate-600">
            {profile.about}
          </p>
        ) : (
          <Empty>
            Add a professional biography so clients can understand your
            background, jurisdictions, and approach.
          </Empty>
        )}
      </Section>

      <Section
        icon={Scale}
        title="Practice areas & jurisdictions"
        action={<EditButton onClick={() => onEdit("practiceAreas")} />}
      >
        <div className="grid divide-y divide-slate-100 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
          <InfoGroup
            label="Practice areas"
            className="pb-4 sm:pb-0 sm:pr-6"
          >
            {profile.practiceAreas.length > 0 ? (
              <ChipRow
                items={profile.practiceAreas}
                tone="gold"
              />
            ) : (
              <Empty>No practice areas added yet.</Empty>
            )}
          </InfoGroup>

          <InfoGroup
            label="Admitted courts & jurisdictions"
            className="pt-4 sm:pt-0 sm:pl-6"
          >
            {profile.courts.length > 0 ? (
              <ChipRow items={profile.courts} />
            ) : (
              <Empty>No courts added yet.</Empty>
            )}
          </InfoGroup>
        </div>
      </Section>

      <Section
        icon={Briefcase}
        title="Professional experience"
        count={profile.experience.length}
        action={<EditButton onClick={() => onEdit("experience")} />}
      >
        {profile.experience.length > 0 ? (
          <div className="space-y-2.5">
            {profile.experience.map((item, index) => (
              <ExperienceCard
                key={`${item.firm}-${item.position}-${index}`}
                item={item}
              />
            ))}
          </div>
        ) : (
          <Empty>
            Add your career history, including law firms, government bodies,
            in-house roles, and key milestones.
          </Empty>
        )}
      </Section>

      <Section
        icon={BookOpen}
        title="Education & credentials"
        count={profile.education.length}
        action={<EditButton onClick={() => onEdit("education")} />}
      >
        {profile.education.length > 0 ? (
          <div className="grid gap-2.5 sm:grid-cols-2">
            {profile.education.map((item, index) => (
              <EducationCard
                key={`${item.institution}-${item.degree}-${index}`}
                item={item}
              />
            ))}
          </div>
        ) : (
          <Empty>
            Add your legal degrees, bar qualifications, and academic honors.
          </Empty>
        )}
      </Section>

      <Section
        icon={Languages}
        title="Languages spoken"
        count={profile.languages.length}
        action={<EditButton onClick={() => onEdit("languages")} />}
      >
        {profile.languages.length > 0 ? (
          <ChipRow items={profile.languages} />
        ) : (
          <Empty>
            Add the languages you use with clients and in court proceedings.
          </Empty>
        )}
      </Section>

      <Section
        icon={Award}
        title="Honors & publications"
        count={
          profile.achievements.length +
          profile.publications.length
        }
        action={<EditButton onClick={() => onEdit("achievements")} />}
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <InfoGroup label="Honors & recognition">
            {profile.achievements.length > 0 ? (
              <div className="space-y-1">
                {profile.achievements.map((achievement, index) => (
                  <div
                    key={`${achievement}-${index}`}
                    className="flex items-start gap-2.5 border-b border-slate-100 py-2.5 first:pt-0 last:border-0 last:pb-0"
                  >
                    <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500" />

                    <p className="text-sm leading-5 text-slate-600">
                      {achievement}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <Empty>No honors or recognitions listed.</Empty>
            )}
          </InfoGroup>

          <InfoGroup label="Articles & publications">
            {profile.publications.length > 0 ? (
              <div className="space-y-2">
                {profile.publications.map((item, index) => (
                  <PublicationCard
                    key={`${item.title}-${index}`}
                    item={item}
                  />
                ))}
              </div>
            ) : (
              <Empty>
                No publications or articles added yet.
              </Empty>
            )}
          </InfoGroup>
        </div>
      </Section>
    </div>
  );
}

function InfoGroup({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-400">
        {label}
      </p>

      {children}
    </div>
  );
}

function EditButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={onClick}
      className="h-7 gap-1.5 rounded-md px-2 text-xs font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-900"
    >
      <Pencil className="h-3 w-3" />
      Edit
    </Button>
  );
}