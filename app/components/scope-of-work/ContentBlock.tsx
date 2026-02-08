import { Trash2, GripVertical, Plus, List, AlignLeft, X, Mic, Square, Loader2 } from "lucide-react";
import { DragControls } from "framer-motion";
import { cn } from "@/lib/utils";
import { useState, useRef } from "react";
import { useFormContext } from "react-hook-form";
import { toast } from "sonner";

export type ContentType = "paragraph" | "bullets";

export interface ContentBlockData {
    id: string; // Internal ID for reordering
    subTitle?: string;
    contentType: ContentType;
    content: string | string[]; // string for paragraph, string[] for bullets
}

interface ContentBlockProps {
    data: ContentBlockData;
    onChange: (data: ContentBlockData) => void;
    onRemove: () => void;
    dragControls?: DragControls; // Framer motion drag controls
}

export function ContentBlock({ data, onChange, onRemove, dragControls }: ContentBlockProps) {
    const { getValues } = useFormContext();
    const [isListening, setIsListening] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);

    const handleTypeChange = (value: ContentType) => {
        let newContent: string | string[] = "";
        if (value === "paragraph") {
            // safe conversion if switching from bullets
            newContent = Array.isArray(data.content) ? data.content.join("\n") : data.content || "";
        } else {
            // safe conversion if switching from paragraph
            newContent = typeof data.content === "string" ? data.content.split("\n").filter(Boolean) : data.content || [];
            if ((newContent as string[]).length === 0) newContent = [""]; // Start with one bullet
        }

        onChange({
            ...data,
            contentType: value,
            content: newContent
        });
    };

    const handleContentChange = (val: string | string[]) => {
        onChange({ ...data, content: val });
    };

    const toggleVoice = async () => {
        if (isListening) {
            // STOP
            if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
                mediaRecorderRef.current.stop();
            }
            setIsListening(false);
        } else {
            // START
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                audioChunksRef.current = [];
                const mediaRecorder = new MediaRecorder(stream);

                mediaRecorder.ondataavailable = (event) => {
                    if (event.data.size > 0) audioChunksRef.current.push(event.data);
                };

                mediaRecorder.onstop = async () => {
                    // Cleanup tracks
                    stream.getTracks().forEach(track => track.stop());

                    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                    setIsProcessing(true);
                    const loadingToast = toast.loading("Transcribing...");

                    try {
                        const formData = new FormData();
                        formData.append("audio", audioBlob, "recording.webm");
                        // We send current values to give context, but mainly we want the transcript
                        formData.append("currentValues", JSON.stringify(getValues()));

                        // Fake a focused field context to help the AI understand where we are
                        formData.append("focusedField", JSON.stringify({
                            name: "content_block_description",
                            type: "textarea",
                            placeholder: "Description"
                        }));

                        const response = await fetch("/api/voice-action", {
                            method: "POST",
                            body: formData,
                        });

                        if (!response.ok) throw new Error("Transcription failed");

                        const { transcript } = await response.json();

                        if (transcript) {
                            if (isParagraph) {
                                // Append to existing text
                                const currentText = textContent;
                                const newText = currentText ? `${currentText} ${transcript}` : transcript;
                                handleContentChange(newText);
                            } else {
                                // For bullets, add as new item
                                const newList = [...bulletList, transcript];
                                handleContentChange(newList);
                            }
                            toast.success("Transcribed!");
                        }
                    } catch (error) {
                        console.error(error);
                        toast.error("Failed to transcribe");
                    } finally {
                        setIsProcessing(false);
                        toast.dismiss(loadingToast);
                    }
                };

                mediaRecorderRef.current = mediaRecorder;
                mediaRecorder.start();
                setIsListening(true);
            } catch (err) {
                console.error("Mic Error:", err);
                toast.error("Could not access microphone");
            }
        }
    };

    // Safe typed helpers
    const isParagraph = data.contentType === "paragraph";
    const bulletList = Array.isArray(data.content) ? data.content : [];
    const textContent = typeof data.content === "string" ? data.content : "";

    return (
        <div className="group transition-all">
            <div className="flex items-start gap-3">
                {/* Drag Handle */}
                <div
                    className="mt-2 text-neutral-600 hover:text-neutral-400 cursor-grab active:cursor-grabbing p-1"
                    onPointerDown={(e) => dragControls?.start(e)}
                >
                    <GripVertical className="w-5 h-5" />
                </div>

                <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* Sub-Title Input */}
                        <div>
                            <input
                                type="text"
                                value={data.subTitle || ""}
                                onChange={(e) => onChange({ ...data, subTitle: e.target.value })}
                                placeholder="Sub-Title (Optional)"
                                className="w-full bg-transparent border-b border-neutral-800 focus:border-orange-500 py-1.5 text-sm outline-none transition-colors placeholder:text-neutral-600 text-neutral-200 font-medium"
                            />
                        </div>

                        {/* Type Selector & Mic */}
                        <div className="flex justify-start sm:justify-end gap-2">
                            <button
                                type="button"
                                onClick={toggleVoice}
                                disabled={isProcessing}
                                className={cn(
                                    "flex items-center justify-center w-8 h-8 rounded-lg transition-all border",
                                    isListening
                                        ? "bg-red-500/10 text-red-500 border-red-500/50 animate-pulse"
                                        : "bg-neutral-900/50 text-neutral-400 border-neutral-800/60 hover:text-orange-500 hover:border-orange-500/50"
                                )}
                                title="Dictate Description"
                            >
                                {isProcessing ? (
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : isListening ? (
                                    <Square className="w-3.5 h-3.5 fill-current" />
                                ) : (
                                    <Mic className="w-3.5 h-3.5" />
                                )}
                            </button>

                            <div className="flex items-center gap-1 bg-neutral-900/50 rounded-lg p-1 border border-neutral-800/60">
                                <button
                                    type="button"
                                    onClick={() => handleTypeChange("paragraph")}
                                    className={cn(
                                        "flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all",
                                        isParagraph
                                            ? "bg-neutral-800 text-white shadow-sm"
                                            : "text-neutral-500 hover:text-neutral-300 hover:bg-neutral-900"
                                    )}
                                >
                                    <AlignLeft className="w-3.5 h-3.5" />
                                    Text
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleTypeChange("bullets")}
                                    className={cn(
                                        "flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all",
                                        !isParagraph
                                            ? "bg-neutral-800 text-white shadow-sm"
                                            : "text-neutral-500 hover:text-neutral-300 hover:bg-neutral-900"
                                    )}
                                >
                                    <List className="w-3.5 h-3.5" />
                                    List
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="min-h-[60px]">
                        {isParagraph ? (
                            <textarea
                                value={textContent}
                                onChange={(e) => handleContentChange(e.target.value)}
                                placeholder="Enter description..."
                                className="w-full h-full min-h-[80px] bg-neutral-900/40 rounded-xl border border-neutral-800/50 p-4 text-sm text-neutral-300 placeholder:text-neutral-600 outline-none focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/5 transition-all resize-y"
                            />
                        ) : (
                            <div className="space-y-2">
                                {bulletList.map((bullet, idx) => (
                                    <div key={idx} className="flex items-start gap-2 group/bullet">
                                        <span className="mt-2.5 w-1.5 h-1.5 rounded-full bg-orange-500/50 shrink-0" />
                                        <input
                                            type="text"
                                            value={bullet}
                                            onChange={(e) => {
                                                const newList = [...bulletList];
                                                newList[idx] = e.target.value;
                                                handleContentChange(newList);
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    const newList = [...bulletList];
                                                    newList.splice(idx + 1, 0, "");
                                                    handleContentChange(newList);
                                                }
                                                if (e.key === 'Backspace' && bullet === "" && bulletList.length > 1) {
                                                    e.preventDefault();
                                                    const newList = [...bulletList];
                                                    newList.splice(idx, 1);
                                                    handleContentChange(newList);
                                                }
                                            }}
                                            placeholder="List item..."
                                            className="flex-1 bg-transparent border-b border-neutral-800/50 focus:border-orange-500/50 py-1.5 text-sm outline-none text-neutral-300 placeholder:text-neutral-700"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const newList = bulletList.filter((_, i) => i !== idx);
                                                handleContentChange(newList.length ? newList : [""]);
                                            }}
                                            className="mt-1 p-1 text-neutral-700 hover:text-red-500 opacity-0 group-hover/bullet:opacity-100 transition-opacity"
                                        >
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => handleContentChange([...bulletList, ""])}
                                    className="flex items-center gap-1.5 text-xs text-orange-500 hover:text-orange-400 font-medium px-2 py-1 mt-1"
                                >
                                    <Plus className="w-3.5 h-3.5" />
                                    Add Item
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Remove Block */}
                <button
                    onClick={onRemove}
                    className="mt-2 p-1.5 text-neutral-700 hover:text-red-500 transition-colors rounded-md hover:bg-neutral-800 sm:opacity-0 group-hover:opacity-100"
                    title="Remove Block"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
