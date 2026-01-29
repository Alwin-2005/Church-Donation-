const express = require("express");

//importing controller functions
const { handleGetAllUsersInfo, handleAddNewUsers, handleAddBulkUsers } = require("../controllers/admin/manageUser");
const { handleGetAllOrdersInfo, handleUpdateOrderStatus } = require("../controllers/admin/manageOrder");
const { handleAddNewDonationCampaign, handleGetAllDonationCampaignInfo, handleUpdateDonationCampaign, handleDeleteDonationCampaign } = require("../controllers/admin/manageDonationCampaign");
const { handleAddNewMerchItem, handleGetAllMerchItems, handleUpdateMerch, handleDeleteMerch } = require("../controllers/admin/manageMerch");
const { handleGetDonationInfo } = require("../controllers/admin/viewDonation");
const { handleAddNewContent, handleViewAllContent, handleUpdateContent, handleDeleteContent } = require("../controllers/admin/manageContent");
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
Router.delete("/donationcampaigns/delete/:id", handleDeleteDonationCampaign);


//routes to view donation 
Router.get("/donations/view", handleGetDonationInfo);


//routes to add, view and update content
Router.post("/content/add", handleAddNewContent);
Router.get("/content/view", handleViewAllContent);
Router.patch("/content/update/:id", handleUpdateContent);
Router.delete("/content/delete/:id", handleDeleteContent);


//routes to add, view, update and delete merchandise
Router.post("/merch/add", handleAddNewMerchItem);
Router.get("/merch/view", handleGetAllMerchItems);
Router.patch("/merch/update/:id", handleUpdateMerch);
Router.delete("/merch/delete/:id", handleDeleteMerch);


//routes to view payment 
Router.get("/payments/view", handleGetAllPaymentInfo);

module.exports = Router;