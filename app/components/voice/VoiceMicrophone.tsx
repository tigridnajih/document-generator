"use client";

import { Mic, Square } from "lucide-react";
import { cn } from "@/lib/utils";

interface VoiceMicrophoneProps {
    isListening: boolean;
    onToggle: () => void;
}

export function VoiceMicrophone({ isListening, onToggle }: VoiceMicrophoneProps) {
    return (
        <div className="fixed bottom-8 right-8 z-50">
            {isListening && (
                <>
                    <div className="absolute inset-0 bg-red-500 rounded-full animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite] opacity-50" />
                    <div className="absolute inset-[-8px] bg-red-500/20 rounded-full animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite] opacity-30" />
                </>
            )}
            <button
                onClick={onToggle}
                type="button"
                className={cn(
                    "relative p-4 rounded-full shadow-lg transition-all duration-300 ring-offset-2 ring-offset-neutral-950",
                    isListening
                        ? "bg-red-500 hover:bg-red-600 ring-2 ring-red-500/50 scale-110 shadow-red-500/20"
                        : "bg-orange-500 hover:bg-orange-600 hover:scale-110 shadow-orange-500/20"
                )}
                title={isListening ? "Stop Recording" : "Start Voice Input"}
            >
                {isListening ? (
                    <Square className="w-6 h-6 text-white fill-current" />
                ) : (
                    <Mic className="w-6 h-6 text-white" />
                )}
            </button>
        </div>
    );
}
