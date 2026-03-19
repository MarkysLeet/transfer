import { Hero } from "@/components/sections/Hero";
import { FeaturesShowcase } from "@/components/sections/FeaturesShowcase";
import { Destinations } from "@/components/sections/Destinations";
import { Loyalty } from "@/components/sections/Loyalty";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Reviews } from "@/components/sections/Reviews";
import { FAQ } from "@/components/sections/FAQ";
import Script from "next/script";

import {setRequestLocale} from 'next-intl/server';

export default async function Home({params}: {params: Promise<{locale: string}>}) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Generate structured data for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TransportationService",
    "name": "Black Diamond Grand Transfer",
    "description": "Premium VIP transfer service in Turkey. Limitless comfort with business class vehicles including Mercedes-Benz Vito and Volkswagen Transporter.",
    "provider": {
      "@type": "LocalBusiness",
      "name": "Black Diamond Grand Transfer",
      "telephone": "+90 541 846 25 50",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "TR",
        "addressRegion": "Antalya"
      }
    },
    "areaServed": [
      {
        "@type": "City",
        "name": "Antalya"
      },
      {
        "@type": "City",
        "name": "Istanbul"
      },
      {
        "@type": "City",
        "name": "Kemer"
      },
      {
        "@type": "City",
        "name": "Belek"
      },
      {
        "@type": "City",
        "name": "Alanya"
      }
    ],
    "offers": {
      "@type": "Offer",
      "priceCurrency": "EUR",
      "priceSpecification": {
        "@type": "UnitPriceSpecification",
        "priceCurrency": "EUR",
        "minPrice": "30.00"
      }
    }
  };

  return (
    <>
      <Script
        id="schema-org-transportation"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero />
      <FeaturesShowcase />
      <Destinations />
      <HowItWorks />
      <Reviews />
      <FAQ />
      <Loyalty />
    </>
  );
}
