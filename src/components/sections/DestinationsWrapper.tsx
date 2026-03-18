import { Destinations } from "./Destinations";
import { DestinationsDesktop } from "./DestinationsDesktop";

export const DestinationsWrapper = ({ isMobile }: { isMobile: boolean }) => {
  if (isMobile) {
    return <Destinations />;
  }
  return <DestinationsDesktop />;
};
