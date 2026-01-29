const pay = require("../../models/payment");

async function handleGetAllPaymentInfo(req, res) {
    const result = await pay.find({}).populate({
        path: "orderId",
        populate: { path: "userId" }
    });
    return res.status(201).json({ result });
}

module.exports = {
    handleGetAllPaymentInfo,
};