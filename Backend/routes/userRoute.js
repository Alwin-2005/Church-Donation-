const express = require("express");
const {handleGetAllMerchItems} = require("../controllers/admin/manageMerch");
const {handleGetOrderById} = require("../controllers/userOrder");
const {handleGetPaymentById} = require("../controllers/userPayment");
const {handleUserMakeDonation} = require("../controllers/userDonation");
const Router = express.Router();

// todo view donationById, crud cart, view update profile, view content, make payment

Router.get("/merch/view",handleGetAllMerchItems);
Router.get("/orders/view/:userId",handleGetOrderById);
Router.get("/payements/view/:userId",handleGetPaymentById);


Router.post("/donations/make/:userId,:campaignId",handleUserMakeDonation);
//Router.get()

module.exports = Router;