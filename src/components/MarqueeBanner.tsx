import React from "react";

const WORDS = ["DESIGN", "INSPIRE", "CREATE"];

const MarqueeBanner = () => (
  <section className="bg-black py-16 overflow-hidden border-y border-white/10 w-full max-w-full">
    <div className="marquee-inner flex whitespace-nowrap">
      {[...Array(10)].map((_, i) => (
        <div key={i} className="flex items-center gap-8 px-4">
          {WORDS.map((word) => (
            <React.Fragment key={word}>
              <span className="text-5xl md:text-7xl font-black uppercase">{word}</span>
              <span className="text-3xl">✳</span>
            </React.Fragment>
          ))}
        </div>
      ))}
    </div>
  </section>
);

export default MarqueeBanner;
