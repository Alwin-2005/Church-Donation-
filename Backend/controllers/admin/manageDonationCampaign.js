const donationC = require("../../models/donationCampaign");
const mongoose = require("mongoose");


async function handleAddNewDonationCampaign(req, res) {
    const { type, ctitle, desc, goalAmt, startDate, endate, isTithe } = req.body;
    const userId = new mongoose.Types.ObjectId(req.user._id);
    try {
        const campaign = await donationC.create({
            donationType: type,
            title: ctitle,
            description: desc,
            goalAmount: isTithe ? 0 : goalAmt,
            startDate: startDate,
            endDate: endate,
            createdBy: userId,
            isTithe: isTithe || false,
        });
        return res.status(200).json({ msg: "Created successfully", Result: campaign });
    }

    catch (err) {
        console.log(err);
        return res.status(500).json({ msg: "Error creating campaign" });
    }
}

async function handleGetAllDonationCampaignInfo(req, res) {
    const Result = await donationC.find({});
    return res.status(200).json({ Result });
}

async function handleUpdateDonationCampaign(req, res) {
    const { type, ctitle, desc, goalAmt, startDate, endate, isTithe, status } = req.body;

    try {
        const updateData = {
            donationType: type,
            title: ctitle,
            description: desc,
            goalAmount: isTithe ? 0 : goalAmt,
            startDate: startDate,
            endDate: endate,
            isTithe: isTithe,
            status: status
        };

        const Result = await donationC.findOneAndUpdate({
            _id: req.params.id
        },
            {
                $set: updateData,
            },
            {
                new: true,
                runValidators: true,
            });

        return res.status(201).json({ Result });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: "Error updating campaign" });
    }
}

async function handleDeleteDonationCampaign(req, res) {
    try {
        const Result = await donationC.findByIdAndDelete(req.params.id);
        if (!Result) {
            return res.status(404).json({ msg: "Campaign not found" });
        }
        return res.status(200).json({ msg: "Deleted successfully" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: "Error deleting campaign" });
    }
}


module.exports = {
    handleAddNewDonationCampaign,
    handleGetAllDonationCampaignInfo,
    handleUpdateDonationCampaign,
    handleDeleteDonationCampaign,
};