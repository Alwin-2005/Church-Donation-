const mongoose = require("mongoose");


const orderSchema = mongoose.Schema({
     userId: {
          type: mongoose.Schema.ObjectId,
          ref: "User",
          required: true,
     },

     itemId: {
          type: mongoose.Schema.ObjectId,
          ref: "Merchandise",
          required: true,
     },

     orderDate: {
          type: Date,
          required: true,
     },

     amount: {
          type: Number,
          required: true,
     },

     status: {
          type: String,
          enum: ['pending','confirmed','shipped','completed','cancelled'],
          required: true,
     },

},
{
    timestamps:true,
});

const order = mongoose.model("Order",orderSchema);

module.exports = order;