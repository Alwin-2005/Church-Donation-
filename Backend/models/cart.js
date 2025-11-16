const mongoose = require("mongoose");
const user = require("./user");
const merch = require("./merchandise");

const cartSchema = mongoose.Schema({
    userId:{
        type: mongoose.Schema.ObjectId,
        required: true,
        refPath: 'user',
    },

    itemId: {
        type: mongoose.Schema.ObjectId,
        required: true,
        refPath: 'merch',
    },

   status: {
        enum: ['active','checkedout'],
   },

   quantity: {
        type: Number,
        required: true,
   },

   price: {
        type: Number,
        required: true,
   },

   subTotal: {
        type: Number,
        required: true,
   },

},
{
    timestamps:true,
});

const cart = mongoose.model("Cart",cartSchema);

module.exports = cart;