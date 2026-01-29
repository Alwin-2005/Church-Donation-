const user = require("../models/user");
const bcrypt = require("bcrypt");

async function handleGetUserInfo(req, res) {
    const userId = req.user._id;
    const result = await user.find({ _id: userId });

    const info = result.map(({ fullname, email, phoneNo, gender, dob, address, role }) => ({
        fullname,
        email,
        phoneNo,
        gender,
        dob,
        address,
        role
    }));

    return res.json(info);
}

async function handleUpdateProfile(req, res) {
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

    return res.status(201).json({ msg: "Updated Successfully" });
}

async function handleChangePassword(req, res) {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user._id;

    try {
        const foundUser = await user.findById(userId);
        if (!foundUser) return res.status(404).json({ msg: "User not found" });

        const isMatch = await bcrypt.compare(currentPassword, foundUser.passwordHash);
        if (!isMatch) return res.status(400).json({ msg: "Incorrect current password" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        foundUser.passwordHash = hashedPassword;
        await foundUser.save();

        return res.status(200).json({ msg: "Password changed successfully" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: "Server error during password change" });
    }
}

module.exports = {
    handleGetUserInfo,
    handleUpdateProfile,
    handleChangePassword,
}