import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | NFB Salon",
  description: "Neem contact op met NFB Salon in Aerdt. Vind onze locatie, openingstijden en contactgegevens.",
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 