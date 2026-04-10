"use client";

import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef, ReactNode } from "react";

interface AccentButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  isLoading?: boolean;
}

const AccentButton = forwardRef<HTMLButtonElement, AccentButtonProps>(
  ({ children, className, isLoading, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "rounded-full border border-transparent bg-accent px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.35em] text-[#0f1a00] shadow-button transition hover:translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0",
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <div className="h-3 w-3 animate-spin rounded-full border-2 border-[#0f1a00] border-t-transparent" />
        ) : (
          children
        )}
      </button>
    );
  }
);

AccentButton.displayName = "AccentButton";

export default AccentButton;
