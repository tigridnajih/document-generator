import { NextResponse } from "next/server";
import { API_URL } from "@/lib/constants";

export async function POST(req: Request) {
    try {
        const payload = await req.json();

        console.log("PROXYING REQUEST TO n8n:", API_URL);

        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("n8n PROXY ERROR:", errorText);
            return NextResponse.json(
                { error: "Failed to generate document via n8n" },
                { status: response.status }
            );
        }

        // Try to parse JSON, if not return raw text or success
        const contentType = response.headers.get("content-type") || "";
        if (contentType.includes("application/json")) {
            const result = await response.json();
            return NextResponse.json(result);
        } else {
            const text = await response.text();
            return NextResponse.json({ success: true, message: text });
        }
    } catch (error: any) {
        console.error("API PROXY EXCEPTION:", error);
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}
