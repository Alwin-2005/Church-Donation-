const donationC = require("../models/donationCampaign");

async function handleAddNewDonationCampaign(req,res){
    const {type, title, desc, goalAmt, startDate, endDate} = req.body;
    try{
        await donationC.create({
            type,
            title,
            desc,
            goalAmt,
            startDate,
            endDate,
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


module.exports = {
    handleAddNewDonationCampaign,
    handleGetAllDonationCampaignInfo,
};