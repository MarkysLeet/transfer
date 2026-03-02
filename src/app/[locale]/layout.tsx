import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import clsx from "clsx";
import SmoothScroll from "@/components/SmoothScroll";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
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

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html lang={locale} className={clsx(inter.variable, playfair.variable)}>
      <body
        className="antialiased bg-slate-900 text-slate-50 selection:bg-gold-500 selection:text-white"
      >
        <NextIntlClientProvider messages={messages}>
          <SmoothScroll>
            <Header />
            <main className="min-h-screen">{children}</main>
            <Footer />
            <MobileBottomBar />
          </SmoothScroll>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
