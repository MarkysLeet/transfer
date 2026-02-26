import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import clsx from "clsx";
import SmoothScroll from "@/components/SmoothScroll";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomBar } from "@/components/layout/MobileBottomBar";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "VIP Трансфер в Турции | Mercedes Benz Vito",
  description: "Премиальный трансфер в Турции. Комфорт бизнес-класса на новом Mercedes Vito. Встреча в аэропорту, поездки по городам и экскурсии.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={clsx(inter.variable, playfair.variable)}>
      <body
        className="antialiased bg-slate-900 text-slate-50 selection:bg-gold-500 selection:text-white"
      >
        <SmoothScroll>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <MobileBottomBar />
        </SmoothScroll>
      </body>
    </html>
  );
}
