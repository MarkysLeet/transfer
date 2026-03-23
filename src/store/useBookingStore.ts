import { create } from 'zustand';

export type CarClassType = 'vw' | 'vito';
export type PaymentMethodType = 'cash' | 'card' | 'crypto';

interface Passengers {
  adults: number;
  children: number;
  infants: number;
}

interface Coords {
  lat: number;
  lng: number;
}

interface BookingStore {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;

  step: number;
  setStep: (value: number) => void;

  roundTrip: boolean;
  setRoundTrip: (value: boolean) => void;

  from: string;
  setFrom: (value: string) => void;
  fromPlaceId: string;
  setFromPlaceId: (value: string) => void;

  to: string;
  setTo: (value: string) => void;
  toPlaceId: string;
  setToPlaceId: (value: string) => void;

  coords: Coords | null;
  setCoords: (coords: Coords | null) => void;

  date: string;
  setDate: (value: string) => void;
  time: string;
  setTime: (value: string) => void;

  returnDate: string;
  setReturnDate: (value: string) => void;
  returnTime: string;
  setReturnTime: (value: string) => void;

  passengers: Passengers;
  setPassengers: (passengers: Passengers) => void;
  updatePassengers: (key: keyof Passengers, value: number) => void;

  selectedClass: CarClassType;
  setSelectedClass: (value: CarClassType) => void;

  childSeat: number;
  setChildSeat: (value: number) => void;

  minibar: boolean;
  setMinibar: (value: boolean) => void;
  toggleMinibar: () => void;

  englishDriver: boolean;
  setEnglishDriver: (value: boolean) => void;
  toggleEnglishDriver: () => void;

  name: string;
  setName: (value: string) => void;

  phone: string;
  setPhone: (value: string) => void;

  paymentMethod: PaymentMethodType;
  setPaymentMethod: (value: PaymentMethodType) => void;

  estimatedPrice: number | null;
  setEstimatedPrice: (value: number | null) => void;

  resetBooking: () => void;
}

const initialState = {
  isOpen: false,
  step: 1,
  roundTrip: false,
  from: '',
  fromPlaceId: '',
  to: '',
  toPlaceId: '',
  coords: null,
  date: '',
  time: '',
  returnDate: '',
  returnTime: '',
  passengers: { adults: 1, children: 0, infants: 0 },
  selectedClass: 'vito' as CarClassType,
  childSeat: 0,
  minibar: false,
  englishDriver: false,
  name: '',
  phone: '',
  paymentMethod: 'cash' as PaymentMethodType,
  estimatedPrice: null,
};

export const useBookingStore = create<BookingStore>((set) => ({
  ...initialState,

  setIsOpen: (value) => set({ isOpen: value }),
  setStep: (value) => set({ step: value }),
  setRoundTrip: (value) => set({ roundTrip: value }),

  setFrom: (value) => set({ from: value }),
  setFromPlaceId: (value) => set({ fromPlaceId: value }),
  setTo: (value) => set({ to: value }),
  setToPlaceId: (value) => set({ toPlaceId: value }),
  setCoords: (value) => set({ coords: value }),

  setDate: (value) => set({ date: value }),
  setTime: (value) => set({ time: value }),
  setReturnDate: (value) => set({ returnDate: value }),
  setReturnTime: (value) => set({ returnTime: value }),

  setPassengers: (value) => set({ passengers: value }),
  updatePassengers: (key, value) => set((state) => ({
    passengers: { ...state.passengers, [key]: Math.max(0, value) }
  })),

  setSelectedClass: (value) => set({ selectedClass: value }),

  setChildSeat: (value) => set({ childSeat: Math.max(0, value) }),

  setMinibar: (value) => set({ minibar: value }),
  toggleMinibar: () => set((state) => ({ minibar: !state.minibar })),

  setEnglishDriver: (value) => set({ englishDriver: value }),
  toggleEnglishDriver: () => set((state) => ({ englishDriver: !state.englishDriver })),

  setName: (value) => set({ name: value }),
  setPhone: (value) => set({ phone: value }),
  setPaymentMethod: (value) => set({ paymentMethod: value }),

  setEstimatedPrice: (value) => set({ estimatedPrice: value }),

  resetBooking: () => set({ ...initialState }),
}));
