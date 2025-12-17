import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY || "",
});

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No audio file provided" }, { status: 400 });
        }

        if (!process.env.GROQ_API_KEY) {
            return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
        }

        const transcription = await groq.audio.transcriptions.create({
            file: file,
            model: "distil-whisper-large-v3-en",
            response_format: "json",
            temperature: 0.0,
        });

        return NextResponse.json({ text: transcription.text });
    } catch (error) {
        console.error("Transcription error:", error);
        return NextResponse.json(
            { error: "Failed to transcribe audio" },
            { status: 500 }
        );
    }
}
