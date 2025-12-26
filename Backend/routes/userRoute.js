const express = require("express");
const {handleGetMerchItemsForUsers} = require("../controllers/userMerch");
const {handleGetOrderById,handlePlaceOrder,handleUpdateOrder} = require("../controllers/userOrder");
const {handleGetPaymentById} = require("../controllers/userPayment");
const {handleUserMakeDonation} = require("../controllers/userDonation");
const {handleAddToCart,handleGetCartInfo,handleUpdateCart} = require("../controllers/userCart");
const {handleGetAllContent} = require("../controllers/userContent");
const {handleGetUserInfo,handleUpdateProfile} = require("../controllers/userProfile");

const {handleMemberRole} = require("../middlewares/roleCheck");
const Router = express.Router();

// todo view donationById make payment


Router.get("/profile/view",handleGetUserInfo);
Router.get("/merch/view",handleGetMerchItemsForUsers);
Router.get("/orders/view",handleGetOrderById);
Router.get("/payements/view",handleGetPaymentById);
Router.get("/cart/view",handleGetCartInfo);
Router.get("/content/view",handleMemberRole,handleGetAllContent);

Router.post("/donations/make/:campaignId",handleUserMakeDonation);
Router.post("/cart/add",handleAddToCart);
Router.post("/orders/place",handlePlaceOrder);
//Router.post("/payment/make");

Router.patch("/cart/update",handleUpdateCart);
Router.patch("/profile/update",handleUpdateProfile);


module.exports = Router;