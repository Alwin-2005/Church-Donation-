const cart = require("../models/cart");
const merch = require("../models/merchandise");
const mongoose = require("mongoose");

async function handleAddToCart(req,res){
    const {itId,q,pr,totalp} = req.body;
    const userCart = await cart.findOne({userId: req.user._id});
    if(!userCart){
        const result = await cart.create({
            userId: req.user._id,
            status: "active",
        });
        return res.json({msg: "cart created",result});
    }
 
    return res.json({msg: "Cart exists"});
    
}

async function handleGetCartInfo(req,res){
    const result = await cart.findOne({userId: req.user._id});
    return res.status(201).json(result);
}


async function handleUpdateCart(req,res){
    const Result = await cart.findOneAndUpdate({
        _id: req.user._id,
    },
    {
        $set: req.body,
    },
    {
        new: true,
        runValidators: true,
    });

    return res.status(201).json({msg: "Updated Successfully"});
}

module.exports = {
    handleAddToCart,
    handleGetCartInfo,
    handleUpdateCart,
};

