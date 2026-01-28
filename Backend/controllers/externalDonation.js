const dc = require("../models/donationCampaign");

async function handleGetExternalDonation(req,res){
    try{
        const Result = await dc.find({donationType: "external"});
        return res.status(202).json({Result});
    }
    catch(err){
        console.log(err);
        return res.json({msg: "Could not fetch records"});
    }
}

async function handleGetInternaDonation(req,res){
    try{
        const Result = await dc.find({donationType: "internal"});
        return res.status(202).json({Result});
    }
    catch(err){
        console.log(err);
        return res.json({msg: "Could not fetch records"});
    }
}

const handleGetDonationCampaignById = async (req, res) => {
  try {
    const { campaignId } = req.params;
    const Result = await dc.findById(campaignId);
    console.log(Result);    
    if (!Result) {
      return res.status(404).json({
        success: false,
        message: "Donation campaign not found"
      });
    }

    return res.status(200).json({
      Result
    });

  } catch (error) {
    console.error("Error fetching donation campaign:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch donation campaign"
    });
  }
};

module.exports = {
    handleGetExternalDonation,
    handleGetDonationCampaignById,
    handleGetInternaDonation,
};