import type { ComponentType, SVGProps } from "react";
import { Briefcase, Folder, Mail, User } from "./icons";

export type WindowId = "about" | "experience" | "projects" | "contact";

export type WindowDef = {
  id: WindowId;
  title: string; // window title and taskbar label
  shortcut: string; // keyboard key that toggles it
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  width: number;
  height?: number; // omitted: grows with its content
};

/** Taskbar order. Four windows, no more (see PLAN.md). */
export const WINDOWS: WindowDef[] = [
  { id: "about", title: "About", shortcut: "A", Icon: User, width: 600 },
  {
    id: "experience",
    title: "Experience",
    shortcut: "E",
    Icon: Briefcase,
    width: 620,
    height: 560,
  },
  {
    id: "projects",
    title: "Projects",
    shortcut: "P",
    Icon: Folder,
    width: 640,
    height: 480,
  },
  { id: "contact", title: "Contact", shortcut: "C", Icon: Mail, width: 440 },
];

export const isWindowId = (value: string): value is WindowId =>
  WINDOWS.some((win) => win.id === value);
