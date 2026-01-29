const Razorpay = require('razorpay');
const crypto = require('crypto');
const merch = require('../models/merchandise');
const Order = require('../models/order');
const Donation = require('../models/donation');
const DonationCampaign = require('../models/donationCampaign');
const Payment = require('../models/payment');
const User = require('../models/user');
const { handleClearCart } = require('./userCart');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// --- MERCHANDISE PAYMENTS ---

async function createMerchOrder(req, res) {
    const { items, totalAmount } = req.body;
    try {
        // 0. Check if user has an address
        const userData = await User.findById(req.user._id);
        if (!userData || !userData.address) {
            return res.status(400).json({ msg: "Please provide a delivery address in your profile before checking out." });
        }

        // 1. Check stock for each item
        for (const item of items) {
            const product = await merch.findById(item.itemId);
            if (!product || product.stockQuantity < item.quantity) {
                return res.status(400).json({ msg: `Insufficient stock for ${product ? product.itemName : 'item'}` });
            }
        }

        // 2. Create Razorpay Order
        const options = {
            amount: Math.round(totalAmount * 100), // amount in the smallest currency unit (paise for INR)
            currency: "INR",
            receipt: `merch_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);
        return res.status(200).json(order);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: "Error creating merchandise order", error: err.message });
    }
}

async function verifyMerchPayment(req, res) {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, items, totalAmount, userId } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest("hex");

    const isSignatureValid = expectedSignature === razorpay_signature;

    if (isSignatureValid) {
        try {
            // 1. Create Order record
            const newOrder = await Order.create({
                userId,
                items,
                totalAmount,
                orderDate: new Date(),
                status: 'confirmed'
            });

            // 2. Create Payment record
            await Payment.create({
                orderId: newOrder._id,
                amount: totalAmount,
                method: 'UPI', // Defaulting to UPI for now, can be dynamic
                paymentDate: new Date(),
                status: 'paid',
                transactionNo: razorpay_payment_id
            });

            // 3. Update stock quantity
            for (const item of items) {
                await merch.findByIdAndUpdate(item.itemId, {
                    $inc: { stockQuantity: -item.quantity }
                });
            }

            // 4. Clear Cart
            await handleClearCart(userId);

            return res.status(200).json({ msg: "Payment verified successfully", orderId: newOrder._id });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ msg: "Database error post-payment", error: err.message });
        }
    } else {
        return res.status(400).json({ msg: "Invalid signature" });
    }
}

// --- DONATION PAYMENTS ---

async function createDonationOrder(req, res) {
    const { amount, campaignId } = req.body;
    try {
        const options = {
            amount: Math.round(amount * 100),
            currency: "INR",
            receipt: `don_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);
        return res.status(200).json(order);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: "Error creating donation order", error: err.message });
    }
}

async function verifyDonationPayment(req, res) {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, amount, userId, campaignId } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest("hex");

    const isSignatureValid = expectedSignature === razorpay_signature;

    if (isSignatureValid) {
        try {
            // 1. Create Donation record
            await Donation.create({
                userId,
                donationCampaignId: campaignId,
                amount,
                paymentStatus: 'paid',
                receiptNo: razorpay_payment_id
            });

            // 2. Update campaign collection
            await DonationCampaign.findByIdAndUpdate(campaignId, {
                $inc: { collectedAmount: amount }
            });

            return res.status(200).json({ msg: "Donation successful" });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ msg: "Database error post-donation", error: err.message });
        }
    } else {
        return res.status(400).json({ msg: "Invalid signature" });
    }
}

module.exports = {
    createMerchOrder,
    verifyMerchPayment,
    createDonationOrder,
    verifyDonationPayment
};
