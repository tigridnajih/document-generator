export const PROPOSAL_TEMPLATE = `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Proposal Template</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link
        href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
        rel="stylesheet">
    <style>
        :root {
            /* --- CONFIGURATION VARIABLES --- */
            --accent-color: #ee731b;
            /* Tigrid Orange */
            --text-heading: #000000;
            --text-body: #000000;
            --text-muted: #000000;
            --border-light: #e5e7eb;
            --bg-white: #ffffff;

            /* --- SPACING & SIZING --- */
            --page-width: 100%;
            --margin-x: 25mm;
            --margin-y: 20mm;
            --font-base: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
            --block-spacing: 30px;
        }

        /* RESET & BASE STYLES */
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            font-family: var(--font-base);
            color: var(--text-body);
            background-color: #525659;
            /* Browser viewer background */
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
            font-size: 10.5pt;
            line-height: 1.6;
            margin: 0;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }

        /* DOCUMENT CONTAINER */
        /* Simulates continuous pages in browser, but allows flow in print */
        .document-view {
            width: var(--page-width);
            margin: 0 auto;
            background: var(--bg-white);
            padding: var(--margin-y) var(--margin-x);
            position: relative;
            box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
        }

        /* TYPOGRAPHY */
        h1,
        h2,
        h3,
        h4,
        h5 {
            color: var(--text-heading);
            font-weight: 700;
            line-height: 1.2;
            page-break-after: avoid;
            /* Keep headings with following content */
            break-after: avoid;
        }

        h1 {
            font-size: 24pt;
            margin-bottom: 10px;
        }

        h2 {
            font-size: 22pt;
            margin-bottom: 20px;
            border-bottom: 2px solid var(--accent-color);
            padding-bottom: 8px;
            text-transform: uppercase;
            display: inline-block;
            width: 100%;
        }

        h3 {
            font-size: 16pt;
            margin-bottom: 10px;

            color: #000000;
            letter-spacing: 0.5px;
        }

        p {
            margin-bottom: 15px;
            text-align: justify;
            hyphens: auto;
        }

        /* --- ATOMIC SECTIONS --- */
        /* ensure each logical block stays together */
        .section-block {
            margin-bottom: var(--block-spacing);
            page-break-inside: avoid;
            break-inside: avoid;
        }

        /* For longer sections that SHOULD be allowed to break between sub-items */
        .section-container {
            margin-bottom: var(--block-spacing);
        }

        .section-container h2 {
            page-break-after: avoid;
            break-after: avoid;
        }

        /* Sub-units for lists/timelines that should be atomic */
        .atomic-item {
            page-break-inside: avoid;
            break-inside: avoid;
            margin-bottom: 10px;
        }

        /* --- COVER PAGE --- */
        .cover-page {
            /* --- SCOPED OVERRIDES --- */
            --text-heading: #ffffff;
            --text-body: #ffffff;
            --text-muted: #ffffff;
            --border-light: rgba(255, 255, 255, 0.2);

            /* Physical A4 dimensions for perfect mapping to PDF page */
            width: 210mm;
            height: 297mm;

            /* Reset margins; alignment is handled by zero-margin @page rules in print */
            margin: 0;

            /* Standard page padding for internal content safety */
            padding: var(--margin-y) var(--margin-x);

            page-break-after: always;
            break-after: page;

            display: flex;
            flex-direction: column;
            justify-content: center;

            background-image: url('https://pdsggplxeglpkmltwzlb.supabase.co/storage/v1/object/sign/Document_Images/Proposal/Proposal_front_bg.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83MTczYWI1Yy0xNDZjLTQ3NGEtYjNmNi1iNzYzZDExZDJmYzgiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJEb2N1bWVudF9JbWFnZXMvUHJvcG9zYWwvUHJvcG9zYWxfZnJvbnRfYmcucG5nIiwiaWF0IjoxNzY5MzU5NzExLCJleHAiOjUyNjk4NTU3MTF9.4C4e0xcGb2FfNdPvB42oqZVFaeuvlksv_dfob2qnnXg');
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;

            box-sizing: border-box;
            position: relative;
            overflow: hidden;
        }

        .cover-header {
            position: absolute;
            top: var(--margin-y);
            left: var(--margin-x);
            border-left: 4px solid var(--accent-color);
            padding-left: 15px;
            font-size: 14pt;
            font-weight: 500;
            color: #ffffff;
        }

        .cover-logo {
            position: absolute;
            top: var(--margin-y);
            right: var(--margin-x);
            max-height: 40px;
            width: auto;
        }

        .cover-main {
            margin-top: 0;
        }

        .cover-main .title-red {
            color: #ff0000;
            font-size: 48pt;
            font-weight: 900;
            line-height: 1.0;
            letter-spacing: -1px;
            text-transform: uppercase;
        }

        .cover-main .title-white {
            color: #ffffff;
            font-size: 32pt;
            font-weight: 800;
            margin-top: 10px;
            text-transform: uppercase;
            font-family: inherit;
        }

        .cover-details {
            position: absolute;
            bottom: var(--margin-y);
            left: var(--margin-x);
            right: var(--margin-x);
            display: flex;
            flex-direction: column;
            gap: 25px;
            margin-top: 0;
            border-top: none;
            padding-top: 0;
            max-width: calc(100% - (2 * var(--margin-x)));
        }

        .detail-group label {
            display: block;
            font-size: 14pt;
            font-weight: 700;
            text-transform: uppercase;
            color: var(--accent-color);
            margin-bottom: 5px;
            letter-spacing: 1px;
        }

        .detail-group div {
            font-size: 16pt;
            font-weight: 600;
            color: #ffffff;
        }





        /* --- LISTS --- */
        .scope-list {
            list-style: none;
            padding: 0;
        }

        .scope-item {
            position: relative;
            padding-left: 25px;
            margin-bottom: 15px;
            page-break-inside: avoid;
            break-inside: avoid;
        }

        .scope-item::before {
            content: '';
            position: absolute;
            left: 0;
            top: 8px;
            width: 8px;
            height: 8px;
            background: var(--accent-color);
            border-radius: 50%;
        }

        /* --- TABLES --- */
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
            font-size: 10pt;
            page-break-inside: auto;
            /* allow table to break across pages */
        }

        thead {
            display: table-header-group;
            /* repeats on new page */
        }

        tr {
            page-break-inside: avoid;
            break-inside: avoid;
            page-break-after: auto;
        }

        th {
            text-align: left;
            padding: 12px 15px;
            background-color: #f9fafb;
            color: var(--text-muted);
            font-weight: 700;
            text-transform: uppercase;
            font-size: 9pt;
            border-bottom: 2px solid var(--border-light);
        }

        td {
            padding: 15px;
            border-bottom: 1px solid var(--border-light);
            vertical-align: top;
        }

        .pricing-table th:last-child,
        .pricing-table td:last-child {
            text-align: right;
        }

        /* The Total Row shouldn't be separated from the row above it if possible, 
           or at least shouldn't break inside */
        .pricing-total {
            font-weight: 700;
            font-size: 12pt;
            color: var(--text-heading);
            background-color: #f9fafb;
            page-break-inside: avoid;
        }

        .pricing-total td {
            border-top: 2px solid var(--accent-color);
            border-bottom: none;
        }

        /* --- FINANCIAL GROUPING --- */
        .financial-info-group {
            page-break-inside: avoid;
            break-inside: avoid-page;
            margin-bottom: var(--block-spacing);
        }

        /* --- UTILITIES --- */
        .text-muted {
            color: var(--text-muted);
        }

        .page-break {
            page-break-after: always;
        }

        /* Manual force if absolutely needed */

        /* --- PRINT SETTINGS --- */
        @media print {
            @page {
                size: A4;
                margin: 20mm;
            }

            @page :first {
                margin: 0;
            }

            body {
                background: none;
                margin: 0;
            }

            .document-view {
                width: 100% !important;
                margin: 0 !important;
                padding: 0 !important;
                box-shadow: none !important;
                background: none !important;
            }
        }
    </style>
</head>

<body>

    <div class="document-view">

        <!-- COVER PAGE -->
        <section class="cover-page section-block">
            <img src="https://pdsggplxeglpkmltwzlb.supabase.co/storage/v1/object/sign/Document_Images/Tigrid_Assets/Tigrid_white_logo.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83MTczYWI1Yy0xNDZjLTQ3NGEtYjNmNi1iNzYzZDExZDJmYzgiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJEb2N1bWVudF9JbWFnZXMvVGlncmlkX0Fzc2V0cy9UaWdyaWRfd2hpdGVfbG9nby5wbmciLCJpYXQiOjE3Njk0MDU3MjEsImV4cCI6NTI2OTkwMTcyMX0.8m33JTYvR5vEgZTbNe-3T7iORd9DxxbqETbKJK-fY_8"
                alt="Company Logo" class="cover-logo">
            <div class="cover-header">
                [[proposal_date]]
            </div>

            <div class="cover-main">
                <div class="title-red">BUSINESS</div>
                <div class="title-red">PROPOSAL</div>
                <div class="title-white">[[PROJECT_TITLE]]</div>
            </div>

            <div class="cover-details">
                <div class="detail-group">
                    <label>PROJECT NUMBER :</label>
                    <div>[[PROJECT_NUMBER]]</div>
                </div>
                <div class="detail-group">
                    <label>PROPOSED TO :</label>
                    <div>[[CLIENT_COMPANY]]</div>
                </div>
                <div class="detail-group">
                    <label>PRESENTED BY :</label>
                    <div>Tigrid Technologies</div>
                </div>
            </div>
        </section>

        <!-- PAGE 2: WELCOME -->
        <section class="section-container" style="page-break-after: always;">
            <h2>Welcome !</h2>

            <div class="section-block">
                <p>Dear <strong>Dr. Ameer Pichen Sir</strong>,</p>
                <p>Greetings from Tigrid.</p>

                <p>Welcome to a realm of limitless potential. Within the pages of this proposal, we invite you to
                    discover how together, we can transform your aspirations into remarkable achievements. We are
                    genuinely thrilled by the opportunity to partner up with <strong>SYBO TECH</strong>, aiming to
                    heighten your brand's value.</p>

                <p>Our commitment to excellence and your vision for success will converge here, and we look forward to
                    embarking on this rewarding venture with you. As you delve into these pages, envision a future where
                    we work hand in hand to bring your goals to life.</p>

                <p>With Tigrid, you not only gain access to top-tier talent but also a partner who values your trust and
                    is unwavering in its dedication to your project's success. We recognize the paramount importance of
                    safeguarding your business's sensitive information. All information contained in this proposal is
                    confidential and intended solely for the recipient.</p>

                <p>Accelerate your business with our technology driven strategic approach.</p>

                <h3 style="color: #000; margin-top: 20px;">Be Remarkable!</h3>
            </div>
        </section>

        <!-- PAGE 3: WHY TIGRID -->
        <section class="section-container" style="page-break-after: always;">
            <h2>Why Tigrid ?</h2>

            <div class="section-block">
                <p>When seeking a reliable and innovative tech partner for visionary businesses, many turn to
                    <strong>Tigrid Technologies Private Limited</strong>. We are on a mission to revolutionize the
                    process of creating and enhancing brands. While you concentrate on enhancing your service/product,
                    we support you in digitalizing, streamlining, and promoting your brand to a global audience.
                </p>

                <p>We pride ourselves on delivering exceptional results and providing a seamless experience for our
                    clients. Here’s why you should choose us as your trusted IT partner :</p>
            </div>

            <div class="section-block">
                <div style="margin-top: 30px;">
                    <img src="https://pdsggplxeglpkmltwzlb.supabase.co/storage/v1/object/sign/Document_Images/Proposal/proposal_whytigrid.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83MTczYWI1Yy0xNDZjLTQ3NGEtYjNmNi1iNzYzZDExZDJmYzgiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJEb2N1bWVudF9JbWFnZXMvUHJvcG9zYWwvcHJvcG9zYWxfd2h5dGlncmlkLnBuZyIsImlhdCI6MTc2OTI3MzI3MCwiZXhwIjoyNzE1MzUzMjcwfQ.DsvpaP0ivDbNMuLPIDJvdkD4NRS9a7YEva5rZbTVFcA"
                        alt="Why Tigrid Strengths" style="width: 100%; border-radius: 8px;">
                </div>
            </div>
        </section>
        
        <!-- SCOPE OF WORK -->
        <section class="section-container">
            <h2>Scope of Work</h2>

            <div class="scope-of-work">
                [[scope_of_work]]
            </div>
        </section>

        <!-- TIMELINE -->
        <section class="section-container">
            <h2>Project Timeline</h2>
            <!-- Table headings repeat on print pages automatically -->
            <table>
                <thead>
                    <tr>
                        <th style="width: 25%;">Phase</th>
                        <th style="width: 20%;">Duration</th>
                        <th style="width: 55%;">Deliverables</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Discovery</td>
                        <td>1 Week</td>
                        <td>Project Plan, Tech Spec</td>
                    </tr>
                    <tr>
                        <td>Design</td>
                        <td>2 Weeks</td>
                        <td>Figma Files, Style Guide</td>
                    </tr>
                    <tr>
                        <td>Development</td>
                        <td>4 Weeks</td>
                        <td>Functional Beta</td>
                    </tr>
                    <tr>
                        <td>Deployment</td>
                        <td>1 Week</td>
                        <td>Live Site, Documentation</td>
                    </tr>
                </tbody>
            </table>
        </section>

        <!-- FINANCIAL INFO GROUP (Always on one page) -->
        <div class="financial-info-group">
            <!-- PRICING & TERMS -->
            <section class="section-container">
                <h2>Estimation</h2>
                <p>The table below outlines the estimated costs for the project scope described above.</p>

                <table class="pricing-table">
                    <thead>
                        <tr>
                            <th style="width: 50%;">Description</th>
                            <th style="width: 20%;">Rate</th>
                            <th style="width: 10%;">Qty</th>
                            <th style="width: 20%;">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        [[estimation_rows]]
                        <!-- Total row attempts to stick to previous content but won't break inside itself -->
                        <tr class="pricing-total">
                            <td colspan="3">Total</td>
                            <td>[[total_payable]]</td>
                        </tr>
                    </tbody>
                </table>
            </section>

            <!-- TERMS & CLOSING -->
            <section class="section-container" style="margin-bottom: 0;">
                <h3 style="margin-bottom: 15px;">Payment Details</h3>
                <div class="atomic-item">
                    <ol style="padding-left: 20px; line-height: 1.6;">
                        <li>Advance: 50% due upon project initiation.</li>
                        <li>Final Payment: 50% upon completion and approval of the website before launch.</li>
                        <li>Project will be initiated only after 1st advance instalment is paid.</li>
                        <li>An 18% GST will be applicable on the final invoice, in accordance with government
                            regulations,
                            if the payment is processed via an Indian bank account.</li>
                        <li>Any element additional to the above scope of work will be charged extra.</li>
                        <li>2 Months free maintenance and an AMC will be applicable if continued.</li>
                    </ol>
                </div>

                <div class="section-block"
                    style="margin-top: 40px; border-top: 1px solid var(--border-light); padding-top: 30px;">
                    <h3 style="margin-bottom: 15px;">Tigrid Bank Details</h3>
                    <div
                        style="display: grid; grid-template-columns: auto 1fr; column-gap: 20px; row-gap: 10px; font-weight: 600; font-size: 10.5pt; max-width: 600px;">
                        <div>A/C NAME</div>
                        <div>: TIGRID TECHNOLOGIES PRIVATE LIMITED</div>

                        <div>BANK NAME</div>
                        <div>: STATE BANK OF INDIA</div>

                        <div>BRANCH</div>
                        <div>: KAZHAKUTTAM</div>

                        <div>A/C NO.</div>
                        <div>: 41923692420</div>

                        <div>IFSC</div>
                        <div>: SBIN0070445</div>
                    </div>
                </div>
            </section>
        </div>

        <!-- TERMS & CONDITIONS -->
        <section class="section-container" style="page-break-before: always;">
            <h2>Terms & Conditions</h2>
            <p>The following terms and conditions are exclusively for this project as proposed by Tigrid.
                Should the client require additional implementation and services, an additional agreement is required
                for the same.</p>

            <div class="section-block">
                <ol>
                    <li>Any element additional to the above estimate and scope will be charged extra. If by any mutual
                        agreement there are changes in the scope and pricing, it should be mentioned in the revised
                        proposal and accepted by both parties.</li>
                    <li>At least one person should be available from client-side for proper interaction with our team.
                    </li>
                    <li>The working days in a week will be from Monday-Friday (9AM-6PM IST)</li>
                    <li>Ample time must be provided in case of revisions, edits or change in creative path.</li>
                    <li>The client must provide us with sufficient enough data’s and resources present with them for
                        smooth execution of the project. Any delays at the client’s end, may delay the project and
                        proposed timeframe.</li>
                    <li>When deliverables are no longer confidential, Tigrid may use Client’s name/logo,
                        disclose the general nature of Tigrid’s services to Client, and/or display examples
                        of work provided to Client under this agreement, in conjunction with Tigrid’s
                        promotional or marketing activities.</li>
                    <li>During the course of this proposal or at any time afterward in the case of its acceptance or
                        dismissal, either party will keep strictly confidential all the information regarding issues,
                        business, or operations pertaining to the other party and the information provided by Tigrid.
                    </li>
                    <li>Our company will not be responsible for the unavailability or damage caused due to the
                        misconduct from the client.</li>
                    <li>Depending upon the functionalities required, there may be third-party components. Any unforeseen
                        limitations of third party components are beyond our control. Any third-party component purchase
                        costs (such as Domain purchase, website hosting charges, SSL, Payment gateway, Google Adwords,
                        Plugin licenses etc) are not included in our quotes. The client must pay for the third party
                        components.</li>
                </ol>
            </div>
        </section>

        <!-- THANK YOU / CONCLUSION -->
        <section class="section-container" style="page-break-before: always;">
            <h2>Thank You</h2>

            <div class="section-block">
                <p>I would like to express my heartfelt appreciation for your time and consideration in reviewing the
                    proposal. Choosing Tigrid means choosing a partner who is dedicated to your success, a
                    partner that is passionate about helping your business thrive in the digital age. We invite you to
                    explore our services, engage with our team, and experience the difference that Tigrid
                    can make in your business journey.</p>
                <p>Should you have any queries, require further clarification, or wish to discuss any aspect in more
                    detail, please do not hesitate to reach out to us. We are here to provide the support and
                    information you need to make an informed decision.</p>
                <p>Once again, thank you for considering our proposal. We are excited about the prospect of working
                    together and the potential to make a significant impact in growing your business. We look forward to
                    the opportunity to serve your needs and contribute to your success. Your success is our mission.</p>
            </div>

            <div class="section-block" style="margin-top: 50px;">
                <p>Warm regards,</p>
                <div style="margin-top: 20px;">
                    <div style="font-size: 14pt; font-weight: 700; color: #000000;">Najih Sulthan</div>
                    <div class="text-muted" style="font-weight: 600;">Chief Executive Officer</div>
                </div>
            </div>
        </section>

    </div>

</body>

</html>`;
