import { useRef, useState } from "react";
import useScrollAnimations from "@/hooks/useScrollAnimations";
import services from "@/data/services";
import projects from "@/data/projects";
import Preloader from "./Preloader";
import Header from "./Header";
import Hero from "./Hero";
import About from "./About";
import Services from "./Services";
import Work from "./Work";
import Experience from "./Experience";
import Testimonials from "./Testimonials";
import MarqueeBanner from "./MarqueeBanner";
import CTA from "./CTA";
import Footer from "./Footer";

export default function Portfolio() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);

  useScrollAnimations(mainRef);


  const scrollToContact = () => {
    document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      ref={mainRef}
      className="bg-[var(--ink)] text-foreground-ink selection:bg-purple-500 selection:text-white min-h-screen w-full max-w-full overflow-x-hidden"
    >
      <Preloader />
      <Header isMenuOpen={isMenuOpen} onToggleMenu={() => setIsMenuOpen((prev) => !prev)} />
      <Hero onScrollToContact={scrollToContact} />
      <About />
      <Services servicesList={services} />
      <Work projects={projects} />
      <Experience />
      <Testimonials />
      <MarqueeBanner />
      <CTA />
      <Footer />
    </div>
  );
}
