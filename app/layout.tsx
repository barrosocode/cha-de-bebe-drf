import type { Metadata } from "next";
import { Outfit, Playfair_Display } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["300", "400", "500", "600", "700"],
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700"],
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
