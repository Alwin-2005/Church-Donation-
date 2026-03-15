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

function generateFooter(doc) {
    const pageBottom = doc.page.height - 80;
    doc.moveTo(50, pageBottom - 10).lineTo(550, pageBottom - 10).stroke();

    doc
        .fontSize(10)
        .fillColor('#888888')
        .text('Thank you for your continued support and generosity.', 50, pageBottom + 10, { align: 'center' })
        .text('May God bless you!', 50, pageBottom + 25, { align: 'center' });
}

function sectionHeader(doc, text) {
    // If the section header will cross the page break margin, add a page manually
    if (doc.y > doc.page.height - 150) {
        doc.addPage();
    }
    doc.moveDown(1);
    doc.fillColor('#2d3748').fontSize(16).font('Helvetica-Bold').text(text.toUpperCase(), { align: 'left' });
    doc.moveTo(50, doc.y + 2).lineTo(550, doc.y + 2).strokeColor('#e2e8f0').stroke();
    doc.moveDown(1);
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
                .text(`• Pending Orders: ${reportData.summary.merch.pending || 0}`)
                .text(`• Completed Orders: ${reportData.summary.merch.completed || 0}`)
                .text(`• Top Selling Product: ${reportData.summary.merch.topProduct || 'N/A'}`);
            doc.moveDown(0.5);

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
                headers: ['Date', 'Donor Name', 'Email', 'Campaign Name', 'Pay. Method', 'Amount', 'Txn ID', 'Status'],
                rows: reportData.donationTable || []
            };
            await doc.table(donationTable, { 
                prepareHeader: () => doc.font("Helvetica-Bold").fontSize(10),
                prepareRow: () => doc.font("Helvetica").fontSize(10)
            });

            // SECTION 3: MERCHANDISE ORDERS REPORT
            sectionHeader(doc, 'Merchandise Orders Report');
            const merchTable = {
                headers: ['Order ID', 'Customer', 'Product', 'Qty', 'Price', 'Total', 'Pay. Method', 'Status', 'Date'],
                rows: reportData.merchTable || []
            };
            await doc.table(merchTable, { 
                prepareHeader: () => doc.font("Helvetica-Bold").fontSize(10),
                prepareRow: () => doc.font("Helvetica").fontSize(10)
            });

            // SECTION 4: CAMPAIGN PERFORMANCE REPORT
            sectionHeader(doc, 'Campaign Performance Report');
            const campaignTable = {
                headers: ['Campaign Name', 'Goal Amount', 'Amount Collected', 'Donors', 'Completion %'],
                rows: reportData.campaignTable || []
            };
            await doc.table(campaignTable, { 
                prepareHeader: () => doc.font("Helvetica-Bold").fontSize(10),
                prepareRow: () => doc.font("Helvetica").fontSize(10)
            });

            // SECTION 5: USER REGISTRATION REPORT
            sectionHeader(doc, 'User Registration Report');
            const userTable = {
                headers: ['User Name', 'Email', 'Reg. Date', 'Status', 'Total Donations', 'Total Orders'],
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
                .text(`• Most purchased merchandise item: ${reportData.analytics.popularMerch || 'N/A'}`)
                .text(`• Percentage of verified users: ${reportData.analytics.verifiedPercent || 'N/A'}`)
                .text(`• Donation growth compared to previous period: ${reportData.analytics.growth || 'N/A'}`);
            
            // Render footer only once at the end
            generateFooter(doc);

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
