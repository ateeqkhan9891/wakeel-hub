import { PageHeaderSkeleton, DashboardStatsSkeleton, TableSkeleton } from "@/components/ui/skeletons";

export default function Loading() {
  return (
    <div className="space-y-8">
      <PageHeaderSkeleton />
      <DashboardStatsSkeleton />
      <TableSkeleton rows={5} cols={5} />
    </div>
  );
}
