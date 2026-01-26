import { ComponentProps, forwardRef, ReactNode } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: (string | undefined | null | false)[]) {
    return twMerge(clsx(inputs));
}

interface InputProps extends ComponentProps<"input"> {
    startIcon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, startIcon, ...props }, ref) => {
        return (
            <div className="relative w-full group">
                {startIcon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 z-10 pointer-events-none group-focus-within:text-orange-500/80 transition-colors duration-300">
                        {startIcon}
                    </div>
                )}
                <input
                    ref={ref}
                    className={cn(
                        "w-full bg-neutral-900/40 backdrop-blur-md border border-neutral-800/50 rounded-xl px-4 py-3.5 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-orange-500/20 transition-all duration-150 placeholder:text-neutral-500 text-neutral-200 shadow-[inset_0_1px_2px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.02)] hover:bg-neutral-800/40 hover:border-neutral-700/60",
                        startIcon ? "pl-11" : "",
                        className
                    )}
                    data-voice-enabled="true"
                    data-field-name={props.name || ""}
                    data-field-type={props.type || "text"}
                    data-field-placeholder={props.placeholder || ""}
                    {...props}
                />
            </div>
        );
    }
);
Input.displayName = "Input";
