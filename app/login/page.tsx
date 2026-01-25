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
            {/* Simple Background */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(38,38,38,0.2),transparent_50%)]" />
                <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(circle_at_bottom_left,rgba(38,38,38,0.1),transparent_50%)]" />
            </div>

            {/* Login Container */}
            <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-12">
                {/* Logo */}
                <div className="mb-10 text-center">
                    <div className="relative inline-block mb-8">
                        <Image
                            src="/logo.png"
                            alt="Tigrid Logo"
                            width={160}
                            height={42}
                            className="h-10 w-auto object-contain brightness-110"
                            priority
                        />
                    </div>
                    <h1 className="font-bold tracking-tight text-4xl text-white mb-3">
                        Document Generator
                    </h1>
                    <p className="text-neutral-500 text-base font-medium">Sign in to continue</p>
                </div>

                {/* Login Card */}
                <div className="w-full max-w-md">
                    <div className="relative">

                        {/* Card Content */}
                        <div className="relative bg-neutral-900/40 border border-neutral-800/80 rounded-2xl p-10 shadow-xl">
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
                                            className="w-full pl-12 pr-4 py-4 bg-neutral-950/50 border border-neutral-800 text-white placeholder-neutral-600 rounded-xl focus:outline-none focus:ring-1 focus:ring-orange-500/30 focus:border-orange-500/30 transition-all font-medium"
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
                                            className="w-full pl-12 pr-4 py-4 bg-neutral-950/50 border border-neutral-800 text-white placeholder-neutral-600 rounded-xl focus:outline-none focus:ring-1 focus:ring-orange-500/30 focus:border-orange-500/30 transition-all font-medium"
                                            placeholder="Enter your password"
                                            disabled={isLoading}
                                        />
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full relative group/btn overflow-hidden rounded-xl bg-[#ff6000] text-white font-bold py-4 px-6 transition-all duration-300 hover:bg-[#ff7b24] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-orange-950/20"
                                >
                                    <div className="flex items-center justify-center gap-2">
                                        {isLoading ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                <span>Signing in...</span>
                                            </>
                                        ) : (
                                            <>
                                                <LogIn className="w-5 h-5" />
                                                <span className="text-lg">Sign In</span>
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
