"use client";

import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { User, Lock, ArrowRight, Check, Loader2 } from "lucide-react";
import { login } from "@/lib/auth";
import { toast } from "sonner";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";

export default function LoginPage() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [shake, setShake] = useState(false);

    // Mouse parallax effect for background
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Smooth spring animation for mouse movement
    const userX = useSpring(mouseX, { stiffness: 50, damping: 20 });
    const userY = useSpring(mouseY, { stiffness: 50, damping: 20 });

    const handleMouseMove = (e: React.MouseEvent) => {
        const { clientX, clientY } = e;
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        mouseX.set(clientX - centerX);
        mouseY.set(clientY - centerY);
    };

    // Parallax transforms for background blobs
    const orb1X = useTransform(userX, (value) => value * -0.05);
    const orb1Y = useTransform(userY, (value) => value * -0.05);
    const orb2X = useTransform(userX, (value) => value * 0.08);
    const orb2Y = useTransform(userY, (value) => value * 0.08);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setShake(false);

        // Simulate network delay for polish
        await new Promise((resolve) => setTimeout(resolve, 800));

        const user = login(username, password);

        if (user) {
            setIsSuccess(true);
            setTimeout(() => {
                toast.success(`Welcome back, ${user.username}!`);
                router.push("/");
            }, 500);
        } else {
            setIsLoading(false);
            setShake(true);
            toast.error("Invalid username or password");
            setPassword("");
            setTimeout(() => setShake(false), 500); // Reset shake
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: "easeOut" }
        }
    };

    return (
        <main
            className="min-h-screen bg-[#020202] text-white relative overflow-hidden font-sans selection:bg-orange-500/30 flex items-center justify-center p-6"
            onMouseMove={handleMouseMove}
        >
            {/* Noise Overlay */}
            <div className="noise-overlay absolute inset-0 opacity-[0.03] pointer-events-none z-10" />

            {/* Dynamic Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                {/* Large Bottom Left Sphere */}
                <motion.div
                    style={{ x: orb1X, y: orb1Y }}
                    className="absolute -bottom-24 -left-24 w-[600px] h-[600px] bg-orange-600/15 blur-[120px] rounded-full"
                />
                {/* Mid Right Sphere */}
                <motion.div
                    style={{ x: orb2X, y: orb2Y }}
                    className="absolute top-1/4 -right-20 w-[400px] h-[400px] bg-orange-500/10 blur-[100px] rounded-full"
                />
                {/* Subtle Top Center */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-blue-900/10 blur-[120px] rounded-full opacity-50" />
            </div>

            {/* Logo - Absolute Positioned */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="fixed top-8 left-8 z-20"
            >
                <Image
                    src="/logo.png"
                    alt="TiGRID Logo"
                    width={110}
                    height={28}
                    className="h-7 w-auto object-contain brightness-125 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                    priority
                />
            </motion.div>

            {/* Main Card Container */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="relative z-10 w-full max-w-[420px]"
            >
                <motion.div
                    animate={shake ? { x: [-5, 5, -5, 5, 0] } : {}}
                    transition={{ duration: 0.4 }}
                    className="bg-neutral-900/30 backdrop-blur-xl border border-white/5 rounded-3xl p-8 sm:p-10 shadow-[0_0_40px_-10px_rgba(0,0,0,0.5)] relative overflow-hidden group"
                >
                    {/* Glass Shine Effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                    <motion.div variants={itemVariants} className="text-center mb-10 space-y-3">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500/20 to-orange-600/5 mb-4 border border-orange-500/10 shadow-[0_0_20px_-5px_rgba(249,115,22,0.3)]">
                            <Lock className="w-6 h-6 text-orange-500" />
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight text-white drop-shadow-sm">
                            Welcome Back
                        </h1>
                        <p className="text-neutral-400 text-sm font-medium">
                            Enter your credentials to access the workspace.
                        </p>
                    </motion.div>

                    <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                        <motion.div variants={itemVariants} className="space-y-4">
                            {/* Username Input */}
                            <div className="relative group/input">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within/input:text-orange-500 transition-colors duration-300">
                                    <User className="w-5 h-5" />
                                </div>
                                <input
                                    id="username"
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    className="w-full h-14 pl-12 pr-4 bg-neutral-950/50 border border-neutral-800 rounded-2xl text-white placeholder-neutral-600 focus:outline-none focus:border-orange-500/50 focus:bg-neutral-900/80 focus:ring-4 focus:ring-orange-500/10 transition-all duration-300 shadow-inner"
                                    placeholder="Username"
                                    disabled={isLoading || isSuccess}
                                />
                            </div>

                            {/* Password Input */}
                            <div className="relative group/input">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within/input:text-orange-500 transition-colors duration-300">
                                    <Lock className="w-5 h-5" />
                                </div>
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full h-14 pl-12 pr-4 bg-neutral-950/50 border border-neutral-800 rounded-2xl text-white placeholder-neutral-600 focus:outline-none focus:border-orange-500/50 focus:bg-neutral-900/80 focus:ring-4 focus:ring-orange-500/10 transition-all duration-300 shadow-inner"
                                    placeholder="Password"
                                    disabled={isLoading || isSuccess}
                                />
                            </div>
                        </motion.div>

                        <motion.div variants={itemVariants} className="pt-2">
                            <motion.button
                                type="submit"
                                disabled={isLoading || isSuccess || !username || !password}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={`
                                    w-full h-14 flex items-center justify-center font-semibold rounded-2xl transition-all duration-300 shadow-lg
                                    ${isSuccess
                                        ? "bg-green-500 text-white hover:bg-green-600 shadow-green-500/25"
                                        : "bg-white text-neutral-950 hover:bg-neutral-200 hover:shadow-white/10"
                                    }
                                    disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none
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
                                            className="flex items-center gap-2"
                                        >
                                            <span>Sign In</span>
                                            <ArrowRight className="w-4 h-4 opacity-50 group-hover:translate-x-1 transition-transform" />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.button>
                        </motion.div>
                    </form>

                    <motion.div variants={itemVariants} className="mt-8 text-center">
                        <p className="text-xs text-neutral-600 font-medium tracking-wide">
                            SECURE ACCESS • AUTHORIZED PERSONNEL ONLY
                        </p>
                    </motion.div>
                </motion.div>
            </motion.div>
        </main>
    );
}
