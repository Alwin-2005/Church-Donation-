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
               required: true,
               ref: "Merchandise",
          },

          quantity: {
               type: Number,
               required: true,
          },

          price: {
               type: Number,
               required: true,
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
        required: true,
   },

   totalPrice: {
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