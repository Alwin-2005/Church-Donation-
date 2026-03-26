const PDFDocument = require('pdfkit-table');
const path = require('path');
const fs = require('fs');

const LOGO_PATH = path.join(__dirname, '..', 'assets', 'COG.png');

// ─── Design Tokens ────────────────────────────────────────────────────────────
const COLORS = {
    primary: '#0F766E',
    primaryLight: '#14B8A6',
    primaryPale: '#CCFBF1',
    dark: '#0F172A',
    heading: '#134E4A',
    body: '#374151',
    muted: '#6B7280',
    border: '#D1FAF6',
    rowAlt: '#F0FDFA',
    white: '#FFFFFF',
    chartColors: ['#0D9488', '#F59E0B', '#6366F1', '#EF4444', '#10B981'],
};

// PDFKit accepts hex strings directly
const fill = (doc, hex) => doc.fillColor(hex);
const stroke = (doc, hex) => doc.strokeColor(hex);

// ─── Header ───────────────────────────────────────────────────────────────────
function generateHeader(doc, title, period) {
    fill(doc, COLORS.primary);
    doc.rect(0, 0, doc.page.width, 6).fill();

    if (fs.existsSync(LOGO_PATH)) {
        doc.image(LOGO_PATH, 50, 22, { width: 44 });
    }

    fill(doc, COLORS.primary);
    doc.font('Helvetica-Bold').fontSize(17).text('Church Of God', 104, 24);
    fill(doc, COLORS.muted);
    doc.font('Helvetica').fontSize(9)
        .text('742 Evergreen Terrace Street, Maplewood Heights', 104, 45)
        .text('Springfield Illinois 62704, United States', 104, 57)
        .text('contact@churchofgod.org', 104, 69);

    fill(doc, COLORS.primaryPale);
    doc.rect(50, 88, doc.page.width - 100, 1).fill();

    fill(doc, COLORS.dark);
    doc.font('Helvetica-Bold').fontSize(22)
        .text(title, 50, 100, { align: 'center', width: doc.page.width - 100 });

    if (period) {
        fill(doc, COLORS.muted);
        doc.font('Helvetica').fontSize(11)
            .text(`REPORTING PERIOD: ${period.toUpperCase()}`, 50, 128, { align: 'center', width: doc.page.width - 100 });
    }

    fill(doc, COLORS.primary);
    doc.rect(50, 150, doc.page.width - 100, 2).fill();
    fill(doc, COLORS.primaryLight);
    doc.rect(50, 153, doc.page.width - 100, 0.5).fill();

    doc.y = 168;
    doc.x = 50;
}

// ─── Section Header ───────────────────────────────────────────────────────────
function sectionHeader(doc, text) {
    if (doc.y > doc.page.height - 160) doc.addPage();
    doc.x = 50;
    doc.moveDown(1.2);

    const barY = doc.y;
    fill(doc, COLORS.primary);
    doc.rect(50, barY, 4, 20).fill();

    fill(doc, COLORS.heading);
    doc.font('Helvetica-Bold').fontSize(13)
        .text(text.toUpperCase(), 62, barY + 3, { lineBreak: false });

    doc.y = barY + 26;
    doc.x = 50;

    fill(doc, COLORS.border);
    doc.rect(50, doc.y, doc.page.width - 100, 1).fill();
    doc.y += 12;
    doc.x = 50;
}

// ─── Sub-section Label ────────────────────────────────────────────────────────
function subHeader(doc, text) {
    doc.x = 50;
    fill(doc, COLORS.heading);
    doc.font('Helvetica-Bold').fontSize(11)
        .text(text, 50, doc.y, { lineBreak: false });
    doc.y += 18;
    doc.x = 50;
}

// ─── KPI Cards Row ────────────────────────────────────────────────────────────
function drawKpiRow(doc, items) {
    if (doc.y + 60 > doc.page.height - 80) doc.addPage();

    const pageW = doc.page.width - 100;
    const GAP = 4;
    const cardW = (pageW - GAP * (items.length - 1)) / items.length;
    const cardH = 54;
    const startY = doc.y;
    const startX = 50;

    items.forEach((item, i) => {
        const x = startX + i * (cardW + GAP);

        fill(doc, COLORS.rowAlt);
        doc.roundedRect(x, startY, cardW, cardH, 5).fill();

        fill(doc, COLORS.primary);
        doc.rect(x, startY, cardW, 3).fill();

        fill(doc, COLORS.primary);
        doc.font('Helvetica-Bold').fontSize(12)
            .text(item.value, x, startY + 10, { width: cardW, align: 'center', lineBreak: false });

        fill(doc, COLORS.body);
        doc.font('Helvetica-Bold').fontSize(8)
            .text(item.label, x, startY + 29, { width: cardW, align: 'center', lineBreak: false });

        if (item.sub) {
            fill(doc, COLORS.muted);
            doc.font('Helvetica').fontSize(7)
                .text(item.sub, x, startY + 41, { width: cardW, align: 'center', lineBreak: false });
        }
    });

    doc.y = startY + cardH + 12;
    doc.x = 50;
}

