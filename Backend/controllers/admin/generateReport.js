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
        const { months, year, startDate, endDate, format, focus } = req.query;
        const selectedMonths = months ? months.split(',').map(Number) : [];
        const selectedYear = year ? Number(year) : new Date().getFullYear();

        const buildFilter = (dateField) => {
            if (startDate && endDate) {
                const endD = new Date(endDate);
                if (endDate.length <= 10) endD.setUTCHours(23, 59, 59, 999);
                return {
                    [dateField]: {
                        $gte: new Date(startDate),
                        $lte: endD
                    }
                };
            } else if (selectedMonths.length > 0) {
                return {
                    [dateField]: {
                        $gte: new Date(`${selectedYear}-01-01T00:00:00.000Z`),
                        $lte: new Date(`${selectedYear}-12-31T23:59:59.999Z`)
                    },
                    $expr: {
                        $in: [{ $month: `$${dateField}` }, selectedMonths]
                    }
                };
            } else if (year) {
                return {
                    [dateField]: {
                        $gte: new Date(`${selectedYear}-01-01T00:00:00.000Z`),
                        $lte: new Date(`${selectedYear}-12-31T23:59:59.999Z`)
                    }
                };
            }
            return {};
        };

        const isFiltered = (startDate && endDate) || selectedMonths.length > 0 || year;
        const timeFilter = buildFilter('createdAt');
        const campaignFilter = buildFilter('startDate');

        // Fetch filtered data
        let users = [];
        let donations = [];
        let orders = [];
        let campaigns = [];
        let payments = [];

        if (!focus || focus === 'overview' || focus === 'users') {
            users = await User.find(isFiltered ? timeFilter : {});
            users = users.filter(u => u.role !== 'admin'); // Exclude admin
        }

        if (!focus || focus === 'overview' || focus === 'donations') {
            donations = await Donation.find(isFiltered ? timeFilter : {}).populate('userId donationCampaignId');
            donations = donations.filter(d => !d.donationCampaignId?.isTithe); // Exclude tithes
        }

        if (!focus || focus === 'overview' || focus === 'orders' || focus === 'sales') {
            orders = await Order.find(isFiltered ? timeFilter : {}).populate('userId items.itemId');
        }

        if (!focus || focus === 'overview' || focus === 'campaigns' || focus === 'donations') {
            campaigns = await DonationCampaign.find(isFiltered ? campaignFilter : {}); 
        }

        if (!focus || focus === 'overview' || focus === 'payments' || focus === 'sales') {
            payments = await Payment.find(isFiltered ? timeFilter : {}).populate({
                path: 'orderId',
                populate: { path: 'userId' }
            });
        }


        if (format === 'excel') {
            await generateExcelReport({
                donations,
                orders,
                payments,
                campaigns,
                users,
                focus
            }, res);
            return;
        }

        // 1. Summary
        const donationCollected = donations.reduce((sum, d) => sum + (d.paymentStatus === 'paid' ? d.amount : 0), 0);
        const uniqueDonors = new Set(donations.map(d => d.userId?._id?.toString())).size;
        const avgDonation = uniqueDonors > 0 ? donationCollected / uniqueDonors : 0;

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
            donationTable: donations.slice(-1000).map(d => [
                new Date(d.createdAt).toLocaleDateString(), // 0
                (d.userId?.fullname || 'Guest').substring(0, 15), // 1
                (d.userId?.email || 'N/A').substring(0, 15), // 2
                (d.donationCampaignId?.title || 'General').substring(0, 15), // 3
                `Rs. ${d.amount}`, // 4
                d.receiptNo || 'N/A', // 5
                d._id.toString(), // 6
                d.paymentStatus // 7
            ]),
            merchTable: orders.slice(-1000).map(o => [
                o._id.toString(), // 0
                (o.userId?.fullname || 'Guest').substring(0, 20), // 1
                o.items.map(i => `${i.itemId?.itemName || 'Unknown'}${i.quantity > 1 ? ` x${i.quantity}` : ''}`).join(', '), // 2 — full names
                (o.items.reduce((sum, i) => sum + i.quantity, 0).toString()), // 3
                `Rs. ${o.totalAmount}`, // 4
                o.status, // 5
                new Date(o.createdAt).toLocaleDateString(), // 6
                o.razorpayOrderId || 'N/A', // 7
                o.razorpayPaymentId || 'N/A' // 8
            ]),
            campaignTable: campaigns.map(c => [
                c.title || 'Untitled', // 0
                `Rs. ${c.goalAmount || 0}`, // 1
                `Rs. ${c.collectedAmount || 0}`, // 2
                (c.goalAmount ? `${(((c.collectedAmount || 0) / c.goalAmount) * 100).toFixed(1)}%` : 'N/A') // 3
            ]),
            userTable: users.slice(-1000).map(u => [
                (u.fullname || '').substring(0, 15),
                (u.email || '').substring(0, 15),
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
                `Rs. ${p.amount}`,
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

        if (focus === 'donations') {
            const { generateDetailedDonationReport } = require("../../utils/detailedReportGenerators");
            await generateDetailedDonationReport(reportData, res);
        } else if (focus === 'sales') {
            const { generateSalesRevenueReport } = require("../../utils/detailedReportGenerators");
            await generateSalesRevenueReport(reportData, res);
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
