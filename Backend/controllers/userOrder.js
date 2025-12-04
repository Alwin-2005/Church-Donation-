const order = require("../models/order");
const mongoose = require("mongoose");

async function handleGetOrderById(req,res){
    const uid = req.params.userId;
    const Result = await order.find({userId: uid});
    return res.json({Result});
}

module.exports = {
    handleGetOrderById,
}