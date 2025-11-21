const mongoose = require("mongoose");

const merchandiseSchema = mongoose.Schema({
    itemName: {
        type: String,
        required: true,
    },

    category: {
        type: String,
        required: true,
    },

    price: {
        type: Number,
        required: true,
    },

    stockQuantity: {
        type: Number,
        required: true,
    },

    status: {
        type: String,
        enum: ['visible','hidden'],
        default: 'visible',
    },

    description: {
        type: String,
    },
},
{
    timestamps:true,
});

const merch = mongoose.model("Merchandise",merchandiseSchema);

module.exports = merch;