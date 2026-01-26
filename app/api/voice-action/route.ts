import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || "",
});

const FIELD_SCHEMA = `
CLIENT INFO:
- clientDetails.clientName (Name)
- clientDetails.clientCompany (Company)
- clientDetails.clientEmail (Email)
- clientDetails.clientGstIn (GSTIN)
- clientDetails.projectNumber (Project Number)
- clientDetails.date (Date)
- clientDetails.clientLocality (Locality)
- clientDetails.clientCity (City)
- clientDetails.clientPincode (Pincode)
- clientDetails.clientState (State)

INVOICE/DOC INFO:
- invoiceDetails.invoiceNumber (Invoice Number)
- invoiceDetails.invoiceDate (Invoice Date)

PROPOSAL CONTENT:
- scopeOfWork.introduction (Introduction)
- scopeOfWork.objectives (Project Objectives)
- scopeOfWork.keyFeatures (Key Features)

ESTIMATION/ITEMS (Array):
- estimation.[index].description (Item Name/Description)
- estimation.[index].rate (Rate/Price)
- estimation.[index].qty (Quantity/Qty)

INVOICE ITEMS (Array):
- items.[index].name (Item Name)
- items.[index].rate (Rate)
- items.[index].quantity (Quantity)
`;

export async function POST(req: Request) {
    try {
        let transcript = "";
        let focusedField = null;

        const contentType = req.headers.get("content-type") || "";

        if (contentType.includes("multipart/form-data")) {
            // CASE 1: Audio file upload
            const formData = await req.formData();
            const audioFile = formData.get("audio") as Blob;
            const focusedFieldStr = formData.get("focusedField") as string;
            focusedField = focusedFieldStr ? JSON.parse(focusedFieldStr) : null;

            if (!audioFile) {
                return NextResponse.json({ error: "No audio provided" }, { status: 400 });
            }

            // Transcribe with Whisper
            const transcription = await openai.audio.transcriptions.create({
                file: new File([audioFile], "audio.webm", { type: "audio/webm" }),
                model: "whisper-1",
            });
            transcript = transcription.text;
        } else {
            // CASE 2: Manual text submission (JSON)
            const body = await req.json();
            transcript = body.transcript;
            focusedField = body.focusedField;
        }

        if (!transcript) {
            return NextResponse.json({ error: "No transcript provided" }, { status: 400 });
        }

        if (!process.env.OPENAI_API_KEY) {
            return NextResponse.json({ error: "OpenAI API Key not configured" }, { status: 500 });
        }

        // STEP 2: Process with GPT-4o-mini (Semantic Extraction)
        const systemPrompt = `
You are a high-grade SaaS voice intelligence engine. Your task is to extract structured data from a transcript and map it to form fields.

FORM SCHEMA:
${FIELD_SCHEMA}

FOCUSED FIELD CONTEXT:
${focusedField ? `User is currently focused on: ${focusedField.name} (${focusedField.placeholder})` : 'No field is currently focused.'}

EXTRACTION RULES:
1. ANALYSIS FIRST: Determine if the user is providing a single value for the focused field OR if the transcript contains multiple data points (compound command).
2. DIRECT FILL: If the user JUST spoke a value for the focused field (e.g., focused on name, said "John"), return that value mapped to the focused field path.
3. ROW-AWARE SPLITTING (CRITICAL): If the user is focused on a field within a row (like estimation.0.description) and mentions other row attributes (rate, price, qty, quantity), ALWAYS split them.
4. INDEX PERSISTENCE: When extracting for a row, always use the index from the focused field.
5. SEMANTIC MAPPING: Understand synonyms ("price"/"cost" -> "rate", "qty"/"amount" -> "quantity").
6. CLEANING: Fix spelling, proper capitalization, and convert numbers to digits. 
7. FORMATTING: Return RAW JSON only. Map paths as keys and formatted values as values.
8. NO QUOTES: Do NOT wrap values in extra quotes.
9. MULTI-FIELD: If unrelated fields are mentioned, map them to their global paths.

RESPONSE FORMAT (JSON):
{
  "updates": {
    "fieldPath1": "value1",
    "fieldPath2": 123
  },
  "summary": "Short success message (e.g., 'Updated row details' or 'Set Client Name')"
}
`;

        const completion = await openai.chat.completions.create({
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: `Transcript: "${transcript}"` },
            ],
            model: "gpt-4o-mini",
            temperature: 0,
            response_format: { type: "json_object" },
        });

        const content = completion.choices[0]?.message?.content;
        if (!content) {
            throw new Error("No content from OpenAI");
        }

        const result = JSON.parse(content);

        // Sanitize response: strip surrounding quotes from strings
        if (result.updates) {
            Object.keys(result.updates).forEach(key => {
                if (typeof result.updates[key] === 'string') {
                    result.updates[key] = result.updates[key].replace(/^["']|["']$/g, '');
                }
            });
        }

        return NextResponse.json({
            success: true,
            transcript: transcript,
            updates: result.updates || {},
            summary: result.summary || "Processed voice input"
        });
    } catch (error: any) {
        console.error("Voice-Action error details:", error);
        return NextResponse.json(
            { error: error?.message || "Failed to process voice action" },
            { status: 500 }
        );
    }
}
