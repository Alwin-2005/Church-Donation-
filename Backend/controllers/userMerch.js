const merch = require("../models/merchandise");

async function handleGetMerchItemsForUsers(req,res){
    try{
        const result = await merch.find({status: 'visible'});
        return res.status(201).json(result);
    }

    catch(err){
        console.log(err)
        return res.status(400).json({msg: "no items available"});
    }
    
}

module.exports = {
    handleGetMerchItemsForUsers,
};