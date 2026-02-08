"use client";

import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { User, Lock, Check, Loader2 } from "lucide-react";
import { login } from "@/lib/auth";
import { toast } from "sonner";
import { motion, AnimatePresence, Variants } from "framer-motion";

export default function LoginPage() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 1500));

        const user = login(username, password);

        if (user) {
            setIsSuccess(true);
            setTimeout(() => {
                toast.success(`Welcome back, ${user.username}!`);
                router.push("/");
            }, 800);
        } else {
            toast.error("Invalid username or password");
            setPassword("");
            setIsLoading(false);
        }
    };

    const text = "Welcome";
    const letterVariants: Variants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <main className="min-h-screen bg-[#020202] text-white relative overflow-hidden font-sans selection:bg-orange-500/30 flex items-center justify-center p-6">
            {/* Noise Overlay */}
            <div className="noise-overlay absolute inset-0 opacity-[0.03] pointer-events-none z-10" />

            {/* Glowing Spheres Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute -bottom-24 -left-24 w-[500px] h-[500px] bg-orange-600/20 blur-[120px] rounded-full animate-pulse duration-[8000ms]" />
                <div className="absolute top-1/4 -right-12 w-[300px] h-[300px] bg-orange-600/15 blur-[100px] rounded-full animate-pulse duration-[6000ms]" />
                <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-orange-950/20 blur-[150px] rounded-full" />
            </div>

            {/* Logo */}
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
            <div className="relative z-10 w-full max-w-[400px]">
                <div className="text-center mb-10">
                    {/* Profile Icon */}
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-neutral-900/50 border border-white/10 shadow-[0_0_30px_-10px_rgba(255,255,255,0.1)] mb-6"
                    >
                        <User className="w-8 h-8 text-white" />
                    </motion.div>

                    {/* Typing Animation Title */}
                    <h1 className="text-4xl sm:text-5xl font-bold tracking-tighter text-white drop-shadow-sm h-14 overflow-visible flex justify-center">
                        {text.split("").map((char, i) => (
                            <motion.span
                                key={i}
                                variants={letterVariants}
                                initial="hidden"
                                animate="visible"
                                transition={{ duration: 0.1, delay: i * 0.1 }}
                            >
                                {char}
                            </motion.span>
                        ))}
                    </h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                        className="text-neutral-500 mt-4 text-sm font-medium"
                    >
                        Enter your credentials to continue.
                    </motion.p>
                </div>

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
                            className="w-full h-[52px] pl-11 pr-4 bg-neutral-900 md:bg-neutral-900 text-[14px] text-white placeholder-neutral-600 rounded-xl focus:outline-none focus:bg-neutral-800 transition-all font-sans"
                            placeholder="Username"
                            disabled={isLoading || isSuccess}
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
                            className="w-full h-[52px] pl-11 pr-4 bg-neutral-900 md:bg-neutral-900 text-[14px] text-white placeholder-neutral-600 rounded-xl focus:outline-none focus:bg-neutral-800 transition-all font-sans"
                            placeholder="Password"
                            disabled={isLoading || isSuccess}
                        />
                    </div>

                    {/* Morphing Submit Button */}
                    <motion.button
                        type="submit"
                        disabled={isLoading || isSuccess || !username || !password}
                        whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(255,255,255,0.2)" }}
                        whileTap={{ scale: 0.98 }}
                        className={`
                            w-full h-[52px] flex items-center justify-center text-[15px] font-semibold rounded-xl transition-colors duration-300 mt-6
                            ${isSuccess
                                ? "bg-white text-neutral-950"
                                : "bg-white text-neutral-950 hover:bg-neutral-200"
                            }
                            disabled:opacity-70 disabled:cursor-not-allowed
                        `}
                    >
                        <AnimatePresence mode="wait">
                            {isSuccess ? (
                                <motion.div
                                    key="success"
                                    initial={{ scale: 0.5, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="flex items-center gap-2"
                                >
                                    <Check className="w-5 h-5 stroke-[3]" />
                                    <span>Success</span>
                                </motion.div>
                            ) : isLoading ? (
                                <motion.div
                                    key="loading"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                >
                                    <Loader2 className="w-5 h-5 animate-spin text-neutral-950/70" />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="default"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                >
                                    Login
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.button>
                </form>

                <div className="mt-8 text-center px-4">
                    <p className="text-[12px] text-neutral-600 font-medium leading-relaxed">
                        Authorized access only.
                    </p>
                </div>
            </div>
        </main>
    );
}
