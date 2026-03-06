import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../../globals.css";
import {NextIntlClientProvider} from 'next-intl';
import {getMessages, setRequestLocale} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';
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

export const metadata: Metadata = {
  title: "VIP Трансфер в Турции | Mercedes Benz Vito",
  description: "Премиальный трансфер в Турции. Комфорт бизнес-класса на новом Mercedes Vito. Встреча в аэропорту, поездки по городам и экскурсии.",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  const isValidLocale = routing.locales.includes(locale as 'en' | 'ru' | 'tr' | 'de');
  if (!isValidLocale) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html lang={locale} className={clsx(inter.variable)}>
      <body
        className="antialiased bg-[#FAFAFA] text-slate-900 selection:bg-bronze-500 selection:text-white relative min-h-screen"
      >
        {/* Global Soft Background */}
        <div
          className="fixed inset-0 z-[-1] pointer-events-none bg-[#FAFAFA]"
          aria-hidden="true"
        />

        <NextIntlClientProvider messages={messages}>
          <SmoothScroll>
            <Header />
            <main className="min-h-screen relative z-0">{children}</main>
            <Footer />
            <MobileBottomBar />
          </SmoothScroll>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
