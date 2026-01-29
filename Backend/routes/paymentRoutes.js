const express = require('express');
const router = express.Router();
const {
    createMerchOrder,
    verifyMerchPayment,
    createDonationOrder,
    verifyDonationPayment
} = require('../controllers/paymentController');
const { restrictToLoggedinUserOnly } = require('../middlewares/auth');

// Merchandise Payment Routes
router.post('/merch/create-order', restrictToLoggedinUserOnly, createMerchOrder);
router.post('/merch/verify', restrictToLoggedinUserOnly, verifyMerchPayment);

// Donation Payment Routes
router.post('/donation/create-order', restrictToLoggedinUserOnly, createDonationOrder);
router.post('/donation/verify', restrictToLoggedinUserOnly, verifyDonationPayment);

module.exports = router;
