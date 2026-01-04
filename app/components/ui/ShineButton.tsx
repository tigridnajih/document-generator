import { ButtonHTMLAttributes, forwardRef } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: (string | undefined | null | false)[]) {
    return twMerge(clsx(inputs));
}

interface ShineButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
}

export const ShineButton = forwardRef<HTMLButtonElement, ShineButtonProps>(
    ({ children, className, ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={cn(
                    "relative inline-flex w-full items-center justify-center overflow-hidden rounded-xl bg-gradient-to-b from-orange-500 to-orange-600 px-6 py-4 font-bold tracking-wide text-white transition-all duration-200 hover:from-orange-400 hover:to-orange-500 hover:scale-[1.005] hover:shadow-[0_8px_20px_-6px_rgba(249,115,22,0.3)] active:scale-[0.99] active:translate-y-[1px] active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] disabled:pointer-events-none disabled:opacity-50 shadow-xl shadow-orange-900/20 border-t border-white/20 ring-1 ring-orange-900/20",
                    className
                )}
                {...props}
            >
                {/* Subtle shimmer effect */}
                <span className="absolute inset-0 flex h-full w-full -translate-x-full animate-[shimmer_3s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                <span className="relative z-10 flex items-center gap-2 drop-shadow-sm">{children}</span>
            </button>
        );
    }
);
ShineButton.displayName = "ShineButton";
