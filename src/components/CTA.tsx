const CTA = () => (
  <section id="contact" className="bg-black py-20 sm:py-28 md:py-32 px-4 sm:px-8 md:px-12 flex flex-col items-center text-center w-full max-w-full overflow-hidden">
    <h2 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-medium text-gray-300 max-w-3xl leading-snug sm:leading-tight mb-8 sm:mb-12">
      Freelance projects, collaborations and full-time opportunities. Let's get acquainted
    </h2>

    <a
      id="btn-book-a-call"
      href="mailto:yashpuniwala@gmail.com"
      className="px-8 sm:px-10 py-4 sm:py-5 rounded-full border-[1.5px] border-transparent relative group overflow-hidden inline-block cursor-pointer"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-[#ff4d6d] via-[#a855f7] to-[#38bdf8] opacity-100 group-hover:scale-105 transition-transform" />
      <span className="relative font-bold text-xs sm:text-sm tracking-widest uppercase text-white">
        BOOK A CALL
      </span>
    </a>
  </section>
);

export default CTA;
