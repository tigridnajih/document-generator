"use client";

import { useFormContext } from "react-hook-form";
import { useState, useCallback, useRef } from "react";
import { toast } from "sonner";
import { VoiceMicrophone } from "./VoiceMicrophone";
import { TranscriptModal } from "./TranscriptModal";

export function VoiceManager() {
    const { setValue } = useFormContext();
    const [isListening, setIsListening] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [transcript, setTranscript] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);

    // MediaRecorder refs
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const streamRef = useRef<MediaStream | null>(null);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;

            const recorder = new MediaRecorder(stream);
            mediaRecorderRef.current = recorder;
            chunksRef.current = [];

            recorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    chunksRef.current.push(e.data);
                }
            };

            recorder.onstop = async () => {
                const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
                await handleTranscribe(audioBlob);

                // Critical Cleanup
                if (streamRef.current) {
                    streamRef.current.getTracks().forEach(track => track.stop());
                    streamRef.current = null;
                }
                mediaRecorderRef.current = null;
                setIsListening(false);
            };

            recorder.start();
            setIsListening(true);
            toast.info("Listening... Speak now.");
        } catch (err) {
            console.error("Failed to start recording:", err);
            toast.error("Microphone access blocked or not found.");
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
            mediaRecorderRef.current.stop();
            // UI update happens in onstop
        }
    };

    const toggleListening = useCallback(() => {
        if (isListening) {
            stopRecording();
        } else {
            startRecording();
        }
    }, [isListening]);

    const handleTranscribe = async (audioBlob: Blob) => {
        setIsProcessing(true);
        // Show modal loading state immediately if desired, or wait for text
        // Current UX: wait for text then show modal. 
        // Let's show a loading toast for feedback
        const loadingToast = toast.loading("Processing audio...");

        try {
            const formData = new FormData();
            formData.append("file", audioBlob, "recording.webm");

            const response = await fetch("/api/transcribe", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Transcription failed");
            }

            const { text } = await response.json();
            setTranscript(text);
            setShowModal(true);
            toast.dismiss(loadingToast);
        } catch (err: any) {
            console.error(err);
            toast.error(err.message || "Failed to transcribe audio");
            toast.dismiss(loadingToast);
            setIsListening(false); // Valid safety fallback
        } finally {
            setIsProcessing(false);
        }
    };

    const handleProceed = async (finalText: string) => {
        setIsProcessing(true);
        try {
            const response = await fetch("/api/extract", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: finalText }),
            });

            if (!response.ok) throw new Error("Extraction failed");

            const { data } = await response.json();

            let updatedCount = 0;
            const processFields = (obj: any, prefix: string = "") => {
                Object.keys(obj).forEach(key => {
                    const value = obj[key];
                    if (value !== null && value !== undefined && value !== "") {
                        if (typeof value === 'object' && !Array.isArray(value)) {
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
