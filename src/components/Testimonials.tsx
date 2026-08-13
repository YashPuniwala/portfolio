import React from "react";

interface Testimonial {
  id: string;
  quote: string;
  author: string;
}

const initialsOf = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join("");

const rowOne: Testimonial[] = [
  {
    id: "1",
    quote:
      "Yash transformed our vision for Streamify into a high-performance, real-time communication platform. His technical depth in WebSocket architecture and obsession with UI fluid mechanics resulted in a product our users love.",
    author: "Alexandre Vance",
  },
  {
    id: "2",
    quote:
      "Working with Yash was an exercise in absolute precision. He engineered our Learning Management System ahead of schedule, seamlessly handling complex Stripe billing, video delivery pipelines, and responsive micro-interactions.",
    author: "Dr. Sarah Jenkins",
  },
  {
    id: "3",
    quote:
      "As a design-first studio, our standards for motion and spatial rhythm are uncompromising. Yash captured our aesthetic language flawlessly, building an experience that feels like a digital gallery.",
    author: "Marcus Thorne",
  },
];

const rowTwo: Testimonial[] = [
  {
    id: "4",
    quote:
      "Yash's ability to bridge generative AI models with intuitive, responsive web interfaces is rare. He turned complex multi-modal image processing into an instantaneous, delight-filled user flow.",
    author: "Elena Rostova",
  },
  {
    id: "5",
    quote:
      "He rebuilt our checkout from the ground up and conversion climbed within the first week. Clear communication, thoughtful trade-offs, and code our team could actually maintain afterwards.",
    author: "Priya Nair",
  },
  {
    id: "6",
    quote:
      "What stood out was the attention to the small things — loading states, empty states, keyboard flows. The product simply feels finished in a way most agencies never deliver.",
    author: "Daniel Okafor",
  },
];

const Card: React.FC<{ item: Testimonial }> = ({ item }) => (
  <figure className="w-[320px] shrink-0 rounded-2xl border border-white/[0.08] bg-[#141414] p-6 sm:w-[460px] sm:rounded-[18px] md:w-[540px]">
    <blockquote className="text-[15px] leading-relaxed text-white/85 sm:text-lg sm:leading-relaxed">
      &ldquo;{item.quote}&rdquo;
    </blockquote>
    <figcaption className="mt-5 flex items-center gap-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 font-mono text-xs font-bold tracking-wider text-white/70">
        {initialsOf(item.author)}
      </span>
      <span className="text-sm font-semibold text-white/90">{item.author}</span>
    </figcaption>
  </figure>
);

const Row: React.FC<{ items: Testimonial[]; direction: "left" | "right"; duration: string }> = ({
  items,
  direction,
  duration,
}) => (
  <div className="marquee group relative overflow-hidden">
    <div
      className="marquee-track flex w-max gap-5 group-hover:[animation-play-state:paused]"
      style={{
        animationName:
          direction === "left" ? "testimonial-scroll-left" : "testimonial-scroll-right",
        animationDuration: duration,
      }}
    >
      {[...items, ...items].map((item, i) => (
        <Card key={`${item.id}-${i}`} item={item} />
      ))}
    </div>
  </div>
);

export default function Testimonials() {
  return (
    <section
      id="testimonials"
      className="relative w-full max-w-full overflow-hidden border-t border-white/10 bg-[#0a0a0a] py-16 text-white sm:py-24"
    >
      <style>{`
        @keyframes testimonial-scroll-left {
          from { transform: translateX(0); }
          to { transform: translateX(calc(-50% - 10px)); }
        }
        @keyframes testimonial-scroll-right {
          from { transform: translateX(calc(-50% - 10px)); }
          to { transform: translateX(0); }
        }
        .marquee-track {
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .marquee { overflow: visible; }
          .marquee-track {
            animation: none !important;
            width: 100%;
            flex-wrap: wrap;
            justify-content: center;
            row-gap: 1.25rem;
          }
        }
      `}</style>

      <div className="mx-auto mb-8 max-w-6xl px-4 text-center sm:mb-10 sm:px-8">
        <span className="font-mono text-[10px] font-bold uppercase tracking-[3px] text-white/40 sm:text-xs">
          Testimonials
        </span>
        <h2 className="mt-2 text-xl font-black uppercase tracking-tight text-white sm:text-4xl md:text-5xl">
          Client Voices
        </h2>
        <p className="mt-4 hidden text-xs text-white/40 sm:block">Hover a row to pause it</p>
      </div>

      <div className="flex flex-col gap-4 sm:gap-5">
        <Row items={rowOne} direction="left" duration="24s" />
        <Row items={rowTwo} direction="right" duration="30s" />
      </div>
    </section>
  );
}
