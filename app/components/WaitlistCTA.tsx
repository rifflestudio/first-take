import { useState } from "react";

import { cn } from "@/lib/utils";
import AccentButton from "./AccentButton";

interface WaitlistCTAProps {
  delay?: number;
  className?: string;
  onSuccess?: () => void;
  isDark?: boolean;
}

export default function WaitlistCTA({
  delay = 0.8,
  className = "",
  onSuccess,
  isDark = false,
}: WaitlistCTAProps) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("EMAIL", email);
      formData.append("b_b0414cc4330aac012a8dc1512_5f7ec991b7", ""); // Anti-bot field

      const response = await fetch(
        "https://studio.us22.list-manage.com/subscribe/post?u=b0414cc4330aac012a8dc1512&id=5f7ec991b7&f_id=00eccce1f0",
        {
          method: "POST",
          mode: "no-cors",
          body: formData,
        }
      );

      setEmail("");
      onSuccess?.();
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={cn("w-full", className)}>
      <form
        onSubmit={handleSubmit}
        className="relative flex items-center gap-[8px] w-full"
      >
        <div
          className="flex h-8 flex-1 items-center justify-center overflow-hidden rounded-full border px-[16px] py-[8px] min-w-0"
          style={{
            backgroundColor: isDark ? "#1a1a1c" : "#ffffff",
            borderColor: isDark
              ? "rgba(255, 255, 255, 0.10)"
              : "rgba(21, 21, 22, 0.12)",
          }}
        >
          <input
            type="email"
            name="EMAIL"
            placeholder="deo@riffle.studio"
            className="waitlist-input h-full w-full border-0 bg-transparent text-[14px] font-medium leading-[20px] focus:outline-none"
            style={{
              color: isDark
                ? "rgba(255, 255, 255, 0.64)"
                : "rgba(21, 21, 22, 0.64)",
            }}
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isSubmitting}
          />
        </div>
        <AccentButton
          type="submit"
          className="flex h-8 shrink-0 items-center justify-center"
          isLoading={isSubmitting}
          disabled={isSubmitting}
        >
          reserve a spot
        </AccentButton>
      </form>
    </div>
  );
}
