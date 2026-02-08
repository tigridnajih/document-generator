
import { INVOICE_TEMPLATE } from "../templates/invoice-template";

export function generateInvoiceItemRows(items: any[]): string {
    if (!items || items.length === 0) return "";

    return items.map((item) => {
        const rate = Number(item.rate) || 0;
        const qty = Number(item.quantity) || 0;
        const total = rate * qty;

        return `
      <tr>
        <td class="description">${item.description || ""}</td>
        <td style="text-align: center;">${rate.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</td>
        <td style="text-align: center;">${qty}</td>
        <td style="text-align: right;">${total.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</td>
      </tr>
    `;
    }).join("");
}

export function generateInvoiceHtml(data: any): string {
    let html = INVOICE_TEMPLATE;

    // 1. Client Info
    html = html.replace("[[client_name]]", data.client?.name || "");
    html = html.replace("[[client_company_name]]", data.client?.company || "");
    html = html.replace("[[client_town]]", data.client?.locality || "");
    html = html.replace("[[client_city]]", data.client?.city || "");
    html = html.replace("[[client_pincode]]", data.client?.pincode || "");
    html = html.replace("[[client_state]]", data.client?.state || "");

    // 2. Invoice Meta
    html = html.replace("[[gst_in]]", data.client?.gstin || "");
    html = html.replace("[[invoice_no]]", data.meta?.invoiceNumber || "");
    html = html.replace("[[invoice_date]]", data.meta?.invoiceDate || "");
    html = html.replace("[[lut_number]]", data.meta?.lutNumber ? `LUT NO: ${data.meta.lutNumber}` : "");

    // 3. Items
    const itemRows = generateInvoiceItemRows(data.items || []);
    html = html.replace("[[item_row]]", itemRows);

    // 4. Totals
    const subTotal = data.totals?.subtotal || 0;
    const taxTotal = data.totals?.taxTotal || 0;
    const grandTotal = data.totals?.grandTotal || 0;

    html = html.replace("[[subtotal]]", subTotal.toLocaleString('en-IN', { style: 'currency', currency: 'INR' }));

    let taxDetailsHtml = "";
    if (data.tax?.cgst?.amount > 0) taxDetailsHtml += `<div>CGST: ${data.tax.cgst.amount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</div>`;
    if (data.tax?.sgst?.amount > 0) taxDetailsHtml += `<div>SGST: ${data.tax.sgst.amount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</div>`;
    if (data.tax?.igst?.amount > 0) taxDetailsHtml += `<div>IGST: ${data.tax.igst.amount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</div>`;

    html = html.replace("[[gst_details]]", taxDetailsHtml || "<div>0%</div>");
    html = html.replace("[[total]]", grandTotal.toLocaleString('en-IN', { style: 'currency', currency: 'INR' }));

    // 5. Footer & Words
    html = html.replace("[[price_in_text]]", grandTotal.toLocaleString('en-IN') + " RUPEES");
    html = html.replace("[[declaration]]", data.meta?.exportInvoice ? "Export invoice under LUT" : "This is a computer generated invoice.");

    return html;
}
