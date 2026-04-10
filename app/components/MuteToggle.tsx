"use client";

import { useEffect, useState, useRef } from "react";
import { useTheme } from "next-themes";

interface MuteToggleProps {
  className?: string;
  onScrollToManifesto?: boolean;
}

export default function MuteToggle({ className = "", onScrollToManifesto = false }: MuteToggleProps) {
  const [mounted, setMounted] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { resolvedTheme } = useTheme();

  const isDark = mounted && resolvedTheme === "dark";

  // Update audio source when theme changes
  useEffect(() => {
    if (!mounted) return;

    const wasPlaying = audioRef.current && !audioRef.current.paused;
    const currentTime = audioRef.current?.currentTime || 0;

    // Clean up old audio
    if (audioRef.current) {
      audioRef.current.pause();
    }

    // Create new audio with theme-appropriate file
    const audioFile = isDark ? "/dark-mode.mp3" : "/light-mode.mp3";
    const audio = new Audio(audioFile);
    audio.loop = true;
    audio.volume = 0.5;
    audio.currentTime = currentTime;
    audioRef.current = audio;

    // Resume playback if it was playing before
    if (wasPlaying && hasStarted) {
      audio.play().catch(console.error);
    }
  }, [isDark, mounted, hasStarted]);

  // Handle scroll-triggered autoplay
  useEffect(() => {
    if (!onScrollToManifesto || hasStarted) return;

    const playAudio = async () => {
      if (audioRef.current && !hasStarted) {
        try {
          await audioRef.current.play();
          console.log("Audio started playing on scroll");
          setIsMuted(false);
          setHasStarted(true);
        } catch (error) {
          console.log("Auto-play prevented:", error);
        }
      }
    };

    playAudio();
  }, [onScrollToManifesto, hasStarted]);

  useEffect(() => {
    setMounted(true);

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.play();
        setHasStarted(true);
      } else {
        audioRef.current.pause();
      }
      setIsMuted(!isMuted);
    }
  };

  if (!mounted) return null;

  return (
    <button
      type="button"
      aria-pressed={isMuted}
      aria-label="Toggle audio mute"
      onClick={toggleMute}
      className={`text-[11px] font-medium uppercase tracking-[0.15em] transition-opacity px-4 py-2 rounded-md border ${className}`}
      style={{
        color: isDark
          ? "rgba(255, 255, 255, 0.48)"
          : "rgba(21, 21, 22, 0.48)",
        borderColor: isDark
          ? "rgba(255, 255, 255, 0.1)"
          : "rgba(21, 21, 22, 0.1)",
        opacity: isMuted ? 0.3 : 1,
      }}
    >
      {isMuted ? "UNMUTE" : "MUTE"}
    </button>
  );
}
