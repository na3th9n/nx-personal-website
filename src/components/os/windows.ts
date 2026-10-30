import type { ComponentType, SVGProps } from "react";
import { Briefcase, Folder, Mail, User } from "./icons";

export type WindowId = "about" | "experience" | "projects" | "contact";

export type WindowDef = {
  id: WindowId;
  title: string; // window title and taskbar label
  shortcut: string; // keyboard key that toggles it
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
};

/** Taskbar order. Four windows, no more (see PLAN.md). */
export const WINDOWS: WindowDef[] = [
  { id: "about", title: "About", shortcut: "A", Icon: User },
  { id: "experience", title: "Experience", shortcut: "E", Icon: Briefcase },
  { id: "projects", title: "Projects", shortcut: "P", Icon: Folder },
  { id: "contact", title: "Contact", shortcut: "C", Icon: Mail },
];
