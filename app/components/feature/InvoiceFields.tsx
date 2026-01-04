"use client";

import { useFieldArray, useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/Input";
import { Section } from "@/components/ui/Section";
import { DocumentFormData } from "@/lib/types";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Plus, Tag, IndianRupee, Hash, Percent } from "lucide-react";

export function InvoiceFields() {
    const { register, control } = useFormContext<DocumentFormData>();

    const {
        fields: itemFields,
        append: appendItem,
        remove: removeItem,
    } = useFieldArray({
        control,
        name: "items",
    });

    const {
        fields: gstFields,
        append: appendGst,
        remove: removeGst,
    } = useFieldArray({
        control,
        name: "gstList",
    });

    return (
        <>
            <Section
                title="Item Details"
                action={
                    <button
                        type="button"
                        onClick={() => appendItem({ name: "", rate: 0, quantity: 1 })}
                        className="flex items-center gap-2 px-3 py-1.5 bg-neutral-800/50 hover:bg-neutral-800 border border-neutral-700/50 rounded-lg text-xs font-medium text-neutral-300 hover:text-white transition-all shadow-sm"
                    >
                        <Plus className="w-3.5 h-3.5" /> Add Item
                    </button>
                }
            >
                <div className="space-y-4">
                    <AnimatePresence mode="popLayout">
                        {itemFields.map((field, index) => (
                            <motion.div
                                layout
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                key={field.id}
                                className="group relative grid grid-cols-1 sm:grid-cols-12 gap-4 items-start transition-all"
                            >
                                <div className="sm:col-span-6">
                                    <Input
                                        {...register(`items.${index}.name` as const)}
                                        placeholder="Description of service or product"
                                        startIcon={<Tag className="w-4 h-4" />}
                                        className=""
                                    />
                                </div>
                                <div className="sm:col-span-3">
                                    <Input
                                        {...register(`items.${index}.rate` as const, { valueAsNumber: true })}
                                        placeholder="Rate"
                                        type="number"
                                        startIcon={<IndianRupee className="w-4 h-4" />}
                                        className=""
                                    />
                                </div>
                                <div className="sm:col-span-2">
                                    <Input
                                        {...register(`items.${index}.quantity` as const, { valueAsNumber: true })}
                                        placeholder="Qty"
                                        type="number"
                                        startIcon={<Hash className="w-4 h-4" />}
                                        className=""
                                    />
                                </div>
                                <div className="sm:col-span-1 flex justify-end sm:justify-center pt-2 sm:pt-3">
                                    <button
                                        type="button"
                                        onClick={() => removeItem(index)}
                                        className="p-2 text-neutral-600 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                                        title="Remove Item"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    {itemFields.length === 0 && (
                        <div className="text-center py-8 text-neutral-600 border border-dashed border-neutral-800 rounded-xl">
                            <p className="text-sm">No items added yet</p>
                        </div>
                    )}
                </div>
            </Section>

            <Section
                title="Tax Configuration"
                action={
                    <button
                        type="button"
                        onClick={() => appendGst({ type: "CGST", rate: 9 })}
                        className="flex items-center gap-2 px-3 py-1.5 bg-neutral-800/50 hover:bg-neutral-800 border border-neutral-700/50 rounded-lg text-xs font-medium text-neutral-300 hover:text-white transition-all shadow-sm"
                    >
                        <Plus className="w-3.5 h-3.5" /> Add Tax
                    </button>
                }
            >
                <div className="space-y-4">
                    <AnimatePresence mode="popLayout">
                        {gstFields.map((field, index) => (
                            <motion.div
                                layout
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                                key={field.id}
                                className="group grid grid-cols-1 sm:grid-cols-6 gap-4 items-center"
                            >
                                <div className="sm:col-span-2 relative">
                                    <select
                                        {...register(`gstList.${index}.type` as const)}
                                        className="w-full bg-neutral-950/40 backdrop-blur-md border border-neutral-800/50 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-orange-500/30 appearance-none text-white hover:bg-neutral-900/40 hover:border-neutral-700/60 transition-all duration-150 cursor-pointer shadow-[inset_0_1px_2px_rgba(0,0,0,0.2)]"
                                    >
                                        <option value="CGST">CGST</option>
                                        <option value="SGST">SGST</option>
                                        <option value="IGST">IGST</option>
                                    </select>
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                    </div>
                                </div>

                                <div className="sm:col-span-3">
                                    <Input
                                        {...register(`gstList.${index}.rate` as const, { valueAsNumber: true })}
                                        placeholder="Tax Rate %"
                                        type="number"
                                        startIcon={<Percent className="w-4 h-4" />}
                                    />
                                </div>

                                <div className="sm:col-span-1 text-right sm:text-center">
                                    <button
                                        type="button"
                                        onClick={() => removeGst(index)}
                                        className="p-2 text-neutral-600 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    {gstFields.length === 0 && (
                        <div className="text-center py-4 text-neutral-600 text-sm italic">
                            No taxes applied
                        </div>
                    )}
                </div>
            </Section>
        </>
    );
}
