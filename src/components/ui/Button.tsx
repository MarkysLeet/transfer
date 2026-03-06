import React from 'react';
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const variants = {
      primary: 'relative overflow-hidden bg-gradient-to-r from-[#C5A028] via-[#D4B34A] to-[#C5A028] bg-[length:200%_auto] text-white font-semibold hover:bg-[position:right_center] shadow-[0_4px_15px_rgba(197,160,40,0.2)] hover:shadow-[0_4px_25px_rgba(197,160,40,0.3)] transition-all duration-500 ease-out',
      outline: 'border border-[#C5A028] text-[#C5A028] hover:bg-[#C5A028]/10 transition-colors',
      ghost: 'text-[#C5A028] hover:text-[#B38D1E] hover:bg-[#C5A028]/10 transition-colors',
    };

    const sizes = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-full font-medium transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:pointer-events-none cursor-pointer',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
