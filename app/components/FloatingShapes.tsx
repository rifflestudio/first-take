import { useEffect, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  MotionValue,
  SpringOptions,
} from "framer-motion";
import Image from "next/image";

interface Shape {
  id: number;
  src: string;
  initialX: number;
  initialY: number;
  parallaxFactor: number;
  size: number;
  mobileSizeMultiplier: number;
  mass: number;
  damping: number;
}

const SHAPES_CONFIG: Shape[] = [
  {
    id: 1,
    src: "/shapes/fluffy.png", // red spheres on left - super heavy and slow
    initialX: -2,
    initialY: 15,
    parallaxFactor: 0.3,
    size: 250,
    mobileSizeMultiplier: 0.5,
    mass: 15,
    damping: 70,
  },
  {
    id: 2,
    src: "/shapes/star.png", // blue star on right - light and responsive
    initialX: 80,
    initialY: 8,
    parallaxFactor: 0.1,
    size: 200,
    mobileSizeMultiplier: 0.6,
    mass: 2,
    damping: 20,
  },
  {
    id: 3,
    src: "/shapes/spiral.png", // purple flower in middle - heavy and dreamy
    initialX: 70,
    initialY: 45,
    parallaxFactor: 0.4,
    size: 180,
    mobileSizeMultiplier: 0.5,
    mass: 18,
    damping: 75,
  },
  {
    id: 4,
    src: "/shapes/cuboid.png", // yellow blocks bottom right - very heavy
    initialX: 70,
    initialY: 80,
    parallaxFactor: 0.2,
    size: 220,
    mobileSizeMultiplier: 0.4,
    mass: 20,
    damping: 90,
  },
  {
    id: 5,
    src: "/shapes/donut.png", // donut - now heavier and more stable
    initialX: 10,
    initialY: 65,
    parallaxFactor: 0.25,
    size: 190,
    mobileSizeMultiplier: 0.45,
    mass: 16,
    damping: 80,
  },
] as const;

export default function FloatingShapes() {
  const { scrollY } = useScroll();
  const [isInitialized, setIsInitialized] = useState(false);
  const [isReady, setIsReady] = useState(false);

  // Initialize after first render to ensure proper scroll position
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialized(true);
      setTimeout(() => {
        setIsReady(true);
      }, 100);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Create transform values at the component level
  const yTransforms = SHAPES_CONFIG.map((shape) => {
    const y = useTransform(scrollY, [0, 1000], [0, 400 * shape.parallaxFactor]);
    const springConfig: SpringOptions = {
      stiffness: 20,
      damping: shape.damping,
      mass: shape.mass,
      restSpeed: 0.2,
    };
    return useSpring(y, springConfig);
  });

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {SHAPES_CONFIG.map((shape, index) => (
        <motion.div
          key={shape.id}
          className={`absolute ${
            shape.id === 3 ? "blur-[1.5px]" : "blur-[1.5px] md:blur-none"
          }`}
          style={{
            left: `${shape.initialX}%`,
            top: `${shape.initialY}%`,
            y: isReady ? yTransforms[index] : 0,
          }}
          initial={{ y: 0 }}
          animate={{
            y: [0, -8, 0],
            rotate: [
              0,
              // Red spheres: wavy wobble
              shape.id === 1
                ? [-4, 4, -4, 4, -4]
                : // Blue star: continuous gentle spin
                shape.id === 2
                ? 360
                : // Purple flower: dreamy floating rotation
                shape.id === 3
                ? [-8, 8]
                : // Yellow blocks: gentle but noticeable tilt
                shape.id === 4
                ? [-3, 3]
                : // Donut: full rotation with pause
                  [0, 180, 180, 360],
            ].flat(),
            scale: [1, 1.02, 1],
          }}
          transition={{
            duration:
              shape.id === 2
                ? 20 // Blue star full rotation
                : shape.id === 5
                ? 15 // Donut rotation
                : shape.mass > 10
                ? 12
                : 8, // Other shapes
            ease:
              shape.id === 2
                ? "linear"
                : shape.id === 5
                ? ["easeInOut", "linear", "easeInOut"]
                : "easeInOut",
            repeat: Infinity,
            repeatType: shape.id === 2 || shape.id === 5 ? "loop" : "mirror",
            times:
              shape.id === 1
                ? [0, 0.2, 0.4, 0.6, 0.8, 1]
                : shape.id === 5
                ? [0, 0.4, 0.6, 1]
                : undefined,
          }}
        >
          <Image
            src={shape.src}
            alt="Decorative shape"
            width={shape.size}
            height={shape.size}
            style={{
              width: `${Math.round(shape.size * shape.mobileSizeMultiplier)}px`,
              height: `${Math.round(
                shape.size * shape.mobileSizeMultiplier
              )}px`,
              maxWidth: "unset",
            }}
            className="object-contain md:!w-[250px] md:!h-[250px]"
          />
        </motion.div>
      ))}
    </div>
  );
}
