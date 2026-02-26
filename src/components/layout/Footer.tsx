import Link from "next/link";
import { Facebook, Instagram, Twitter } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-slate-950 py-12 border-t border-white/10 pb-32 md:pb-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
             <h3 className="text-xl font-serif font-bold text-white mb-2">TURKEY VIP TRANSFER</h3>
             <p className="text-slate-400 text-sm">Премиальный сервис в каждой поездке.</p>
          </div>

          <div className="flex gap-6">
            <Link href="#" className="text-slate-400 hover:text-gold-400 transition-colors"><Instagram size={20} /></Link>
            <Link href="#" className="text-slate-400 hover:text-gold-400 transition-colors"><Facebook size={20} /></Link>
            <Link href="#" className="text-slate-400 hover:text-gold-400 transition-colors"><Twitter size={20} /></Link>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-white/5 text-center text-slate-500 text-xs">
          © {new Date().getFullYear()} Turkey VIP Transfer. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
