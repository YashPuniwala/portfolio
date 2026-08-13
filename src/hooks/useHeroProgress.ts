import { useEffect, useState } from "react";
import { useScroll, useTransform, type MotionValue } from "framer-motion";

/**
 * A single shared 0 -> 1 scroll progress value spanning the hero's height.
 * Everything in the hero -> nav docking sequence reads from this one value so
 * the whole thing behaves as one continuous motion, not separate animations.
 */
export function useHeroProgress(): MotionValue<number> {
  const { scrollY } = useScroll();
  const [range, setRange] = useState(800);

  useEffect(() => {
    const measure = () => setRange(Math.max(1, window.innerHeight * 0.85));
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  return useTransform(scrollY, [0, range], [0, 1], { clamp: true });
}

export default useHeroProgress;
