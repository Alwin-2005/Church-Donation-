const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    fullname: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        required: true,
        unique: true,
    },

    phoneNo: {
        type: String,
        unique: true,
    },

    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        required: true,
    },

    dob: {
        type: Date,
    },

    address: {
        type: String,
    },

    role: {
        type: String,
        enum: ['admin', 'churchMember', 'externalMember'],
        required: true,
    },

    passwordHash: {
        type: String,
        required: true,
    },

    status: {
        type: String,
        enum: ['enabled', 'disabled'],
        required: true,
        default: 'enabled',
    },

    resetPasswordToken: {
        type: String,
    },
    resetPasswordExpires: {
        type: Date,
    },

},
    {
        timestamps: true,
    });

const User = mongoose.model("User", userSchema);

module.exports = User;