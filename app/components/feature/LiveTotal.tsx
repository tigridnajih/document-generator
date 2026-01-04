"use client";

import { useFormContext, useWatch } from "react-hook-form";
import { DocumentFormData } from "@/lib/types";
import { motion, AnimatePresence } from "framer-motion";

export function LiveTotal() {
    const { control } = useFormContext<DocumentFormData>();

    // Watch all relevant fields to trigger re-renders
    const items = useWatch({ control, name: "items" }) || [];
    const gstList = useWatch({ control, name: "gstList" }) || [];

    // Calculate totals
    const subTotal = items.reduce((sum, item) => {
        return sum + (Number(item.rate) || 0) * (Number(item.quantity) || 0);
    }, 0);

    const gstTotal = gstList.reduce((sum, gst) => {
        return sum + (subTotal * (Number(gst.rate) || 0)) / 100;
    }, 0);

    const grandTotal = subTotal + gstTotal;

    // Format currency
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
        }).format(amount);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-neutral-900/60 backdrop-blur-xl border border-neutral-800/80 rounded-2xl p-8 space-y-6 shadow-2xl shadow-black/40 relative overflow-hidden group"
        >
            {/* Background Gradient */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full blur-[80px] -z-10 translate-x-1/3 -translate-y-1/3 pointer-events-none" />

            <h3 className="text-xs font-semibold uppercase tracking-widest text-neutral-500">Payment Summary</h3>

            <div className="space-y-3 text-sm">
                <div className="flex justify-between text-neutral-300">
                    <span>Subtotal</span>
                    <span className="font-medium font-mono text-neutral-200">{formatCurrency(subTotal)}</span>
                </div>

                <AnimatePresence>
                    {gstList.map((gst, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="flex justify-between text-neutral-400"
                        >
                            <span>{gst.type} ({gst.rate}%)</span>
                            <span className="font-mono">{formatCurrency((subTotal * (Number(gst.rate) || 0)) / 100)}</span>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            <div className="border-t border-dashed border-neutral-800 pt-6 flex justify-between items-baseline">
                <span className="text-neutral-400 font-medium">Total Payable</span>
                <span className="text-3xl font-bold tracking-tight text-white flex items-baseline gap-1">
                    <span className="text-orange-500 text-lg mr-1">INR</span>
                    {formatCurrency(grandTotal).replace(/[^0-9.,]/g, '')}
                </span>
            </div>
        </motion.div>
    );
}
