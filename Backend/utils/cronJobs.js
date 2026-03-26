const cron = require('node-cron');
const DonationCampaign = require('../models/donationCampaign');
const Content = require('../models/content');

// Helper: get today's date as "YYYY-MM-DD" in LOCAL server time
function getLocalDateStr() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

async function checkExpiredCampaigns() {
    try {
        const now = new Date();
        const campaignResult = await DonationCampaign.updateMany(
            { 
                status: { $in: ['active', 'paused'] }, 
                endDate: { $lt: now } 
            },
            { $set: { status: 'closed' } }
        );
        if(campaignResult.modifiedCount > 0) {
            console.log(`[CRON] Campaigns closed: ${campaignResult.modifiedCount}`);
        }
    } catch (error) {
        console.error('[CRON] Error during scheduled campaign job:', error);
    }
}

async function checkExpiredEvents() {
    try {
        const todayStr = getLocalDateStr();
        const now = new Date();
        const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

        const eventResult = await Content.updateMany(
            { 
                type: { $in: ['event', 'notice'] }, 
                status: 'visible', 
                $or: [
                    { date: { $lt: todayStr } },
                    { date: todayStr, time: { $lte: timeStr } }
                ]
            },
            { $set: { status: 'hidden' } }
        );
        
        if (eventResult.modifiedCount > 0) {
            console.log(`[CRON] Real-time precision hide. Announcements/Events hidden: ${eventResult.modifiedCount}`);
        }
    } catch (error) {
        console.error('[CRON] Error during minute-schedule event hide:', error);
    }
}

async function startCronJobs() {
    // 1. Run once immediately on server start
    console.log('[CRON] Initiating startup sweep for expired data...');
    try {
        await Promise.all([
            checkExpiredCampaigns(),
            checkExpiredEvents()
        ]);
        console.log('[CRON] Startup sweep completed successfully.');
    } catch (err) {
        console.error('[CRON] Critical error during startup sweep:', err);
    }

    // 2. Schedule regular checks (every minute) for "expired" campaigns and events
    cron.schedule('* * * * *', () => {
        checkExpiredCampaigns();
        checkExpiredEvents();
    });

    console.log('[CRON] Background schedules are now active.');
}

module.exports = {
    startCronJobs
};
