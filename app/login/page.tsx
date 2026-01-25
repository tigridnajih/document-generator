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

            {/* Top Left Logo */}
            <div className="fixed top-8 left-8 z-20 animate-in fade-in slide-in-from-top-4 duration-700">
                <Image
                    src="/logo.png"
                    alt="TiGRID Logo"
                    width={140}
                    height={36}
                    className="h-8 w-auto object-contain brightness-110"
                    priority
                />
            </div>

            {/* Content Container */}
            <div className="relative z-10 min-h-screen flex flex-col md:flex-row items-center justify-center px-6 py-12 max-w-7xl mx-auto gap-12 md:gap-24">

                {/* Left Side: Welcome Text */}
                <div className="flex-1 text-left animate-in fade-in slide-in-from-left-8 duration-1000">
                    <h1 className="text-6xl md:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.1]">
                        Document Generator
                    </h1>
                </div>

                {/* Right Side: Login Card */}
                <div className="w-full max-w-md animate-in fade-in slide-in-from-right-8 duration-1000 delay-200">
                    <div className="relative bg-black/40 backdrop-blur-3xl rounded-[32px] p-10 md:p-12 border border-white/5 shadow-2xl">
                        <div className="mb-10 text-center">
                            <h2 className="text-3xl font-bold tracking-tight text-white font-sans lowercase">login</h2>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Username Field */}
                            <div className="space-y-2">
                                <label className="hidden" htmlFor="username">Username</label>
                                <input
                                    id="username"
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    autoFocus
                                    className="w-full px-6 py-4 bg-neutral-900/50 border border-neutral-800 text-white placeholder-neutral-500 rounded-2xl focus:outline-none focus:ring-1 focus:ring-tigrid-orange/50 focus:border-tigrid-orange/50 transition-all duration-300 font-medium"
                                    placeholder="Username"
                                    disabled={isLoading}
                                />
                            </div>

                            {/* Password Field */}
                            <div className="space-y-2">
                                <label className="hidden" htmlFor="password">Password</label>
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full px-6 py-4 bg-neutral-900/50 border border-neutral-800 text-white placeholder-neutral-500 rounded-2xl focus:outline-none focus:ring-1 focus:ring-tigrid-orange/50 focus:border-tigrid-orange/50 transition-all duration-300 font-medium"
                                    placeholder="Password"
                                    disabled={isLoading}
                                />
                            </div>

                            {/* Options */}
                            <div className="flex items-center gap-2 text-sm text-neutral-400">
                                <input type="checkbox" id="remember" className="w-4 h-4 rounded border-neutral-800 bg-neutral-900 accent-tigrid-orange cursor-pointer" />
                                <label htmlFor="remember" className="cursor-pointer hover:text-neutral-300 transition-colors">Remember me</label>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-14 relative group/btn overflow-hidden rounded-full bg-gradient-to-r from-orange-600 to-orange-500 text-white font-bold transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,100,0,0.4)] active:scale-[0.98] disabled:opacity-50"
                            >
                                <div className="flex items-center justify-center gap-2 relative z-10 px-6">
                                    {isLoading ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    ) : (
                                        <span className="text-xl font-black italic tracking-wider uppercase">Login</span>
                                    )}
                                </div>
                            </button>

                            <div className="text-center">
                                <button type="button" className="text-xs text-neutral-500 hover:text-neutral-300 transition-colors underline-offset-4 hover:underline">Forgot Password?</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    );
}
