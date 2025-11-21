const mongoose = require("mongoose");
const user = require("./user");
const merch = require("./merchandise");

const orderSchema = mongoose.Schema({
     userId: {
          type: mongoose.Schema.ObjectId,
          refPath: user,
          required: true,
     },

     itemId: {
          type: mongoose.Schema.ObjectId,
          refPath: merch,
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