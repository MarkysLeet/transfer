"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Phone } from "lucide-react";
import { cn } from "@/lib/utils";

export const Header = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent",
        scrolled ? "bg-slate-900/80 backdrop-blur-md border-white/10 py-4" : "bg-transparent py-6"
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link href="/" className="text-xl md:text-2xl font-bold tracking-wider text-white font-serif">
          TURKEY VIP <span className="text-gold-400">TRANSFER</span>
        </Link>
        <Button variant="primary" size="sm" className="hidden md:flex gap-2" onClick={() => window.open('https://wa.me/905550000000', '_blank')}>
          <Phone size={18} />
          <span>Связаться</span>
        </Button>
      </div>
    </header>
  );
};
