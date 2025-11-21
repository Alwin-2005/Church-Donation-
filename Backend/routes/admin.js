const express = require("express");

const {handleGetAllUsersInfo, handleAddNewUsers,} = require("../controllers/manageUser");
const {handleGetAllOrdersInfo} = require("../controllers/manageOrder");
const {handleAddNewDonationCampaign,handleGetAllDonationCampaignInfo,} = require("../controllers/manageDonationCampaign");
const {handleAddNewMerchItem, handleGetAllMerchItems} = require("../controllers/manageMerch");
const {handleGetDonationInfo} = require("../controllers/viewDonation");
const {handleAddNewContent, handleViewAllContent} = require("../controllers/manageContent");
const {handleGetAllPaymentInfo} = require("../controllers/viewPayment");

const app = express();
const Router = express.Router();

Router.get("/users/view",handleGetAllUsersInfo);
Router.post("/users/add",handleAddNewUsers);

Router.get("/orders/view",handleGetAllOrdersInfo);

Router.post("/donationcampaign/add",handleAddNewDonationCampaign);
Router.get("/donationcampaign/view",handleGetAllDonationCampaignInfo);

Router.get("/donations/view",handleGetDonationInfo);

Router.post("/content/add",handleAddNewContent);
Router.get("/content/view",handleViewAllContent);

Router.post("/merch/add",handleAddNewMerchItem);
Router.get("/merch/view",handleGetAllMerchItems);

Router.get("/payment/view",handleGetAllPaymentInfo);

module.exports = Router;