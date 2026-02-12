
import { PROPOSAL_TEMPLATE } from "../templates/proposal-template";

interface ScopeOfWorkSection {
    title: string;
    items: {
        subTitle?: string;
        contentType: "paragraph" | "bullets";
        content: string | string[];
    }[];
}

export function generateScopeOfWorkHtml(sections: ScopeOfWorkSection[]): string {
    if (!sections || sections.length === 0) return "";

    return sections.map((section) => {
        let sectionHtml = `<div class="scope-section" style="margin-bottom: 30px;">`;

        if (section.title) {
            sectionHtml += `<h3 style="font-size: 14pt; font-weight: 700; color: #000000; margin-bottom: 15px; text-transform: uppercase; border-bottom: 1px solid #ee731b; display: inline-block; padding-bottom: 4px;">${section.title}</h3>`;
        }

        section.items.forEach((item) => {
            sectionHtml += `<div class="scope-item-block" style="margin-bottom: 20px;">`;

            if (item.subTitle) {
                sectionHtml += `<h4 style="font-size: 11pt; font-weight: 700; margin-bottom: 8px; color: #000;">${item.subTitle}</h4>`;
            }

            if (item.contentType === "bullets" && Array.isArray(item.content)) {
                sectionHtml += `<ul class="scope-list">`;
                item.content.forEach((bullet) => {
                    if (bullet.trim()) {
                        sectionHtml += `<li class="scope-item">${bullet}</li>`;
                    }
                });
                sectionHtml += `</ul>`;
            } else if (typeof item.content === "string") {
                const paragraphs = item.content.split('\n').filter(p => p.trim());
                paragraphs.forEach(p => {
                    sectionHtml += `<p>${p}</p>`;
                });
            }

            sectionHtml += `</div>`;
        });

        sectionHtml += `</div>`;
        return sectionHtml;
    }).join("\n");
}

export function generateEstimationHtml(items: any[]): string {
    if (!items || items.length === 0) return "";

    return items.map((item) => {
        const rate = Number(item.rate) || 0;
        const qty = Number(item.qty || item.quantity) || 0;
        const total = rate * qty;

        return `
      <tr>
        <td>${item.description || ""}<br><span class="text-muted">${item.detailedDescription || ""}</span></td>
        <td class="text-right">${rate.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</td>
        <td class="text-center">${qty}</td>
        <td class="text-right">${total.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</td>
      </tr>
    `;
    }).join("");
}


export function generateProjectTimelineHtml(data: any): string {
    // Check if timeline is enabled in the form data (scopeOfWork.timelineEnabled)
    const sow = data.scopeOfWork;
    if (!sow || !sow.timelineEnabled) return "";

    const timelineItems: any[] = sow.timeline || [];
    if (timelineItems.length === 0) return "";

    // Calculate total duration (assuming "Days" for simplicity, or just summing values)
    const totalDuration = timelineItems.reduce((acc, item) => acc + (Number(item.duration) || 0), 0);

    const rows = timelineItems.map((phase: any) => `
        <tr>
            <td style="font-weight: 600;">${phase.phase || ""}</td>
            <td>${phase.duration || 0} ${phase.unit || "Days"}</td>
            <td>${phase.deliverables || ""}</td>
        </tr>
    `).join("");

    return `
    <!-- PROJECT TIMELINE -->
    <div class="section">
        <h2>Project Timeline</h2>
        
        <table>
            <thead>
                <tr>
                    <th style="width: 25%;">Phase</th>
                    <th style="width: 20%;">Duration</th>
                    <th style="width: 55%;">Deliverables</th>
                </tr>
            </thead>
            <tbody>
                ${rows}
                <!-- Total Row -->
                <tr style="background-color: #f9fafb; border-top: 2px solid #ee731b; font-weight: 700;">
                    <td>Total Timeline</td>
                    <td colspan="2">${totalDuration} Days (Approx)</td>
                </tr>
            </tbody>
        </table>
    </div>
    `;
}

export function generateProposalHtml(data: any): string {
    let html = PROPOSAL_TEMPLATE;

    html = html.replace("[[proposal_date]]", data.clientDetails?.date || "");
    html = html.replace("[[PROJECT_TITLE]]", data.clientDetails?.projectTitle || "");
    html = html.replace("[[PROJECT_NUMBER]]", data.clientDetails?.projectNumber || "");
    html = html.replace("[[CLIENT_COMPANY]]", data.clientDetails?.clientCompany || "");

    const sowHtml = generateScopeOfWorkHtml(data.scopeOfWork?.sections || []);
    html = html.replace("[[scope_of_work]]", sowHtml);

    const timelineHtml = generateProjectTimelineHtml(data);
    html = html.replace("[[project_timeline_section]]", timelineHtml);

    const estimationRows = generateEstimationHtml(data.estimation?.items || []);
    // Note: totalPayable logic depends on structure passed from page.tsx. 
    // page.tsx passes { estimation: { items: [...], summary: { totalPayable: ... } } }
    // OR it passes { estimation: [...] } if legacy?
    // Let's check page.tsx payload construction again.
    // page.tsx payload: estimation: { enabled, items: [], summary: { totalPayable } }

    // However, the interface in generateEstimationHtml expects an array of items.
    // Let's adjust access to estimation items to be robust.
    const estimationItems = Array.isArray(data.estimation) ? data.estimation : (data.estimation?.items || []);

    // Re-generate rows with correct array
    const estimationRowsHtml = generateEstimationHtml(estimationItems);

    const totalPayable = data.estimation?.summary?.totalPayable
        ?? estimationItems.reduce((sum: number, item: any) => sum + (Number(item.rate) || 0) * (Number(item.quantity || item.qty) || 0), 0);

    html = html.replace("[[estimation_rows]]", estimationRowsHtml);
    html = html.replace("[[total_payable]]", totalPayable.toLocaleString('en-IN', { style: 'currency', currency: 'INR' }));

    return html;
}
