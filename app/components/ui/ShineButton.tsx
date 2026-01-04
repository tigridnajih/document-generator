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
                    "relative inline-flex w-full items-center justify-center overflow-hidden rounded-lg",
                    "bg-gradient-to-r from-orange-500 to-orange-600",
                    "px-8 py-4 font-semibold text-white text-base",
                    "transition-all hover:from-orange-600 hover:to-orange-700 hover:shadow-lg hover:shadow-orange-500/20",
                    "active:scale-[0.98]",
                    "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none",
                    className
                )}
                {...props}
            >
                <span className="absolute inset-0 flex h-full w-full -translate-x-full animate-[shimmer_3s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                <span className="relative z-10">{children}</span>
            </button>
        );
    }
);
ShineButton.displayName = "ShineButton";
