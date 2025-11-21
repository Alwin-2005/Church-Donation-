const merch = require("../models/merchandise");

async function handleAddNewMerchItem(req,res){
    const {} = req.body;
    try{
        await merch.create({

        });
    }

    catch(err){
        console.log(err);
        return res.json("msg: Record not created");
    }
}

async function handleGetAllMerchItems(req,res){
    const result = await merch.find({});
    return res.status(201).json({result});
}

module.exports = {
    handleAddNewMerchItem,
    handleGetAllMerchItems,
};