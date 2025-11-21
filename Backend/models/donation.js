const mongoose = require("mongoose");
const user = require("./user");

const donationSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'user',
    },
    
    amount: {
        type: Number,
        required: true,
    },

    paymentStatus: {
        type: String,
        enum: ['pending','paid','failed'],
        required: true,
    },

    receiptNo: {
        type: String,
        required: true,
    }
},
{
    timestamps:true,
});

const Donation = mongoose.model("Donation",donationSchema);

module.exports = Donation;