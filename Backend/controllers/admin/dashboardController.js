const User = require("../../models/user");
const Donation = require("../../models/donation");
const DonationCampaign = require("../../models/donationCampaign");

const handleGetDashboardStats = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const dateFilter = {};
        if (startDate && endDate) {
            dateFilter.createdAt = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        // 1. Campaign Performance
        const campaigns = await DonationCampaign.find();
        const campaignData = campaigns.map(c => ({
            name: c.title,
            goal: c.goalAmount,
            collected: c.collectedAmount,
            percent: c.goalAmount > 0 ? Math.min(100, Math.round((c.collectedAmount / c.goalAmount) * 100)) : 0
        }));

        // 2. Monthly Donations Trend (Grouped by month/year)
        // For simplicity, we'll aggregate all paid donations in the range
        const donations = await Donation.find({ 
            paymentStatus: 'paid',
            ...dateFilter 
        }).sort({ createdAt: 1 });

        const trendMap = {};
        donations.forEach(d => {
            const date = new Date(d.createdAt);
            const monthYear = date.toLocaleString('default', { month: 'short', year: '2-digit' });
            trendMap[monthYear] = (trendMap[monthYear] || 0) + d.amount;
        });

        const donationTrend = Object.keys(trendMap).map(key => ({
            month: key,
            amount: trendMap[key]
        }));

        // 3. User Growth (Cumulative registered users over time)
        const users = await User.find({ 
            role: { $ne: 'admin' },
            ...dateFilter 
        }).sort({ createdAt: 1 });

        let cumulativeCount = 0;
        const userGrowth = users.map(u => {
            cumulativeCount++;
            return {
                date: new Date(u.createdAt).toLocaleDateString(),
                count: cumulativeCount
            };
        });

        // 4. Category Distribution
        // Sum donations by role
        const paidDonations = await Donation.find({ paymentStatus: 'paid', ...dateFilter }).populate('userId');
        
        let internalDonations = 0;
        let externalDonations = 0;
        
        paidDonations.forEach(d => {
            if (d.userId && d.userId.role === 'churchMember') {
                internalDonations += d.amount;
            } else {
                externalDonations += d.amount;
            }
        });

        // Overall stats for convenience
        const stats = {
            totalUsers: await User.countDocuments({ role: { $ne: 'admin' } }),
            totalDonations: internalDonations + externalDonations,
            activeCampaigns: await DonationCampaign.countDocuments({ status: 'active' })
        };

        const distribution = [
            { name: 'Internal Donations', value: internalDonations, color: '#10B981' }, // Green
            { name: 'External Donations', value: externalDonations, color: '#F59E0B' }  // Yellow/Orange
        ];

        res.status(200).json({
            campaignData,
            donationTrend,
            distribution,
            stats
        });

    } catch (err) {
        console.error("Dashboard Stats Error:", err);
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    handleGetDashboardStats
};
