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
      shouldScaleBackground={true}
      setBackgroundColorOnScale={false}
    >
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]" />

        <Drawer.Content className="fixed inset-x-0 bottom-0 z-[101] flex flex-col bg-[#F4EFEB] h-[90dvh] rounded-t-3xl shadow-2xl outline-none">
          {/* Mobile Drag Handle */}
          <div className="w-full flex justify-center pt-3 pb-1 shrink-0 sticky top-0 bg-[#F4EFEB] z-10 rounded-t-3xl cursor-grab active:cursor-grabbing">
            <div className="w-12 h-1.5 bg-slate-300 rounded-full" />
          </div>

          <div className="p-6 flex flex-col flex-1 min-h-0 pb-20 max-lg:pb-[env(safe-area-inset-bottom,24px)]">
            <BookingModalContent />
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};
