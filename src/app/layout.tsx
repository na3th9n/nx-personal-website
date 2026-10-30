import type { Metadata, Viewport } from "next";
import {
  IBM_Plex_Mono,
  IBM_Plex_Sans,
  IBM_Plex_Sans_Condensed,
  IBM_Plex_Serif,
} from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { MotionProviders } from "@/components/os/MotionProviders";
import { site } from "@/content/site";
import "./globals.css";

const plexSans = IBM_Plex_Sans({
  variable: "--font-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const plexCondensed = IBM_Plex_Sans_Condensed({
  variable: "--font-plex-condensed",
  subsets: ["latin"],
  weight: ["600", "700"],
});

const plexSerif = IBM_Plex_Serif({
  variable: "--font-plex-serif",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: `NATHAN.OS · ${site.name}`,
  description: site.tagline,
};

export const viewport: Viewport = {
  themeColor: "#f4f4f2",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${plexSans.variable} ${plexCondensed.variable} ${plexSerif.variable} ${plexMono.variable}`}
    >
      <body>
        <MotionProviders>{children}</MotionProviders>
        <Analytics />
      </body>
    </html>
  );
}
