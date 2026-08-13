import { Service } from "../data/services";

interface ServiceCardProps {
  key?: string;
  service: Service;
  cardRef: (el: HTMLDivElement | null) => void;
  headerRef: (el: HTMLDivElement | null) => void;
}

/**
 * Pure layout component. No animation logic lives here.
 *
 * The card is always 100vh tall. GSAP translates it on the Y axis only.
 * The `headerRef` div is measured by the animation hook to determine
 * how much of this card remains visible once the next card slides over it.
 */
const ServiceCard = ({ service, cardRef, headerRef }: ServiceCardProps) => (
  <div
    ref={cardRef}
    className={`${service.bg} w-full`}
    style={{
      height: "100vh",
      willChange: "transform",
      backfaceVisibility: "hidden",
    }}
  >
    {/* ── Header ────────────────────────────────────────────────────────
        Everything inside this div is the "reveal strip" — the portion
        that stays visible above the incoming card.
        Its measured offsetHeight drives the animation stop position.
    ────────────────────────────────────────────────────────────────── */}
    <div
      ref={headerRef}
      className={`${service.text} px-5 sm:px-8 md:px-12 lg:px-20 py-5 sm:py-8 md:py-10 lg:py-12 min-h-[140px] sm:min-h-[170px] md:min-h-[200px] lg:min-h-[220px]`}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-4 md:gap-12 lg:gap-16 items-start">
        {/* Left column: service number beside title, baseline-aligned */}
        <div className="flex flex-row items-baseline gap-2.5 sm:gap-4 md:gap-6">
          <span className="text-xs font-semibold tracking-[0.2em] opacity-40 font-mono">
            {service.id}
          </span>
          <h2 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-black uppercase leading-[1] sm:leading-[0.95] tracking-tight">
            {service.title}
          </h2>
        </div>

        {/* Right column: description */}
        <div className="mt-1 md:mt-0">
          <p className="text-xs sm:text-sm md:text-base font-medium leading-relaxed opacity-85 max-w-[42ch]">
            {service.desc}
          </p>
        </div>
      </div>
    </div>

    {/* ── Body ─────────────────────────────────────────────────────────
        Empty space that fills the rest of the card. Gets hidden under
        the next incoming card. Nothing interactive lives here.
    ────────────────────────────────────────────────────────────────── */}
  </div>
);

export default ServiceCard;