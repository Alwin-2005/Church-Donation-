const mongoose = require("mongoose");

const donationSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },

    donationCampaignId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "DonationCampaign",
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