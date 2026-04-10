import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "text-gray-900 placeholder:text-gray-500 flex h-9 w-full min-w-0 rounded-md border border-gray-200/50 bg-white/10 backdrop-blur-sm px-3 py-1 text-base transition-all duration-200 outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus:border-gray-300/50 focus:bg-white/20 focus:ring-2 focus:ring-gray-400/30 focus:ring-offset-0",
        "aria-invalid:ring-red-400/20 aria-invalid:border-red-500",
        className
      )}
      {...props}
    />
  );
}

export { Input };
