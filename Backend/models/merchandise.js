const mongoose = require("mongoose");

const merchandiseSchema = mongoose.Schema({
    itemName: {
        type: String,
        required: true,
    },

    category: {
        type: String,
        required: true,
        enum: ['Books & Bibles', 'Apparel', 'Accessories', 'Home Decor', 'Stationery', 'Other'],
        default: 'Other',
    },

    price: {
        type: Number,
        required: true,
        min: 0,
    },

    stockQuantity: {
        type: Number,
        required: true,
        min: 0,
    },

    status: {
        type: String,
        enum: ['visible', 'hidden'],
        default: 'visible',
    },

    url: {
        type: String,
        required: true,
    },

    description: {
        type: String,
    },
},
    {
        timestamps: true,
    });

const merch = mongoose.model("Merchandise", merchandiseSchema);

module.exports = merch;