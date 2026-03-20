import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Over Ons | NFB Salon",
  description: "Maak kennis met het team van NFB Salon in Amsterdam. Een passie voor schoonheid, kwaliteit en persoonlijke aandacht.",
};

export default function OverOnsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <meta name="description" content="Maak kennis met NFB Salon, een beauty salon met een passie voor schoonheid en persoonlijke aandacht. Ontdek onze geschiedenis, visie en ons toegewijde team." />
      <meta name="keywords" content="NFB Salon, beauty salon, schoonheidssalon, team, missie, visie, nagelstyling, wimpers, gezichtsbehandelingen" />
      <title>Over Ons | NFB Salon</title>
      {children}
    </>
  );
} 