import type { Site } from "./types";

export const site: Site = {
  name: "Nathan Xie",
  tagline: "Software engineer. Mechatronics grad. Builds things end to end.",
  city: "Toronto",
  timeZone: "America/Toronto",
  email: "TODO",
  github: "TODO",
  linkedin: "TODO",
  resume: "/resume.pdf",
  bio: [
    "TODO: 2–3 sentences on what you build and what you're looking for next.",
  ],
  spec: [
    {
      label: "Education",
      value: "BASc Mechatronics Engineering, University of Waterloo",
    },
    {
      label: "Focus",
      value: "Frontend-heavy full-stack, data pipelines, internal tools",
    },
    { label: "Previously", value: "Software Engineer Intern, StackAdapt" },
    { label: "Based in", value: "Toronto, ON" },
  ],
  skills: [
    "TypeScript",
    "React",
    "Node.js",
    "GraphQL",
    "Python",
    "Ruby on Rails",
  ],
  experience: [
    {
      role: "Software Engineer Intern",
      company: "StackAdapt",
      type: "Internship",
      start: "TODO",
      end: "TODO",
      bullets: [
        "Built an end-to-end full-stack analytics dashboard. TODO: impact / numbers.",
      ],
      stack: ["React", "GraphQL", "TypeScript", "Ruby on Rails"],
    },
    // TODO: other roles
  ],
  projects: [
    // TODO: keep only projects that are real and linkable today
    {
      title: "NATHAN.OS",
      description:
        "A brutalist desktop-OS portfolio with draggable windows, built frontend-only and deployed on Vercel.",
      year: "2026",
      status: "shipped",
      role: "Solo",
      stack: ["Next.js", "TypeScript", "Tailwind", "Motion"],
      source: "https://github.com/na3th9n/nx-personal-website",
    },
    {
      title: "SQLite Clone",
      description:
        "A database built from scratch to learn storage engines and query execution.",
      year: "2026",
      status: "in-progress",
      stack: ["TODO"],
    },
    {
      title: "Job Tracker",
      description:
        "Tracks applications and auto-detects applied/rejected status from email.",
      year: "2026",
      status: "in-progress",
      stack: ["TODO"],
    },
    {
      title: "Social Media App",
      description: "TODO",
      year: "2026",
      status: "in-progress",
      stack: ["Go", "TODO"],
    },
  ],
  credits: [
    {
      role: "Inspired by",
      links: [
        { label: "Poolsuite", href: "https://poolsuite.net" },
        {
          label: "SpecOS",
          href: "https://superdesign.dev/library/specos-brutalist-monochrome",
        },
      ],
    },
    {
      role: "Icons",
      links: [{ label: "Pixelarticons", href: "https://pixelarticons.com" }],
    },
  ],
};
