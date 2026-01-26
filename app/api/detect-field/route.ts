import { NextResponse } from "next/server";

// Field mapping: maps common spoken names to actual field paths
const FIELD_MAPPINGS: Record<string, { path: string; type: string; placeholder: string }> = {
    // Client Information
    "client name": { path: "clientDetails.clientName", type: "text", placeholder: "Client Name" },
    "name": { path: "clientDetails.clientName", type: "text", placeholder: "Client Name" },
    "client company": { path: "clientDetails.clientCompany", type: "text", placeholder: "Company Name" },
    "company": { path: "clientDetails.clientCompany", type: "text", placeholder: "Company Name" },
    "company name": { path: "clientDetails.clientCompany", type: "text", placeholder: "Company Name" },
    "email": { path: "clientDetails.clientEmail", type: "email", placeholder: "Email Address" },
    "client email": { path: "clientDetails.clientEmail", type: "email", placeholder: "Email Address" },
    "gstin": { path: "clientDetails.clientGstIn", type: "text", placeholder: "Client GSTIN" },
    "gst number": { path: "clientDetails.clientGstIn", type: "text", placeholder: "Client GSTIN" },
    "project number": { path: "clientDetails.projectNumber", type: "text", placeholder: "Project Number" },
    "date": { path: "clientDetails.date", type: "date", placeholder: "Date" },
    "locality": { path: "clientDetails.clientLocality", type: "text", placeholder: "Locality" },
    "city": { path: "clientDetails.clientCity", type: "text", placeholder: "City" },
    "pincode": { path: "clientDetails.clientPincode", type: "number", placeholder: "Pincode" },
    "pin code": { path: "clientDetails.clientPincode", type: "number", placeholder: "Pincode" },
    "state": { path: "clientDetails.clientState", type: "text", placeholder: "State" },

    // Invoice Details
    "invoice number": { path: "invoiceDetails.invoiceNumber", type: "text", placeholder: "Invoice Number" },
    "invoice date": { path: "invoiceDetails.invoiceDate", type: "date", placeholder: "Invoice Date" },

    // Proposal Fields
    "introduction": { path: "scopeOfWork.introduction", type: "textarea", placeholder: "Introduction" },
    "intro": { path: "scopeOfWork.introduction", type: "textarea", placeholder: "Introduction" },
    "objectives": { path: "scopeOfWork.objectives", type: "textarea", placeholder: "Project Objectives" },
    "project objectives": { path: "scopeOfWork.objectives", type: "textarea", placeholder: "Project Objectives" },
    "key features": { path: "scopeOfWork.keyFeatures", type: "textarea", placeholder: "Key Features" },
    "features": { path: "scopeOfWork.keyFeatures", type: "textarea", placeholder: "Key Features" },

    // Common item fields (first item)
    "item name": { path: "items.0.name", type: "text", placeholder: "Item Name" },
    "item description": { path: "items.0.name", type: "text", placeholder: "Item Name" },
    "rate": { path: "items.0.rate", type: "number", placeholder: "Rate" },
    "price": { path: "items.0.rate", type: "number", placeholder: "Rate" },
    "quantity": { path: "items.0.quantity", type: "number", placeholder: "Quantity" },
    "qty": { path: "items.0.quantity", type: "number", placeholder: "Quantity" },
};

// Common field name patterns to detect
const FIELD_PATTERNS = [
    "client name",
    "company name",
    "company",
    "email",
    "introduction",
    "objectives",
    "features",
    "rate",
    "price",
    "quantity",
    "invoice number",
    "invoice date",
    "project number",
    "gstin",
    "gst number",
    "locality",
    "city",
    "pincode",
    "pin code",
    "state",
    "date",
    "name",
];

function detectFieldFromTranscript(transcript: string): {
    fieldName: string | null;
    remainingText: string;
    fieldInfo: { path: string; type: string; placeholder: string } | null;
} {
    const lowerTranscript = transcript.toLowerCase().trim();

    // Try to match field patterns at the start of the transcript
    for (const pattern of FIELD_PATTERNS) {
        // Check if transcript starts with the pattern
        if (lowerTranscript.startsWith(pattern)) {
            const fieldInfo = FIELD_MAPPINGS[pattern];
            if (fieldInfo) {
                // Extract the remaining text after the field name
                let remainingText = transcript.substring(pattern.length).trim();

                // Remove common separators like "is", ":", "-", etc.
                remainingText = remainingText.replace(/^(is|:|=|-|–)\s*/i, "").trim();

                return {
                    fieldName: pattern,
                    remainingText,
                    fieldInfo,
                };
            }
        }

        // Also check for pattern followed by common separators
        const patternWithSeparator = new RegExp(`^${pattern}\\s+(is|:|=|-|–)\\s+`, 'i');
        const match = lowerTranscript.match(patternWithSeparator);
        if (match) {
            const fieldInfo = FIELD_MAPPINGS[pattern];
            if (fieldInfo) {
                const remainingText = transcript.substring(match[0].length).trim();
                return {
                    fieldName: pattern,
                    remainingText,
                    fieldInfo,
                };
            }
        }
    }

    return {
        fieldName: null,
        remainingText: transcript,
        fieldInfo: null,
    };
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { text } = body;

        if (!text) {
            return NextResponse.json({ error: "No text provided" }, { status: 400 });
        }

        const result = detectFieldFromTranscript(text);

        return NextResponse.json({
            success: true,
            detected: result.fieldName !== null,
            fieldName: result.fieldName,
            fieldPath: result.fieldInfo?.path || null,
            fieldType: result.fieldInfo?.type || null,
            fieldPlaceholder: result.fieldInfo?.placeholder || null,
            remainingText: result.remainingText,
        });
    } catch (error: any) {
        console.error("Detect-Field error details:", error);
        return NextResponse.json(
            { error: error?.message || "Failed to detect field" },
            { status: 500 }
        );
    }
}
