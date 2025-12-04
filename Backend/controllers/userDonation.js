const donation = require("../models/donation");

async function handleUserMakeDonation(req,res){
    const uid = req.params.userId;
    const cid = req.params.campaignId;
    const {amt, status, receipt} = req.body;
    try{
        const result = await donation.create({
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