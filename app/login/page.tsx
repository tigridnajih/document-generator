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
                <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-orange-950/20 blur-[150px] rounded-full" />
            </div>

            {/* Content Container */}
            <div className="relative z-10 min-h-screen flex flex-col md:flex-row items-center justify-center px-6 py-12 max-w-7xl mx-auto gap-12 md:gap-24">

                {/* Left Side: Welcome Text */}
                <div className="flex-1 text-left animate-in fade-in slide-in-from-left-8 duration-1000">
                    <div className="mb-6 flex items-center gap-2">
                        <span className="text-2xl font-black tracking-tighter text-white uppercase italic">
                            TiGR<span className="text-tigrid-orange">I</span>D
                        </span>
                    </div>
                    <h1 className="text-6xl md:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.1]">
                        Welcome Sir!
                    </h1>
                    <p className="text-neutral-400 text-lg md:text-xl font-medium max-w-lg leading-relaxed mb-10">
                        A login form is a user interface element that allows users to authenticate themselves and access a protected system, typically a website or application.
                    </p>
                    <button className="px-8 py-3.5 border border-neutral-800 rounded-full text-neutral-300 font-bold hover:bg-neutral-900 transition-all duration-300">
                        Skip Now
                    </button>
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

                            {/* Divider and Social */}
                            <div className="relative py-4">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-white/5"></div>
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-transparent px-3 text-neutral-500">Or</span>
                                </div>
                            </div>

                            <div className="flex justify-center gap-6">
                                <button type="button" className="w-12 h-12 flex items-center justify-center bg-white/5 border border-white/5 rounded-full hover:bg-white/10 transition-all duration-300">
                                    <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.908 3.162-1.9 4.155-1.225 1.225-3.138 2.568-6.94 2.568-6.179 0-10.903-4.996-10.903-11.171 0-6.175 4.724-11.171 10.903-11.171 3.328 0 5.86 1.312 7.625 2.978l2.308-2.308c-2.071-1.928-4.81-3.67-9.933-3.67-9.314 0-16 7.513-16 16.829s6.686 16.829 16 16.829c4.956 0 8.711-1.636 11.696-4.755 3.136-3.136 4.11-7.534 4.11-11.233 0-.712-.066-1.424-.188-2.07h-15.618z" />
                                    </svg>
                                </button>
                                <button type="button" className="w-12 h-12 flex items-center justify-center bg-white/5 border border-white/5 rounded-full hover:bg-white/10 transition-all duration-300">
                                    <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.791-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                    </svg>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Bottom Actions */}
            <div className="fixed bottom-8 left-8 z-20 flex items-center gap-4">
                <button className="flex items-center gap-2 px-6 py-3 bg-white/5 backdrop-blur-xl rounded-2xl text-white font-semibold border border-white/10 hover:bg-white/10 transition-all group">
                    <span className="w-5 h-5 flex items-center justify-center bg-white/10 rounded group-hover:bg-white/20 transition-colors">
                        <svg viewBox="0 0 24 24" className="w-3 h-3 fill-none stroke-white stroke-[3]">
                            <path d="M7 17L17 7M17 7H7M17 7V17" />
                        </svg>
                    </span>
                    Visit site
                </button>
            </div>
            <div className="fixed bottom-8 right-8 z-20 flex items-center gap-2 group">
                <span className="text-neutral-500 font-bold uppercase tracking-widest text-xs group-hover:text-neutral-400 transition-colors">Explore</span>
                <button className="w-10 h-10 flex items-center justify-center bg-white/5 backdrop-blur-xl rounded-full text-neutral-400 border border-white/10 hover:bg-white/10 hover:text-white transition-all">
                    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current stroke-2">
                        <circle cx="11" cy="11" r="8" />
                        <path d="M21 21l-4.35-4.35" />
                        <path d="M11 7v4l2.5 2.5" />
                    </svg>
                </button>
            </div>

        </main>
    );
}
