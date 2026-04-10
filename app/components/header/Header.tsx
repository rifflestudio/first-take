"use client";

import { motion } from "framer-motion";
import LogoSmall from "./../logo-small/Logo.small";
import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full p-4 md:p-8 flex justify-between items-center absolute top-0 left-0 z-20">
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-xs md:text-sm invisible"
      >
        {/* Invisible placeholder for flex spacing */}
        [PLACEHOLDER]
      </motion.span>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="flex justify-center"
      >
        <Link href="/">
          <LogoSmall />
        </Link>
      </motion.div>

      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-xs md:text-sm"
      >
        <span className="invisible">[PLACEHOLDER]</span>
      </motion.span>
    </header>
  );
}
