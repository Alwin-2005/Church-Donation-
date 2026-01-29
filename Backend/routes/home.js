const express = require("express");
const { handleGetExternalDonation } = require("../controllers/externalDonation");
const { handleGetMerchItemsForUsers } = require("../controllers/userMerch");
const { handleViewAllContent } = require("../controllers/admin/manageContent");
const router = express.Router();

router.get("/donationcampaigns/view", handleGetExternalDonation);
router.get("/merchandise/view", handleGetMerchItemsForUsers);
router.get("/content/view", handleViewAllContent);

module.exports = router;