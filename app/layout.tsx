import type { Metadata } from "next";
import localFont from "next/font/local";
import { Providers } from "@/components/providers";
import "./globals.css";

const outfit = localFont({
  src: "../fonts/outfit-latin.woff2",
  variable: "--font-outfit",
  weight: "300 700",
  display: "swap",
});

const playfair = localFont({
  src: [
    { path: "../fonts/playfair-latin.woff2", weight: "400 700", style: "normal" },
    { path: "../fonts/playfair-latin-italic.woff2", weight: "400 700", style: "italic" },
  ],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Chá de Catarina",
  description: "Convite, confirmação de presença e lista de presentes do chá da Catarina.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body className={`${outfit.variable} ${playfair.variable} bg-surface font-body-md text-body-md text-on-surface antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
