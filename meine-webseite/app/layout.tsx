import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.sorokinschweisser.de"),
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
    url: "https://www.sorokinschweisser.de",
    siteName: "SOROKIN Mobiler Schweißservice",
    locale: "de_DE",
    type: "website",
    images: [
      {
        url: "/logo.png",
        width: 612,
        height: 408,
        alt: "SOROKIN Mobiler Schweißservice – Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SOROKIN Mobiler Schweißservice | Menden (Sauerland)",
    description: "Zertifizierter mobiler Schweißservice – WIG, MAG, E-Schweißen und mehr. Direkt zu Ihnen.",
    images: ["/logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className={`scroll-smooth ${inter.variable}`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