// ─── Summary Line ─────────────────────────────────────────────────────────────
// Always pass explicit y; returns next y. Caller must update doc.y.
function drawSummaryLine(doc, label, value, y, isAlt = false) {
    const ROW_H = 22;
    const PAD_TOP = 5;

    // Draw background first so text renders on top
    if (isAlt) {
        fill(doc, COLORS.rowAlt);
        doc.rect(50, y, doc.page.width - 100, ROW_H).fill();
    }

    const textY = y + PAD_TOP;

    fill(doc, COLORS.body);
    doc.font('Helvetica').fontSize(10)
        .text(label, 70, textY, { lineBreak: false });

    fill(doc, COLORS.dark);
    doc.font('Helvetica-Bold').fontSize(10)
        .text(value, 280, textY, { lineBreak: false });

    const nextY = y + ROW_H;
    doc.y = nextY;
    doc.x = 50;
    return nextY;
}

// ─── Pie / Donut Chart ────────────────────────────────────────────────────────
function drawPieChart(doc, data, title, isCurrency = true, options = {}) {
    const chartSize = options.size || 110;
    const centerX = options.centerX || 165;
    const legendX = options.legendX || 295;
    const entries = Object.entries(data);
    const isSmall = !!options.isSmall;
    const legendHeight = entries.length * 22;
    const reqSpace = 70 + Math.max(chartSize, legendHeight) + 40;

    if (doc.y + reqSpace > doc.page.height - 50) doc.addPage();

    if (!options.skipTitle) {
        doc.moveDown(1.2);
        fill(doc, COLORS.heading);
        doc.font('Helvetica-Bold').fontSize(isSmall ? 9 : 11)
            .text(title.toUpperCase(), options.titleX || 50, doc.y, {
                align: isSmall ? 'left' : 'center',
                width: isSmall ? 220 : 500,
                lineBreak: false,
            });
        doc.moveDown(0.5);
    }

    const centerY = doc.y + (chartSize / 2) + 10;
    const total = entries.reduce((s, [, v]) => s + v, 0);

    function polarToCartesian(cx, cy, r, angle) {
        const rad = (angle - 90) * Math.PI / 180;
        return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
    }

    function describeArc(cx, cy, r, startAngle, endAngle) {
        if (Math.abs(endAngle - startAngle) >= 360) return null;
        const s = polarToCartesian(cx, cy, r, endAngle);
        const e = polarToCartesian(cx, cy, r, startAngle);
        const flag = endAngle - startAngle <= 180 ? '0' : '1';
        return `M ${cx} ${cy} L ${s.x} ${s.y} A ${r} ${r} 0 ${flag} 0 ${e.x} ${e.y} Z`;
    }

    let angle = 0;
    if (total === 0) {
        stroke(doc, COLORS.border);
        doc.circle(centerX, centerY, chartSize / 2).lineWidth(1).stroke();
    } else {
        entries.forEach(([, value], i) => {
            if (value <= 0) return;
            const color = COLORS.chartColors[i % COLORS.chartColors.length];
            const sliceAngle = (value / total) * 360;
            if (Math.abs(sliceAngle) >= 359.9) {
                fill(doc, color);
                doc.circle(centerX, centerY, chartSize / 2).fill();
            } else {
                const arc = describeArc(centerX, centerY, chartSize / 2, angle, angle + sliceAngle);
                if (arc) { fill(doc, color); doc.path(arc).fill(); }
            }
            angle += sliceAngle;
        });
    }

    // Legend
    entries.forEach(([label, value], i) => {
        const color = COLORS.chartColors[i % COLORS.chartColors.length];
        const valueStr = isCurrency
            ? `Rs. ${value.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`
            : `${value}`;
        const lY = centerY - (chartSize / 2) + i * 22;

        fill(doc, color);
        doc.roundedRect(legendX, lY + 1, 9, 9, 2).fill();

        fill(doc, COLORS.body);
        doc.font('Helvetica').fontSize(isSmall ? 7.5 : 8.5)
            .text(
                `${label}: ${valueStr} (${((value / total) * 100).toFixed(1)}%)`,
                legendX + 14, lY + 1,
                { width: isSmall ? 115 : 205 }
            );
    });

    // Donut hole
    fill(doc, COLORS.white);
    doc.circle(centerX, centerY, (chartSize / 2) * 0.52).fill();

    // Center text
    const totalLabel = isCurrency ? 'Total' : 'Count';
    const totalStr = isCurrency
        ? `Rs. ${total > 1000 ? (total / 1000).toFixed(1) + 'k' : total.toFixed(0)}`
        : `${total}`;

    fill(doc, COLORS.muted);
    doc.font('Helvetica').fontSize(isSmall ? 7 : 8)
        .text(totalLabel, centerX - 40, centerY - 11, { width: 80, align: 'center' });
    fill(doc, COLORS.dark);
    doc.font('Helvetica-Bold').fontSize(isSmall ? 8 : 10)
        .text(totalStr, centerX - 40, centerY + 1, { width: 80, align: 'center' });

    if (!options.keepY) {
        const legendEndY = centerY - (chartSize / 2) + legendHeight;
        const chartEndY = centerY + (chartSize / 2);
        doc.y = Math.max(legendEndY, chartEndY) + 40;
        doc.x = 50;
    }
}

