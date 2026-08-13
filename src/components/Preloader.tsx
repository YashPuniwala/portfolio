const Preloader = () => (
  <div className="preloader fixed inset-0 z-[9999] bg-[#0a0a0a] flex flex-col items-start justify-center px-10 md:px-20">
    <div className="text-2xl font-black mb-4">YP</div>
    <div className="w-[130px] h-[2px] bg-white/10 relative overflow-hidden">
      <div className="preloader-bar absolute top-0 left-0 h-full w-0 bg-gradient-to-r from-[#ff4d6d] via-[#a855f7] to-[#38bdf8]" />
    </div>
  </div>
);

export default Preloader;
