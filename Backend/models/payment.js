const mongoose = require("mongoose");
const user = require("./user");
const merch = require("./merchandise");
const order = require("./order");

const paymentSchema = mongoose.Schema({
    orderId: {
        type: mongoose.Schema.ObjectId,
        refPath: order,
        required: true,
    },

    amount: {
        type: Number,
        required: true,
    },

    method: {
        enum: ['card','UPI','BankTransfer'],
    },

    paymentDate: {
        type: Date,
        required: true,
    },

    status: {
        enum: ['pending', 'failed', 'paid', 'refunded'],
    },

    transactionNo: {
        type: String,
        required: true,
        unique: true,
    },

},
{
    timestamps:true,
});

const payment = mongoose.model("Payment",paymentSchema);

module.exports = payment;