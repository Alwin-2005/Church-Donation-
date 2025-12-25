const content = require("../models/content");

async function handleGetAllContent(req,res){
    const result = await content.find({});
    return res.json(result);
}

module.exports = {
    handleGetAllContent,
}