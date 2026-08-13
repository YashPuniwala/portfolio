import { useCallback, useEffect, useRef, useState } from "react";
import { Service } from "../data/services";

interface ServicesProps {
  servicesList: Service[];
}

type Tone = { bg: string; fg: string; muted: string };

/** Alternating dark / light tone pairs from the design reference. */
const TONES: Tone[] = [
  { bg: "#0a0a0d", fg: "#f4f4f5", muted: "#9a9aa0" },
  { bg: "#e9e8e4", fg: "#141414", muted: "#5a5a55" },
  { bg: "#141414", fg: "#f4f4f5", muted: "#9a9aa0" },
];

const toneFor = (i: number): Tone => TONES[i % TONES.length] as Tone;

const EASE = "cubic-bezier(0.76, 0, 0.24, 1)";
const DURATION = 780;

const Services = ({ servicesList }: ServicesProps) => {
  const total = servicesList.length;
  const sectionRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);

  const [index, setIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState<number | null>(null);
  const [dir, setDir] = useState<1 | -1>(1);
  const [entrance, setEntrance] = useState(0); // 0 → 1 scroll-tied entrance
  const [pin, setPin] = useState<"before" | "pinned" | "after">("before");
  const [reduced, setReduced] = useState(false);

  const locked = useRef(false);
  const indexRef = useRef(0);
  indexRef.current = index;

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const goTo = useCallback(
    (next: number, force = false) => {
      const clamped = Math.max(0, Math.min(total - 1, next));
      if (clamped === indexRef.current) return;
      if (locked.current && !force) return;
      locked.current = true;
      setDir(clamped > indexRef.current ? 1 : -1);
      setPrevIndex(indexRef.current);
      setIndex(clamped);
      window.setTimeout(() => {
        locked.current = false;
        setPrevIndex(null);
      }, DURATION + 40);
    },
    [total],
  );

  // ── Scroll-driven slide advancement + scroll-tied entrance ───────────
  useEffect(() => {
    if (reduced) return;
    let raf = 0;

    const update = () => {
      raf = 0;
      const section = sectionRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;

      // Entrance: 0 while section bottom is a viewport away, 1 once it's docked.
      const e = 1 - Math.min(1, Math.max(0, rect.top / (vh * 0.6)));
      setEntrance(e);

      // Manual pinning: an ancestor uses overflow-x:hidden, which breaks
      // position:sticky, so the panel is fixed only while in range.
      if (rect.top > 0) setPin("before");
      else if (rect.bottom < vh) setPin("after");
      else setPin("pinned");

      // Pinned progress: sticky child is docked while rect.top <= 0.
      const scrollable = section.offsetHeight - vh;
      if (scrollable <= 0) return;
      const progress = Math.min(1, Math.max(0, -rect.top / scrollable));
      const target = Math.min(total - 1, Math.floor(progress * total));
      if (target !== indexRef.current && !locked.current) goTo(target);
    };

    const onScroll = () => {
      if (!raf) raf = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (raf) window.cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [goTo, reduced, total]);

  /** Keep the pinned scroll position in sync when navigation is manual. */
  const syncScrollTo = useCallback(
    (target: number) => {
      if (reduced) return;
      const section = sectionRef.current;
      if (!section) return;
      const vh = window.innerHeight;
      const scrollable = section.offsetHeight - vh;
      if (scrollable <= 0) return;
      const top = section.offsetTop + ((target + 0.5) / total) * scrollable;
      window.scrollTo({ top, behavior: "auto" });
    },
    [reduced, total],
  );

  const navigate = useCallback(
    (target: number) => {
      if (locked.current) return;
      const clamped = Math.max(0, Math.min(total - 1, target));
      if (clamped === indexRef.current) return;
      goTo(clamped);
      syncScrollTo(clamped);
    },
    [goTo, syncScrollTo, total],
  );

  // ── Touch swipe ──────────────────────────────────────────────────────
  useEffect(() => {
    const el = stickyRef.current;
    if (!el) return;
    let startX = 0;
    let startY = 0;
    const onStart = (ev: TouchEvent) => {
      const t = ev.touches[0];
      if (!t) return;
      startX = t.clientX;
      startY = t.clientY;
    };
    const onEnd = (ev: TouchEvent) => {
      const t = ev.changedTouches[0];
      if (!t) return;
      const dx = t.clientX - startX;
      const dy = t.clientY - startY;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
        navigate(indexRef.current + (dx < 0 ? 1 : -1));
      }
    };
    el.addEventListener("touchstart", onStart, { passive: true });
    el.addEventListener("touchend", onEnd, { passive: true });
    return () => {
      el.removeEventListener("touchstart", onStart);
      el.removeEventListener("touchend", onEnd);
    };
  }, [navigate]);

  const activeTone = toneFor(index);

  // ── Reduced motion: static stacked list ──────────────────────────────
  if (reduced) {
    return (
      <section id="services" ref={sectionRef} className="w-full max-w-full">
        {servicesList.map((service, i) => {
          const tone = toneFor(i);
          return (
            <div
              key={service.id}
              className="w-full px-6 py-20 sm:px-10 md:px-16 md:py-28"
              style={{ backgroundColor: tone.bg, color: tone.fg }}
            >
              <p
                className="font-mono text-xs tracking-[0.2em]"
                style={{ color: tone.muted }}
              >
                {service.id} / {String(total).padStart(2, "0")}
              </p>
              <h2 className="mt-6 max-w-[16ch] text-4xl font-bold leading-[0.95] tracking-tight sm:text-6xl md:text-7xl">
                {service.title}
              </h2>
              <p
                className="mt-6 max-w-[52ch] text-base leading-relaxed sm:text-lg"
                style={{ color: tone.muted }}
              >
                {service.desc}
              </p>
            </div>
          );
        })}
      </section>
    );
  }

  return (
    <section
      id="services"
      ref={sectionRef}
      className="relative w-full max-w-full"
      style={{ height: `calc(${total * 100}vh + 40vh)` }}
    >
      <div
        ref={stickyRef}
        className={`h-screen w-full overflow-hidden ${
          pin === "pinned"
            ? "fixed inset-x-0 top-0"
            : pin === "after"
              ? "absolute inset-x-0 bottom-0"
              : "absolute inset-x-0 top-0"
        }`}
        style={{
          backgroundColor: activeTone.bg,
          transition: `background-color ${DURATION}ms ${EASE}`,
          opacity: 0.4 + entrance * 0.6,
          transform: `scale(${0.97 + entrance * 0.03})`,
          transformOrigin: "center top",
          willChange: "transform, opacity, background-color",
        }}
      >
        {servicesList.map((service, i) => {
          const tone = toneFor(i);
          const isActive = i === index;
          const isLeaving = i === prevIndex;
          if (!isActive && !isLeaving) return null;

          const content = (
            <>
              <p
                className="font-mono text-xs tracking-[0.2em] sm:text-sm"
                style={{ color: tone.muted }}
              >
                {service.id} / {String(total).padStart(2, "0")}
              </p>
              <h2 className="mt-5 max-w-[14ch] text-[2.5rem] font-bold leading-[0.92] tracking-tight sm:text-6xl md:text-[5.5rem] lg:text-[6.5rem]">
                {service.title}
              </h2>
              <p
                className="mt-6 max-w-[46ch] text-base leading-relaxed sm:text-lg"
                style={{ color: tone.muted }}
              >
                {service.desc}
              </p>
            </>
          );

          // ── Outgoing panel: splits vertically from the centre ─────────
          // Two identical halves, each clipped to one side of the centre
          // line, glide apart to uncover the incoming panel beneath.
          if (isLeaving) {
            return (
              <div
                key={service.id}
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{ zIndex: 2 }}
              >
                {(["left", "right"] as const).map((side) => (
                  <div
                    key={side}
                    className="absolute inset-0 flex h-full w-full flex-col justify-center px-6 sm:px-10 md:px-16"
                    style={{
                      backgroundColor: tone.bg,
                      color: tone.fg,
                      clipPath:
                        side === "left"
                          ? "inset(0 50% 0 0)"
                          : "inset(0 0 0 50%)",
                      animation: `service-split-${side} ${DURATION}ms ${EASE} both`,
                      willChange: "transform",
                    }}
                  >
                    {content}
                  </div>
                ))}
                {/* Hairline seam that fades as the halves part */}
                <div
                  className="absolute inset-y-0 left-1/2 w-px"
                  style={{
                    backgroundColor: tone.muted,
                    opacity: 0.35,
                    animation: `service-seam ${DURATION}ms ${EASE} both`,
                  }}
                />
              </div>
            );
          }

          // ── Incoming panel: revealed underneath, settles with a slow
          // scale + staggered content rise for an editorial feel ────────
          return (
            <article
              key={service.id}
              className="absolute inset-0 flex h-full w-full flex-col justify-center overflow-hidden px-6 sm:px-10 md:px-16"
              style={{
                backgroundColor: tone.bg,
                color: tone.fg,
                zIndex: 1,
                animation:
                  prevIndex !== null
                    ? `service-settle ${DURATION + 240}ms ${EASE} both`
                    : undefined,
                willChange: "transform",
              }}
            >
              <div
                style={{
                  animation:
                    prevIndex !== null
                      ? `service-rise ${DURATION}ms ${EASE} ${Math.round(DURATION * 0.3)}ms both`
                      : undefined,
                }}
              >
                {content}
              </div>
            </article>
          );
        })}


        {/* Dots — right edge on desktop, bottom-center on mobile */}
        <div className="pointer-events-auto absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-row items-center gap-3 md:bottom-auto md:left-auto md:right-8 md:top-1/2 md:-translate-x-0 md:-translate-y-1/2 md:flex-col">
          {servicesList.map((service, i) => (
            <button
              key={service.id}
              type="button"
              aria-label={`Go to ${service.title}`}
              aria-current={i === index}
              onClick={() => navigate(i)}
              className="h-2.5 w-2.5 rounded-full transition-opacity duration-300"
              style={{
                backgroundColor: activeTone.fg,
                opacity: i === index ? 1 : 0.3,
              }}
            />
          ))}
        </div>

        {/* Prev / next arrows */}
        <div className="absolute bottom-8 right-6 z-10 flex items-center gap-3 md:bottom-10 md:right-8">
          <button
            type="button"
            aria-label="Previous service"
            onClick={() => navigate(index - 1)}
            disabled={index === 0}
            className="flex h-10 w-10 items-center justify-center rounded-full border text-sm transition-opacity duration-300 disabled:opacity-25"
            style={{ borderColor: activeTone.muted, color: activeTone.fg }}
          >
            &#8592;
          </button>
          <button
            type="button"
            aria-label="Next service"
            onClick={() => navigate(index + 1)}
            disabled={index === total - 1}
            className="flex h-10 w-10 items-center justify-center rounded-full border text-sm transition-opacity duration-300 disabled:opacity-25"
            style={{ borderColor: activeTone.muted, color: activeTone.fg }}
          >
            &#8594;
          </button>
        </div>
      </div>

      <style>{`
        @keyframes service-split-left {
          from { transform: translate3d(0, 0, 0); }
          to { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes service-split-right {
          from { transform: translate3d(0, 0, 0); }
          to { transform: translate3d(100%, 0, 0); }
        }
        @keyframes service-seam {
          0% { opacity: 0.35; transform: scaleY(1); }
          40% { opacity: 0.2; }
          100% { opacity: 0; transform: scaleY(0.9); }
        }
        @keyframes service-settle {
          from { transform: scale(1.06); }
          to { transform: scale(1); }
        }
        @keyframes service-rise {
          from { opacity: 0; transform: translate3d(0, 18px, 0); }
          to { opacity: 1; transform: translate3d(0, 0, 0); }
        }
      `}</style>

    </section>
  );
};

export default Services;
