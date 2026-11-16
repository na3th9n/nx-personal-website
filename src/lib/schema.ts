// Shape of content.yaml. Kept free of Next/Node imports so
// scripts/generate-schema.ts can turn it into content.schema.json.
import { z } from "zod";

const text = z.string().trim().min(1);
const optionalText = text.optional();
const url = text;
// `stack:` with nothing after it parses as null; treat that as "no pills".
const stack = z
  .array(z.union([text, z.number()]).transform(String))
  .nullish()
  .transform((v) => v ?? []);

const link = z.object({ label: text, url });

const photo = z.object({
  file: text,
  alt: text,
  caption: z.string().nullish(),
  focus: optionalText,
});

const job = z.object({
  dates: text,
  title: text,
  company: text,
  company_url: url.optional(),
  summary: optionalText,
  stack,
});

const school = z.object({
  dates: z.union([text, z.number()]).transform(String),
  title: text,
  school: text,
  summary: optionalText,
});

const project = z.object({
  year: z.union([text, z.number()]).transform(String),
  title: text,
  summary: optionalText,
  stack,
  status: z.enum(["shipped", "in progress", "archived"]).optional(),
  live: url.optional(),
  live_label: optionalText,
  source: url.optional(),
  source_label: optionalText,
});

const hex = z
  .string()
  .regex(/^#[0-9a-fA-F]{3,8}$/, "must be a hex colour like #1A7F37");

const nameFont = z.object({
  font: text,
  weight: z.number().int().min(100).max(900).default(400),
  italic: z.boolean().default(false),
  tracking: z.number().default(0),
});

export const contentSchema = z.object({
  site: z.object({ name: text, subtitle: text, description: text }),
  sidebar: z.object({
    monogram: text,
    links: z
      .array(link)
      .nullish()
      .transform((v) => v ?? []),
  }),
  intro: z
    .array(text)
    .nullish()
    .transform((v) => v ?? []),
  email: z.email(),
  email_note: z.string().nullish(),
  photos: z
    .array(photo)
    .nullish()
    .transform((v) => v ?? []),
  experience: z
    .array(job)
    .nullish()
    .transform((v) => v ?? []),
  education: z
    .array(school)
    .nullish()
    .transform((v) => v ?? []),
  projects: z
    .array(project)
    .nullish()
    .transform((v) => v ?? []),
  labels: z.object({
    nav_about: text,
    nav_experience: text,
    nav_projects: text,
    experience_heading: text,
    education_heading: text,
    projects_heading: text,
    email_prefix: text,
    live_link: text,
    source_link: text,
    theme_dark: text,
    theme_light: text,
    not_found_title: text,
    not_found_link: text,
    skip_to_content: text,
    main_nav: text,
    collapse_sidebar: text,
    expand_sidebar: text,
    switch_to_dark: text,
    switch_to_light: text,
    photos: text,
    previous_photo: text,
    next_photo: text,
    photo_position: text,
  }),
  cursor_trail: z.object({
    enabled: z.boolean(),
    pixel_size: z.number().int().min(2).max(64),
    fade_ms: z.number().int().min(50).max(5000),
    spacing: z.number().int().min(1).max(20).default(1),
    max_pixels: z.number().int().min(1).max(200).default(60),
    click_explosion: z.boolean(),
    explosion_pixels: z.number().int().min(1).max(100),
    colors_light: z.array(hex).min(1),
    colors_dark: z.array(hex).min(1),
  }),
  name_fonts: z.object({
    enabled: z.boolean(),
    hold_seconds: z.number().min(0),
    type_ms: z.number().int().min(10),
    delete_ms: z.number().int().min(10),
    cursor: z.enum(["block", "bar"]),
    size: z.number().min(16).max(200),
    fonts: z.array(nameFont).min(1),
  }),
});

export type Content = z.output<typeof contentSchema>;
