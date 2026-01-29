const crypto = require("crypto");
const User = require("../models/user");
const sendEmail = require("../utils/email");
const bcrypt = require("bcrypt");

async function handleForgotPassword(req, res) {
    const { email } = req.body;

    try {
        // 1. Get user based on POSTed email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ msg: "There is no user with that email address." });
        }

        // 2. Generate the random reset token
        const resetToken = crypto.randomBytes(32).toString("hex");

        // 3. Hash the token and set it to user.resetPasswordToken field
        user.resetPasswordToken = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");

        // 4. Set expiry (e.g., 10 minutes)
        user.resetPasswordExpires = Date.now() + 10 * 60 * 1000;

        await user.save({ validateBeforeSave: false });

        // 5. Send it to user's email
        const resetURL = `http://localhost:5173/resetpassword/${resetToken}`;

        const message = `Forgot your password? Click here to reset: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

        try {
            await sendEmail({
                email: user.email,
                subject: "Your password reset token (valid for 10 min)",
                message,
            });

            res.status(200).json({
                status: "success",
                msg: "Token sent to email!",
            });
        } catch (err) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;
            await user.save({ validateBeforeSave: false });

            console.error("Email send failed:", err.message);

            // Fallback for development: Log the link to console
            return res.status(200).json({
                status: "success",
                msg: "Email service failed, but check server console for reset link (Dev Mode)",
                devLink: resetURL // Including in response for even easier testing
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Server error during forgot password process" });
    }
}

async function handleResetPassword(req, res) {
    try {
        // 1. Get user based on the token
        const hashedToken = crypto
            .createHash("sha256")
            .update(req.params.token)
            .digest("hex");

        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() },
        });

        // 2. If token has not expired, and there is user, set the new password
        if (!user) {
            return res.status(400).json({ msg: "Token is invalid or has expired" });
        }

        const { password } = req.body;
        if (!password) {
            return res.status(400).json({ msg: "Please provide a new password" });
        }

        // 3. Hash the new password
        const salt = await bcrypt.genSalt(10);
        user.passwordHash = await bcrypt.hash(password, salt);

        // 4. Clear reset fields
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        res.status(200).json({
            status: "success",
            msg: "Password updated successfully!",
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Server error during password reset" });
    }
}

module.exports = {
    handleForgotPassword,
    handleResetPassword,
};
