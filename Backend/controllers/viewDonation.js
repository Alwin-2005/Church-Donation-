const donation = require("../models/donation");
async function handleGetDonationInfo(req,res){
    const result = await donation.find({});
    return res.status(201).json(result);
}

module.exports = {
    handleGetDonationInfo,
};