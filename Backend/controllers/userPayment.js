const payment = require("../models/payment");

async function handleGetPaymentById(req,res){
    const uid = req.params.uid;
    console.log(uid);
    const result = await payment.findOne({userId: uid});
    return res.json({result});
}

module.exports = {
    handleGetPaymentById,
};