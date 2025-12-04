const merch = require("../../models/merchandise");
const mongoose = require("mongoose");

async function handleAddNewMerchItem(req,res){
    const {name, cat, pr, stock, desc} = req.body;
    //const userId = new mongoose.Types.ObjectId(req.user._id);
    try{
        await merch.create({
            itemName: name,
            category: cat,
            price: pr,
            stockQuantity: stock,
            description: desc,
        });
        return res.status(201).json({msg: "success"});
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

async function handleUpdateMerch(req,res){
    const Result = await merch.findOneAndUpdate({
        _id: req.params.id
    },
    {
        $set: req.body,
    },
    {
        new: true,
        runValidators: true,
    });

    return res.status(201).json({Result});
}

module.exports = {
    handleAddNewMerchItem,
    handleGetAllMerchItems,
    handleUpdateMerch,
};