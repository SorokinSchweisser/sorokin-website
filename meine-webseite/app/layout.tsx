import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SOROKIN Mobiler Schweißservice | WIG · MAG · E-Schweißen | Menden",
  description:
    "Mobiler Schweißservice in Menden (Sauerland). Zertifiziert nach DIN EN ISO 9606. WIG, MAG, E-Schweißen, Instandsetzung, Industrie- und Reparaturschweißen. Direkt zu Ihnen vor Ort. ☎ 01511 4459165",
  keywords: [
    "Schweißservice Menden",
    "mobiler Schweißer Sauerland",
    "WIG Schweißen",
    "MAG Schweißen",
    "Instandsetzung Schweißen",
    "DIN EN ISO 9606",
    "Konstantin Sorokin",
  ],
  openGraph: {
    title: "SOROKIN Mobiler Schweißservice | Menden (Sauerland)",
    description: "Zertifizierter mobiler Schweißservice – WIG, MAG, E-Schweißen und mehr. Direkt zu Ihnen.",
    locale: "de_DE",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
