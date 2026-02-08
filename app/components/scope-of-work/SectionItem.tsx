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
        <div className="space-y-6 pt-2 pb-6 border-b border-neutral-800/60 last:border-0 relative group/section">
            {/* Section Header */}
            <div className="flex items-center gap-4 px-1 group-hover/section:opacity-100 transition-opacity">
                <div
                    className="cursor-grab active:cursor-grabbing text-neutral-700 hover:text-neutral-400 p-1 transition-colors"
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
                        className="w-full bg-transparent border-b border-neutral-800 focus:border-orange-500 py-2 outline-none text-lg font-bold text-white placeholder:text-neutral-700 transition-colors"
                    />
                </div>

                <button
                    onClick={onRemove}
                    className="text-neutral-700 hover:text-red-500 p-2 hover:bg-red-500/10 rounded-md transition-colors opacity-0 group-hover/section:opacity-100"
                    title="Delete Section"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>

            {/* Section Content */}
            <div className="space-y-6 pl-10">
                <Reorder.Group
                    axis="y"
                    values={data.items}
                    onReorder={handleReorderBlocks}
                    className="space-y-6"
                >
                    {data.items.map((block, index) => (
                        <BlockWrapper key={block.id} item={block}>
                            <ContentBlock
                                data={block}
                                onChange={(updated) => handleUpdateBlock(index, updated)}
                                onRemove={() => handleRemoveBlock(index)}
                            />
                        </BlockWrapper>
                    ))}
                </Reorder.Group>

                <div className="flex justify-start pt-2">
                    <button
                        type="button"
                        onClick={handleAddBlock}
                        className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-neutral-500 hover:text-orange-500 transition-colors rounded-md hover:bg-orange-500/10"
                    >
                        <Plus className="w-3.5 h-3.5" />
                        Add Content Block
                    </button>
                </div>
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
