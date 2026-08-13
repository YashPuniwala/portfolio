import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Project } from "../data/projects";
import GithubIcon from "./icons/GithubIcon";
import { ExternalLink, X } from "lucide-react";

interface WorkProps {
  projects: Project[];
}

const LABEL_CLASS =
  "text-[clamp(0.7rem,0.6rem+0.3vw,0.85rem)] font-bold tracking-[clamp(1.5px,0.15vw,2.5px)] text-gray-400 uppercase font-mono";

/* ---------------- Detail panel (reused expand pattern) ---------------- */

const ProjectDetail = ({
  project,
  isOpen,
  id,
}: {
  project: Project | null;
  isOpen: boolean;
  id: string;
}) => (
  <div
    id={id}
    className="grid transition-[grid-template-rows,opacity] duration-[700ms] ease-out motion-reduce:transition-[opacity] motion-reduce:duration-200"
    style={{ gridTemplateRows: isOpen ? "1fr" : "0fr", opacity: isOpen ? 1 : 0 }}
  >
    <div className="overflow-hidden">
      {project && (
        <div className="grid gap-[clamp(1rem,3vw,2.5rem)] pb-[clamp(1.5rem,4vh,3rem)] pt-[clamp(1rem,3vh,2rem)] md:grid-cols-2">
          <div className="relative h-[clamp(180px,32vh,340px)] w-full overflow-hidden rounded-2xl border border-black/10 bg-black/5">
            <img
              src={project.image}
              alt={project.name}
              loading="lazy"
              className="h-full w-full object-cover object-top"
            />
          </div>

          <div>
            <span className={LABEL_CLASS}>
              {project.index} · {project.subtitle}
            </span>
            <p className="mt-3 text-[clamp(0.85rem,0.8rem+0.25vw,1rem)] leading-relaxed text-gray-600">
              {project.description}
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              {project.tech.map((techItem, idx) => (
                <span
                  key={idx}
                  className="rounded-lg border border-black/10 bg-black/5 px-2.5 py-1 text-[0.7rem] font-semibold text-gray-700"
                >
                  {techItem}
                </span>
              ))}
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              {project.live && (
                <a
                  href={project.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-full bg-gray-900 px-5 py-2.5 text-xs font-bold tracking-wide text-white transition-all hover:bg-gray-700"
                >
                  <span>LIVE DEMO</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-full border border-black/10 bg-black/5 px-5 py-2.5 text-xs font-bold tracking-wide text-gray-900 transition-all hover:bg-black/10"
                >
                  <GithubIcon />
                  <span>CODE</span>
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
);

/* ---------------- Constants ---------------- */

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
const FLEX_TRANSITION = `flex-grow 400ms ${EASE}, flex-basis 400ms ${EASE}`;

/**
 * CSS Grid template for the bento: one large area spanning 2 columns + 2 rows,
 * and two small areas stacked in the right column. Which project maps to "large"
 * vs "smallA"/"smallB" is driven by activeIndex — the grid itself guarantees
 * no two tiles can ever overlap.
 *
 *   ┌───────┬───────┐
 *   │       │ smallA│
 *   │ large  ├───────┤
 *   │       │ smallB│
 *   └───────┴───────┘
 */
const GRID_TEMPLATE = `"large smallA" "large smallB"`;
const GRID_COLS = "1fr 1fr";
const GRID_ROWS = "1fr 1fr";

/** Which grid area each project index occupies, given the active project. */
const areaForIndex = (index: number, activeIndex: number): string => {
  if (index === activeIndex) return "large";
  return index < activeIndex ? `small${index === 0 ? "A" : "B"}` : `small${index === 2 ? "B" : "A"}`;
};

/* ---------------- Bento Tile (CSS Grid + Framer Motion layout) ---------------- */

interface BentoTileProps {
  project: Project;
  isOpen: boolean;
  panelId: string;
  onToggle: () => void;
  onActivate: () => void;
  gridArea: string;
  isLarge: boolean;
  animateLayout: boolean;
  titleClass: string;
}

const BentoTile = ({
  project,
  isOpen,
  panelId,
  onToggle,
  onActivate,
  gridArea,
  isLarge,
  animateLayout,
  titleClass,
}: BentoTileProps) => (
  <motion.div
    layout={animateLayout}
    layoutId={`bento-${project.name}`}
    transition={{ duration: 0.4, ease: EASE }}
    role="button"
    tabIndex={0}
    aria-expanded={isOpen}
    aria-controls={panelId}
    onClick={onToggle}
    onKeyDown={(e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onToggle();
      }
    }}
    onMouseEnter={onActivate}
    onFocus={onActivate}
    style={{ gridArea, boxSizing: "border-box" }}
    className="group relative isolate box-border h-full min-h-0 w-full min-w-0 cursor-pointer overflow-hidden rounded-2xl bg-black/5 outline-none focus-visible:ring-2 focus-visible:ring-black/40 sm:rounded-3xl"
  >
    <img
      src={project.image}
      alt={project.name}
      loading="lazy"
      className="absolute inset-0 h-full w-full object-cover object-top"
    />
    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10" />

    <div className="pointer-events-none relative flex h-full min-h-0 min-w-0 flex-col justify-between gap-3 p-[clamp(1rem,2.5vw,1.75rem)]">
      <span
        className="block max-w-[calc(100%-2.5rem)] truncate font-mono text-[clamp(0.6rem,0.55rem+0.2vw,0.75rem)] font-bold uppercase tracking-[0.2em] text-white/70 transition-opacity duration-300"
        style={{ opacity: isLarge ? 1 : 0 }}
      >
        {project.index} · {project.subtitle}
      </span>
      <h3
        className={`min-w-0 max-w-full truncate font-black uppercase leading-[0.95] tracking-tight text-white ${titleClass}`}
      >
        {project.name}
      </h3>
    </div>

    <span
      aria-hidden="true"
      className="pointer-events-none absolute right-[clamp(1rem,2.5vw,1.75rem)] top-[clamp(1rem,2.5vw,1.75rem)] text-white/70 transition-transform duration-300"
      style={{ transform: isOpen ? "rotate(0deg)" : "rotate(45deg)" }}
    >
      <X className="h-5 w-5" />
    </span>
  </motion.div>
);

/* ---------------- Flex Tile (for "more work" section, unchanged) ---------------- */

interface FlexTileProps {
  project: Project;
  isOpen: boolean;
  panelId: string;
  onToggle: () => void;
  onActivate: () => void;
  onDeactivate: () => void;
  grow: number;
  shrunk: boolean;
  className?: string;
  titleClass: string;
  animate: boolean;
}

const FlexTile = ({
  project,
  isOpen,
  panelId,
  onToggle,
  onActivate,
  onDeactivate,
  grow,
  shrunk,
  className = "",
  titleClass,
  animate,
}: FlexTileProps) => (
  <div
    role="button"
    tabIndex={0}
    aria-expanded={isOpen}
    aria-controls={panelId}
    onClick={onToggle}
    onKeyDown={(e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onToggle();
      }
    }}
    onMouseEnter={onActivate}
    onFocus={onActivate}
    onBlur={onDeactivate}
    style={{
      flexGrow: animate ? grow : 1,
      flexShrink: 1,
      flexBasis: 0,
      boxSizing: "border-box",
      transition: animate ? FLEX_TRANSITION : undefined,
    }}
    className={`group relative isolate box-border cursor-pointer overflow-hidden rounded-2xl bg-black/5 outline-none focus-visible:ring-2 focus-visible:ring-black/40 sm:rounded-3xl ${className}`}
  >
    <img
      src={project.image}
      alt={project.name}
      loading="lazy"
      className="absolute inset-0 h-full w-full object-cover object-top"
    />
    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10" />

    <div className="pointer-events-none relative flex h-full min-w-0 flex-col justify-between gap-8 p-[clamp(1rem,2.5vw,1.75rem)]">
      <span
        className="block max-w-[calc(100%-2.5rem)] truncate font-mono text-[clamp(0.6rem,0.55rem+0.2vw,0.75rem)] font-bold uppercase tracking-[0.2em] text-white/70 transition-opacity duration-300"
        style={{ opacity: shrunk ? 0 : 1 }}
      >
        {project.index} · {project.subtitle}
      </span>
      <h3
        className={`min-w-0 max-w-full truncate font-black uppercase leading-[0.95] tracking-tight text-white ${titleClass}`}
      >
        {project.name}
      </h3>
    </div>

    <span
      aria-hidden="true"
      className="pointer-events-none absolute right-[clamp(1rem,2.5vw,1.75rem)] top-[clamp(1rem,2.5vw,1.75rem)] text-white/70 transition-transform duration-300"
      style={{ transform: isOpen ? "rotate(0deg)" : "rotate(45deg)" }}
    >
      <X className="h-5 w-5" />
    </span>
  </div>
);

/* ---------------- Section ---------------- */

const Work = ({ projects }: WorkProps) => {
  const prefersReducedMotion = useReducedMotion();
  const [useBento, setUseBento] = useState(false);
  const [active, setActive] = useState<number | null>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    const desktopMq = window.matchMedia(
      "(hover: hover) and (pointer: fine) and (min-width: 1024px)",
    );
    const sync = () => {
      setUseBento(desktopMq.matches);
      if (!desktopMq.matches) setActive(null);
    };
    sync();
    desktopMq.addEventListener("change", sync);
    return () => desktopMq.removeEventListener("change", sync);
  }, []);

  const animateLayout = useBento && !prefersReducedMotion;

  const featured = projects.slice(0, 3);
  const rest = projects.slice(3);
  const toggle = (i: number) => setOpenIndex((cur) => (cur === i ? null : i));

  const openInFeatured = openIndex !== null && openIndex < 3;
  const openInRest = openIndex !== null && openIndex >= 3;

  const activeIndex = active !== null && active < 3 ? active : 0;

  const restGrow = (i: number) =>
    active === i + 3 ? 2.4 : active !== null && active >= 3 ? 0.7 : 1;
  const restShrunk = (i: number) => animateLayout && active !== null && active !== i + 3;

  return (
    <section
      id="projects"
      className="work-wrapper relative w-full max-w-full bg-white py-[clamp(3rem,8vh,6rem)] text-black"
    >
      <div className="mx-auto w-full max-w-[1600px] px-[clamp(1rem,5vw,6rem)]">
        <header className="mb-[clamp(1.5rem,4vh,3rem)]">
          <span className={LABEL_CLASS}>SELECTED WORK</span>
          <h2 className="mt-[clamp(0.25rem,0.5vh,0.625rem)] max-w-xl text-[clamp(1.5rem,1rem+2vw,2.75rem)] font-black uppercase leading-[1.1] tracking-tight text-gray-900">
            Selected Projects &amp; Platforms
          </h2>
        </header>

        {/* Tier 1 — featured bento (CSS Grid + Framer Motion layout animation) */}
        {useBento ? (
          <div
            onMouseLeave={() => setActive(null)}
            onBlur={(e) => {
              const related = e.relatedTarget as Node | null;
              if (!related || !e.currentTarget.contains(related)) {
                setActive(null);
              }
            }}
            className="grid w-full"
            style={{
              gridTemplateAreas: GRID_TEMPLATE,
              gridTemplateColumns: GRID_COLS,
              gridTemplateRows: GRID_ROWS,
              gap: "clamp(0.75rem,1.5vw,1.5rem)",
              height: "clamp(460px, 58vh, 560px)",
            }}
          >
            {featured.map((project, i) => {
              const area = areaForIndex(i, activeIndex);
              return (
                <BentoTile
                  key={project.name}
                  project={project}
                  isOpen={openIndex === i}
                  panelId="project-detail-featured"
                  onToggle={() => toggle(i)}
                  onActivate={() => {
                    if (animateLayout) setActive(i);
                  }}
                  gridArea={area}
                  isLarge={i === activeIndex}
                  animateLayout={animateLayout}
                  titleClass={
                    i === activeIndex
                      ? "text-[clamp(1.5rem,1rem+3vw,3rem)]"
                      : "text-[clamp(1rem,0.85rem+1vw,1.5rem)]"
                  }
                />
              );
            })}
          </div>
        ) : (
          /* Mobile / tablet / reduced-motion: static stacked layout */
          <div className="flex flex-col gap-[clamp(0.75rem,1.5vw,1.5rem)]">
            {featured[0] && (
              <FlexTile
                key={featured[0].name}
                project={featured[0]}
                isOpen={openIndex === 0}
                panelId="project-detail-featured"
                onToggle={() => toggle(0)}
                onActivate={() => {}}
                onDeactivate={() => {}}
                grow={1}
                shrunk={false}
                animate={false}
                className="h-[clamp(260px,52vw,420px)]"
                titleClass="text-[clamp(1.5rem,1rem+3vw,3rem)]"
              />
            )}
            <div className="flex flex-col gap-[clamp(0.75rem,1.5vw,1.5rem)] sm:flex-row">
              {featured.slice(1).map((project, idx) => {
                const i = idx + 1;
                return (
                  <FlexTile
                    key={project.name}
                    project={project}
                    isOpen={openIndex === i}
                    panelId="project-detail-featured"
                    onToggle={() => toggle(i)}
                    onActivate={() => {}}
                    onDeactivate={() => {}}
                    grow={1}
                    shrunk={false}
                    animate={false}
                    className="h-[clamp(200px,40vw,300px)] sm:flex-1"
                    titleClass="text-[clamp(1.15rem,0.9rem+1.6vw,1.9rem)]"
                  />
                );
              })}
            </div>
          </div>
        )}

        <ProjectDetail
          id="project-detail-featured"
          isOpen={openInFeatured}
          project={openInFeatured ? projects[openIndex!]! : null}
        />

        {/* Tier 2 — more work */}
        {rest.length > 0 && (
          <>
            <div className="mb-[clamp(1rem,2.5vh,1.75rem)] mt-[clamp(2rem,6vh,4rem)] border-t border-black/10 pt-[clamp(1.25rem,3vh,2rem)]">
              <span className={LABEL_CLASS}>MORE WORK</span>
            </div>

            <div
              onMouseLeave={() => setActive(null)}
              className="flex flex-col gap-[clamp(0.75rem,1.5vw,1.5rem)] sm:flex-row sm:flex-wrap lg:flex-nowrap"
            >
              {rest.map((project, i) => (
                <FlexTile
                  key={project.name}
                  project={project}
                  isOpen={openIndex === i + 3}
                  panelId="project-detail-rest"
                  onToggle={() => toggle(i + 3)}
                  onActivate={() => animateLayout && setActive(i + 3)}
                  onDeactivate={() => setActive(null)}
                  grow={restGrow(i)}
                  shrunk={restShrunk(i)}
                  animate={animateLayout}
                  className="h-[clamp(190px,38vw,280px)] sm:min-w-[240px]"
                  titleClass="text-[clamp(1.05rem,0.9rem+1.2vw,1.6rem)]"
                />
              ))}
            </div>

            <ProjectDetail
              id="project-detail-rest"
              isOpen={openInRest}
              project={openInRest ? projects[openIndex!]! : null}
            />
          </>
        )}
      </div>
    </section>
  );
};

export default Work;
