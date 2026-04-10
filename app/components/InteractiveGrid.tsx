import { useState, useEffect, useMemo } from "react";
import { motion, animate, useMotionValue } from "framer-motion";

export default function InteractiveGrid() {
  const [isMobile, setIsMobile] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Create motion values for the flashlight effect
  const flashlightSize = useMotionValue(200);
  const flashlightOpacity = useMotionValue(0.8);
  const dotScale = useMotionValue(1);

  // Memoize grid configuration
  const gridConfig = useMemo(() => {
    const cols = isMobile ? 15 : 40;
    const rows = isMobile ? 15 : 25;
    return {
      cols,
      rows,
      totalDots: cols * rows,
      dotSize: isMobile ? "1.5px" : "2px",
    };
  }, [isMobile]);

  // Initialize mouse position and check mobile on mount
  useEffect(() => {
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    });
    setMousePosition({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    });

    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    // Faster breathing animation
    const breathingAnimation = animate(flashlightSize, [200, 240, 200], {
      duration: 3,
      ease: "easeInOut",
      repeat: Infinity,
    });

    // Faster opacity animation
    const opacityAnimation = animate(flashlightOpacity, [0.8, 0.9, 0.8], {
      duration: 3,
      ease: "easeInOut",
      repeat: Infinity,
    });

    // Faster dot scale animation
    const dotScaleAnimation = animate(dotScale, [1, 1.1, 1], {
      duration: 2,
      ease: "easeInOut",
      repeat: Infinity,
    });

    return () => {
      breathingAnimation.stop();
      opacityAnimation.stop();
      dotScaleAnimation.stop();
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  // Throttle mouse move updates with RAF
  useEffect(() => {
    if (isMobile) return;

    let rafId: number;
    const handleMouseMove = (e: MouseEvent) => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        setMousePosition({
          x: e.clientX,
          y: e.clientY,
        });
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [isMobile]);

  // Handle touch events for mobile
  useEffect(() => {
    if (!isMobile) return;

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      setMousePosition({
        x: touch.clientX,
        y: touch.clientY,
      });
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];
      setMousePosition({
        x: touch.clientX,
        y: touch.clientY,
      });
    };

    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [isMobile]);

  // Calculate flashlight effect using CSS custom properties
  const flashlightStyle = useMemo(() => {
    const size = flashlightSize.get();
    return {
      "--flashlight-x": `${mousePosition.x}px`,
      "--flashlight-y": `${mousePosition.y}px`,
      "--flashlight-size": `${size}px`,
      "--flashlight-opacity": flashlightOpacity.get(),
    } as React.CSSProperties;
  }, [mousePosition.x, mousePosition.y, flashlightSize, flashlightOpacity]);

  // Memoize grid dots positions
  const gridDots = useMemo(() => {
    return Array.from({ length: gridConfig.totalDots }).map((_, i) => {
      const row = Math.floor(i / gridConfig.cols);
      const col = i % gridConfig.cols;
      return {
        id: i,
        x: `${(col / (gridConfig.cols - 1)) * 100}%`,
        y: `${(row / (gridConfig.rows - 1)) * 100}%`,
      };
    });
  }, [gridConfig.totalDots, gridConfig.cols, gridConfig.rows]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      <div className="w-full h-full relative">
        {/* Base grid with low opacity */}
        <div className="absolute inset-0 opacity-[0.03]">
          {gridDots.map((dot) => (
            <motion.div
              key={dot.id}
              className="absolute rounded-full bg-gray-500"
              style={{
                width: gridConfig.dotSize,
                height: gridConfig.dotSize,
                left: dot.x,
                top: dot.y,
                transform: "translate(-50%, -50%)",
                scale: dotScale,
                transition: "scale 0.2s ease-out",
              }}
            />
          ))}
        </div>

        {/* Flashlight effect */}
        <motion.div className="absolute inset-0" style={flashlightStyle}>
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(circle at var(--flashlight-x) var(--flashlight-y), 
                rgba(255, 255, 255, 0.15) 0%,
                rgba(255, 255, 255, 0.1) 40%,
                rgba(255, 255, 255, 0) 80%)`,
              mask: `radial-gradient(circle at var(--flashlight-x) var(--flashlight-y), 
                #333333 0%,
                #333333 40%,
                transparent 80%)`,
              WebkitMask: `radial-gradient(circle at var(--flashlight-x) var(--flashlight-y), 
                #333333 0%,
                #333333 40%,
                transparent 80%)`,
              opacity: "var(--flashlight-opacity)",
            }}
          >
            {gridDots.map((dot) => {
              const dotX = (parseFloat(dot.x) * dimensions.width) / 100;
              const dotY = (parseFloat(dot.y) * dimensions.height) / 100;
              const distance = Math.sqrt(
                Math.pow(dotX - mousePosition.x, 2) +
                  Math.pow(dotY - mousePosition.y, 2)
              );

              if (distance > flashlightSize.get()) return null;

              const opacity = 1 - (distance / flashlightSize.get()) * 0.7;

              return (
                <motion.div
                  key={dot.id}
                  className="absolute rounded-full bg-gray-400"
                  style={{
                    width: gridConfig.dotSize,
                    height: gridConfig.dotSize,
                    left: dot.x,
                    top: dot.y,
                    transform: "translate(-50%, -50%)",
                    opacity,
                    scale: dotScale,
                    transition: "all 0.2s ease-out",
                  }}
                />
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
