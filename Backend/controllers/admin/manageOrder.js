const order = require("../../models/order");
const mongoose = require("mongoose");
const { buildOrderReceipt } = require("../../utils/receiptGenerator");

async function handleGetAllOrdersInfo(req, res) {
    const Result = await order.find({}).populate("userId");
    return res.status(201).json({ Result });
}

async function handleUpdateOrderStatus(req, res) {
    const id = new mongoose.Types.ObjectId(req.params.id);
    const state = req.body;
    const Result = await order.findOneAndUpdate(
        { _id: id },
        { $set: state },
        {
            new: true,
            runValidators: true,
        });
    return res.status(201).json({ Result });
}


async function handleDownloadOrderReceipt(req, res) {
    const { id } = req.params;
    try {
        const _order = await order.findById(id)
            .populate('items.itemId', 'itemName category')
            .populate('userId', 'fullname email');

        if (!_order) {
            return res.status(404).json({ msg: "Order not found" });
        }

        await buildOrderReceipt(_order, res);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: "Error generating receipt document" });
    }
}

module.exports = {
    handleGetAllOrdersInfo,
    handleUpdateOrderStatus,
    handleDownloadOrderReceipt,
};
