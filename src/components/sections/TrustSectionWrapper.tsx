import { Reviews } from "./Reviews";
import { FAQ } from "./FAQ";
import { TrustSectionDesktop } from "./TrustSectionDesktop";

export const TrustSectionWrapper = ({ isMobile }: { isMobile: boolean }) => {
  if (isMobile) {
    return (
      <>
        <Reviews />
        <FAQ />
      </>
    );
  }
  return <TrustSectionDesktop />;
};
