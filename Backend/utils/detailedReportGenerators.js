const PDFDocument = require('pdfkit-table');
const path = require('path');
const fs = require('fs');

const LOGO_PATH = path.join(__dirname, '..', 'assets', 'COG.png');

const COLORS = {
    primary: '#C06C4C',
    primaryLight: '#D18D73',
    primaryPale: '#F9ECE5',
    dark: '#1C1C1C',
    heading: '#1C1C1C',
    body: '#454545',
    muted: '#7A7A7A',
    border: '#E8E8E8',
    rowAlt: '#FAF9F4',
    white: '#FFFFFF',
};

const fill = (doc, hex) => doc.fillColor(hex);

function generateHeader(doc, title, period) {
    fill(doc, COLORS.primary);
    doc.rect(0, 0, doc.page.width, 6).fill();

    if (fs.existsSync(LOGO_PATH)) {
        doc.image(LOGO_PATH, 50, 22, { width: 44 });
    }

    fill(doc, COLORS.primary);
    doc.font('Helvetica-Bold').fontSize(17).text('Church Of God Full Gospel In India', 104, 24);
    fill(doc, COLORS.muted);
    doc.font('Helvetica').fontSize(9)
        .text('Christian Society, 29B, opp. Vinay Vihar, Behrampura', 104, 45)
        .text('Ahmedabad, Gujarat 380022', 104, 57)
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

    doc.y = 170;
    doc.x = 50;
}

function drawFooter(doc, text) {
    const y = doc.page.height - 38;
    fill(doc, COLORS.primary);
    doc.rect(0, y - 2, doc.page.width, 2).fill();
    fill(doc, COLORS.muted);
    doc.font('Helvetica').fontSize(8)
        .text(text, 50, y + 4, { align: 'right', width: doc.page.width - 100 });
}

