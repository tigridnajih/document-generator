export const PROPOSAL_TEMPLATE = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Proposal</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
    <style>
        /* 
         * PROPOSAL TEMPLATE - PDFSHIFT STRICT FLOW
         *
         * RULES:
         * 1. The cover must be the first element inside body.
         * 2. The cover must NOT be wrapped inside any padded container
         * 3. All non-cover content is wrapped inside <div class="content">
         * 4. The .content container must use padding: 20mm
         * 5. The cover uses min-height: 100vh and break-after: page
         */

        :root {
            --primary-color: #000000;
            --accent-color: #ee731b;
            --text-color: #374151;
            --text-heading: #111827;
            --bg-cover: #1a202c;
            --border-color: #e5e7eb;
            --font-main: 'Inter', sans-serif;
        }

        /* 1. RESET & BASE */
        * {
            box-sizing: border-box;
        }

        html {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
            height: 100%;
        }

        body {
            font-family: var(--font-main);
            color: var(--text-color);
            line-height: 1.6;
            margin: 0; 
            padding: 0;
            font-size: 14px;
            height: 100%;
        }

        /* 2. TYPOGRAPHY */
        h1, h2, h3, h4, h5, h6 {
            color: var(--text-heading);
            font-weight: 700;
            margin-top: 0;
            line-height: 1.3;
            /* Avoid breaking after headings (orphans) */
            break-after: avoid;
            page-break-after: avoid;
        }

        h2 { 
            font-size: 24px; 
            border-bottom: 2px solid var(--accent-color); 
            padding-bottom: 12px; /* Uniform padding */
            margin-bottom: 24px; 
            display: block; 
            margin-top: 0; 
            padding-top: 12px; /* Uniform padding */
            text-transform: uppercase;
        }
        
        h3 { font-size: 18px; margin-bottom: 12px; margin-top: 24px; }
        
        p { margin-bottom: 16px; text-align: justify; }
        ul, ol { margin-bottom: 16px; padding-left: 24px; }
        li { margin-bottom: 8px; }

        /* 3. LAYOUT UTILITIES for Content */
        /* Wrapper for non-cover content, provides page margins of 20mm */
        .content {
            width: 100%;
            padding: 20mm; 
        }

        .section {
            width: 100%;
            margin-bottom: 20px;
        }

        /* Forces a new page before this element */
        .page-break {
            break-before: page;
            page-break-before: always;
            margin-top: 0 !important;
        }

        /* Prevents breaking inside an element */
        .keep-together {
            break-inside: avoid;
            page-break-inside: avoid;
        }

        .no-break-inside {
            break-inside: avoid;
            page-break-inside: avoid;
        }

        /* 4. COVER SECTION */
        .cover {
            /* Full page height coverage as requested */
            min-height: 100vh;
            width: 100%;
            
            /* Visual styling */
            background-color: var(--bg-cover);
            background-image: url('https://pdsggplxeglpkmltwzlb.supabase.co/storage/v1/object/sign/Document_Images/Proposal/Proposal_front_bg.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83MTczYWI1Yy0xNDZjLTQ3NGEtYjNmNi1iNzYzZDExZDJmYzgiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJEb2N1bWVudF9JbWFnZXMvUHJvcG9zYWwvUHJvcG9zYWxfZnJvbnRfYmcucG5nIiwiaWF0IjoxNzY5MzU5NzExLCJleHAiOjUyNjk4NTU3MTF9.4C4e0xcGb2FfNdPvB42oqZVFaeuvlksv_dfob2qnnXg');
            background-size: cover; 
            background-position: center;
            background-repeat: no-repeat;
            color: white;
            
            /* Internal padding for cover content */
            padding: 80px 40px; 
            
            display: flex;
            flex-direction: column;
            gap: 60px;
            
            /* Force page break after cover */
            break-after: page;
            page-break-after: always;
            
            /* No margin interference */
            margin: 0;
        }

        .cover-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
        }

        .cover-logo {
            max-width: 180px;
            height: auto;
        }

        .cover-date {
            font-size: 16px;
            font-weight: 500;
            border-left: 4px solid var(--accent-color);
            padding-left: 16px;
        }

        .cover-title-block {
            margin: 40px 0;
        }

        .cover-title-red {
            color: #ef4444; 
            font-size: 56px;
            font-weight: 900;
            line-height: 1;
            text-transform: uppercase;
        }

        .cover-subtitle {
            font-size: 42px;
            font-weight: 800;
            margin-top: 24px;
            text-transform: uppercase;
        }

        .cover-details-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 40px;
            margin-top: auto; 
        }

        .cover-detail-item label {
            display: block;
            color: var(--accent-color);
            font-size: 14px;
            font-weight: 700;
            text-transform: uppercase;
            margin-bottom: 8px;
            letter-spacing: 0.05em;
        }

        .cover-detail-item div {
            font-size: 20px;
            font-weight: 600;
        }

        /* 5. COMPONENTS & TABLES */
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 24px;
            font-size: 13px;
            break-inside: avoid;
            page-break-inside: avoid;
        }

        th {
            background-color: #f3f4f6;
            text-align: left;
            padding: 12px;
            font-weight: 700;
            text-transform: uppercase;
            color: var(--text-heading);
            border-bottom: 2px solid var(--border-color);
            font-size: 11px;
        }

        td {
            padding: 12px;
            border-bottom: 1px solid var(--border-color);
            vertical-align: top;
        }

        .text-right { text-align: right; }
        .text-center { text-align: center; }
        
        .pricing-total td {
            background-color: #f9fafb;
            font-weight: 700;
            font-size: 14px;
            border-top: 2px solid var(--accent-color);
        }

        .signature-block {
            margin-top: 60px;
            break-inside: avoid;
            page-break-inside: avoid;
        }
        
        .bank-details {
            border: 1px solid var(--border-color);
            border-radius: 4px;
            padding: 24px;
            background-color: #f9fafb;
            margin-top: 24px;
            break-inside: avoid;
            page-break-inside: avoid;
        }

        .bank-grid {
            display: grid;
            grid-template-columns: auto 1fr;
            column-gap: 16px;
            row-gap: 8px;
            font-weight: 500;
        }

        .content-image {
            width: 100%;
            height: auto;
            border-radius: 4px;
            margin: 24px 0;
            display: block;
            break-inside: avoid;
            page-break-inside: avoid;
        }
        
        /* Utility */
        .mt-0 { margin-top: 0 !important; }

    </style>
