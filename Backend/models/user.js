const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    fullname:{
        type: String,
        required: true,
    },

    email:{
        type: String,
        required: true,
        unique: true,
    },

    phoneNo:{
        type: String,
        unique: true,
    },

    gender:{
        enum: ['Male','Female','Other'],
    },

    dob:{
        type: Date,
    },

    address:{
        type: String,
    },

    role:{
        enum: ['admin','churchMember','externalMember'],
    },

    passwordHash:{
        type: String,
        required: true,
    },

    status:{
        enum: ['enabled','disabled'],
        
    },

},
{
    timestamps:true,
});

const User = mongoose.model("User",userSchema);

module.exports = User;