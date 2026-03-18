import { Hero } from "@/components/sections/Hero";
import { FeaturesShowcase } from "@/components/sections/FeaturesShowcase";
import { Destinations } from "@/components/sections/Destinations";
import { Loyalty } from "@/components/sections/Loyalty";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { TrustSection } from "@/components/sections/TrustSection";

import {setRequestLocale} from 'next-intl/server';

export default async function Home({params}: {params: Promise<{locale: string}>}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <FeaturesShowcase />
      <Destinations />
      <HowItWorks />
      <TrustSection />
      <Loyalty />
    </>
  );
}
