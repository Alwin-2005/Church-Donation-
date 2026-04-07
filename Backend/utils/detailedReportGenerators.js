const PDFDocument = require('pdfkit-table');

// Import all shared styled helpers from the main report generator
const {
    COLORS, fill,
    generateHeader, sectionHeader, subHeader,
    drawKpiRow, drawSummaryLine, drawPieChart,
    drawFooter,
} = require('./reportGenerator');

function initializePDF(res, title) {
    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${title}_${new Date().toISOString().split('T')[0]}.pdf`);
    doc.pipe(res);
    return doc;
}

// Factory: returns table style options with doc captured in closure.
// pdfkit-table calls prepareHeader() with NO args and
// prepareRow(row, indexColumn, indexRow, rectRow, rectCell) where row is data.
function getTableOptions(doc) {
    return {
        prepareHeader: () => {
            doc.font('Helvetica-Bold').fontSize(9).fillColor(COLORS.dark);
        },
        prepareRow: (row, indexColumn, indexRow, rectRow, rectCell) => {
            doc.font('Helvetica').fontSize(8).fillColor(COLORS.dark);
        },
        padding: 5,
        divider: {
            header:     { disabled: false, width: 2,   opacity: 1   },
            horizontal: { disabled: false, width: 0.5, opacity: 0.5 },
        },
    };
}

// ─── Detailed Donation Report ─────────────────────────────────────────────────
async function generateDetailedDonationReport(reportData, res) {
    return new Promise(async (resolve, reject) => {
        try {
            const doc = initializePDF(res, 'Donation_Report');
            generateHeader(doc, 'Detailed Donation Report', reportData.period);

            // ── KPI Cards
            drawKpiRow(doc, [
                { label: 'Total Collected', value: `Rs. ${(reportData.summary.donation.collected || 0).toLocaleString('en-IN')}`, sub: 'Paid donations' },
                { label: 'Active Donors',   value: `${reportData.summary.donation.donors || 0}`,                                  sub: 'Unique donors' },
                { label: 'Avg Donation',    value: `Rs. ${(reportData.summary.donation.average || 0).toLocaleString('en-IN')}`,   sub: 'Per donor' },
                { label: 'Top Campaign',    value: `${(reportData.summary.donation.topCampaign || 'N/A').substring(0, 12)}`,      sub: 'Highest collected' },
            ]);

            // ── Summary Section
            sectionHeader(doc, 'Donation Summary');
            let y = doc.y;
            y = drawSummaryLine(doc, 'Total Donations Collected:', `Rs. ${(reportData.summary.donation.collected || 0).toFixed(2)}`, y, false);
            y = drawSummaryLine(doc, 'Total Number of Donors:',    `${reportData.summary.donation.donors || 0}`,                      y, true);
            y = drawSummaryLine(doc, 'Average Donation Amount:',   `Rs. ${(reportData.summary.donation.average || 0).toFixed(2)}`,    y, false);
            y = drawSummaryLine(doc, 'Top Performing Campaign:',   `${reportData.summary.donation.topCampaign || 'N/A'}`,             y, true);
            doc.y = y + 12;
            doc.x = 50;

            // ── Pie chart: donation by campaign
            if (reportData.pieCharts && Object.keys(reportData.pieCharts.campaigns || {}).length > 0) {
                drawPieChart(doc, reportData.pieCharts.campaigns, 'Donation Distribution by Campaign', true);
            }

            // ── Pie charts: role breakdown (side-by-side)
            const hasMutual = Object.keys(reportData.pieCharts?.donationByMutualRole || {}).length > 0;
            const hasAll    = Object.keys(reportData.pieCharts?.donationByAllRole    || {}).length > 0;
            if (hasMutual || hasAll) {
                if (doc.y > doc.page.height - 200) doc.addPage();
                const rowStartY = doc.y;

                let maxLegendItems = 0;

                if (hasMutual) {
                    const keys = Object.keys(reportData.pieCharts.donationByMutualRole);
                    maxLegendItems = Math.max(maxLegendItems, keys.length);
                    drawPieChart(doc, reportData.pieCharts.donationByMutualRole, 'Mutual Campaigns', true, {
                        size: 90, centerX: 110, legendX: 180, isSmall: true, titleX: 50, keepY: true,
                    });
                }
                if (hasAll) {
                    doc.y = rowStartY; // Reset Y so second chart draws horizontally adjacent!
                    const keys = Object.keys(reportData.pieCharts.donationByAllRole);
                    maxLegendItems = Math.max(maxLegendItems, keys.length);
                    drawPieChart(doc, reportData.pieCharts.donationByAllRole, 'Overall (External vs Church)', true, {
                        size: 90, centerX: 360, legendX: 430, isSmall: true, titleX: 300, keepY: true,
                    });
                }
                // Dynamically offset Y based on the tallest legend to prevent overlap
                doc.y = Math.max(rowStartY + 170, rowStartY + 90 + (maxLegendItems * 22));
                doc.x = 50;
            }

            // ── Records Table
            sectionHeader(doc, 'All Donation Records (up to 1,000)');
            doc.moveDown(0.5);
            const tableRows = reportData.donationTable.slice(0, 1000);
            await doc.table({
                headers: [
                    { label: 'Date',       property: 'date',     width: 60,  headerColor: COLORS.primary },
                    { label: 'Donor Name', property: 'name',     width: 90,  headerColor: COLORS.primary },
                    { label: 'Campaign',   property: 'campaign', width: 120, headerColor: COLORS.primary },
                    { label: 'Amount',     property: 'amount',   width: 60,  headerColor: COLORS.primary },
                    { label: 'Receipt No', property: 'receipt',  width: 90,  headerColor: COLORS.primary },
                    { label: 'Status',     property: 'status',   width: 70,  headerColor: COLORS.primary },
                ],
                datas: tableRows.map(row => ({
                    date: row[0], name: row[1], campaign: row[3],
                    amount: row[4], receipt: row[5], status: row[7],
                })),
            }, getTableOptions(doc));

            drawFooter(doc, reportData.notes);
            doc.end();
            doc.on('end', () => resolve());
        } catch (err) {
            reject(err);
        }
    });
}

// ─── Detailed Order Report ────────────────────────────────────────────────────
async function generateDetailedOrderReport(reportData, res) {
    return new Promise(async (resolve, reject) => {
        try {
            const doc = initializePDF(res, 'Order_Report');
            generateHeader(doc, 'Detailed Merchandise Orders', reportData.period);

            // ── KPI Cards
            drawKpiRow(doc, [
                { label: 'Total Revenue',  value: `Rs. ${(reportData.summary.merch.revenue || 0).toLocaleString('en-IN')}`, sub: 'Paid orders' },
                { label: 'Total Orders',   value: `${reportData.summary.merch.totalOrders || 0}`,                           sub: 'All orders' },
                { label: 'Completed',      value: `${reportData.summary.merch.completed || 0}`,                             sub: 'Paid & fulfilled' },
                { label: 'Top Product',    value: `${(reportData.summary.merch.topProduct || 'N/A').substring(0, 12)}`,     sub: 'Best seller' },
            ]);

            // ── Summary Section
            sectionHeader(doc, 'Merchandise Orders Summary');
            let y = doc.y;
            y = drawSummaryLine(doc, 'Total Revenue:',       `Rs. ${(reportData.summary.merch.revenue || 0).toFixed(2)}`, y, false);
            y = drawSummaryLine(doc, 'Total Orders:',        `${reportData.summary.merch.totalOrders || 0}`,               y, true);
            y = drawSummaryLine(doc, 'Completed Orders:',    `${reportData.summary.merch.completed || 0}`,                 y, false);
            y = drawSummaryLine(doc, 'Top Selling Product:', `${reportData.summary.merch.topProduct || 'N/A'}`,            y, true);
            doc.y = y + 12;
            doc.x = 50;

            // ── Pie chart: merch by category
            if (reportData.pieCharts && Object.keys(reportData.pieCharts.merchSales || {}).length > 0) {
                drawPieChart(doc, reportData.pieCharts.merchSales, 'Merchandise Sold by Category', false);
            }

            // ── Records Table
            sectionHeader(doc, 'All Merchandise Orders (up to 1,000)');
            doc.moveDown(0.5);
            const tableRows = reportData.merchTable.slice(0, 1000);
            await doc.table({
                headers: [
                    { label: 'Date',      property: 'date',   width: 60,  headerColor: COLORS.primary },
                    { label: 'User Name', property: 'name',   width: 90,  headerColor: COLORS.primary },
                    { label: 'Items',     property: 'items',  width: 150, headerColor: COLORS.primary },
                    { label: 'Qty',       property: 'qty',    width: 40,  headerColor: COLORS.primary },
                    { label: 'Amount',    property: 'amount', width: 70,  headerColor: COLORS.primary },
                    { label: 'Status',    property: 'status', width: 80,  headerColor: COLORS.primary },
                ],
                datas: tableRows.map(row => ({
                    date: row[6], name: row[1], items: row[2],
                    qty: row[3], amount: row[4], status: row[5],
                })),
            }, getTableOptions(doc));

            drawFooter(doc, reportData.notes);
            doc.end();
            doc.on('end', () => resolve());
        } catch (err) {
            reject(err);
        }
    });
}

// ─── Detailed Payment Report ──────────────────────────────────────────────────
async function generateDetailedPaymentReport(reportData, res) {
    return new Promise(async (resolve, reject) => {
        try {
            const doc = initializePDF(res, 'Payment_Report');
            generateHeader(doc, 'Detailed Unified Payments', reportData.period);

            const totalPayments = reportData.paymentTable.length;

            // ── KPI Cards
            drawKpiRow(doc, [
                { label: 'Total Payments', value: `${totalPayments}`,                                                                    sub: 'All payment records'  },
                { label: 'Total Revenue',  value: `Rs. ${(reportData.summary.merch.revenue || 0).toLocaleString('en-IN')}`,              sub: 'Paid orders'          },
                { label: 'Top Product',    value: `${(reportData.summary.merch.topProduct || 'N/A').substring(0, 12)}`,                  sub: 'Best seller'          },
                { label: 'Total Orders',   value: `${reportData.summary.merch.totalOrders || 0}`,                                        sub: 'Order records'        },
            ]);

            // ── Summary Section
            sectionHeader(doc, 'Payment Summary');
            let y = doc.y;
            y = drawSummaryLine(doc, 'Total Payment Records:', `${totalPayments}`,                                               y, false);
            y = drawSummaryLine(doc, 'Total Merch Revenue:',   `Rs. ${(reportData.summary.merch.revenue || 0).toFixed(2)}`,      y, true);
            y = drawSummaryLine(doc, 'Total Orders:',          `${reportData.summary.merch.totalOrders || 0}`,                   y, false);
            y = drawSummaryLine(doc, 'Top Selling Product:',   `${reportData.summary.merch.topProduct || 'N/A'}`,                y, true);
            doc.y = y + 12;
            doc.x = 50;

            // ── Records Table
            sectionHeader(doc, 'All Payment Records (up to 1,000)');
            doc.moveDown(0.5);
            const tableRows = reportData.paymentTable.slice(0, 1000);
            await doc.table({
                headers: [
                    { label: 'Date',           property: 'date',   width: 60,  headerColor: COLORS.primary },
                    { label: 'Transaction ID', property: 'txn',    width: 110, headerColor: COLORS.primary },
                    { label: 'Name',           property: 'name',   width: 100, headerColor: COLORS.primary },
                    { label: 'Method',         property: 'method', width: 70,  headerColor: COLORS.primary },
                    { label: 'Amount',         property: 'amount', width: 70,  headerColor: COLORS.primary },
                    { label: 'Status',         property: 'status', width: 80,  headerColor: COLORS.primary },
                ],
                datas: tableRows.map(row => ({
                    date: row[6], txn: row[0], name: row[1],
                    method: row[5], amount: row[4], status: row[7],
                })),
            }, getTableOptions(doc));

            drawFooter(doc, reportData.notes);
            doc.end();
            doc.on('end', () => resolve());
        } catch (err) {
            reject(err);
        }
    });
}

// ─── Sales / Revenue Report (Orders + Payments merged) ───────────────────────
async function generateSalesRevenueReport(reportData, res) {
    return new Promise(async (resolve, reject) => {
        try {
            const doc = initializePDF(res, 'Sales_Revenue_Report');
            generateHeader(doc, 'Sales & Revenue Report', reportData.period);

            const totalPayments = reportData.paymentTable.length;

            // ── KPI Cards — full top product name, no truncation
            drawKpiRow(doc, [
                { label: 'Merch Revenue',   value: `Rs. ${(reportData.summary.merch.revenue || 0).toLocaleString('en-IN')}`, sub: 'From paid orders'  },
                { label: 'Total Orders',    value: `${reportData.summary.merch.totalOrders || 0}`,                            sub: 'All order records' },
                { label: 'Payment Records', value: `${totalPayments}`,                                                        sub: 'Gateway entries'   },
                { label: 'Top Product',     value: `${reportData.summary.merch.topProduct || 'N/A'}`,                        sub: 'Best seller'       },
            ]);

            // ── Merchandise Summary (no Completed Orders line)
            sectionHeader(doc, 'Merchandise Orders Summary');
            let y = doc.y;
            y = drawSummaryLine(doc, 'Total Merch Revenue:',  `Rs. ${(reportData.summary.merch.revenue || 0).toFixed(2)}`, y, false);
            y = drawSummaryLine(doc, 'Total Orders:',         `${reportData.summary.merch.totalOrders || 0}`,               y, true);
            y = drawSummaryLine(doc, 'Top Selling Product:',  `${reportData.summary.merch.topProduct || 'N/A'}`,            y, false);
            doc.y = y + 12;
            doc.x = 50;

            // ── Payment Records Summary
            sectionHeader(doc, 'Payment Records Summary');
            y = doc.y;
            y = drawSummaryLine(doc, 'Total Payment Records:', `${totalPayments}`,                                           y, false);
            y = drawSummaryLine(doc, 'Total Merch Revenue:',   `Rs. ${(reportData.summary.merch.revenue || 0).toFixed(2)}`,  y, true);
            doc.y = y + 12;
            doc.x = 50;

            // ── Pie chart: merch by category
            if (reportData.pieCharts && Object.keys(reportData.pieCharts.merchSales || {}).length > 0) {
                drawPieChart(doc, reportData.pieCharts.merchSales, 'Merchandise Sold by Category', false);
            }

            // ── Orders Table
            sectionHeader(doc, 'Merchandise Order Records');
            doc.moveDown(0.5);
            const orderRows = reportData.merchTable.slice(0, 1000);
            await doc.table({
                headers: [
                    { label: 'Date',   property: 'date',   width: 60,  headerColor: COLORS.primary },
                    { label: 'User',   property: 'name',   width: 90,  headerColor: COLORS.primary },
                    { label: 'Items',  property: 'items',  width: 145, headerColor: COLORS.primary },
                    { label: 'Qty',    property: 'qty',    width: 40,  headerColor: COLORS.primary },
                    { label: 'Amount', property: 'amount', width: 75,  headerColor: COLORS.primary },
                    { label: 'Status', property: 'status', width: 80,  headerColor: COLORS.primary },
                ],
                datas: orderRows.map(row => ({
                    date: row[6], name: row[1], items: row[2],
                    qty: row[3], amount: row[4], status: row[5],
                })),
            }, getTableOptions(doc));

            // ── Payments Table — sectionHeader handles page-break detection
            sectionHeader(doc, 'Payment Records');
            doc.moveDown(0.5);
            const paymentRows = reportData.paymentTable.slice(0, 1000);
            await doc.table({
                headers: [
                    { label: 'Date',           property: 'date',   width: 60,  headerColor: COLORS.primary },
                    { label: 'Transaction ID', property: 'txn',    width: 110, headerColor: COLORS.primary },
                    { label: 'Name',           property: 'name',   width: 95,  headerColor: COLORS.primary },
                    { label: 'Method',         property: 'method', width: 65,  headerColor: COLORS.primary },
                    { label: 'Amount',         property: 'amount', width: 65,  headerColor: COLORS.primary },
                    { label: 'Status',         property: 'status', width: 95,  headerColor: COLORS.primary },
                ],
                datas: paymentRows.map(row => ({
                    date: row[6], txn: row[0], name: row[1],
                    method: row[5], amount: row[4], status: row[7],
                })),
            }, getTableOptions(doc));

            drawFooter(doc, reportData.notes);
            doc.end();
            doc.on('end', () => resolve());
        } catch (err) {
            reject(err);
        }
    });
}

module.exports = {
    generateDetailedDonationReport,
    generateDetailedOrderReport,
    generateDetailedPaymentReport,
    generateSalesRevenueReport,
};
