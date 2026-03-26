const express = require("express");

//importing controller functions
const { handleGetAllUsersInfo, handleAddNewUsers, handleAddBulkUsers, handleUpdateUserStatus } = require("../controllers/admin/manageUser");
const { handleGetAllOrdersInfo, handleUpdateOrderStatus, handleDownloadOrderReceipt } = require("../controllers/admin/manageOrder");
const { handleAddNewDonationCampaign, handleGetAllDonationCampaignInfo, handleUpdateDonationCampaign, handleDeleteDonationCampaign } = require("../controllers/admin/manageDonationCampaign");
const { handleAddNewMerchItem, handleGetAllMerchItems, handleUpdateMerch, handleDeleteMerch } = require("../controllers/admin/manageMerch");
const { handleGetDonationInfo, handleDownloadDonationReceipt } = require("../controllers/admin/viewDonation");
const { handleAddNewContent, handleViewAllContent, handleUpdateContent, handleDeleteContent } = require("../controllers/admin/manageContent");
const { handleGetAllPaymentInfo, handleDownloadPaymentReceipt } = require("../controllers/admin/viewPayment");
const { handleGenerateAdminReport } = require("../controllers/admin/generateReport");
const { handleGetDashboardStats } = require("../controllers/admin/dashboardController");

const app = express();
const Router = express.Router();

Router.get("/dashboard/stats", handleGetDashboardStats);

//routes to view and add church member
Router.get("/users/view", handleGetAllUsersInfo);
Router.post("/users/add", handleAddNewUsers);
Router.post("/users/bulk", handleAddBulkUsers);
Router.patch("/users/status/:id", handleUpdateUserStatus);


//routes to view and update order
Router.get("/orders/view", handleGetAllOrdersInfo);
Router.patch("/orders/update/:id", handleUpdateOrderStatus);
Router.get("/orders/:id/receipt", handleDownloadOrderReceipt);


//routes to add, view and update donation campaigns
Router.post("/donationcampaigns/add", handleAddNewDonationCampaign);
Router.get("/donationcampaigns/view", handleGetAllDonationCampaignInfo);
Router.patch("/donationcampaigns/update/:id", handleUpdateDonationCampaign);
Router.delete("/donationcampaigns/delete/:id", handleDeleteDonationCampaign);


//routes to view donation 
Router.get("/donations/view", handleGetDonationInfo);
Router.get("/donations/:id/receipt", handleDownloadDonationReceipt);


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
Router.get("/payments/:id/receipt", handleDownloadPaymentReceipt);

//route to download admin report
Router.get("/report/download", handleGenerateAdminReport);

module.exports = Router;