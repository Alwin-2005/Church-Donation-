const payment = require("../models/payment");

async function handleGetPaymentById(req,res){
    const uid = new mongoose.Types.ObjectId(req.user._id);;
    console.log(uid);
    const result = await payment.findOne({userId: uid});
    return res.json({result});
}

module.exports = {
    handleGetPaymentById,
};