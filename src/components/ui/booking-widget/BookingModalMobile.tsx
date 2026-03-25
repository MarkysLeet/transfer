"use client";

import { Drawer } from "vaul";
import { useBookingStore } from "@/store/useBookingStore";
import { BookingModalContent } from "./BookingModalContent";

export const BookingModalMobile = () => {
  const { isOpen, setIsOpen } = useBookingStore();

  return (
    <Drawer.Root
      open={isOpen}
      onOpenChange={setIsOpen}
      shouldScaleBackground={false}
      setBackgroundColorOnScale={false}
    >
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]" />

        <Drawer.Content className="fixed inset-x-0 bottom-0 z-[101] flex flex-col bg-[#F4EFEB] mt-24 h-[90vh] rounded-t-3xl shadow-2xl outline-none" aria-describedby={undefined}>
          <Drawer.Title className="sr-only">Booking Modal</Drawer.Title>
          <Drawer.Description className="sr-only">Make a transfer booking here.</Drawer.Description>
          {/* Mobile Drag Handle */}
          <div className="w-full flex justify-center pt-3 pb-1 shrink-0 sticky top-0 bg-[#F4EFEB] z-10 rounded-t-3xl cursor-grab active:cursor-grabbing">
            <div className="w-12 h-1.5 bg-slate-300 rounded-full" />
          </div>

          <div className="flex flex-col flex-1 overflow-hidden">
            <BookingModalContent />
          </div>

          {/* Root for mobile full-screen overlays like Combobox */}
          <div id="mobile-overlay-root" />
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};
