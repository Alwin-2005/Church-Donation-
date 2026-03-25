const User = require("../models/user");
const validator = require("validator");
const bcrypt = require("bcrypt");
const sendEmail = require("../utils/email");

const phoneRegex = /^[6-9]\d{9}$/;
const role = "externalMember";
const status = "enabled";

// In-memory OTP store: { email -> { otp, expiry, formData } }
const otpStore = new Map();

// Generate a 6-digit OTP
function generateOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendOtp(req, res) {
    const { fullName, email, phoneNo, gender, dob, password, address } = req.body;

    // Basic validation
    if (!validator.isEmail(email)) {
        return res.status(400).json({ message: "Invalid email format" });
    }
    if (!phoneRegex.test(phoneNo)) {
        return res.status(400).json({ message: "Invalid phone number" });
    }

    // Check for duplicates
    const emailExist = await User.findOne({ email });
    if (emailExist) {
        return res.status(409).json({ message: "Email already exists, do you want to login?" });
    }

    const phoneExist = await User.findOne({ phoneNo });
    if (phoneExist) {
        return res.status(409).json({ message: "Phone number already exists" });
    }

    // Generate OTP and store it for 5 minutes
    const otp = generateOtp();
    const expiry = Date.now() + 5 * 60 * 1000; // 5 minutes

    otpStore.set(email, {
        otp,
        expiry,
        formData: { fullName, email, phoneNo, gender, dob, password, address },
    });

    const message = `Your OTP for Church Donation registration is: ${otp}\n\nThis code will expire in 5 minutes.\n\nIf you did not request this, please ignore this email.`;

    try {
        await sendEmail({
            email,
            subject: "Your OTP for Registration",
            message,
        });

        return res.status(200).json({ message: "OTP sent to your email. Please verify." });
    } catch (err) {
        console.error("Failed to send OTP email:", err.message);
        otpStore.delete(email);
        return res.status(500).json({ message: "Failed to send OTP email. Please try again." });
    }
}

async function verifyOtpAndRegister(req, res) {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).json({ message: "Email and OTP are required" });
    }

    const record = otpStore.get(email);

    if (!record) {
        return res.status(400).json({ message: "No OTP request found for this email. Please try again." });
    }

    if (Date.now() > record.expiry) {
        otpStore.delete(email);
        return res.status(400).json({ message: "OTP has expired. Please request a new one." });
    }

    if (record.otp !== otp.toString().trim()) {
        return res.status(400).json({ message: "Invalid OTP. Please try again." });
    }

    // OTP correct — create user
    const { fullName, phoneNo, gender, dob, password, address } = record.formData;

    try {
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(password, salt);

        await User.create({
            fullname: fullName,
            email,
            phoneNo,
            gender,
            dob,
            address,
            role,
            passwordHash: hashed,
            status,
        });

        otpStore.delete(email); // Clean up OTP
        return res.status(201).json({ message: "Account created successfully!" });
    } catch (err) {
        console.error(err);
        return res.status(400).json({ message: err.message });
    }
}

module.exports = { sendOtp, verifyOtpAndRegister };
