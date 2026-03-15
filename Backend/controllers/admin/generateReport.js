const User = require("../../models/user");
const Donation = require("../../models/donation");
const Order = require("../../models/order");
const Merchandise = require("../../models/merchandise");
const DonationCampaign = require("../../models/donationCampaign");
const { generateAdminReport } = require("../../utils/reportGenerator");

async function handleGenerateAdminReport(req, res) {
    try {
        // Parse months from query (comma separated: e.g., ?months=3,4,5)
        const selectedMonths = req.query.months ? req.query.months.split(',').map(Number) : [];
        const currentYear = new Date().getFullYear();

        // Build filter object for time
        let timeFilter = {};
        if (selectedMonths.length > 0) {
            timeFilter = {
                $expr: {
                    $and: [
                        { $in: [{ $month: "$createdAt" }, selectedMonths] },
                        { $eq: [{ $year: "$createdAt" }, currentYear] } // Default to current year for simplicity
                    ]
                }
            };
        }

        // Fetch filtered data
        const users = await User.find(selectedMonths.length > 0 ? timeFilter : {});
        const donations = await Donation.find(selectedMonths.length > 0 ? timeFilter : {}).populate('userId donationCampaignId');
        const orders = await Order.find(selectedMonths.length > 0 ? timeFilter : {}).populate('userId items.itemId');
        const campaigns = await DonationCampaign.find({}); // Campaigns usually stay as is for tracking progress


        // 1. Summary
        const donationCollected = donations.reduce((sum, d) => sum + (d.paymentStatus === 'completed' ? d.amount : 0), 0);
        const uniqueDonors = new Set(donations.map(d => d.userId?._id?.toString())).size;
        const avgDonation = donations.length > 0 ? donationCollected / donations.length : 0;
        
        let topCampaign = "N/A";
        if (campaigns.length > 0) {
            topCampaign = campaigns.reduce((max, c) => c.raisedAmount > max.raisedAmount ? c : max).title;
        }

        const merchRevenue = orders.reduce((sum, o) => sum + (o.status === 'completed' || o.status === 'delivered' ? o.totalAmount : 0), 0);
        const pendingOrders = orders.filter(o => o.status === 'pending' || o.status === 'processing').length;
        const completedOrders = orders.filter(o => o.status === 'completed' || o.status === 'delivered').length;

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

        // Build Data
        const reportData = {
            summary: {
                donation: { collected: donationCollected, donors: uniqueDonors, average: avgDonation, topCampaign },
                merch: { totalOrders: orders.length, revenue: merchRevenue, pending: pendingOrders, completed: completedOrders, topProduct },
                user: { total: users.length, new: newUsers, verified: users.length, active: activeDonors }
            },
            donationTable: donations.slice(-100).map(d => [ 
                new Date(d.createdAt).toLocaleDateString(),
                (d.userId?.fullname || 'Guest').substring(0, 15),
                (d.userId?.email || 'N/A').substring(0, 15),
                (d.donationCampaignId?.title || 'General').substring(0, 15),
                d.paymentMethod || 'Online',
                `Rs. ${d.amount}`,
                d._id.toString().substring(0, 8),
                d.paymentStatus,
            ]),
            merchTable: orders.slice(-100).map(o => [
                o._id.toString().substring(0, 6),
                (o.userId?.fullname || 'Guest').substring(0, 10),
                o.items.map(i => i.itemId?.itemName).join(', ').substring(0, 10),
                o.items.reduce((sum, i) => sum + i.quantity, 0).toString(),
                "-",
                `Rs. ${o.totalAmount}`,
                o.paymentMethod || 'Online',
                o.status,
                new Date(o.createdAt).toLocaleDateString(),
            ]),
            campaignTable: campaigns.map(c => [
                c.title || 'Untitled',
                `Rs. ${c.goalAmount}`,
                `Rs. ${c.raisedAmount}`,
                "N/A", 
                `${((c.raisedAmount / c.goalAmount) * 100).toFixed(1)}%`
            ]),
            userTable: users.slice(-100).map(u => [
                (u.fullname || '').substring(0, 15),
                (u.email || '').substring(0, 15),
                new Date(u.createdAt).toLocaleDateString(),
                u.status || 'enabled',
                donations.filter(d => d.userId?._id?.toString() === u._id.toString()).length.toString(),
                orders.filter(o => o.userId?._id?.toString() === u._id.toString()).length.toString()
            ]),
            analytics: {
                topMonth: new Date().toLocaleString('default', { month: 'long' }),
                popularCampaign: topCampaign,
                popularMerch: topProduct,
                verifiedPercent: "100%",
                growth: "+10%"
            },
            period: selectedMonths.length > 0 
                ? selectedMonths.map(m => new Date(0, m - 1).toLocaleString('default', { month: 'long' })).join(', ') 
                : 'All Time',
            notes: `This report covers: ${selectedMonths.length > 0 ? selectedMonths.map(m => new Date(0, m - 1).toLocaleString('default', { month: 'long' })).join(', ') : 'All Time'}`
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
