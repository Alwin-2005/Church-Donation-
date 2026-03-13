const donation = require("../models/donation");
const mongoose = require("mongoose");
const { buildDonationReceipt } = require("../utils/receiptGenerator");

async function handleUserMakeDonation(req, res) {
    const uid = new mongoose.Types.ObjectId(req.user._id);
    const cid = req.params.campaignId;
    const { type, amt, status, receipt } = req.body;
    try {
        const result = await donation.create({
            donationType: type,
            userId: uid,
            donationCampaignId: cid,
            amount: amt,
            paymentStatus: status,
            receiptNo: receipt
        });
        return res.status(201).json({ msg: "success" });
    }
    catch (err) {
        console.log(err);
        return res.json({ msg: "unsuccessfull" });
    }

}




module.exports = {
    handleUserMakeDonation,
    handleGetUserDonations,
    handleDownloadDonationReceipt
};

async function handleDownloadDonationReceipt(req, res) {
    const { id } = req.params;
    try {
        const _donation = await donation.findOne({ _id: id, userId: req.user._id })
            .populate('donationCampaignId', 'title')
            .populate('userId', 'fullname email');

        if (!_donation) {
            return res.status(404).json({ msg: "Donation not found" });
        }

        await buildDonationReceipt(_donation, res);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: "Error generating receipt document" });
    }
}

async function handleGetUserDonations(req, res) {
    const uid = req.user._id;
    try {
        const result = await donation.find({ userId: uid }).populate('donationCampaignId', 'title donationType status'); // Populating campaign details
        return res.json({ result });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ msg: "Error fetching donations" });
    }
}