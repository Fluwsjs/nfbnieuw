import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NFB Salon Aerdt",
  description: "NFB Salon in Aerdt",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="nl">
      <body>{children}</body>
    </html>
  );
}
