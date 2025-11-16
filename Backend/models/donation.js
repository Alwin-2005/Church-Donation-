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
        enum: ['pending','paid','failed'],
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