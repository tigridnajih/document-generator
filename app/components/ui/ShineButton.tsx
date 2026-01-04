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
                    "relative inline-flex w-full items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 px-6 py-4 font-bold tracking-wide text-white transition-all duration-200 hover:from-orange-400 hover:to-orange-500 hover:scale-[1.01] hover:shadow-[0_8px_30px_-5px_rgba(249,115,22,0.4)] active:scale-[0.98] active:translate-y-0.5 disabled:pointer-events-none disabled:opacity-50 shadow-lg shadow-orange-500/20 border-t border-white/20",
                    className
                )}
                {...props}
            >
                <span className="absolute inset-0 flex h-full w-full -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                <span className="relative z-10">{children}</span>
            </button>
        );
    }
);
ShineButton.displayName = "ShineButton";
