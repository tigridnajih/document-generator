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
            <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-12">

                <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-8 duration-1000">
                    {/* Header: Document Generator */}
                    <div className="mb-10 text-center">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mb-2 font-sans whitespace-nowrap overflow-hidden text-ellipsis">
                            Document Generator
                        </h1>
                    </div>

                    {/* Login Card */}
                    <div className="relative bg-black/40 backdrop-blur-3xl rounded-[32px] p-10 md:p-12 border border-white/5 shadow-2xl">
                        <div className="mb-10 text-center">
                            <h2 className="text-3xl font-bold tracking-tight text-white font-sans lowercase">login</h2>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Username Field */}
                            <div className="space-y-2">
                                <label className="hidden" htmlFor="username">Username</label>
                                <div className="relative group/input">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 z-20 opacity-50 group-focus-within/input:opacity-100 transition-opacity">
                                        <User className="w-[18px] h-[18px] text-neutral-500 group-focus-within/input:text-tigrid-orange transition-colors" />
                                    </div>
                                    <input
                                        id="username"
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                        autoFocus
                                        className="w-full pl-12 pr-6 py-4 bg-neutral-900/50 border border-neutral-800 text-white placeholder-neutral-500 rounded-2xl focus:outline-none focus:ring-1 focus:ring-tigrid-orange/50 focus:border-tigrid-orange/50 transition-all duration-300 font-medium font-sans"
                                        placeholder="Username"
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            {/* Password Field */}
                            <div className="space-y-2">
                                <label className="hidden" htmlFor="password">Password</label>
                                <div className="relative group/input">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 z-20 opacity-50 group-focus-within/input:opacity-100 transition-opacity">
                                        <Lock className="w-[18px] h-[18px] text-neutral-500 group-focus-within/input:text-tigrid-orange transition-colors" />
                                    </div>
                                    <input
                                        id="password"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="w-full pl-12 pr-6 py-4 bg-neutral-900/50 border border-neutral-800 text-white placeholder-neutral-500 rounded-2xl focus:outline-none focus:ring-1 focus:ring-tigrid-orange/50 focus:border-tigrid-orange/50 transition-all duration-300 font-medium font-sans"
                                        placeholder="Password"
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            {/* Options */}
                            <div className="flex items-center gap-2 text-sm text-neutral-400 font-sans">
                                <input type="checkbox" id="remember" className="w-4 h-4 rounded border-neutral-800 bg-neutral-900 accent-tigrid-orange cursor-pointer" />
                                <label htmlFor="remember" className="cursor-pointer hover:text-neutral-300 transition-colors">Remember me</label>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-14 relative group/btn overflow-hidden rounded-full bg-gradient-to-r from-orange-600 to-orange-500 text-white font-semibold transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,100,0,0.4)] active:scale-[0.98] disabled:opacity-50"
                            >
                                <div className="flex items-center justify-center gap-2 relative z-10 px-6">
                                    {isLoading ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    ) : (
                                        <span className="text-xl tracking-tight font-sans">Login</span>
                                    )}
                                </div>
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    );
}
