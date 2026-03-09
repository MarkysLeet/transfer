import Link from "next/link";
import { useTranslations } from "next-intl";
import { Facebook, Instagram, Twitter } from "lucide-react";

export const Footer = () => {
  const t = useTranslations("Footer");

  return (
    <footer className="bg-white py-12 border-t border-slate-200 pb-32 md:pb-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
             <h3 className="text-xl font-bold text-slate-900 mb-2 uppercase tracking-widest">
                <span className="font-bold">BLACK DIAMOND</span> <span className="font-normal">TRANSFER</span>
             </h3>
             <p className="text-slate-500 text-sm tracking-wide">{t("description")}</p>
             <p className="text-slate-900 font-semibold mt-4">+90 541 846 25 50</p>
          </div>

          <div className="flex gap-6">
            <Link href="#" className="text-slate-500 hover:text-[#2F4157] transition-colors"><Instagram size={20} /></Link>
            <Link href="#" className="text-slate-500 hover:text-[#2F4157] transition-colors"><Facebook size={20} /></Link>
            <Link href="#" className="text-slate-500 hover:text-[#2F4157] transition-colors"><Twitter size={20} /></Link>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-slate-200 text-center text-slate-400 text-xs tracking-wider flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© {new Date().getFullYear()} BLACK DIAMOND TRANSFER. All rights reserved.</p>
          <p>
            <a
              href="https://www.grozan.studio"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#2F4157] hover:underline transition-all duration-300"
            >
              Design & Development by Grozan Studio
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};
