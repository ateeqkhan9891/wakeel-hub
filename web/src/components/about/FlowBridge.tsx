import { ArrowDown, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

type FlowBridgeProps = {
  vertical?: boolean;
  active?: boolean;
};

export function FlowBridge({
  vertical = false,
  active = false,
}: FlowBridgeProps) {
  if (vertical) {
    return (
      <div className="flex flex-col items-center justify-center py-2">
        <div className="relative h-12 w-px overflow-hidden bg-zinc-200">
          <motion.div
            initial={{ y: "-100%" }}
            animate={active ? { y: "100%" } : { y: "-100%" }}
            transition={{
              duration: 1.2,
              ease: "easeInOut",
              repeat: active ? Infinity : 0,
              repeatDelay: 0.8,
            }}
            className="absolute inset-x-0 top-0 h-1/2 bg-amber-500"
          />
        </div>

        <ArrowDown
          className="mt-[-1px] h-4 w-4 text-zinc-400"
          strokeWidth={1.7}
        />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center px-2">
      <div className="relative h-px w-12 overflow-hidden bg-zinc-200">
        <motion.div
          initial={{ x: "-100%" }}
          animate={active ? { x: "100%" } : { x: "-100%" }}
          transition={{
            duration: 1.2,
            ease: "easeInOut",
            repeat: active ? Infinity : 0,
            repeatDelay: 0.8,
          }}
          className="absolute inset-y-0 left-0 w-1/2 bg-amber-500"
        />
      </div>

      <ArrowRight
        className="ml-[-1px] h-4 w-4 text-zinc-400"
        strokeWidth={1.7}
      />
    </div>
  );
}
