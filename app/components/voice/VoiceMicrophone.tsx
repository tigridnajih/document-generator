"use client";

import { Mic, Square } from "lucide-react";
import { cn } from "@/lib/utils";

interface VoiceMicrophoneProps {
    isListening: boolean;
    onToggle: () => void;
}

export function VoiceMicrophone({ isListening, onToggle }: VoiceMicrophoneProps) {
    return (
        <button
            onClick={onToggle}
            type="button"
            className={cn(
                "fixed bottom-8 right-8 z-50 p-3 rounded-full backdrop-blur-md transition-all duration-300",
                "shadow-md hover:shadow-lg",
                isListening
                    ? "bg-red-500/90 hover:bg-red-600/90 animate-pulse"
                    : "bg-orange-500/90 hover:bg-orange-600/90 hover:scale-105"
            )}
            title={isListening ? "Stop Recording" : "Start Voice Input"}
        >
            {isListening ? (
                <Square className="w-5 h-5 text-white fill-current" />
            ) : (
                <Mic className="w-5 h-5 text-white" />
            )}
        </button>
    );
}
