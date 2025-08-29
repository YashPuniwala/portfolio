"use client";

import React, { useCallback, useEffect, useState } from "react";
import cn from "classnames";
import Reveal from "./reveal";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    setActiveSection("home");
  }, []);

  const scrollToSection = useCallback((sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, []);

  return (
    <div className="fixed top-12 right-6 mx-auto flex flex-col gap-2.5 items-end z-50 md:right-auto md:left-1/2 md:-translate-x-1/2">
      {/* Mobile menu button */}
      <button
        className="bg-background card-shadow p-3 md:hidden rounded"
        onClick={() => setIsOpen((prevVal) => !prevVal)}
      >
        <img
          className="block dark:hidden"
          src="/menu_icon_light.svg"
          alt="menu icon"
        />
        <img
          className="hidden dark:block"
          src="/menu_icon_dark.svg"
          alt="menu icon"
        />
      </button>

      <Reveal initialY={-20} duration={0.5}>
        <nav
          className={cn(
            "bg-background card-shadow p-3 rounded md:block duration-300 ease-in-out",
            {
              "opacity-100": isOpen,
              "opacity-0 md:opacity-100": !isOpen,
            }
          )}
        >
          <ul className="flex flex-col items-center gap-4 text-lg font-normal md:flex-row">
            {/* nav links */}
            {[
              "home",
              "skills",
              "projects",
              "testimonials",
              "experience",
              "contact",
            ].map((id) => (
              <li key={id}>
                <div
                  className={cn("rounded p-1 duration-300 ease-in-out", {
                    "bg-primary text-white": activeSection === id,
                  })}
                  onClick={() => {
                    setActiveSection(id);
                    scrollToSection(id);
                  }}
                >
                  {id.charAt(0).toUpperCase() + id.slice(1)}
                </div>
              </li>
            ))}

            <li className="block md:hidden mt-1 w-full">
              <SignedOut>
                <div className="flex flex-col gap-2 w-full items-center">
                  <a
                    href="/sign-in"
                    className="w-full text-center px-3 py-1.5 text-sm rounded-lg font-medium 
                    bg-primary text-white shadow-sm 
                    hover:bg-primary/90 transition 
                  dark:bg-white dark:text-black dark:hover:bg-gray-200"
                  >
                    Sign In
                  </a>
                  <a
                    href="/sign-up"
                    className="w-full text-center px-3 py-1.5 text-sm rounded-lg font-medium 
                    bg-primary text-white shadow-sm 
                    hover:bg-primary/90 transition 
                  dark:bg-white dark:text-black dark:hover:bg-gray-200"
                  >
                    Sign Up
                  </a>
                </div>
              </SignedOut>
              <SignedIn>
                <div className="flex justify-center w-full">
                  <UserButton />
                </div>
              </SignedIn>
            </li>
          </ul>
        </nav>
      </Reveal>
    </div>
  );
};

export default Navbar;
