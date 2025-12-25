const order = require("../models/order");
const mongoose = require("mongoose");

async function handlePlaceOrder(req,res){
    const userId = req.user._id;
    const {itId,qt,pr,date,amt,state} = req.body;
    try{
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

    catch(err){console.log(err)}
}


async function handleGetOrderById(req,res){
    const Result = await order.find({userId: req.user._id});
    return res.json({Result});
}

async function handleUpdateOrder(req,res){

}

module.exports = {
    handlePlaceOrder,
    handleGetOrderById,
    handleUpdateOrder,
}