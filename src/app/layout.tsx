import type { Metadata, Viewport } from "next";
import { Inter, Newsreader } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { CursorTrail } from "@/components/CursorTrail";
import { Sidebar } from "@/components/Sidebar";
import { ThemeProvider } from "@/components/ThemeProvider";
import { content, nameFontsHref } from "@/lib/content";
import { externalProps } from "@/lib/inline";
import "./globals.css";

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  axes: ["opsz"],
  style: ["normal", "italic"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const { site, labels, sidebar } = content;
const hasNameFonts = content.name_fonts.enabled && nameFontsHref() !== null;

export const metadata: Metadata = {
  title: { default: site.name, template: `%s · ${site.name}` },
  description: site.description,
  openGraph: {
    type: "website",
    title: site.name,
    description: site.description,
    siteName: site.name,
  },
  twitter: { card: "summary", title: site.name, description: site.description },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAFAF8" },
    { media: "(prefers-color-scheme: dark)", color: "#121211" },
  ],
};

// Runs before first paint so a returning visitor's collapsed sidebar never jumps.
const sidebarScript = `try{if(localStorage.getItem("sidebar-collapsed")==="1")document.documentElement.setAttribute("data-sidebar","collapsed")}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${newsreader.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: sidebarScript }} />
        {hasNameFonts && (
          <>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
          </>
        )}
      </head>
      <body>
        <ThemeProvider>
          <a href="#content" className="skip-link">
            {labels.skip_to_content}
          </a>
          <div className="shell">
            <Sidebar
              monogram={sidebar.monogram}
              nav={[
                { href: "/", label: labels.nav_about },
                { href: "/projects", label: labels.nav_projects },
                { href: "/experience", label: labels.nav_experience },
              ]}
              links={sidebar.links}
              labels={{
                mainNav: labels.main_nav,
                collapse: labels.collapse_sidebar,
                expand: labels.expand_sidebar,
                dark: labels.theme_dark,
                light: labels.theme_light,
                toDark: labels.switch_to_dark,
                toLight: labels.switch_to_light,
              }}
            />
            <main id="content" className="main" tabIndex={-1}>
              {children}
              {sidebar.links.length > 0 && (
                <footer className="mobile-footer">
                  {sidebar.links.map((l) => (
                    <a key={l.url} href={l.url} {...externalProps(l.url)}>
                      {l.label} ↗
                    </a>
                  ))}
                </footer>
              )}
            </main>
          </div>
          <CursorTrail config={content.cursor_trail} />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
