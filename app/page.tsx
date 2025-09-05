import Image from "next/image";
import TopBackground from "./components/hero/topBackground";
import Navbar from "./components/navbar";
import Sections from "./components/sections";
import Skills from "./components/skills/skills";
import ThemeToggle from "./components/themeToggle";
import { auth } from "@clerk/nextjs/server";

export default async function Home() {
    const { userId } = await auth()

  return (
    <div className="relative overflow-clip" id="home">
      <Sections />
      <Navbar userId={userId} />
      <ThemeToggle />
      <TopBackground />
      <Image
        src="/bottom_gradient_mobile.svg"
        alt="Bottom Gradient background Mobile"
        height={700}
        width={1024}
        className="absolute bottom-0 min-w-[1024px] min-h-[700px] -z-50 md:hidden"
      />
      <Image
        src="/bottom_gradient.svg"
        alt="Bottom Gradient background"
        height={936}
        width={1557}
        className="absolute -bottom-[175px] left-1/2 -translate-x-1/2 min-w-[1557px] min-h-[936px] -z-50 hidden md:block"
      />
    </div>
  );
}
