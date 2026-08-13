import { useEffect, useRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";

interface MagneticProps {
  children: ReactNode;
  /** proximity radius in px around the element bounds */
  radius?: number;
  /** max displacement in px */
  strength?: number;
  className?: string;
}

const SPRING = { stiffness: 180, damping: 16, mass: 0.4 };

/**
 * Wraps an interactive element and pulls it gently toward the cursor when the
 * pointer comes within `radius` of its bounds. Purely transform-based, so the
 * hit area follows the visual and clicks stay accurate mid-animation.
 */
const Magnetic = ({ children, radius = 60, strength = 10, className }: MagneticProps) => {
  const ref = useRef<HTMLSpanElement>(null);
  const reduceMotion = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, SPRING);
  const y = useSpring(my, SPRING);

  useEffect(() => {
    if (reduceMotion) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const onMove = (e: MouseEvent) => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      // distance outside the element's bounds
      const ox = Math.max(0, Math.abs(dx) - r.width / 2);
      const oy = Math.max(0, Math.abs(dy) - r.height / 2);
      const dist = Math.hypot(ox, oy);

      if (dist > radius) {
        mx.set(0);
        my.set(0);
        return;
      }
      const falloff = 1 - dist / radius;
      const norm = Math.max(Math.hypot(dx, dy), 1);
      mx.set(Math.max(-strength, Math.min(strength, (dx / norm) * strength * falloff)));
      my.set(Math.max(-strength, Math.min(strength, (dy / norm) * strength * falloff)));
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [mx, my, radius, reduceMotion, strength]);

  return (
    <motion.span ref={ref} className={className} style={{ x, y, display: "inline-block" }}>
      {children}
    </motion.span>
  );
};

export default Magnetic;
