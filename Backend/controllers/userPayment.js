const payment = require("../models/payment");

async function handleGetPaymentById(req,res){
    const result = await payment.findOne({userId: req.user._id});
    return res.json({result});
}

async function handleMakePayment(req,res){
    try{
        const result = await payment.create({

        });
    }
    catch(err){console.log(err)}
}

async function handleUpdatePayment(req,res){

}

module.exports = {
    handleMakePayment,
    handleGetPaymentById,
    handleUpdatePayment,
};