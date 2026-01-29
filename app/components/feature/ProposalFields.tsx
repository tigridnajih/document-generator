"use client";

import { useFieldArray, useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/Input";
import { Section } from "@/components/ui/Section";
import { DocumentFormData } from "@/lib/types";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Plus, Calendar, IndianRupee, Tag, Hash, Layout } from "lucide-react";

import { Controller } from "react-hook-form";
import { ScopeOfWorkEditor } from "../scope-of-work/ScopeOfWorkEditor";

export function ProposalFields() {
    const { register, control, watch } = useFormContext<DocumentFormData>();
    const timelineEnabled = watch("scopeOfWork.timelineEnabled");

    const {
        fields: timelineFields,
        append: appendTimeline,
        remove: removeTimeline,
    } = useFieldArray({
        control,
        name: "scopeOfWork.timeline",
    });

    const {
        fields: estimationFields,
        append: appendEstimation,
        remove: removeEstimation,
    } = useFieldArray({
        control,
        name: "estimation",
    });

    return (
        <div className="space-y-10">
            <Section title="Scope of Work">
                <div className="space-y-6">
                    {/* Integrated Dynamic Editor */}
                    <div className="space-y-4">
                        <Controller
                            control={control}
                            name="scopeOfWork.sections"
                            render={({ field }) => (
                                <ScopeOfWorkEditor
                                    initialData={{ scopeOfWork: field.value || [] }}
                                    onChange={(data) => {
                                        field.onChange(data.scopeOfWork);
                                    }}
                                />
                            )}
                        />
                    </div>

                    <div className="space-y-4 border-t border-neutral-800/50 pt-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <h3 className="text-sm font-medium text-white flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-orange-500" />
                                    Project Timeline
                                </h3>
                                <p className="text-xs text-neutral-500">Enable to specify project phases and durations.</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    {...register("scopeOfWork.timelineEnabled")}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-neutral-400 after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600 peer-checked:after:bg-white border border-neutral-700/50"></div>
                            </label>
                        </div>

                        <AnimatePresence>
                            {timelineEnabled && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="overflow-hidden space-y-4"
                                >
                                    <div className="flex justify-end">
                                        <button
                                            type="button"
                                            onClick={() => appendTimeline({ phase: "", duration: 0, unit: "Days", deliverables: "" })}
                                            className="flex items-center gap-2 px-3 py-1.5 bg-neutral-800/50 hover:bg-neutral-800 border border-neutral-700/50 rounded-lg text-xs font-medium text-neutral-300 hover:text-white transition-all shadow-sm"
                                        >
                                            <Plus className="w-3.5 h-3.5" /> Add Phase
                                        </button>
                                    </div>

                                    <div className="space-y-3">
                                        {timelineFields.map((field, index) => (
                                            <motion.div
                                                key={field.id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.95 }}
                                                className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-start p-4 bg-neutral-900/30 border border-neutral-800/50 rounded-xl group relative"
                                            >
                                                <div className="sm:col-span-4">
                                                    <Input
                                                        {...register(`scopeOfWork.timeline.${index}.phase`)}
                                                        placeholder="Phase (e.g. Design)"
                                                        className="bg-transparent"
                                                    />
                                                </div>
                                                <div className="sm:col-span-2">
                                                    <Input
                                                        {...register(`scopeOfWork.timeline.${index}.duration`, { valueAsNumber: true })}
                                                        placeholder="Duration"
                                                        type="number"
                                                        className="bg-transparent"
                                                    />
                                                </div>
                                                <div className="sm:col-span-2 relative">
                                                    <select
                                                        {...register(`scopeOfWork.timeline.${index}.unit`)}
                                                        className="w-full bg-neutral-950/40 border border-neutral-800/50 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-500/30 text-white appearance-none cursor-pointer"
                                                    >
                                                        <option value="Days">Days</option>
                                                        <option value="Weeks">Weeks</option>
                                                    </select>
                                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                                    </div>
                                                </div>
                                                <div className="sm:col-span-3">
                                                    <Input
                                                        {...register(`scopeOfWork.timeline.${index}.deliverables`)}
                                                        placeholder="Deliverables"
                                                        className="bg-transparent"
                                                    />
                                                </div>
                                                <div className="sm:col-span-1 flex justify-end">
                                                    <button
                                                        type="button"
                                                        onClick={() => removeTimeline(index)}
                                                        className="p-2 text-neutral-600 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors sm:opacity-0 sm:group-hover:opacity-100"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </motion.div>
                                        ))}
                                        {timelineFields.length === 0 && (
                                            <div className="text-center py-6 text-neutral-600 border border-dashed border-neutral-800 rounded-xl text-xs">
                                                No phases added to timeline
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </Section>

            <Section
                title="Estimation"
                action={
                    <button
                        type="button"
                        onClick={() => appendEstimation({ description: "", rate: 0, qty: 1, total: 0 })}
                        className="flex items-center gap-2 px-3 py-1.5 bg-neutral-800/50 hover:bg-neutral-800 border border-neutral-700/50 rounded-lg text-xs font-medium text-neutral-300 hover:text-white transition-all shadow-sm"
                    >
                        <Plus className="w-3.5 h-3.5" /> Add Row
                    </button>
                }
            >
                <div className="space-y-4">
                    <AnimatePresence mode="popLayout">
                        {estimationFields.map((field, index) => {
                            const rate = watch(`estimation.${index}.rate`) || 0;
                            const qty = watch(`estimation.${index}.qty`) || 0;
                            const total = rate * qty;

                            return (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    key={field.id}
                                    className="group relative grid grid-cols-1 sm:grid-cols-12 gap-4 items-start transition-all"
                                >
                                    <div className="sm:col-span-5">
                                        <Input
                                            {...register(`estimation.${index}.description`)}
                                            placeholder="Description"
                                            startIcon={<Tag className="w-4 h-4" />}
                                        />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <Input
                                            {...register(`estimation.${index}.rate`, { valueAsNumber: true })}
                                            placeholder="Rate"
                                            type="number"
                                            startIcon={<IndianRupee className="w-4 h-4" />}
                                        />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <Input
                                            {...register(`estimation.${index}.qty`, { valueAsNumber: true })}
                                            placeholder="Qty"
                                            type="number"
                                            startIcon={<Hash className="w-4 h-4" />}
                                        />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <div className="relative">
                                            <div className="w-full bg-neutral-900/50 border border-neutral-800/50 rounded-xl px-10 py-3 text-sm text-white font-medium">
                                                {total.toLocaleString()}
                                            </div>
                                            <Layout className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-500/50" />
                                        </div>
                                    </div>
                                    <div className="sm:col-span-1 flex justify-end sm:justify-center pt-2 sm:pt-3">
                                        <button
                                            type="button"
                                            onClick={() => removeEstimation(index)}
                                            className="p-2 text-neutral-600 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors sm:opacity-0 sm:group-hover:opacity-100"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                    {estimationFields.length === 0 && (
                        <div className="text-center py-8 text-neutral-600 border border-dashed border-neutral-800 rounded-xl text-sm">
                            No estimation rows added
                        </div>
                    )}
                </div>
            </Section>
        </div>
    );
}
