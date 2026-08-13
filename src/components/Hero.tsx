import { motion, useReducedMotion } from "framer-motion";

interface HeroProps {
  onScrollToContact: () => void;
}

const Hero = ({ onScrollToContact }: HeroProps) => {
  const reduceMotion = useReducedMotion();
  const still = Boolean(reduceMotion);

  const panelTransition = { duration: 0.85, ease: [0.65, 0, 0.35, 1] as const };

  return (
    <section
      id="home"
      className="hero-section relative min-h-screen w-full max-w-full overflow-hidden bg-[var(--ink)] flex items-center justify-center px-[clamp(1.25rem,5vw,6rem)]"
    >
      {/* Subtle centered vignette */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_45%,rgba(255,255,255,0.07)_0%,transparent_70%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.85)_100%)]"
      />

      {/* Centered content */}
      <div className="relative z-10 flex flex-col items-center text-center">
        <motion.h1
          initial={still ? { opacity: 0 } : { opacity: 0, y: 12 }}
          animate={still ? { opacity: 1 } : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: still ? 0 : 0.72, ease: [0.22, 1, 0.36, 1] }}
          className="m-0 font-black uppercase leading-[0.92] tracking-[-0.03em] text-foreground-ink text-[clamp(2.5rem,9vw,7.5rem)]"
        >
          Yash Puniwala
        </motion.h1>

        <motion.p
          initial={still ? { opacity: 0 } : { opacity: 0, y: 10 }}
          animate={still ? { opacity: 1 } : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: still ? 0 : 0.82, ease: [0.22, 1, 0.36, 1] }}
          className="mt-[clamp(1rem,2vh,1.75rem)] font-light uppercase text-muted-ink tracking-[clamp(3px,0.5vw,8px)] text-[clamp(0.75rem,0.6rem+0.8vw,1.35rem)]"
        >
          Web Developer &amp; Designer
        </motion.p>

        <motion.p
          initial={still ? { opacity: 0 } : { opacity: 0, y: 8 }}
          animate={still ? { opacity: 1 } : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: still ? 0 : 0.92, ease: [0.22, 1, 0.36, 1] }}
          className="mt-[clamp(1.25rem,3vh,2.25rem)] text-muted-ink/70 tracking-[0.14em] uppercase text-[clamp(0.65rem,0.6rem+0.2vw,0.8rem)]"
        >
          Based in India · Open to work
        </motion.p>

        <motion.button
          onClick={onScrollToContact}
          initial={still ? { opacity: 0 } : { opacity: 0, y: 8 }}
          animate={still ? { opacity: 1 } : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: still ? 0 : 1.02, ease: [0.22, 1, 0.36, 1] }}
          className="mt-[clamp(2rem,5vh,3rem)] rounded-full border border-hairline px-[clamp(1.5rem,3vw,2.5rem)] py-[clamp(0.7rem,1.2vw,1rem)] font-medium uppercase tracking-[0.22em] text-[clamp(0.7rem,0.6rem+0.2vw,0.8rem)] text-foreground-ink transition-colors duration-300 hover:bg-white/10 cursor-pointer"
        >
          Let&apos;s Talk
        </motion.button>
      </div>

      {/* Panel reveal (once per page load) */}
      {!still && (
        <>
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 w-1/2 z-20 bg-[var(--ink)]"
            initial={{ x: 0 }}
            animate={{ x: "-100%" }}
            transition={panelTransition}
          />
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 w-1/2 z-20 bg-[var(--ink)]"
            initial={{ x: 0 }}
            animate={{ x: "100%" }}
            transition={panelTransition}
          />
        </>
      )}
    </section>
  );
};

export default Hero;
