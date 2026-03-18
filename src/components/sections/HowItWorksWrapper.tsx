import { HowItWorks } from "./HowItWorks";
import { HowItWorksDesktop } from "./HowItWorksDesktop";

export const HowItWorksWrapper = ({ isMobile }: { isMobile: boolean }) => {
  if (isMobile) {
    return <HowItWorks />;
  }
  return <HowItWorksDesktop />;
};
