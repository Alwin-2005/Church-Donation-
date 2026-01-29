const donation = require("../models/donation");
const mongoose = require("mongoose");

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
};

async function handleGetUserDonations(req, res) {
    const uid = req.user._id;
    try {
        const result = await donation.find({ userId: uid }).populate('donationCampaignId', 'title organizer'); // Populating campaign details if needed
        return res.json({ result });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ msg: "Error fetching donations" });
    }
}