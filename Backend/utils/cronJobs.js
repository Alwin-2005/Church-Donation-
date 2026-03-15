const cron = require('node-cron');
const DonationCampaign = require('../models/donationCampaign');
const Content = require('../models/content');

// Helper: get today's date as "YYYY-MM-DD" in LOCAL server time
// IMPORTANT: Do NOT use toISOString() — it returns UTC, which is 5:30 hours
// behind IST. This would cause the wrong date to be compared at IST midnight.
function getLocalDateStr() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Scheduled to run every day at 00:00 IST = 18:30 UTC
function startCronJobs() {
    cron.schedule('30 18 * * *', async () => {
        try {
            const now = new Date();
            const todayStr = getLocalDateStr();

            // 1. Close expired donation campaigns
            console.log('[CRON] Checking for expired donation campaigns...');
            const campaignResult = await DonationCampaign.updateMany(
                { status: 'active', endDate: { $lt: now } },
                { $set: { status: 'closed' } }
            );
            console.log(`[CRON] Campaigns closed: ${campaignResult.modifiedCount}`);

            // 2. Hide expired events
            // Content.date is stored as a "YYYY-MM-DD" string.
            // Lexicographical string comparison works correctly for this format.
            console.log(`[CRON] Checking for expired events (today = ${todayStr})...`);
            const eventResult = await Content.updateMany(
                { type: 'event', status: 'visible', date: { $lt: todayStr } },
                { $set: { status: 'hidden' } }
            );
            console.log(`[CRON] Events hidden: ${eventResult.modifiedCount}`);

        } catch (error) {
            console.error('[CRON] Error during scheduled job:', error);
        }
    });

    console.log('[CRON] Jobs initialized. Runs daily at 00:00 IST (18:30 UTC).');
}

module.exports = {
    startCronJobs
};
