"use client";
import { Button } from "@/components/ui/Button";
import { MessageCircle } from "lucide-react";

export const MobileBottomBar = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-slate-900/95 backdrop-blur-lg border-t border-white/10 md:hidden">
      <Button
        variant="primary"
        size="lg"
        className="w-full shadow-lg shadow-gold-400/20 py-4 text-lg font-bold"
        onClick={() => window.open('https://wa.me/905550000000', '_blank')}
      >
        <MessageCircle className="mr-2" size={20} />
        WhatsApp
      </Button>
    </div>
  );
};
