export interface Project {
  index: string;
  name: string;
  subtitle: string;
  description: string;
  tech: string[];
  image: string;
  live?: string;
  github?: string;
  bg?: string;
}

export const projects: Project[] = [
  {
    index: "01",
    name: "Streamify",
    subtitle: "Language Exchange Social Platform",
    description:
      "Full-stack language exchange social platform with JWT authentication, onboarding, friend requests, real-time 1:1 chat, and video calling. Built language-based user matching, Stream Chat/Video integration, group/community backend APIs, and theme personalization using React, TypeScript, Express, MongoDB, and Stream SDK.",
    tech: ["React", "TypeScript", "Node.js", "Express", "MongoDB", "Tailwind CSS"],
    image: "/projects/streamify.jpg",
    live: "https://streamifychatyyyy.netlify.app/",
    github: "https://github.com/YashPuniwala/streamify",
    bg: "bg-[#111827]",
  },
  {
    index: "02",
    name: "LMS Course Mern Stack",
    subtitle: "Modern Learning Management System",
    description:
      "A modern Learning Management System built with the MERN stack. Allows users to browse, enroll, and watch premium courses. Features include user authentication, course search, video playback, and Stripe payment integration. Designed with a clean UI and real-time data handling.",
    tech: ["React", "Tailwind CSS", "TypeScript", "MongoDB"],
    image: "/projects/lms.jpg",
    live: "https://lms-course-manage.netlify.app/",
    github: "https://github.com/YashPuniwala/LMS",
    bg: "bg-[#18181b]",
  },
  {
    index: "03",
    name: "Archi-Touch",
    subtitle: "Interior Design Studio Website",
    description:
      "Advanced animated website for interior design services using Framer Motion. Fully responsive with smooth transitions and interactive elements to showcase design portfolio.",
    tech: ["React", "Framer Motion", "Tailwind CSS"],
    image: "/projects/architouch.jpg",
    live: "https://archi-touch-one.vercel.app/",
    github: "https://github.com/YashPuniwala/archi-touch",
    bg: "bg-[#1e1b4b]",
  },
  {
    index: "04",
    name: "Served",
    subtitle: "AI-Powered Recipe Platform",
    description:
      "AI-powered full-stack recipe platform that scans pantry images using Google Gemini AI to detect ingredients and generate personalized recipes instantly. Features include AI recipe search, cuisine/category browsing, favorites collections, PDF recipe exports, Clerk authentication, subscription tiers, and secure production-ready architecture using Next.js, Strapi CMS, Neon PostgreSQL, and Arcjet.",
    tech: ["React", "Node.js", "Express", "MongoDB", "Tailwind CSS"],
    image: "/projects/served.jpg",
    github: "https://github.com/YashPuniwala/ai-recipe-platform",
    bg: "bg-[#064e3b]",
  },
];

export default projects;
