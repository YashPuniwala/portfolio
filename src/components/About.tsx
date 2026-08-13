import { motion } from "framer-motion";

const About = () => (
  <section
    id="about"
    className="about-section relative w-full max-w-full overflow-hidden"
    style={{ background: "#ffffff" }}
  >
    {/* White card — starts translated off-screen; GSAP slides it up via scroll */}
    <div
      className="about-panel"
      style={{
        borderRadius: "2rem 2rem 0 0",
        background: "#ffffff",
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        paddingTop: "clamp(7rem, 14vh, 9rem)",
        paddingBottom: "5rem",
        paddingLeft: "clamp(1.25rem, 6vw, 6rem)",
        paddingRight: "clamp(1.25rem, 6vw, 6rem)",
      }}
    >
      <div className="grid w-full max-w-[100rem] grid-cols-1 items-center gap-[clamp(2rem,5vw,4.5rem)] lg:grid-cols-[minmax(0,38fr)_minmax(0,62fr)]">
        {/* Portrait — moved here out of the hero */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto w-full max-w-[24rem] lg:max-w-none"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-[-8%] -z-10 opacity-30 blur-[70px]"
            style={{
              background:
                "radial-gradient(circle at 50% 45%, var(--accent-2) 0%, var(--accent-1) 42%, var(--accent-3) 72%, transparent 80%)",
            }}
          />
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] shadow-[0_40px_80px_-40px_rgba(0,0,0,0.5)]">
            <img
              src="/hero%20yash.png"
              alt="Portrait of Yash Puniwala, web developer and designer"
              loading="lazy"
              className="h-full w-full object-cover"
              style={{ filter: "grayscale(0.15) contrast(1.08)" }}
            />
          </div>
        </motion.div>

        <div>
          <div className="mb-3 inline-block text-[clamp(0.7rem,0.62rem+0.3vw,0.85rem)] font-bold uppercase tracking-[0.25em] text-black/45">
            About
          </div>
          <div className="mb-[clamp(1.5rem,3vh,2.5rem)] h-[2px] w-[clamp(3rem,6vw,7rem)] bg-[image:var(--gradient-accent)]" />
          <p
            className="about-text"
            style={{
              fontSize: "clamp(1.05rem, 2.4vw, 1.9rem)",
              lineHeight: 1.7,
              maxWidth: "60ch",
              fontWeight: 600,
              letterSpacing: "-0.01em",
              margin: 0,
              color: "rgba(0,0,0,0.12)",
            }}
          >
            My approach combines clean design, smooth interactions, and thoughtful details to ensure
            every project feels both visually striking and highly functional. Whether it&apos;s
            designing a portfolio, building a business website, or shaping a brand&apos;s online
            presence, I focus on creating work that not only looks good but also connects with
            people in a meaningful way.
          </p>
        </div>
      </div>
    </div>
  </section>
);

export default About;
