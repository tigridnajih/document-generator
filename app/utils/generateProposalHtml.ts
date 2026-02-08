
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
        const qty = Number(item.qty) || 0;
        const total = rate * qty;

        return `
      <tr>
        <td>${item.description || ""}<br><span class="text-muted">${item.detailedDescription || ""}</span></td>
        <td>${rate.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</td>
        <td>${qty}</td>
        <td>${total.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</td>
      </tr>
    `;
    }).join("");
}

export function generateProposalHtml(data: any): string {
    let html = PROPOSAL_TEMPLATE;

    html = html.replace("[[proposal_date]]", data.clientDetails?.date || "");
    html = html.replace("[[PROJECT_TITLE]]", data.clientDetails?.projectTitle || "");
    html = html.replace("[[PROJECT_NUMBER]]", data.clientDetails?.projectNumber || "");
    html = html.replace("[[CLIENT_COMPANY]]", data.clientDetails?.clientCompany || "");

    const sowHtml = generateScopeOfWorkHtml(data.scopeOfWork?.sections || []);
    html = html.replace("[[scope_of_work]]", sowHtml);

    const estimationRows = generateEstimationHtml(data.estimation || []);
    const totalPayable = (data.estimation || []).reduce((sum: number, item: any) =>
        sum + (Number(item.rate) || 0) * (Number(item.qty) || 0), 0
    );

    html = html.replace("[[estimation_rows]]", estimationRows);
    html = html.replace("[[total_payable]]", totalPayable.toLocaleString('en-IN', { style: 'currency', currency: 'INR' }));

    return html;
}