// ─── Bar Chart ────────────────────────────────────────────────────────────────
function drawBarChart(doc, data, title) {
    const chartH = 150;
    const chartW = 400;
    const originX = 100;

    if (doc.y + 20 + chartH > doc.page.height - 100) doc.addPage();

    fill(doc, COLORS.heading);
    doc.font('Helvetica-Bold').fontSize(12).text(title, 50, doc.y, { lineBreak: false });
    doc.y += 20;

    const originY = doc.y;
    const values = Object.values(data);
    const labels = Object.keys(data);
    const maxVal = Math.max(...values, 1);
    const barWidth = (chartW / labels.length) * 0.65;
    const spacing = (chartW / labels.length) * 0.35;

    [0.25, 0.5, 0.75, 1].forEach(f => {
        const gy = originY + chartH - f * chartH;
        stroke(doc, COLORS.border);
        doc.moveTo(originX, gy).lineTo(originX + chartW, gy).lineWidth(0.4).stroke();
    });

    stroke(doc, COLORS.muted);
    doc.lineWidth(1)
        .moveTo(originX, originY)
        .lineTo(originX, originY + chartH)
        .lineTo(originX + chartW, originY + chartH)
        .stroke();

    labels.forEach((label, i) => {
        const h = (values[i] / maxVal) * chartH;
        const bx = originX + i * (barWidth + spacing) + spacing;
        const by = originY + chartH - h;
        const col = COLORS.chartColors[i % COLORS.chartColors.length];

        fill(doc, col);
        doc.roundedRect(bx, by, barWidth, h, 3).fill();

        fill(doc, COLORS.dark);
        doc.font('Helvetica-Bold').fontSize(8)
            .text(values[i].toFixed(0), bx, by - 13, { width: barWidth, align: 'center', lineBreak: false });

        fill(doc, COLORS.muted);
        doc.font('Helvetica').fontSize(8)
            .text(label, bx, originY + chartH + 6, { width: barWidth, align: 'center' });
    });

    doc.y = originY + chartH + 38;
    doc.x = 50;
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function drawFooter(doc, text) {
    const y = doc.page.height - 38;
    fill(doc, COLORS.primary);
    doc.rect(0, y - 2, doc.page.width, 2).fill();
    fill(doc, COLORS.muted);
    doc.font('Helvetica').fontSize(8)
        .text(text, 50, y + 4, { align: 'right', width: doc.page.width - 100 });
}

// ─── Main Report Generator ────────────────────────────────────────────────────
async function generateAdminReport(reportData, res) {
    return new Promise(async (resolve, reject) => {
        try {
            const doc = new PDFDocument({ margin: 50, size: 'A4' });

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition',
                `attachment; filename=Admin_Report_${new Date().toISOString().split('T')[0]}.pdf`);

            doc.pipe(res);

            // ── Header
            generateHeader(doc, 'System Admin Report', reportData.period);

            // ── KPI snapshot row
            drawKpiRow(doc, [
                { label: 'Total Donations', value: `Rs. ${(reportData.summary.donation.collected || 0).toLocaleString('en-IN')}`, sub: 'Collected this period' },
                { label: 'Total Donors', value: `${reportData.summary.donation.donors || 0}`, sub: 'Active donors' },
                { label: 'Avg Donation', value: `Rs. ${(reportData.summary.donation.average || 0).toLocaleString('en-IN')}`, sub: 'Per donor' },
                { label: 'Merch Revenue', value: `Rs. ${(reportData.summary.merch.revenue || 0).toLocaleString('en-IN')}`, sub: `${reportData.summary.merch.totalOrders || 0} orders` },
            ]);

            // ── SECTION 1: SUMMARY OVERVIEW
            sectionHeader(doc, 'Summary Overview');

            subHeader(doc, 'Donation Summary');
            let y = doc.y;
            y = drawSummaryLine(doc, 'Total Donations Collected:', `Rs. ${(reportData.summary.donation.collected || 0).toFixed(2)}`, y, false);
            y = drawSummaryLine(doc, 'Total Number of Donors:', `${reportData.summary.donation.donors || 0}`, y, true);
            y = drawSummaryLine(doc, 'Average Donation Amount:', `Rs. ${(reportData.summary.donation.average || 0).toFixed(2)}`, y, false);
            y = drawSummaryLine(doc, 'Top Performing Campaign:', `${reportData.summary.donation.topCampaign || 'N/A'}`, y, true);

            doc.y = y + 14;
            doc.x = 50;

            subHeader(doc, 'Merchandise Orders Summary');
            y = doc.y;
            y = drawSummaryLine(doc, 'Total Orders:', `${reportData.summary.merch.totalOrders || 0}`, y, false);
            y = drawSummaryLine(doc, 'Total Revenue:', `Rs. ${(reportData.summary.merch.revenue || 0).toFixed(2)}`, y, true);
            y = drawSummaryLine(doc, 'Top Selling Product:', `${reportData.summary.merch.topProduct || 'N/A'}`, y, false);

            doc.y = y + 14;
            doc.x = 50;

            // ── Pie charts
            if (reportData.pieCharts && Object.keys(reportData.pieCharts.campaigns || {}).length > 0) {
                drawPieChart(doc, reportData.pieCharts.campaigns, 'Donation Distribution by Campaign', true);
            }
            if (reportData.pieCharts && Object.keys(reportData.pieCharts.merchSales || {}).length > 0) {
                drawPieChart(doc, reportData.pieCharts.merchSales, 'Merchandise Sold by Category', false);
            }

            // ── Side-by-side comparison charts
            const hasMutual = Object.keys(reportData.pieCharts.donationByMutualRole || {}).length > 0;
            const hasAll = Object.keys(reportData.pieCharts.donationByAllRole || {}).length > 0;

            if (hasMutual || hasAll) {
                if (doc.y > doc.page.height - 200) doc.addPage();
                const rowStartY = doc.y;
                let maxY = rowStartY;

                if (hasMutual) {
                    drawPieChart(doc, reportData.pieCharts.donationByMutualRole, 'Mutual Campaigns', true, {
                        size: 90, centerX: 110, legendX: 180, isSmall: true, titleX: 50, keepY: true,
                    });
                    maxY = Math.max(maxY, doc.y);
                }

                if (hasAll) {
                    doc.y = rowStartY;
                    drawPieChart(doc, reportData.pieCharts.donationByAllRole, 'Overall (External vs Church)', true, {
                        size: 90, centerX: 360, legendX: 430, isSmall: true, titleX: 300, keepY: true,
                    });
                    maxY = Math.max(maxY, doc.y);
                }

                doc.y = maxY + 40;
                doc.x = 50;
            }

            // ── User Statistics
            subHeader(doc, 'User Statistics');
            y = doc.y;
            y = drawSummaryLine(doc, 'Total Registered Users:', `${reportData.summary.user.total || 0}`, y, false);
            y = drawSummaryLine(doc, 'New Users (Period):', `${reportData.summary.user.new || 0}`, y, true);
            y = drawSummaryLine(doc, 'Verified Users:', `${reportData.summary.user.verified || 0}`, y, false);
            y = drawSummaryLine(doc, 'Active Donors:', `${reportData.summary.user.active || 0}`, y, true);

            doc.y = y + 14;
            doc.x = 50;

            // ── SECTION 2: ANALYTICS SUMMARY
            sectionHeader(doc, 'Analytics Summary');

            drawKpiRow(doc, [
                { label: 'Highest Donation Month', value: reportData.analytics.topMonth || 'N/A', sub: 'Peak activity' },
                { label: 'Most Popular Campaign', value: reportData.analytics.popularCampaign || 'N/A', sub: 'By donation value' },
                { label: 'Top-Selling Merch', value: reportData.analytics.popularMerch || 'N/A', sub: 'Best seller' },
            ]);

            doc.moveDown(2);
            drawFooter(doc, reportData.notes);

            doc.end();
            doc.on('end', () => resolve());
        } catch (err) {
            console.error('Error generating report:', err);
            reject(err);
        }
    });
}

module.exports = { generateAdminReport };