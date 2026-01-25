"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
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
        <main className="min-h-screen bg-[#020202] text-white relative overflow-hidden font-sans selection:bg-tigrid-orange/30">
            {/* Noise Overlay */}
            <div className="noise-overlay" />

            {/* Glowing Spheres Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                {/* Large Bottom Left Sphere */}
                <div className="absolute -bottom-24 -left-24 w-[500px] h-[500px] bg-orange-600/20 blur-[120px] rounded-full animate-pulse duration-[8000ms]" />
                {/* Mid Right Sphere */}
                <div className="absolute top-1/4 -right-12 w-[300px] h-[300px] bg-orange-600/15 blur-[100px] rounded-full animate-pulse duration-[6000ms]" />
                {/* Top Center Sphere (Muted) */}
                <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-orange-950/20 blur-[150px] rounded-full" />
            </div>

            {/* Top Left Logo - Aligned with website header */}
            <div className="fixed top-6 left-6 z-20 animate-in fade-in slide-in-from-top-4 duration-700">
                <Image
                    src="/logo.png"
                    alt="TiGRID Logo"
                    width={100}
                    height={26}
                    className="h-6.5 w-auto object-contain brightness-110"
                    priority
                />
            </div>

            {/* Content Container */}
            <div className="relative z-10 min-h-screen flex items-center justify-center p-6">

                <div className="w-full max-w-[400px] animate-in fade-in zoom-in-95 duration-500">

                    {/* Header: Enterprise Hierarchy */}
                    <div className="mb-8 px-2">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-[13px] font-medium tracking-[0.05em] text-tigrid-orange uppercase">TiGRID</span>
                        </div>
                        <h1 className="text-[22px] font-semibold text-white tracking-tight mb-1">
                            Login
                        </h1>
                        <p className="text-[13px] text-neutral-400">
                            Access your documents to continue.
                        </p>
                    </div>

                    {/* Single Form Card */}
                    <div className="bg-[#0A0A0A]/60 backdrop-blur-xl rounded-2xl p-8 border border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
                        <form onSubmit={handleSubmit} className="space-y-6">

                            {/* Username Field */}
                            <div className="space-y-2">
                                <label className="text-[13px] font-medium text-neutral-300 ml-0.5" htmlFor="username">
                                    Username
                                </label>
                                <div className="relative group/input">
                                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 z-20 opacity-30 group-focus-within/input:opacity-80 transition-opacity">
                                        <User className="w-[16px] h-[16px] text-white" />
                                    </div>
                                    <input
                                        id="username"
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                        autoFocus
                                        className="w-full h-[48px] pl-11 pr-4 bg-[#111111] border border-neutral-800 text-[14px] text-white placeholder-neutral-600 rounded-xl focus:outline-none focus:ring-1 focus:ring-white/10 focus:border-neutral-700 transition-all font-sans"
                                        placeholder="e.g. nidheesh"
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            {/* Password Field */}
                            <div className="space-y-2">
                                <label className="text-[13px] font-medium text-neutral-300 ml-0.5" htmlFor="password">
                                    Password
                                </label>
                                <div className="relative group/input">
                                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 z-20 opacity-30 group-focus-within/input:opacity-80 transition-opacity">
                                        <Lock className="w-[16px] h-[16px] text-white" />
                                    </div>
                                    <input
                                        id="password"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="w-full h-[48px] pl-11 pr-4 bg-[#111111] border border-neutral-800 text-[14px] text-white placeholder-neutral-600 rounded-xl focus:outline-none focus:ring-1 focus:ring-white/10 focus:border-neutral-700 transition-all font-sans"
                                        placeholder="••••••••"
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            {/* Utility Row */}
                            <div className="flex items-center justify-between px-0.5">
                                <label className="flex items-center gap-2 group cursor-pointer">
                                    <div className="relative flex items-center justify-center">
                                        <input
                                            type="checkbox"
                                            id="remember"
                                            className="peer appearance-none w-4 h-4 rounded border border-neutral-800 bg-neutral-900 checked:bg-tigrid-orange checked:border-tigrid-orange transition-all cursor-pointer"
                                        />
                                        <svg className="absolute w-2.5 h-2.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <span className="text-[12px] text-neutral-400 font-medium group-hover:text-neutral-300 transition-colors">Remember me</span>
                                </label>
                                <button type="button" className="text-[12px] text-neutral-500 font-medium hover:text-neutral-300 transition-colors">
                                    Forgot password?
                                </button>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isLoading || !username || !password}
                                className="w-full h-[50px] flex items-center justify-center bg-tigrid-orange text-white text-[15px] font-semibold rounded-xl transition-all duration-200 hover:brightness-110 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
                            >
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    "Login"
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Legal/Footer */}
                    <div className="mt-8 text-center px-4">
                        <p className="text-[12px] text-neutral-600 font-medium leading-relaxed">
                            Authorized access only. By logging in, you agree to our Terms of Service.
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}
