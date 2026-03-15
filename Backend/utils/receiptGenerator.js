const PDFDocument = require('pdfkit-table');
const path = require('path');
const fs = require('fs');

const LOGO_PATH = path.join(__dirname, '..', 'assets', 'COG.png');

// Helper to generate a generic professional header
function generateHeader(doc, title) {
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
        .text('contact@churchofgod.org', 110, 110)
        .moveDown();

    doc
        .fillColor('#000000')
        .fontSize(24)
        .text(title, 50, 160, { align: 'center' })
        .moveDown();

    doc.moveTo(50, 195).lineTo(550, 195).stroke();
    doc.moveDown();
}

// Helper to generate footer
function generateFooter(doc) {
    const pageBottom = doc.page.height - 100;
    doc.moveTo(50, pageBottom - 10).lineTo(550, pageBottom - 10).stroke();

    doc
        .fontSize(10)
        .fillColor('#888888')
        .text('Thank you for your continued support and generosity.', 50, pageBottom + 10, { align: 'center' })
        .text('May God bless you!', 50, pageBottom + 25, { align: 'center' });
}

async function buildDonationReceipt(donation, res) {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({ margin: 50 });

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=donation_receipt_${donation.receiptNo}.pdf`);

            doc.pipe(res);

            generateHeader(doc, 'Donation Receipt');

            doc.fontSize(12).fillColor('#000');

            const topY = 220;
            doc.font('Helvetica-Bold').text('Receipt No:', 50, topY);
            doc.font('Helvetica').text(donation.receiptNo, 150, topY);

            doc.font('Helvetica-Bold').text('Date:', 350, topY);
            doc.font('Helvetica').text(new Date(donation.createdAt).toLocaleDateString(), 400, topY);

            doc.font('Helvetica-Bold').text('Donor Name:', 50, topY + 25);
            doc.font('Helvetica').text(donation.userId?.fullname || 'N/A', 150, topY + 25);

            doc.font('Helvetica-Bold').text('Donor Email:', 50, topY + 50);
            doc.font('Helvetica').text(donation.userId?.email || 'N/A', 150, topY + 50);

            doc.font('Helvetica-Bold').text('Campaign:', 50, topY + 75);
            doc.font('Helvetica').text(donation.donationCampaignId?.title || 'General Donation', 150, topY + 75);

            doc.font('Helvetica-Bold').text('Amount:', 50, topY + 100);
            doc.font('Helvetica').text(`Rs. ${donation.amount.toFixed(2)}`, 150, topY + 100);

            doc.font('Helvetica-Bold').text('Payment Status:', 50, topY + 125);
            doc.font('Helvetica').text(donation.paymentStatus.toUpperCase(), 150, topY + 125);

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

            doc.fontSize(12).fillColor('#000');

            const topY = 220;
            doc.font('Helvetica-Bold').text('Order ID:', 50, topY);
            doc.font('Helvetica').text(order._id.toString(), 150, topY);

            doc.font('Helvetica-Bold').text('Date:', 350, topY);
            doc.font('Helvetica').text(new Date(order.createdAt).toLocaleDateString(), 400, topY);

            doc.font('Helvetica-Bold').text('Customer:', 50, topY + 25);
            doc.font('Helvetica').text(order.userId?.fullname || 'N/A', 150, topY + 25);

            doc.font('Helvetica-Bold').text('Email:', 50, topY + 50);
            doc.font('Helvetica').text(order.userId?.email || 'N/A', 150, topY + 50);

            doc.font('Helvetica-Bold').text('Status:', 50, topY + 75);
            doc.font('Helvetica').text(order.status.toUpperCase(), 150, topY + 75);

            // Itemized Table
            doc.moveDown(4);
            const tableData = {
                headers: ['Item Name', 'Category', 'Quantity', 'Price (Rs)', 'Total (Rs)'],
                rows: order.items.map(item => [
                    item.itemId?.itemName || 'Unknown Item',
                    item.itemId?.category || 'N/A',
                    item.quantity.toString(),
                    item.price.toFixed(2),
                    (item.price * item.quantity).toFixed(2)
                ])
            };

            await doc.table(tableData, {
                prepareHeader: () => doc.font("Helvetica-Bold").fontSize(10),
                prepareRow: () => doc.font("Helvetica").fontSize(10),
                width: 500
            });

            // Total Amount
            doc.moveDown(1);
            doc.font('Helvetica-Bold').fontSize(12).text(`Total Amount: Rs. ${order.totalAmount.toFixed(2)}`, { align: 'right' });

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

            doc.fontSize(12).fillColor('#000');

            const topY = 220;
            doc.font('Helvetica-Bold').text('Transaction No:', 50, topY);
            doc.font('Helvetica').text(payment.transactionNo, 180, topY);

            doc.font('Helvetica-Bold').text('Date:', 350, topY);
            doc.font('Helvetica').text(new Date(payment.paymentDate).toLocaleDateString(), 400, topY);

            doc.font('Helvetica-Bold').text('Customer Name:', 50, topY + 25);
            doc.font('Helvetica').text(payment.orderId?.userId?.fullname || 'N/A', 180, topY + 25);

            doc.font('Helvetica-Bold').text('Customer Email:', 50, topY + 50);
            doc.font('Helvetica').text(payment.orderId?.userId?.email || 'N/A', 180, topY + 50);

            doc.font('Helvetica-Bold').text('Payment Method:', 50, topY + 75);
            doc.font('Helvetica').text(payment.method ? payment.method.toUpperCase() : 'N/A', 180, topY + 75);

            doc.font('Helvetica-Bold').text('Amount:', 50, topY + 100);
            doc.font('Helvetica').text(`Rs. ${Number(payment.amount).toFixed(2)}`, 180, topY + 100);

            doc.font('Helvetica-Bold').text('Payment Status:', 50, topY + 125);
            doc.font('Helvetica').text(payment.status.toUpperCase(), 180, topY + 125);

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
