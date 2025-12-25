const user = require("../models/user");

async function handleGetUserInfo(req,res){
    const userId = req.user._id;
    const result = await user.find({_id: userId});
 
    const info = result.map(({fullname, email, phoneNo, gender, dob, address }) => ({
        fullname,
        email,
        phoneNo,
        gender,
        dob,
        address
        }));

    return res.json(info);
}

async function handleUpdateProfile(req,res){
    const Result = await user.findOneAndUpdate({
        _id: req.user._id,
    },
    {
        $set: req.body,
    },
    {
        new: true,
        runValidators: true,
    });

    return res.status(201).json({msg: "Updated Successfully"});
}

module.exports = {
    handleGetUserInfo,
    handleUpdateProfile,
}