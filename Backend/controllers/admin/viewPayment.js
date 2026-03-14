const pay = require("../../models/payment");
const { buildPaymentReceipt } = require("../../utils/receiptGenerator");

async function handleGetAllPaymentInfo(req, res) {
    const result = await pay.find({}).populate({
        path: "orderId",
        populate: { path: "userId" }
    });
    return res.status(201).json({ result });
}

async function handleDownloadPaymentReceipt(req, res) {
    try {
        const { id } = req.params;
        const record = await pay.findById(id).populate({
            path: "orderId",
            populate: { path: "userId" }
        });

        if (!record) {
            return res.status(404).json({ message: "Payment not found" });
        }

        await buildPaymentReceipt(record, res);
    } catch (err) {
        console.error("Payment receipt error:", err);
        if (!res.headersSent) {
            res.status(500).json({ message: "Failed to generate receipt" });
        }
    }
}

module.exports = {
    handleGetAllPaymentInfo,
    handleDownloadPaymentReceipt,
};