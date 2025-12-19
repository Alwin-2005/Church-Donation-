const express = require("express");
const {handleGetMerchItemsForUsers} = require("../controllers/userMerch");
const {handleGetOrderById} = require("../controllers/userOrder");
const {handleGetPaymentById} = require("../controllers/userPayment");
const {handleUserMakeDonation} = require("../controllers/userDonation");
const {handleAddToCart} = require("../controllers/userCart");
const Router = express.Router();

// todo view donationById, crud cart, view update profile, view content, make payment

Router.get("/merch/view",handleGetMerchItemsForUsers);
Router.get("/orders/view/",handleGetOrderById);
Router.get("/payements/view/",handleGetPaymentById);
//Router.get("/cart/view",);

Router.post("/donations/make/:campaignId",handleUserMakeDonation);
Router.post("/cart/add",handleAddToCart);
//Router.post("/orders/place");
//Router.post("/payment/make");

//Router.patch("/cart/update");
module.exports = Router;