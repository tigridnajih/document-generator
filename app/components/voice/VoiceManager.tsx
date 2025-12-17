"use client";

import { useFormContext } from "react-hook-form";
import { useState, useCallback, useRef, useEffect } from "react";
import { toast } from "sonner";
import { VoiceMicrophone } from "./VoiceMicrophone";
import { TranscriptModal } from "./TranscriptModal";

// Define strict types for window.SpeechRecognition
type SpeechRecognitionEvent = Event & {
    results: {
        [index: number]: {
            [index: number]: {
                transcript: string;
            };
        };
        length: number;
    };
};

type SpeechRecognitionErrorEvent = Event & {
    error: string;
};

interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    start: () => void;
    stop: () => void;
    onresult: ((event: SpeechRecognitionEvent) => void) | null;
    onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
    onend: (() => void) | null;
}

interface SpeechRecognitionConstructor {
    new(): SpeechRecognition;
}

declare global {
    interface Window {
        SpeechRecognition?: SpeechRecognitionConstructor;
        webkitSpeechRecognition?: SpeechRecognitionConstructor;
    }
}

export function VoiceManager() {
    const { setValue } = useFormContext();
    const [isListening, setIsListening] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showPermissionHelp, setShowPermissionHelp] = useState(false);
    const [transcript, setTranscript] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);

    const recognitionRef = useRef<SpeechRecognition | null>(null);

    useEffect(() => {
        // Initialize SpeechRecognition
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = true;

            recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
                let finalTranscript = "";
                for (let i = 0; i < event.results.length; i++) {
                    const result = event.results[i];
                    if (result && result[0]) {
                        finalTranscript += result[0].transcript;
                    }
                }
                setTranscript(finalTranscript);
            };

            recognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
                console.error("Speech Recognition Error:", event.error);
                if (event.error === "not-allowed") {
                    setShowPermissionHelp(true);
                    toast.error("Microphone access blocked");
                }
                setIsListening(false);
            };

            recognitionRef.current.onend = () => {
                if (isListening) {
                    // If stopped unexpectedly but state says listening (e.g. silence timeout), we pause UI.
                    // But we want manual stop only. 
                    // Ideally we restart if we want 'always on', but here we want toggle.
                    // If we just sync state:
                    // setIsListening(false); 
                    // Actually, let's keep it simple: manual stop mainly. 
                    // If it stops by itself, we update UI.
                    setIsListening(false);
                }
            };
        }
    }, [isListening]);

    const toggleListening = useCallback(() => {
        if (!recognitionRef.current) {
            toast.error("Voice input is not supported in this browser.");
            return;
        }

        if (isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
            setShowModal(true);
        } else {
            setTranscript("");
            setShowPermissionHelp(false);
            try {
                recognitionRef.current.start();
                setIsListening(true);
                toast.info("Listening... Speak now.");
            } catch (err) {
                console.error(err);
                toast.error("Failed to start recording");
            }
        }
    }, [isListening]);

    const handleProceed = async (finalText: string) => {
        setIsProcessing(true);
        try {
            const response = await fetch("/api/extract", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: finalText }),
            });

            if (!response.ok) {
                throw new Error("Extraction failed");
            }

            const { data } = await response.json();

            let updatedCount = 0;

            // Helper to update fields if value is present
            const processFields = (obj: any, prefix: string = "") => {
                Object.keys(obj).forEach(key => {
                    const value = obj[key];
                    if (value !== null && value !== undefined && value !== "") {
                        // If it's a nested object (e.g. clientDetails), recurse?
                        // No, our schema returns flat objects inside keys like clientDetails.
                        // Wait, the API returns { clientDetails: { ... }, invoiceDetails: { ... } }

                        if (typeof value === 'object' && !Array.isArray(value)) {
                            // Recurse for nested objects
                            processFields(value, prefix ? `${prefix}.${key}` : key);
                        } else {
                            const fieldPath = prefix ? `${prefix}.${key}` : key;
                            setValue(fieldPath, value, { shouldValidate: true, shouldDirty: true });
                            updatedCount++;
                        }
                    }
                });
            };

            processFields(data);

            if (updatedCount > 0) {
                toast.success(`Updated ${updatedCount} fields successfully`);
            } else {
                toast.info("No matching fields found in transcript");
            }

            setShowModal(false);
            setTranscript("");

        } catch (err) {
            console.error(err);
            toast.error("Failed to process voice command");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <>
            <VoiceMicrophone isListening={isListening} onToggle={toggleListening} />
            <TranscriptModal
                isOpen={showModal}
                transcript={transcript}
                isProcessing={isProcessing}
                onClose={() => setShowModal(false)}
                onProceed={handleProceed}
            />

            {showPermissionHelp && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-[fade-in_0.2s_ease-out]">
                    <div className="bg-neutral-900 border border-neutral-800 rounded-xl w-full max-w-md shadow-2xl p-6 text-center space-y-6">
                        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto">
                            <div className="w-8 h-8 text-red-500">
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" x2="12" y1="19" y2="22" /></svg>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-bold text-white">Microphone Blocked</h3>
                            <p className="text-neutral-400 text-sm">
                                We cannot record your voice because permission was denied.
                            </p>
                        </div>

                        <div className="bg-neutral-950 rounded-lg p-4 text-left space-y-3 text-sm border border-neutral-800">
                            <p className="font-semibold text-white">How to enable:</p>
                            <ol className="list-decimal list-inside space-y-2 text-neutral-400">
                                <li>Click the <span className="text-white font-medium">Lock Icon 🔒</span> in your browser URL bar.</li>
                                <li>Find <strong>Microphone</strong> and toggle it to <span className="text-green-500 font-medium">Allow / On</span>.</li>
                                <li>Refresh the page.</li>
                            </ol>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowPermissionHelp(false)}
                                className="flex-1 px-4 py-2 rounded-lg bg-neutral-800 text-white hover:bg-neutral-700 transition"
                            >
                                Close
                            </button>
                            <button
                                onClick={() => window.location.reload()}
                                className="flex-1 px-4 py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition"
                            >
                                Reload Page
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
