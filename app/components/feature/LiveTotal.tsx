"use client";

import { useFormContext, useWatch } from "react-hook-form";
import { DocumentFormData, DocType } from "@/lib/types";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useMemo } from "react";
import { Section } from "@/components/ui/Section";

// Format currency - with consistent 2 decimal places
const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);
};

// Simple CountUp component for financial precision
function CountUp({ value }: { value: number }) {
    const [displayValue, setDisplayValue] = useState(value);

    useEffect(() => {
        let start = displayValue;
        const end = value;
        if (start === end) return;

        const duration = 400;
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

    return <span>{formatCurrency(displayValue)}</span>;
}

interface LiveTotalProps {
    docType?: DocType;
}

export function LiveTotal({ docType }: LiveTotalProps) {
    const { control } = useFormContext<DocumentFormData>();

    const items = useWatch({ control, name: "items" }) || [];
    const estimation = useWatch({ control, name: "estimation" }) || [];
    const gstList = useWatch({ control, name: "gstList" }) || [];

    const subTotal = useMemo(() => {
        // If it's a proposal, we primarily use estimation. For others, we use items.
        // However, we sum both to be safe in case user switched tabs and filled both.
        const itemsTotal = items.reduce((sum, item) => sum + (Number(item.rate) || 0) * (Number(item.quantity) || 0), 0);
        const estimationTotal = estimation.reduce((sum, item) => sum + (Number(item.rate) || 0) * (Number(item.qty) || 0), 0);

        // Logical pick based on docType
        if (docType === "proposal") return estimationTotal || itemsTotal;
        return itemsTotal || estimationTotal;
    }, [items, estimation, docType]);

    const gstTotals = useMemo(() => {
        if (docType === "proposal") return [];
        return gstList.map(gst => ({
            label: `${gst.type} (${gst.rate}%)`,
            amount: (subTotal * (Number(gst.rate) || 0)) / 100
        }));
    }, [subTotal, gstList, docType]);

    const totalTax = useMemo(() => {
        return gstTotals.reduce((sum, tax) => sum + tax.amount, 0);
    }, [gstTotals]);

    const grandTotal = useMemo(() => subTotal + totalTax, [subTotal, totalTax]);

    if (items.length === 0 && estimation.length === 0) return null;

    return (
        <Section title="Total Summary">
            <div className="bg-neutral-900/30 border border-white/5 rounded-2xl p-6 space-y-4 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.02)] backdrop-blur-sm">
                {/* Calculation Stack */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-neutral-500 font-medium">Subtotal</span>
                        <span className="text-sm text-neutral-200 font-mono">{formatCurrency(subTotal)}</span>
                    </div>

                    <AnimatePresence mode="popLayout">
                        {gstTotals.length > 0 && gstTotals.map((tax, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="flex justify-between items-center"
                            >
                                <span className="text-sm text-neutral-500 font-medium">{tax.label}</span>
                                <span className="text-sm text-neutral-300 font-mono">+{formatCurrency(tax.amount)}</span>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Divider Line */}
                <div className="h-[1px] bg-white/5 w-full" />

                {/* Grand Total */}
                <div className="flex justify-between items-center pt-2">
                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-orange-500/80">Total Payable</span>
                    <div className="text-right">
                        <div className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
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
        </Section>
    );
}
