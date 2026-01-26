import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || "",
});

const systemPrompt = `
You are a professional data extraction assistant for a high-grade SaaS document generator.
Your goal is to extract structured data from voice transcripts with extreme precision.

EXTRACTION DOMAINS:
- clientDetails: { clientName, clientCompany, clientEmail, clientLocality, clientCity, clientPincode, clientState }
- invoiceDetails: { invoiceNumber, invoiceDate }
- scopeOfWork: { introduction, objectives, keyFeatures }
- items: List of { name, rate, quantity }
- gstList: List of { type (CGST/SGST/IGST), rate }

RULES:
1. COMPOUND COMMANDS: Handle multiple fields in one go (e.g., "Set name to John and company to Apple").
2. SEMANTIC MAPPING: Understand synonyms (e.g., "bill to" -> clientName, "intro" -> introduction).
3. MULTILINGUAL: Translate Indian languages (Malayalam, Hindi, etc.) and transliterate names to English.
4. CLEANLINESS: Only extract intentional data. Ignore filler words like "um", "ah", "please fill".
5. JSON ONLY: Return raw JSON. Do NOT include markdown blocks.

Response Format:
{ "clientDetails": { ... }, "invoiceDetails": { ... }, "scopeOfWork": { ... }, "items": [ ... ], "gstList": [ ... ] }
`;

export async function POST(req: Request) {
    console.log("Debug [Extract]: OPENAI_API_KEY loaded?", !!process.env.OPENAI_API_KEY);

    try {
        const body = await req.json();
        const { text } = body;

        if (!text) {
            return NextResponse.json({ error: "No text provided" }, { status: 400 });
        }

        if (!process.env.OPENAI_API_KEY) {
            return NextResponse.json({ error: "OpenAI API Key not configured" }, { status: 500 });
        }

        const completion = await openai.chat.completions.create({
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: `Extract data from this transcript: "${text}"` },
            ],
            model: "gpt-4o-mini",
            temperature: 0,
            response_format: { type: "json_object" },
        });

        const content = completion.choices[0]?.message?.content;
        if (!content) {
            throw new Error("No content from OpenAI");
        }

        const extractedData = JSON.parse(content);

        return NextResponse.json({ success: true, data: extractedData });
    } catch (error: any) {
        console.error("Extraction error details:", error);
        return NextResponse.json(
            { error: error?.message || "Failed to extract data" },
            { status: 500 }
        );
    }
}
