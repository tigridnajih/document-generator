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

                    {/* Header: Workspace Aligned Hierarchy */}
                    <div className="mb-12 text-center space-y-4">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter text-white drop-shadow-sm">
                            Login
                        </h1>
                        <p className="text-neutral-500 max-w-sm mx-auto text-sm leading-relaxed font-medium">
                            Enter your credentials to access the document generator.
                        </p>
                    </div>

                    {/* Ultra-Minimalist Form (No card, No labels, No borders) */}
                    <div className="p-0 sm:p-4">
                        <form onSubmit={handleSubmit} className="space-y-4">


                            {/* Username Field */}
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
                                    className="w-full h-[52px] pl-11 pr-4 bg-neutral-900 text-[14px] text-white placeholder-neutral-600 rounded-xl focus:outline-none focus:ring-1 focus:ring-white/10 transition-all font-sans"
                                    placeholder="Username"
                                    disabled={isLoading}
                                />
                            </div>

                            {/* Password Field */}
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
                                    className="w-full h-[52px] pl-11 pr-4 bg-neutral-900 text-[14px] text-white placeholder-neutral-600 rounded-xl focus:outline-none focus:ring-1 focus:ring-white/10 transition-all font-sans"
                                    placeholder="Password"
                                    disabled={isLoading}
                                />
                            </div>


                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isLoading || !username || !password}
                                className="w-full h-[50px] flex items-center justify-center bg-white text-neutral-950 text-[15px] font-semibold rounded-xl transition-all duration-200 hover:bg-neutral-100 active:scale-[0.98] disabled:cursor-not-allowed disabled:active:scale-100"
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
                            Authorized access only.
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}
