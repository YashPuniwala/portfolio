import type { CSSProperties } from "react";
import Magnetic from "./Magnetic";

interface HeaderProps {
  isMenuOpen: boolean;
  onToggleMenu: () => void;
}

const Header = ({ isMenuOpen, onToggleMenu }: HeaderProps) => {
  return (
    <>
      {/* Fixed nav bar — static at every scroll position */}
      <header
        className="fixed top-0 left-0 w-full z-[300]"
        style={isMenuOpen ? ({ "--nav-ink": "var(--foreground-ink)" } as CSSProperties) : undefined}
      >
        <div className="relative px-4 py-4 sm:px-8 sm:py-6 md:px-12 md:py-8 flex justify-between items-center">
          <div className="relative flex items-center h-6">
            <span className="nav-ink text-lg sm:text-xl font-black tracking-tighter">
              YP
            </span>
          </div>

          <Magnetic radius={50} strength={9}>
            <button
              onClick={onToggleMenu}
              className="group flex flex-col gap-1.5 p-2 -mr-2 cursor-pointer focus:outline-none"
              aria-label="Toggle menu"
            >
              <div
                className={`nav-ink-bg h-[2px] w-5 sm:w-6 transition-all duration-300 ${isMenuOpen ? "rotate-45 translate-y-[7px] sm:translate-y-[8px]" : ""}`}
              />
              <div
                className={`nav-ink-bg h-[2px] w-5 sm:w-6 transition-all duration-300 ${isMenuOpen ? "opacity-0" : ""}`}
              />
              <div
                className={`nav-ink-bg h-[2px] w-5 sm:w-6 transition-all duration-300 ${isMenuOpen ? "-rotate-45 -translate-y-[7px] sm:-translate-y-[8px]" : ""}`}
              />
            </button>
          </Magnetic>
        </div>
      </header>

      {/* Full-screen nav overlay */}
      <nav
        className={`fixed inset-0 z-[200] bg-[var(--ink)] transition-all duration-500 flex items-center justify-center overflow-y-auto py-12 px-6 ${
          isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none scale-95"
        }`}
      >
        <div className="flex flex-col items-center gap-6 sm:gap-8 my-auto">
          {(["HOME", "PROJECTS", "EXPERIENCE", "TESTIMONIALS", "CONTACT"] as const).map((item) => (
            <Magnetic key={item} radius={50} strength={10}>
              <a
                href={`#${item.toLowerCase()}`}
                onClick={onToggleMenu}
                className="text-3xl sm:text-5xl md:text-6xl font-black text-muted-ink hover:text-foreground-ink transition-colors duration-300 tracking-tight"
              >
                {item}
              </a>
            </Magnetic>
          ))}
        </div>
      </nav>
    </>
  );
};

export default Header;
