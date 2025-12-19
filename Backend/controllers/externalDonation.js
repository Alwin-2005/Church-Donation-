const dc = require("../models/donationCampaign");

async function handleGetExternalDonation(req,res){
    try{
        const result = await dc.find({donationType: "external"});
        return res.status(202).json(result);
    }
    catch(err){
        console.log(err);
        return res.json({msg: "Could not fetch records"});
    }
}

module.exports = {
    handleGetExternalDonation,
};