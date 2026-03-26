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
};

const fill = (doc, hex) => doc.fillColor(hex);

// ─── Header ───────────────────────────────────────────────────────────────────
function generateHeader(doc, title) {
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

    fill(doc, COLORS.primary);
    doc.rect(50, 140, doc.page.width - 100, 2).fill();
    fill(doc, COLORS.primaryLight);
    doc.rect(50, 143, doc.page.width - 100, 0.5).fill();

    doc.y = 160;
    doc.x = 50;
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function generateFooter(doc, notes) {
    const y = doc.page.height - 38;
    fill(doc, COLORS.primary);
    doc.rect(0, y - 2, doc.page.width, 2).fill();
    
    fill(doc, COLORS.muted);
    doc.font('Helvetica').fontSize(8)
        .text(notes || `Generated on ${new Date().toLocaleDateString()}`, 50, y + 4, { align: 'right', width: doc.page.width - 100 });
}

function drawThankYou(doc) {
    doc.moveDown(4);
    fill(doc, COLORS.muted);
    doc.font('Helvetica').fontSize(10)
        .text('Thank you for your continued support and generosity.', { align: 'center' });
    doc.moveDown(0.2);
    fill(doc, COLORS.primary);
    doc.font('Helvetica-Bold').fontSize(11)
        .text('May God bless you!', { align: 'center' });
}

// ─── Summary Line ─────────────────────────────────────────────────────────────
function drawSummaryLine(doc, label, value, y, isAlt = false) {
    const ROW_H = 24;
    const PAD_TOP = 6;

    if (isAlt) {
        fill(doc, COLORS.rowAlt);
        doc.rect(50, y, doc.page.width - 100, ROW_H).fill();
    }

    const textY = y + PAD_TOP;
    fill(doc, COLORS.body);
    doc.font('Helvetica').fontSize(10).text(label, 70, textY);
    
    fill(doc, COLORS.dark);
    doc.font('Helvetica-Bold').fontSize(10).text(value, 200, textY);

    const nextY = y + ROW_H;
    doc.y = nextY;
    doc.x = 50;
    return nextY;
}

async function buildDonationReceipt(donation, res) {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({ margin: 50 });

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=donation_receipt_${donation.receiptNo}.pdf`);

            doc.pipe(res);

            generateHeader(doc, 'Donation Receipt');

            let currentY = 180;
            currentY = drawSummaryLine(doc, 'Receipt No:', donation.receiptNo, currentY, false);
            currentY = drawSummaryLine(doc, 'Date:', new Date(donation.createdAt).toLocaleDateString(), currentY, true);
            currentY = drawSummaryLine(doc, 'Donor Name:', donation.userId?.fullname || 'N/A', currentY, false);
            currentY = drawSummaryLine(doc, 'Donor Email:', donation.userId?.email || 'N/A', currentY, true);
            currentY = drawSummaryLine(doc, 'Campaign:', donation.donationCampaignId?.title || 'General Donation', currentY, false);
            currentY = drawSummaryLine(doc, 'Amount:', `Rs. ${donation.amount.toFixed(2)}`, currentY, true);
            currentY = drawSummaryLine(doc, 'Payment Status:', donation.paymentStatus.toUpperCase(), currentY, false);

            drawThankYou(doc);
            generateFooter(doc);
            doc.end();

            doc.on('end', () => resolve());
        } catch (err) {
            reject(err);
        }
    });
}

async function buildOrderReceipt(order, res) {
    return new Promise(async (resolve, reject) => {
        try {
            const doc = new PDFDocument({ margin: 50 });

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=order_receipt_${order._id}.pdf`);

            doc.pipe(res);

            generateHeader(doc, 'Purchase Receipt');

            generateHeader(doc, 'Purchase Receipt');

            let currentY = 180;
            currentY = drawSummaryLine(doc, 'Order ID:', order._id.toString(), currentY, false);
            currentY = drawSummaryLine(doc, 'Date:', new Date(order.createdAt).toLocaleDateString(), currentY, true);
            currentY = drawSummaryLine(doc, 'Customer:', order.userId?.fullname || 'N/A', currentY, false);
            currentY = drawSummaryLine(doc, 'Email:', order.userId?.email || 'N/A', currentY, true);
            currentY = drawSummaryLine(doc, 'Status:', order.status.toUpperCase(), currentY, false);

            // Itemized Table
            doc.moveDown(2);
            const tableData = {
                headers: [
                    { label: 'Item Name', property: 'name', width: 150 },
                    { label: 'Category', property: 'category', width: 100 },
                    { label: 'Qty', property: 'qty', width: 60 },
                    { label: 'Price (Rs)', property: 'price', width: 80 },
                    { label: 'Total (Rs)', property: 'total', width: 80 }
                ],
                rows: order.items.map(item => [
                    item.itemId?.itemName || 'Unknown Item',
                    item.itemId?.category || 'N/A',
                    item.quantity.toString(),
                    item.price.toFixed(2),
                    (item.price * item.quantity).toFixed(2)
                ])
            };

            await doc.table(tableData, {
                prepareHeader: () => doc.font("Helvetica-Bold").fontSize(10).fillColor(COLORS.primary),
                prepareRow: (row, i) => doc.font("Helvetica").fontSize(10).fillColor(COLORS.body),
                width: 500,
                padding: 10,
                columnSpacing: 10,
                divider: {
                    header: { disabled: false, width: 2, opacity: 1 },
                    horizontal: { disabled: false, width: 0.5, opacity: 0.1 },
                }
            });

            // Total Amount
            doc.moveDown(1);
            fill(doc, COLORS.primary);
            doc.font('Helvetica-Bold').fontSize(14).text(`Total Amount: Rs. ${order.totalAmount.toFixed(2)}`, { align: 'right' });

            drawThankYou(doc);
            generateFooter(doc);
            doc.end();

            doc.on('end', () => resolve());
        } catch (err) {
            reject(err);
        }
    });
}

async function buildPaymentReceipt(payment, res) {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({ margin: 50 });

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=payment_receipt_${payment.transactionNo}.pdf`);

            doc.pipe(res);

            generateHeader(doc, 'Payment Receipt');

            generateHeader(doc, 'Payment Receipt');

            let currentY = 180;
            currentY = drawSummaryLine(doc, 'Transaction No:', payment.transactionNo, currentY, false);
            currentY = drawSummaryLine(doc, 'Date:', new Date(payment.paymentDate).toLocaleDateString(), currentY, true);
            currentY = drawSummaryLine(doc, 'Customer Name:', payment.orderId?.userId?.fullname || 'N/A', currentY, false);
            currentY = drawSummaryLine(doc, 'Customer Email:', payment.orderId?.userId?.email || 'N/A', currentY, true);
            currentY = drawSummaryLine(doc, 'Payment Method:', payment.method ? payment.method.toUpperCase() : 'N/A', currentY, false);
            currentY = drawSummaryLine(doc, 'Amount:', `Rs. ${Number(payment.amount).toFixed(2)}`, currentY, true);
            currentY = drawSummaryLine(doc, 'Payment Status:', payment.status.toUpperCase(), currentY, false);

            drawThankYou(doc);
            generateFooter(doc);
            doc.end();

            doc.on('end', () => resolve());
        } catch (err) {
            reject(err);
        }
    });
}

module.exports = {
    buildDonationReceipt,
    buildOrderReceipt,
    buildPaymentReceipt,
};
