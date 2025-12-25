const cart = require("../models/cart");
const merch = require("../models/merchandise");
const mongoose = require("mongoose");
const {handleGetUserRole} = require("../services/getRole");

async function handleAddToCart(req,res){
    const role = handleGetUserRole(req.user);
    const temp = 0
    const {merchId} = req.body;
    const userCart = await cart.findOne({userId: req.user._id});

    if(!userCart){
        const result = await cart.create({
            userId: req.user._id,
            items: [
                {
                    itemId: merchId,
                    quantity: temp,
                    price: temp
                }
            ],
            quantity: temp,
            status: "active",
            totalPrice: temp,
            subTotal: temp 
        });
    }
 
    return res.json({msg: "success"});
    
}

async function handleGetCartInfo(req,res){
    const result = await cart.findOne({userId: req.user._id});
    return res.status(201).json(result);
}


async function handleUpdateCart(req,res){

}

module.exports = {
    handleAddToCart,
    handleGetCartInfo,
    handleUpdateCart,
};

