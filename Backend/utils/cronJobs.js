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
            { status: 'active', endDate: { $lt: now } },
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
                type: 'event', 
                status: 'visible', 
                $or: [
                    { date: { $lt: todayStr } },
                    { date: todayStr, time: { $lte: timeStr } }
                ]
            },
            { $set: { status: 'hidden' } }
        );
        
        if (eventResult.modifiedCount > 0) {
            console.log(`[CRON] Real-time precision hide triggered. Events hidden: ${eventResult.modifiedCount}`);
        }
    } catch (error) {
        console.error('[CRON] Error during minute-schedule event hide:', error);
    }
}

function startCronJobs() {
    // 1. Run once immediately on server start
    console.log('[CRON] Running initial startup sweep for expired data...');
    checkExpiredCampaigns();
    checkExpiredEvents();

    // 2. Schedule daily campaign end check (00:00 IST)
    cron.schedule('30 18 * * *', () => checkExpiredCampaigns());

    // 3. Schedule minute-level real-time event check
    cron.schedule('* * * * *', () => checkExpiredEvents());

    console.log('[CRON] Initialization complete: Schedules are active in the background.');
}

module.exports = {
    startCronJobs
};
