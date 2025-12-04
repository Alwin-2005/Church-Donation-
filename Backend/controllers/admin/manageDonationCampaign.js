const donationC = require("../../models/donationCampaign");
const mongoose = require("mongoose");


async function handleAddNewDonationCampaign(req,res){
    const {type, ctitle, desc, goalAmt, startDate, endate} = req.body;
    const userId = new mongoose.Types.ObjectId(req.user._id);
    try{
        await donationC.create({
            donationType: type,
            title: ctitle,
            description: desc,
            goalAmount: goalAmt,
            startDate: startDate,
            endDate: endate,
            createdBy: userId,
        });
        return res.status(201).json("msg: created successfully");
    }

    catch(err){
        console.log(err);
        return res.json({msg: "error"});
    }
}

async function handleGetAllDonationCampaignInfo(req,res){
    const Result = await donationC.find({});
    return res.status(201).json({Result});
}

async function handleUpdateDonationCampaign(req,res){
    const Result = await donationC.findOneAndUpdate({
        _id: req.params.id
    },
    {
        $set: req.body,
    },
    {
        new: true,
        runValidators: true,
    });

    return res.status(201).json({Result});
}


module.exports = {
    handleAddNewDonationCampaign,
    handleGetAllDonationCampaignInfo,
    handleUpdateDonationCampaign,
};