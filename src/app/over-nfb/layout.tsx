import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Over NFB | NFB Salon",
  description: "Leer meer over NFB Salon, onze visie, waarden en de persoonlijke aanpak van beautybehandelingen in Aerdt.",
  keywords: ["NFB Salon", "beauty salon", "over ons", "schoonheidssalon", "Aerdt"],
  openGraph: {
    title: "Over NFB | NFB Salon",
    description: "Leer meer over NFB Salon, onze visie, waarden en de persoonlijke aanpak van beautybehandelingen in Aerdt.",
    url: "https://nfbsalon.nl/over-nfb",
    siteName: "NFB Salon",
    locale: "nl_NL",
    type: "website",
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <title>Over NFB | NFB Salon</title>
      {children}
    </>
  );
} 