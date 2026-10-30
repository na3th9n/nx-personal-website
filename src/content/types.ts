export type Experience = {
  role: string;
  company: string;
  type: "Internship" | "Full-time" | "Part-time" | "Contract";
  start: string; // "2025-01"
  end: string; // "2025-04" or "Present"
  bullets: string[];
  stack: string[];
};

export type ProjectStatus = "shipped" | "in-progress" | "archived";

export type Project = {
  title: string;
  description: string;
  year: string;
  status: ProjectStatus;
  role?: string;
  stack: string[];
  live?: string;
  source?: string;
};

export type Link = { label: string; href: string };

/** One group in the credits line, e.g. "Inspired by" → Poolsuite & SpecOS. */
export type Credit = { role: string; links: Link[] };

export type Site = {
  name: string;
  tagline: string;
  city: string; // shown in the menu bar
  timeZone: string; // IANA, drives the clock
  email: string;
  github: string;
  linkedin: string;
  resume: string;
  bio: string[];
  spec: { label: string; value: string }[];
  skills: string[];
  experience: Experience[];
  projects: Project[];
  credits: Credit[]; // bottom-right credits line
};
