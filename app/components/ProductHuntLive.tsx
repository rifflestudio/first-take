"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";

function RecordDot() {
  return (
    <motion.span
      style={{
        display: "block",
        width: 7,
        height: 7,
        borderRadius: "50%",
        backgroundColor: "#FF6154",
        flexShrink: 0,
      }}
      animate={{ opacity: [1, 0.2, 1] }}
      transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

function PHLogo({ size = 18 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 40 40"
      aria-hidden="true"
    >
      <g fill="none" fillRule="evenodd">
        <path
          fill="#FF6154"
          d="M40 20c0 11.046-8.954 20-20 20S0 31.046 0 20 8.954 0 20 0s20 8.954 20 20"
        />
        <path
          fill="#FFF"
          d="M22.667 20H17v-6h5.667a3 3 0 0 1 0 6m0-10H13v20h4v-6h5.667a7 7 0 1 0 0-14"
        />
      </g>
    </svg>
  );
}

interface Props {
  mobile?: boolean;
}

export default function ProductHuntLive({ mobile = false }: Props) {
  const [show, setShow] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("ref") !== "producthunt") setShow(true);
  }, []);

  useEffect(() => {
    if (!show) return;
    const cycle = setInterval(() => {
      setExpanded(true);
      setTimeout(() => setExpanded(false), 3000);
    }, 5000);
    return () => clearInterval(cycle);
  }, [show]);

  if (!show) return null;

  const textColor = isDark ? "rgba(255,255,255,0.65)" : "rgba(21,21,22,0.65)";

  return (
    <a
      href="https://www.producthunt.com/products/riffle-2"
      target="_blank"
      rel="noopener noreferrer"
      className={mobile ? "inline-flex items-center gap-2 md:hidden" : "hidden md:inline-flex items-center gap-2"}
      style={{
        fontSize: "11px",
        fontWeight: 600,
        letterSpacing: "0.3em",
        textTransform: "uppercase",
        color: textColor,
        textDecoration: "none",
        ...(mobile ? { marginBottom: "20px" } : {}),
      }}
    >
      {/* Icon: blinking dot ↔ PH logo */}
      <AnimatePresence mode="wait" initial={false}>
        {expanded ? (
          <motion.span
            key="ph"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.22 }}
            style={{ display: "flex", flexShrink: 0 }}
          >
            <PHLogo />
          </motion.span>
        ) : (
          <motion.span
            key="dot"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ display: "flex", alignItems: "center", flexShrink: 0 }}
          >
            <RecordDot />
          </motion.span>
        )}
      </AnimatePresence>

      {/* Text expands: LIVE → live on product hunt */}
      <motion.span
        animate={{ maxWidth: expanded ? 260 : 48 }}
        transition={{ type: "spring", damping: 28, stiffness: 220 }}
        style={{ overflow: "hidden", whiteSpace: "nowrap" }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {expanded ? (
            <motion.span
              key="full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18, delay: 0.1 }}
              style={{ display: "block" }}
            >
              live on product hunt
            </motion.span>
          ) : (
            <motion.span
              key="short"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              style={{ display: "block" }}
            >
              live
            </motion.span>
          )}
        </AnimatePresence>
      </motion.span>
    </a>
  );
}
