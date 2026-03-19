const mongoose = require("mongoose");


const orderSchema = mongoose.Schema({
     userId: {
          type: mongoose.Schema.ObjectId,
          ref: "User",
          required: true,
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

     orderDate: {
          type: Date,
          required: true,
     },

     totalAmount: {
          type: Number,
          required: true,
     },

     status: {
          type: String,
          enum: ['paid', 'failed'],
          default: 'paid',
          required: true,
     },
     razorpayOrderId: {
          type: String,
     },
     razorpayPaymentId: {
          type: String,
     },

},
     {
          timestamps: true,
     });

const order = mongoose.model("Order", orderSchema);

module.exports = order;