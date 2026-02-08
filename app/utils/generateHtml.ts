
import { PROPOSAL_TEMPLATE } from "../templates/proposal-template";

interface ScopeOfWorkSection {
    title: string;
    items: {
        subTitle?: string;
        contentType: "paragraph" | "bullets";
        content: string | string[];
    }[];
}

interface ProposalData {
    scopeOfWork?: {
        sections?: ScopeOfWorkSection[];
    };
    // Add other fields as needed for future replacement
    [key: string]: any;
}

export function generateScopeOfWorkHtml(sections: ScopeOfWorkSection[]): string {
    if (!sections || sections.length === 0) return "";

    return sections.map((section) => {
        let sectionHtml = `<div class="scope-section" style="margin-bottom: 30px;">`;

        // Main Section Title (if present, usually handled by template structure, but fitting into 'scope-of-work' block)
        if (section.title) {
            sectionHtml += `<h3 style="font-size: 14pt; font-weight: 700; color: #000000; margin-bottom: 15px; text-transform: uppercase; border-bottom: 1px solid #ee731b; display: inline-block; padding-bottom: 4px;">${section.title}</h3>`;
        }

        section.items.forEach((item) => {
            sectionHtml += `<div class="scope-item-block" style="margin-bottom: 20px;">`;

            // Subtitle
            if (item.subTitle) {
                sectionHtml += `<h4 style="font-size: 11pt; font-weight: 700; margin-bottom: 8px; color: #000;">${item.subTitle}</h4>`;
            }

            // Content
            if (item.contentType === "bullets" && Array.isArray(item.content)) {
                sectionHtml += `<ul class="scope-list">`;
                item.content.forEach((bullet) => {
                    if (bullet.trim()) {
                        sectionHtml += `<li class="scope-item">${bullet}</li>`;
                    }
                });
                sectionHtml += `</ul>`;
            } else if (typeof item.content === "string") {
                // Handle paragraphs (newlines to <br> or <p>)
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

export function generateProposalHtml(data: ProposalData): string {
    let html = PROPOSAL_TEMPLATE;

    // 1. Generate Scope of Work HTML
    const sowHtml = generateScopeOfWorkHtml(data.scopeOfWork?.sections || []);

    // 2. Replace Placeholder
    html = html.replace("[[scope_of_work]]", sowHtml);

    // Note: Other placeholders are not replaced yet as per instructions to focus on SOW.

    return html;
}
