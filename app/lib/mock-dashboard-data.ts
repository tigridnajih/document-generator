export type DocumentType = "proposal" | "quotation" | "invoice";

export interface DashboardDocument {
    id: string;
    type: DocumentType;
    number: string;
    clientName: string;
    clientCompany: string;
    createdDate: string;
    status: "Generated" | "Sent";
    amount: number;
}

export type TimeRange = "Daily" | "Weekly" | "Monthly" | "Yearly";

export const MOCK_DOCUMENTS: DashboardDocument[] = [
    {
        id: "1",
        type: "proposal",
        number: "PROP-001",
        clientName: "John Doe",
        clientCompany: "Acme Corp",
        createdDate: "2024-03-10",
        status: "Generated",
        amount: 1200,
    },
    {
        id: "2",
        type: "quotation",
        number: "QUOT-042",
        clientName: "Jane Smith",
        clientCompany: "Globex Inc",
        createdDate: "2024-03-12",
        status: "Sent",
        amount: 5000,
    },
    {
        id: "3",
        type: "invoice",
        number: "INV-2024-001",
        clientName: "Mike Johnson",
        clientCompany: "Stark Ind",
        createdDate: "2024-03-15",
        status: "Generated",
        amount: 8500,
    },
    {
        id: "4",
        type: "proposal",
        number: "PROP-003",
        clientName: "Sarah Connor",
        clientCompany: "Cyberdyne",
        createdDate: "2024-03-01",
        status: "Sent",
        amount: 3200,
    },
    {
        id: "5",
        type: "invoice",
        number: "INV-2024-005",
        clientName: "Bruce Wayne",
        clientCompany: "Wayne Ent",
        createdDate: "2024-02-28",
        status: "Sent",
        amount: 15000,
    },
    {
        id: "6",
        type: "quotation",
        number: "QUOT-101",
        clientName: "Clark Kent",
        clientCompany: "Daily Planet",
        createdDate: "2024-03-14",
        status: "Generated",
        amount: 250,
    },
];

export const MOCK_CHART_DATA: Record<TimeRange, Record<DocumentType, number[]>> = {
    Daily: {
        proposal: [1, 2, 0, 3, 1, 4, 2],
        quotation: [0, 1, 2, 1, 3, 2, 1],
        invoice: [2, 1, 3, 2, 1, 4, 3],
    },
    Weekly: {
        proposal: [10, 15, 8, 12],
        quotation: [5, 8, 12, 10],
        invoice: [12, 14, 10, 18],
    },
    Monthly: {
        proposal: [45, 52, 38, 60, 48, 55],
        quotation: [30, 40, 35, 45, 38, 42],
        invoice: [50, 65, 55, 70, 62, 80],
    },
    Yearly: {
        proposal: [500, 600, 750, 800],
        quotation: [300, 400, 450, 500],
        invoice: [800, 950, 1100, 1200],
    },
};
