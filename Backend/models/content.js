const mongoose = require("mongoose");
const user = require("./user");

const contentSchema = mongoose.Schema({
     title: {
          type: String,
          required: true,
     },

     body: {
          type: String,
          required: false,
     },

     type: {
          type: String,
          enum: ['event', 'notice', 'blog', 'other'],
          required: true,
          default: 'event',
     },

     date: {
          type: String, // "YYYY-MM-DD"
     },

     time: {
          type: String, // "HH:mm"
     },


     image: {
          type: String,
     },

     status: {
          type: String,
          enum: ['visible', 'hidden'],
          required: true,
          default: 'visible',
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

const content = mongoose.model("Content", contentSchema);

module.exports = content;