"use client";

import { useDragControls, Reorder, DragControls } from "framer-motion";
import { GripVertical, Plus, Trash2 } from "lucide-react";
import { ContentBlock, ContentBlockData } from "./ContentBlock";

export interface SectionData {
    id: string;
    title: string;
    items: ContentBlockData[];
}

interface SectionItemProps {
    data: SectionData;
    onChange: (data: SectionData) => void;
    onRemove: () => void;
    dragControls?: DragControls;
}

export function SectionItem({ data, onChange, onRemove, dragControls }: SectionItemProps) {

    const handleAddBlock = () => {
        const newBlock: ContentBlockData = {
            id: crypto.randomUUID(),
            contentType: "paragraph",
            content: "",
            subTitle: ""
        };
        onChange({
            ...data,
            items: [...data.items, newBlock]
        });
    };

    const handleUpdateBlock = (index: number, updatedBlock: ContentBlockData) => {
        const newItems = [...data.items];
        newItems[index] = updatedBlock;
        onChange({ ...data, items: newItems });
    };

    const handleRemoveBlock = (index: number) => {
        const newItems = data.items.filter((_, i) => i !== index);
        // Ensure at least one block? Prompt says "A list of content blocks (at least one required)"
        // But allowing remove to empty might be bad UX if they can't add one back easily, 
        // or maybe we just allow empty and they click add. 
        // "Add content block inside a Section" is a required action.
        onChange({ ...data, items: newItems });
    };

    const handleReorderBlocks = (newOrder: ContentBlockData[]) => {
        onChange({ ...data, items: newOrder });
    };

    return (
        <div className="bg-neutral-950/80 border border-neutral-800 rounded-xl overflow-hidden shadow-sm hover:border-neutral-700 transition-colors">
            {/* Section Header */}
            <div className="bg-neutral-900/50 border-b border-neutral-800 p-4 flex items-center gap-3">
                <div
                    className="cursor-grab active:cursor-grabbing text-neutral-600 hover:text-neutral-400 p-1"
                    onPointerDown={(e) => dragControls?.start(e)}
                >
                    <GripVertical className="w-5 h-5" />
                </div>

                <div className="flex-1">
                    <input
                        type="text"
                        value={data.title}
                        onChange={(e) => onChange({ ...data, title: e.target.value })}
                        placeholder="Section Title (e.g. Scope of Work)"
                        className="w-full bg-transparent border-none outline-none text-base font-semibold text-white placeholder:text-neutral-600"
                    />
                </div>

                <button
                    onClick={onRemove}
                    className="text-neutral-600 hover:text-red-500 p-2 hover:bg-red-500/10 rounded-md transition-colors"
                    title="Delete Section"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>

            {/* Section Content */}
            <div className="p-4 space-y-4">
                {data.items.length === 0 && (
                    <div className="text-center py-6 border-2 border-dashed border-neutral-800/50 rounded-lg">
                        <p className="text-neutral-500 text-sm mb-3">No content blocks yet</p>
                        <button
                            type="button"
                            onClick={handleAddBlock}
                            className="inline-flex items-center gap-2 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-md text-xs font-medium transition-colors"
                        >
                            <Plus className="w-3.5 h-3.5" />
                            Add First Block
                        </button>
                    </div>
                )}

                <Reorder.Group
                    axis="y"
                    values={data.items}
                    onReorder={handleReorderBlocks}
                    className="space-y-4"
                >
                    {data.items.map((block, index) => (
                        <BlockWrapper key={block.id} item={block}>
                            <ContentBlock
                                data={block}
                                onChange={(updated) => handleUpdateBlock(index, updated)}
                                onRemove={() => handleRemoveBlock(index)}
                            // Pass drag controls manually if we wanted tight control, 
                            // but BlockWrapper handles the Reorder.Item context
                            />
                        </BlockWrapper>
                    ))}
                </Reorder.Group>

                {data.items.length > 0 && (
                    <button
                        type="button"
                        onClick={handleAddBlock}
                        className="w-full py-3 flex items-center justify-center gap-2 border border-dashed border-neutral-800 hover:border-orange-500/30 hover:bg-orange-500/5 text-neutral-500 hover:text-orange-500 rounded-lg transition-all text-sm font-medium"
                    >
                        <Plus className="w-4 h-4" />
                        Add Content Block
                    </button>
                )}
            </div>
        </div>
    );
}

// Separate wrapper to isolate DragControls for each item
function BlockWrapper({ children, item }: { children: React.ReactNode, item: ContentBlockData }) {
    const controls = useDragControls();

    return (
        <Reorder.Item
            value={item}
            dragListener={false}
            dragControls={controls}
            className="relative"
        >
            {/* @ts-expect-error - injecting dragControls into child */}
            {React.isValidElement(children) ? React.cloneElement(children as React.ReactElement, { dragControls: controls }) : children}
        </Reorder.Item>
    );
}

import React from "react";
