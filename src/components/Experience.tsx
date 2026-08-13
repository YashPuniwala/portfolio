import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  useReducedMotion,
  useInView,
  animate,
  MotionValue,
} from "framer-motion";
import { experienceData, ExperienceItem, ExperienceHighlight } from "../data/experience";
import { Briefcase, Calendar, MapPin, ChevronDown, ChevronRight } from "lucide-react";

// --- PARALLAX WORDMARK SUB-COMPONENT ---
interface ParallaxWordmarkProps {
  text: string;
  scrollYProgress: MotionValue<number>;
  isMobile: boolean;
  prefersReducedMotion: boolean | null;
}

const ParallaxWordmark: React.FC<ParallaxWordmarkProps> = ({
  text,
  scrollYProgress,
  isMobile,
  prefersReducedMotion,
}) => {
  const yRange = isMobile ? ["-8%", "8%"] : ["-15%", "15%"];
  const yTransform = useTransform(scrollYProgress, [0, 1], yRange);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.5, 1], [0, 0.15, 0]);

  const y = prefersReducedMotion ? "0%" : yTransform;
  const opacity = prefersReducedMotion ? 0.1 : opacityTransform;

  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 z-0 flex items-center justify-start -left-4 sm:-left-8 pointer-events-none overflow-hidden select-none"
    >
      <motion.span
        className="font-extrabold uppercase text-transparent whitespace-nowrap tracking-tighter"
        style={{
          y,
          opacity,
          fontSize: isMobile ? "clamp(2.5rem, 10vw, 9rem)" : "clamp(4rem, 12vw, 9rem)",
          WebkitTextStroke: "1px rgba(255, 255, 255, 0.12)",
          willChange: "transform",
        }}
      >
        {text}
      </motion.span>
    </div>
  );
};

// --- COUNT-UP METRIC COMPONENT ---
interface MetricCountProps {
  value: number;
  suffix: string;
  inView: boolean;
  prefersReducedMotion: boolean | null;
}

