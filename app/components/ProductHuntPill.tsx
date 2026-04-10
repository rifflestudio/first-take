"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function ProductHuntLogo() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 40 40" aria-hidden="true">
      <g fill="none" fillRule="evenodd">
        <path fill="#FF6154" d="M40 20c0 11.046-8.954 20-20 20S0 31.046 0 20 8.954 0 20 0s20 8.954 20 20" />
        <path fill="#FFF" d="M22.667 20H17v-6h5.667a3 3 0 0 1 0 6m0-10H13v20h4v-6h5.667a7 7 0 1 0 0-14" />
      </g>
    </svg>
  );
}

export default function ProductHuntPill() {
  const [show, setShow] = useState(false);
  const [bright, setBright] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("ref") === "producthunt") return;

    const t = setTimeout(() => setShow(true), 900);
    return () => clearTimeout(t);
  }, []);

  // Hide when footer is visible
  const [footerVisible, setFooterVisible] = useState(false);
  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer) return;
    const observer = new IntersectionObserver(
      ([entry]) => setFooterVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  // Pulse once every 6s after entrance
  useEffect(() => {
    if (!show) return;
    const interval = setInterval(() => {
      setBright(true);
      setTimeout(() => setBright(false), 600);
    }, 6000);
    return () => clearInterval(interval);
  }, [show]);

  return (
    <AnimatePresence>
      {show && !footerVisible && (
        <motion.a
          href="https://www.producthunt.com"
          target="_blank"
          rel="noopener noreferrer"
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: bright ? 1 : 0.6 }}
          exit={{ y: 80, opacity: 0, transition: { duration: 0.2 } }}
          transition={{
            y: { type: "spring", damping: 22, stiffness: 200 },
            opacity: { duration: bright ? 0.3 : 0.55, ease: "easeInOut" },
          }}
          className="fixed bottom-6 right-6 z-50 inline-flex items-center gap-3 px-4 py-3 text-white cursor-pointer select-none"
          style={{
            backgroundColor: "#FF6154",
            borderRadius: "12px",
            fontSize: "11px",
            fontWeight: 600,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
          }}
        >
          <ProductHuntLogo />
          we are live on product hunt
        </motion.a>
      )}
    </AnimatePresence>
  );
}
