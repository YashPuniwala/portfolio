import { useEffect, RefObject, MutableRefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Service } from "../data/services";

gsap.registerPlugin(ScrollTrigger);

// ── Timeline phase durations (in timeline units) ──────────────────────────
const HOLD_BETWEEN_ENTRIES = 0.15;
const HOLD_AFTER_STACK = 0.25;

/**
 * Services stacking animation.
 *
 * Choreography for 3 cards (generalizes to N):
 * 1. Card 1 visible at y = 0.
 * 2. Scroll → Card 2 enters to stopY[1].
 * 3. Scroll → Card 3 enters to stackedY[2] while Cards 1 & 2 move slightly
 *    to stackedY[0] and stackedY[1] to make room.
 * 4. All 3 cards remain fully visible in the viewport frame.
 * 5. Scroll a bit further → pin releases and stack scrolls away naturally.
 *
 * Per-card `yOffset` (from service data) shifts a card's computed y up/down
 * consistently across ALL animation phases, so there are no abrupt jumps.
 */
const useServicesAnimation = (
  containerRef: RefObject<HTMLDivElement | null>,
  cardEls: MutableRefObject<HTMLDivElement[]>,
  headerEls: MutableRefObject<HTMLDivElement[]>,
  servicesList: Service[],
) => {
  useEffect(() => {
    const container = containerRef.current;
    const cards = cardEls.current;
    const headers = headerEls.current;

    if (!container || cards.length < 2) return;

    const n = cards.length;
    const numIncoming = n - 1;

    // Per-card pixel offsets (from service data). Applied additively to y.
    const yOffsets = servicesList.map((s) => s.yOffset ?? 0);

    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    const holdBetween = isMobile ? 0.05 : HOLD_BETWEEN_ENTRIES;
    const holdAfter = isMobile ? 0.1 : HOLD_AFTER_STACK;

    // Total scroll distance = total timeline duration × one viewport.
    const totalDuration =
      numIncoming + holdBetween * Math.max(0, numIncoming - 1) + holdAfter;

    const getH = (i: number): number => headers[i]?.offsetHeight ?? 160;

    const getOffset2 = (): number => {
      const vh = window.innerHeight;
      const h12 = getH(0) + getH(1);
      return Math.max(30, (vh - h12) / 2);
    };

    const getOffset3 = (): number => {
      const vh = window.innerHeight;
      let totalH = 0;
      for (let i = 0; i < cards.length; i++) {
        totalH += getH(i);
      }
      const raw = (vh - totalH) / 2;
      return Math.max(10, Math.min(60, raw));
    };

    // getPos2 / getPos3 add the per-card yOffset so GSAP always positions
    // the card at the visually-correct y without any CSS margin tricks.
    const getPos2 = (cardIndex: number): number => {
      let y = getOffset2();
      for (let i = 0; i < cardIndex; i++) {
        y += getH(i);
      }
      return y + (yOffsets[cardIndex] ?? 0);
    };

    const getPos3 = (cardIndex: number): number => {
      let y = getOffset3();
      for (let i = 0; i < cardIndex; i++) {
        y += getH(i);
      }
      return y + (yOffsets[cardIndex] ?? 0);
    };

    const ctx = gsap.context(() => {
      // ── Initial positioning ──────────────────────────────────────────
      cards.forEach((card, i) => {
        gsap.set(card, {
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100vh",
          zIndex: i + 1,
          y: i === 0 ? () => getPos2(0) : () => window.innerHeight,
        });
      });

      // ── Master timeline (one ScrollTrigger, scrubbed) ─────────────────
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: () => `+=${window.innerHeight * totalDuration}`,
          pin: true,
          pinSpacing: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onRefreshInit() {
            cards.forEach((card, i) => {
              gsap.set(card, { y: i === 0 ? getPos2(0) : window.innerHeight });
            });
          },
        },
      });

      // ── Build timeline phase by phase ─────────────────────────────────
      let pos = 0;

      for (let i = 1; i < n; i++) {
        const isLast = i === n - 1;

        if (i > 1) {
          tl.to({}, { duration: holdBetween }, pos);
          pos += holdBetween;
        }

        if (isLast && n > 2) {
          // Final card entry (Card 3): push Cards 1 & 2 up to getPos3, slide Card 3 to getPos3(2)
          tl.fromTo(
            cards[i]!,
            { y: () => window.innerHeight },
            { y: () => getPos3(i), ease: "none", duration: 1 },
            pos,
          );
          for (let j = 0; j < i; j++) {
            tl.fromTo(
              cards[j]!,
              { y: () => getPos2(j) },
              { y: () => getPos3(j), ease: "none", duration: 1 },
              pos,
            );
          }
        } else {
          // Intermediate card entry (Card 2)
          tl.fromTo(
            cards[i]!,
            { y: () => window.innerHeight },
            { y: () => getPos2(i), ease: "none", duration: 1 },
            pos,
          );
        }

        pos += 1;
      }

      // ── Hold completed stack ──────────────────────────────────────────
      tl.to({}, { duration: holdAfter }, pos);
      pos += holdAfter;
    }, container);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

export default useServicesAnimation;
