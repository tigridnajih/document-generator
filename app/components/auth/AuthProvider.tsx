"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";

interface AuthProviderProps {
    children: React.ReactNode;
}

/**
 * Authentication wrapper component
 * Protects routes by checking authentication status and redirecting to login if needed
 */
export function AuthProvider({ children }: AuthProviderProps) {
    const router = useRouter();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        // Check authentication status on mount
        if (!isAuthenticated()) {
            router.push("/login");
        } else {
            setIsChecking(false);
        }
    }, [router]);

    // Show loading state while checking authentication
    if (isChecking) {
        return (
            <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center text-white">
                <div className="animate-pulse flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-neutral-400">Checking authentication...</p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
