const donation = require("../models/donation");
const mongoose = require("mongoose");

async function handleUserMakeDonation(req,res){
    const uid = new mongoose.Types.ObjectId(req.user._id);
    const cid = req.params.campaignId;
    const {type ,amt, status, receipt} = req.body;
    try{
        const result = await donation.create({
            donationType: type,
            userId: uid,
            donationCampaignId: cid,
            amount: amt,
            paymentStatus: status,
            receiptNo: receipt
        });
        return res.status(201).json({msg: "success"});
    }
    catch(err){console.log(err);
        return res.json({msg: "unsuccessfull"});
    }

}




module.exports = {
    handleUserMakeDonation,
};