const content = require("../models/content");

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

module.exports = {
    handleAddNewContent,
    handleViewAllContent,
};