const MetricCount: React.FC<MetricCountProps> = ({
  value,
  suffix,
  inView,
  prefersReducedMotion,
}) => {
  const [displayValue, setDisplayValue] = useState(prefersReducedMotion ? value : 0);
  const [isPulsing, setIsPulsing] = useState(false);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    if (prefersReducedMotion) {
      setDisplayValue(value);
      return undefined;
    }

    if (inView && !hasAnimatedRef.current) {
      hasAnimatedRef.current = true;
      const controls = animate(0, value, {
        duration: 1.2,
        ease: [0.16, 1, 0.3, 1],
        onUpdate: (latest) => {
          setDisplayValue(Math.round(latest));
        },
        onComplete: () => {
          setIsPulsing(true);
          setTimeout(() => setIsPulsing(false), 300);
        },
      });

      return () => controls.stop();
    }

    return undefined;
  }, [inView, value, prefersReducedMotion]);

  return (
    <motion.span
      animate={isPulsing ? { scale: [1, 1.15, 1] } : { scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="inline-block font-bold text-white underline decoration-white/30 decoration-2 underline-offset-4"
    >
      {displayValue}
      {suffix}
    </motion.span>
  );
};

// --- SINGLE EXPERIENCE CARD COMPONENT ---
interface ExperienceCardProps {
  item: ExperienceItem;
  index: number;
  isFinePointer: boolean;
  isMobile: boolean;
  prefersReducedMotion: boolean | null;
}

const ExperienceCard: React.FC<ExperienceCardProps> = ({
  item,
  index,
  isFinePointer,
  isMobile,
  prefersReducedMotion,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  // Single shared useInView for this card
  const inView = useInView(cardRef, { once: true, amount: 0.4 });

  // Scroll tracking for Parallax Wordmark
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });

  // Mouse & Pointer Motion Values (normalized [-0.5, 0.5])
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const mousePxX = useMotionValue(150);
  const mousePxY = useMotionValue(150);

  // 3D Tilt springs
  const rawRotateX = useTransform(mouseY, [-0.5, 0.5], [8, -8]);
  const rawRotateY = useTransform(mouseX, [-0.5, 0.5], [-8, 8]);
  const rotateX = useSpring(rawRotateX, { stiffness: 150, damping: 20 });
  const rotateY = useSpring(rawRotateY, { stiffness: 150, damping: 20 });

  // Spotlight mask position for border glow
  const spotlightX = useSpring(mousePxX, { stiffness: 200, damping: 25 });
  const spotlightY = useSpring(mousePxY, { stiffness: 200, damping: 25 });
  const spotlightBg = useTransform(
    [spotlightX, spotlightY],
    ([x, y]) =>
      `radial-gradient(220px circle at ${x}px ${y}px, rgba(255, 255, 255, 0.18), transparent 70%)`
  );

  // Diagonal Shine Sweep
  const shineX = useMotionValue("-150%");

  // Single shared Pointer Move Handler
  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isFinePointer || prefersReducedMotion) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      mouseX.set(x);
      mouseY.set(y);
      mousePxX.set(e.clientX - rect.left);
      mousePxY.set(e.clientY - rect.top);
    },
    [isFinePointer, prefersReducedMotion, mouseX, mouseY, mousePxX, mousePxY]
  );

  const handlePointerLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  const handlePointerEnter = useCallback(() => {
    if (!isFinePointer || prefersReducedMotion) return;
    shineX.set("-150%");
    animate(shineX, "150%", { duration: 0.7, ease: "easeInOut" });
  }, [isFinePointer, prefersReducedMotion, shineX]);

  // Company Name Text Scramble Effect
  const [scrambledCompany, setScrambledCompany] = useState(item.company);
  const scrambleHasRun = useRef(false);

  useEffect(() => {
    if (prefersReducedMotion) {
      setScrambledCompany(item.company);
      return undefined;
    }

    if (inView && !scrambleHasRun.current) {
      scrambleHasRun.current = true;
      const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*";
      const target = item.company;
      let frame = 0;
      const totalFrames = 15;

      const interval = setInterval(() => {
        frame++;
        const progress = frame / totalFrames;
        const lockedLength = Math.floor(progress * target.length);

        let result = target.slice(0, lockedLength);
        for (let i = lockedLength; i < target.length; i++) {
          result += charset[Math.floor(Math.random() * charset.length)];
        }

        setScrambledCompany(result);

        if (frame >= totalFrames) {
          setScrambledCompany(target);
          clearInterval(interval);
        }
      }, 40);

      return () => clearInterval(interval);
    }

    return undefined;
  }, [inView, item.company, prefersReducedMotion]);

  // Node icon rotation flourish
  const [isNodeHovered, setIsNodeHovered] = useState(false);

  const activeTilt = isFinePointer && !prefersReducedMotion;

  return (
    <div ref={cardRef} className="relative my-6 sm:my-10 pl-6 sm:pl-12">
      {/* Timeline Connector Line */}
      <div className="absolute left-2.5 sm:left-4 top-0 bottom-0 w-[1px] bg-gradient-to-b from-white/20 via-white/10 to-transparent" />

      {/* Timeline Floating Node (Layer 7 & 8) */}
      <motion.div
        className="absolute left-[0px] sm:left-[7px] top-6 sm:top-8 z-20 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-black border border-white/30 flex items-center justify-center cursor-pointer shadow-lg"
        animate={
          prefersReducedMotion
            ? { y: 0 }
            : { y: [0, -4, 0] }
        }
        transition={{
          duration: 3.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: index * 0.4,
        }}
        onMouseEnter={() => setIsNodeHovered(true)}
        onMouseLeave={() => setIsNodeHovered(false)}
      >
        <motion.div
          animate={
            isNodeHovered || (inView && !prefersReducedMotion)
              ? { rotate: [0, -12, 0] }
              : { rotate: 0 }
          }
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          <Briefcase className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white/80" />
        </motion.div>
      </motion.div>

      {/* Outer Card Wrapper */}
      <div className="relative overflow-hidden rounded-[20px] sm:rounded-[28px] p-[1px]">
        {/* Layer 9: Ambient Rotating Gradient Border */}
        {!prefersReducedMotion && (
          <div className="absolute inset-0 rounded-[20px] sm:rounded-[28px] overflow-hidden pointer-events-none z-0">
            <div className="rotating-border absolute inset-[-50%] rounded-[20px] sm:rounded-[28px] opacity-40" />
          </div>
        )}

        {/* Parallax Background Wordmark (Effect A) */}
        <ParallaxWordmark
          text={item.company}
          scrollYProgress={scrollYProgress}
          isMobile={isMobile}
          prefersReducedMotion={prefersReducedMotion}
        />

        {/* Foreground Card Container (Effect B & Main Content) */}
        <motion.div
          className="relative z-10 bg-[#0a0a0c]/90 backdrop-blur-md border border-white/10 rounded-[20px] sm:rounded-[28px] p-4 sm:p-8 md:p-10 text-white shadow-2xl group transition-all duration-300 hover:border-white/25 overflow-hidden"
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
          onPointerEnter={handlePointerEnter}
          {...(activeTilt ? { whileHover: { scale: 1.015 } } : {})}
          transition={{ duration: 0.2 }}
          style={{
            rotateX: activeTilt ? rotateX : 0,
            rotateY: activeTilt ? rotateY : 0,
            transformStyle: activeTilt ? "preserve-3d" : "flat",
            transformPerspective: 1000,
            willChange: "transform",
          }}
        >
          {/* Layer 2: Vertical Line-Draw Accent Bar */}
          <motion.div
            className="absolute left-0 top-6 bottom-6 w-[3px] bg-gradient-to-b from-white via-white/40 to-transparent z-10 rounded-r"
            style={{ transformOrigin: "top" }}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: inView && !prefersReducedMotion ? 1 : prefersReducedMotion ? 1 : 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />

          {/* Layer 5: Cursor-Following Border Spotlight Glow */}
          {activeTilt && (
            <motion.div
              className="absolute inset-0 pointer-events-none rounded-[28px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20"
              style={{
                background: spotlightBg,
              }}
            />
          )}

          {/* Layer 6: Diagonal Shine Sweep */}
          {activeTilt && (
            <motion.div
              className="absolute top-0 bottom-0 w-[80px] pointer-events-none z-20 opacity-60"
              style={{
                x: shineX,
                background:
                  "linear-gradient(105deg, transparent 0%, rgba(255, 255, 255, 0.15) 50%, transparent 100%)",
              }}
            />
          )}

          {/* Header Block */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-white/10 pb-6 relative z-10">
            <div>
              {/* Layer 4: Scrambled Company Name */}
              <div className="flex items-center gap-2 text-white/60 font-bold text-xs uppercase tracking-widest mb-1.5 font-mono">
                <span>{scrambledCompany}</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
                {item.role}
              </h3>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-gray-400">
              <div className="flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-full border border-white/10 text-white/80">
                <Calendar className="w-3.5 h-3.5 text-white/60" />
                <span>{item.period}</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-full border border-white/10 text-white/80">
                <MapPin className="w-3.5 h-3.5 text-white/60" />
                <span>{item.location}</span>
              </div>
            </div>
          </div>

          {/* Role Summary Description */}
          <p className="text-sm sm:text-base text-gray-300 leading-relaxed mb-6 font-medium relative z-10">
            {item.description}
          </p>

          {/* Layer 3 & Layer 1: Staggered Bullet Wipe + Count-Up Metrics */}
          <motion.ul
            className="mb-6 space-y-3 relative z-10"
            initial="hidden"
            animate={inView || prefersReducedMotion ? "visible" : "hidden"}
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.12,
                  delayChildren: 0.2,
                },
              },
            }}
          >
            {item.highlights.map((highlight: ExperienceHighlight, idx: number) => (
              <motion.li
                key={idx}
                className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-300 leading-relaxed"
                variants={{
                  hidden: prefersReducedMotion
                    ? { opacity: 1, clipPath: "none" }
                    : { opacity: 0, clipPath: "inset(0 100% 0 0)" },
                  visible: {
                    opacity: 1,
                    clipPath: "inset(0 0% 0 0)",
                    transition: { duration: 0.5, ease: "easeOut" },
                  },
                }}
              >
                <ChevronRight className="w-4 h-4 text-white/50 shrink-0 mt-0.5" />
                <div>
                  <span>{highlight.text}</span>
                  {highlight.metric && (
                    <MetricCount
                      value={highlight.metric.value}
                      suffix={highlight.metric.suffix}
                      inView={inView}
                      prefersReducedMotion={prefersReducedMotion}
                    />
                  )}
                </div>
              </motion.li>
            ))}
          </motion.ul>

          {/* Skills / Tech Stack Badges */}
          <div className="pt-4 border-t border-white/10 flex flex-wrap gap-2 relative z-10">
            {item.skills.map((skill, idx) => (
              <span
                key={idx}
                className="text-[11px] font-semibold px-3 py-1 bg-white/5 border border-white/10 text-gray-300 rounded-lg hover:border-white/30 hover:bg-white/10 transition-colors"
              >
                {skill}
              </span>
            ))}
          </div>

          {/* Layer 10: Expand-on-click Detail Panel */}
          {item.expandedDetail && (
            <div className="mt-4 pt-3 border-t border-white/5 relative z-10">
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/70 hover:text-white transition-colors cursor-pointer group/btn"
              >
                <span>{isExpanded ? "- Less detail" : "+ More detail"}</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-300 ${
                    isExpanded ? "rotate-180 text-white" : "text-white/50"
                  }`}
                />
              </button>

              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{
                  height: isExpanded ? "auto" : 0,
                  opacity: isExpanded ? 1 : 0,
                }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                style={{ overflow: "hidden" }}
              >
                <div className="mt-3 p-4 bg-white/[0.03] border border-white/10 rounded-xl text-xs sm:text-sm text-gray-300 leading-relaxed">
                  {item.expandedDetail}
                </div>
              </motion.div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

// --- MAIN EXPERIENCE SECTION ---
export default function Experience() {
  const prefersReducedMotion = useReducedMotion();
  const [isFinePointer, setIsFinePointer] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const fineQuery = window.matchMedia("(pointer: fine)");
    setIsFinePointer(fineQuery.matches);
    const handleFineChange = (e: MediaQueryListEvent) => setIsFinePointer(e.matches);
    fineQuery.addEventListener("change", handleFineChange);

    const mobileQuery = window.matchMedia("(max-width: 768px)");
    setIsMobile(mobileQuery.matches);
    const handleMobileChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mobileQuery.addEventListener("change", handleMobileChange);

    return () => {
      fineQuery.removeEventListener("change", handleFineChange);
      mobileQuery.removeEventListener("change", handleMobileChange);
    };
  }, []);

  return (
    <section id="experience" className="bg-[#0a0a0a] py-16 sm:py-24 px-4 sm:px-8 md:px-16 lg:px-24 w-full max-w-full overflow-hidden relative">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-10 sm:mb-16">
          <span className="text-xs font-bold tracking-[2px] text-white/60 uppercase font-mono">
            CAREER PATH
          </span>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-white mt-2 sm:mt-3">
            Professional Experience
          </h2>
          <p className="text-gray-400 text-xs sm:text-base mt-2 max-w-2xl font-medium leading-relaxed">
            A chronicle of my engineering roles, technological leadership, and high-impact product delivery.
          </p>
        </div>

        {/* Experience Cards List */}
        <div className="relative space-y-8 sm:space-y-10">
          {experienceData.map((item, index) => (
            <ExperienceCard
              key={item.id}
              item={item}
              index={index}
              isFinePointer={isFinePointer}
              isMobile={isMobile}
              prefersReducedMotion={prefersReducedMotion}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
