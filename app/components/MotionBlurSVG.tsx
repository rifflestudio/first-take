// MotionBlurSVG.tsx
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type MotionBlurSVGProps = {
  svgUrl: string; // URL to your SVG asset
  width?: number; // viewport width
  height?: number; // viewport height
  maxBlurPx?: number; // maximum blur at the center
  minBlurPx?: number; // minimum blur at the far edge
  contentScale?: number; // scales the placed image
  preserveAspectRatio?: string; // SVG preserveAspectRatio for <image>, default 'xMidYMid meet'
};

const MotionBlurSVG: React.FC<MotionBlurSVGProps> = ({
  svgUrl,
  width = 640,
  height = 400,
  maxBlurPx = 28,
  minBlurPx = 0,
  contentScale = 1,
  preserveAspectRatio = "xMidYMid meet",
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [mouse, setMouse] = useState<{ x: number; y: number } | null>(null);
  const [isInside, setIsInside] = useState(false);
  const [windowWidth, setWindowWidth] = useState<number>(0);

  // Mobile breakpoint (768px is typically md in Tailwind)
  const mobileBreakpoint = 768;
  const isMobile = windowWidth > 0 && windowWidth < mobileBreakpoint;

  // Calculate responsive dimensions
  useEffect(() => {
    const updateWindowWidth = () => {
      setWindowWidth(window.innerWidth);
    };

    // Set initial width
    updateWindowWidth();

    window.addEventListener("resize", updateWindowWidth);
    return () => window.removeEventListener("resize", updateWindowWidth);
  }, []);

  // Responsive dimensions: on mobile, use screen width (with padding), otherwise use props
  const responsiveWidth = useMemo(() => {
    if (isMobile && windowWidth > 0) {
      // Use screen width minus container padding (p-6 = 24px on each side = 48px total)
      return windowWidth - 48;
    }
    return width;
  }, [isMobile, windowWidth, width]);

  const responsiveHeight = useMemo(() => {
    if (isMobile && windowWidth > 0) {
      // On mobile, height equals width (square)
      const mobileWidth = windowWidth - 48;
      return mobileWidth;
    }
    return height;
  }, [isMobile, windowWidth, height]);

  const padding = 50;
  const contentWidth = responsiveWidth - padding * 2;
  const contentHeight = responsiveHeight - padding * 2;

  const center = useMemo(
    () => ({ x: responsiveWidth / 2, y: responsiveHeight / 2 }),
    [responsiveWidth, responsiveHeight]
  );

  const getLocalPoint = useCallback((evt: React.MouseEvent<SVGSVGElement>) => {
    const rect = (evt.currentTarget as SVGSVGElement).getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top,
    };
  }, []);

  const handleMouseEnter = useCallback(
    (evt: React.MouseEvent<SVGSVGElement>) => {
      setIsInside(true);
      setMouse(getLocalPoint(evt));
    },
    [getLocalPoint]
  );

  const handleMouseMove = useCallback(
    (evt: React.MouseEvent<SVGSVGElement>) => {
      if (!isInside) return;
      setMouse(getLocalPoint(evt));
    },
    [isInside, getLocalPoint]
  );

  const handleMouseLeave = useCallback(() => {
    setIsInside(false);
    setMouse(null);
  }, []);

  const { angleDeg, blurX, blurY } = useMemo(() => {
    if (!mouse) {
      return { angleDeg: 0, blurX: 0, blurY: 0 };
    }
    const dx = mouse.x - center.x;
    const dy = mouse.y - center.y;

    const angle = Math.atan2(dy, dx);
    const oppositeAngle = angle + Math.PI;
    const angleDeg = (oppositeAngle * 180) / Math.PI;

    const dist = Math.sqrt(dx * dx + dy * dy);
    const maxDist = Math.sqrt(
      Math.pow(responsiveWidth / 2, 2) + Math.pow(responsiveHeight / 2, 2)
    );
    const normalized = 1 - Math.min(dist / maxDist, 1); // 1 at center, 0 at far corner

    const blur = minBlurPx + normalized * (maxBlurPx - minBlurPx);

    const blurX = blur;
    const blurY = Math.max(blur * 0.08, 0);

    return { angleDeg, blurX, blurY };
  }, [mouse, center, responsiveWidth, responsiveHeight, maxBlurPx, minBlurPx]);

  const filterId = useMemo(
    () => `motion-blur-${Math.random().toString(36).slice(2)}`,
    []
  );

  const ariaLabel = `Directional motion blur on image. Angle ${Math.round(
    angleDeg
  )}°, blur ${Math.round(blurX)}px.`;

  // Image placement helpers (center the image and allow scaling, accounting for padding)
  const imageWidth = contentWidth;
  const imageHeight = contentHeight;
  const imageX = padding + (contentWidth - imageWidth * contentScale) / 2;
  const imageY = padding + (contentHeight - imageHeight * contentScale) / 2;

  return (
    <div className="w-full h-full flex items-center justify-center">
      <svg
        ref={svgRef}
        width={responsiveWidth}
        height={responsiveHeight}
        className=""
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        role="img"
        aria-label={ariaLabel}
      >
        <defs>
          <filter
            id={filterId}
            x="-100%"
            y="-100%"
            width="300%"
            height="300%"
            colorInterpolationFilters="sRGB"
            filterUnits="objectBoundingBox"
          >
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation={`${blurX} ${blurY}`}
              edgeMode="duplicate"
              result="blurOut"
            />
          </filter>
        </defs>

        {/* Optional visual guides for center and mouse */}
        {/* <g className="opacity-25">
          <line
            x1={center.x}
            y1="0"
            x2={center.x}
            y2={height}
            stroke="#334155"
            strokeWidth="1"
          />
          <line
            x1="0"
            y1={center.y}
            x2={width}
            y2={center.y}
            stroke="#334155"
            strokeWidth="1"
          />
        </g> */}

        {/* Rotate outer group to align blur direction with opposite vector */}
        <g
          transform={`rotate(${angleDeg}, ${center.x}, ${center.y})`}
          style={{ filter: `url(#${filterId})` }}
        >
          {/* Keep content upright visually by counter-rotating inner group */}
          <g transform={`rotate(${-angleDeg}, ${center.x}, ${center.y})`}>
            {/* External SVG loaded as an <image>. If it has internal text, this preserves its orientation. */}
            <image
              href={svgUrl}
              x={imageX}
              y={imageY}
              width={imageWidth * contentScale}
              height={imageHeight * contentScale}
              preserveAspectRatio={preserveAspectRatio}
            />
          </g>
        </g>

        {/* {mouse && (
          <g>
            <circle cx={center.x} cy={center.y} r="4" fill="#22c55e" />
            <circle cx={mouse.x} cy={mouse.y} r="4" fill="#ef4444" />
            <line
              x1={center.x}
              y1={center.y}
              x2={mouse.x}
              y2={mouse.y}
              stroke="#ef4444"
              strokeDasharray="4 3"
              strokeWidth="1.5"
              opacity="0.6"
            />
          </g>
        )} */}
      </svg>
    </div>
  );
};

export default MotionBlurSVG;
