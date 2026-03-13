const order = require("../models/order");
const mongoose = require("mongoose");
const { buildOrderReceipt } = require("../utils/receiptGenerator");

async function handlePlaceOrder(req, res) {
    const userId = req.user._id;
    const { itId, qt, pr, date, amt, state } = req.body;
    try {
        const result = await order.create({
            userId: userId,
            items: [
                {
                    itemId: itId,
                    quantity: qt,
                    price: pr,
                },

            ],
            orderAmount: date,
            totalAmount: amt,
            status: state

        });

    }

    catch (err) { console.log(err) }
}


async function handleGetOrderById(req, res) {
    const Result = await order.find({ userId: req.user._id }).populate('items.itemId', 'itemName url category');
    return res.json({ Result });
}

async function handleUpdateOrder(req, res) {

}

async function handleDownloadOrderReceipt(req, res) {
    const { id } = req.params;
    try {
        const _order = await order.findOne({ _id: id, userId: req.user._id })
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
    handlePlaceOrder,
    handleGetOrderById,
    handleUpdateOrder,
    handleDownloadOrderReceipt
}