"use client";

import { useFormContext, useWatch } from "react-hook-form";
import { DocumentFormData } from "@/lib/types";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useMemo } from "react"; // Added useMemo here

// Format currency - moved outside LiveTotal so CountUp can access it
// Format currency - with consistent 2 decimal places
const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);
};

// Simple CountUp component for financial precision - using standardized formatting
function CountUp({ value }: { value: number }) {
    const [displayValue, setDisplayValue] = useState(value);

    useEffect(() => {
        let start = displayValue;
        const end = value;
        if (start === end) return;

        const duration = 400; // Snappier for production feel
        const startTime = performance.now();

        const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 4);
            const current = start + (end - start) * ease;
            setDisplayValue(current);
            if (progress < 1) requestAnimationFrame(animate);
        };

        requestAnimationFrame(animate);
    }, [value]);

    return <span>{formatCurrency(displayValue)}</span>; // Include currency symbol here for stability
}

export function LiveTotal() {
    const { control } = useFormContext<DocumentFormData>();

    const items = useWatch({ control, name: "items" }) || [];
    const gstList = useWatch({ control, name: "gstList" }) || [];

    const subTotal = useMemo(() => {
        return items.reduce((sum, item) => {
            return sum + (Number(item.rate) || 0) * (Number(item.quantity) || 0);
        }, 0);
    }, [items]);

    const gstTotals = useMemo(() => {
        return gstList.map(gst => ({
            label: `${gst.type} (${gst.rate}%)`,
            amount: (subTotal * (Number(gst.rate) || 0)) / 100
        }));
    }, [subTotal, gstList]);

    const totalTax = useMemo(() => {
        return gstTotals.reduce((sum, tax) => sum + tax.amount, 0);
    }, [gstTotals]);

    const grandTotal = useMemo(() => subTotal + totalTax, [subTotal, totalTax]);

    if (items.length === 0) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full py-10"
        >
            <div className="max-w-7xl mx-auto px-6">
                <div className="border-t border-white/5 pt-10 space-y-6">
                    <div className="max-w-md ml-auto space-y-4">
                        {/* Calculation Stack */}
                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-neutral-500 font-medium">Subtotal</span>
                                <span className="text-neutral-200 font-mono">{formatCurrency(subTotal)}</span>
                            </div>

                            <AnimatePresence mode="popLayout">
                                {gstTotals.map((tax, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="flex justify-between items-center text-sm"
                                    >
                                        <span className="text-neutral-500 font-medium">{tax.label}</span>
                                        <span className="text-neutral-300 font-mono">+{formatCurrency(tax.amount)}</span>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                        {/* Divider */}
                        <div className="h-[1px] bg-white/10 w-full" />

                        {/* Grand Total */}
                        <div className="flex justify-between items-end pt-2">
                            <span className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2">Total Payable</span>
                            <div className="text-right">
                                <div className="text-4xl sm:text-5xl font-bold tracking-tight text-white">
                                    <CountUp value={grandTotal} />
                                </div>
                            </div>
                        </div>

                        {/* Zero State / Helper Info */}
                        {grandTotal === 0 && (
                            <p className="text-[10px] text-neutral-600 font-medium text-right italic uppercase tracking-wider">
                                Awaiting line items for calculation
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
