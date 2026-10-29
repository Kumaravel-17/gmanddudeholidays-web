import type { Metadata } from "next";
import { Geist_Mono, Montserrat, Playfair_Display } from "next/font/google";
import Motion from "./components/Motion";
import "./globals.css";

// Luxury pairing: Playfair Display for headings, Montserrat for body text.
const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GM & Dude Holidays | Tourist Bus Booking",
  description:
    "Book AC sleeper, seater, tempo traveller and luxury coach buses with GM & Dude Holidays for family trips, pilgrimages, college tours and group holidays.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      // The inline script below adds the "motion" class before React hydrates.
      suppressHydrationWarning
      className={`${playfair.variable} ${montserrat.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/* Turn on scroll animations before first paint, unless the visitor prefers reduced motion */}
        <script
          dangerouslySetInnerHTML={{
            __html: `if(!matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.classList.add("motion")`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <Motion />
        {children}
      </body>
    </html>
  );
}
