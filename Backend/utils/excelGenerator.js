const ExcelJS = require('exceljs');

async function generateExcelReport(reportData, res) {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Church Of God';
    workbook.lastModifiedBy = 'Admin';
    workbook.created = new Date();
    workbook.modified = new Date();

    // 1. Donations Sheet
    const donationSheet = workbook.addWorksheet('Donations');
    donationSheet.columns = [
        { header: 'Date', key: 'date', width: 15 },
        { header: 'Donor Name', key: 'donor', width: 25 },
        { header: 'Email', key: 'email', width: 30 },
        { header: 'Campaign', key: 'campaign', width: 25 },
        { header: 'Amount', key: 'amount', width: 15 },
        { header: 'Receipt No', key: 'receipt', width: 20 },
        { header: 'DB ID', key: 'id', width: 25 },
        { header: 'Status', key: 'status', width: 15 }
    ];

    if (reportData.donationTable) {
        reportData.donationTable.forEach(row => {
            donationSheet.addRow({
                date: row[0],
                donor: row[1],
                email: row[2],
                campaign: row[3],
                amount: row[4],
                receipt: row[5],
                id: row[6],
                status: row[7]
            });
        });
    }
    donationSheet.getRow(1).font = { bold: true };

    // 2. Merchandise Orders Sheet
    const merchSheet = workbook.addWorksheet('Merchandise Orders');
    merchSheet.columns = [
        { header: 'Order ID', key: 'id', width: 25 },
        { header: 'Customer', key: 'customer', width: 25 },
        { header: 'Products', key: 'products', width: 40 },
        { header: 'Qty', key: 'qty', width: 10 },
        { header: 'Total', key: 'total', width: 15 },
        { header: 'Status', key: 'status', width: 15 },
        { header: 'Date', key: 'date', width: 15 },
        { header: 'Razorpay Order ID', key: 'rzpOrder', width: 25 },
        { header: 'Razorpay Payment ID', key: 'rzpPayment', width: 25 }
    ];

    if (reportData.merchTable) {
        reportData.merchTable.forEach(row => {
            merchSheet.addRow({
                id: row[0],
                customer: row[1],
                products: row[2],
                qty: row[3],
                total: row[4],
                status: row[5],
                date: row[6],
                rzpOrder: row[7],
                rzpPayment: row[8]
            });
        });
    }
    merchSheet.getRow(1).font = { bold: true };

    // 3. Payments Sheet
    const paymentSheet = workbook.addWorksheet('Payments');
    paymentSheet.columns = [
        { header: 'Payment ID', key: 'id', width: 20 },
        { header: 'Date', key: 'date', width: 15 },
        { header: 'Payer Name', key: 'payer', width: 25 },
        { header: 'Email', key: 'email', width: 30 },
        { header: 'Amount', key: 'amount', width: 15 },
        { header: 'Method', key: 'method', width: 20 },
        { header: 'Status', key: 'status', width: 15 },
        { header: 'Reference', key: 'reference', width: 25 }
    ];

    if (reportData.paymentTable) {
        reportData.paymentTable.forEach(row => {
            paymentSheet.addRow({
                id: row[0],
                date: row[6],
                payer: row[1],
                email: row[2],
                amount: row[4],
                method: row[5],
                status: row[7],
                reference: row[3]
            });
        });
    }
    paymentSheet.getRow(1).font = { bold: true };

    // 4. Campaign Performance Sheet
    const campaignSheet = workbook.addWorksheet('Campaign Performance');
    campaignSheet.columns = [
        { header: 'Campaign Name', key: 'name', width: 35 },
        { header: 'Goal Amount', key: 'goal', width: 20 },
        { header: 'Collected', key: 'collected', width: 20 },
        { header: 'Completion %', key: 'completion', width: 15 }
    ];

    if (reportData.campaignTable) {
        reportData.campaignTable.forEach(row => {
            campaignSheet.addRow({
                name: row[0],
                goal: row[1],
                collected: row[2],
                completion: row[3]
            });
        });
    }
    campaignSheet.getRow(1).font = { bold: true };

    // 5. User Registration Sheet
    const userSheet = workbook.addWorksheet('Users');
    userSheet.columns = [
        { header: 'Full Name', key: 'name', width: 25 },
        { header: 'Email', key: 'email', width: 30 },
        { header: 'Phone', key: 'phone', width: 15 },
        { header: 'Gender', key: 'gender', width: 10 },
        { header: 'DOB', key: 'dob', width: 15 },
        { header: 'Address', key: 'address', width: 35 },
        { header: 'Reg. Date', key: 'date', width: 15 },
        { header: 'Role', key: 'role', width: 15 },
        { header: 'Status', key: 'status', width: 10 },
        { header: 'Donations', key: 'donations', width: 12 },
        { header: 'Orders', key: 'orders', width: 12 }
    ];

    if (reportData.userTable) {
        reportData.userTable.forEach(row => {
            userSheet.addRow({
                name: row[0],
                email: row[1],
                phone: row[2],
                gender: row[3],
                dob: row[4],
                address: row[5],
                date: row[6],
                role: row[7],
                status: row[8],
                donations: row[9],
                orders: row[10]
            });
        });
    }
    userSheet.getRow(1).font = { bold: true };

    // Set Response Headers
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=Admin_Report_${new Date().toISOString().split('T')[0]}.xlsx`);

    await workbook.xlsx.write(res);
    res.end();
}

module.exports = {
    generateExcelReport
};
