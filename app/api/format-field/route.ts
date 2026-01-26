import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || "",
});

function getFieldPrompt(fieldName: string, fieldType: string, placeholder: string): string {
    const lowerName = fieldName.toLowerCase();
    const lowerPlaceholder = placeholder.toLowerCase();

    // Number fields - convert words to numbers
    if (fieldType === "number" || lowerName.includes("rate") || lowerName.includes("quantity") || lowerName.includes("qty") || lowerName.includes("price") || lowerName.includes("amount")) {
        return `You are a number converter. Convert spoken numbers and amounts to digits only.
Examples:
- "five thousand" → "5000"
- "twenty three" → "23"
- "one hundred fifty" → "150"
- "two point five" → "2.5"

Rules:
1. Return ONLY the numeric value, no currency symbols or text
2. If the input is already a number, return it as-is
3. If no number is mentioned, return "0"
4. Round to 2 decimal places if needed
5. Do NOT wrap the output in quotes

Input: "{{INPUT}}"
Output (number only):`;
    }

    // Date fields - parse natural language dates
    if (fieldType === "date" || lowerName.includes("date")) {
        return `You are a date parser. Convert natural language dates to YYYY-MM-DD format.
Examples:
- "tomorrow" → calculate tomorrow's date
- "next monday" → calculate next Monday
- "15th march 2024" → "2024-03-15"
- "march 15" → "2024-03-15" (use current year)

Rules:
1. Return ONLY the date in YYYY-MM-DD format
2. If already in correct format, return as-is
3. If unclear, use today's date
4. Do NOT wrap the output in quotes

Today's date: ${new Date().toISOString().split('T')[0]}

Input: "{{INPUT}}"
Output (YYYY-MM-DD only):`;
    }

    // Email fields
    if (fieldType === "email" || lowerName.includes("email")) {
        return `You are an email formatter. Format spoken email addresses correctly.
Examples:
- "john dot doe at gmail dot com" → "john.doe@gmail.com"
- "alex underscore smith at company dot co dot uk" → "alex_smith@company.co.uk"

Rules:
1. Replace "at" with "@"
2. Replace "dot" with "."
3. Replace "underscore" with "_"
4. Convert to lowercase
5. Remove all spaces
6. Do NOT wrap the output in quotes

Input: "{{INPUT}}"
Output (email only):`;
    }

    // Textarea fields - format as professional text
    if (fieldType === "textarea" || lowerName.includes("introduction") || lowerName.includes("objective") || lowerName.includes("description") || lowerName.includes("feature") || lowerName.includes("deliverable")) {
        return `You are a professional business writer. Format the spoken text into clear, professional business content.

Rules:
1. Fix all spelling and grammar errors
2. Capitalize properly (first letter of sentences, proper nouns)
3. Expand abbreviations where appropriate (e.g., "web dev" → "web development")
4. Make it concise and professional
5. Use proper punctuation
6. Format as complete sentences or bullet points if multiple items mentioned
7. Maintain the core meaning and intent
8. Do NOT wrap the output in quotes

Input: "{{INPUT}}"
Output (formatted professional text):`;
    }

    // Name fields - proper capitalization
    if (lowerName.includes("name") || lowerName.includes("client") || lowerName.includes("company")) {
        return `You are a name formatter. Format names with proper capitalization.
Examples:
- "john doe" → "John Doe"
- "microsoft corporation" → "Microsoft Corporation"
- "alex" → "Alex"

Rules:
1. Capitalize first letter of each word
2. Fix common spelling errors (e.g., "mikrosoft" → "Microsoft")
3. Keep acronyms uppercase (e.g., "ibm" → "IBM")
4. Remove extra spaces
5. Do NOT wrap the output in quotes

Input: "{{INPUT}}"
Output (properly formatted name):`;
    }

    // Location fields
    if (lowerName.includes("city") || lowerName.includes("state") || lowerName.includes("locality") || lowerName.includes("location")) {
        return `You are a location formatter. Format location names properly.
Examples:
- "new york" → "New York"
- "bangalore" → "Bangalore"
- "kerala" → "Kerala"

Rules:
1. Capitalize properly
2. Fix spelling errors
3. Use standard names (e.g., "Bengaluru" can be "Bangalore" if commonly used)
4. Do NOT wrap the output in quotes

Input: "{{INPUT}}"
Output (formatted location):`;
    }

    // Default - general text formatting
    return `You are a text formatter. Clean up and format the spoken text properly.

Rules:
1. Fix spelling errors
2. Capitalize first letter
3. Remove extra spaces
4. Keep it concise
5. Maintain the original meaning
6. Do NOT wrap the output in quotes

Input: "{{INPUT}}"
Output (formatted text):`;
}

export async function POST(req: Request) {
    const rawKey = process.env.OPENAI_API_KEY || "";
    console.log("Debug [Format-Field]: Key Loaded?", !!rawKey);
    console.log("Debug [Format-Field]: Key Prefix:", rawKey.substring(0, 10) + "...");
    console.log("Debug [Format-Field]: Key Suffix:", "..." + rawKey.substring(rawKey.length - 4));

    try {
        const body = await req.json();
        const { text, fieldName, fieldType, placeholder } = body;

        if (!text) {
            return NextResponse.json({ error: "No text provided" }, { status: 400 });
        }

        if (!process.env.OPENAI_API_KEY) {
            return NextResponse.json({ error: "OpenAI API Key not configured" }, { status: 500 });
        }

        const systemPrompt = getFieldPrompt(
            fieldName || "",
            fieldType || "text",
            placeholder || ""
        );

        const userPrompt = systemPrompt.replace("{{INPUT}}", text);

        const completion = await openai.chat.completions.create({
            messages: [
                { role: "system", content: "You are a helpful assistant that formats user input based on context." },
                { role: "user", content: userPrompt },
            ],
            model: "gpt-4o-mini",
            temperature: 0,
            max_tokens: 500,
        });

        let content = completion.choices[0]?.message?.content?.trim() || "";
        if (!content) {
            throw new Error("No content from OpenAI");
        }

        // Clean up the response: strip surrounding quotes
        content = content.replace(/^["']|["']$/g, '');

        return NextResponse.json({ success: true, formattedValue: content });
    } catch (error: any) {
        console.error("Format-Field error details:", error);
        return NextResponse.json(
            { error: error?.message || "Failed to format field" },
            { status: 500 }
        );
    }
}
