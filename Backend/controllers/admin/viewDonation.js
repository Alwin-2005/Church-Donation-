const donation = require("../../models/donation");
const { buildDonationReceipt } = require("../../utils/receiptGenerator");

async function handleGetDonationInfo(req, res) {
    const result = await donation.find({}).populate("userId").populate("donationCampaignId");
    return res.status(201).json(result);
}

async function handleDownloadDonationReceipt(req, res) {
    try {
        const { id } = req.params;
        const record = await donation
            .findById(id)
            .populate("userId")
            .populate("donationCampaignId");

        if (!record) {
            return res.status(404).json({ message: "Donation not found" });
        }

        await buildDonationReceipt(record, res);
    } catch (err) {
        console.error("Receipt generation error:", err);
        if (!res.headersSent) {
            res.status(500).json({ message: "Failed to generate receipt" });
        }
    }
}

module.exports = {
    handleGetDonationInfo,
    handleDownloadDonationReceipt,
};