const mongoose = require("mongoose");
const user = require("./user");

const donationCampaignSchema = mongoose.Schema({
    donationType: {
        enum: ['internal','external'],
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
        default: "0",
    },

    collectedAmount: {
        type: Number,
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
        refPath: 'user',
    },

},
{
    timestamps: true,
});

const donationCampaign = mongoose.model("DonationCampaign",donationCampaignSchema);

module.exports = donationCampaign;