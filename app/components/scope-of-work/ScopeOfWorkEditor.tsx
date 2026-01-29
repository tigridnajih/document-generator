"use client";

import { useState, useEffect } from "react";
import { Reorder, useDragControls } from "framer-motion";
import { Plus } from "lucide-react";
import { SectionItem, SectionData } from "./SectionItem";

// Clean types for Output/Input
export interface ScopeOfWorkSection {
    title: string;
    items: {
        subTitle?: string;
        contentType: "paragraph" | "bullets";
        content: string | string[];
    }[];
}

export interface ScopeOfWorkData {
    scopeOfWork: ScopeOfWorkSection[];
}

interface ScopeOfWorkEditorProps {
    initialData?: ScopeOfWorkData;
    onChange?: (data: ScopeOfWorkData) => void;
}

export function ScopeOfWorkEditor({ initialData, onChange }: ScopeOfWorkEditorProps) {
    const [sections, setSections] = useState<SectionData[]>(() => {
        if (initialData?.scopeOfWork && initialData.scopeOfWork.length > 0) {
            return initialData.scopeOfWork.map(s => ({
                id: crypto.randomUUID(),
                title: s.title,
                items: s.items.map(item => ({
                    id: crypto.randomUUID(),
                    subTitle: item.subTitle,
                    contentType: item.contentType,
                    content: item.content
                }))
            }));
        }
        return [{
            id: crypto.randomUUID(),
            title: "",
            items: [{
                id: crypto.randomUUID(),
                contentType: "paragraph",
                content: "",
                subTitle: ""
            }]
        }];
    });

    // Notify parent of changes
    useEffect(() => {
        const cleanData: ScopeOfWorkData = {
            scopeOfWork: sections.map(s => ({
                title: s.title,
                items: s.items.map(i => ({
                    subTitle: i.subTitle || undefined,
                    contentType: i.contentType,
                    content: i.content
                }))
            }))
        };
        onChange?.(cleanData);
    }, [sections, onChange]);


    const handleAddSection = () => {
        setSections(prev => [
            ...prev,
            {
                id: crypto.randomUUID(),
                title: "",
                items: [{
                    id: crypto.randomUUID(),
                    contentType: "paragraph",
                    content: "",
                    subTitle: ""
                }]
            }
        ]);
    };

    const handleUpdateSection = (index: number, updated: SectionData) => {
        const newSections = [...sections];
        newSections[index] = updated;
        setSections(newSections);
    };

    const handleRemoveSection = (index: number) => {
        setSections(prev => prev.filter((_, i) => i !== index));
    };

    const handleReorder = (newOrder: SectionData[]) => {
        setSections(newOrder);
    };

    return (
        <div className="space-y-6 w-full">
            <Reorder.Group axis="y" values={sections} onReorder={handleReorder} className="space-y-6">
                {sections.map((section, index) => (
                    <SectionWrapper key={section.id} section={section}>
                        <SectionItem
                            data={section}
                            onChange={(updated) => handleUpdateSection(index, updated)}
                            onRemove={() => handleRemoveSection(index)}
                        />
                    </SectionWrapper>
                ))}
            </Reorder.Group>

            <button
                type="button"
                onClick={handleAddSection}
                className="w-full py-4 border-2 border-dashed border-neutral-800 rounded-xl flex items-center justify-center gap-2 text-neutral-500 font-medium hover:border-orange-500 hover:text-orange-500 hover:bg-orange-500/5 transition-all group"
            >
                <div className="bg-neutral-800 group-hover:bg-orange-500/20 p-1 rounded-md transition-colors">
                    <Plus className="w-5 h-5" />
                </div>
                Add New Section
            </button>
        </div>
    );
}

// Wrapper for DragControls
import React from 'react';

interface SectionWrapperProps {
    children: React.ReactNode;
    section: SectionData;
}

function SectionWrapper({ children, section }: SectionWrapperProps) {
    const controls = useDragControls();

    return (
        <Reorder.Item
            value={section}
            dragListener={false}
            dragControls={controls}
        >
            {/* @ts-expect-error - injecting dragControls into child */}
            {React.isValidElement(children) ? React.cloneElement(children as React.ReactElement, { dragControls: controls }) : children}
        </Reorder.Item>
    );
}
