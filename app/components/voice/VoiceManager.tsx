"use client";

import { useFormContext } from "react-hook-form";
import { useState, useCallback, useRef, useEffect } from "react";
import { toast } from "sonner";
import { VoiceMicrophone } from "./VoiceMicrophone";
import { TranscriptModal } from "./TranscriptModal";

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

    // MediaRecorder Refs
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const lastFocusedFieldRef = useRef<HTMLElement | null>(null);
    const streamRef = useRef<MediaStream | null>(null);

    useEffect(() => {
        // Track focus shifts to capture the target field even if focus moves to the mic button
        const handleFocusIn = (e: FocusEvent) => {
            const element = e.target as HTMLElement;
            if (element?.getAttribute('data-voice-enabled') === 'true') {
                lastFocusedFieldRef.current = element;
            }
        };

        document.addEventListener('focusin', handleFocusIn);
        return () => {
            document.removeEventListener('focusin', handleFocusIn);
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    const stopRecordingState = () => {
        setIsListening(false);
        // SaaS Polish: Remove visual pulse from any field
        document.querySelectorAll('.voice-field-active').forEach(el => {
            el.classList.remove('voice-field-active');
        });
    };

    const processAudio = async (audioBlob: Blob) => {
        setIsProcessing(true);
        const processingToast = toast.loading(focusedField ? "Processing your input..." : "Analyzing voice data...");

        try {
            const formData = new FormData();
            formData.append("audio", audioBlob, "recording.webm");
            if (focusedField) {
                formData.append("focusedField", JSON.stringify(focusedField));
            }

            const response = await fetch("/api/voice-action", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Whisper processing failed");
            }

            const { updates, summary, transcript: returnedTranscript } = await response.json();

            setTranscript(returnedTranscript);

            // Determine if we should show the modal or auto-fill
            if (voiceMode === 'field' && focusedField) {
                // AUTO-PROCEED for single fields (Ultra SaaS UX)
                const fieldPaths = Object.keys(updates);
                fieldPaths.forEach(path => {
                    setValue(path as any, updates[path], {
                        shouldValidate: true,
                        shouldDirty: true,
                        shouldTouch: true
                    });
                });
                toast.dismiss(processingToast);
                toast.success(summary || `Updated ${focusedField.placeholder}`);
            } else {
                // Show modal for bulk mode or if multiple fields were detected
                toast.dismiss(processingToast);
                // We need to wait for the transcript to be set before showing modal
                // so handleProceed can use the latest value if they edit it
                setShowModal(true);
            }
        } catch (err: any) {
            console.error(err);
            toast.dismiss(processingToast);
            toast.error(err.message || "Failed to process voice action");
        } finally {
            setIsProcessing(false);
        }
    };

    const toggleListening = useCallback(async () => {
        if (isListening) {
            // STOP RECORDING
            if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
                mediaRecorderRef.current.stop();
            }
            stopRecordingState();
        } else {
            // START RECORDING
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                streamRef.current = stream;

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
                    targetElement.classList.add('voice-field-active');
                    toast.info(`Recording for: ${fieldInfo.placeholder || fieldInfo.name}`);
                } else {
                    setFocusedField(null);
                    setVoiceMode('bulk');
                    toast.info("Listening for multiple fields...");
                }

                audioChunksRef.current = [];
                const mediaRecorder = new MediaRecorder(stream, {
                    mimeType: MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/ogg'
                });

                mediaRecorder.ondataavailable = (event) => {
                    if (event.data.size > 0) {
                        audioChunksRef.current.push(event.data);
                    }
                };

                mediaRecorder.onstop = () => {
                    const audioBlob = new Blob(audioChunksRef.current, { type: audioChunksRef.current[0].type });
                    processAudio(audioBlob);
                    // Cleanup tracks
                    stream.getTracks().forEach(track => track.stop());
                };

                mediaRecorderRef.current = mediaRecorder;
                mediaRecorder.start();
                setIsListening(true);
            } catch (err: any) {
                console.error("Microphone Access Error:", err);
                if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
                    setShowPermissionHelp(true);
                } else {
                    toast.error("Could not access microphone.");
                }
            }
        }
    }, [isListening, voiceMode, focusedField]);

    const handleManualProceed = async (finalText: string) => {
        // This is called from the TranscriptModal
        if (!finalText.trim()) return;

        setIsProcessing(true);
        try {
            const response = await fetch("/api/voice-action", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    transcript: finalText,
                    focusedField: focusedField
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Action failed");
            }

            const { updates, summary } = await response.json();

            const fieldPaths = Object.keys(updates);
            if (fieldPaths.length > 0) {
                fieldPaths.forEach(path => {
                    setValue(path as any, updates[path], {
                        shouldValidate: true,
                        shouldDirty: true,
                        shouldTouch: true
                    });
                });
                toast.success(summary || `Updated ${fieldPaths.length} fields`);
            } else {
                toast.info("No actionable data found");
            }

            setShowModal(false);
            setTranscript("");
            setFocusedField(null);
        } catch (err: any) {
            console.error(err);
            toast.error(err.message || "Failed to process voice action");
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
                onProceed={handleManualProceed}
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
