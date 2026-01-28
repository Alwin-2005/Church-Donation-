const mongoose = require("mongoose");

const donationCampaignSchema = mongoose.Schema({
    donationType: {
        type: String,
        enum: ['internal','external'],
        required: true,
    },

    title: {
        type: String,
        required: true,
    },

    description: {
        type: String,
    },

    goalAmount: {
        type: Number,
        required: true,
    },

    collectedAmount: {
        type: Number,
        default: 0,
    },

    startDate: {
        type: Date,
        required: true,
    },

    endDate: {
        type: Date,
    },

    status:{
        type: String,
        enum: ['active','closed','paused'],
        default: 'active',
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },

},
{
    timestamps: true,
});

const donationCampaign = mongoose.model("DonationCampaign",donationCampaignSchema);

module.exports = donationCampaign;