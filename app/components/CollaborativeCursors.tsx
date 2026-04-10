"use client";

import { motion } from "framer-motion";
import type { CSSProperties } from "react";
import { useEffect, useState } from "react";

const SPRING = { bounceStiffness: 250, bounceDamping: 18 };

const CURSORS = [
  {
    key: "pharrell",
    name: "pharrell",
    cursorSrc: "/cursors/cursor-deo.svg",
    badgeGradient: "linear-gradient(117.408deg, rgb(166, 232, 255) 17.661%, rgb(49, 202, 255) 92.395%)",
    textColor: "#1f1f27",
    textOpacity: 0.8,
    originLeft: "67.4%",
    originTop: "21.5%",
    mobileLeft: "68%",
    mobileTop: "8%",
    badgeOffset: { x: 22, y: 22 },
    animateX: [0, 6, -3, 2, 0] as number[],
    animateY: [0, -4, 6, -2, 0] as number[],
    duration: 7,
    flip: false,
    chefIcon: false,
  },
  {
    key: "fred",
    name: "fred",
    cursorSrc: "/cursors/cursor-an5rag.svg",
    badgeGradient: "linear-gradient(-44.518deg, rgb(32, 94, 96) 13.085%, rgb(66, 194, 198) 94.032%)",
    textColor: "#ffffff",
    textOpacity: 1,
    originLeft: "32.1%",
    originTop: "41.2%",
    mobileLeft: "62%",
    mobileTop: "75%",
    badgeOffset: { x: -62, y: 22 },
    animateX: [0, -8, 4, -2, 0] as number[],
    animateY: [0, 5, -7, 3, 0] as number[],
    duration: 9,
    flip: true,
    chefIcon: false,
  },
  {
    key: "sousChef",
    name: "sous chef",
    cursorSrc: "/cursors/cursor-sous-chef.svg",
    badgeGradient: "linear-gradient(142.175deg, rgb(252, 115, 255) 18.991%, rgb(210, 15, 214) 94.137%)",
    textColor: "#ffffff",
    textOpacity: 1,
    originLeft: "63%",
    originTop: "52%",
    mobileLeft: "3%",
    mobileTop: "45%",
    badgeOffset: { x: 22, y: 22 },
    animateX: [0, -4, 3, -1, 0] as number[],
    animateY: [0, 5, -3, 2, 0] as number[],
    duration: 8,
    flip: false,
    chefIcon: true,
  },
];

const badgeStyle = (gradient: string): CSSProperties => ({
  background: gradient,
  borderRadius: "24px",
  padding: "8px 16px",
  display: "inline-flex",
  alignItems: "center",
  whiteSpace: "nowrap",
  pointerEvents: "none",
  gap: "8px",
});

const badgeTextStyle = (color: string, opacity: number): CSSProperties => ({
  fontFamily: "'Inter', system-ui, sans-serif",
  fontWeight: 500,
  fontSize: "14px",
  lineHeight: "24px",
  color,
  opacity,
});

export default function CollaborativeCursors() {
  const [dragging, setDragging] = useState<Record<string, boolean>>({});
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <>
      {CURSORS.map((cursor) => (
        <motion.div
          key={`${cursor.key}-${isMobile}`}
          className="absolute select-none"
          style={{ cursor: dragging[cursor.key] ? "grabbing" : "grab", zIndex: 10, scale: isMobile ? 0.65 : 1, originX: 0, originY: 0 }}
          initial={{ left: isMobile ? cursor.mobileLeft : cursor.originLeft, top: isMobile ? cursor.mobileTop : cursor.originTop }}
          drag
          dragSnapToOrigin
          dragTransition={SPRING}
          onDragStart={() => setDragging((d) => ({ ...d, [cursor.key]: true }))}
          onDragEnd={() => setTimeout(() => setDragging((d) => ({ ...d, [cursor.key]: false })), 600)}
        >
          <motion.div
            animate={dragging[cursor.key] ? { x: 0, y: 0 } : { x: cursor.animateX, y: cursor.animateY }}
            transition={dragging[cursor.key] ? { duration: 0.4 } : { duration: cursor.duration, repeat: Infinity, ease: "easeInOut" }}
          >
            <img
              src={cursor.cursorSrc}
              width={26}
              height={26}
              alt=""
              style={{ display: "block", pointerEvents: "none", transform: cursor.flip ? "rotate(180deg) scaleY(-1)" : undefined }}
            />
            <div style={{ position: "absolute", left: cursor.badgeOffset.x, top: cursor.badgeOffset.y, ...badgeStyle(cursor.badgeGradient) }}>
              <span style={badgeTextStyle(cursor.textColor, cursor.textOpacity)}>{cursor.name}</span>
              {cursor.chefIcon && (
                <img src="/cursors/icon-chef.svg" width={16} height={15} alt="" style={{ display: "block", pointerEvents: "none", flexShrink: 0 }} />
              )}
            </div>
          </motion.div>
        </motion.div>
      ))}
    </>
  );
}
