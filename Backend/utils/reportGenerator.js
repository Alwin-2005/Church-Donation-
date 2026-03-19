const PDFDocument = require('pdfkit-table');
const path = require('path');
const fs = require('fs');

const LOGO_PATH = path.join(__dirname, '..', 'assets', 'COG.png');

function generateHeader(doc, title, period) {
    const oldY = doc.y;

    if (fs.existsSync(LOGO_PATH)) {
        doc.image(LOGO_PATH, 50, 45, { width: 50 });
    }

    doc
        .fillColor('#444444')
        .fontSize(20)
        .text('Church Of God', 110, 57)
        .fontSize(10)
        .text('742 Evergreen Terrace Street, Maplewood Heights', 110, 80)
        .text('Springfield Illinois 62704, United States', 110, 95)
        .text('contact@churchofgod.org', 110, 110);

    doc
        .fillColor('#000000')
        .fontSize(22)
        .text(title, 50, 140, { align: 'center' });

    if (period) {
        doc
            .fontSize(14)
            .fillColor('#666666')
            .text(`REPORTING PERIOD: ${period.toUpperCase()}`, 50, 170, { align: 'center' });
    }

    doc.moveTo(50, 195).lineTo(550, 195).stroke();

    // Set the current Y position just below the header so that new page inputs start properly
    doc.y = 210;
}


function sectionHeader(doc, text) {
    if (doc.y > doc.page.height - 150) {
        doc.addPage();
    }
    doc.x = 50;
    doc.moveDown(1.5);
    doc.fillColor('#2d3748').fontSize(16).font('Helvetica-Bold').text(text.toUpperCase(), { align: 'left' });
    doc.moveTo(50, doc.y + 2).lineTo(550, doc.y + 2).strokeColor('#CBD5E0').stroke();
    doc.moveDown(1);
}

function drawBarChart(doc, data, title) {
    const chartHeight = 150;
    const chartWidth = 400;
    const startX = 100;

    if (doc.y + 20 + chartHeight > doc.page.height - 100) {
        doc.addPage();
    }

    const startY = doc.y + 20;

    doc.font('Helvetica-Bold').fontSize(12).text(title, 50, doc.y);
    doc.moveDown(0.5);

    const values = Object.values(data);
    const labels = Object.keys(data);
    const maxVal = Math.max(...values, 1);
    const barWidth = (chartWidth / labels.length) * 0.7;
    const spacing = (chartWidth / labels.length) * 0.3;

    // Draw Axes
    doc.lineWidth(1).strokeColor('#A0AEC0')
        .moveTo(startX, startY).lineTo(startX, startY + chartHeight).lineTo(startX + chartWidth, startY + chartHeight).stroke();

    labels.forEach((label, i) => {
        const h = (values[i] / maxVal) * chartHeight;
        const x = startX + i * (barWidth + spacing) + spacing;
        const y = startY + chartHeight - h;

        doc.fillColor('#4C51BF').rect(x, y, barWidth, h).fill();
        doc.fillColor('#4A5568').fontSize(8).text(label, x, startY + chartHeight + 5, { width: barWidth, align: 'center' });
        doc.fillColor('#2D3748').text(values[i].toFixed(0), x, y - 12, { width: barWidth, align: 'center' });
    });

    doc.y = startY + chartHeight + 40;
    doc.x = 50;
}

