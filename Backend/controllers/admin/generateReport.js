const User = require("../../models/user");
const Donation = require("../../models/donation");
const Order = require("../../models/order");
const Merchandise = require("../../models/merchandise");
const DonationCampaign = require("../../models/donationCampaign");
const Payment = require("../../models/payment");
// @ts-ignore
const { generateAdminReport } = require("../../utils/reportGenerator");
const { generateExcelReport } = require("../../utils/excelGenerator");

async function handleGenerateAdminReport(req, res) {
    try {
        const { months, year, startDate, endDate, format } = req.query;
        const selectedMonths = months ? months.split(',').map(Number) : [];
        const selectedYear = year ? Number(year) : new Date().getFullYear();

        // Build filter object for time
        let timeFilter = {};

        if (startDate && endDate) {
            // Custom Duration
            timeFilter = {
                createdAt: {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate)
                }
            };
        } else if (selectedMonths.length > 0) {
            // Monthly in a specific year
            timeFilter = {
                $expr: {
                    $and: [
                        { $in: [{ $month: "$createdAt" }, selectedMonths] },
                        { $eq: [{ $year: "$createdAt" }, selectedYear] }
                    ]
                }
            };
        } else if (year) {
            // Full Year
            timeFilter = {
                $expr: {
                    $eq: [{ $year: "$createdAt" }, selectedYear]
                }
            };
        }

        const isFiltered = (startDate && endDate) || selectedMonths.length > 0 || year;

        // Fetch filtered data
        let users = await User.find(isFiltered ? timeFilter : {});
        users = users.filter(u => u.role !== 'admin'); // Exclude admin

        let donations = await Donation.find(isFiltered ? timeFilter : {}).populate('userId donationCampaignId');
        donations = donations.filter(d => !d.donationCampaignId?.isTithe); // Exclude tithes

        const orders = await Order.find(isFiltered ? timeFilter : {}).populate('userId items.itemId');
        const campaigns = await DonationCampaign.find({}); 
        const payments = await Payment.find(isFiltered ? timeFilter : {}).populate({
            path: 'orderId',
            populate: { path: 'userId' }
        });


        // 1. Summary
        const donationCollected = donations.reduce((sum, d) => sum + (d.paymentStatus === 'paid' ? d.amount : 0), 0);
        const uniqueDonors = new Set(donations.map(d => d.userId?._id?.toString())).size;
        const avgDonation = donations.length > 0 ? donationCollected / donations.length : 0;

        let topCampaign = "N/A";
        if (campaigns.length > 0) {
            topCampaign = campaigns.reduce((max, c) => (c.collectedAmount || 0) > (max.collectedAmount || 0) ? c : max).title;
        }

        const merchRevenue = orders.reduce((sum, o) => sum + (o.status === 'paid' ? o.totalAmount : 0), 0);
        const completedOrders = orders.filter(o => o.status === 'paid').length;

        // Count top selling merch and merch by category
        let merchCounts = {};
        let merchCategoryCounts = {};
        orders.forEach(o => {
            if (o.status !== 'cancelled') {
                o.items.forEach(i => {
                    const name = i.itemId?.itemName || 'Unknown Item';
                    const category = i.itemId?.category || 'Other';
                    merchCounts[name] = (merchCounts[name] || 0) + i.quantity;
                    merchCategoryCounts[category] = (merchCategoryCounts[category] || 0) + i.quantity;
                });
            }
        });
        const topProduct = Object.keys(merchCounts).length > 0 ? Object.keys(merchCounts).reduce((a, b) => merchCounts[a] > merchCounts[b] ? a : b) : "N/A";

        const newUsers = users.filter(u => new Date(u.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length;
        const activeDonors = uniqueDonors;

        // Pie Chart Data Aggregation
        const pieCharts = {
            campaigns: {},
            userTypes: {},
            merchSales: {},
            orderStatus: {}
        };

        // Donut: Campaign distribution (Donations per campaign)
        campaigns.forEach(c => {
            if (!c.isTithe && (c.collectedAmount || 0) > 0) pieCharts.campaigns[c.title || 'Untitled'] = (c.collectedAmount || 0);
        });

        // Donut: Merch Sales by Category
        Object.entries(merchCategoryCounts).forEach(([cat, count]) => {
            pieCharts.merchSales[cat] = count;
        });

        // 2 New Graphs: Internal vs External Donations
        // 1. In campaigns available to both (donationType: 'external')
        const bothCampaignIds = campaigns.filter(c => c.donationType === 'external').map(c => c._id.toString());
        const bothDonations = donations.filter(d => bothCampaignIds.includes(d.donationCampaignId?._id?.toString()));

        pieCharts.donationByMutualRole = {
            'Church Member': bothDonations.filter(d => d.userId?.role === 'churchMember').reduce((sum, d) => sum + (d.paymentStatus === 'paid' ? d.amount : 0), 0),
            'External Member': bothDonations.filter(d => d.userId?.role === 'externalMember').reduce((sum, d) => sum + (d.paymentStatus === 'paid' ? d.amount : 0), 0)
        };

        // 2. All donations excluding tithe (already filtered in line 53)
        pieCharts.donationByAllRole = {
            'Church Member': donations.filter(d => d.userId?.role === 'churchMember').reduce((sum, d) => sum + (d.paymentStatus === 'paid' ? d.amount : 0), 0),
            'External Member': donations.filter(d => d.userId?.role === 'externalMember').reduce((sum, d) => sum + (d.paymentStatus === 'paid' ? d.amount : 0), 0)
        };

        // Build Data
        const reportData = {
            pieCharts,
            summary: {
                donation: { collected: donationCollected, donors: uniqueDonors, average: avgDonation, topCampaign },
                merch: { totalOrders: orders.length, revenue: merchRevenue, completed: completedOrders, topProduct },
                user: { total: users.length, new: newUsers, verified: users.length, active: activeDonors }
            },
            donationTable: (format === 'excel' ? donations : donations.slice(-100)).map(d => [
                new Date(d.createdAt).toLocaleDateString(), // 0
                format === 'excel' ? (d.userId?.fullname || 'Guest') : (d.userId?.fullname || 'Guest').substring(0, 15), // 1
                format === 'excel' ? (d.userId?.email || 'N/A') : (d.userId?.email || 'N/A').substring(0, 15), // 2
                format === 'excel' ? (d.donationCampaignId?.title || 'General') : (d.donationCampaignId?.title || 'General').substring(0, 15), // 3
                format === 'excel' ? (d.amount || 0) : `Rs. ${d.amount}`, // 4
                d.receiptNo || 'N/A', // 5
                d._id.toString(), // 6
                d.paymentStatus // 7
            ]),
            merchTable: (format === 'excel' ? orders : orders.slice(-100)).map(o => [
                o._id.toString(), // 0
                format === 'excel' ? (o.userId?.fullname || 'Guest') : (o.userId?.fullname || 'Guest').substring(0, 10), // 1
                format === 'excel' ? o.items.map(i => i.itemId?.itemName).join(', ') : o.items.map(i => i.itemId?.itemName).join(', ').substring(0, 10), // 2
                format === 'excel' ? (o.items.reduce((sum, i) => sum + i.quantity, 0)) : (o.items.reduce((sum, i) => sum + i.quantity, 0).toString()), // 3
                format === 'excel' ? (o.totalAmount || 0) : `Rs. ${o.totalAmount}`, // 4
                o.status, // 5
                new Date(o.createdAt).toLocaleDateString(), // 6
                o.razorpayOrderId || 'N/A', // 7
                o.razorpayPaymentId || 'N/A' // 8
            ]),
            campaignTable: campaigns.map(c => [
                c.title || 'Untitled', // 0
                format === 'excel' ? (c.goalAmount || 0) : `Rs. ${c.goalAmount || 0}`, // 1
                format === 'excel' ? (c.collectedAmount || 0) : `Rs. ${c.collectedAmount || 0}`, // 2
                format === 'excel' ? (c.goalAmount ? (c.collectedAmount || 0) / c.goalAmount : 0) : (c.goalAmount ? `${(((c.collectedAmount || 0) / c.goalAmount) * 100).toFixed(1)}%` : 'N/A') // 3
            ]),
            userTable: (format === 'excel' ? users : users.slice(-100)).map(u => [
                format === 'excel' ? (u.fullname || '') : (u.fullname || '').substring(0, 15),
                format === 'excel' ? (u.email || '') : (u.email || '').substring(0, 15),
                u.phoneNo || 'N/A',
                u.gender || 'N/A',
                u.dob ? new Date(u.dob).toLocaleDateString() : 'N/A',
                u.address || 'N/A',
                new Date(u.createdAt).toLocaleDateString(),
                u.role || 'user',
                u.status || 'enabled',
                donations.filter(d => d.userId?._id?.toString() === u._id.toString()).length,
                orders.filter(o => o.userId?._id?.toString() === u._id.toString()).length
            ]),
            paymentTable: payments.map(p => [
                p.transactionNo,
                p.orderId?.userId?.fullname || 'N/A',
                p.orderId?.userId?.email || 'N/A',
                p.orderId?._id?.toString() || 'N/A',
                format === 'excel' ? (p.amount || 0) : `Rs. ${p.amount}`,
                p.method,
                new Date(p.paymentDate).toLocaleDateString(),
                p.status
            ]),
            analytics: {
                topMonth: Object.keys(merchCounts).length > 0 ?
                    new Date(0, selectedMonths[0] - 1 || new Date().getMonth()).toLocaleString('default', { month: 'long' }) :
                    new Date().toLocaleString('default', { month: 'long' }),
                popularCampaign: topCampaign,
                popularMerch: topProduct,
                verifiedPercent: users.length > 0 ?
                    `${((users.filter(u => u.status === 'enabled').length / users.length) * 100).toFixed(1)}%` :
                    "N/A",
                growth: "Calculated based on current period data"
            },
            period: (startDate && endDate)
                ? `${startDate} to ${endDate}`
                : (selectedMonths.length > 0
                    ? `${selectedMonths.map(m => new Date(0, m - 1).toLocaleString('default', { month: 'long' })).join(', ')} ${selectedYear}`
                    : (year ? `Year ${selectedYear}` : 'All Time')),
            notes: `Report generated on ${new Date().toLocaleDateString()}`
        };

        if (format === 'excel') {
            await generateExcelReport(reportData, res);
        } else {
            await generateAdminReport(reportData, res);
        }

    } catch (error) {
        console.error("Report gen error:", error);
        if (!res.headersSent) {
            res.status(500).json({ msg: "Internal Server Error during report generation." });
        }
    }
}

module.exports = {
    handleGenerateAdminReport
};
