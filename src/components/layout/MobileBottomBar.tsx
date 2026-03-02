"use client";
import { Button } from "@/components/ui/Button";
import { MessageCircle } from "lucide-react";
import { useTranslations } from "next-intl";

export const MobileBottomBar = () => {
  const t = useTranslations("Hero");
  const whatsappUrl = `https://wa.me/905550000000?text=${encodeURIComponent(t("whatsapp_message"))}`;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-slate-900/95 backdrop-blur-lg border-t border-white/10 md:hidden pb-safe">
      <Button
        variant="primary"
        size="lg"
        className="w-full shadow-lg shadow-gold-500/20 py-4 text-lg font-bold bg-gold-500 hover:bg-gold-600 text-slate-900"
        onClick={() => window.open(whatsappUrl, '_blank')}
      >
        <MessageCircle className="mr-2 text-slate-900" size={20} />
        <span className="text-slate-900 font-bold uppercase tracking-wider">WhatsApp</span>
      </Button>
    </div>
  );
};