function drawPieChart(doc, data, title, isCurrency = true) {
    const chartSize = 120;
    const centerX = 200;
    const entries = Object.entries(data);

    // Calculate max height needed securely
    const legendHeight = entries.length * 22;
    const requiredSpace = 70 + Math.max(chartSize, legendHeight) + 40;

    if (doc.y + requiredSpace > doc.page.height - 50) {
        doc.addPage();
    }

    const centerY = doc.y + 70;
    doc.font('Helvetica-Bold').fontSize(12).text(title, 50, doc.y);

    const total = entries.reduce((s, [_, v]) => s + v, 0);

    const colors = ['#4C51BF', '#38B2AC', '#F6AD55', '#E53E3E', '#805AD5'];

    function polarToCartesian(cx, cy, r, angle) {
        const rad = (angle - 90) * Math.PI / 180.0;
        return {
            x: cx + (r * Math.cos(rad)),
            y: cy + (r * Math.sin(rad))
        };
    }

    function describeArc(cx, cy, r, startAngle, endAngle) {
        if (Math.abs(endAngle - startAngle) >= 360) return null;
        const start = polarToCartesian(cx, cy, r, endAngle);
        const end = polarToCartesian(cx, cy, r, startAngle);
        const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
        return [
            "M", cx, cy,
            "L", start.x, start.y,
            "A", r, r, 0, largeArcFlag, 0, end.x, end.y,
            "Z"
        ].join(" ");
    }

    let currentAngle = 0;

    if (total === 0) {
        doc.circle(centerX, centerY, chartSize / 2).lineWidth(1).strokeColor('#E2E8F0').stroke();
    } else {
        entries.forEach(([label, value], i) => {
            if (value <= 0) return;
            const color = colors[i % colors.length];
            const sliceAngle = (value / total) * 360;

            if (Math.abs(sliceAngle) >= 359.9) {
                doc.circle(centerX, centerY, chartSize / 2).fill(color);
            } else {
                const arcPath = describeArc(centerX, centerY, chartSize / 2, currentAngle, currentAngle + sliceAngle);
                if (arcPath) {
                    doc.path(arcPath).fill(color);
                }
            }

            currentAngle += sliceAngle;
        });
    }

    entries.forEach(([label, value], i) => {
        const color = colors[i % colors.length];
        const valueStr = isCurrency ? `Rs. ${value.toFixed(2)}` : `${value}`;

        // Legend
        doc.fillColor(color).rect(350, centerY - (chartSize / 2) + (i * 22), 12, 12).fill();
        doc.fillColor('#4A5568').fontSize(9).font('Helvetica').text(
            `${label}: ${valueStr} (${((value / total) * 100).toFixed(1)}%)`,
            370,
            centerY - (chartSize / 2) + (i * 22) + 2
        );
    });

    // Center Label creating a Donut effect
    doc.circle(centerX, centerY, (chartSize / 2) * 0.55).fill('#FFFFFF');

    // Display actual total inside the donut center
    const totalStr = isCurrency ? `Rs. ${total > 1000 ? (total / 1000).toFixed(1) + 'k' : total}` : `${total}`;
    doc.fillColor('#718096').font('Helvetica').fontSize(10).text("Total", centerX - 45, centerY - 12, { width: 90, align: 'center' });
    doc.fillColor('#2D3748').font('Helvetica-Bold').fontSize(12).text(totalStr, centerX - 45, centerY, { width: 90, align: 'center' });

    const legendEndY = centerY - (chartSize / 2) + legendHeight;
    const chartEndY = centerY + (chartSize / 2);
    doc.y = Math.max(legendEndY, chartEndY) + 40;
    doc.x = 50;
}

