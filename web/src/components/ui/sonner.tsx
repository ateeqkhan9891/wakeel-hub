"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      position="bottom-right"
      closeButton
      expand
      gap={10}
      offset={18}
      duration={4500}
      visibleToasts={4}
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-5" />,
        info: <InfoIcon className="size-5" />,
        warning: <TriangleAlertIcon className="size-5" />,
        error: <OctagonXIcon className="size-5" />,
        loading: <Loader2Icon className="size-5 animate-spin" />,
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast:
            "group !w-full !items-start !gap-3 !rounded-2xl !border !border-border !bg-popover !p-4 !text-popover-foreground !shadow-xl !shadow-primary/[0.06] backdrop-blur-sm",
          title: "!text-sm !font-semibold !text-foreground",
          description: "!mt-0.5 !text-[13px] !leading-5 !text-muted-foreground",
          icon: "!mt-0.5 !mr-0 !h-5 !w-5",
          content: "!gap-0.5",
          actionButton:
            "!h-8 !rounded-lg !bg-primary !px-3 !text-xs !font-semibold !text-primary-foreground hover:!bg-primary/90",
          cancelButton: "!h-8 !rounded-lg !bg-secondary !px-3 !text-xs !font-medium !text-foreground",
          closeButton:
            "!left-auto !right-1 !top-1 !border-border !bg-popover !text-muted-foreground hover:!border-border hover:!bg-secondary hover:!text-foreground",
          success: "!border-l-4 !border-l-emerald-500 [&_[data-icon]]:!text-emerald-600",
          error: "!border-l-4 !border-l-rose-500 [&_[data-icon]]:!text-rose-600",
          info: "!border-l-4 !border-l-blue-500 [&_[data-icon]]:!text-blue-600",
          warning: "!border-l-4 !border-l-amber-500 [&_[data-icon]]:!text-amber-600",
          loading: "!border-l-4 !border-l-primary/40 [&_[data-icon]]:!text-primary",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
