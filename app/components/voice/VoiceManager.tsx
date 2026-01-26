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
    message?: string;
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

    // New state for field-specific voice input
    const [focusedField, setFocusedField] = useState<{
        name: string;
        type: string;
        placeholder: string;
    } | null>(null);
    const [voiceMode, setVoiceMode] = useState<'bulk' | 'field'>('field');

    const recognitionRef = useRef<SpeechRecognition | null>(null);
    const isListeningRef = useRef(false); // Helper ref for immediate logic
    const lastFocusedFieldRef = useRef<HTMLElement | null>(null);
    const transcriptRef = useRef(""); // Use a ref to capture the latest transcript for processing

    useEffect(() => {
        // Track focus shifts to capture the target field even if focus moves to the mic button
        const handleFocusIn = (e: FocusEvent) => {
            const element = e.target as HTMLElement;
            if (element?.getAttribute('data-voice-enabled') === 'true') {
                lastFocusedFieldRef.current = element;
            }
        };

        document.addEventListener('focusin', handleFocusIn);

        // Initialize SpeechRecognition
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = true;

            recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
                // ZOMBIE FIX: strict check
                if (!isListeningRef.current) return;

                let finalTranscript = "";
                for (let i = 0; i < event.results.length; i++) {
                    const result = event.results[i];
                    if (result && result[0]) {
                        finalTranscript += result[0].transcript;
                    }
                }
                setTranscript(finalTranscript);
                transcriptRef.current = finalTranscript;
            };

            recognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
                console.error("Speech Recognition Error:", event.error);
                if (event.error === "not-allowed") {
                    setShowPermissionHelp(true);
                    toast.error("Microphone blocked.");
                }
                stopRecordingState();
            };

            recognitionRef.current.onend = () => {
                // Auto-stop logic if needed
                if (isListeningRef.current) {
                    stopRecordingState();
                }
            };
        }

        return () => {
            document.removeEventListener('focusin', handleFocusIn);
        };
    }, []);

    const stopRecordingState = () => {
        isListeningRef.current = false;
        setIsListening(false);

        // SaaS Polish: Remove visual pulse from any field
        document.querySelectorAll('.voice-field-active').forEach(el => {
            el.classList.remove('voice-field-active');
        });
    };

    const checkMicrophoneAccess = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            stream.getTracks().forEach((track) => track.stop());
            return { success: true };
        } catch (error: any) {
            return {
                success: false,
                errorName: error.name || "UnknownError",
            };
        }
    };

    const handleProceed = async (finalText: string) => {
        if (!finalText.trim()) return;

        setIsProcessing(true);
        try {
            // Unified Voice-Action API: Handles intelligence (direct-fill vs extraction) in one call
            const response = await fetch("/api/voice-action", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    transcript: finalText,
                    focusedField: focusedField // Pass current context (name, placeholder, type)
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Action failed");
            }

            const { updates, summary } = await response.json();

            // Apply all updates returned by the AI
            const fieldPaths = Object.keys(updates);
            if (fieldPaths.length > 0) {
                fieldPaths.forEach(path => {
                    const value = updates[path];
                    setValue(path as any, value, {
                        shouldValidate: true,
                        shouldDirty: true,
                        shouldTouch: true
                    });
                });

                // SaaS Polish: Show intelligent summary
                toast.success(summary || `Updated ${fieldPaths.length} fields`);
            } else {
                toast.info("No actionable data found in transcript");
            }

            setShowModal(false);
            setTranscript("");
            transcriptRef.current = "";
            setFocusedField(null);
        } catch (err: any) {
            console.error(err);
            toast.error(err.message || "Failed to process voice action");
        } finally {
            setIsProcessing(false);
        }
    };

    const toggleListening = useCallback(async () => {
        if (!recognitionRef.current) {
            toast.error("Voice input is not supported in this browser.");
            return;
        }

        if (isListening) {
            // STOP COMMAND
            stopRecordingState();
            recognitionRef.current.stop();

            // SaaS Grade UX: If in field mode, auto-proceed. Otherwise show modal for review.
            setTimeout(() => {
                const finalTranscript = transcriptRef.current;
                if (!finalTranscript.trim()) return;

                if (voiceMode === 'field' && focusedField) {
                    handleProceed(finalTranscript);
                } else {
                    setShowModal(true);
                }
            }, 300);
        } else {
            // START COMMAND
            const result = await checkMicrophoneAccess();

            if (!result.success) {
                if (result.errorName === "NotAllowedError" || result.errorName === "PermissionDeniedError") {
                    setShowPermissionHelp(true);
                } else {
                    toast.error("Microphone check failed.");
                }
                return;
            }

            // Detect focused field
            const activeElement = document.activeElement as HTMLElement;
            const targetElement = (activeElement?.getAttribute('data-voice-enabled') === 'true')
                ? activeElement
                : lastFocusedFieldRef.current;

            const isVoiceEnabled = targetElement?.getAttribute('data-voice-enabled') === 'true';

            if (isVoiceEnabled && targetElement) {
                const fieldInfo = {
                    name: targetElement.getAttribute('data-field-name') || targetElement.getAttribute('name') || '',
                    type: targetElement.getAttribute('data-field-type') || targetElement.getAttribute('type') || 'text',
                    placeholder: targetElement.getAttribute('data-field-placeholder') || targetElement.getAttribute('placeholder') || ''
                };
                setFocusedField(fieldInfo);
                setVoiceMode('field');

                // SaaS Polish: Add visual pulse to the field
                targetElement.classList.add('voice-field-active');

                toast.info(`Recording for: ${fieldInfo.placeholder || fieldInfo.name}`);
            } else {
                setFocusedField(null);
                setVoiceMode('bulk');
                toast.info("Listening for all fields...");
            }

            setTranscript("");
            transcriptRef.current = "";
            setShowPermissionHelp(false);
            try {
                isListeningRef.current = true;
                setIsListening(true);
                recognitionRef.current.start();
            } catch (err) {
                console.error(err);
                toast.error("Failed to start recording");
                stopRecordingState();
            }
        }
    }, [isListening, focusedField, voiceMode]);

    return (
        <>
            <VoiceMicrophone isListening={isListening} onToggle={toggleListening} />

            <TranscriptModal
                isOpen={showModal}
                transcript={transcript}
                isProcessing={isProcessing}
                onClose={() => setShowModal(false)}
                onProceed={handleProceed}
                fieldContext={focusedField}
                mode={voiceMode}
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
                            <p className="text-neutral-400 text-sm">Permission was denied.</p>
                        </div>
                        <div className="bg-neutral-950 rounded-lg p-4 text-left space-y-3 text-sm border border-neutral-800">
                            <p className="font-semibold text-white">Enable access:</p>
                            <ol className="list-decimal list-inside space-y-2 text-neutral-400">
                                <li>Click <span className="text-white font-medium">Lock Icon 🔒</span> in URL bar.</li>
                                <li>Toggle <strong>Microphone</strong> to <span className="text-green-500 font-medium">Allow</span>.</li>
                                <li>Refresh.</li>
                            </ol>
                        </div>
                        <div className="flex gap-3">
                            <button onClick={() => setShowPermissionHelp(false)} className="flex-1 px-4 py-2 rounded-lg bg-neutral-800 text-white hover:bg-neutral-700 transition">Close</button>
                            <button onClick={() => window.location.reload()} className="flex-1 px-4 py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition">Reload Page</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
