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
        let arrayContext: Record<string, number> = {};
        let currentValues: Record<string, any> = {};

        const contentType = req.headers.get("content-type") || "";

        if (contentType.includes("multipart/form-data")) {
            // CASE 1: Audio file upload
            const formData = await req.formData();
            const audioFile = formData.get("audio") as Blob;
            const focusedFieldStr = formData.get("focusedField") as string;
            focusedField = focusedFieldStr ? JSON.parse(focusedFieldStr) : null;

            const arrayContextStr = formData.get("arrayContext") as string;
            arrayContext = arrayContextStr ? JSON.parse(arrayContextStr) : {};

            const currentValuesStr = formData.get("currentValues") as string;
            currentValues = currentValuesStr ? JSON.parse(currentValuesStr) : {};

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
            // CASE 2: Manual text submission (JSON / Retrying)
            const body = await req.json();
            transcript = body.transcript;
            focusedField = body.focusedField;
            arrayContext = body.arrayContext || {};
            currentValues = body.currentValues || {};
        }

        if (!transcript) {
            return NextResponse.json({ error: "No transcript provided" }, { status: 400 });
        }

        if (!process.env.OPENAI_API_KEY) {
            return NextResponse.json({ error: "OpenAI API Key not configured" }, { status: 500 });
        }

        // STEP 2: Process with GPT-4o-mini (Semantic Extraction + Multilingual NLU)
        const systemPrompt = `
You are an Ultra-Production SaaS voice engine for a professional proposal generator.

FORM SCHEMA:
${FIELD_SCHEMA}

CONTEXT:
- Focused Field: ${focusedField ? `${focusedField.name} (${focusedField.placeholder})` : 'None'}
- Current Values: ${JSON.stringify(currentValues)}
- Array Lengths: ${JSON.stringify(arrayContext)}
- Today: ${new Date().toISOString().split('T')[0]}

LANGUAGES:
- Support English, Malayalam, Tamil, Hindi, Telugu, Kannada, Arabic.
- Names/Places: Transliterate phonetically to English script (e.g. "കണ്ണൂർ" -> "Kannur").
- Intent: Translate non-English actions into English field updates.

CORE LOGIC:
1. APPEND VS REPLACE:
   - "Add to...", "Also include...", "Mention..." -> Append to existing value in CURRENT VALUES.
   - "Set...", "Change...", "Replace..." -> Overwrite existing value.
2. DYNAMIC ROW ADDITION: If user says "add", "new", or "another" row, use array context lengths as new indices.
3. ROW-AWARE SPLITTING: Map multiple row attributes (rate, qty) to the same index.
4. FORMATTING: Return RAW JSON only. Map paths to values. No extra quotes.
5. DATES: Always YYYY-MM-DD.

RESPONSE FORMAT (JSON):
{
  "updates": { "field.path": "New or Appended Value" },
  "summary": "Short user-facing summary (e.g. 'Appended to objectives')"
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
