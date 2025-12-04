const order = require("../../models/order");
const mongoose = require("mongoose");

async function handleGetAllOrdersInfo(req,res){
    const Result = await order.find({});
    return res.status(201).json({Result});
}

async function handleUpdateOrderStatus(req,res){
    const id = new mongoose.Types.ObjectId(req.params.id);
    const state = req.body;
    const Result = await order.findOneAndUpdate(
        { _id: id },
        { $set: state },
        { new: true,
            runValidators: true,
        }); 
    return res.status(201).json({Result});
}


module.exports = {
    handleGetAllOrdersInfo,
    handleUpdateOrderStatus,
};
