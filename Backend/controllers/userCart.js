const cart = require("../models/cart");
const merch = require("../models/merchandise");
const mongoose = require("mongoose");

async function handleAddToCart(req,res){
    console.log(req.user._id);
    //const item = merch.findOne({_id: "69319f4fbbe48a5f6d602df0"});
    //const price = item;
   
    //console.log(item,price);
    
    //const uid = new mongoose.Types(req.user._id);
    //console.log(mongoose.isValidObjectId(uid));

    
}

module.exports = {
    handleAddToCart,

};

