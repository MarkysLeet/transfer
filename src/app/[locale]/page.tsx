import { Hero } from "@/components/sections/Hero";
import { FeaturesShowcase } from "@/components/sections/FeaturesShowcase";
import { Destinations } from "@/components/sections/Destinations";
import { Loyalty } from "@/components/sections/Loyalty";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Reviews } from "@/components/sections/Reviews";
import { FAQ } from "@/components/sections/FAQ";

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
      <Reviews />
      <FAQ />
      <Loyalty />
    </>
  );
}
