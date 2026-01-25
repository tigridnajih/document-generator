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
        <main className="min-h-screen bg-neutral-950 text-white relative overflow-hidden font-sans selection:bg-orange-500/30">
            {/* Background Mesh Gradient */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-5%] w-[800px] h-[800px] bg-neutral-900/20 rounded-full blur-[120px] opacity-20" />
                <div className="absolute bottom-[0%] left-[-10%] w-[600px] h-[600px] bg-neutral-900/10 rounded-full blur-[100px] opacity-20" />
                <div className="absolute top-[20%] left-[20%] w-[400px] h-[400px] bg-orange-500/2 rounded-full blur-[150px] opacity-10 animate-[pulse_4s_ease-in-out_infinite]" />
            </div>

            {/* Login Container */}
            <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-12">
                {/* Logo */}
                <div className="mb-12 text-center">
                    <Image
                        src="/logo.png"
                        alt="Tigrid Logo"
                        width={180}
                        height={48}
                        className="h-12 w-auto object-contain opacity-90 mx-auto mb-6"
                        priority
                    />
                    <h1 className="font-bold tracking-tighter text-3xl sm:text-4xl text-white mb-2">
                        Document Generator
                    </h1>
                    <p className="text-neutral-500 text-sm">Sign in to continue</p>
                </div>

                {/* Login Card */}
                <div className="w-full max-w-md">
                    <div className="relative group">
                        {/* Card Glow Effect */}
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-600 to-orange-400 rounded-2xl blur opacity-10 group-hover:opacity-20 transition duration-300"></div>

                        {/* Card Content */}
                        <div className="relative bg-neutral-900/50 backdrop-blur-xl border border-neutral-800/60 rounded-2xl p-8 shadow-2xl">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Username Field */}
                                <div className="space-y-2">
                                    <label
                                        htmlFor="username"
                                        className="text-sm font-medium text-neutral-400 block"
                                    >
                                        Username
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                                        <input
                                            id="username"
                                            type="text"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            required
                                            autoFocus
                                            className="w-full pl-12 pr-4 py-3.5 bg-neutral-800/40 border border-neutral-700/50 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all"
                                            placeholder="Enter your username"
                                            disabled={isLoading}
                                        />
                                    </div>
                                </div>

                                {/* Password Field */}
                                <div className="space-y-2">
                                    <label
                                        htmlFor="password"
                                        className="text-sm font-medium text-neutral-400 block"
                                    >
                                        Password
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                                        <input
                                            id="password"
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            className="w-full pl-12 pr-4 py-3.5 bg-neutral-800/40 border border-neutral-700/50 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all"
                                            placeholder="Enter your password"
                                            disabled={isLoading}
                                        />
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full relative group/btn overflow-hidden rounded-xl bg-gradient-to-r from-orange-600 to-orange-500 p-[1px] transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <div className="relative bg-gradient-to-r from-orange-600 to-orange-500 text-white font-semibold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 group-hover/btn:from-orange-500 group-hover/btn:to-orange-400 transition-all">
                                        {isLoading ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                <span>Signing in...</span>
                                            </>
                                        ) : (
                                            <>
                                                <LogIn className="w-4 h-4" />
                                                <span>Sign In</span>
                                            </>
                                        )}
                                    </div>
                                </button>
                            </form>

                            {/* Info Text */}
                            <div className="mt-6 pt-6 border-t border-neutral-800/60">
                                <p className="text-xs text-neutral-500 text-center">
                                    Access is restricted to authorized users only
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-12 text-center">
                    <p className="text-xs text-neutral-600">
                        © 2026 Tigrid Technologies. All rights reserved.
                    </p>
                </div>
            </div>
        </main>
    );
}
