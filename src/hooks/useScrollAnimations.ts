import { useEffect, RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "@studio-freight/lenis";
import SplitType from "split-type";

gsap.registerPlugin(ScrollTrigger);

/**
 * Encapsulates all Lenis smooth-scroll + GSAP ScrollTrigger animations.
 * Pass the root element ref so gsap.context scopes selectors correctly.
 */
const useScrollAnimations = (rootRef: RefObject<HTMLDivElement | null>) => {
  useEffect(() => {
    // ── Lenis smooth-scroll wired into GSAP ticker ──────────────────────
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    const lenisTickerFn = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(lenisTickerFn);
    gsap.ticker.lagSmoothing(0);
    lenis.on("scroll", ScrollTrigger.update);

    // SplitType instance held outside ctx so cleanup can revert it
    let aboutText: SplitType | null = null;

    const ctx = gsap.context(() => {
      // ── Preloader ─────────────────────────────────────────────────────
      const tl = gsap.timeline();

      tl.to(".preloader-bar", {
        width: "100%",
        duration: 1.8,
        ease: "power2.inOut",
      });

      tl.to(".preloader", {
        opacity: 0,
        duration: 0.5,
        onComplete: () => {
          const preloader = document.querySelector(".preloader") as HTMLElement;
          if (preloader) preloader.style.display = "none";
        },
      });

      // Hero load-in, spotlight and scroll-docking are owned by Framer Motion
      // (see Hero.tsx + useHeroProgress) so the whole sequence shares one value.

      // ── About: white card slides up over Services (scrubbed to scroll) ──

      gsap.from(".about-panel", {
        yPercent: 100,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero-section",
          start: "bottom bottom",
          end: "bottom top",
          scrub: true,
          pin: true,
          pinSpacing: false,
        },
      });

      // ── About text: scrubbed word-by-word color reveal via timeline ────
      // Using a timeline with stagger + scrub so every word's transition
      // maps 1-to-1 with scroll position — no flicker, no early finish.
      aboutText = new SplitType(".about-text", { types: "words" });
      if (aboutText.words && aboutText.words.length) {
        const wordTl = gsap.timeline({
          scrollTrigger: {
            trigger: ".about-section",
            // Start revealing only after the card has fully settled
            start: "top 15%",
            // Finish exactly when the bottom of the text hits the center
            end: "bottom 60%",
            scrub: 0.5,
          },
        });
        wordTl.fromTo(
          aboutText.words,
          { color: "rgba(0,0,0,0.12)" },
          {
            color: "rgba(0,0,0,1)",
            ease: "none",
            stagger: {
              each: 0.08,
              from: "start",
            },
          },
        );
      }

      // ── Horizontal work scroll (all viewports, resize-safe) ───────────
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1px)", () => {
        const workWrapper = document.querySelector(".work-wrapper");
        const workCards = document.querySelector(".work-cards") as HTMLElement;

        if (workCards && workWrapper) {
          gsap.to(workCards, {
            x: () => -(workCards.scrollWidth - workWrapper.clientWidth + 96),
            ease: "none",
            scrollTrigger: {
              trigger: workWrapper,
              start: "top top",
              end: () => `+=${workCards.scrollWidth - workWrapper.clientWidth + 500}`,
              scrub: 0.8,
              pin: true,
              invalidateOnRefresh: true,
            },
          });
        }
      });

      // ── Navbar ink: flip to black while a light surface sits under it ──
      // Driven by one ScrollTrigger (no extra scroll listener, Lenis-safe).
      // Samples the painted background directly under the navbar line, so it
      // works for plain sections *and* pinned/animated card stacks.
      const NAV_LINE = 40; // px from viewport top ≈ navbar centre line
      let navTheme = "";

      const surfaceIsLight = (x: number) => {
        const header = document.querySelector("header");
        // Skip the navbar itself — it's transparent and would shadow the page.
        const hit = document
          .elementsFromPoint(x, NAV_LINE)
          .find((n) => !header || !header.contains(n));
        let node: Element | null = hit ?? null;
        while (node) {
          const bg = getComputedStyle(node).backgroundColor;
          const m = bg.match(/[\d.]+/g);
          if (m && (m.length < 4 || Number(m[3]) > 0.5)) {
            const [r = 0, g = 0, b = 0] = m.map(Number);
            return 0.299 * r + 0.587 * g + 0.114 * b > 140;
          }
          node = node.parentElement;
        }
        return false;
      };

      const updateNavTheme = () => {
        const light = surfaceIsLight(window.innerWidth / 2);
        const next = light ? "light" : "dark";
        if (next !== navTheme) {
          navTheme = next;
          document.documentElement.setAttribute("data-nav-theme", next);
        }
      };

      updateNavTheme();

      ScrollTrigger.create({
        trigger: document.documentElement,
        start: 0,
        end: "max",
        onUpdate: updateNavTheme,
        onRefresh: updateNavTheme,
      });


      // ── Marquee ───────────────────────────────────────────────────────
      gsap.to(".marquee-inner", {
        xPercent: -50,
        repeat: -1,
        duration: 20,
        ease: "linear",
      });

      // Force correct measurements after StrictMode double-invocation
      ScrollTrigger.refresh();
    }, rootRef);

    return () => {
      document.documentElement.removeAttribute("data-nav-theme");
      aboutText?.revert();
      ctx.revert();
      gsap.ticker.remove(lenisTickerFn);
      lenis.destroy();
    };
  }, []);
};

export default useScrollAnimations;
