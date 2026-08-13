import { createFileRoute } from "@tanstack/react-router";
import Portfolio from "@/components/Portfolio";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Yash Puniwala — Web Developer & Designer" },
      {
        name: "description",
        content:
          "Full stack developer portfolio: web apps built with React, Next.js and Node — selected projects, services and experience.",
      },
      { property: "og:title", content: "Yash Puniwala — Web Developer & Designer" },
      {
        property: "og:description",
        content:
          "Full stack developer portfolio: web apps built with React, Next.js and Node — selected projects, services and experience.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return <Portfolio />;
}
