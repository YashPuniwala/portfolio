import GithubIcon from "./icons/GithubIcon";
import LinkedinIcon from "./icons/LinkedinIcon";
import InstagramIcon from "./icons/InstagramIcon";

const Footer = () => (
  <footer className="bg-black border-t border-white/10 px-5 py-10 sm:px-8 md:px-16 lg:px-24 sm:py-16 md:py-20 w-full max-w-full overflow-hidden">
    {/* Mobile layout: brand + socials up top, links in a 2-col grid */}
    <div className="flex flex-col gap-8 sm:hidden">
      <div className="flex items-center justify-between">
        <span className="text-2xl font-black text-white">YP</span>
        <div className="flex gap-5">
          <a
            href="https://linkedin.com/in/yashpuniwala"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-white transition-colors"
            aria-label="LinkedIn"
          >
            <LinkedinIcon />
          </a>
          <a
            href="https://instagram.com/yashpuniwala"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-white transition-colors"
            aria-label="Instagram"
          >
            <InstagramIcon />
          </a>
          <a
            href="https://github.com/yashpuniwala"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-white transition-colors"
            aria-label="GitHub"
          >
            <GithubIcon />
          </a>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-6 gap-y-7">
        <div>
          <span className="text-[10px] font-bold tracking-[2px] text-gray-500 uppercase block mb-3 font-mono">
            SERVICES
          </span>
          <div className="flex flex-col gap-2 text-xs font-medium text-gray-300">
            <a href="#home" className="hover:text-white transition-colors">
              Web Design
            </a>
            <a href="#home" className="hover:text-white transition-colors">
              UI/UX Design
            </a>
            <a href="#home" className="hover:text-white transition-colors">
              Web Development
            </a>
            <a href="#home" className="hover:text-white transition-colors">
              Branding
            </a>
          </div>
        </div>

        <div>
          <span className="text-[10px] font-bold tracking-[2px] text-gray-500 uppercase block mb-3 font-mono">
            CONTACT
          </span>
          <div className="flex flex-col gap-2 text-xs font-medium text-gray-300">
            <a href="mailto:yashpuniwala@gmail.com" className="hover:text-white transition-colors break-all">
              yashpuniwala@gmail.com
            </a>
            <a href="tel:+919833470391" className="hover:text-white transition-colors">
              +91 98334 70391
            </a>
          </div>
        </div>

        <div className="col-span-2">
          <span className="text-[10px] font-bold tracking-[2px] text-gray-500 uppercase block mb-3 font-mono">
            ACCESSIBILITY
          </span>
          <div className="flex flex-col gap-2 text-xs font-medium text-gray-300">
            <span>Mon–Fri 9:00–5:00 IST</span>
            <span>24/7 WhatsApp &amp; Email</span>
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-white/5">
        <span className="text-[10px] text-gray-500 uppercase tracking-widest text-center block font-mono">
          © 2025 Yash Puniwala | All rights reserved
        </span>
      </div>
    </div>

    {/* Desktop / tablet layout */}
    <div className="hidden sm:grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 md:gap-12 mb-12 sm:mb-16 md:mb-20">
      <div className="text-2xl sm:text-3xl font-black text-white">YP</div>

      <div>
        <span className="text-[10px] font-bold tracking-[2px] text-gray-500 uppercase block mb-4 sm:mb-6 font-mono">
          SERVICES
        </span>
        <div className="flex flex-col gap-2.5 sm:gap-3 text-xs sm:text-sm font-medium text-gray-300">
          <a href="#home" className="hover:text-white transition-colors">
            Web Design
          </a>
          <a href="#home" className="hover:text-white transition-colors">
            UI/UX Design
          </a>
          <a href="#home" className="hover:text-white transition-colors">
            Web Development
          </a>
          <a href="#home" className="hover:text-white transition-colors">
            Branding
          </a>
        </div>
      </div>

      <div>
        <span className="text-[10px] font-bold tracking-[2px] text-gray-500 uppercase block mb-4 sm:mb-6 font-mono">
          ACCESSIBILITY
        </span>
        <div className="flex flex-col gap-2.5 sm:gap-3 text-xs sm:text-sm font-medium text-gray-300">
          <span>Mon–Fri 9:00–5:00 IST</span>
          <span>24/7 WhatsApp &amp; Email</span>
        </div>
      </div>

      <div>
        <span className="text-[10px] font-bold tracking-[2px] text-gray-500 uppercase block mb-4 sm:mb-6 font-mono">
          CONTACT
        </span>
        <div className="flex flex-col gap-2.5 sm:gap-3 text-xs sm:text-sm font-medium text-gray-300">
          <a href="mailto:yashpuniwala@gmail.com" className="hover:text-white transition-colors break-all">
            yashpuniwala@gmail.com
          </a>
          <a href="tel:+919833470391" className="hover:text-white transition-colors">
            +91 98334 70391
          </a>
        </div>
      </div>
    </div>

    <div className="hidden sm:flex pt-6 sm:pt-8 border-t border-white/5 flex-row justify-between items-center gap-4 sm:gap-6">
      <span className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-widest text-left font-mono">
        © 2025 Yash Puniwala | All rights reserved
      </span>
      <div className="flex gap-6">
        <a
          href="https://linkedin.com/in/yashpuniwala"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-500 hover:text-white transition-colors"
          aria-label="LinkedIn"
        >
          <LinkedinIcon />
        </a>
        <a
          href="https://instagram.com/yashpuniwala"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-500 hover:text-white transition-colors"
          aria-label="Instagram"
        >
          <InstagramIcon />
        </a>
        <a
          href="https://github.com/yashpuniwala"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-500 hover:text-white transition-colors"
          aria-label="GitHub"
        >
          <GithubIcon />
        </a>
      </div>
    </div>
  </footer>
);

export default Footer;
