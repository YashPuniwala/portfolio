import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

const CHARS = "!<>-_\\/[]{}—=+*^?#ABCDEFGHIJKLMNOPQRSTUVWXYZ";

interface ScrambleTextProps {
  text: string;
  className?: string;
  /** ms the whole decode sweep takes */
  duration?: number;
  /** run once automatically after mount (used on touch devices) */
  autoStart?: boolean;
  autoStartDelay?: number;
  style?: React.CSSProperties;
}

/**
 * Per-character scramble/decode sweep. Characters lock in left-to-right so it
 * reads as a wave rather than everything resolving at once.
 */
const ScrambleText = ({
  text,
  className,
  duration = 520,
  autoStart = false,
  autoStartDelay = 1400,
  style,
}: ScrambleTextProps) => {
  const reduceMotion = useReducedMotion();
  const [display, setDisplay] = useState(text);
  const rafRef = useRef(0);
  const runningRef = useRef(false);

  const stop = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    runningRef.current = false;
  }, []);

  const run = useCallback(() => {
    if (reduceMotion || runningRef.current) return;
    runningRef.current = true;
    const start = performance.now();
    const chars = text.split("");
    // Each character locks in progressively across the word.
    const lockAt = chars.map((_, i) => (i / Math.max(chars.length, 1)) * 0.72 + 0.28);

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      setDisplay(
        chars
          .map((c, i) => {
            if (c === " ") return c;
            if (t >= (lockAt[i] ?? 1)) return c;
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join(""),
      );
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setDisplay(text);
        runningRef.current = false;
      }
    };
    rafRef.current = requestAnimationFrame(tick);
  }, [duration, reduceMotion, text]);

  useEffect(() => setDisplay(text), [text]);

  useEffect(() => {
    if (!autoStart || reduceMotion) return;
    const id = window.setTimeout(run, autoStartDelay);
    return () => window.clearTimeout(id);
  }, [autoStart, autoStartDelay, reduceMotion, run]);

  useEffect(() => stop, [stop]);

  return (
    <span
      className={className}
      style={style}
      onMouseEnter={autoStart ? undefined : run}
      aria-label={text}
    >
      <span aria-hidden>{display}</span>
    </span>
  );
};

export default ScrambleText;
