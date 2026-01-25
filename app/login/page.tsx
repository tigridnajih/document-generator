"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { User, Lock, LogIn } from "lucide-react";

import { login } from "@/lib/auth";
import { toast } from "sonner";

export default function LoginPage() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate a brief loading state for better UX
        await new Promise((resolve) => setTimeout(resolve, 500));

        const user = login(username, password);

        if (user) {
            toast.success(`Welcome back, ${user.username}!`);
            router.push("/");
        } else {
            toast.error("Invalid username or password");
            setPassword("");
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#000000] text-white relative overflow-hidden font-sans selection:bg-tigrid-orange/30">
            {/* Noise Overlay */}
            <div className="noise-overlay" />

            {/* Premium Background Gradient */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A] to-[#000000]" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[500px] bg-tigrid-orange/5 blur-[160px] opacity-40" />
            </div>

            {/* Login Container */}
            <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-12">
                {/* Header Section */}
                <div className="mb-10 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="flex items-center justify-center gap-2 mb-8 group cursor-default">
                        <span className="text-4xl font-black tracking-tighter text-white uppercase italic">
                            TiGR<span className="text-tigrid-orange">I</span>D
                        </span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
                        Document Generator
                    </h1>
                    <p className="text-neutral-500 text-lg font-medium max-w-sm mx-auto">
                        Sign in to continue
                    </p>
                </div>

                {/* Login Card */}
                <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                    <div className="relative group/card">
                        {/* Subtle Border Gradient Effect */}
                        <div className="absolute -inset-[1px] bg-gradient-to-b from-neutral-800 to-transparent rounded-[22px] z-0 opacity-50 group-hover/card:opacity-100 transition-opacity duration-500" />

                        {/* Card Content - Glassmorphic */}
                        <div className="relative z-10 bg-neutral-900/40 backdrop-blur-2xl rounded-[20px] p-10 md:p-12 shadow-2xl border border-white/5">
                            <form onSubmit={handleSubmit} className="space-y-8">
                                {/* Username Field */}
                                <div className="space-y-2.5">
                                    <label
                                        htmlFor="username"
                                        className="text-[13px] font-semibold text-neutral-400 tracking-wide uppercase ml-1"
                                    >
                                        Username
                                    </label>
                                    <div className="relative group/input">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 z-20">
                                            <User className="w-[18px] h-[18px] text-neutral-500 group-focus-within/input:text-tigrid-orange transition-colors duration-300" />
                                        </div>
                                        <input
                                            id="username"
                                            type="text"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            required
                                            autoFocus
                                            className="w-full pl-12 pr-4 py-4 bg-[#050505] border border-neutral-800 text-white placeholder-neutral-600 rounded-xl focus:outline-none focus:ring-1 focus:ring-tigrid-orange/40 focus:border-tigrid-orange/40 transition-all duration-300 font-medium shadow-inner"
                                            placeholder="Enter your username"
                                            disabled={isLoading}
                                        />
                                    </div>
                                </div>

                                {/* Password Field */}
                                <div className="space-y-2.5">
                                    <label
                                        htmlFor="password"
                                        className="text-[13px] font-semibold text-neutral-400 tracking-wide uppercase ml-1"
                                    >
                                        Password
                                    </label>
                                    <div className="relative group/input">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 z-20">
                                            <Lock className="w-[18px] h-[18px] text-neutral-500 group-focus-within/input:text-tigrid-orange transition-colors duration-300" />
                                        </div>
                                        <input
                                            id="password"
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            className="w-full pl-12 pr-4 py-4 bg-[#050505] border border-neutral-800 text-white placeholder-neutral-600 rounded-xl focus:outline-none focus:ring-1 focus:ring-tigrid-orange/40 focus:border-tigrid-orange/40 transition-all duration-300 font-medium shadow-inner"
                                            placeholder="Enter your password"
                                            disabled={isLoading}
                                        />
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full h-14 relative group/btn overflow-hidden rounded-full bg-tigrid-orange text-white font-bold transition-all duration-300 hover:shadow-[0_0_25px_rgba(255,96,0,0.3)] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <div className="flex items-center justify-center gap-2 relative z-10 px-6">
                                        {isLoading ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                <span className="text-lg">Signing in...</span>
                                            </>
                                        ) : (
                                            <>
                                                <LogIn className="w-5 h-5 group-hover/btn:-translate-x-1 transition-transform duration-300" />
                                                <span className="text-lg">Sign In</span>
                                            </>
                                        )}
                                    </div>
                                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                                </button>
                            </form>

                            {/* Microcopy */}
                            <div className="mt-8 pt-6 border-t border-white/5">
                                <p className="text-[11px] text-neutral-600 text-center font-medium tracking-widest uppercase">
                                    Access is restricted to authorized users only
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-16 text-center opacity-40 hover:opacity-100 transition-opacity duration-500">
                    <p className="text-[12px] text-neutral-500 font-medium tracking-tight">
                        &copy; {new Date().getFullYear()} Tigrid Technologies. All rights reserved.
                    </p>
                </div>
            </div>
        </main>
    );
}
