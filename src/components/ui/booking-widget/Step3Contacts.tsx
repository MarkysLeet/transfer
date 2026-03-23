import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, User, Phone, CheckCircle2, Wallet, CreditCard } from "lucide-react";
import { useBookingStore } from "@/store/useBookingStore";
import { Button } from "../Button";
import { PaymentMethodType } from "@/store/useBookingStore";

export const Step3Contacts = ({ onBack, onConfirm }: { onBack: () => void; onConfirm: () => void }) => {
  const t = useTranslations("BookingWidget");
  const {
    name, setName,
    phone, setPhone,
    paymentMethod, setPaymentMethod,
    estimatedPrice
  } = useBookingStore();

  const isNextEnabled = name.trim().length > 0 && phone.trim().length > 0;

  return (
    <div className="flex flex-col gap-6">
      {/* Back Button */}
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors">
        <ChevronLeft className="w-4 h-4" />
        {t("back")}
      </button>

      {/* Contacts Info */}
      <div className="flex flex-col gap-3">
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder={t("namePlaceholder")}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full h-14 pl-10 pr-4 bg-white/60 border border-slate-200/60 rounded-xl outline-none focus:ring-2 focus:ring-accent/20 transition-all text-sm text-slate-900"
          />
        </div>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
          <input
            type="tel"
            placeholder={t("phonePlaceholder")}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full h-14 pl-10 pr-36 bg-white/60 border border-slate-200/60 rounded-xl outline-none focus:ring-2 focus:ring-accent/20 transition-all text-sm text-slate-900"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1 pointer-events-none text-xs text-slate-400">
             WhatsApp / Telegram
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div className="flex flex-col gap-3 mt-4">
        <h3 className="text-sm font-medium text-slate-900">{t("paymentMethod")}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <PaymentCard
            type="cash"
            icon={<Wallet className="w-5 h-5" />}
            label={t("payCash")}
            selected={paymentMethod === "cash"}
            onClick={() => setPaymentMethod("cash")}
          />
          <PaymentCard
            type="card"
            icon={<CreditCard className="w-5 h-5" />}
            label={t("payCard")}
            selected={paymentMethod === "card"}
            onClick={() => setPaymentMethod("card")}
          />
        </div>
      </div>

      {/* Submit & Price */}
      <div className="mt-8">
        <AnimatePresence>
          {estimatedPrice && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="flex justify-center mb-4"
            >
              <div className="bg-white/80 backdrop-blur-md px-6 py-2.5 rounded-2xl shadow-sm border border-slate-200/50 flex items-center gap-2 min-w-[200px] justify-center">
                <span className="text-[15px] font-semibold text-[#2F4157]">
                  {t("estimatedPrice", { price: estimatedPrice })}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <Button
          onClick={onConfirm}
          disabled={!isNextEnabled}
          className="w-full h-14 rounded-xl flex items-center justify-center gap-2"
          variant="primary"
        >
          {t("confirmBooking")}
          <CheckCircle2 className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

const PaymentCard = ({
  icon,
  label,
  selected,
  onClick,
}: {
  type: PaymentMethodType;
  icon: React.ReactNode;
  label: string;
  selected: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`flex items-center justify-center gap-2 p-4 rounded-xl border transition-all duration-300 ${
      selected
        ? "border-accent bg-accent/5 text-accent shadow-[inset_0_0_0_1px_rgba(47,65,87,1)]"
        : "border-slate-200/60 bg-white/60 text-slate-500 hover:border-slate-300 hover:bg-white"
    }`}
  >
    {icon}
    <span className="text-sm font-medium">{label}</span>
  </button>
);
