import type { Metadata } from "next";
import Link from "next/link";
import { content } from "@/lib/content";

const { labels } = content;

export const metadata: Metadata = { title: labels.not_found_title };

export default function NotFound() {
  return (
    <div className="not-found">
      <h1 className="page-title">{labels.not_found_title}</h1>
      <Link href="/">{labels.not_found_link}</Link>
    </div>
  );
}
