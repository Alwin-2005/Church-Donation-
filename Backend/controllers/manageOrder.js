const order = require("../models/order");

async function handleGetAllOrdersInfo(req,res){
    const Result = await order.find({});
    return res.status(201).json({Result});
}



module.exports = {
    handleGetAllOrdersInfo,
};
