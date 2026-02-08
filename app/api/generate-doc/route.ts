import { NextResponse } from "next/server";
import { API_URL } from "@/lib/constants";

export async function POST(req: Request) {
    try {
        const payload = await req.json();

        if (!API_URL) {
            console.error("PROXY ERROR: API_URL is not defined");
            return NextResponse.json({ error: "API_URL configuration missing" }, { status: 500 });
        }

        console.log("PROXYING REQUEST TO:", API_URL);

        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`n8n PROXY ERROR (${response.status}):`, errorText);
            return NextResponse.json(
                { error: `n8n error: ${errorText || response.statusText}` },
                { status: response.status }
            );
        }

        const contentType = response.headers.get("content-type") || "";
        if (contentType.includes("application/json")) {
            const result = await response.json();
            return NextResponse.json(result);
        } else {
            const text = await response.text();
            return NextResponse.json({ success: true, message: text });
        }
    } catch (error: any) {
        console.error("API PROXY CRITICAL EXCEPTION:", error);
        return NextResponse.json(
            {
                error: "Internal server error during proxying",
                details: error.message,
                stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
            },
            { status: 500 }
        );
    }
}

