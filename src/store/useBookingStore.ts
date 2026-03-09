import { create } from 'zustand';

interface BookingStore {
  roundTrip: boolean;
  childSeat: boolean;
  minibar: boolean;
  setRoundTrip: (value: boolean) => void;
  setChildSeat: (value: boolean) => void;
  setMinibar: (value: boolean) => void;
  toggleChildSeat: () => void;
  toggleMinibar: () => void;
}

export const useBookingStore = create<BookingStore>((set) => ({
  roundTrip: false,
  childSeat: false,
  minibar: false,
  setRoundTrip: (value) => set({ roundTrip: value }),
  setChildSeat: (value) => set({ childSeat: value }),
  setMinibar: (value) => set({ minibar: value }),
  toggleChildSeat: () => set((state) => ({ childSeat: !state.childSeat })),
  toggleMinibar: () => set((state) => ({ minibar: !state.minibar })),
}));
