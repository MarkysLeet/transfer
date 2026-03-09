"use client";
import { Button } from "@/components/ui/Button";
import { MessageCircle } from "lucide-react";
import { useTranslations } from "next-intl";

export const MobileBottomBar = () => {
  const t = useTranslations("Navigation");
  const whatsappUrl = `https://wa.me/905418462550?text=${encodeURIComponent(t("whatsappMessage"))}`;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white/95 backdrop-blur-lg border-t border-slate-200 md:hidden">
      <Button
        variant="primary"
        size="lg"
        className="w-full shadow-lg shadow-black/10 py-4 text-lg font-bold"
        onClick={() => window.open(whatsappUrl, '_blank')}
      >
        <MessageCircle className="mr-2" size={20} />
        WhatsApp
      </Button>
    </div>
  );
};
