import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || "",
});

const FIELD_SCHEMA = `
AVAILABLE FIELDS:
- clientDetails.clientName (Client Name)
- clientDetails.clientCompany (Company Name)
- clientDetails.clientEmail (Email Address)
- clientDetails.clientGstIn (Client GSTIN)
- clientDetails.projectNumber (Project Number)
- clientDetails.date (Date)
- clientDetails.clientLocality (Locality)
- clientDetails.clientCity (City)
- clientDetails.clientPincode (Pincode)
- clientDetails.clientState (State)
- invoiceDetails.invoiceNumber (Invoice Number)
- invoiceDetails.invoiceDate (Invoice Date)
- scopeOfWork.introduction (Introduction)
- scopeOfWork.objectives (Project Objectives)
- scopeOfWork.keyFeatures (Key Features)
- items.0.name (Item Name/Description)
- items.0.rate (Rate/Price)
- items.0.quantity (Quantity/Qty)
`;

export async function POST(req: Request) {
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
                {
                    role: "system",
                    content: `You are a semantic field detector. Analyze the user's transcript and determine if they are trying to fill a specific field by speaking its name first.

${FIELD_SCHEMA}

RULES:
1. If the transcript starts with a field name or its synonym (e.g., "address" for "locality"), identify the field.
2. Return a JSON object with:
   - detected: boolean
   - fieldPath: string (e.g., "clientDetails.clientName")
   - fieldType: string ("text", "number", "email", "date", or "textarea")
   - fieldPlaceholder: string (the user-friendly name)
   - remainingText: the actual value spoken after the field name
3. If no field name is detected at the start, return { "detected": false }.
4. Be smart about synonyms: "bill to" -> clientName, "tax id" -> clientGstIn, "cost" -> items.0.rate, etc.
5. If the user just says a value without a field name, return { "detected": false }.

Return RAW JSON only.`
                },
                { role: "user", content: `Transcript: "${text}"` },
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

        return NextResponse.json({
            success: true,
            ...result
        });
    } catch (error: any) {
        console.error("Detect-Field error details:", error);
        return NextResponse.json(
            { error: error?.message || "Failed to detect field" },
            { status: 500 }
        );
    }
}
