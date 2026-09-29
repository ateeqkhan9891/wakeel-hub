"use client";

import dynamic from "next/dynamic";

const WakeelAIFloatingButton = dynamic(
  () => import("@/components/ai/WakeelAIFloatingButton").then((m) => m.WakeelAIFloatingButton),
  { ssr: false, loading: () => null }
);

export function WakeelAILazy() {
  return <WakeelAIFloatingButton />;
}

