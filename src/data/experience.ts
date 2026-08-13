export interface ExperienceHighlight {
  text: string;
  metric?: {
    value: number;
    suffix: string;
    prefix?: string;
  };
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  period: string;
  location: string;
  description: string;
  highlights: ExperienceHighlight[];
  skills: string[];
  expandedDetail?: string;
}

export const experienceData: ExperienceItem[] = [
  {
    id: "exp-1",
    role: "Senior Full-Stack Engineer",
    company: "VERCEL",
    period: "2024 — PRESENT",
    location: "Remote",
    description: "Architecting high-performance edge web infrastructure, AI-powered developer interfaces, and real-time design system pipelines.",
    highlights: [
      {
        text: "Engineered serverless stream processing reducing latency by ",
        metric: { value: 35, suffix: "%" }
      },
      {
        text: "Led design system migration across ",
        metric: { value: 12, suffix: " core workflows" }
      },
      {
        text: "Mentored junior developers and established modern CI/CD standards"
      }
    ],
    skills: ["React", "TypeScript", "Next.js", "Node.js", "Tailwind CSS", "GraphQL"],
    expandedDetail: "Architected edge middleware functions using Next.js App Router and WebAssembly, handling over 10M daily requests with 99.99% uptime. Reduced global bundle overhead by optimizing tree-shaking algorithms."
  },
  {
    id: "exp-2",
    role: "Lead Frontend Developer",
    company: "STRIPE",
    period: "2022 — 2024",
    location: "San Francisco, CA",
    description: "Spearheaded interactive payment dashboard UI components, financial analytics visualizers, and conversion-focused checkout flows.",
    highlights: [
      {
        text: "Built custom WebGL chart visualizers processing over ",
        metric: { value: 100, suffix: "k+ data points" }
      },
      {
        text: "Improved mobile checkout completion rate by ",
        metric: { value: 18, suffix: "%" }
      },
      {
        text: "Created accessible UI component library used by ",
        metric: { value: 50, suffix: "+ internal developers" }
      }
    ],
    skills: ["TypeScript", "React", "Framer Motion", "GSAP", "Tailwind CSS", "REST API"],
    expandedDetail: "Engineered high-throughput financial telemetry widgets with Web Workers and Canvas API. Ensured full WCAG 2.1 AA compliance across all consumer checkout flows."
  },
  {
    id: "exp-3",
    role: "Full-Stack Software Engineer",
    company: "FREELANCE",
    period: "2020 — 2022",
    location: "Global",
    description: "Delivered bespoke Web applications, SaaS platforms, and interactive portfolio experiences for tech startups and agency clients.",
    highlights: [
      {
        text: "Designed and launched ",
        metric: { value: 15, suffix: "+ full-stack web platforms" }
      },
      {
        text: "Integrated secure authentication, payment processing, and database layer"
      },
      {
        text: "Achieved ideal performance scores across client sites: ",
        metric: { value: 100, suffix: "/100 Lighthouse" }
      }
    ],
    skills: ["React", "Node.js", "Express", "PostgreSQL", "MongoDB", "Docker"],
    expandedDetail: "Collaborated directly with founders to define technical specifications, database architecture, and deployment strategies on AWS and Vercel with automated CI/CD pipelines."
  }
];
