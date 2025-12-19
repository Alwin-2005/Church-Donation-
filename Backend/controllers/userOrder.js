const order = require("../models/order");
const mongoose = require("mongoose");

async function handleGetOrderById(req,res){
    const uid = new mongoose.Types.ObjectId(req.user._id);
    const Result = await order.find({userId: uid});
    return res.json({Result});
}

module.exports = {
    handleGetOrderById,
}