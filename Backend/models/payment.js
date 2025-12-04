const mongoose = require("mongoose");

const paymentSchema = mongoose.Schema({
    orderId: {
        type: mongoose.Schema.ObjectId,
        ref: "Order",
        required: true,
    },

    amount: {
        type: Number,
        required: true,
    },

    method: {
        type: String,
        enum: ['card','UPI','BankTransfer'],
        required: true,
    },

    paymentDate: {
        type: Date,
        required: true,
    },

    status: {
        type: String,
        enum: ['pending', 'failed', 'paid', 'refunded'],
        required: true,
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