import { Hero } from "@/components/sections/Hero";
import { FeaturesShowcase } from "@/components/sections/FeaturesShowcase";
import { DestinationsWrapper } from "@/components/sections/DestinationsWrapper";
import { Loyalty } from "@/components/sections/Loyalty";
import { HowItWorksWrapper } from "@/components/sections/HowItWorksWrapper";
import { TrustSectionWrapper } from "@/components/sections/TrustSectionWrapper";
import { getIsMobile } from "@/lib/device";

import {setRequestLocale} from 'next-intl/server';

export default async function Home({params}: {params: Promise<{locale: string}>}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isMobile = await getIsMobile();

  return (
    <>
      <Hero />
      <FeaturesShowcase />
      <DestinationsWrapper isMobile={isMobile} />
      <HowItWorksWrapper isMobile={isMobile} />
      <TrustSectionWrapper isMobile={isMobile} />
      <Loyalty />
    </>
  );
}
