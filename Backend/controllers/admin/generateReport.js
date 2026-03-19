const User = require("../../models/user");
const Donation = require("../../models/donation");
const Order = require("../../models/order");
const Merchandise = require("../../models/merchandise");
const DonationCampaign = require("../../models/donationCampaign");
const { generateAdminReport } = require("../../utils/reportGenerator");

async function handleGenerateAdminReport(req, res) {
    try {
        const { months, year, startDate, endDate } = req.query;
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
        const campaigns = await DonationCampaign.find({}); // Campaigns usually stay as is for tracking progress


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

        // Count top selling merch
        let merchCounts = {};
        orders.forEach(o => {
            if (o.status !== 'cancelled') {
                o.items.forEach(i => {
                    const name = i.itemId?.itemName || 'Unknown Item';
                    merchCounts[name] = (merchCounts[name] || 0) + i.quantity;
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

        // Donut: User Types
        users.forEach(u => {
            const role = u.role || 'user';
            pieCharts.userTypes[role] = (pieCharts.userTypes[role] || 0) + 1;
        });

        // Donut: Merch Sales by Product
        Object.entries(merchCounts).forEach(([name, count]) => {
            pieCharts.merchSales[name] = count;
        });

        // Build Data
        const reportData = {
            pieCharts,
            summary: {
                donation: { collected: donationCollected, donors: uniqueDonors, average: avgDonation, topCampaign },
                merch: { totalOrders: orders.length, revenue: merchRevenue, completed: completedOrders, topProduct },
                user: { total: users.length, new: newUsers, verified: users.length, active: activeDonors }
            },
            donationTable: donations.slice(-100).map(d => [ 
                new Date(d.createdAt).toLocaleDateString(),
                (d.userId?.fullname || 'Guest').substring(0, 15),
                (d.userId?.email || 'N/A').substring(0, 15),
                (d.donationCampaignId?.title || 'General').substring(0, 15),
                `Rs. ${d.amount}`,
                d._id.toString().substring(0, 8),
                d.paymentStatus,
            ]),
            merchTable: orders.slice(-100).map(o => [
                o._id.toString().substring(0, 6),
                (o.userId?.fullname || 'Guest').substring(0, 10),
                o.items.map(i => i.itemId?.itemName).join(', ').substring(0, 10),
                o.items.reduce((sum, i) => sum + i.quantity, 0).toString(),
                `Rs. ${o.totalAmount}`,
                o.status,
                new Date(o.createdAt).toLocaleDateString(),
            ]),
            campaignTable: campaigns.map(c => [
                c.title || 'Untitled',
                `Rs. ${c.goalAmount || 0}`,
                `Rs. ${c.collectedAmount || 0}`,
                c.goalAmount ? `${(((c.collectedAmount || 0) / c.goalAmount) * 100).toFixed(1)}%` : 'N/A'
            ]),
            userTable: users.slice(-100).map(u => [
                (u.fullname || '').substring(0, 15),
                (u.email || '').substring(0, 15),
                new Date(u.createdAt).toLocaleDateString(),
                u.role || 'user',
                donations.filter(d => d.userId?._id?.toString() === u._id.toString()).length.toString(),
                orders.filter(o => o.userId?._id?.toString() === u._id.toString()).length.toString()
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

        await generateAdminReport(reportData, res);

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
