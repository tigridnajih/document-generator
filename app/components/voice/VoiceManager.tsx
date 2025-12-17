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
                    toast.error("Microphone access denied");
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
        </>
    );
}