function initializePDF(res, title) {
    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${title}_${new Date().toISOString().split('T')[0]}.pdf`);
    doc.pipe(res);
    return doc;
}

const TABLE_OPTIONS = {
    prepareHeader: () => doc => {
        doc.font('Helvetica-Bold').fontSize(9).fillColor(COLORS.white);
    },
    prepareRow: () => doc => {
        doc.font('Helvetica').fontSize(8).fillColor(COLORS.dark);
    },
    padding: 5,
    divider: {
        header: { disabled: false, width: 2, opacity: 1 },
        horizontal: { disabled: false, width: 0.5, opacity: 0.5 },
    }
};

async function generateDetailedDonationReport(reportData, res) {
    return new Promise(async (resolve, reject) => {
        try {
            const doc = initializePDF(res, 'Donation_Report');
            generateHeader(doc, 'Detailed Donation Report', reportData.period);

            // KPI Analysis
            doc.font('Helvetica-Bold').fontSize(12).fillColor(COLORS.heading).text('Summary Analysis', 50, doc.y);
            doc.moveDown(0.5);
            doc.font('Helvetica').fontSize(10).fillColor(COLORS.body)
               .text(`Total Donations Collected: Rs. ${(reportData.summary.donation.collected || 0).toLocaleString('en-IN')}`)
               .text(`Active Donors: ${reportData.summary.donation.donors || 0}`)
               .text(`Average Donation: Rs. ${(reportData.summary.donation.average || 0).toLocaleString('en-IN')}`)
               .text(`Top Campaign: ${reportData.summary.donation.topCampaign || 'N/A'}`);
            
            doc.moveDown(1.5);

            // Limited to 1000
            const tableRows = reportData.donationTable.slice(0, 1000);

            const tableData = {
                title: "All Donation Records (up to 1,000 max)",
                headers: [
                    { label: "Date", property: "date", width: 60, headerColor: COLORS.primary },
                    { label: "Donor Name", property: "name", width: 90, headerColor: COLORS.primary },
                    { label: "Campaign", property: "campaign", width: 120, headerColor: COLORS.primary },
                    { label: "Amount", property: "amount", width: 60, headerColor: COLORS.primary },
                    { label: "Receipt No", property: "receipt", width: 90, headerColor: COLORS.primary },
                    { label: "Status", property: "status", width: 70, headerColor: COLORS.primary }
                ],
                datas: tableRows.map(row => ({
                    date: row[0],
                    name: row[1],
                    campaign: row[3],
                    amount: row[4],
                    receipt: row[5],
                    status: row[7]
                }))
            };

            await doc.table(tableData, TABLE_OPTIONS);

            drawFooter(doc, reportData.notes);
            doc.end();
            doc.on('end', () => resolve());
        } catch (err) {
            reject(err);
        }
    });
}

async function generateDetailedOrderReport(reportData, res) {
    return new Promise(async (resolve, reject) => {
        try {
            const doc = initializePDF(res, 'Order_Report');
            generateHeader(doc, 'Detailed Merchandise Orders', reportData.period);

            // KPI Analysis
            doc.font('Helvetica-Bold').fontSize(12).fillColor(COLORS.heading).text('Summary Analysis', 50, doc.y);
            doc.moveDown(0.5);
            doc.font('Helvetica').fontSize(10).fillColor(COLORS.body)
               .text(`Total Revenue: Rs. ${(reportData.summary.merch.revenue || 0).toLocaleString('en-IN')}`)
               .text(`Total Orders: ${reportData.summary.merch.totalOrders || 0}`)
               .text(`Completed Orders: ${reportData.summary.merch.completed || 0}`)
               .text(`Top Selling Product: ${reportData.summary.merch.topProduct || 'N/A'}`);
            
            doc.moveDown(1.5);

            // Limited to 1000
            const tableRows = reportData.merchTable.slice(0, 1000);

            const tableData = {
                title: "All Merchandise Orders (up to 1,000 max)",
                headers: [
                    { label: "Date", property: "date", width: 60, headerColor: COLORS.primary },
                    { label: "User Name", property: "name", width: 90, headerColor: COLORS.primary },
                    { label: "Items", property: "items", width: 150, headerColor: COLORS.primary },
                    { label: "Qty", property: "qty", width: 40, headerColor: COLORS.primary },
                    { label: "Amount", property: "amount", width: 70, headerColor: COLORS.primary },
                    { label: "Status", property: "status", width: 80, headerColor: COLORS.primary }
                ],
                datas: tableRows.map(row => ({
                    date: row[6],
                    name: row[1],
                    items: row[2],
                    qty: row[3],
                    amount: row[4],
                    status: row[5]
                }))
            };

            await doc.table(tableData, TABLE_OPTIONS);

            drawFooter(doc, reportData.notes);
            doc.end();
            doc.on('end', () => resolve());
        } catch (err) {
            reject(err);
        }
    });
}


async function generateDetailedPaymentReport(reportData, res) {
    return new Promise(async (resolve, reject) => {
        try {
            const doc = initializePDF(res, 'Payment_Report');
            generateHeader(doc, 'Detailed Unified Payments', reportData.period);

            // KPI Analysis
            doc.font('Helvetica-Bold').fontSize(12).fillColor(COLORS.heading).text('Summary Analysis', 50, doc.y);
            doc.moveDown(0.5);
            const totalPayments = reportData.paymentTable.length;
            const successPayments = reportData.paymentTable.filter(p => p[7] === 'captured' || p[7] === 'success' || p[7] === 'paid').length;
            
            doc.font('Helvetica').fontSize(10).fillColor(COLORS.body)
               .text(`Total Payment Attempts: ${totalPayments}`)
               .text(`Successful / Captured: ${successPayments}`)
               .text(`Failed / Init / Other: ${totalPayments - successPayments}`);
            
            doc.moveDown(1.5);

            // Limited to 1000
            const tableRows = reportData.paymentTable.slice(0, 1000);

            const tableData = {
                title: "All Payment Records (up to 1,000 max)",
                headers: [
                    { label: "Date", property: "date", width: 60, headerColor: COLORS.primary },
                    { label: "Transaction ID", property: "txn", width: 110, headerColor: COLORS.primary },
                    { label: "Name", property: "name", width: 100, headerColor: COLORS.primary },
                    { label: "Method", property: "method", width: 70, headerColor: COLORS.primary },
                    { label: "Amount", property: "amount", width: 70, headerColor: COLORS.primary },
                    { label: "Status", property: "status", width: 80, headerColor: COLORS.primary }
                ],
                datas: tableRows.map(row => ({
                    date: row[6],
                    txn: row[0],
                    name: row[1],
                    method: row[5],
                    amount: row[4],
                    status: row[7]
                }))
            };

            await doc.table(tableData, TABLE_OPTIONS);

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
    generateDetailedPaymentReport
};
