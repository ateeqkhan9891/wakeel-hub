import { ProfileSkeleton } from "@/components/ui/skeletons";

export default function Loading() {
  return (
    <div className="bg-background">
      <section className="border-b border-border bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <ProfileSkeleton />
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <div className="h-40 w-full animate-pulse rounded-2xl bg-muted" />
          <div className="h-40 w-full animate-pulse rounded-2xl bg-muted" />
        </div>
      </section>
    </div>
  );
}
