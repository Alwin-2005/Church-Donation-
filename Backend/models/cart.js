const mongoose = require("mongoose");
const user = require("./user");
const merch = require("./merchandise");

const cartSchema = mongoose.Schema({
    userId:{
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: "User",
    },
    items: [
     {
          itemId: {
               type: mongoose.Schema.ObjectId,
               ref: "Merchandise",
          },

          quantity: {
               type: Number,
          },

          price: {
               type: Number,
          }
     }
    ],
    

   status: {
        type: String,
        enum: ['active','checkedout'],
        required: true,
   },

   quantity: {
        type: Number,
   },

   totalPrice: {
        type: Number,
   },

   subTotal: {
        type: Number,
   },

},
{
    timestamps:true,
});

const cart = mongoose.model("Cart",cartSchema);

module.exports = cart;