// Generate the whole report
async function generateAdminReport(reportData, res) {
    return new Promise(async (resolve, reject) => {
        try {
            // Buffer pages if needed
            const doc = new PDFDocument({ margin: 50, size: 'A4' });

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=Admin_Report_${new Date().toISOString().split('T')[0]}.pdf`);

            doc.pipe(res);

            // Print the first page header (since 'pageAdded' doesn't fire for the first page)
            generateHeader(doc, 'System Admin Report', reportData.period);

            // SECTION 1: SUMMARY OVERVIEW
            sectionHeader(doc, 'Summary Overview');
            doc.font('Helvetica-Bold').fontSize(14).fillColor('#000').text('Donation Summary');
            doc.font('Helvetica').fontSize(12).fillColor('#444')
                .text(`• Total Donations Collected: Rs. ${(reportData.summary.donation.collected || 0).toFixed(2)}`)
                .text(`• Total Number of Donors: ${reportData.summary.donation.donors || 0}`)
                .text(`• Average Donation Amount: Rs. ${(reportData.summary.donation.average || 0).toFixed(2)}`)
                .text(`• Top Performing Donation Campaign: ${reportData.summary.donation.topCampaign || 'N/A'}`);
            doc.moveDown(0.5);

            doc.font('Helvetica-Bold').fontSize(14).fillColor('#000').text('Merchandise Orders Summary');
            doc.font('Helvetica').fontSize(12).fillColor('#444')
                .text(`• Total Orders: ${reportData.summary.merch.totalOrders || 0}`)
                .text(`• Total Revenue from Merchandise: Rs. ${(reportData.summary.merch.revenue || 0).toFixed(2)}`)
                .text(`• Completed Orders: ${reportData.summary.merch.completed || 0}`)
                .text(`• Top Selling Product: ${reportData.summary.merch.topProduct || 'N/A'}`);
            doc.moveDown(1);

            // CHARTS SECTION
            sectionHeader(doc, 'Visual Analytics');
            const revenueData = {
                'Donations': reportData.summary.donation.collected,
                'Merch Revenue': reportData.summary.merch.revenue
            };
            drawBarChart(doc, revenueData, 'Revenue Comparison (Donations vs Merchandise)');

            if (reportData.pieCharts && Object.keys(reportData.pieCharts.campaigns || {}).length > 0) {
                drawPieChart(doc, reportData.pieCharts.campaigns, 'Donation Distribution by Campaign', true);
            }
            if (reportData.pieCharts && Object.keys(reportData.pieCharts.userTypes || {}).length > 0) {
                drawPieChart(doc, reportData.pieCharts.userTypes, 'User Distribution by Type', false);
            }
            if (reportData.pieCharts && Object.keys(reportData.pieCharts.merchSales || {}).length > 0) {
                drawPieChart(doc, reportData.pieCharts.merchSales, 'Merchandise Sold by Product', false);
            }

            doc.x = 50;
            doc.font('Helvetica-Bold').fontSize(14).fillColor('#000').text('User Statistics');
            doc.font('Helvetica').fontSize(12).fillColor('#444')
                .text(`• Total Registered Users: ${reportData.summary.user.total || 0}`)
                .text(`• New Users During This Period: ${reportData.summary.user.new || 0}`)
                .text(`• Verified Users: ${reportData.summary.user.verified || 0}`)
                .text(`• Active Donors: ${reportData.summary.user.active || 0}`);
            doc.moveDown(1);

            // SECTION 2: DONATION REPORT TABLE
            sectionHeader(doc, 'Donation Report');
            const donationTable = {
                headers: [
                    { label: 'Date', property: 'date', width: 60 },
                    { label: 'Donor Name', property: 'donor', width: 80 },
                    { label: 'Email', property: 'email', width: 110 },
                    { label: 'Campaign', property: 'campaign', width: 80 },
                    { label: 'Amount', property: 'amount', width: 60 },
                    { label: 'Txn ID', property: 'txn', width: 55 },
                    { label: 'Status', property: 'status', width: 50 }
                ],
                rows: reportData.donationTable || []
            };
            await doc.table(donationTable, {
                prepareHeader: () => doc.font("Helvetica-Bold").fontSize(10),
                prepareRow: () => doc.font("Helvetica").fontSize(10)
            });

            // SECTION 3: MERCHANDISE ORDERS REPORT
            sectionHeader(doc, 'Merchandise Orders Report');
            const merchTable = {
                headers: [
                    { label: 'Order ID', property: 'id', width: 60 },
                    { label: 'Customer', property: 'customer', width: 80 },
                    { label: 'Product', property: 'product', width: 120 },
                    { label: 'Qty', property: 'qty', width: 30 },
                    { label: 'Total', property: 'total', width: 50 },
                    { label: 'Status', property: 'status', width: 60 },
                    { label: 'Date', property: 'date', width: 80 }
                ],
                rows: reportData.merchTable || []
            };
            await doc.table(merchTable, {
                prepareHeader: () => doc.font("Helvetica-Bold").fontSize(10),
                prepareRow: () => doc.font("Helvetica").fontSize(10)
            });

            // SECTION 4: CAMPAIGN PERFORMANCE REPORT
            sectionHeader(doc, 'Campaign Performance Report');
            const campaignTable = {
                headers: [
                    { label: 'Campaign Name', property: 'name', width: 180 },
                    { label: 'Goal Amount', property: 'goal', width: 100 },
                    { label: 'Collected', property: 'collected', width: 100 },
                    { label: 'Completion %', property: 'completion', width: 100 }
                ],
                rows: reportData.campaignTable || []
            };
            await doc.table(campaignTable, {
                prepareHeader: () => doc.font("Helvetica-Bold").fontSize(10),
                prepareRow: () => doc.font("Helvetica").fontSize(10)
            });

            // SECTION 5: USER REGISTRATION REPORT
            sectionHeader(doc, 'User Registration Report');
            const userTable = {
                headers: [
                    { label: 'User Name', property: 'name', width: 90 },
                    { label: 'Email', property: 'email', width: 120 },
                    { label: 'Reg. Date', property: 'date', width: 70 },
                    { label: 'User Type', property: 'type', width: 70 },
                    { label: 'Donations', property: 'donations', width: 70 },
                    { label: 'Orders', property: 'orders', width: 60 }
                ],
                rows: reportData.userTable || []
            };
            await doc.table(userTable, {
                prepareHeader: () => doc.font("Helvetica-Bold").fontSize(10),
                prepareRow: () => doc.font("Helvetica").fontSize(10)
            });

            // SECTION 6: ANALYTICS SUMMARY
            sectionHeader(doc, 'Analytics Summary');
            doc.font('Helvetica').fontSize(12).fillColor('#444')
                .text(`• Month with the highest donations: ${reportData.analytics.topMonth || 'N/A'}`)
                .text(`• Most popular donation campaign: ${reportData.analytics.popularCampaign || 'N/A'}`)
                .text(`• Most purchased merchandise item: ${reportData.analytics.popularMerch || 'N/A'}`);

            doc.moveDown(2);
            doc.fontSize(10).fillColor('#666').text(reportData.notes, { align: 'right' });

            doc.end();

            doc.on('end', () => resolve());
        } catch (err) {
            console.error('Error generating report:', err);
            reject(err);
        }
    });
}

module.exports = {
    generateAdminReport
};
