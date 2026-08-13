export interface Service {
  id: string;
  title: string;
  desc: string;
  bg: string;
  text: string;
  yOffset?: number;
}

const services: Service[] = [
  {
    id: "01",
    title: "Web Design & UI/UX",
    desc: "Crafting modern, user-focused websites with clean layouts, thoughtful typography, and smooth interactions. Every design is tailored to deliver both aesthetic appeal and seamless usability.",
    bg: "bg-[#0a0a0a]",
    text: "text-white",
  },
  {
    id: "02",
    title: "Shopify Development",
    desc: "From custom themes to advanced features, I design and build Shopify stores that boost sales and reflect your brand. Optimized for performance, easy management, and smooth shopping experiences.",
    bg: "bg-[#eaeaea]",
    text: "text-black",
  },
  {
    id: "03",
    title: "Creative Branding",
    desc: "Building strong brand identities through design, storytelling, and visuals that connect with your audience. From logos to full brand systems, I help create a consistent and memorable presence.",
    bg: "bg-white",
    text: "text-black",
  },
];

export default services;
