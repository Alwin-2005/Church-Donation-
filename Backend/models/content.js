const mongoose = require("mongoose");
const user = require("./user");

const contentSchema = mongoose.Schema({
   title:{
        type: String,
        required: true,
   },

   body: {
        type: String,
        required: true,
   },

   type: {
        type: String,
   },

   status:{
          type: String,
          enum: ['visible','hidden'],
          required: true,
          default: 'visible',
   },

   createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: 'true',
        refPath: 'user',
    },


},
{
    timestamps:true,
});

const content = mongoose.model("Content",contentSchema);

module.exports = content;