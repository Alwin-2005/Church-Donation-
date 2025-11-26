const content = require("../../models/content");

async function handleAddNewContent(req,res){
    const {title, body, type, status, createdBy} = req.body;
    try{
        await content.create({
            title,
            body,
            type,
            status,
            createdBy,
        });
        return res.status(201).json("msg: Created successfully");
    }

    catch(err){
        console.log(err)
        return res.json("msg: Error adding content");
    }
}

async function handleViewAllContent(req,res){
    const result = await content.find({});
    return res.status(201).json({result});
}

async function handleUpdateContent(req,res){
    const Result = await content.findOneAndUpdate({
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
    handleAddNewContent,
    handleViewAllContent,
    handleUpdateContent,
};