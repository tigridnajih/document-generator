"use client";

import { Section } from "@/components/ui/Section";

// ... (existing formatCurrency and CountUp logic remains identical)

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
        <Section title="Payment Summary">
            <div className="space-y-4">
                {/* Calculation Stack */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-neutral-500 font-medium">Subtotal</span>
                        <span className="text-sm text-neutral-200 font-mono">{formatCurrency(subTotal)}</span>
                    </div>

                    <AnimatePresence mode="popLayout">
                        {gstTotals.map((tax, i) => (
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
