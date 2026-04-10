import { motion, useScroll, useTransform } from "framer-motion";
import { staggerContainerVariants, fadeInUp } from "./utils";
import Image from "next/image";
import { useRef, useState, useEffect, useCallback } from "react";

// Constants for reused class names
const BENTO_BG_CLASS =
  "bg-[#F4F4F4]/90 backdrop-blur-md rounded-3xl shadow-[0_0_15px_rgba(0,0,0,0.03)]";
const BENTO_PADDING = "p-8 md:p-10";
const HEADING_CLASS = "text-xl md:text-2xl font-medium mb-2";
const BODY_TEXT_CLASS = "text-body2 text-gray-600";

// Critical images to preload
const CRITICAL_IMAGES = ["/bento/everything-2.png"];

export default function BentoFeatureGrid() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  // Force first item to always load immediately
  const [topItemLoaded, setTopItemLoaded] = useState(true);

  // Properly implement responsive detection with useEffect
  const [isMobile, setIsMobile] = useState(false);
  const [initialRender, setInitialRender] = useState(true);

  // Use a more efficient scroll configuration with a safety option for SSR
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "start start"],
    // Adding smoother scroll handling for mobile
    layoutEffect: false, // Use useEffect instead of layoutEffect to avoid performance issues
  });

  // Use effect to mark initial render as complete after hydration
  useEffect(() => {
    // After hydration, mark initial render as complete
    setInitialRender(false);
  }, []);

  // Preload critical images
  const preloadImages = useCallback(() => {
    CRITICAL_IMAGES.forEach((src) => {
      const img = new window.Image();
      img.src = src;
    });
  }, []);

  useEffect(() => {
    // Function to check if viewport is mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkMobile();

    // Start preloading critical images
    preloadImages();

    // Fallback: Set hasLoaded to true after a short delay regardless of viewport
    const fallbackTimer = setTimeout(() => {
      setHasLoaded(true);
    }, 1000);

    // Add event listener for window resize
    window.addEventListener("resize", checkMobile);

    // Clean up
    return () => {
      window.removeEventListener("resize", checkMobile);
      clearTimeout(fallbackTimer);
    };
  }, [preloadImages]);

  // Intersection Observer to determine when grid is visible
  useEffect(() => {
    if (!containerRef.current) return;

    // Check if already in viewport on load
    const checkInitialVisibility = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const isInitiallyVisible =
          rect.top < window.innerHeight && rect.bottom > 0;

        if (isInitiallyVisible) {
          setIsVisible(true);
          setHasLoaded(true);
        }
      }
    };

    // Check immediately on mount
    checkInitialVisibility();

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          // Preload images when section becomes visible
          setHasLoaded(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  // Improved transforms for better visibility on all devices
  const imageTransformY = useTransform(scrollYProgress, [0, 0.8], [200, 50]);
  const imageTransformX = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [0, 50, 200]
  );

  return (
    <motion.div
      className="w-full mb-16"
      initial={initialRender ? "visible" : "hidden"}
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }} // Reduced threshold for earlier loading
      variants={staggerContainerVariants}
    >
      {/* Grid container with responsive columns */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
        {/* Everything you need in one place */}
        <motion.div
          ref={containerRef}
          className={`col-span-1 md:col-span-12 ${BENTO_BG_CLASS} ${BENTO_PADDING} relative overflow-hidden min-h-[600px] md:min-h-[600px]`}
          variants={fadeInUp}
        >
          <div className="relative z-10 max-w-2xl mx-auto text-center pt-4 mb-4 md:mb-0">
            <h3 className={`${HEADING_CLASS} md:text-3xl`}>
              Do it all in one place
            </h3>
            <p className={BODY_TEXT_CLASS}>
              All the tools you need to record, write, edit, and organize your
              musical universe. No more jumping between tabs or tools —
              everything you need to create lives here, built to flow like your
              ideas do.
            </p>
          </div>
          {/* Improved image handling for mobile and desktop */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 w-full h-[60%] md:h-[75%] flex justify-center items-end"
            style={
              isMobile
                ? { x: imageTransformX, y: -200, scale: 2 }
                : { y: imageTransformY }
            }
          >
            <div className="relative w-full h-full">
              {(hasLoaded || topItemLoaded) && (
                <Image
                  src="/bento/everything-2.png"
                  alt="Everything you need in one place"
                  fill
                  sizes="100vw"
                  style={{ objectFit: "contain", objectPosition: "bottom" }}
                  priority
                  loading="eager"
                />
              )}
            </div>
          </motion.div>
        </motion.div>

        {/* Write stronger lyrics, faster */}
        <motion.div
          className={`col-span-1 md:col-span-8 ${BENTO_BG_CLASS} relative overflow-hidden min-h-[550px] md:min-h-[400px]`}
          variants={fadeInUp}
        >
          <div className="flex flex-col md:flex-row h-full  ">
            <div className="max-w-full md:max-w-[40%] mb-4 md:mb-0 p-8 md:p-10">
              <h3 className={HEADING_CLASS}>Craft lyrics with Lyra</h3>
              <p className={BODY_TEXT_CLASS}>
                Our writing assistant gives you tools like rhyme finders,
                syllable counters, and smart suggestions to keep your flow
                moving. You're in control — Lyra's just here to help.
              </p>
            </div>
            <div className="flex-1 h-full relative">
              <div className="w-full h-full relative flex items-center justify-center">
                <div className="relative h-[300px] w-[300px] md:h-[320px] md:w-[320px] -translate-x-10 md:-translate-x-16">
                  <motion.div
                    initial={{ y: 100, opacity: 0, rotate: -8 }}
                    whileInView={{ y: 0, opacity: 1, rotate: -8 }}
                    viewport={{ once: true, margin: "-100px 0px" }}
                    transition={{ duration: 0.4, delay: 0 }}
                    className="absolute top-0 left-0 z-10"
                  >
                    {hasLoaded && (
                      <Image
                        src="/bento/lyra-1.png"
                        alt="Lyra writing assistant"
                        width={280}
                        height={200}
                        className="rounded-lg shadow-md border-4 border-white"
                        loading="eager"
                      />
                    )}
                  </motion.div>
                  <motion.div
                    initial={{ y: 140, x: 30, opacity: 0, rotate: -4 }}
                    whileInView={{ y: 40, x: 30, opacity: 1, rotate: -4 }}
                    viewport={{ once: true, margin: "-100px 0px" }}
                    transition={{ duration: 0.4, delay: 0.4 }}
                    className="absolute top-0 left-0 z-20"
                  >
                    {hasLoaded && (
                      <Image
                        src="/bento/lyra-2.png"
                        alt="Lyra writing assistant"
                        width={280}
                        height={200}
                        className="rounded-lg shadow-md border-4 border-white"
                        loading="eager"
                      />
                    )}
                  </motion.div>
                  <motion.div
                    initial={{ y: 180, x: 60, opacity: 0, rotate: 0 }}
                    whileInView={{ y: 80, x: 60, opacity: 1, rotate: 0 }}
                    viewport={{ once: true, margin: "-100px 0px" }}
                    transition={{ duration: 0.4, delay: 0.6 }}
                    className="absolute top-0 left-0 z-30"
                  >
                    {hasLoaded && (
                      <Image
                        src="/bento/lyra-3.png"
                        alt="Lyra writing assistant"
                        width={280}
                        height={200}
                        className="rounded-lg shadow-md border-4 border-white"
                        loading="eager"
                      />
                    )}
                  </motion.div>
                  <motion.div
                    initial={{ y: 220, x: 90, opacity: 0, rotate: 4 }}
                    whileInView={{ y: 120, x: 90, opacity: 1, rotate: 4 }}
                    viewport={{ once: true, margin: "-100px 0px" }}
                    transition={{ duration: 0.4, delay: 0.8 }}
                    className="absolute top-0 left-0 z-40"
                  >
                    {hasLoaded && (
                      <Image
                        src="/bento/lyra-4.png"
                        alt="Lyra writing assistant"
                        width={280}
                        height={200}
                        className="rounded-lg shadow-md"
                        loading="eager"
                      />
                    )}
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Record with Ease */}
        <motion.div
          className={`col-span-1 md:col-span-4 ${BENTO_BG_CLASS} ${BENTO_PADDING} relative overflow-hidden min-h-[550px] md:min-h-[400px]`}
          variants={fadeInUp}
        >
          <div className="flex flex-col h-full">
            <div className="z-10 relative">
              <h3 className={HEADING_CLASS}>Record, trim, loop</h3>
              <p className={BODY_TEXT_CLASS}>
                Capture vocals, instruments, or voice notes straight into
                Riffle. Trim, loop, or export your takes — and drop them
                directly into your project when you're ready.
              </p>
            </div>

            <div className="flex-1 h-full relative mt-6">
              <div className="w-full h-full relative flex items-center justify-center">
                {hasLoaded && (
                  <img
                    src="/bento/recorder.gif"
                    alt="Record with ease"
                    className="w-full h-auto max-h-[250px] object-contain"
                  />
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Collaborate in real time */}
        <motion.div
          className={`col-span-1 md:col-span-4 ${BENTO_BG_CLASS}  relative overflow-hidden min-h-[550px] md:min-h-[400px]`}
          variants={fadeInUp}
        >
          <div className="flex flex-col h-full">
            <div className={`z-10 relative ${BENTO_PADDING}`}>
              <h3 className={HEADING_CLASS}>Collaborate in real time</h3>
              <p className={BODY_TEXT_CLASS}>
                Ideas don't have to live in group chats or 3am voice notes
                anymore. Bring them to a shared board — comment on specific
                parts, record over ideas, and shape your music together.
              </p>
            </div>

            <div className="flex-1 h-full relative mt-6">
              <div className="w-full h-full relative flex items-start justify-center">
                <div className="relative w-full">
                  {hasLoaded && (
                    <Image
                      src="/bento/collab-comment.png"
                      alt="Collaboration comment"
                      width={400}
                      height={280}
                      className="rounded-lg w-full"
                      loading="eager"
                    />
                  )}
                  <motion.div
                    className="absolute top-0 left-0 w-full h-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: hasLoaded ? 1 : 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    {hasLoaded && (
                      <>
                        <motion.div
                          className="absolute left-[30%] top-[20%]"
                          animate={{
                            x: [-10, 10, -10],
                            y: [-8, 8, -8],
                          }}
                          transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        >
                          <Image
                            src="/bento/Cursor.png"
                            alt="Collaborator cursor 1"
                            width={96}
                            height={96}
                            className="object-contain"
                          />
                        </motion.div>
                        <motion.div
                          className="absolute left-[60%] top-[40%]"
                          animate={{
                            x: [-12, 12, -12],
                            y: [-10, 10, -10],
                          }}
                          transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 0.5,
                          }}
                        >
                          <Image
                            src="/bento/Cursor-1.png"
                            alt="Collaborator cursor 2"
                            width={120}
                            height={120}
                            className="object-contain"
                          />
                        </motion.div>
                        <motion.div
                          className="absolute left-[45%] top-[60%]"
                          animate={{
                            x: [-15, 15, -15],
                            y: [-12, 12, -12],
                          }}
                          transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 1,
                          }}
                        >
                          <Image
                            src="/bento/Cursor-2.png"
                            alt="Collaborator cursor 3"
                            width={96}
                            height={96}
                            className="object-contain"
                          />
                        </motion.div>
                        <motion.div
                          className="absolute left-[20%] top-[70%]"
                          animate={{
                            x: [-14, 14, -14],
                            y: [-11, 11, -11],
                          }}
                          transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 1.5,
                          }}
                        >
                          <Image
                            src="/bento/Cursor-3.png"
                            alt="Collaborator cursor 4"
                            width={100}
                            height={100}
                            className="object-contain"
                          />
                        </motion.div>
                      </>
                    )}
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Drop in your references */}
        <motion.div
          className={`col-span-1 md:col-span-4 ${BENTO_BG_CLASS} ${BENTO_PADDING} relative min-h-[500px] md:min-h-[500px]`}
          variants={fadeInUp}
        >
          <h3 className={HEADING_CLASS}>Embed almost anything</h3>
          <p className={`${BODY_TEXT_CLASS} mb-4`}>
            Spotify links, YouTube videos, audio files, samples, and even
            playable tools like synths and chord machines — right inside your
            board.
          </p>
          <div className="relative h-[320px] md:h-[350px] mx-auto max-w-[280px] md:max-w-full">
            <motion.div
              initial={{ y: 0, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, margin: "-100px 0px" }}
              transition={{ duration: 0.4, delay: 0 }}
              className="absolute inset-x-0 top-0 z-10"
            >
              {hasLoaded && (
                <Image
                  src="/bento/apple-music.png"
                  alt="Apple Music embed example"
                  width={300}
                  height={200}
                  className="rounded-lg w-full"
                  loading="eager"
                />
              )}
            </motion.div>
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 70, opacity: 1 }}
              viewport={{ once: true, margin: "-100px 0px" }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="absolute inset-x-0 top-0 z-20"
            >
              {hasLoaded && (
                <Image
                  src="/bento/spotify.png"
                  alt="Spotify embed example"
                  width={300}
                  height={200}
                  className="rounded-lg w-full"
                  loading="eager"
                />
              )}
            </motion.div>
            <motion.div
              initial={{ y: 60, opacity: 0 }}
              whileInView={{ y: 140, opacity: 1 }}
              viewport={{ once: true, margin: "-100px 0px" }}
              transition={{ duration: 0.4, delay: 0.5 }}
              className="absolute inset-x-0 top-0 z-30"
            >
              {hasLoaded && (
                <Image
                  src="/bento/youtube.png"
                  alt="YouTube embed example"
                  width={300}
                  height={200}
                  className="rounded-lg w-full"
                  loading="eager"
                />
              )}
            </motion.div>
          </div>
        </motion.div>

        {/* Express your vibe */}
        <motion.div
          className={`col-span-1 md:col-span-4 ${BENTO_BG_CLASS} ${BENTO_PADDING}`}
          variants={fadeInUp}
        >
          <h3 className={HEADING_CLASS}>Say more with stickers</h3>
          <p className={`${BODY_TEXT_CLASS} mb-4`}>
            Tag your tracks, call out sections, drop reactions, or just make
            your board feel more you. Music's serious business — but it doesn't
            have to look like it.
          </p>
          <div className="flex justify-center md:justify-start">
            {hasLoaded && (
              <Image
                src="/bento/stickers.png"
                alt="Express your vibe"
                width={300}
                height={200}
                className="rounded-lg"
                loading="eager"
              />
            )}
          </div>
        </motion.div>

        {/* Invisible AI Workflows */}
        <motion.div
          className={`col-span-1 md:col-span-12 ${BENTO_BG_CLASS} ${BENTO_PADDING} relative overflow-hidden min-h-[600px] md:min-h-[500px]`}
          variants={fadeInUp}
        >
          <div className="relative z-10 max-w-full md:max-w-[45%] mb-4 md:mb-0">
            <h3 className={HEADING_CLASS}>Put AI to work — quietly</h3>
            <p className={BODY_TEXT_CLASS}>
              If you need to isolate a vocal, detect chords from a voice memo,
              transcribe lyrics from a demo, we handle it for you, under the
              hood — without breaking your flow.
            </p>
          </div>
          {/* Full bleed image container for mobile */}
          <div className="absolute left-0 right-0 top-[160px] md:right-0 md:left-auto md:inset-y-0 w-full md:w-1/2 h-[420px] md:h-full">
            <div className="-mx-6 md:mx-0 w-[calc(100%+48px)] md:w-full h-full relative flex items-center justify-center">
              {hasLoaded && (
                <>
                  <img
                    src="/bento/ai-workflow.gif"
                    alt="AI Workflows"
                    className="md:hidden max-h-full max-w-full object-contain"
                  />
                  <Image
                    src="/bento/ai-workflow.gif"
                    alt="AI Workflows"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="hidden md:block object-cover"
                    priority
                    loading="eager"
                  />
                </>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
