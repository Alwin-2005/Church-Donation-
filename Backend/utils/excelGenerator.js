const ExcelJS = require('exceljs');


async function generateExcelReport(reportData, res) {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Church Of God';
    workbook.lastModifiedBy = 'Admin';
    workbook.created = new Date();
    workbook.modified = new Date();

    const addSheet = (name, columns, data) => {
        const sheet = workbook.addWorksheet(name);
        sheet.columns = columns;
        if (data && data.length > 0) {
            sheet.addRows(data);
        }
        sheet.getRow(1).font = { bold: true };
    };

    // 1. Donations Sheet - Map raw donation model
    addSheet('Donations', [
        { header: '_id', key: '_id', width: 25 },
        { header: 'userId', key: 'userId', width: 25 },
        { header: 'donationCampaignId', key: 'donationCampaignId', width: 25 },
        { header: 'amount', key: 'amount', width: 15 },
        { header: 'paymentStatus', key: 'paymentStatus', width: 15 },
        { header: 'receiptNo', key: 'receiptNo', width: 20 },
        { header: 'createdAt', key: 'createdAt', width: 25 },
        { header: 'updatedAt', key: 'updatedAt', width: 25 }
    ], reportData.donations?.map(d => ({
        _id: d._id?.toString(),
        userId: d.userId?._id?.toString() || d.userId?.toString(),
        donationCampaignId: d.donationCampaignId?._id?.toString() || d.donationCampaignId?.toString(),
        amount: d.amount,
        paymentStatus: d.paymentStatus,
        receiptNo: d.receiptNo,
        createdAt: d.createdAt?.toISOString(),
        updatedAt: d.updatedAt?.toISOString()
    })));

    // 2. Merchandise Orders Sheet - Map raw order model
    addSheet('Orders', [
        { header: '_id', key: '_id', width: 25 },
        { header: 'userId', key: 'userId', width: 25 },
        { header: 'items', key: 'items', width: 50 },
        { header: 'totalAmount', key: 'totalAmount', width: 15 },
        { header: 'status', key: 'status', width: 15 },
        { header: 'razorpayOrderId', key: 'razorpayOrderId', width: 25 },
        { header: 'razorpayPaymentId', key: 'razorpayPaymentId', width: 25 },
        { header: 'createdAt', key: 'createdAt', width: 25 },
        { header: 'updatedAt', key: 'updatedAt', width: 25 }
    ], reportData.orders?.map(o => ({
        _id: o._id?.toString(),
        userId: o.userId?._id?.toString() || o.userId?.toString(),
        items: JSON.stringify(o.items?.map(i => ({
            itemId: i.itemId?._id?.toString() || i.itemId?.toString(),
            quantity: i.quantity,
            price: i.price
        })) || []),
        totalAmount: o.totalAmount,
        status: o.status,
        razorpayOrderId: o.razorpayOrderId,
        razorpayPaymentId: o.razorpayPaymentId,
        createdAt: o.createdAt?.toISOString(),
        updatedAt: o.updatedAt?.toISOString()
    })));

    // 3. Payments Sheet - Map raw payment model
    addSheet('Payments', [
        { header: '_id', key: '_id', width: 25 },
        { header: 'orderId', key: 'orderId', width: 25 },
        { header: 'amount', key: 'amount', width: 15 },
        { header: 'method', key: 'method', width: 15 },
        { header: 'status', key: 'status', width: 15 },
        { header: 'transactionNo', key: 'transactionNo', width: 25 },
        { header: 'paymentDate', key: 'paymentDate', width: 25 },
        { header: 'createdAt', key: 'createdAt', width: 25 },
        { header: 'updatedAt', key: 'updatedAt', width: 25 }
    ], reportData.payments?.map(p => ({
        _id: p._id?.toString(),
        orderId: p.orderId?._id?.toString() || p.orderId?.toString(),
        amount: p.amount,
        method: p.method,
        status: p.status,
        transactionNo: p.transactionNo,
        paymentDate: p.paymentDate?.toISOString(),
        createdAt: p.createdAt?.toISOString(),
        updatedAt: p.updatedAt?.toISOString()
    })));

    // 4. Donation Campaigns Sheet - Map raw campaign model
    addSheet('DonationCampaigns', [
        { header: '_id', key: '_id', width: 25 },
        { header: 'title', key: 'title', width: 30 },
        { header: 'description', key: 'description', width: 40 },
        { header: 'goalAmount', key: 'goalAmount', width: 15 },
        { header: 'collectedAmount', key: 'collectedAmount', width: 15 },
        { header: 'startDate', key: 'startDate', width: 25 },
        { header: 'endDate', key: 'endDate', width: 25 },
        { header: 'status', key: 'status', width: 15 },
        { header: 'createdBy', key: 'createdBy', width: 25 },
        { header: 'isTithe', key: 'isTithe', width: 15 },
        { header: 'donationType', key: 'donationType', width: 20 },
        { header: 'createdAt', key: 'createdAt', width: 25 },
        { header: 'updatedAt', key: 'updatedAt', width: 25 }
    ], reportData.campaigns?.map(c => ({
        _id: c._id?.toString(),
        title: c.title,
        description: c.description,
        goalAmount: c.goalAmount,
        collectedAmount: c.collectedAmount,
        startDate: c.startDate?.toISOString(),
        endDate: c.endDate?.toISOString(),
        status: c.status,
        createdBy: c.createdBy?._id?.toString() || c.createdBy?.toString(),
        isTithe: c.isTithe,
        donationType: c.donationType,
        createdAt: c.createdAt?.toISOString(),
        updatedAt: c.updatedAt?.toISOString()
    })));

    // 5. Users Sheet - Map raw user model
    addSheet('Users', [
        { header: '_id', key: '_id', width: 25 },
        { header: 'fullname', key: 'fullname', width: 25 },
        { header: 'email', key: 'email', width: 30 },
        { header: 'phoneNo', key: 'phoneNo', width: 15 },
        { header: 'gender', key: 'gender', width: 10 },
        { header: 'dob', key: 'dob', width: 25 },
        { header: 'address', key: 'address', width: 35 },
        { header: 'role', key: 'role', width: 15 },
        { header: 'status', key: 'status', width: 15 },
        { header: 'createdAt', key: 'createdAt', width: 25 },
        { header: 'updatedAt', key: 'updatedAt', width: 25 }
    ], reportData.users?.map(u => ({
        _id: u._id?.toString(),
        fullname: u.fullname,
        email: u.email,
        phoneNo: u.phoneNo,
        gender: u.gender,
        dob: u.dob?.toISOString() || null,
        address: u.address,
        role: u.role,
        status: u.status,
        createdAt: u.createdAt?.toISOString(),
        updatedAt: u.updatedAt?.toISOString()
    })));

    // Set Response Headers
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=Admin_Raw_Data_Export_${new Date().toISOString().split('T')[0]}.xlsx`);

    await workbook.xlsx.write(res);
    res.end();
}

module.exports = {
    generateExcelReport
};