</head>
<body>

    <!-- COVER SECTION: Must be first, no parent wrapper -->
    <div class="cover">
        <div class="cover-header">
            <div class="cover-date">[[proposal_date]]</div>
            <img src="https://pdsggplxeglpkmltwzlb.supabase.co/storage/v1/object/sign/Document_Images/Tigrid_Assets/Tigrid_white_logo.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83MTczYWI1Yy0xNDZjLTQ3NGEtYjNmNi1iNzYzZDExZDJmYzgiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJEb2N1bWVudF9JbWFnZXMvVGlncmlkX0Fzc2V0cy9UaWdyaWRfd2hpdGVfbG9nby5wbmciLCJpYXQiOjE3Njk0MDU3MjEsImV4cCI6NTI2OTkwMTcyMX0.8m33JTYvR5vEgZTbNe-3T7iORd9DxxbqETbKJK-fY_8" 
                 alt="Tigrid Logo" class="cover-logo">
        </div>

        <div class="cover-title-block">
            <div class="cover-title-red">BUSINESS</div>
            <div class="cover-title-red">PROPOSAL</div>
            <div class="cover-subtitle">[[PROJECT_TITLE]]</div>
        </div>

        <div class="cover-details-grid">
            <div class="cover-detail-item">
                <label>Project Number</label>
                <div>[[PROJECT_NUMBER]]</div>
            </div>
            <div class="cover-detail-item">
                <label>Proposed To</label>
                <div>[[CLIENT_COMPANY]]</div>
            </div>
            <div class="cover-detail-item">
                <label>Presented By</label>
                <div>Tigrid Technologies</div>
            </div>
        </div>
    </div>

    <!-- CONTENT WRAPPER: All non-cover content starts here -->
    <div class="content">
        
        <!-- INTRODUCTION: Starts immediately on Page 2 -->
        <div class="section">
            <h2 class="mt-0">Welcome !</h2>
            
            <p>Dear <strong>Dr. Ameer Pichen Sir</strong>,</p>
            <p>Greetings from Tigrid.</p>
            
            <p>Welcome to a realm of limitless potential. Within the pages of this proposal, we invite you to discover how together, we can transform your aspirations into remarkable achievements. We are genuinely thrilled by the opportunity to partner up with <strong>SYBO TECH</strong>, aiming to heighten your brand's value.</p>
            
            <p>Our commitment to excellence and your vision for success will converge here, and we look forward to embarking on this rewarding venture with you. As you delve into these pages, envision a future where we work hand in hand to bring your goals to life.</p>
            
            <p>With Tigrid, you not only gain access to top-tier talent but also a partner who values your trust and is unwavering in its dedication to your project's success. We recognize the paramount importance of safeguarding your business's sensitive information. All information contained in this proposal is confidential and intended solely for the recipient.</p>
            
            <p>Currently, we are living in an era where technology is evolving at an unprecedented pace. To stay ahead of the curve, it is imperative to adapt to these changes and embrace innovation. At Tigrid, we are committed to helping you navigate this dynamic landscape and leverage the power of technology to drive your business forward.</p>

            <p><strong>Accelerate your business with our technology driven strategic approach.</strong></p>
            
            <h3 style="margin-top: 24px; color: var(--accent-color);">Be Remarkable!</h3>
        </div>

        <!-- WHY TIGRID: Forced New Page -->
        <div class="section page-break">
            <h2>Why Tigrid ?</h2>
            <p>When seeking a reliable and innovative tech partner for visionary businesses, many turn to <strong>Tigrid Technologies Private Limited</strong>. We are on a mission to revolutionize the process of creating and enhancing brands.</p>
            
            <img src="https://pdsggplxeglpkmltwzlb.supabase.co/storage/v1/object/sign/Document_Images/Proposal/proposal_whytigrid.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83MTczYWI1Yy0xNDZjLTQ3NGEtYjNmNi1iNzYzZDExZDJmYzgiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJEb2N1bWVudF9JbWFnZXMvUHJvcG9zYWwvcHJvcG9zYWxfd2h5dGlncmlkLnBuZyIsImlhdCI6MTc2OTI3MzI3MCwiZXhwIjoyNzE1MzUzMjcwfQ.DsvpaP0ivDbNMuLPIDJvdkD4NRS9a7YEva5rZbTVFcA" 
                 alt="Why Tigrid" class="content-image">
                 
            <p>We pride ourselves on delivering exceptional results and providing a seamless experience for our clients. Here’s why you should choose us as your trusted IT partner:</p>
            <ul>
                <li><strong>Expertise:</strong> Our team consists of highly skilled professionals with extensive experience in the industry.</li>
                <li><strong>Innovation:</strong> We leverage the latest technologies to deliver cutting-edge solutions.</li>
                <li><strong>Customer-Centric:</strong> We prioritize your needs and work closely with you to achieve your goals.</li>
                <li><strong>Quality:</strong> We maintain the highest standards of quality in everything we do.</li>
            </ul>
        </div>

        <!-- SCOPE OF WORK: Forced New Page -->
        <div class="section page-break">
            <h2>Scope of Work</h2>
            <div class="scope-content">
                [[scope_of_work]]
            </div>
        </div>

        <!-- TIMELINE: Flows naturally. Will break if needed. -->
        [[project_timeline_section]]

        <!-- ESTIMATION: Forced New Page -->
        <div class="section page-break">
            <h2>Estimation</h2>
            <p>The table below outlines the estimated costs for the project scope described above.</p>

            <table class="pricing-table">
                <thead>
                    <tr>
                        <th style="width: 50%;">Description</th>
                        <th style="width: 20%;" class="text-right">Rate</th>
                        <th style="width: 10%;" class="text-center">Qty</th>
                        <th style="width: 20%;" class="text-right">Total</th>
                    </tr>
                </thead>
                <tbody>
                    [[estimation_rows]]
                    <tr class="pricing-total">
                        <td colspan="3" class="text-right">Total Payable</td>
                        <td class="text-right">[[total_payable]]</td>
                    </tr>
                </tbody>
            </table>

            <!-- Keep payment and bank details together with the table if possible, or at least together with each other -->
            <div class="keep-together">
                <h3>Payment Details</h3>
                <ul style="list-style-type: decimal;">
                    <li>Advance: 50% due upon project initiation.</li>
                    <li>Final Payment: 50% upon completion and approval before launch.</li>
                    <li>Project will be initiated only after 1st advance instalment is paid.</li>
                    <li>18% GST will be applicable on the final invoice.</li>
                    <li>Any element additional to the above scope of work will be charged extra.</li>
                    <li>2 Months free maintenance and an AMC will be applicable if continued.</li>
                </ul>

                <div class="bank-details">
                    <h3>Tigrid Bank Details</h3>
                    <div class="bank-grid">
                        <div>A/C NAME</div>   <div>: TIGRID TECHNOLOGIES PRIVATE LIMITED</div>
                        <div>BANK NAME</div>  <div>: STATE BANK OF INDIA</div>
                        <div>BRANCH</div>     <div>: KAZHAKUTTAM</div>
                        <div>A/C NO.</div>    <div>: 41923692420</div>
                        <div>IFSC</div>       <div>: SBIN0070445</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- TERMS & CONDITIONS: Forced New Page -->
        <div class="section page-break">
            <h2>Terms & Conditions</h2>
            <p>The following terms and conditions are exclusively for this project.</p>
            <ol>
                <li>Any element additional to the above estimate and scope will be charged extra.</li>
                <li>At least one person should be available from client-side for proper interaction.</li>
                <li>The working days in a week will be from Monday-Friday (9AM-6PM IST).</li>
                <li>Ample time must be provided in case of revisions, edits or change in creative path.</li>
                <li>The client must provide us with sufficient data/resources. Delays may affect timeline.</li>
                <li>When deliverables are no longer confidential, Tigrid may use Client’s name/logo for marketing.</li>
                <li>Both parties will keep project information strictly confidential.</li>
                <li>We will not be responsible for unavailability/damage caused by client misconduct.</li>
                <li>Third-party costs (Domain, Hosting, SSL, etc.) are excluded and must be paid by client.</li>
            </ol>
        </div>

        <!-- CLOSING: Forced New Page -->
        <div class="section page-break">
            <h2>Thank You</h2>
            <p>I would like to express my heartfelt appreciation for your time and consideration in reviewing the proposal. Choosing Tigrid means choosing a partner who is dedicated to your success.</p>
            
            <p>Should you have any queries, require further clarification, or wish to discuss any aspect in more detail, please do not hesitate to reach out to us.</p>
            
            <p>Your success is our mission.</p>

            <div class="signature-block">
                <p>Warm regards,</p>
                <div style="margin-top: 24px;">
                    <div style="font-size: 18px; font-weight: 700;">Najih Sulthan</div>
                    <div class="text-muted" style="font-weight: 500;">Chief Executive Officer</div>
                </div>
            </div>
        </div>
        
    </div> <!-- End .content -->

</body>
</html>
`;
