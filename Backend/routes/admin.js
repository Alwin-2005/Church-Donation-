const express = require("express");

//importing controller functions
const { handleGetAllUsersInfo, handleAddNewUsers, handleAddBulkUsers } = require("../controllers/admin/manageUser");
const { handleGetAllOrdersInfo, handleUpdateOrderStatus } = require("../controllers/admin/manageOrder");
const { handleAddNewDonationCampaign, handleGetAllDonationCampaignInfo, handleUpdateDonationCampaign } = require("../controllers/admin/manageDonationCampaign");
const { handleAddNewMerchItem, handleGetAllMerchItems, handleUpdateMerch } = require("../controllers/admin/manageMerch");
const { handleGetDonationInfo } = require("../controllers/admin/viewDonation");
const { handleAddNewContent, handleViewAllContent, handleUpdateContent } = require("../controllers/admin/manageContent");
const { handleGetAllPaymentInfo } = require("../controllers/admin/viewPayment");

const app = express();
const Router = express.Router();

//routes to view and add church member
Router.get("/users/view", handleGetAllUsersInfo);
Router.post("/users/add", handleAddNewUsers);
Router.post("/users/bulk", handleAddBulkUsers);


//routes to view and update order
Router.get("/orders/view", handleGetAllOrdersInfo);
Router.patch("/orders/update/:id", handleUpdateOrderStatus);


//routes to add, view and update donation campaigns
Router.post("/donationcampaigns/add", handleAddNewDonationCampaign);
Router.get("/donationcampaigns/view", handleGetAllDonationCampaignInfo);
Router.patch("/donationcampaigns/update/:id", handleUpdateDonationCampaign);


//routes to view donation 
Router.get("/donations/view", handleGetDonationInfo);


//routes to add, view and update content
Router.post("/content/add", handleAddNewContent);
Router.get("/content/view", handleViewAllContent);
Router.patch("/content/update/:id", handleUpdateContent);


//routes to add, view and update merchandise
Router.post("/merch/add", handleAddNewMerchItem);
Router.get("/merch/view", handleGetAllMerchItems);
Router.patch("/merch/update/:id", handleUpdateMerch);


//routes to view payment 
Router.get("/payments/view", handleGetAllPaymentInfo);

module.exports = Router;