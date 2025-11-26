const merch = require("../../models/merchandise");

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