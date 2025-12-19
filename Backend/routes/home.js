const express = require("express");
const {handleGetExternalDonation} = require("../controllers/externalDonation");
const {handleGetMerchItemsForUsers} = require("../controllers/userMerch");
router = express.Router();

router.get("/donationcampaigns/view",handleGetExternalDonation);
router.get("/merchandise/view",handleGetMerchItemsForUsers);

module.exports = router;