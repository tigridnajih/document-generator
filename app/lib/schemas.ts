import { z } from "zod";

export const documentFormSchema = z.object({
    clientDetails: z.object({
        clientName: z.string().min(1, "Client name is required"),
        clientCompany: z.string().optional(),
        clientGstIn: z.string().optional(),
        clientEmail: z.string().email("Invalid email address").optional().or(z.literal("")),
        projectNumber: z.string().optional(),
        date: z.string().optional(),
        clientLocality: z.string().optional(),
        clientCity: z.string().optional(),
        clientPincode: z.string().or(z.number()).optional(),
        clientState: z.string().optional(),
    }),
    invoiceDetails: z.object({
        invoiceNumber: z.string().optional(),
        invoiceDate: z.string().optional(),
    }).optional(),
    scopeOfWork: z.object({
        sections: z.array(z.object({
            title: z.string(),
            items: z.array(z.object({
                subTitle: z.string().optional(),
                contentType: z.enum(["paragraph", "bullets"]),
                content: z.union([z.string(), z.array(z.string())])
            }))
        })).optional(),
        timelineEnabled: z.boolean().default(false),
        timeline: z.array(
            z.object({
                phase: z.string().optional(),
                duration: z.coerce.number().optional(),
                unit: z.enum(["Days", "Weeks"]).default("Days"),
                deliverables: z.string().optional(),
            })
        ).optional(),
    }).optional(),
    estimation: z.array(
        z.object({
            description: z.string().optional(),
            rate: z.coerce.number().optional(),
            qty: z.coerce.number().optional(),
            total: z.coerce.number().optional(),
        })
    ).optional(),
    items: z.array(
        z.object({
            name: z.string().min(1, "Item name is required"),
            rate: z.coerce.number().min(0),
            quantity: z.coerce.number().min(1),
        })
    ).optional(),
    gstList: z.array(
        z.object({
            type: z.enum(["CGST", "SGST", "IGST"]),
            rate: z.coerce.number().min(0),
        })
    ).optional(),
    export_invoice: z.boolean().optional(),
    lut_number: z.string().optional(),
});

export type DocumentFormValues = z.infer<typeof documentFormSchema>;
